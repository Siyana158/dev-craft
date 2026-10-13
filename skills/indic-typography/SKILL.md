---
name: indic-typography
description: Set Tamil (and other Indic script) text on the web correctly, covering font choice, line-height, letter-spacing, sizes, mixed Tamil-English text, form controls, language tags and loading. Use whenever a page, component or app contains Tamil, Devanagari, Telugu, Kannada, Malayalam or Bengali text, or when the user asks for a Tamil or bilingual interface. Pairs with web-ui-design; its inspector reports Tamil-specific problems.
---

# indic-typography

Latin-script defaults break Indic text. Tight leading, negative tracking, heavy display weights and system fallbacks that look fine in English make Tamil collide, clip or fall back to an arbitrary device font. Apply these rules whenever Tamil appears, then verify with the inspector.

Tamil is the reference script below; the same rules hold for the other Indic scripts, with the font names swapped.

## 1. Tag the language
- `<html lang="ta">` for a Tamil page, `<html lang="en">` for an English page that contains Tamil pieces.
- Mark every switch: `<span lang="en">Wi-Fi</span>` inside Tamil text, `<span lang="ta">தமிழ்</span>` inside English.
- Why: the browser picks the right shaping and hyphenation rules, and screen readers pick the right voice.

## 2. Choose a font that has the script
Never rely on the device fallback. List a Tamil face explicitly, after the Latin face, so Latin letters and digits use your chosen design and Tamil falls through to a real Tamil font.

| Voice | Tamil face (Google Fonts) | Notes |
|---|---|---|
| Neutral UI, body | Noto Sans Tamil | Widest weight range; safest default |
| Friendly, rounded | Baloo Thambi 2 | Display and playful pages |
| Book, editorial | Noto Serif Tamil, Tiro Tamil | Long reading, quiet luxury |
| Compact UI, tables | Hind Madurai, Mukta Malar | Narrower; good for data |
| Wide, flexible | Anek Tamil | Variable width; check weights you use |

```css
:root {
  --ui: "Figtree", "Noto Sans Tamil", system-ui, sans-serif;
}
html { font-family: var(--ui); }
```
Check that the weights you request exist for the Tamil face; a missing weight is synthesised and looks smeared.
Windows ships Latha and Nirmala UI; macOS ships Tamil Sangam MN. They are acceptable fallbacks, not design choices.

## 3. Space the text for the script
Tamil has vowel signs that sit above, below and on both sides of the consonant, and a taller visual footprint than Latin.

| Property | Latin default | Tamil |
|---|---|---|
| Body `line-height` | 1.4 to 1.6 | **1.65 to 1.85** |
| Heading `line-height` | 0.9 to 1.1 | **1.25 to 1.4** |
| `letter-spacing` | negative on headings is common | **0 always**; never negative |
| Body size | 16px | **17 to 18px**; Tamil looks smaller at the same px |
| Heading size | as designed | reduce 10 to 15 percent; Tamil strings run 30 to 60 percent longer |
| `text-transform` | uppercase allowed | **none**; Tamil has no case |
| Italic | allowed | **avoid**; there is no true Tamil italic. Use weight or colour for emphasis |

Rules of thumb:
- Do not use `font-weight` 800 or 900 on Tamil unless the face has it; stay at 400 to 700.
- Never use `word-break: break-all`. It splits words mid-syllable. Prefer `overflow-wrap: anywhere` only in narrow containers.
- `text-wrap: balance` and `pretty` work with Tamil; keep them on headings and paragraphs.
- Justified text opens rivers in long Tamil words; keep text left-aligned.

## 4. Fit headlines
Tamil is agglutinative: words are long and do not break. A headline that is two lines in English can be three in Tamil.
- Write shorter Tamil headlines (fewer words) instead of shrinking type to fit. The same meaning often takes more characters in Tamil than in English, so count in Tamil, not in English.
- Test the longest real string at 390px and 1440px. The inspector fails headings over two lines.
- Give containers room: avoid fixed widths in `ch` tuned for English.

## 5. Mixed Tamil and English
- Put the Latin face first in the stack, the Tamil face second (see section 2).
- If the two faces differ in apparent size, adjust with `font-size-adjust` or a scoped `@font-face` using `size-adjust` rather than changing sizes per element.
- Numbers: use Western Arabic digits (0 to 9) unless the audience expects Tamil numerals. Use `₹` and Indian grouping: `toLocaleString('en-IN')`, or `'ta-IN'` for Tamil number words and dates.
- Dates: `new Intl.DateTimeFormat('ta-IN', { dateStyle: 'long' })`.

## 6. Form controls and buttons
Form controls do not inherit fonts by default and quietly fall back to the system face.
```css
button, input, select, textarea { font: inherit; letter-spacing: inherit; }
```
Check placeholder, option and validation text separately.

## 7. Loading
Tamil fonts are heavier than Latin ones (often tens to a few hundred KB per weight; measure yours).
- Request only the weights you use; `display=swap`.
- Preconnect to the font host and, when self-hosting, preload the one weight used above the fold.
- Provide a sensible fallback stack so text appears immediately and does not reflow wildly.

## 8. Content
- Write Tamil copy natively; do not paste machine translation without a native-speaking read. Spelling, sandhi and register (formal vs colloquial) matter to readers.
- Keep labels short; buttons in Tamil are longer than their English counterparts, so give them room and avoid fixed widths.
- Provide a language switch where both versions exist (`<a hreflang="en" lang="en">English</a>`).

## 9. Test with real strings
Render these and look for clipped or colliding marks:

`தமிழ்நாடு · ஸ்ரீ · க்ஷ · ஜ · ஔ · கொ கோ கௌ · கூட்டுறவுச் சங்கத்தினருக்கான · ₹1,250`

## 10. Verify
```bash
node <web-ui-design-skill>/scripts/inspect.mjs <page>
```
Tamil-specific rules the inspector reports:

| Rule | Level | Meaning |
|---|---|---|
| `tamil-lang` | WARN | Tamil text without `lang="ta"` |
| `tamil-font` | WARN | No Tamil-capable font in the stack |
| `tamil-line-height` | WARN | Line-height below 1.3 |
| `tamil-tracking` | WARN | Negative letter-spacing |
| `tamil-size` | WARN | Text under 15px |
| `tamil-uppercase` | WARN | Pointless `text-transform: uppercase` |
| `headline-lines` | FAIL | Heading over two lines (common after translation) |

Passing is necessary, not sufficient: open the screenshots and read the Tamil. Look at stacked vowel signs, the edges of buttons and cards, and the second line of every headline.

## Other Indic scripts
Same method; swap the faces: Noto Sans Devanagari, Hind (Devanagari), Noto Sans Telugu, Noto Sans Kannada, Noto Sans Malayalam, Noto Sans Bengali. Devanagari additionally needs room for the headline bar (shirorekha) and matras above; keep line-height at 1.5 or more. Verify each face supports the weights you request.
