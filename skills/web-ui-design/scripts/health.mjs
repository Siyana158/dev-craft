// health.mjs - extra checks used by inspect.mjs: layout health, accessibility,
// Tamil / Indic typography, keyboard traversal and reduced-motion behaviour.
// Not run directly. Kept separate so inspect.mjs stays small.

// ---------------------------------------------------------------------------
// 1. Static measurements, evaluated inside the page at each viewport.
// ---------------------------------------------------------------------------
export const HEALTH_MEASURE = String.raw`(() => {
  const vw = innerWidth;
  const q = (s) => [...document.querySelectorAll(s)];
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && cs.opacity !== '0'; };
  const all = q('body *').filter(visible);
  const label = (e) => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\s+/)[0] : '');
  const hasText = (e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  const snip = (e) => (e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28);

  // --- layout health: content cut off, one-word-per-line columns, tiny svg text
  const scrollAncestor = (el) => { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { if (/(auto|scroll)/.test(getComputedStyle(p).overflowX)) return true; } return false; };
  const clipper = (el, r) => { for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) { if (/(hidden|clip)/.test(getComputedStyle(p).overflowX)) { const pr = p.getBoundingClientRect(); if (r.right > pr.right + 2 || r.left < pr.left - 2) return p; } } return null; };
  const clipped = [];
  const narrow = [];
  for (const e of all) {
    if (e.closest('svg,[aria-hidden=true]') || !hasText(e)) continue;
    const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
    if (r.right < 0 || cs.position === 'fixed') continue;
    const c = clipper(e, r);
    if (c) clipped.push(label(e) + ' "' + snip(e) + '" cut by ' + label(c));
    else if ((r.right > vw + 2 || r.left < -2) && !scrollAncestor(e)) clipped.push(label(e) + ' "' + snip(e) + '" runs off screen');
    const own = [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ');
    if (own.length >= 28 && cs.display !== 'inline' && r.width > 0 && r.width < 110) narrow.push(label(e) + ' is ' + Math.round(r.width) + 'px wide: "' + own.slice(0, 24) + '"');
  }
  const svgSmall = [];
  q('svg').filter((s) => visible(s) && !s.closest('[aria-hidden=true]') && s.getAttribute('aria-hidden') !== 'true').forEach((s) => {
    const vb = s.viewBox && s.viewBox.baseVal; if (!vb || !vb.width) return;
    const scale = s.getBoundingClientRect().width / vb.width;
    s.querySelectorAll('text').forEach((t) => { const fs = parseFloat(getComputedStyle(t).fontSize) * scale; if (fs < 10) svgSmall.push(Math.round(fs * 10) / 10 + 'px "' + (t.textContent || '').trim().slice(0, 18) + '"'); });
  });

  // --- accessibility (static)
  const nameOf = (e) => (e.getAttribute('aria-label') || '').trim() || (e.getAttribute('aria-labelledby') ? 'x' : '') || (e.innerText || '').trim() || (e.labels && e.labels.length ? 'x' : '') || (e.getAttribute('title') || '').trim() || (e.querySelector && e.querySelector('img[alt]:not([alt=""])') ? 'x' : '');
  const unnamed = q('a[href],button,[role=button],select,textarea,input:not([type=hidden])').filter((e) => { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return false; if (e.disabled && e.tagName !== 'BUTTON') return false; return !nameOf(e); }).slice(0, 6).map(label);
  const levels = q('h1,h2,h3,h4,h5,h6').filter(visible).map((h) => +h.tagName[1]);
  const headingSkips = []; for (let i = 1; i < levels.length; i++) { if (levels[i] - levels[i - 1] > 1) headingSkips.push('h' + levels[i - 1] + ' to h' + levels[i]); }
  const idCount = {}; q('[id]').forEach((e) => { idCount[e.id] = (idCount[e.id] || 0) + 1; });
  const dupIds = Object.keys(idCount).filter((k) => idCount[k] > 1).slice(0, 5);
  const scrollRegions = q('*').filter((e) => { const cs = getComputedStyle(e); return /(auto|scroll)/.test(cs.overflowX) && e.scrollWidth > e.clientWidth + 2 && e.tabIndex < 0 && !e.querySelector('a[href],button,input,select,textarea,[tabindex]') && e.tagName !== 'HTML' && e.tagName !== 'BODY'; }).slice(0, 4).map(label);
  const radioNames = new Set();
  let focusable = 0;
  q('a[href],button,input:not([type=hidden]),select,textarea,summary,[tabindex]').forEach((e) => {
    const cs = getComputedStyle(e); if (e.disabled || e.tabIndex < 0 || cs.display === 'none' || cs.visibility === 'hidden') return;
    if (e.type === 'radio') { const k = e.name || e.id; if (radioNames.has(k)) return; radioNames.add(k); }
    if (!visible(e) && e.type !== 'radio' && e.type !== 'checkbox') return;
    focusable++;
  });

  // --- Tamil / Indic typography
  const tamilRe = /[஀-௿]/;
  const tamilEls = all.filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && tamilRe.test(n.textContent)));
  const tamilFontRe = /tamil|latha|nirmala|hind madurai|mukta malar|catamaran|baloo thambi|kavivanar|pavanam|tiro tamil|anek tamil|arima|meera inimai|vijaya|bamini/i;
  const langOf = (e) => { const l = e.closest('[lang]'); return l ? l.lang.toLowerCase() : ''; };
  const tamil = { count: tamilEls.length, noLang: 0, tight: [], tracking: [], noFont: 0, small: 0, upper: 0 };
  tamilEls.forEach((e) => {
    const cs = getComputedStyle(e); const fs = parseFloat(cs.fontSize);
    if (!langOf(e).startsWith('ta')) tamil.noLang++;
    const lh = cs.lineHeight === 'normal' ? 1.2 : parseFloat(cs.lineHeight) / fs;
    if (lh < 1.28) tamil.tight.push(label(e) + ' ' + lh.toFixed(2));
    if (parseFloat(cs.letterSpacing) < 0) tamil.tracking.push(label(e));
    if (!tamilFontRe.test(cs.fontFamily)) tamil.noFont++;
    if (fs < 15) tamil.small++;
    if (cs.textTransform === 'uppercase') tamil.upper++;
  });

  return { clipped: clipped.slice(0, 6), narrow: narrow.slice(0, 4), svgSmall: svgSmall.slice(0, 4), unnamed, headingSkips: headingSkips.slice(0, 4), dupIds, scrollRegions, focusable,
    tamil: { count: tamil.count, noLang: tamil.noLang, tight: tamil.tight.slice(0, 3), tracking: tamil.tracking.slice(0, 3), noFont: tamil.noFont, small: tamil.small, upper: tamil.upper } };
})()`;

