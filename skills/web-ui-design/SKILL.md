---
name: web-ui-design
description: Design and build web pages and UI components with deliberate hierarchy, a real type and colour system, complete content, and measured quality. Use when asked to create, style or polish a landing page, product page, portfolio, marketing site, hero, or component, or when a page feels flat, generic or unfinished. Builds from a written brief and a tokens file, then verifies with a browser-based inspector and screenshots. For improving an existing page, use ui-redesign instead.
---

# web-ui-design

Method in one line: **brief -> tokens -> weight map -> copy -> build -> measure -> look**.
Each stage leaves an artifact you can point at. If a stage has no artifact, it did not happen.

Paths below use `<skill>` for this skill's folder.

## Stage 1. Brief card
Write a card of at most 10 lines before anything else. Infer instead of interrogating; ask only when a missing fact blocks the work.

```
Page for:       <what it is, who visits>
The one action: <what a visitor should do>
Proof we have:  <real facts, numbers, pictures, testimonials that exist>
Proof we lack:  <what must NOT be invented>
Stack:          <framework, styling, existing tokens>
Brand fixed:    <colours, fonts, logo, or "none">
Feeling:        <two or three adjectives, plus one thing it must NOT feel like>
Direction:      <one row from references/directions.md, and one sentence on why>
Design dials:   <variance 1-10; motion 1-10; density 1-10, with a short reason>
```
Choose the direction from the audience and subject, not from habit. Read `<skill>/references/directions.md` first: it lists seven directions with palette, type, structure and motion, and a variety guard so successive pages do not converge on the same recipe. Set the three dials using `<skill>/references/directions.md`; infer sensible values from the brief when the user has no preference, and record the reason. Existing brand rules, accessibility and the page's purpose take priority over any dial.
Read `package.json` and the existing files first. Reuse the project's stack and components. Never import a package without checking it is installed.

