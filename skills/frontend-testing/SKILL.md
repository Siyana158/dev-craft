---
name: frontend-testing
description: Plan, write, debug, or improve tests for a web frontend using the project's existing framework and test tools. Use for component, integration, browser, or accessibility behavior tests; do not replace a requested UI build or redesign with a test-only review.
metadata:
  short-description: Test frontend behavior
---

# Frontend testing

Make important user-visible behavior repeatable and trustworthy with tests that fit the existing project. Preserve its framework, conventions, test runner, and package manager unless the user asks to change them.

## Choose the right coverage

- Inspect the app structure, package scripts, installed test tools, and nearby tests before proposing a setup.
- Map the user-visible behavior and failure states that matter. Prefer a small number of meaningful tests over line coverage or snapshots that only freeze implementation details.
- Use unit tests for isolated logic, component tests for states and interactions, integration tests for connected UI/data behavior, and browser tests for critical end-to-end journeys.
- Cover user-observable outcomes: accessible names, keyboard interaction, validation, loading/empty/error states, navigation, and responsive behavior when relevant.
- Keep test data deterministic. Stub time, network responses, and random data at clear boundaries; do not depend on live services for ordinary test runs.

## Implement and run

- Follow existing selectors and patterns. Prefer roles, labels, and visible text over CSS classes or DOM structure.
- Exercise interactions through the same public interface a user has; avoid reaching into component internals unless the project convention requires it.
- Add the narrowest test that reproduces a reported defect, then cover the corrected behavior and an important nearby edge case.
- Do not introduce a new framework, browser download, dependency, CI service, or broad test reorganization without a clear need and user authorization for material project changes.
- Run the focused test command, then the relevant broader suite if practical. Report the exact commands and results. Never call an unrun test passing; distinguish product failures from environment/setup failures.

## Report

Summarize the behavior covered, tests added or changed, commands run, and any gaps. If a critical journey cannot run in the available environment, describe the missing prerequisite and leave that coverage clearly unverified.
