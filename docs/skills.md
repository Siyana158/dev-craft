# Skills reference

## web-ui-design

Builds or polishes a page or component. Ten stages, each leaving an artifact.

| Stage | Artifact | Purpose |
|---|---|---|
| 1. Brief card | 10-line card | Audience, the one action, proof available and missing, stack, brand, feeling |
| 2. Specificity ledger | 5 facts | Things true of this subject and no competitor; they feed the headline, hero and later sections |
| 3. Tokens file | `tokens.css` or theme | Colour roles, type scale, spacing, radius, easing; components use tokens only |
| 4. Weight map | one line per section | The dominant element of each screen and its job; neighbouring sections differ |
| 5. Copy | text file | Complete content before markup; no invented proof |
| 6. Build | the page | Mobile-first, one interactive element, all states, semantics |
| 7. Motion | staggered entrances, feedback | `transform`/`opacity` only, reduced-motion fallback |
| 8. Measure | inspector and lint output | Objective checks at three widths |
| 9. Look | written critique | Five-second, squint, swap, thumb tests, emptiness, alignment |
| 10. Report | summary | What was measured, what is sample content, known gaps |

**Directions.** The brief card includes a direction chosen from `skills/web-ui-design/references/directions.md`: editorial bold, modern product (dark), soft light, technical grid, playful, quiet luxury, raw/utilitarian. Each lists palette, type, structure and motion, plus a variety guard so consecutive pages do not repeat the same recipe.

Use it for landing pages, product pages, portfolios, marketing sites, heroes and components. For dashboards keep stages 1, 3, 6, 8 and 9.

## ui-redesign

Improves existing UI without changing the stack or behaviour.

1. **Baseline:** identify the stack, run the app, capture before screenshots and baseline measurements.
2. **Triage with five lenses:** hierarchy, rhythm, colour and surface, interaction, trust and access. Each finding is written as `file:line - symptom - fix - risk`.
3. **Change tiers:** work upward and stop when findings are resolved.

| Tier | Layer | Risk |
|---|---|---|
| 0 | Tokens and globals | very low |
| 1 | Component CSS | low |
| 2 | Markup | medium |
| 3 | Layout (confirm with the user first) | higher |

4. **Verify:** after screenshots, rerun the scripts, hand-check keyboard and primary flows, write `REDESIGN.md`.

## complete-output

Guarantees full deliverables.

1. Write a numbered delivery list from the request.
2. Build each item to final form; large items go to files.
3. Forbidden shortcuts: stand-ins for code (`...`, `TODO`, empty bodies), stand-ins for writing ("etc.", "for brevity"), sampling instead of delivering, deferring to the user.
4. Close with a ledger: each item is *done and verified*, *done, not verified (reason)* or *not done (reason)*.
5. If output must be split, stop at a clean boundary and end with `CONTINUE-FROM: <item> (<n> of <total> done)`.
6. Honesty overrides completeness: never invent data to fill a gap.

## Using them together

A typical build: `complete-output` for "give me the whole site, no placeholders", `web-ui-design` for how it is designed and checked. A typical rescue: `ui-redesign` first, then `web-ui-design` for any new section it adds.
