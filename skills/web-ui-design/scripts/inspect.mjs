#!/usr/bin/env node
// inspect.mjs - open a page in a real browser at three widths, measure it against
// the ui-craft house rules, save screenshots. No dependencies (Node 22+ and an
// installed Chrome, Edge or Chromium).
//
// Usage: node inspect.mjs <url | path/to/index.html> [--out dir] [--allow rule,rule] [--strict]
// --strict adds opinionated taste checks (mono, tiny caps, gradients, shadows) as warnings.
// Exit code 1 if any FAIL.

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const target = args.find((a) => !a.startsWith('--'));
const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i > -1 ? args[i + 1] : d; };
const outDir = resolve(flag('out', '.ui-craft/inspect'));
const strict = args.includes('--strict');
const allow = new Set((flag('allow', '') || '').split(',').filter(Boolean));
if (!target) { console.error('Usage: node inspect.mjs <url|file.html> [--out dir] [--allow rule,rule]'); process.exit(2); }
if (typeof WebSocket === 'undefined') { console.error('Node 22+ is required (global WebSocket).'); process.exit(2); }

const url = /^https?:|^file:/.test(target) ? target : pathToFileURL(resolve(target)).href;

function findBrowser() {
  const c = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/microsoft-edge',
  ].filter(Boolean);
  return c.find((p) => existsSync(p));
}

const browserPath = findBrowser();
if (!browserPath) { console.error('No Chrome/Edge/Chromium found. Set CHROME_PATH.'); process.exit(2); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9300 + Math.floor(Math.random() * 500);
const profile = mkdtempSync(join(tmpdir(), 'ui-craft-'));
const proc = spawn(browserPath, [
  '--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--disable-gpu', '--hide-scrollbars', 'about:blank',
], { stdio: 'ignore' });

function cleanup() { try { proc.kill(); } catch {} try { rmSync(profile, { recursive: true, force: true }); } catch {} }
process.on('exit', cleanup);

async function getWsUrl() {
  for (let i = 0; i < 60; i++) {
    try { const r = await fetch(`http://127.0.0.1:${port}/json/version`); return (await r.json()).webSocketDebuggerUrl; }
    catch { await sleep(250); }
  }
  throw new Error('Browser did not start');
}

class Cdp {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.events = [];
    ws.addEventListener('message', (m) => { const d = JSON.parse(m.data);
      if (d.id && this.pending.has(d.id)) { const { res, rej } = this.pending.get(d.id); this.pending.delete(d.id); d.error ? rej(new Error(d.error.message)) : res(d.result); }
      else this.events.push(d); }); }
  send(method, params = {}, sessionId) { const id = ++this.id; this.ws.send(JSON.stringify({ id, method, params, sessionId }));
    return new Promise((res, rej) => this.pending.set(id, { res, rej })); }
}

