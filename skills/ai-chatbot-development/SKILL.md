---
name: ai-chatbot-development
description: Build or extend backend features that use AI models, including chatbots, streaming responses, structured outputs, and tool use. Use when integrating an AI provider into an existing application; preserve its stack and verify current provider APIs from official documentation.
metadata:
  short-description: Build AI chat backends
---

# AI chatbot development

Add AI-backed behavior as a reliable part of the existing application. Treat model output as untrusted input, keep provider-specific logic behind a clear boundary, and preserve the project's current backend stack unless a change is requested.

## Map the feature

- Identify the user journey, existing API and data model, authentication, authorization, hosting/runtime limits, provider, and whether conversation history must persist.
- Inspect the provider's current official API documentation and the project's installed SDK/version before implementing. Do not guess model names, API fields, tool schemas, streaming formats, or pricing.
- Define request and response contracts, input limits, error behavior, latency expectations, retention rules, and any human handoff or refusal requirements.
- Separate model orchestration from route handlers and UI-specific transport so it can be tested and providers can be changed without rewriting domain logic.

## Implement safely

- Keep credentials server-side in the project's approved secret store. Never ship provider keys to browsers, commit them, or echo them in logs or errors.
- Authenticate callers and authorize access to each conversation and tool action. Do not trust a conversation ID supplied by the client without checking ownership.
- Validate and bound user input, conversation history, uploaded content, tool arguments, and model output. Apply request, token, time, and concurrency limits appropriate to the app.
- Treat retrieved documents, user messages, and model responses as untrusted. Protect tools and data access with least privilege, explicit allowlists, server-side validation, and confirmation for consequential actions.
- Preserve a clear separation between trusted system instructions and untrusted content. Do not claim prompt instructions alone are a security boundary.
- Handle provider timeouts, rate limits, partial streams, cancellation, retries, and unavailable models. Retry only safe operations and avoid duplicate side effects.
- Minimize personal data sent to providers and retained in conversation logs. Follow the application's stated retention and deletion behavior; do not introduce storage without defining its purpose and access rules.
- Add safe operational visibility: request IDs, latency, token usage and error categories where available, without logging secrets or unnecessary conversation content.

## Verify

- Test normal conversation flow, empty/oversized input, authentication and cross-user isolation, provider errors, rate limiting, stream cancellation, malformed tool arguments, and tool authorization.
- Use mocked provider responses for deterministic tests. Do not call paid or production model endpoints in tests unless the user has explicitly authorized that usage.
- Check that server-sent events or other streaming responses close cleanly and that clients handle partial output and disconnects.
- Document provider configuration, required environment variables by name only, local setup, data retention, operational limits, and how to disable the feature safely.

## Report

Summarize the provider and current API documentation used, routes/data changed, safety controls, checks actually run, cost/latency assumptions, and remaining gaps. Do not claim model accuracy, safety, or compliance without evidence.
