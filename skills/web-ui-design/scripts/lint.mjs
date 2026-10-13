#!/usr/bin/env node
// lint.mjs - scan source files for generated-page tells.
// Usage: node lint.mjs <file|folder> [...]   (html, css, scss, js, jsx, ts, tsx, vue, svelte, astro)
// Exit code 1 if any ERROR.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const EXT = new Set(['.html', '.htm', '.css', '.scss', '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte', '.astro', '.mdx']);
const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.ui-craft', '.agents']);

const RULES = [
  { id: 'lorem', level: 'ERROR', re: /lorem ipsum|dolor sit amet/i, msg: 'placeholder Latin text' },
  { id: 'cliche-copy', level: 'ERROR', re: /\b(elevate your|seamless(ly)?|unleash|next-gen(eration)?|game-?changer|delve|tapestry|revolutioni[sz]e|supercharge|in the world of|cutting-edge|unlock the power)\b/i, msg: 'AI copywriting cliche; write plain, specific language' },
  { id: 'placeholder-names', level: 'WARN', re: /\b(john doe|jane (doe|smith)|acme( corp)?|lorem|foo bar|your company)\b/i, msg: 'placeholder name' },
  { id: 'round-numbers', level: 'WARN', re: /\b(99\.99%|100%\s*(satisfaction|uptime)|\$100\.00|10,?000\+? (users|customers))\b/i, msg: 'suspiciously round statistic; never invent proof' },
  { id: 'oops', level: 'WARN', re: /\boops!?/i, msg: '"Oops" error copy; be direct' },
  { id: 'vh', level: 'WARN', re: /(?<![\w-])(height|min-height)\s*:\s*100vh|\bh-screen\b/, msg: 'use min-height: 100dvh (mobile browser chrome)' },
  { id: 'gradient', level: 'WARN', re: /(linear|radial|conic)-gradient\(|\bbg-gradient-to-|\bfrom-\w+-\d+\b.*\bto-\w+-\d+\b/, msg: 'gradient; use flat colour or a real picture' },
  { id: 'shadow', level: 'WARN', re: /box-shadow\s*:\s*(?!none)|\bshadow-(md|lg|xl|2xl)\b/, msg: 'shadow on a resting surface; prefer a tone step' },
  { id: 'glass', level: 'WARN', re: /backdrop-filter\s*:|\bbackdrop-blur/, msg: 'glass panel; only for truly fixed/sticky overlays' },
  { id: 'transition-all', level: 'WARN', re: /transition\s*:\s*all\b|\btransition-all\b/, msg: 'transition: all animates layout properties; list transform/opacity' },
  { id: 'linear-easing', level: 'WARN', re: /transition[^;{]*\b(linear|ease-in-out)\b|\bease-in-out\b/, msg: 'default easing; use a custom cubic-bezier' },
  { id: 'animate-layout', level: 'WARN', re: /transition(-property)?\s*:\s*[^;]*\b(top|left|right|bottom|width|height|margin|padding)\b/, msg: 'animating a layout property; animate transform/opacity' },
  { id: 'generic-font', level: 'WARN', re: /font-family\s*:\s*['"]?(Inter|Roboto|Arial|Helvetica|Open Sans)['"]?\s*[,;]/i, msg: 'default-looking font as the design voice' },
  { id: 'font-import', level: 'WARN', re: /fonts\.googleapis\.com\/css2?\?family=(Inter|Roboto|Open\+Sans)\b/i, msg: 'default-looking font imported' },
  { id: 'z-index', level: 'WARN', re: /z-index\s*:\s*(\d{4,}|999)\b|\bz-\[\d{3,}\]/, msg: 'arbitrary z-index; use a named scale' },
  { id: 'dead-link', level: 'WARN', re: /href=["']#["']/, msg: 'link to "#"' },
  { id: 'alert', level: 'ERROR', re: /\b(window\.)?alert\s*\(/, msg: 'alert(); use inline messages' },
  { id: 'scroll-listener', level: 'WARN', re: /addEventListener\(\s*['"]scroll['"]/, msg: 'scroll listener; use IntersectionObserver for reveals' },
  { id: 'emoji', level: 'WARN', re: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, msg: 'emoji in UI; use a real icon or none' },
  { id: 'pure-black', level: 'WARN', re: /(background(-color)?\s*:\s*#000(000)?\b|\bbg-black\b)/, msg: 'pure #000 background; use off-black' },
  { id: 'img-no-alt', level: 'ERROR', re: /<img\b(?![^>]*\balt=)[^>]*>/i, msg: '<img> without alt' },
  { id: 'empty-alt-image', level: 'WARN', re: /alt=["'](image|photo|picture|img)?["']/i, msg: 'empty or generic alt text' },
  { id: 'todo', level: 'WARN', re: /(\/\/|\/\*|<!--)\s*(TODO|FIXME|implement here|rest of)/i, msg: 'leftover TODO or placeholder' },
];

const files = [];
function walk(p) {
  const s = statSync(p);
  if (s.isDirectory()) { for (const n of readdirSync(p)) { if (!SKIP.has(n)) walk(join(p, n)); } }
  else if (EXT.has(extname(p).toLowerCase())) files.push(p);
}
const args = process.argv.slice(2);
const allow = new Set();
const paths = [];
for (let i = 0; i < args.length; i++) { if (args[i] === '--allow') (args[++i] || '').split(',').forEach((x) => allow.add(x)); else paths.push(args[i]); }
if (!paths.length) { console.error('Usage: node lint.mjs <file|folder> [...] [--allow rule,rule]'); process.exit(2); }
for (const p of paths) walk(p);

let errors = 0, warns = 0;
for (const f of files) {
  const lines = readFileSync(f, 'utf8').split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const r of RULES) {
      if (allow.has(r.id)) continue;
      if (r.re.test(line)) {
        console.log(`${r.level.padEnd(5)} ${f}:${i + 1} [${r.id}] ${r.msg}`);
        r.level === 'ERROR' ? errors++ : warns++;
      }
    }
  });
}
console.log(`\n${files.length} files, ${errors} ERROR, ${warns} WARN`);
process.exit(errors ? 1 : 0);
