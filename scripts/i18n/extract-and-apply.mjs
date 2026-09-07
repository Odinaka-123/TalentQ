#!/usr/bin/env node
/**
 * i18n codemod
 * -----------
 * Scans .tsx files for hardcoded JSX text, and (with --apply) rewrites them
 * to use t("namespace.key") + adds the keys to src/lib/i18n/translations.ts.
 *
 * Usage:
 *   node scripts/i18n/extract-and-apply.mjs                 # dry run, writes a report
 *   node scripts/i18n/extract-and-apply.mjs --apply          # rewrites files + translations.ts
 *
 * Requires: npm i -D ts-morph
 *
 * IMPORTANT: this is a starting point, not a guaranteed-correct tool.
 * Always run the dry run first, read the report, run --apply on a branch,
 * and review the full `git diff` before committing. It only handles plain
 * JSX text children (e.g. <p>Notifications</p>) — it does NOT touch:
 *   - text inside string attributes (alt="...", placeholder="...", title="...")
 *   - template literals / interpolated strings (`Welcome, ${name}`)
 *   - text built from .map() / conditional expressions
 * Those need manual wiring, the same way we did AppearanceTab by hand.
 */

import { Project, SyntaxKind } from "ts-morph";
import path from "node:path";
import fs from "node:fs";

const APPLY = process.argv.includes("--apply");

// Adjust these globs to match where your components actually live.
const TARGET_GLOBS = ["src/app/**/*.tsx", "src/components/**/*.tsx"];

// Files already wired by hand — don't touch them again.
const EXCLUDE = [
  /node_modules/,
  /\.next/,
  /components[\\/]settings[\\/]AppearanceTab\.tsx$/,
  /settings[\\/]components[\\/]AppearanceTab\.tsx$/,
];

const project = new Project({ tsConfigFilePath: "tsconfig.json" });
project.addSourceFilesAtPaths(TARGET_GLOBS);

function slug(text) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 40) || "text"
  );
}

