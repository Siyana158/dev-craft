<div align="center">

# ui-craft

**Agent skills that make web UI decided, complete and measured.**

A design method, a redesign method for existing projects, and a completeness guard,<br>
plus two dependency-free scripts that check the result in a real browser.

![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)
![Node 22+](https://img.shields.io/badge/node-22%2B-brightgreen.svg)
![Dependencies: none](https://img.shields.io/badge/dependencies-none-lightgrey.svg)

</div>

## Install

```bash
npx skills add Siyana158/ui-craft-skills
```

Run it from the root of your project. It copies three skills into `.agents/skills/`, links them for the tools it detects, and records the source in `skills-lock.json`. Start a new session afterwards so the skills are listed.

| You need | For |
|---|---|
| Node 18+ | installing, and `lint.mjs` |
| Node 22+ and any installed Chrome, Edge or Chromium | `inspect.mjs` |

Works with any agent that reads `SKILL.md` skills (see the `skills` CLI for supported tools).

**Try it.** After installing, ask in plain language: *"build a landing page for a small bakery"*. The agent should write a brief card, a tokens file and the copy first, then build the page, then run the inspector and show screenshots.

**Update or remove.** Re-run the install command to update. To remove, delete the three folders from `.agents/skills/` and the matching entries in `skills-lock.json`.

**Without the installer.** Copy `skills/*` into your tool's skills folder by hand, or clone the repo and run the scripts directly.

Skills can run commands with your agent's permissions. Read `skills/*/SKILL.md` and the two scripts before first use.

<p align="center">
  <img src="docs/images/example-desktop.png" alt="Desktop view of the example page: a large two-line headline and a red tin-label block" width="720">
  &nbsp;
  <img src="docs/images/example-mobile.png" alt="Mobile view of the same page at 390 pixels wide" width="200">
</p>
<p align="center"><sub>Left: an editorial page, <a href="examples/kettle-and-co/index.html">examples/kettle-and-co</a>. Pages are single files; open them directly in a browser.</sub></p>

<p align="center">
  <img src="docs/images/kora-desktop.png" alt="A dark product landing page: gradient headline, floating navigation and an app preview" width="720">
</p>
<p align="center"><sub>A different direction from the same method, <a href="examples/kora/index.html">examples/kora</a>: dark product page with a live savings simulator.</sub></p>

## Why

A page made on autopilot is the average of every page seen before. ui-craft replaces that with a short chain where each stage leaves something you can point at, and where the result is measured in a browser instead of assumed.

**brief → tokens → weight map → copy → build → measure → look → report**

## The skills

| Skill | Use it when | What it does |
|---|---|---|
| **`web-ui-design`** | building or polishing a page or component | Brief card, specificity ledger, tokens first, weight map, copy before markup, build, motion pass, **measure**, **look**, report |
| **`ui-redesign`** | improving UI that already exists | Baseline screenshots, five-lens triage, change tiers from tokens up to layout, replacement guide, before/after proof |
| **`complete-output`** | you need full files and no shortcuts | Delivery list, banned shortcuts, close-out ledger with verified / not verified per item, clean split protocol |

Ask in plain language ("build a landing page for my bakery", "this dashboard looks generic, fix it", "write the whole file, no placeholders") and the matching skill is picked up from its description.

## The scripts

Both live in `skills/web-ui-design/scripts/`. They need Node 22+ and any installed Chrome, Edge or Chromium. Nothing is installed from npm.

```bash
# scan source for placeholder text, cliche copy, dead links, missing alt, vh and easing mistakes
node skills/web-ui-design/scripts/lint.mjs ./src

# open the page at 1440 / 768 / 390 px, measure it, save full-page screenshots
node skills/web-ui-design/scripts/inspect.mjs ./index.html
node skills/web-ui-design/scripts/inspect.mjs http://localhost:3000 --strict
```

Sample output:

```text
fonts loaded: Bricolage Grotesque
screenshot: .ui-craft/inspect/1440.png
screenshot: .ui-craft/inspect/768.png
screenshot: .ui-craft/inspect/390.png
WARN [imagery] 0 real pictures/videos on the page; strong pages usually carry 4 or more (1440px)
WARN [tap-targets] targets under 44px: Kettle & Co., Shop (390px)

0 FAIL, 6 WARN. Open the screenshots and critique them: the meter only measures what is measurable.
```

`inspect.mjs` checks, per viewport: horizontal overflow, headline line counts, WCAG AA contrast, font families actually loaded, missing form labels and alt text, tap targets, `h1` / title / lang / description, focus styles, reduced-motion handling, number of real pictures, number of animated elements. It exits `1` on any `FAIL`.

By default only objective checks run. `--strict` adds opinionated taste checks (monospace, tiny tracked caps, gradients, resting shadows). `--allow rule,rule` silences a rule you accept.

## Documentation

- [Getting started](docs/getting-started.md): install, requirements, first use
- [Skills reference](docs/skills.md): every stage of every skill
- [Scripts reference](docs/scripts.md): every rule, exit codes, CI example
- [FAQ](docs/faq.md): common problems

## Design stance

- Objective rules are enforced; taste is opt-in.
- Every stage leaves an artifact (brief, tokens, copy, report). No artifact, no stage.
- Measurements are necessary, never sufficient: looking at the screenshots is a required stage.
- No invented proof: no fake customers, quotes, press or statistics.

## Credits

Skills for design quality have been explored by others, notably [taste-skill](https://github.com/Leonxlnx/taste-skill). ui-craft is an independent work with its own structure, text and scripts; no text or code was copied from it.

## License

[MIT](LICENSE)