// ---------------------------------------------------------------------------
// 2. Keyboard traversal: press Tab through the page, record every stop.
// ---------------------------------------------------------------------------
const ACTIVE = String.raw`(() => {
  const e = document.activeElement;
  if (!e || e === document.body || e === document.documentElement) return null;
  const sig = (el) => { const cs = getComputedStyle(el); return [cs.outlineStyle, cs.outlineWidth, cs.boxShadow, cs.borderTopColor, cs.borderRightColor, cs.borderBottomColor, cs.borderLeftColor, cs.backgroundColor, cs.color, cs.textDecorationLine, cs.transform].join('|'); };
  const outline = (el) => { const cs = getComputedStyle(el); return cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0; };
  const r = e.getBoundingClientRect();
  const hidden = (e.type === 'radio' || e.type === 'checkbox') && getComputedStyle(e).opacity === '0';
  const watch = hidden && e.nextElementSibling ? [e.nextElementSibling, ...e.nextElementSibling.querySelectorAll('*')] : [e];
  const before = watch.map(sig);
  const hadOutline = watch.some(outline);
  let changed = false;
  const multi = /^(date|time|datetime-local|month|week)$/.test(e.type || '');
  try {
    if (multi) {
      // blur() would reset the focused sub-field, so compare against an unfocused clone instead
      const c = e.cloneNode(false); c.removeAttribute('id'); e.insertAdjacentElement('afterend', c);
      changed = sig(e) !== sig(c); c.remove();
    } else { e.blur(); const after = watch.map(sig); changed = before.some((v, i) => v !== after[i]); e.focus({ preventScroll: true }); }
  } catch (err) {}
  return { key: e.tagName + '|' + (e.id || '') + '|' + Math.round(r.top + scrollY) + '|' + Math.round(r.left), ok: hadOutline || changed, tag: e.tagName.toLowerCase(), type: e.type || '',
    name: ((e.getAttribute('aria-label') || e.innerText || e.value || e.name || e.tagName) + '').trim().replace(/\s+/g, ' ').slice(0, 26) };
})()`;