## Stage 2. Specificity ledger
List five facts that are true of this subject and of no competitor (a name's meaning, a place, a number, a constraint, a material, a ritual, an object it makes). The headline, the hero visual and at least two later sections must each use one. If every item on the ledger could belong to a rival, the page will read as a template; gather better facts before designing.

## Stage 3. Tokens file first
Create the tokens before any component, as CSS custom properties in one place (`tokens.css`, `:root`, or the Tailwind theme):
- **Colour roles:** `--ground`, `--ink`, `--accent`, `--surface-1`, `--surface-2`. One accent. Check contrast pairs now (text 4.5:1, large text 3:1).
- **Type:** one family is the default, two the maximum. A scale of at most six steps. Fluid `clamp()` for display sizes. Body 16-20px, line-height 1.45-1.6, 45-75 characters per line.
- **Space:** a 4/8px scale. One content width, one page margin.
- **Shape and motion:** one radius family, one easing curve, two durations.
- Apply the density dial to content width, spacing, and how much information shares a screen. Apply the variance dial to composition and type scale; keep the chosen direction recognizable. Apply the motion dial to the amount and distance of movement, never to whether controls provide feedback.
Downstream code references tokens only; no raw hex or pixel values in components.
For framework-specific configurations (Tailwind CSS v4 `@theme`, Tailwind v3 config, Shadcn/Radix variables, DTCG JSON), refer to `<skill>/references/token-adapters.md`.

## Stage 4. Weight map
For each section, write one line: **what is the dominant element, and what is its job?** One dominant element per screen; everything else supports it. Sketch the section order from the proof you have, one claim per section, and delete sections with no claim.

Vary composition between neighbours (full-bleed field, split, list with large type, single object, table). Do not repeat a layout twice in a row. Prefer an asymmetric or edge-to-edge hero over a centred stack unless the brief calls for calm formality. Give each screen a clear reading path: size, then colour, then position.

## Stage 5. Copy before markup
Write the full text in a plain file first.
- Headline: say what it is or what it gives, in words a visitor would use. Aim for two lines at every width.
- One primary action, named for its outcome ("Book a table", not "Submit").
- Every section is complete: full menus, real prices, every plan's contents, an answer per real question. A thin section loses to a fuller one.
- Sample content is allowed where the brief has gaps, but list it in the report. Do not invent testimonials, logos, press, user counts or statistics.
- Plain, specific language. Sentence case. Messy real numbers over round ones.

## Stage 6. Build
Order: hero at desktop and phone width -> sections in sequence -> imagery -> interactive element -> states.
- Mobile-first. The phone layout is its own composition, not a squeezed desktop one.
- Use `min-height: 100dvh` for full-height sections, CSS grid for structure, `text-wrap: balance` on headings.
- **Imagery order of preference:** the project's own -> generated, if a tool exists -> credited open-licence pictures that honestly depict the subject's world -> illustration drawn in code from the subject -> procedural textures, grain & geometric SVG patterns (see `<skill>/references/textures-and-patterns.md`) -> type and colour alone. Never present a found picture as the client's own product, room or team. Never use placeholder boxes or fake product shots.
- **One interactive element** tied to the subject (a configurator, calculator, timer, live status). It needs real content, a thumb-sized layout and a no-script fallback.
- **Full component state coverage:** resting, hover, pressed, `:focus-visible`, disabled. Data containers must handle loading (layout-preserving skeleton), empty (zero-data with action), and error/offline states. See `<skill>/references/component-states.md`.
- Semantic landmarks, one `h1`, labelled inputs, alt text, a skip link, a favicon, title, description and social meta.

## Stage 7. Motion pass
Only after the page stands without it. Use the motion dial to choose restrained feedback or richer entrances; even high motion must remain purposeful and avoid competing with reading. Entrances may stagger by section part (heading, text, media), triggered once with `IntersectionObserver`, rising 16-32px with opacity, and content must remain visible if script fails. Feedback on every control. Animate `transform` and `opacity` only. Use a custom curve, never `linear`. Provide a `prefers-reduced-motion` fallback that keeps content and removes travel.

## Stage 8. Measure
```bash
node <skill>/scripts/lint.mjs <folder-or-files>
node <skill>/scripts/inspect.mjs <url-or-index.html>
node <skill>/scripts/diff.mjs --before .dev-craft/baseline --after .dev-craft/inspect
```
`lint.mjs` scans source for placeholder text, cliche copy, dead links, missing alt, viewport-unit and easing mistakes. `inspect.mjs` opens the page in a real browser at 1440, 768 and 390px and reports headline line counts, overflow, contrast, font families actually loaded, missing labels, small tap targets, metadata, imagery count, DOM tree complexity, layout shift (CLS), and saves full-page screenshots to `.dev-craft/inspect/`. Fix every `FAIL`. Treat each `WARN` as a defect unless you can defend it in one sentence. Add `--strict` for opinionated taste checks. For visual regression against a baseline, `diff.mjs` generates an interactive slider report at `.dev-craft/diff.html`. Needs Node 22+ and any installed Chrome, Edge or Chromium; nothing to install.

## Stage 9. Look
The measurements say what is measurable, not what is good. Open the screenshots and answer, in writing:
1. **Five-second test:** what is it, who is it for, what do I do? Could a stranger answer from the first screen alone?
2. **Squint test:** blur your eyes mentally; is there exactly one dominant shape per screen?
3. **Swap test:** replace the name with a competitor's. Does the page still make sense? If yes, the specificity ledger was not used.
4. **Thumb test:** at 390px, can every action be reached and read without zoom?
5. **Emptiness:** is any screen mostly blank because a section is underbuilt?
6. **Alignment:** do shared edges line up; do buttons and lists in sibling cards start at the same height?
List the three worst problems, fix them, re-run the inspector, look again. Stop after three rounds.

## Stage 10. Report
Brief card and ledger in two lines; what was measured and the result; what was looked at; sample content to replace; image sources and licences; known gaps. Never claim a check that was not run. If no browser was available, say the inspector did not run.

## Calibration
- Dashboards and dense tools: keep stages 1, 3, 6, 8, 9; skip the specificity ledger and weight-map drama. Density and clarity win.
- A single component: match its surroundings, build its states, still measure it.
- Existing brand: map the brand's values onto the token roles; take only composition decisions from this skill.
