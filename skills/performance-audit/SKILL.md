---
name: performance-audit
description: Investigate web page loading and runtime performance using available source, browser, and production measurements. Use when asked to diagnose slowness, improve Core Web Vitals, or review performance; do not infer real-user performance from source inspection alone.
metadata:
  short-description: Audit web performance
---

# Performance audit

Find the bottlenecks that matter to the requested pages and user journeys. Start with evidence from the existing project and environment; preserve the current stack and avoid premature optimization.

## Establish evidence

- Clarify which routes, devices, networks, and user actions matter. If they are unspecified, choose a small representative set and state the assumption.
- Inspect build output, asset sizes, loading strategy, rendering path, JavaScript work, and existing performance tooling.
- Prefer repeated browser measurements under documented conditions. Use available Lighthouse, browser performance tools, Web Vitals telemetry, or the repository's own scripts when present; do not add a tool just to produce a score.
- Separate lab measurements from real-user field data. Report browser/version, viewport, network/CPU conditions, run count, and variability when available.
- Evaluate Core Web Vitals with current project or official targets when needed; do not present one lab run as a production guarantee.

## Diagnose and improve

- Trace the largest user impact first: blocking resources, server response, image/font payloads, render delays, layout shifts, long tasks, or expensive interactions.
- Tie each recommendation to a measured symptom and likely cause. Prioritize expected user impact, confidence, and change risk.
- Make scoped changes only when asked. Preserve content, accessibility, visual quality, and behavior; avoid trading one user barrier for a faster score.
- Re-measure the same route and conditions after a change. Compare like with like and state when measurements are noisy or no field data exists.
- Do not remove analytics, security checks, or essential functionality just to improve a metric without explicit direction.

## Report

Provide scope and measurement conditions, baseline evidence, prioritized findings, changes made if requested, before/after results, and remaining uncertainty. Separate measured facts from hypotheses and do not invent percentage improvements or universal performance claims.
