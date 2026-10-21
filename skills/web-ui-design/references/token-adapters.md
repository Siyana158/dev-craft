# Token Adapters: Framework Integrations

dev-craft designs begin with a tokens pass (Stage 3). Rather than hardcoding colors or arbitrary pixels in component markup, use these adapter recipes to project dev-craft tokens into whichever CSS framework or UI library the project uses.

---

## 1. Pure CSS Custom Properties (`tokens.css`)

Default standard. Place in `tokens.css` or `:root`:

```css
:root {
  /* Colour roles */
  --ground: #faf8f5;
  --ink: #181716;
  --accent: #c4381e;
  --surface-1: #f0ece4;
  --surface-2: #e3ddd3;
  --surface-border: color-mix(in srgb, var(--ink) 12%, transparent);

  /* Typography scale */
  --font-display: "Bricolage Grotesque", -apple-system, sans-serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.8125rem);
  --text-sm: clamp(0.875rem, 0.825rem + 0.25vw, 0.9375rem);
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.0625rem);
  --text-lg: clamp(1.25rem, 1.15rem + 0.5vw, 1.375rem);
  --text-xl: clamp(1.75rem, 1.5rem + 1.25vw, 2.25rem);
  --text-display: clamp(2.5rem, 2rem + 2.5vw, 4.25rem);

  /* Spacing (4/8px rhythm) */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;

  --page-max-width: 1200px;
  --page-gutter: clamp(1rem, 4vw, 2.5rem);

  /* Shape & Motion */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --duration-quick: 120ms;
  --duration-base: 240ms;
}

/* Optional Dark theme override */
[data-theme="dark"] {
  --ground: #0d0f12;
  --ink: #f0f2f5;
  --surface-1: #16191f;
  --surface-2: #222630;
  --surface-border: color-mix(in srgb, var(--ink) 14%, transparent);
}
```

---

## 2. Tailwind CSS v4 (`@theme`)

In Tailwind CSS v4, configure tokens directly inside your main CSS file:

```css
@import "tailwindcss";

@theme {
  --color-ground: var(--ground);
  --color-ink: var(--ink);
  --color-accent: var(--accent);
  --color-surface-1: var(--surface-1);
  --color-surface-2: var(--surface-2);

  --font-display: var(--font-display);
  --font-body: var(--font-body);
  --font-mono: var(--font-mono);

  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);

  --ease-standard: var(--ease-standard);
}
```

---

## 3. Tailwind CSS v3 (`tailwind.config.js`)

For projects using Tailwind CSS v3:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue,svelte}'],
  theme: {
    extend: {
      colors: {
        ground: 'var(--ground)',
        ink: 'var(--ink)',
        accent: 'var(--accent)',
        'surface-1': 'var(--surface-1)',
        'surface-2': 'var(--surface-2)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
      },
    },
  },
};
```

---

## 4. Shadcn UI / Radix Themes Adapter

Map dev-craft tokens directly to the CSS variable conventions expected by Shadcn UI:

```css
:root {
  /* Shadcn standard mappings */
  --background: var(--ground);
  --foreground: var(--ink);

  --card: var(--surface-1);
  --card-foreground: var(--ink);

  --popover: var(--ground);
  --popover-foreground: var(--ink);

  --primary: var(--ink);
  --primary-foreground: var(--ground);

  --secondary: var(--surface-1);
  --secondary-foreground: var(--ink);

  --muted: var(--surface-2);
  --muted-foreground: color-mix(in srgb, var(--ink) 65%, transparent);

  --accent: var(--surface-1);
  --accent-foreground: var(--ink);

  --destructive: #d9383a;
  --destructive-foreground: #ffffff;

  --border: var(--surface-border);
  --input: var(--surface-border);
  --ring: var(--accent);

  --radius: var(--radius-md);
}
```

---

## 5. Design Tokens Community Group (DTCG) / Figma JSON

For projects synchronizing design tokens from Figma or Studio:

```json
{
  "color": {
    "ground": { "$value": "#faf8f5", "$type": "color" },
    "ink": { "$value": "#181716", "$type": "color" },
    "accent": { "$value": "#c4381e", "$type": "color" },
    "surface": {
      "1": { "$value": "#f0ece4", "$type": "color" },
      "2": { "$value": "#e3ddd3", "$type": "color" }
    }
  },
  "dimension": {
    "radius": {
      "sm": { "$value": "4px", "$type": "dimension" },
      "md": { "$value": "8px", "$type": "dimension" },
      "lg": { "$value": "16px", "$type": "dimension" }
    }
  }
}
```
