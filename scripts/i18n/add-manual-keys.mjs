#!/usr/bin/env node
/**
 * One-time addition of keys the extraction script can't reach (array/object
 * literal values and JSX string attributes — Sidebar nav labels,
 * EmployerShell PAGE_TITLES, PageHeader props). Mirrors extract-and-apply.mjs's
 * own approach: en-GB/en-US get the original text, fr/pt get TODO_TRANSLATE
 * so translate-fill.mjs can pick them up afterward.
 *
 * Usage: node scripts/i18n/add-manual-keys.mjs
 */

import { Project, SyntaxKind } from "ts-morph";

const project = new Project({ tsConfigFilePath: "tsconfig.json" });
const file = project.addSourceFileAtPath("src/lib/i18n/translations.ts");
const varDecl = file.getVariableDeclarationOrThrow("translations");
const objLit = varDecl.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

const entries = [
  // Employer sidebar
  ["app_employer_components_sidebar.dashboard", "Dashboard"],
  ["app_employer_components_sidebar.post_a_job", "Post a job"],
  ["app_employer_components_sidebar.find_talent", "Find Talent"],
  ["app_employer_components_sidebar.candidates", "Candidates"],
  ["app_employer_components_sidebar.messages", "Messages"],
  ["app_employer_components_sidebar.analytics", "Analytics"],
  ["app_employer_components_sidebar.payments", "Payments"],
  ["app_employer_components_sidebar.verification", "Verification"],
  ["app_employer_components_sidebar.settings", "Settings"],
  ["app_employer_components_sidebar.help_support", "Help & Support"],

  // Freelancer sidebar
  ["app_freelancer_components_sidebar.dashboard", "Dashboard"],
  ["app_freelancer_components_sidebar.find_jobs", "Find Jobs"],
  ["app_freelancer_components_sidebar.messages", "Messages"],
  ["app_freelancer_components_sidebar.analytics", "Analytics"],
  ["app_freelancer_components_sidebar.payments", "Payments"],
  ["app_freelancer_components_sidebar.verification", "Verification"],
  ["app_freelancer_components_sidebar.settings", "Settings"],
  ["app_freelancer_components_sidebar.help_support", "Help & Support"],

  // Employer shell (PAGE_TITLES + PageHeader props)
  ["app_employer_components_employer_shell.post_a_job", "Post a Job"],
  ["app_employer_components_employer_shell.find_talent", "Find Talent"],
  ["app_employer_components_employer_shell.candidates", "Candidates"],
  ["app_employer_components_employer_shell.profile", "Profile"],
  ["app_employer_components_employer_shell.analytics", "Analytics"],
  ["app_employer_components_employer_shell.payments", "Payments"],
  ["app_employer_components_employer_shell.verification", "Verification"],
  ["app_employer_components_employer_shell.settings", "Settings"],
  ["app_employer_components_employer_shell.help_support", "Help & Support"],
  ["app_employer_components_employer_shell.messages", "Messages"],
  ["app_employer_components_employer_shell.active", "Active"],
];

const langs = { "en-GB": true, "en-US": true, fr: false, pt: false };

for (const [langKey, useOriginal] of Object.entries(langs)) {
  const langProp = objLit.getProperty(`"${langKey}"`) ?? objLit.getProperty(langKey);
  if (!langProp) {
    console.warn(`Could not find "${langKey}" block in translations.ts — skipping.`);
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
  console.log(`${langKey}: added ${added} key(s), skipped ${entries.length - added} existing.`);
}

project.saveSync();
console.log("Done. Run `node scripts/i18n/translate-fill.mjs` next to fill in fr/pt.");
