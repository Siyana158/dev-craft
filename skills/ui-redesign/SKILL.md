---
name: ui-redesign
description: Improve an existing web page, site or app UI that works but looks weak, dated, inconsistent or generic, without breaking it or changing its stack. Use when the user points at current UI and asks to polish, restyle, modernize, fix, review or "make it look professional". Triages the problems, changes the lowest-risk layer first, and proves nothing broke.
---

# ui-redesign

Principle: **change the lowest layer that fixes the problem.** Most visual debt lives in tokens and global styles; touching markup or layout is the last resort. Never migrate frameworks or rewrite from scratch.

## 1. Baseline (before touching anything)
- Identify the stack: framework, styling approach (Tailwind v3 vs v4, CSS modules, vanilla, CSS-in-JS), where tokens live, which components are shared.
- Run the app. Capture screenshots at 375, 768 and 1440 into `.dev-craft/before/`. If the web-ui-design skill's scripts are available, run `inspect.mjs` and `lint.mjs` and keep the output as the baseline numbers.
- Note what already works. Behaviour, routes, copy and brand assets are protected unless the user says otherwise.

## 2. Triage with five lenses
Review each lens and write findings as `file:line - symptom - proposed fix - risk (low/med/high)`.

**Hierarchy.** Is there one obvious focal point per screen? Are headings, body and captions clearly different in size and weight? Is the primary action the most visible control? Symptoms: everything the same size, three competing buttons, timid headlines, lines over 75 characters, orphaned words.

**Rhythm.** Is spacing from a scale or arbitrary? Do sibling cards align (titles, prices, buttons, list starts)? Is there a content max-width and consistent page margin? Symptoms: cramped sections, random gaps, ragged card baselines, stretched edge-to-edge text on wide screens, `100vh` jumps on mobile.

**Colour and surface.** Count the colours in use. Is there one accent and a coherent neutral family? Do surfaces separate through tone rather than a border plus shadow on everything? Symptoms: several accents, mixed warm and cool greys, pure `#000`/`#fff` slabs, one dark band in a light page, text under contrast, saturated accents fighting for attention.

**Interaction.** Does every control respond? Symptoms: no hover or pressed feedback, missing `:focus-visible`, instant or `linear` transitions, spinners instead of skeletons, empty screens with no next step, errors via `alert()`, dead `#` links, no current-page marker in navigation, animation of layout properties.

**Trust and access.** Does the page look real and work for everyone? Symptoms: placeholder names and round numbers, cliche copy, Lorem ipsum, identical avatars or dates, stock team photos, missing alt text or labels, div soup instead of landmarks, no skip link, no 404, no privacy and terms links, missing title, description and favicon, unlabeled icon-only controls.

## 3. Choose a change tier
Work upward; stop when the lens findings are resolved.

| Tier | Layer | Typical changes | Risk |
|---|---|---|---|
| 0 | Tokens and globals | font family and scale, colour roles, spacing scale, radius, easing, base focus ring, `text-wrap`, max-width | very low |
| 1 | Component CSS | hover, pressed and focus states, alignment fixes, card surfaces, button hierarchy, contrast | low |
| 2 | Markup | semantic landmarks, labels, alt text, skeleton and empty and error states, active-nav marker | medium |
| 3 | Layout | replacing equal-card rows, new section compositions, hero restructure, navigation pattern | higher: confirm with the user first |

Show the user the findings list with proposed tier per item before Tier 3, and whenever more than about a third of files would change.

## 4. Replacement guide (swap the pattern, keep the purpose)
- Three equal feature cards -> one dominant item with supporting items, an alternating list, or a table of facts.
- Four-column footer link farm -> name, a few key links, legal links.
- Accordion FAQ -> two-column plain Q and A when there are fewer than ten.
- Dotted testimonial carousel -> one strong quote, or a wall of short ones. Only real quotes.
- Three-tower pricing with a taller middle -> highlight the recommended plan by colour; align feature lists to start at the same height.
- Modal for simple actions -> inline editing or a slide-over.
- Generic gradient hero -> a real picture, a flat field of colour, or oversized type.
- Rocket/shield icon metaphors -> specific icons or none. One icon set, one stroke weight.
- Sidebar by default on dashboards -> consider top navigation; if a sidebar stays, expanded with labels by default, optional 56-72px icon rail with accessible names and 44px targets, drawer below the tablet breakpoint, collapsed content `inert`.

## 5. Order of work
1. Fonts and type scale (largest visible gain for least risk)
2. Colour roles and contrast
3. Interaction states and focus
4. Spacing, grid, max-width, alignment
5. Component replacements
6. Loading, empty, error states
7. Copy, meta, motion polish

Make one logical change at a time. After each tier, rebuild, run tests if present, reload, and compare screenshots.

## 6. Rules of engagement
- Same stack, same dependencies. If a dependency is truly needed, check the dependency file, state why, and ask.
- Preserve behaviour. If a visual change alters behaviour (focus order, URLs, form fields), stop and flag it.
- Keep diffs reviewable. Prefer editing tokens over touching each component.
- Respect an existing brand. If the brand itself uses a pattern this skill would change (gradient logo, violet accent), keep it and say so.

## 7. Verify and hand over
- Capture `.dev-craft/after/` at the same three widths and compare with before.
- Generate an interactive comparison slider using `node <web-ui-design-skill>/scripts/diff.mjs --before .dev-craft/baseline --after .dev-craft/after` to inspect before/after differences side by side.
- Rerun `inspect.mjs` and `lint.mjs` if available; report numbers before and after.
- Check by hand: no horizontal scroll, no console errors, keyboard tab order and focus visible, primary flows and component states (loading, empty, error) still work.
- Write `REDESIGN.md` (or reply in chat) with: what changed per tier, what was deliberately left, risks, and anything unverified. Do not claim a check that was not run.