// Runs in the page. Returns raw measurements.
const MEASURE = `(() => {
  const vw = innerWidth;
  const q = (s) => [...document.querySelectorAll(s)];
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0'; };
  const lines = (el) => { const cs = getComputedStyle(el); const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2; return Math.round(el.getBoundingClientRect().height / lh); };
  const headings = q('h1,h2,h3,h4').filter(visible).map((h) => ({ tag: h.tagName, text: h.textContent.trim().slice(0, 60), lines: lines(h), size: parseFloat(getComputedStyle(h).fontSize) }));
  const parseRGB = (c) => { const m = c.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(',').map((x) => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p[3] === undefined ? 1 : p[3] }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const bgOf = (el) => { let e = el; while (e) { const c = parseRGB(getComputedStyle(e).backgroundColor); if (c && c.a > 0.95) return c; e = e.parentElement; } return { r: 255, g: 255, b: 255, a: 1 }; };
  const lowContrast = [];
  const textEls = q('p,li,a,span,button,h1,h2,h3,h4,label,small,td,th,blockquote').filter((e) => visible(e) && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()));
  for (const e of textEls) { const cs = getComputedStyle(e); const fg = parseRGB(cs.color); if (!fg || fg.a < 0.05) continue; const bg = bgOf(e);
    const a = fg.a; const mix = { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a) };
    const l1 = lum(mix), l2 = lum(bg); const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700; const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
    if (ratio < need) lowContrast.push({ text: e.textContent.trim().slice(0, 40), ratio: +ratio.toFixed(2), need }); }
  const all = q('body *').filter(visible);
  const sizes = new Set(), families = new Set(), mono = [], gradients = [], shadows = [], tiny = [];
  for (const e of all) { const cs = getComputedStyle(e);
    if ([...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) { sizes.add(Math.round(parseFloat(cs.fontSize))); families.add(cs.fontFamily.split(',')[0].replace(/["']/g, '').trim());
      if (/mono|courier|consolas/i.test(cs.fontFamily) && !e.closest('pre,code,kbd,samp')) mono.push(e.textContent.trim().slice(0, 30));
      if (cs.textTransform === 'uppercase' && parseFloat(cs.fontSize) <= 13 && parseFloat(cs.letterSpacing) > 0.5) tiny.push(e.textContent.trim().slice(0, 30)); }
    if (/gradient/.test(cs.backgroundImage)) gradients.push(e.tagName.toLowerCase() + '.' + String(e.className).slice(0, 30));
    if (cs.boxShadow !== 'none' && cs.position !== 'fixed' && cs.position !== 'absolute' && !e.closest('dialog,[role=dialog],[role=menu]')) shadows.push(e.tagName.toLowerCase() + '.' + String(e.className).slice(0, 30)); }
  const imgs = q('img,video,picture').filter(visible);
  const bgImgs = all.filter((e) => /url\\(/.test(getComputedStyle(e).backgroundImage));
  const noAlt = q('img').filter((i) => !i.hasAttribute('alt'));
  const smallTargets = q('a,button,input,select,textarea,[role=button]').filter(visible).filter((e) => { const r = e.getBoundingClientRect(); return (r.width < 44 || r.height < 44) && getComputedStyle(e).display !== 'inline' && e.type !== 'radio' && e.type !== 'checkbox'; }).map((e) => (e.textContent || e.name || e.tagName).trim().slice(0, 24));
  const noLabel = q('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea').filter((i) => !(i.labels && i.labels.length) && !i.getAttribute('aria-label') && !i.getAttribute('aria-labelledby'));
  const deadLinks = q('a[href="#"]').length;
  const outOfView = all.filter((e) => { const r = e.getBoundingClientRect(); return r.right > vw + 2 && r.width < vw * 3 && getComputedStyle(e).position !== 'fixed'; }).slice(0, 5).map((e) => e.tagName.toLowerCase() + '.' + String(e.className).slice(0, 30));
  const focusCss = [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => /focus-visible|:focus/.test(r.cssText)); } catch { return true; } });
  const reducedMotion = [...document.styleSheets].some((s) => { try { return [...s.cssRules].some((r) => r.media && /prefers-reduced-motion/.test(r.media.mediaText)); } catch { return true; } });
  return {
    vw, scrollW: document.documentElement.scrollWidth, docH: document.documentElement.scrollHeight,
    title: document.title, lang: document.documentElement.lang, desc: !!document.querySelector('meta[name=description]'),
    h1: q('h1').length, headings, sizes: [...sizes].sort((a, b) => a - b), families: [...families], mono, tiny, gradients, shadows,
    media: imgs.length + bgImgs.length, noAlt: noAlt.length, smallTargets, noLabel: noLabel.length, deadLinks, lowContrast: lowContrast.slice(0, 6), lowContrastCount: lowContrast.length,
    outOfView, focusCss, reducedMotion, main: !!document.querySelector('main'),
    movers: q('*').filter((e) => getComputedStyle(e).transitionDuration !== '0s' || getComputedStyle(e).animationName !== 'none').length,
    fontsLoaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
  };
})()`;

const results = [];
function rule(name, level, msg, vp) { if (allow.has(name)) return; results.push({ name, level, msg, vp }); }

