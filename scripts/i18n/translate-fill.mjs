#!/usr/bin/env node
/**
 * Fills in TODO_TRANSLATE placeholders in translations.ts by calling the
 * DeepL Free API. Run this after extract-and-apply.mjs --apply.
 *
 * Usage:
 *   node scripts/i18n/translate-fill.mjs
 */

import { Project, SyntaxKind } from "ts-morph";
import fs from "fs";
import path from "path";

// Manually parse .env.local if present so no extra package installation is required
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf8");
  for (const line of envConfig.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const [key, ...values] = trimmed.split("=");
      if (key && values.length > 0) {
        const val = values
          .join("=")
          .replace(/^["']|["']$/g, "")
          .trim();
        process.env[key.trim()] = val;
      }
    }
  }
}

const API_KEY = process.env.DEEPL_API_KEY;
if (!API_KEY) {
  console.error("Set DEEPL_API_KEY in .env.local or your environment first.");
  process.exit(1);
}

// DeepL API Free uses api-free.deepl.com, Pro uses api.deepl.com
const DEEPL_ENDPOINT =
  API_KEY.endsWith(":fx") ?
    "https://api-free.deepl.com/v2/translate"
  : "https://api.deepl.com/v2/translate";

const project = new Project({ tsConfigFilePath: "tsconfig.json" });
const file = project.addSourceFileAtPath("src/lib/i18n/translations.ts");
const varDecl = file.getVariableDeclarationOrThrow("translations");
const objLit = varDecl.getInitializerIfKindOrThrow(
  SyntaxKind.ObjectLiteralExpression,
);

// DeepL Target Language Codes (FR: French, PT-BR: Portuguese Brazilian)
const langCodes = { fr: "FR", pt: "PT-BR" };

for (const [langKey, deeplTargetLang] of Object.entries(langCodes)) {
  const langProp =
    objLit.getProperty(`"${langKey}"`) ?? objLit.getProperty(langKey);
  if (!langProp) {
    console.warn(`No "${langKey}" block found — skipping.`);
    continue;
  }
  const langObj = langProp.getInitializerIfKindOrThrow(
    SyntaxKind.ObjectLiteralExpression,
  );

  const todos = langObj.getProperties().filter((p) => {
    const init = p.getInitializer?.();
    return init && init.getText().includes("TODO_TRANSLATE:");
  });

  if (todos.length === 0) {
    console.log(`No pending strings for ${langKey}.`);
    continue;
  }

  const batch = todos.map((p) => {
    const raw = JSON.parse(p.getInitializer().getText());
    return raw.replace("TODO_TRANSLATE: ", "");
  });

  // Batch in chunks of 50 strings
  const chunkSize = 50;
  for (let i = 0; i < batch.length; i += chunkSize) {
    const chunk = batch.slice(i, i + chunkSize);
    const chunkProps = todos.slice(i, i + chunkSize);

    const res = await fetch(DEEPL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: chunk,
        target_lang: deeplTargetLang,
        preserve_formatting: true,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(
        `DeepL API error (${res.status}) translating chunk starting at ${i}:`,
        errText,
      );
      continue;
    }

    const data = await res.json();
    const translationsList = data.translations ?? [];

    chunkProps.forEach((p, idx) => {
      const value = translationsList[idx]?.text;
      if (typeof value === "string") {
        p.setInitializer(JSON.stringify(value));
      }
    });

    console.log(
      `Translated ${chunk.length} strings into ${deeplTargetLang} (batch starting at ${i}).`,
    );
  }
}

project.saveSync();
console.log(
  "Done. Review src/lib/i18n/translations.ts before committing — machine translation needs a human pass.",
);
