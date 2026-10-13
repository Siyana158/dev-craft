# Indic typography

The `indic-typography` skill covers Tamil first, with notes for other Indic scripts. Install the repo and ask for a Tamil or bilingual page; the skill is picked up when Tamil text is involved.

## Why a separate skill

Latin defaults harm Indic text:

| Default | What goes wrong in Tamil |
|---|---|
| Tight heading line-height (0.9 to 1.1) | Vowel signs above and below collide with neighbouring lines |
| Negative letter-spacing | Marks overlap the consonants |
| No Tamil font in the stack | The device falls back to an arbitrary face, different on every phone |
| English-sized headlines | Tamil words are long and do not break, so headlines run to 3 or 4 lines |
| Form controls without `font: inherit` | Inputs and buttons use the system font |

## Quick rules

- `lang="ta"` on the page; `lang="en"` on English fragments inside it.
- A named Tamil face after the Latin one: `font-family: "Figtree", "Noto Sans Tamil", system-ui, sans-serif`.
- Body line-height 1.65 to 1.85, headings 1.25 to 1.4, letter-spacing 0.
- Body 17 to 18px; avoid weights the face does not provide.
- No uppercase, no italic emphasis.
- Shorter headlines rather than smaller type.
- `button, input, select, textarea { font: inherit; }`.

The full skill is in [skills/indic-typography/SKILL.md](../skills/indic-typography/SKILL.md).

## Example

[examples/thulir-tamil](../examples/thulir-tamil/index.html) is the Tamil version of the preschool page, with the age-based group finder working in Tamil. It passes the inspector with no Tamil warnings.

Things the example does on purpose:

- Headlines reduced to about 3.4vw so that they stay on two lines.
- The longest English heading was replaced by a shorter Tamil one ("வந்து பாருங்கள்.").
- Every `h1` to `h3` uses line-height 1.38.
- The age slider output and fee are formatted in Tamil and with Indian digit grouping.

## Checking your own page

```bash
node skills/web-ui-design/scripts/inspect.mjs ./index.html
```

Read the screenshot as well. The inspector cannot tell you whether the Tamil text is correct, natural or the right register; have a native reader check it.