try {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  const cdp = new Cdp(ws);
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  const S = (m, p) => cdp.send(m, p, sessionId);
  await S('Page.enable'); await S('Runtime.enable');
  mkdirSync(outDir, { recursive: true });

  for (const vp of [{ w: 1440, h: 900, mobile: false }, { w: 768, h: 1024, mobile: false }, { w: 390, h: 844, mobile: true }]) {
    await S('Emulation.setDeviceMetricsOverride', { width: vp.w, height: vp.h, deviceScaleFactor: 1, mobile: vp.mobile });
    await S('Page.navigate', { url });
    await sleep(1800);
    // scroll through so IntersectionObserver reveals fire, then back to top
    await S('Runtime.evaluate', { expression: `(async()=>{document.documentElement.style.scrollBehavior='auto';const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=innerHeight*0.7){scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}scrollTo(0,0);await new Promise(r=>setTimeout(r,900));})()`, awaitPromise: true });
    const { result } = await S('Runtime.evaluate', { expression: MEASURE, returnByValue: true });
    const m = result.value;
    if (!m) { console.error('Measurement failed at', vp.w); continue; }
    const shot = await S('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    const file = join(outDir, `${vp.w}.png`); writeFileSync(file, Buffer.from(shot.data, 'base64'));
    const tag = `${vp.w}px`;

    if (m.scrollW > m.vw + 1) rule('overflow', 'FAIL', `horizontal overflow (${m.scrollW} > ${m.vw}) ${m.outOfView.join(', ')}`, tag);
    const long = m.headings.filter((h) => h.lines > 2);
    if (long.length) rule('headline-lines', 'FAIL', `headings over 2 lines: ${long.map((h) => `"${h.text}" (${h.lines})`).join('; ')}`, tag);
    if (m.sizes.length > 12) rule('type-sizes', 'WARN', `${m.sizes.length} distinct font sizes; fluid clamp() inflates this, but check the scale is deliberate`, tag);
    if (m.families.length > 2) rule('fonts', 'FAIL', `${m.families.length} font families used: ${m.families.join(', ')}`, tag);
    const generic = m.families.filter((f) => /^(inter|roboto|arial|helvetica|open sans|system-ui|sans-serif|times new roman)$/i.test(f));
    if (generic.length) rule('generic-font', 'WARN', `default-looking font in use: ${generic.join(', ')}`, tag);
    if (strict) {
      if (m.mono.length) rule('mono', 'WARN', `monospace outside code: ${m.mono.slice(0, 3).join(' | ')}`, tag);
      if (m.tiny.length) rule('tiny-caps', 'WARN', `tiny tracked uppercase labels: ${m.tiny.slice(0, 3).join(' | ')}`, tag);
      if (m.gradients.length) rule('gradient', 'WARN', `gradients on: ${m.gradients.slice(0, 4).join(', ')}`, tag);
      if (m.shadows.length) rule('shadow', 'WARN', `box-shadow on resting elements: ${m.shadows.slice(0, 4).join(', ')}`, tag);
    }
    if (m.lowContrastCount) rule('contrast', 'FAIL', `${m.lowContrastCount} text elements below WCAG AA, e.g. ${m.lowContrast.slice(0, 3).map((c) => `"${c.text}" ${c.ratio}:${c.need}`).join('; ')}`, tag);
    if (m.noAlt) rule('alt', 'FAIL', `${m.noAlt} <img> without alt`, tag);
    if (m.noLabel) rule('label', 'FAIL', `${m.noLabel} form fields without a label`, tag);
    if (vp.mobile && m.smallTargets.length) rule('tap-targets', 'WARN', `targets under 44px: ${m.smallTargets.slice(0, 5).join(', ')}`, tag);
    if (vp.w === 1440) {
      if (m.h1 !== 1) rule('h1', 'FAIL', `expected exactly one h1, found ${m.h1}`, tag);
      if (!m.title) rule('title', 'FAIL', 'missing <title>', tag);
      if (!m.lang) rule('lang', 'FAIL', 'missing <html lang>', tag);
      if (!m.desc) rule('meta-description', 'WARN', 'missing meta description', tag);
      if (!m.main) rule('main', 'WARN', 'no <main> landmark', tag);
      if (m.deadLinks) rule('dead-links', 'WARN', `${m.deadLinks} links to "#"`, tag);
      if (!m.focusCss) rule('focus', 'FAIL', 'no :focus / :focus-visible styles found', tag);
      if (!m.reducedMotion) rule('reduced-motion', 'WARN', 'no prefers-reduced-motion handling', tag);
      if (m.media < 4) rule('imagery', 'WARN', `${m.media} real pictures/videos on the page; strong pages usually carry 4 or more`, tag);
      if (m.movers < 8) rule('motion', 'WARN', `only ${m.movers} elements with transitions/animations; add entrance and control feedback`, tag);
      const blank = m.docH / m.vw;
      if (blank > 14) rule('length', 'WARN', `page is ${Math.round(m.docH)}px tall; check for filler`, tag);
    }
    if (vp.w === 1440) console.log(`fonts loaded: ${[...new Set(m.fontsLoaded)].join(', ') || 'none (system fonts only)'}`);
    console.log(`screenshot: ${file}`);
  }
  ws.close();
} catch (e) {
  console.error('inspect failed:', e.message); cleanup(); process.exit(2);
}

// dedupe identical messages across viewports
const merged = new Map();
for (const r of results) { const k = r.name + '|' + r.msg; if (!merged.has(k)) merged.set(k, { ...r, vps: [r.vp] }); else merged.get(k).vps.push(r.vp); }
let fails = 0, warns = 0;
for (const r of merged.values()) { if (r.level === 'FAIL') fails++; else warns++;
  console.log(`${r.level.padEnd(4)} [${r.name}] ${r.msg} (${r.vps.join(', ')})`); }
console.log(`\n${fails} FAIL, ${warns} WARN. Open the screenshots and critique them: the meter only measures what is measurable.`);
cleanup();
process.exit(fails ? 1 : 0);
