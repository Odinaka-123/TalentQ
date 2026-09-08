#!/usr/bin/env node
import { Project, SyntaxKind } from "ts-morph";

const project = new Project({ tsConfigFilePath: "tsconfig.json" });
const file = project.addSourceFileAtPath("src/lib/i18n/translations.ts");
const varDecl = file.getVariableDeclarationOrThrow("translations");
const objLit = varDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

const entries = [
  ["app_freelancer_components_top_bar.good_morning", "Good morning"],
  ["app_freelancer_components_top_bar.good_afternoon", "Good afternoon"],
  ["app_freelancer_components_top_bar.good_night", "Good evening"],
  ["app_employer_components_top_bar.good_morning", "Good morning"],
  ["app_employer_components_top_bar.good_afternoon", "Good afternoon"],
  ["app_employer_components_top_bar.good_night", "Good evening"],
];

const langs = { "en-GB": true, "en-US": true, fr: false, pt: false };

for (const [langKey, useOriginal] of Object.entries(langs)) {
  const langProp = objLit.getProperty(`"${langKey}"`) ?? objLit.getProperty(langKey);
  if (!langProp) {
    console.warn(`Could not find "${langKey}" block — skipping.`);
    continue;
  }
  const langObj = langProp.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);
  const existing = new Set(langObj.getProperties().map((p) => p.getName?.()));

  let added = 0;
  for (const [key, text] of entries) {
    const propName = `"${key}"`;
    if (existing.has(propName)) continue;
    const value = useOriginal ? text : `TODO_TRANSLATE: ${text}`;
    langObj.addPropertyAssignment({ name: propName, initializer: JSON.stringify(value) });
    existing.add(propName);
    added++;
  }
  console.log(`${langKey}: added ${added} key(s).`);
}

project.saveSync();
console.log("Done. Run translate-fill.mjs next.");
