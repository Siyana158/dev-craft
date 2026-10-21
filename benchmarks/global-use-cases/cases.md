# Benchmark cases

Run each prompt verbatim from identical starter repositories. A task may use the existing stack in its starter. If no application stack exists, record the chosen stack before either condition starts and use the same one for both.

## Case 1 — Northstar analytics dashboard

### Prompt

Build a responsive dashboard for **Northstar**, a fictional subscription analytics product for small software teams. Use the existing project's stack and dependencies. The dashboard is for a signed-in workspace administrator reviewing product activity; it is not a marketing page.

Show a workspace selector, a date-range control, four KPI cards, a trend visualization, and a recent-events table. Use this fixed synthetic data:

- Active workspaces: 1,284; previous period: 1,190
- Monthly recurring revenue: £48,260; previous period: £45,900
- Trial conversion: 6.8%; previous period: 6.1%
- Churn: 2.4%; previous period: 2.7%
- Monthly revenue values for Jan–Jun: 35,200; 37,800; 36,900; 42,100; 45,900; 48,260 GBP
- Recent events: “Orchid Studio upgraded to Team” (09:42 UTC), “Fieldnote started a trial” (09:18 UTC), “Northwind cancelled Pro” (08:51 UTC)

Make the date-range control and workspace selector affect the visible state. Include loading, empty, and recoverable error states with a clear action. Do not invent additional company names, customer quotes, growth claims, or data. Provide a usable phone layout, semantic headings, labelled controls, visible keyboard focus, and reduced-motion support. Use locale-aware date and number formatting; keep the underlying values unchanged.

### Acceptance checks

- All provided values and event labels appear accurately; no extra factual claims are introduced.
- Selectors can be operated by keyboard and change the displayed selection/state.
- Loading, empty, and error states can be reached using the project's existing conventions or a small local demonstration control.
- At 1440, 768, and 390 CSS pixels, the primary content is readable and there is no unintended horizontal page overflow.
- Heading structure, form labels, focus indication, and reduced-motion behavior can be inspected in the rendered page.
- The revenue trend has an accessible text equivalent; color alone does not distinguish data.

## Case 2 — Lumen product landing page

### Prompt

Create a complete product landing page for **Lumen**, a fictional team knowledge base. Use the existing project's stack. Audience: operations leads at distributed teams of 10–80 people. The primary action is to book a product walkthrough.

Use only these product facts: teams can organize internal guides, assign an owner and review date to each guide, and search guides from one workspace. The product has a 14-day trial. Do not invent customers, testimonials, logos, security certifications, integrations, usage statistics, or performance claims.

The page needs a clear hero and walkthrough action, a section showing the three product facts, a realistic product view built from the available stack, a short setup explanation, trial details, and a complete FAQ that answers only questions supported by those facts. Make the design specific to Lumen without using generic gradient blobs or a default centered hero-plus-card-grid template. Use real interaction states, responsive layouts, semantic structure, accessible contrast, visible focus, and reduced-motion support. At narrow widths, preserve the main action and let the product view remain understandable.

### Acceptance checks

- The primary action has a meaningful label and works as an in-page action, route, or clearly explained demo interaction.
- Every product claim maps to the supplied facts; no fake proof is present.
- The product view communicates guides, owners, review dates, or search rather than acting as a decorative placeholder.
- Layout remains readable at 1440, 768, and 390 CSS pixels; no key action is clipped or obscured.
- Keyboard focus, link names, heading order, contrast, and reduced-motion behavior are reviewable.
- At least two reviewers can identify the intended audience and primary action from the first screen alone.

## Case 3 — Localized account setup

### Prompt

Build a three-step account setup flow for a fictional service called **Parcelnote**. Use the existing stack. A person creates a workspace, enters profile details, and reviews the setup before finishing. This is a front-end interaction benchmark; do not add a real sign-in provider or transmit data to a server.

Provide a language control with English (US), German (Germany), and Arabic (Egypt). Include these required fields: workspace name, full name, email address, and preferred weekly report day. Validate required fields and email format, preserve entered values when moving between steps, allow going back to edit, and show a clear completion state. Put errors beside their fields and announce step changes and validation errors accessibly. Use locale-aware weekday and date formatting where shown. For Arabic, use right-to-left page direction while keeping the email input readable left to right. Make no assumptions about gender, address, or country beyond the selected locale.

Use complete English, German, and Arabic labels and short interface messages for all visible controls, field errors, navigation, and completion content. Include these Arabic strings: “مساحة العمل”, “الاسم الكامل”, “البريد الإلكتروني”, “يوم التقرير الأسبوعي المفضل”, “متابعة”, “رجوع”, “مراجعة”, “إكمال الإعداد”, “هذا الحقل مطلوب”, “أدخل عنوان بريد إلكتروني صالحًا”, and “اكتمل الإعداد”. Keep the layout usable with longer translated strings, browser zoom, keyboard-only navigation, and reduced motion. Do not rely on color alone to show errors or the current step.

### Acceptance checks

- All three language options translate every visible control and validation message; switching language does not clear entered data.
- Arabic uses right-to-left layout and localized weekday labels; the email address remains legible in left-to-right order.
- Required fields and malformed email are blocked with field-specific, announced errors.
- Users can move back and forward without losing valid values and can edit the review step.
- The completion state appears only after valid data is reviewed and submitted locally.
- At 200% browser zoom and 390 CSS pixels, labels, errors, and navigation remain available without horizontal page scrolling.
- Keyboard order, focus visibility, language metadata, and reduced-motion behavior are reviewable.

## Case 4 — Authenticated catalog and ordering API

### Prompt

Extend the existing backend for **Harbor Supply**, a fictional catalog and ordering service. Use the repository's current framework, database, migration tooling, and authentication approach. Do not replace the stack or add a payment provider. Use synthetic records only.

Implement these behaviors:

- Public catalog listing with bounded pagination and optional case-insensitive search by product name.
- Public product detail by stable identifier.
- Authenticated order creation for the current user with one or more product identifiers and positive integer quantities.
- Authenticated order history that returns only the current user's orders.
- An idempotency key for order creation so retrying the same request does not create a duplicate order.

Seed or fixture three products with stable IDs, names, and prices in EUR. Calculate totals from server-side product prices; reject unknown products, invalid quantities, and unavailable stock. Update stock and create the order atomically. Do not trust a client-supplied price or user identifier. Return consistent validation, authentication, authorization, not-found, conflict, and unexpected-error responses without exposing internals. Add focused tests for contract behavior, ownership, validation, price tampering, idempotency, and concurrent stock changes. Document the endpoint contract and any new configuration variables without adding real secrets.

### Acceptance checks

- Catalog pagination is bounded and stable; search and detail lookup behave as documented.
- Anonymous order creation and order history are rejected; authenticated users can access only their own order records.
- Client-supplied price or user identity cannot affect the persisted order.
- Invalid IDs and quantities return field-specific client errors; unavailable stock returns a conflict without partial writes.
- Retrying an identical idempotency key and body produces one persisted order; conflicting reuse follows a documented policy.
- A repeated or concurrent stock reservation cannot make inventory negative or leave an order partially written.
- Responses omit secrets, stack traces, SQL, and other internal implementation details.
- Migrations, tests, API documentation, and safe example configuration are present and consistent with the existing project.
