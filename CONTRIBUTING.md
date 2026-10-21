# Contributing

Thanks for considering a contribution. Changes should make the skills easier to apply, the scripts more dependable, or the examples more useful while keeping the project focused on complete, accessible web work.

## Before you edit

1. Read the skill or script you plan to change and the related page in `docs/`.
2. Check the current README and examples so new guidance agrees with the published workflow.
3. Keep changes focused. Explain the user-facing problem the change solves.

## Where changes belong

| Change | Location |
|---|---|
| New or revised workflow | `skills/<skill-name>/SKILL.md` |
| Supporting design reference | `skills/web-ui-design/references/` |
| Browser inspection or source lint | `skills/web-ui-design/scripts/` |
| Runnable design example | `examples/<example-name>/` |
| User instructions | `README.md` or `docs/` |
| Repeatable comparison task | `benchmarks/global-use-cases/` |

When a change affects how someone installs or uses the project, update the README and the matching getting-started or reference page in the same change.

## Local review

The project has no build step or npm dependencies. Validate the skill bundle and check the shipped scripts first:

```bash
node scripts/validate-skills.mjs
node --check skills/web-ui-design/scripts/lint.mjs
node --check skills/web-ui-design/scripts/inspect.mjs
node --check skills/web-ui-design/scripts/diff.mjs
```

Then use the checks that match the files you changed:

```bash
# Scan an example or project source for common copy and markup issues
node skills/web-ui-design/scripts/lint.mjs examples/<example-name>

# Inspect an example in an installed Chrome, Edge or Chromium browser
node skills/web-ui-design/scripts/inspect.mjs examples/<example-name>/index.html
```

`lint.mjs` needs Node 18 or newer. `inspect.mjs` needs Node 22 or newer and an installed Chrome, Edge or Chromium browser. See [the scripts reference](docs/scripts.md) for all options and rule behavior. If a check cannot run in your environment, include that fact in the change description.

The pull request workflow runs the skill metadata validator and JavaScript syntax checks on Node 22 and 24. Browser inspection is a local review step because it needs a browser and screenshots should be inspected by a person.

For changes to examples, open the generated screenshots at 1440, 768 and 390 CSS pixels. Check keyboard use, visible focus, reduced motion, and the example's primary interaction. Measurements support review; they do not replace looking at the page.

## What makes a useful change

- Keep instructions specific enough to follow without guessing.
- Preserve the project's existing stack in examples and add no runtime dependency unless it is necessary and documented.
- Keep accessibility requirements and failure states in scope when changing interactive patterns.
- Use fictional names and data in examples; label illustrative content clearly.
- Do not add claims, benchmark results, or compatibility guarantees without evidence.
- Keep documentation, examples, and script output consistent with one another.

## Pull request description

Describe the problem, the change, and the checks actually performed. Link relevant files or screenshots when they help reviewers. Do not claim checks that were not run.

## Report a problem or propose a skill

Use the GitHub issue forms for bug reports and skill proposals. Before opening a new issue, search existing issues for the same problem. Security reports should follow [SECURITY.md](SECURITY.md) and should not be posted publicly.
