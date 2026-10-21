---
name: security-review
description: Review application source and configuration for security weaknesses in web apps, APIs, authentication, data handling, and dependencies. Use for a scoped defensive code review; do not perform intrusive tests against live or third-party systems.
metadata:
  short-description: Review application security
---

# Security review

Review the requested code and configuration defensively. Identify concrete, exploitable weaknesses and practical corrections while preserving the application's stack and intended behavior. Keep the review limited to systems and files the user has authorized.

## Scope and inspect

- Identify the application boundary, sensitive data, trust boundaries, exposed routes, authentication and authorization model, deployment assumptions, and requested scope.
- Inspect relevant handlers, middleware, schemas, templates, storage, outbound requests, secrets/configuration, dependency manifests, and nearby tests.
- Trace user-controlled input from entry point to sensitive operation. Check authorization at the resource and action level, not just whether a user is logged in.
- Consider input validation, injection, cross-site scripting, CSRF where applicable, SSRF, path traversal, insecure deserialization, unsafe redirects, credential/session handling, cryptography choices, rate limits, error leakage, logging, and dependency exposure as relevant to the actual stack.
- Use static inspection and existing local checks first. Do not probe production or third-party endpoints, exfiltrate data, use real credentials, or make destructive changes. Request explicit authorization before any active testing that could affect a live system.

## Findings and fixes

- Report each issue with severity, affected file/line or route, prerequisites, realistic impact, evidence, and a concrete remediation.
- Distinguish confirmed vulnerabilities from uncertain risks and hardening suggestions. Do not label theoretical concerns as exploitable without evidence.
- Prioritize reachable unauthenticated and cross-user access paths, sensitive data exposure, and injection before low-impact hardening.
- If asked to fix issues, make the narrowest safe change, add or update focused regression coverage when the project supports it, and check that valid behavior remains intact.
- Do not reproduce secrets in reports. If an exposed credential is found, identify its location without echoing its value and recommend rotation through the authorized owner.

## Report

State the scope and methods used, prioritized findings, fixes made if requested, checks actually run, and areas not reviewed. Avoid claiming that an application is secure or fully compliant based on a limited review.
