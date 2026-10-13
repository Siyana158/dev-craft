# Scripts reference

Both scripts live in `skills/web-ui-design/scripts/` (after install: `.agents/skills/web-ui-design/scripts/`). Neither needs `npm install`.

## inspect.mjs

```bash
node inspect.mjs <url | path/to/index.html> [--out dir] [--allow rule,rule] [--strict]
```

Starts a headless browser, opens the page at **1440, 768 and 390 px**, scrolls through it so scroll-triggered content appears, measures it, and saves full-page screenshots to `--out` (default `.ui-craft/inspect/`).

Exit codes: `0` no FAIL, `1` at least one FAIL, `2` the tool could not run (no Node 22, no browser, page failed).

### Checks (default)

| Rule | Level | Meaning |
|---|---|---|
| `overflow` | FAIL | Page is wider than the viewport |
| `headline-lines` | FAIL | A heading wraps to more than two lines |
| `fonts` | FAIL | More than two font families in use |
| `contrast` | FAIL | Text below WCAG AA (4.5:1, or 3:1 for large text) |
| `alt` | FAIL | `<img>` without `alt` |
| `label` | FAIL | Form field without a label |
| `h1` | FAIL | Not exactly one `h1` |
| `title`, `lang` | FAIL | Missing `<title>` or `<html lang>` |
| `focus` | FAIL | No `:focus` or `:focus-visible` styles found |
| `generic-font` | WARN | Default-looking font such as Inter, Roboto, Arial |
| `type-sizes` | WARN | More than 12 distinct font sizes |
| `tap-targets` | WARN | Mobile targets under 44 px |
| `meta-description`, `main` | WARN | Missing description or `<main>` |
| `dead-links` | WARN | Links to `#` |
| `reduced-motion` | WARN | No `prefers-reduced-motion` handling |
| `imagery` | WARN | Fewer than 4 real pictures or videos |
| `motion` | WARN | Fewer than 8 elements with transitions or animations |
| `length` | WARN | Page unusually tall |

### Checks with `--strict`

Opinionated taste checks, all warnings: `mono` (monospace outside code), `tiny-caps` (tiny tracked uppercase labels), `gradient`, `shadow` (on resting elements).

### Notes

- The `imagery` and `motion` rules are prompts to look closer, not proof of a problem; use `--allow imagery` for a page that is deliberately typographic.
- Contrast is estimated from computed colours and the nearest opaque background; text over images is not evaluated.
- Passing the inspector does not mean the page is good. Open the screenshots.

## lint.mjs

```bash
node lint.mjs <file|folder> [...] [--allow rule,rule]
```

Scans `.html .css .scss .js .jsx .ts .tsx .vue .svelte .astro .mdx` files (skipping `node_modules`, `.git`, build folders) line by line. Exit `1` if any ERROR.

| Rule | Level | Finds |
|---|---|---|
| `lorem` | ERROR | Placeholder Latin text |
| `cliche-copy` | ERROR | Words like "seamless", "unleash", "game-changer" |
| `img-no-alt` | ERROR | `<img>` without `alt` |
| `alert` | ERROR | `alert()` calls |
| `placeholder-names` | WARN | "John Doe", "Acme" and similar |
| `round-numbers` | WARN | Suspicious statistics such as "99.99%" |
| `oops` | WARN | "Oops" error copy |
| `vh` | WARN | `100vh` instead of `100dvh` |
| `gradient`, `shadow`, `glass`, `pure-black` | WARN | Style choices worth a second look |
| `transition-all`, `linear-easing`, `animate-layout` | WARN | Motion mistakes |
| `generic-font`, `font-import` | WARN | Default-looking fonts |
| `z-index` | WARN | Arbitrary huge z-index values |
| `dead-link` | WARN | `href="#"` |
| `scroll-listener` | WARN | `scroll` listeners where `IntersectionObserver` fits |
| `emoji` | WARN | Emoji in UI source |
| `empty-alt-image` | WARN | Empty or generic alt text |
| `todo` | WARN | Leftover TODO or placeholder comments |

Lint matches text, so it can flag intentional uses (a gradient scrim under photo text, a decorative empty `alt`). Silence a rule with `--allow <rule>` and say why in your report.

## CI example

```yaml
- run: node .agents/skills/web-ui-design/scripts/lint.mjs src
- run: npx --yes serve -l 4173 dist &
- run: sleep 3 && node .agents/skills/web-ui-design/scripts/inspect.mjs http://localhost:4173
```

The CI runner needs Node 22 and a Chrome or Chromium binary (preinstalled on GitHub's `ubuntu-latest`).
