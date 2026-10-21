---
name: backend-development
description: Design, build, or improve a production-ready backend in an existing project. Covers API contracts, data models, authentication and authorization, validation, security, reliability, observability, deployment, and verification while preserving the project's stack and conventions.
---

# backend-development

Build a backend as a complete, testable path from request to stored result. Inspect the existing project first, preserve its stack and conventions, and make the smallest coherent change that meets the brief.

## 1. Establish scope

Write a short implementation brief before changing files:

```text
Users and callers: <who or what uses this backend>
Required flows:    <request -> result, including failure cases>
Data to own:       <entities, source of truth, retention needs>
Integrations:      <external services, or none>
Constraints:       <stack, hosting, compatibility, privacy, scale>
Out of scope:      <nearby work not requested>
```

Infer details from the repository where possible. Ask only when a missing decision would change the data model, access rules, public contract, or irreversible behavior. Never invent business rules, credentials, production settings, or external service guarantees.

## 2. Map the existing system

- Read the project instructions, package or dependency manifests, entry points, routes, models, migrations, configuration, and existing tests before editing.
- Trace one existing request from transport to handler, domain logic, persistence, and response. Reuse its patterns where sound.
- Identify runtime and framework versions, database and migration tool, session or token approach, job system, and deployment target from actual files. Do not assume a stack or add a dependency before checking it is available and justified.
- Check the current working tree. Preserve unrelated user changes.

## 3. Define the contract and data model

- List endpoints or operations with method, path, caller, authentication requirement, input, success response, and expected errors. Keep existing public behavior compatible unless the request authorizes a breaking change.
- Validate request data at the boundary with explicit types, limits, normalization, and useful field errors. Reject unknown or malformed values when accepting them could be unsafe or ambiguous.
- Model entities, keys, relationships, uniqueness, nullability, indexes, deletion, and retention from the required flows. Use database constraints for invariants that must hold under concurrent requests.
- Write reversible migrations using the project's normal tooling. Preserve existing data; describe any unavoidable data migration and its rollback limits.
- Use transactions when a flow changes multiple records that must succeed or fail together. Make retries and duplicate requests safe where the operation can be repeated.

## 4. Implement one vertical slice at a time

For each required flow, implement the complete path: route, authentication and authorization, validation, domain behavior, persistence or integration, and response. Keep transport details out of domain rules when the project already has that separation.

- Return consistent status codes and response shapes. Do not leak stack traces, SQL, tokens, secrets, or internal host details to callers.
- Paginate collections with a stable order and bounded page size. Avoid unbounded reads and accidental N+1 queries.
- Put external calls behind the project's existing integration boundary. Set timeouts, handle expected failure modes, and avoid holding database transactions open during network waits.
- Keep secrets in the established secret store or environment configuration. Add only safe variable names to example configuration; never add real credentials.
- Update API documentation or schemas when the repository maintains them.

## 5. Apply security and privacy controls

Treat all input, headers, cookies, uploaded files, and third-party responses as untrusted.

- Enforce authentication and resource-level authorization on the server for every protected operation. Test both allowed and denied access, including attempts to access another user's records.
- Use established password hashing and session/token libraries. Set cookie flags and token lifetimes deliberately; never implement cryptography by hand or log credentials and tokens.
- Prevent injection with parameterized queries or safe ORM APIs. Avoid building executable queries or shell commands from untrusted strings.
- Protect browser-facing endpoints against CSRF when cookie authentication is used. Configure CORS to the actual allowed origins; do not use wildcard origins with credentials.
- Bound body size, collection size, upload type and size, and request frequency where the operation can be abused. Validate file content rather than trusting its name or declared MIME type.
- Prevent server-side request forgery by constraining user-influenced outbound URLs and blocking private, loopback, link-local, and metadata-service destinations where applicable.
- Return only fields each caller is allowed to see. Minimize personal data, define retention where required, and avoid sensitive values in logs.
- Use generic public error messages for authentication failures where detailed distinctions could enable account discovery. Keep actionable detail in access-controlled logs.

## 6. Handle failure and concurrency

- Define a consistent error shape for validation, authentication, authorization, missing resources, conflicts, rate limits, and unexpected failures.
- Distinguish expected domain failures from unexpected exceptions. Map them at the transport boundary and preserve useful causes in structured logs without exposing private data.
- Use uniqueness constraints, locking, optimistic concurrency, or idempotency keys when simultaneous or retried requests could duplicate or overwrite work.
- For background jobs, make handlers retry-safe, record terminal failures, and provide a way to inspect or retry work using project conventions.
- Avoid swallowing exceptions, returning success after partial failure, or using in-memory state for data that must survive process restarts.

## 7. Verify the behavior

Use the repository's established checks and add or update focused tests for changed behavior:

- Unit tests for domain rules and boundary cases.
- Integration tests for persistence, migrations, transactions, and external-service adapters.
- Request tests for status codes, response shapes, validation, authentication, authorization, and error mapping.
- Regression tests for the bug or behavior that motivated the change.

Run the relevant formatter, linter, type checker, tests, and migration validation available in the project. Report the exact checks run and any that could not run. Do not claim a migration, deployment, or external integration was verified unless it was actually exercised.

## 8. Review operations and close out

Before finishing, review:

- Configuration names and safe defaults; no secrets or production-only assumptions committed.
- Migration order, rollback behavior, and compatibility during rollout.
- Logs and metrics for useful request context without personal or secret data.
- Health/readiness behavior, shutdown, timeouts, and resource cleanup where relevant to the change.
- API docs, environment examples, and operator notes affected by the implementation.

Close with a concise report of the flows changed, contract or data changes, security decisions, checks run, and known limits. Separate completed work from follow-up ideas.
