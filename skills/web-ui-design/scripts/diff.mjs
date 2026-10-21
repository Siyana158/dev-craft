#!/usr/bin/env node
// diff.mjs - visual regression and side-by-side comparison tool for dev-craft.
// Compares before/after screenshots (from .dev-craft/baseline and .dev-craft/inspect,
// or custom directories) and generates an interactive diff.html with split slider,
// side-by-side, and difference blend modes. Zero dependencies.
//
// Usage: node diff.mjs [--before dir] [--after dir] [--out file.html]
// Example: node diff.mjs --before .dev-craft/baseline --after .dev-craft/inspect

import { existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const args = process.argv.slice(2);
const flag = (n, d) => { const i = args.indexOf(`--${n}`); return i > -1 && args[i + 1] ? args[i + 1] : d; };

const positional = args.filter((a) => !a.startsWith('--'));
const beforeDir = resolve(flag('before', positional[0] || '.dev-craft/baseline'));
const afterDir = resolve(flag('after', positional[1] || '.dev-craft/inspect'));
const outFile = resolve(flag('out', '.dev-craft/diff.html'));

if (!existsSync(beforeDir)) {
  console.error(`Before directory not found: ${beforeDir}`);
  console.error('Run inspect on your baseline page first, or specify --before <dir>');
  process.exit(1);
}

if (!existsSync(afterDir)) {
  console.error(`After directory not found: ${afterDir}`);
  console.error('Run inspect on your redesigned page first, or specify --after <dir>');
  process.exit(1);
}

const beforeFiles = readdirSync(beforeDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
const afterFiles = readdirSync(afterDir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
const common = beforeFiles.filter((f) => afterFiles.includes(f));

if (common.length === 0) {
  console.error(`No matching screenshot names found between ${beforeDir} and ${afterDir}`);
  console.error(`Before files: ${beforeFiles.join(', ') || 'none'}`);
  console.error(`After files: ${afterFiles.join(', ') || 'none'}`);
  process.exit(1);
}

// Convert image to base64 data URI so diff.html is completely self-contained
function toDataUri(filePath) {
  const buf = readFileSync(filePath);
  const ext = filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') ? 'image/jpeg' : 'image/png';
  return `data:${ext};base64,${buf.toString('base64')}`;
}

const pairs = common.map((filename) => {
  const label = basename(filename, filename.includes('.') ? filename.substring(filename.lastIndexOf('.')) : '');
  return {
    filename,
    label: label.match(/^\d+$/) ? `${label}px` : label,
    before: toDataUri(join(beforeDir, filename)),
    after: toDataUri(join(afterDir, filename)),
  };
});

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>dev-craft Visual Diff</title>
  <style>
    :root {
      --bg: #0f1117;
      --surface: #181c24;
      --surface-2: #242936;
      --ink: #e8ecf2;
      --muted: #8b949e;
      --accent: #3b82f6;
      --border: rgba(255, 255, 255, 0.1);
      --font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--ink);
      font-family: var(--font);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    header {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 1rem 1.5rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .badge {
      background: var(--accent);
      color: #fff;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .title {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .controls {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .btn-group {
      display: inline-flex;
      background: var(--surface-2);
      border-radius: 6px;
      padding: 2px;
      border: 1px solid var(--border);
    }
    .btn {
      background: transparent;
      border: none;
      color: var(--muted);
      padding: 0.4rem 0.85rem;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      border-radius: 4px;
      transition: all 120ms ease;
    }
    .btn.active {
      background: var(--accent);
      color: #fff;
    }
    .btn:hover:not(.active) {
      color: var(--ink);
    }
    .slider-control {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--muted);
    }
    .slider-control input[type=range] {
      accent-color: var(--accent);
      cursor: pointer;
    }
    main {
      flex: 1;
      padding: 1.5rem;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      overflow-x: auto;
    }
    .diff-stage {
      max-width: 100%;
      position: relative;
    }
    /* Split Slider View */
    .view-split {
      position: relative;
      display: inline-block;
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: 8px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
    }
    .view-split img {
      display: block;
      max-width: 100%;
      height: auto;
      user-select: none;
      pointer-events: none;
    }
    .split-after-wrap {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      width: 50%;
      border-right: 2px solid #fff;
      box-shadow: 2px 0 10px rgba(0,0,0,0.5);
    }
    .split-after-wrap img {
      position: absolute;
      top: 0;
      left: 0;
      max-width: none;
      height: 100%;
    }
    .split-handle {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 36px;
      height: 36px;
      background: #fff;
      color: #000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -50%);
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      cursor: ew-resize;
      z-index: 10;
      font-size: 14px;
      font-weight: bold;
    }
    .label-pill {
      position: absolute;
      top: 1rem;
      padding: 0.35rem 0.75rem;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(4px);
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      z-index: 5;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .label-before { left: 1rem; }
    .label-after { right: 1rem; }

    /* Side by Side View */
    .view-side {
      display: none;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      max-width: 100%;
    }
    .side-col {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
    }
    .side-col-header {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border);
      font-weight: 600;
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
    }
    .side-col img {
      display: block;
      width: 100%;
      height: auto;
    }

    /* Difference Overlay View */
    .view-diff {
      display: none;
      position: relative;
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
    }
    .view-diff img.diff-base {
      display: block;
      max-width: 100%;
      height: auto;
    }
    .view-diff img.diff-top {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      mix-blend-mode: difference;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand">
      <span class="badge">dev-craft</span>
      <h1 class="title">Visual Regression Diff</h1>
    </div>

    <div class="controls">
      <!-- Breakpoint selection -->
      <div class="btn-group" id="bp-group">
        ${pairs.map((p, idx) => `<button class="btn ${idx === 0 ? 'active' : ''}" data-bp="${idx}">${p.label}</button>`).join('')}
      </div>

      <!-- Mode selection -->
      <div class="btn-group" id="mode-group">
        <button class="btn active" data-mode="split">Split Slider</button>
        <button class="btn" data-mode="side">Side-by-Side</button>
        <button class="btn" data-mode="diff">Difference</button>
      </div>

      <!-- Difference blend / opacity slider -->
      <div class="slider-control" id="opacity-control" style="display:none;">
        <label for="opacity-slider">Blend:</label>
        <input type="range" id="opacity-slider" min="0" max="100" value="100">
      </div>
    </div>
  </header>

  <main>
    <div class="diff-stage">
      <!-- Split Slider Mode -->
      <div class="view-split" id="view-split">
        <span class="label-pill label-before">Before</span>
        <span class="label-pill label-after">After</span>
        <img id="split-before-img" src="${pairs[0].before}" alt="Before baseline">
        <div class="split-after-wrap" id="split-wrap">
          <img id="split-after-img" src="${pairs[0].after}" alt="After redesign">
        </div>
        <div class="split-handle" id="split-handle">&harr;</div>
      </div>

      <!-- Side by Side Mode -->
      <div class="view-side" id="view-side">
        <div class="side-col">
          <div class="side-col-header">Before (Baseline)</div>
          <img id="side-before-img" src="${pairs[0].before}" alt="Before baseline">
        </div>
        <div class="side-col">
          <div class="side-col-header">After (Redesign)</div>
          <img id="side-after-img" src="${pairs[0].after}" alt="After redesign">
        </div>
      </div>

      <!-- Difference Blend Mode -->
      <div class="view-diff" id="view-diff">
        <img class="diff-base" id="diff-base-img" src="${pairs[0].before}" alt="Base layer">
        <img class="diff-top" id="diff-top-img" src="${pairs[0].after}" alt="Difference layer">
      </div>
    </div>
  </main>

  <script>
    const data = ${JSON.stringify(pairs)};
    let currentIdx = 0;
    let currentMode = 'split';

    const splitWrap = document.getElementById('split-wrap');
    const splitHandle = document.getElementById('split-handle');
    const splitContainer = document.getElementById('view-split');
    const splitBeforeImg = document.getElementById('split-before-img');
    const splitAfterImg = document.getElementById('split-after-img');

    const sideBeforeImg = document.getElementById('side-before-img');
    const sideAfterImg = document.getElementById('side-after-img');

    const diffBaseImg = document.getElementById('diff-base-img');
    const diffTopImg = document.getElementById('diff-top-img');

    const viewSplit = document.getElementById('view-split');
    const viewSide = document.getElementById('view-side');
    const viewDiff = document.getElementById('view-diff');
    const opacityControl = document.getElementById('opacity-control');
    const opacitySlider = document.getElementById('opacity-slider');

    function syncImages() {
      const cur = data[currentIdx];
      splitBeforeImg.src = cur.before;
      splitAfterImg.src = cur.after;
      sideBeforeImg.src = cur.before;
      sideAfterImg.src = cur.after;
      diffBaseImg.src = cur.before;
      diffTopImg.src = cur.after;

      splitBeforeImg.onload = () => {
        splitAfterImg.style.width = splitBeforeImg.offsetWidth + 'px';
        splitAfterImg.style.height = splitBeforeImg.offsetHeight + 'px';
      };
    }

    // Breakpoint buttons
    document.querySelectorAll('#bp-group .btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('#bp-group .btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentIdx = parseInt(btn.dataset.bp, 10);
        syncImages();
      });
    });

    // Mode buttons
    document.querySelectorAll('#mode-group .btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('#mode-group .btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentMode = btn.dataset.mode;
        
        viewSplit.style.display = currentMode === 'split' ? 'inline-block' : 'none';
        viewSide.style.display = currentMode === 'side' ? 'grid' : 'none';
        viewDiff.style.display = currentMode === 'diff' ? 'block' : 'none';
        opacityControl.style.display = currentMode === 'diff' ? 'flex' : 'none';
      });
    });

    // Slider dragging logic
    let isDragging = false;
    function setSliderPos(x) {
      const rect = splitContainer.getBoundingClientRect();
      let pos = (x - rect.left) / rect.width;
      if (pos < 0) pos = 0;
      if (pos > 1) pos = 1;
      const pct = (pos * 100).toFixed(2);
      splitWrap.style.width = pct + '%';
      splitHandle.style.left = pct + '%';
    }

    splitContainer.addEventListener('mousedown', (e) => { isDragging = true; setSliderPos(e.clientX); });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', (e) => { if (isDragging) setSliderPos(e.clientX); });

    splitContainer.addEventListener('touchstart', (e) => { isDragging = true; setSliderPos(e.touches[0].clientX); });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', (e) => { if (isDragging) setSliderPos(e.touches[0].clientX); });

    opacitySlider.addEventListener('input', (e) => {
      diffTopImg.style.opacity = (e.target.value / 100);
    });

    syncImages();
  </script>
</body>
</html>
`;

mkdirSync(resolve(outFile, '..'), { recursive: true });
writeFileSync(outFile, html, 'utf8');

console.log(`Visual diff generated successfully:`);
console.log(`- Before: ${beforeDir}`);
console.log(`- After:  ${afterDir}`);
console.log(`- Breakpoints: ${common.join(', ')}`);
console.log(`- Diff Report: ${outFile}`);
