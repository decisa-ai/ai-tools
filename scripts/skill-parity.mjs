#!/usr/bin/env node
// Skill ↔ tool-surface parity check (decisa-api AGENTS.md Rule 27).
//
// Fails when a SKILL.md references — in backticks — a snake_case identifier
// that is NOT a registered tool (tool-manifest.json) and NOT a known non-tool
// term (skill-nontool-allow.txt). That is exactly the rot Rule 27 guards: a
// tool renamed/removed in decisa-api leaves a dangling reference here, silently
// misdirecting every agent that loaded the skill.
//
// The manifest is regenerated in decisa-api with `php artisan ai:tools-manifest`
// and vendored here in the companion PR. When this check flags a token:
//   - tool was renamed/removed  -> fix the SKILL.md (and refresh the manifest);
//   - it is a legit non-tool word -> add it to skill-nontool-allow.txt.
//
// Zero dependencies — runs on a bare Node.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = join(root, 'plugins/decisa/tool-manifest.json');
const allowPath = join(root, 'scripts/skill-nontool-allow.txt');
const skillsDir = join(root, 'plugins/decisa/skills');

const tools = new Set(JSON.parse(readFileSync(manifestPath, 'utf8')).tools.map((t) => t.name));

const allow = new Set(
  readFileSync(allowPath, 'utf8')
    .split('\n')
    .map((l) => l.replace(/#.*$/, '').trim())
    .filter(Boolean),
);

// Walk for SKILL.md files.
function findSkillFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) out.push(...findSkillFiles(p));
    else if (entry === 'SKILL.md') out.push(p);
  }
  return out;
}

// snake_case identifier: lowercase start, then [a-z0-9_], at least one underscore-
// or multi-char word. Tokens with '.', ':', '/', spaces, or caps are excluded by
// the backtick extraction + this shape, so plugin.json / mcp:read / camelCase pass.
const IDENT = /^[a-z][a-z0-9_]*$/;

const files = findSkillFiles(skillsDir).sort();
let unknownTotal = 0;
let refTotal = 0;
const referenced = new Set();

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const backticked = [...text.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
  const unknown = [];
  for (const tok of backticked) {
    if (!IDENT.test(tok)) continue; // not an identifier-shaped token
    if (tools.has(tok)) {
      refTotal++;
      referenced.add(tok);
      continue;
    }
    if (allow.has(tok)) continue;
    unknown.push(tok);
  }
  if (unknown.length) {
    unknownTotal += unknown.length;
    const rel = file.slice(root.length + 1);
    console.error(`✗ ${rel}`);
    for (const u of [...new Set(unknown)].sort()) console.error(`    unknown token: \`${u}\``);
  }
}

console.log(
  `Checked ${files.length} skills · ${tools.size} tools in manifest · ` +
    `${refTotal} tool refs (${referenced.size} distinct) · ${unknownTotal} unknown`,
);

if (unknownTotal > 0) {
  console.error(
    '\nParity FAILED. Each unknown token is either a renamed/removed tool ' +
      '(fix the SKILL.md + refresh tool-manifest.json) or a non-tool term ' +
      '(add to scripts/skill-nontool-allow.txt).',
  );
  process.exit(1);
}

console.log('Parity OK — every backticked tool reference exists in the manifest.');
