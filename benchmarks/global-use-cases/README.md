# Global workflow benchmark

A repeatable comparison for the `dev-craft` skills across common product work. It measures what the delivered project does and what can be verified; it does not treat a polished screenshot as proof that the whole implementation works.

## Cases

Run all four cases from [`cases.md`](cases.md):

1. Responsive analytics dashboard
2. Product landing page
3. Localized account setup flow
4. Authenticated catalog and ordering API

The cases use invented products and synthetic records. They avoid a country-specific business context while checking locale-aware behavior across English (US), German (Germany), and Arabic (Egypt), including right-to-left layout.

## Comparison protocol

For each case, create two clean copies from the same starter commit:

- **Control:** use the normal project instructions, without installing the `dev-craft` skills.
- **With dev-craft:** install the same revision of `dev-craft` in the copy and use the same task prompt.

Keep the starting files, dependencies, runtime, execution environment, time limit, task prompt, and available tools identical. Record the skill repository commit and the implementation environment in the scorecard. Use a fresh session for each run. Do not let either run inspect the other run's files or screenshots.

If evaluating more than one implementation engine or model, run both conditions for every one and report those comparisons separately. Do not compare runs made with different starting repositories, models, or time limits as if the skill were the only changed variable.

Randomize whether the control or skill condition runs first. For a public comparison, complete at least three independent runs of each condition per case; a single pair is a pilot, not a stable result. Suggested time limit: 60 minutes per UI case and 90 minutes for the API case. If the same limit cannot be applied to both conditions, record the difference and do not combine those scores.

## Capture and review

For every run, keep:

- the final source tree and the exact task prompt;
- command output from available build, lint, type, and test checks;
- browser screenshots at 1440, 768, and 390 CSS pixels for UI cases;
- keyboard and reduced-motion observations for UI cases;
- API request/response evidence and database state checks for the API case;
- elapsed time, blocked items, and any manual steps.

Score with [`scorecard.md`](scorecard.md). Review screenshots without labels that reveal the condition, and have two reviewers score visual quality independently when possible. Record both scores before discussing differences. Report medians and per-case results; do not publish only the best example.

Use `not run` when a check was unavailable. A missing run is not a pass. Never invent customer results, performance numbers, accessibility results, or reviewer scores. This starter defines the protocol and tasks; it contains no benchmark results yet.
