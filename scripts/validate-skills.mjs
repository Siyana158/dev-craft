#!/usr/bin/env node

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const skillsDir = join(root, 'skills');
const skillDirs = readdirSync(skillsDir)
  .map((name) => join(skillsDir, name))
  .filter((path) => statSync(path).isDirectory());

const errors = [];
const names = new Set();

for (const dir of skillDirs) {
  const folder = dir.split(/[\\/]/).at(-1);
  const file = join(dir, 'SKILL.md');

  let source;
  try {
    source = readFileSync(file, 'utf8');
  } catch {
    errors.push(`${folder}: missing SKILL.md`);
    continue;
  }

  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!frontmatter) {
    errors.push(`${folder}: missing valid YAML frontmatter`);
    continue;
  }

  const name = frontmatter[1].match(/^name:\s*([^\s#]+)\s*$/m)?.[1];
  const description = frontmatter[1].match(/^description:\s*(.+?)\s*$/m)?.[1];

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(folder)) {
    errors.push(`${folder}: folder name must be lowercase kebab-case`);
  }
  if (name !== folder) {
    errors.push(`${folder}: frontmatter name must match the folder`);
  }
  if (name && names.has(name)) {
    errors.push(`${folder}: duplicate skill name ${name}`);
  }
  if (name) names.add(name);
  if (!description || description.length < 30) {
    errors.push(`${folder}: description must explain when the skill applies`);
  }
  if (!/^# .+/m.test(source.slice(frontmatter[0].length))) {
    errors.push(`${folder}: add a Markdown title after frontmatter`);
  }
  if (/\b(?:TODO|TBD|FIXME)\b/.test(source)) {
    errors.push(`${folder}: remove unfinished TODO/TBD/FIXME text`);
  }
}

if (skillDirs.length === 0) errors.push('skills/: no skill folders found');

if (errors.length) {
  console.error(errors.map((error) => `FAIL ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${skillDirs.length} skills.`);
}
