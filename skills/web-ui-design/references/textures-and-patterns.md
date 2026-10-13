# Procedural Textures & Patterns

When real client photography or product imagery is not yet available, standard practice often degrades into empty placeholder boxes, generic stock photos, or clichéd AI gradients. 

Use this reference to create **deliberate, high-fidelity procedural surfaces** built entirely in CSS and lightweight inline SVG. Every texture uses project tokens (`var(--ground)`, `var(--ink)`, `var(--surface-1)`, `var(--accent)`) so it stays rooted in the design system.

---

## 1. Subtle SVG Grain & Noise (Physical Texture)

Adds tactile depth to flat digital backgrounds without external image assets.

```html
<!-- Inline SVG Filter definition (place once at bottom of <body> or in tokens) -->
<svg style="display:none" aria-hidden="true">
  <filter id="noise-filter">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
    <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.04 0" />
  </filter>
</svg>
```

```css
/* Apply grain overlay to any section or card */
.grain-overlay {
  position: relative;
  overflow: hidden;
}

.grain-overlay::before {
  content: "";
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  filter: url(#noise-filter);
  pointer-events: none;
  opacity: 0.6;
  z-index: 1;
}
```

---

## 2. Technical & Architectural Grid Lines

Ideal for **Technical Grid**, **Raw Utilitarian**, or **Developer Product** directions.

```css
/* 24px and 96px Major/Minor Grid in pure CSS */
.pattern-grid {
  background-color: var(--ground);
  background-image: 
    linear-gradient(to right, color-mix(in srgb, var(--ink) 6%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--ink) 6%, transparent) 1px, transparent 1px),
    linear-gradient(to right, color-mix(in srgb, var(--ink) 14%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--ink) 14%, transparent) 1px, transparent 1px);
  background-size: 24px 24px, 24px 24px, 96px 96px, 96px 96px;
  background-position: -1px -1px;
}
```

---

## 3. Precision Dot Matrix / Halftone

Subtle geometric rhythm for modern tech or minimal editorial layouts.

```css
/* 20px Dot Matrix */
.pattern-dots {
  background-color: var(--ground);
  background-image: radial-gradient(
    color-mix(in srgb, var(--ink) 12%, transparent) 1px,
    transparent 1px
  );
  background-size: 20px 20px;
  background-position: 0 0;
}

/* Accent highlight dot cluster */
.pattern-dots--accent {
  background-image: radial-gradient(
    color-mix(in srgb, var(--accent) 25%, transparent) 1.5px,
    transparent 1.5px
  );
  background-size: 24px 24px;
}
```

---

## 4. Topographic & Contour Lines (SVG Data URI)

Ideal for outdoor, scientific, geographic, or craft subjects.

```css
.pattern-topo {
  background-color: var(--ground);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cpath d='M0 80 Q 40 40 80 80 T 160 80 M0 40 Q 40 0 80 40 T 160 40 M0 120 Q 40 80 80 120 T 160 120' stroke='%23888888' stroke-width='0.75' stroke-opacity='0.15' fill='none'/%3E%3C/svg%3E");
  background-size: 160px 160px;
}
```

---

## 5. Organic Mesh Luminance (Bespoke Gradients)

Standard linear gradients look generic. Organic mesh gradients combine multiple off-center radial gradients with token colors to produce natural depth.

```css
/* Deep ambient atmospheric backdrop */
.mesh-ambient {
  background-color: var(--ground);
  background-image:
    radial-gradient(at 15% 20%, color-mix(in srgb, var(--accent) 14%, transparent) 0px, transparent 50%),
    radial-gradient(at 85% 15%, color-mix(in srgb, var(--surface-2) 40%, transparent) 0px, transparent 55%),
    radial-gradient(at 50% 80%, color-mix(in srgb, var(--accent) 8%, transparent) 0px, transparent 60%);
  background-attachment: fixed;
}
```

---

## 6. Pairing Textures with Design Directions

Match the texture pattern to the direction chosen in Stage 1:

| Design Direction | Recommended Texture | Role & Density |
|---|---|---|
| **Editorial Bold** | Noise grain (`#noise-filter`) | Micro-texture over `--ground` to mimic matte print stock. |
| **Technical Grid** | Major/Minor 24/96px grid | Structural boundary lines and code panel backdrops. |
| **Quiet Luxury** | Very faint grain (opacity 0.03) + generous whitespace | Evokes archival linen or stone paper. |
| **Modern Product (Dark)** | Dot matrix + subtle ambient mesh | Accents hero visual cards and interactive playground areas. |
| **Soft Light** | Warm ambient mesh (peach/sage at 10% opacity) | Gentle non-linear glow behind feature highlights. |
| **Raw / Utilitarian** | 45-degree diagonal hatching (1px line, 8px gap) | Emphasizes urgency, caution badges, or technical data sheets. |
| **Playful** | Oversized polka dots or offset checker | Section breaks and lively sticker containers. |
