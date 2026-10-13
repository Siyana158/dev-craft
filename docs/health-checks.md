# Health checks

`inspect.mjs` runs a second group of checks from `health.mjs` on every page: layout health, accessibility, keyboard traversal and reduced motion. They exist because passing the basic checks does not mean a page works on a phone or for someone using a keyboard.

Run it as usual:

```bash
node skills/web-ui-design/scripts/inspect.mjs ./index.html
node skills/web-ui-design/scripts/inspect.mjs ./index.html --quick   # skip keyboard and reduced-motion passes
```

`--quick` skips the two passes that drive the browser (about 8 to 10 seconds saved).

## Layout health (every viewport)

| Rule | Level | Meaning |
|---|---|---|
| `clipped-content` | FAIL | Text is cut off by a parent with `overflow: hidden`, or runs past the screen edge with no scrollable ancestor. Catches content that the page-level overflow check misses |
| `narrow-text` | WARN | A block of text is squeezed under about 110px wide (the classic one-word-per-line column) |
| `svg-text-size` | WARN | Text inside an SVG renders under 10px after scaling, typical of diagrams shrunk onto a phone |

## Accessibility (static)

| Rule | Level | Meaning |
|---|---|---|
| `accessible-name` | FAIL | A link, button or form control has no text, `aria-label`, label or title |
| `duplicate-id` | FAIL | Two elements share an `id` |
| `heading-order` | WARN | A level is skipped, for example `h1` to `h3` |
| `scroll-region` | WARN | A horizontally scrollable area cannot be reached with the keyboard. Add `tabindex="0"` and an `aria-label` |

## Keyboard traversal (1440px)

The inspector presses Tab through the page and records every stop.

| Rule | Level | Meaning |
|---|---|---|
| `keyboard-trap` | FAIL | Focus cannot leave an element. Date and time inputs are given extra presses because they hold several fields |
| `focus-ring` | FAIL | A focused element looks the same as when unfocused (no outline, shadow, border, background or colour change). For visually hidden radios and checkboxes the neighbouring label is checked |
| `keyboard-reach` | WARN | Tab reached fewer than 60 percent of the interactive elements |

Notes: transitions and animations are switched off for this pass so style changes are read immediately. Radio groups count once, as browsers move through them with arrow keys.

## Reduced motion (1440px)

The page is reloaded with `prefers-reduced-motion: reduce`.

| Rule | Level | Meaning |
|---|---|---|
| `rm-hidden-content` | FAIL | Text is still invisible, usually a scroll-reveal that depends on animation |
| `rm-animations` | WARN | Infinite animations still run |

## Tamil and Indic text

See [indic-typography](../skills/indic-typography/SKILL.md). The inspector adds `tamil-lang`, `tamil-font`, `tamil-line-height`, `tamil-tracking`, `tamil-size` and `tamil-uppercase` automatically when the page contains Tamil.

## Limits

- Contrast is estimated from computed colours; text over images is not evaluated.
- The keyboard pass finds Tab stops, not whether the order makes sense. Read the order yourself.
- None of this replaces testing with a screen reader.
