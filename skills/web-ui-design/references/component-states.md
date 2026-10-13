# Component States Matrix

Every interactive component and data container must account for all applicable states. A page that only designs for the resting state fails when data is slow, empty, or invalid.

Reference these patterns during **Stage 6 (Build)** of `web-ui-design` and during the 5-lens triage of `ui-redesign`.

---

## 1. Interactive Control States

All buttons, inputs, links, and selectable items must provide clear visual and accessible cues across the full interaction lifecycle:

| State | Visual Treatment | Implementation & Accessibility |
|---|---|---|
| **Resting** | Baseline token styles (`--ground`, `--ink`, `--surface-1`). | Default HTML element styles. |
| **Hover** | 5-10% shift in surface luminosity, subtle transform ($-\text{1px}$ or subtle border shift). | `:hover` pseudo-class. Never rely on color change alone. |
| **Focus Visible** | High-contrast double ring or 2px solid ring with 2px offset. | `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }`. Never `outline: none` without replacement. |
| **Active / Pressed** | Scale reduction ($\approx 0.98$), darkened background, or pressed inset. | `:active` pseudo-class; for toggle buttons, use `aria-pressed="true"`. |
| **Disabled** | 40-50% opacity, `cursor: not-allowed`, no hover transforms. | `disabled` attribute or `aria-disabled="true"`. Ensure contrast remains legible ($\ge 3:1$). |

```css
/* House rule focus pattern */
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Button complete states */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px; /* mobile tap target */
  padding: 0.75rem 1.5rem;
  font-family: inherit;
  font-weight: 600;
  border-radius: var(--radius, 6px);
  background: var(--ink);
  color: var(--ground);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 150ms ease, transform 100ms ease, opacity 150ms ease;
}

.btn:hover:not(:disabled) {
  background: color-mix(in srgb, var(--ink) 88%, white);
  transform: translateY(-1px);
}

.btn:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.btn:disabled,
.btn[aria-disabled="true"] {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}
```

---

## 2. Form & Validation States

Forms must never leave the user wondering if input was accepted or why submission stalled:

1. **Resting Field**: Clear border (`--surface-2`), accessible placeholder (never used in place of `<label>`).
2. **Focus Field**: Distinct border color matching `--accent`, subtle box-shadow ring.
3. **Dirty / Filled Field**: Visible filled text, clear button if applicable.
4. **Invalid / Error State**:
   - `aria-invalid="true"` on the input element.
   - Specific error message rendered immediately below the field.
   - Connected via `aria-describedby="field-error-id"`.
   - High-contrast alert accent (e.g. `--error` or distinct red/amber, $\ge 4.5:1$ contrast).
5. **Success / Verified State**: Subtle checkmark indicator or confirmation text. Avoid noisy green fields for routine input.

```html
<div class="field-group">
  <label for="email" class="field-label">Work email</label>
  <input 
    type="email" 
    id="email" 
    name="email"
    class="field-input field-input--error" 
    aria-invalid="true" 
    aria-describedby="email-error"
    value="invalid-email"
    required
  >
  <p id="email-error" class="field-error" role="alert">
    Please enter a valid work email address (e.g. name@company.com).
  </p>
</div>
```

---

## 3. Data & Asynchronous States

Every section or component fetching dynamic data, calculating prices, or submitting requests must handle four fundamental container states:

### A. Loading / Skeleton State
- Preserve the exact layout dimensions to eliminate **Cumulative Layout Shift (CLS)**.
- Use subtle pulse animation on neutral gray blocks rather than a single spinner in a blank screen.
- Respect `prefers-reduced-motion` by reducing animation to static muted opacity.

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--surface-1) 25%,
    var(--surface-2) 50%,
    var(--surface-1) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s infinite;
  border-radius: var(--radius-sm, 4px);
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
    opacity: 0.6;
  }
}
```

### B. Empty State (Zero Data)
Never leave a blank whitespace area when results, cart items, or search entries return zero items.
An intentional empty state requires:
1. **Specific Heading**: "No brew presets found" (not "No data").
2. **Contextual Explanation**: One sentence explaining why it is empty or what filter caused it.
3. **Direct Action / Reset**: A primary action button ("Reset filters", "Create first preset").

### C. Error / Failed State
When a calculation, API call, or network request fails:
1. Clear message stating what went wrong without technical jargon.
2. A retry action button (`Try again` or `Reload`).
3. Preserve previously entered user inputs so nothing is lost.

### D. Offline / Network Degraded
- When offline, degrade gracefully: show cached calculations, badge the interface as "Offline - changes will sync", and keep forms editable locally.

---

## 4. State Checklist for Reviews

Before calling a component or page finished, verify:
- [ ] Every button has distinct `:hover`, `:active`, `:focus-visible`, and `:disabled` styles.
- [ ] Every input has an associated `<label>` (not placeholder-only) and handles `:invalid`.
- [ ] Skeletons preserve width/height of loaded content to keep CLS under 0.05.
- [ ] Empty state includes a clear headline, reason, and immediate recovery CTA.
- [ ] Form errors announce to screen readers via `role="alert"` or `aria-describedby`.