export async function keyboardTest(S) {
  await S('Runtime.evaluate', { expression: "(function(){var st=document.createElement('style');st.textContent='*{transition:none!important;animation:none!important}';document.head.appendChild(st)})();document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,0);if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();1" });
  const stops = []; let trap = null; let repeat = 0;
  for (let i = 0; i < 120; i++) {
    await S('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
    await S('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
    const { result } = await S('Runtime.evaluate', { expression: ACTIVE, returnByValue: true });
    const v = result.value;
    if (!v) { if (stops.length) break; continue; }
    const last = stops[stops.length - 1];
    if (last && last.key === v.key) { repeat++; const multi = /^(date|time|datetime-local|month|week)$/.test(v.type); if (repeat > (multi ? 6 : 1)) { trap = v; break; } continue; }
    repeat = 0;
    if (stops.some((s) => s.key === v.key)) break;
    stops.push(v);
  }
  return { stops, trap };
}

// ---------------------------------------------------------------------------
// 3. Reduced motion: reload with prefers-reduced-motion and look for content
//    that is still invisible, or animations that never stop.
// ---------------------------------------------------------------------------
const RM_MEASURE = String.raw`(() => {
  const q = (s) => [...document.querySelectorAll(s)];
  const eff = (e) => { let o = 1; for (let p = e; p && p !== document.documentElement; p = p.parentElement) o *= parseFloat(getComputedStyle(p).opacity); return o; };
  const hidden = q('p,h1,h2,h3,h4,li,a,button,span,td,th,label,summary,dt,dd').filter((e) => { if (e.closest('[aria-hidden=true]')) return false; const r = e.getBoundingClientRect(); if (r.width === 0 || r.height === 0) return false; const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return false; if (![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return false; return eff(e) < 0.1; }).slice(0, 5).map((e) => '"' + (e.textContent || '').trim().slice(0, 22) + '"');
  const infinite = document.getAnimations().filter((a) => a.playState === 'running' && a.effect && a.effect.getComputedTiming().iterations === Infinity).length;
  return { hidden, infinite };
})()`;

export async function reducedMotionTest(S, url, sleep) {
  await S('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await S('Page.navigate', { url });
  await sleep(1500);
  await S('Runtime.evaluate', { expression: `(async()=>{document.documentElement.style.scrollBehavior='auto';const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=innerHeight*0.7){scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}scrollTo(0,0);await new Promise(r=>setTimeout(r,600));})()`, awaitPromise: true });
  const { result } = await S('Runtime.evaluate', { expression: RM_MEASURE, returnByValue: true });
  await S('Emulation.setEmulatedMedia', { features: [] });
  return result.value;
}

// ---------------------------------------------------------------------------
// 4. Turn raw measurements into rule results.
// ---------------------------------------------------------------------------
export function healthRules(h, rule, tag) {
  if (!h) return;
  if (h.clipped.length) rule('clipped-content', 'FAIL', `text cut off or running off screen: ${h.clipped.slice(0, 3).join(' | ')}`, tag);
  if (h.narrow.length) rule('narrow-text', 'WARN', `text squeezed into a very narrow column: ${h.narrow.slice(0, 2).join(' | ')}`, tag);
  if (h.svgSmall.length) rule('svg-text-size', 'WARN', `text inside SVG renders under 10px: ${h.svgSmall.join(', ')}`, tag);
  if (h.unnamed.length) rule('accessible-name', 'FAIL', `controls without an accessible name: ${h.unnamed.join(', ')}`, tag);
  if (h.headingSkips.length) rule('heading-order', 'WARN', `heading levels skipped: ${h.headingSkips.join(', ')}`, tag);
  if (h.dupIds.length) rule('duplicate-id', 'FAIL', `duplicate id values: ${h.dupIds.join(', ')}`, tag);
  if (h.scrollRegions.length) rule('scroll-region', 'WARN', `scrollable area not reachable by keyboard (add tabindex="0" and a label): ${h.scrollRegions.join(', ')}`, tag);
  const t = h.tamil;
  if (t && t.count) {
    if (t.noLang) rule('tamil-lang', 'WARN', `${t.noLang} Tamil text elements without lang="ta" (affects shaping, hyphenation and screen readers)`, tag);
    if (t.noFont) rule('tamil-font', 'WARN', `${t.noFont} Tamil text elements have no Tamil-capable font in their stack; they will use whatever the device falls back to`, tag);
    if (t.tight.length) rule('tamil-line-height', 'WARN', `Tamil text with line-height under 1.28: ${t.tight.join(', ')}. Tamil needs room for vowel signs above and below`, tag);
    if (t.tracking.length) rule('tamil-tracking', 'WARN', `negative letter-spacing on Tamil text: ${t.tracking.join(', ')}. It collides vowel signs`, tag);
    if (t.small) rule('tamil-size', 'WARN', `${t.small} Tamil text elements under 15px`, tag);
    if (t.upper) rule('tamil-uppercase', 'WARN', `text-transform: uppercase on ${t.upper} Tamil elements (no effect; remove)`, tag);
  }
}

export function keyboardRules({ stops, trap }, focusable, rule, tag) {
  if (trap) rule('keyboard-trap', 'FAIL', `focus gets stuck on "${trap.name}" (${trap.tag}); Tab cannot leave it`, tag);
  const noRing = stops.filter((s) => !s.ok);
  if (noRing.length) rule('focus-ring', 'FAIL', `${noRing.length} of ${stops.length} keyboard stops show no visible focus indicator: ${noRing.slice(0, 4).map((s) => s.name || s.tag).join(', ')}`, tag);
  if (focusable && stops.length < focusable * 0.6) rule('keyboard-reach', 'WARN', `Tab reached ${stops.length} of ${focusable} interactive elements`, tag);
  if (!stops.length && focusable) rule('keyboard-reach', 'FAIL', 'Tab key moved focus to nothing', tag);
}

export function motionRules(rm, rule, tag) {
  if (!rm) return;
  if (rm.hidden.length) rule('rm-hidden-content', 'FAIL', `with prefers-reduced-motion, text stays invisible: ${rm.hidden.join(', ')}`, tag);
  if (rm.infinite) rule('rm-animations', 'WARN', `${rm.infinite} infinite animations still run with prefers-reduced-motion`, tag);
}