function namespaceFor(filePath) {
  // Use the FULL relative path, not just the filename — files like
  // "page.tsx" or duplicated freelancer/employer components would
  // otherwise collide into the same namespace (e.g. two different
  // "page.tsx" both producing namespace "page").
  const rel = path.relative(process.cwd(), filePath).replace(/\\/g, "/");
  const noExt = rel.replace(/\.tsx?$/, "");
  return noExt
    .replace(/^src\//, "")
    .replace(/[()[\]]/g, "") // strip route-group parens/brackets
    .split("/")
    .filter(Boolean)
    .map((seg) => seg.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase())
    .join("_");
}

function decodeEntities(text) {
  // JSX text often has &apos; / &amp; etc. literally in source (required by
  // the react/no-unescaped-entities lint rule for raw JSX text). Once this
  // moves into a t("...") JS string, that escaping is unnecessary and would
  // otherwise get fed to translation as literal garbage characters.
  return text
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&ldquo;/g, "\u201C")
    .replace(/&rdquo;/g, "\u201D")
    .replace(/&lsquo;/g, "\u2018")
    .replace(/&rsquo;/g, "\u2019")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function isTranslatableText(text) {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (trimmed.length < 2) return false;
  if (!/[a-zA-Z]/.test(trimmed)) return false; // skip pure punctuation/numbers
  return true;
}

// Guards against two DIFFERENT strings ever landing on the same key —
// whether that's two files that happen to slug the same, or two different
// strings in the SAME file that slug the same (e.g. "AI Insight" and
// "AI INSIGHT" both slugging to "ai_insight"). Same key + same text is
// fine (dedup); same key + different text gets a numeric suffix instead
// of silently overwriting.
const globalKeyText = new Map();
function uniqueKey(baseKey, text) {
  let key = baseKey;
  let n = 2;
  while (globalKeyText.has(key) && globalKeyText.get(key) !== text) {
    key = `${baseKey}_${n++}`;
  }
  globalKeyText.set(key, text);
  return key;
}

// Real-world codebases often use short variable names in callbacks —
// .map((t) => ...) for "testimonial", "transaction", "ticket", etc. If we
// blindly insert t("key") into JSX that's inside such a scope, "t" refers
// to that local variable instead of our translate function, and the build
// breaks ("This expression is not callable"). So: walk from the text node
// up to its enclosing component, and if ANY function scope in between
// declares a parameter or variable named "t", skip that specific
// replacement rather than risk breaking the build. It's left as plain
// text for manual wiring (rename the local var, or destructure the hook
// under an alias: `const { t: translate } = useLanguage()`).
function findEnclosingComponent(node, componentFns) {
  for (const fn of componentFns) {
    if (node.getStart() >= fn.getStart() && node.getEnd() <= fn.getEnd()) {
      return fn;
    }
  }
  return null;
}

function isShadowedByLocalT(node, componentFn) {
  let current = node.getParent();
  while (current && current !== componentFn) {
    const kind = current.getKind();
    if (
      kind === SyntaxKind.ArrowFunction ||
      kind === SyntaxKind.FunctionExpression ||
      kind === SyntaxKind.FunctionDeclaration
    ) {
      const params = current.getParameters?.() ?? [];
      for (const p of params) {
        // covers plain `(t) =>`; destructured/renamed params are rare
        // enough here that we conservatively skip on any "t"-ish name too
        if (p.getName?.() === "t") return true;
      }
    }
    if (kind === SyntaxKind.VariableDeclaration) {
      if (current.getName?.() === "t") return true;
    }
    current = current.getParent();
  }
  return false;
}

const report = [];

for (const sourceFile of project.getSourceFiles()) {
  const filePath = sourceFile.getFilePath();
  if (EXCLUDE.some((re) => re.test(filePath))) continue;

  const ns = namespaceFor(filePath);
  const replacements = [];

  sourceFile.forEachDescendant((node) => {
    if (node.getKind() !== SyntaxKind.JsxText) return;
    const raw = decodeEntities(node.getText());
    const trimmed = raw.trim().replace(/\s+/g, " ");
    if (!isTranslatableText(trimmed)) return;
    const key = uniqueKey(`${ns}.${slug(trimmed)}`, trimmed);
    replacements.push({ node, text: trimmed, key });
  });

  if (replacements.length === 0) continue;

  report.push({
    file: path.relative(process.cwd(), filePath),
    items: replacements.map((r) => ({ key: r.key, text: r.text })),
  });

  if (!APPLY) continue;

  // Server Components (no "use client" directive) can't call hooks at all.
  // Rather than guess whether it's safe to add the directive automatically
  // (a Server Component doing data fetching would break if force-converted
  // to a Client Component), skip the whole file and flag it for a manual
  // decision.
  const hasUseClientDirective = sourceFile
    .getStatements()
    .some(
      (s) =>
        s.getKind() === SyntaxKind.ExpressionStatement &&
        /^["']use client["'];?$/.test(s.getText().trim()),
    );

  if (!hasUseClientDirective) {
    const reportEntry = report.find(
      (f) => f.file === path.relative(process.cwd(), filePath),
    );
    if (reportEntry) {
      reportEntry.skippedWholeFile =
        'Server Component (no "use client" directive) — useLanguage() cannot be called here. Add "use client" by hand if this component has no server-only work, then re-run.';
    }
    continue;
  }

  // Find capitalized top-level function/arrow-function components FIRST —
  // needed before we can check for "t" shadowing per replacement.
  const componentFns = [];
  sourceFile.forEachDescendant((node) => {
    if (node.getKind() === SyntaxKind.FunctionDeclaration) {
      const name = node.getName();
      if (name && /^[A-Z]/.test(name)) componentFns.push(node);
    }
    if (node.getKind() === SyntaxKind.VariableDeclaration) {
      const name = node.getName();
      const init = node.getInitializer();
      if (
        name &&
        /^[A-Z]/.test(name) &&
        init &&
        (init.getKind() === SyntaxKind.ArrowFunction ||
          init.getKind() === SyntaxKind.FunctionExpression)
      ) {
        componentFns.push(init);
      }
    }
  });

  // Split into safe-to-apply vs. shadowed-by-a-local-"t" (left untouched).
  const applied = [];
  const skipped = [];
  for (const r of replacements) {
    const enclosing = findEnclosingComponent(r.node, componentFns);
    if (enclosing && isShadowedByLocalT(r.node, enclosing)) {
      skipped.push(r);
    } else {
      applied.push(r);
    }
  }

  if (applied.length === 0) continue;

  // Ensure the import exists — but insert it AFTER any leading directive
  // prologue ("use client" / "use server"), since Next.js requires that
  // directive to be the literal first statement in the file.
  const hasImport = sourceFile
    .getImportDeclarations()
    .some((d) => d.getModuleSpecifierValue() === "@/lib/i18n/LanguageContext");
  if (!hasImport) {
    const statements = sourceFile.getStatements();
    let insertIndex = 0;
    while (
      insertIndex < statements.length &&
      statements[insertIndex].getKind() === SyntaxKind.ExpressionStatement &&
      /^["'](use client|use server|use strict)["'];?$/.test(
        statements[insertIndex].getText().trim(),
      )
    ) {
      insertIndex++;
    }
    sourceFile.insertImportDeclaration(insertIndex, {
      moduleSpecifier: "@/lib/i18n/LanguageContext",
      namedImports: ["useLanguage"],
    });
  }

  for (const fn of componentFns) {
    const body = fn.getBody();
    if (!body || body.getKind() !== SyntaxKind.Block) continue;
    if (body.getText().includes("useLanguage()")) continue;

    const containsReplacement = applied.some(
      (r) => r.node.getStart() >= fn.getStart() && r.node.getEnd() <= fn.getEnd(),
    );
    if (!containsReplacement) continue;

    body.insertStatements(0, "const { t } = useLanguage();");
  }

  // Replace text nodes back-to-front so positions stay valid.
  for (const r of [...applied].sort((a, b) => b.node.getStart() - a.node.getStart())) {
    r.node.replaceWithText(`{t("${r.key}")}`);
  }

  if (skipped.length > 0) {
    const reportEntry = report.find(
      (f) => f.file === path.relative(process.cwd(), filePath),
    );
    if (reportEntry) {
      reportEntry.skipped = skipped.map((r) => ({
        key: r.key,
        text: r.text,
        reason: 'shadowed by a local variable named "t" in this scope',
      }));
    }
  }
}

fs.writeFileSync("i18n-extraction-report.json", JSON.stringify(report, null, 2));

const totalKeys = report.reduce((sum, f) => sum + f.items.length, 0);
console.log(`Found ${totalKeys} translatable strings across ${report.length} files.`);
console.log("Report written to i18n-extraction-report.json — review it.");

if (APPLY) {
  const translationsFile = project.getSourceFileOrThrow("src/lib/i18n/translations.ts");
  const varDecl = translationsFile.getVariableDeclarationOrThrow("translations");
  const objLit = varDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  // true = seed with the original English text, false = mark for translation
  const langs = { "en-GB": true, "en-US": true, fr: false, pt: false };

  // Only keys that were ACTUALLY applied to source (excludes skipped/shadowed).
  const skippedKeys = new Set(
    report.flatMap((f) => (f.skipped ?? []).map((s) => s.key)),
  );
  const allItems = report
    .flatMap((f) => f.items)
    .filter((item) => !skippedKeys.has(item.key));

  for (const [langKey, useOriginal] of Object.entries(langs)) {
    const langProp = objLit.getProperty(`"${langKey}"`) ?? objLit.getProperty(langKey);
    if (!langProp) {
      console.warn(`Could not find "${langKey}" block in translations.ts — skipping.`);
      continue;
    }
    const langObj = langProp.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
    const existing = new Set(langObj.getProperties().map((p) => p.getName?.()));

    for (const item of allItems) {
      const propName = `"${item.key}"`;
      if (existing.has(propName)) continue;
      const value = useOriginal ? item.text : `TODO_TRANSLATE: ${item.text}`;
      langObj.addPropertyAssignment({ name: propName, initializer: JSON.stringify(value) });
      existing.add(propName);
    }
  }

  project.saveSync();

  const totalSkipped = report.reduce((sum, f) => sum + (f.skipped?.length ?? 0), 0);
  console.log("Rewrote source files and added keys to translations.ts (fr/pt marked TODO_TRANSLATE).");
  if (totalSkipped > 0) {
    console.log(
      `\n${totalSkipped} strings were left UNTRANSLATED because a local variable named "t" shadows the translate function in that scope:`,
    );
    for (const f of report) {
      if (!f.skipped?.length) continue;
      console.log(`  ${f.file}`);
      for (const s of f.skipped) console.log(`    - "${s.text}"`);
    }
    console.log(
      "  Fix by renaming the local variable (e.g. `t` -> `item`) or aliasing the hook: const { t: translate } = useLanguage();\n  then wire those manually the same way AppearanceTab was done.",
    );
  }
  console.log("Next: run `node scripts/i18n/translate-fill.mjs` to auto-translate the TODO entries.");
} else {
  console.log("Dry run only. Re-run with --apply once the report looks right.");
}
