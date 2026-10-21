---
name: accessibility-audit
description: Audit an existing website or web app for accessibility barriers and produce evidence-based, prioritized findings. Use for accessibility reviews or WCAG-oriented checks; use web-ui-design for ordinary page creation and ui-redesign for visual improvements.
metadata:
  short-description: Audit web accessibility
---

# Accessibility audit

Review the requested pages and user journeys for barriers that affect people using keyboards, screen readers, zoom, high contrast, reduced motion, or other access needs. Give findings that a developer can reproduce and fix. Do not claim that a scan proves conformance or legal compliance.

## Scope the review

- Confirm the pages, important actions, supported browsers, and any stated conformance target. If the target is not given, report practical barriers without assuming a formal certification level.
- Inspect the actual implementation and, when available, run the app in a browser. Include representative page states: validation errors, open menus/dialogs, empty/loading states, and responsive layouts when they apply.
- Keep the requested scope. If the user asks for an audit, report findings first; make changes only when they ask for fixes.

## Review

Check the applicable areas and note where each check was observed:

- **Structure and semantics:** landmarks, heading order, page title and language, link and button semantics, lists and tables, accessible names, and meaningful image alternatives.
- **Keyboard and focus:** reachable controls, logical order, visible focus, no keyboard traps, skip navigation, and focus placement/restoration for dialogs and dynamic updates.
- **Forms and errors:** programmatic labels, instructions, required fields, input purpose where relevant, error identification, and whether errors are announced and linked to their fields.
- **Visual access:** text and non-text contrast, information not conveyed by colour alone, text resize and reflow, spacing, focus visibility, and target size where applicable.
- **Assistive technology behavior:** names, roles and values; state changes; status messages; expanded/collapsed state; and whether custom widgets expose expected keyboard interaction.
- **Motion and media:** reduced-motion behavior, flashing risk, captions or transcripts where relevant, and controls for moving or timed content.
- **Responsive and browser behavior:** zoom/reflow, orientation when relevant, and whether key flows remain operable at narrow widths.

Use the project's existing lint and browser-inspection scripts where they cover the target. Manual checks remain necessary. Do not add an accessibility package or automated scanner just to produce a score. If using an automated checker already available in the project, treat its output as leads to verify, not as proof of accessibility.

## Report findings

Return a concise report with:

1. **Scope and method:** pages, states, browsers, and checks actually performed; list anything not checked.
2. **Findings:** for each issue, include severity (blocker, high, medium, low), page/component, evidence (`file:line` or a reproducible browser step), who is affected, expected behavior, and a concrete correction.
3. **What passed:** only checks directly observed; avoid broad claims such as “fully accessible”.
4. **Limits:** explain when browser, screen-reader, device, or content access was unavailable.

Prioritize issues that prevent completing a primary task, then issues that cause substantial confusion or repeated effort. Avoid duplicate findings for the same underlying defect; group repeated instances and list their locations.

When asked to fix findings, preserve the current design and behavior where possible, fix the underlying semantic or interaction problem, then repeat the affected checks and report what remains unverified. For broader design or layout changes, use `ui-redesign` alongside this audit only when the user requests that scope.
