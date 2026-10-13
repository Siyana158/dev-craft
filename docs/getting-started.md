# Getting started

## Install

```bash
npx skills add Siyana158/ui-craft-skills
```

This copies four skills into your project's `.agents/skills/` and links them for the agents you use. Start a new agent session afterwards so the skills are listed.

Skills run with your agent's permissions. Read `skills/*/SKILL.md` before relying on them.

## Requirements

| For | You need |
|---|---|
| The skills themselves | An agent that reads `SKILL.md` files |
| `inspect.mjs` | Node 22 or newer, and any installed Chrome, Edge or Chromium |
| `lint.mjs` | Node 18 or newer |

Nothing is installed from npm. If your browser is in an unusual place, set `CHROME_PATH` to its executable.

## First use

Ask your agent in plain language. The skill is chosen from its description.

| You say | Skill used |
|---|---|
| "Build a landing page for my bakery" | `web-ui-design` |
| "This dashboard looks generic, improve it" | `ui-redesign` |
| "Write the full file, no placeholders" | `complete-output` |

You can also name a skill: "use web-ui-design to build the pricing page".

## What you should see

For `web-ui-design` the agent should produce, in order: a brief card, a specificity ledger, a tokens file, a section-by-section weight map, the copy, the page, then inspector output and screenshots in `.ui-craft/inspect/`, and a closing report. If the agent skips straight to code, ask it to follow the skill's stages.

## Update and remove

```bash
npx skills add Siyana158/ui-craft-skills     # re-run to update
```

To remove, delete the four folders from `.agents/skills/` (and any symlinks your agent created).
