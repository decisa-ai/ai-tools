#!/usr/bin/env node
// Validates every SKILL.md has a well-formed YAML frontmatter block with the
// required keys. Zero dependencies (no YAML lib) — a structural check, paired
// with skill-parity.mjs for tool-reference correctness.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = join(root, 'plugins/decisa/skills');
const REQUIRED = ['name', 'description'];

function findSkillFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...findSkillFiles(p));
    else if (entry === 'SKILL.md') out.push(p);
  }
  return out;
}

const files = findSkillFiles(skillsDir).sort();
let failures = 0;

for (const file of files) {
  const rel = file.slice(root.length + 1);
  const text = readFileSync(file, 'utf8');
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) {
    console.error(`✗ ${rel}: missing or malformed frontmatter block`);
    failures++;
    continue;
  }
  const block = m[1];
  const missing = REQUIRED.filter((k) => !new RegExp(`^${k}:\\s*\\S`, 'm').test(block));
  if (missing.length) {
    console.error(`✗ ${rel}: frontmatter missing key(s): ${missing.join(', ')}`);
    failures++;
    continue;
  }
  console.log(`✓ ${rel}`);
}

if (failures > 0) {
  console.error(`\nFrontmatter check FAILED for ${failures} file(s).`);
  process.exit(1);
}
console.log(`Frontmatter OK — ${files.length} skills.`);
