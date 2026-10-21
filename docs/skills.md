# Skills reference

## web-ui-design

Builds or polishes a page or component. Ten stages, each leaving an artifact.

| Stage | Artifact | Purpose |
|---|---|---|
| 1. Brief card | 10-line card | Audience, the one action, proof available and missing, stack, brand, feeling, design direction and three calibrated dials |
| 2. Specificity ledger | 5 facts | Things true of this subject and no competitor; they feed the headline, hero and later sections |
| 3. Tokens file | `tokens.css` or theme | Colour roles, type scale, spacing, radius, easing; components use tokens only |
| 4. Weight map | one line per section | The dominant element of each screen and its job; neighbouring sections differ |
| 5. Copy | text file | Complete content before markup; no invented proof |
| 6. Build | the page | Mobile-first, one interactive element, all states, semantics |
| 7. Motion | staggered entrances, feedback | `transform`/`opacity` only, reduced-motion fallback |
| 8. Measure | inspector and lint output | Objective checks at three widths |
| 9. Look | written critique | Five-second, squint, swap, thumb tests, emptiness, alignment |
| 10. Report | summary | What was measured, what is sample content, known gaps |

**References and guides:**
- `skills/web-ui-design/references/directions.md`: Seven design recipes (editorial bold, modern product, soft light, technical grid, playful, quiet luxury, raw/utilitarian) with variety guards.
- `skills/web-ui-design/references/token-adapters.md`: Mappings for Tailwind CSS v4 `@theme`, Tailwind v3, Shadcn/Radix variables, and DTCG JSON tokens.
- `skills/web-ui-design/references/textures-and-patterns.md`: Procedural SVG grain/noise, architectural grids, dot matrices, and organic mesh gradients for when real photos are not yet available.
- `skills/web-ui-design/references/component-states.md`: Complete states matrix (resting, hover, active, focus-visible, disabled, skeleton loading, empty, error/offline).

Use it for landing pages, product pages, portfolios, marketing sites, heroes and components. For dashboards keep stages 1, 3, 6, 8 and 9.

## backend-development

Designs and implements complete server-side flows in the project's existing stack.

1. **Scope:** identify callers, required flows, owned data, integrations and constraints.
2. **Map:** inspect routes, models, migrations, auth, configuration and checks already in the repo.
3. **Contract and data:** define API behavior, validation, persistence constraints, migrations and transaction boundaries.
4. **Implement:** build each vertical request-to-storage path, including errors, retries and integration timeouts.
5. **Secure:** enforce authentication and per-resource authorization; protect inputs, credentials, personal data and outbound requests.
6. **Verify:** run focused unit, integration and request checks, plus the project's available static checks.
7. **Operate:** review safe configuration, logs, health, migration rollout and documentation; report known limits.

Use it for APIs, background jobs, persistence and integrations. It preserves the current framework and asks only when a missing decision changes the contract, data model or access rules.

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

4. **Verify:** after screenshots, rerun the scripts, launch the interactive visual diff slider (`diff.mjs`), hand-check keyboard and primary flows, write `REDESIGN.md`.

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
