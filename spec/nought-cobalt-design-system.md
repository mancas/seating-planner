# Spec: Nought Cobalt Design System

## Metadata

- **Slug**: `nought-cobalt-design-system`
- **Date**: 2026-04-03
- **Status**: Completed
- **Author**: User
- **Related specs**: None (first spec)

## Description

Implement the "Nought Cobalt" design system by configuring TailwindCSS v4's CSS-first theme to match the design team's tokens. The system is a dark-mode-only, high-contrast monochrome palette with cobalt blue (#0057FF) as the sole functional accent color, using Space Grotesk as the primary typeface.

This spec covers:

1. CSS custom properties (`--nc-*` namespaced) for all design tokens
2. TailwindCSS v4 `@theme` configuration mapping tokens to Tailwind utilities
3. Typography scale and font-face setup for Space Grotesk
4. Component-level base styles for common UI patterns (buttons, cards, inputs, badges)
5. Removal of light mode — dark is the only mode

The result is a single source of truth for visual styling that every component in the application consumes via Tailwind utilities or CSS custom properties.

## User Stories

1. As a **developer**, I want TailwindCSS utilities to reflect the Nought Cobalt tokens so that I can style components without memorizing hex values or checking a design file.
2. As a **designer**, I want the implemented design system to match the token spec exactly so that development output is pixel-accurate to the design intent.
3. As a **developer**, I want CSS custom properties for all tokens so that I can reference them in custom CSS, animations, or third-party component overrides.
4. As a **developer**, I want pre-defined component base styles (buttons, cards, inputs) so that common UI patterns are consistent without manual styling each time.
5. As a **developer**, I want the typography scale pre-configured so that heading and body text sizes are consistent across the application.

## Acceptance Criteria

1. GIVEN the application is loaded in a browser WHEN inspecting the `<html>` element THEN CSS custom properties prefixed with `--nc-` exist for all design tokens defined in the Design Tokens section below.

2. GIVEN a developer writes `bg-background` in a className WHEN the page renders THEN the element background is `#0E0E0E`.

3. GIVEN a developer writes `bg-surface` in a className WHEN the page renders THEN the element background is `#131313`.

4. GIVEN a developer writes `bg-primary` in a className WHEN the page renders THEN the element background is `#0057FF`.

5. GIVEN a developer writes `text-foreground` in a className WHEN the page renders THEN the text color is `#E0E0E0`.

6. GIVEN a developer writes `text-muted` in a className WHEN the page renders THEN the text color is `#6B6B6B`.

7. GIVEN a developer writes `border-default` in a className WHEN the page renders THEN the border color is `rgba(67, 70, 86, 0.15)`.

8. GIVEN a developer writes `rounded` (default) in a className WHEN the page renders THEN the border radius is `4px`.

9. GIVEN a developer writes `font-sans` in a className WHEN the page renders THEN the font-family resolves to `'Space Grotesk', system-ui, sans-serif`.

10. GIVEN the `<html>` element WHEN inspecting its styles THEN `color-scheme` is set to `dark` (no light mode).

11. GIVEN a developer writes `text-heading-1` (or uses the `<h1>` element) WHEN the page renders THEN the font-size, font-weight, line-height, and letter-spacing match the typography scale defined below.

12. GIVEN a developer uses the `.btn-primary` class WHEN the page renders THEN the button has the primary accent background, white text, 4px border-radius, and appropriate hover/focus/active states.

13. GIVEN a developer uses the `.card` class WHEN the page renders THEN the element has the surface background, the default border, and 4px border-radius.

14. GIVEN a developer uses an `<input>` element with the `.input` class WHEN the page renders THEN it has the surface background, default border, foreground text, and focus ring using the primary accent color.

15. GIVEN the TailwindCSS build runs WHEN compiling the CSS THEN no errors occur and all custom theme tokens are available.

16. GIVEN the Space Grotesk font WHEN the page loads THEN it is available either via a `@font-face` declaration pointing to local/self-hosted files or via a Google Fonts import.

## Scope

### In Scope

- CSS custom properties for all design tokens (colors, typography, spacing, radii)
- TailwindCSS v4 `@theme` configuration in the main CSS file
- Space Grotesk font loading (Google Fonts import or self-hosted)
- Color palette: full monochrome gray scale + cobalt blue accent scale
- Typography scale for headings (h1–h6), body, small, and labels
- Default border-radius override to 4px
- Component base styles: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.card`, `.input`, `.badge`
- Base styles on `html`/`body` setting dark background, foreground color, and font
- Removal of existing light-mode CSS custom properties in `index.css`

### Out of Scope

- Light mode / theme toggle
- Animation or transition system
- Icon system
- Layout grid system (e.g., dot-grid decorative backgrounds)
- Spacing scale customization (Tailwind v4 defaults are sufficient)
- Component JavaScript behavior (only CSS/styling)
- Storybook or component documentation
- Design token syncing from Figma (manual one-time configuration)

## Edge Cases

1. **Font loading failure**: If Space Grotesk fails to load, the fallback chain `system-ui, sans-serif` must maintain readability. No layout shift should occur — use `font-display: swap`.
2. **Existing styles conflict**: The current `index.css` has light-mode-first custom properties and a nested `@import 'tailwindcss'` inside `@media (prefers-color-scheme: dark)`. These must be fully replaced, not layered on top.
3. **TailwindCSS v4 `@theme` namespace collisions**: Custom token names must not collide with Tailwind's built-in token names. Use semantic names (`background`, `surface`, `foreground`) that extend rather than override Tailwind's defaults.
4. **Opacity modifiers**: Tailwind v4 color utilities support opacity modifiers (e.g., `bg-primary/50`). The color values defined in `@theme` should be in formats that support this — hex or `oklch` are preferred over `rgba` for base colors. The border color (`rgba(67, 70, 86, 0.15)`) is an exception and should remain as-is.
5. **Existing component styles in `App.css`**: These reference the old `--accent`, `--text-h`, etc. variables. They need to be migrated to use the new `--nc-*` tokens or Tailwind utilities.

## Design Decisions

### DD-1: CSS Custom Property Namespace `--nc-*`

**Decision**: All design tokens use the `--nc-` prefix (Nought Cobalt).
**Reasoning**: Prevents collision with third-party CSS or future Tailwind internals. Provides clear provenance when debugging.

### DD-2: Monochrome Gray Scale Derivation

**Decision**: Derive a 10-step gray scale from the design tokens at 0 saturation, anchored on the provided values:
| Token | Value | Usage |
|---------------|----------|-----------------------------|
| `gray-950` | `#0A0A0A` | Deepest background |
| `gray-900` | `#0E0E0E` | Background base (provided) |
| `gray-850` | `#131313` | Surface container (provided)|
| `gray-800` | `#1A1A1A` | Elevated surface |
| `gray-700` | `#2A2A2A` | Subtle borders, dividers |
| `gray-600` | `#3A3A3A` | Disabled state backgrounds |
| `gray-500` | `#6B6B6B` | Muted text, placeholders |
| `gray-400` | `#8A8A8A` | Secondary text |
| `gray-300` | `#A0A0A0` | Tertiary text |
| `gray-200` | `#C0C0C0` | Subtle foreground |
| `gray-100` | `#E0E0E0` | Primary foreground text |
| `gray-50` | `#F0F0F0` | Headings, high-emphasis |

**Reasoning**: The design tokens specify `saturation: 0`, confirming pure grayscale. The provided `#0E0E0E` (background) and `#131313` (surface) anchor the dark end. Steps are distributed for practical UI needs (text hierarchy, borders, disabled states).

### DD-3: Cobalt Blue Accent Scale

**Decision**: Derive a 7-step cobalt scale centered on `#0057FF`:
| Token | Value | Usage |
|----------------|------------|------------------------------|
| `cobalt-950` | `#001433` | Accent background, very dark |
| `cobalt-900` | `#002266` | Dark accent surfaces |
| `cobalt-800` | `#003399` | Dark accent hover |
| `cobalt-700` | `#0044CC` | Accent hover state |
| `cobalt-600` | `#0057FF` | **Primary accent (provided)**|
| `cobalt-500` | `#3377FF` | Accent text on dark bg |
| `cobalt-400` | `#6699FF` | Light accent |
| `cobalt-300` | `#99BBFF` | Accent muted |

**Reasoning**: A functional accent scale allows hover states, active states, focus rings, and text-on-dark-background usage without manual opacity tricks. The scale is blue-only (no saturation mixing with gray) per the "cobalt blue functional accents" principle.

### DD-4: Semantic Color Aliases

**Decision**: Map semantic names to the gray/cobalt scales:
| Semantic Token | Maps To | CSS Variable |
|-----------------|-------------|----------------------|
| `background` | `gray-900` | `--nc-background` |
| `surface` | `gray-850` | `--nc-surface` |
| `surface-elevated`| `gray-800` | `--nc-surface-elevated`|
| `foreground` | `gray-100` | `--nc-foreground` |
| `foreground-muted`| `gray-500` | `--nc-foreground-muted`|
| `foreground-heading`| `gray-50`| `--nc-foreground-heading`|
| `border` | `rgba(67,70,86,0.15)` | `--nc-border` |
| `primary` | `cobalt-600`| `--nc-primary` |
| `primary-hover` | `cobalt-700`| `--nc-primary-hover` |
| `primary-foreground`| `#FFFFFF`| `--nc-primary-foreground`|
| `ring` | `cobalt-500`| `--nc-ring` |

**Reasoning**: Semantic tokens decouple component styles from raw color values, making future theme changes trivial.

### DD-5: Typography Scale

**Decision**: Use the following scale based on Space Grotesk:
| Level | Size | Weight | Line Height | Letter Spacing | CSS Class |
|----------|--------|--------|-------------|---------------|-----------------|
| Display | 56px | 700 | 1.1 | -1.68px | `text-display` |
| H1 | 40px | 700 | 1.15 | -1.2px | `text-heading-1`|
| H2 | 32px | 700 | 1.2 | -0.64px | `text-heading-2`|
| H3 | 24px | 600 | 1.3 | -0.24px | `text-heading-3`|
| H4 | 20px | 600 | 1.35 | 0 | `text-heading-4`|
| H5 | 16px | 600 | 1.4 | 0 | `text-heading-5`|
| Body LG | 18px | 400 | 1.6 | 0.18px | `text-body-lg` |
| Body | 16px | 400 | 1.5 | 0.16px | `text-body` |
| Body SM | 14px | 400 | 1.45 | 0.14px | `text-body-sm` |
| Caption | 12px | 400 | 1.4 | 0.12px | `text-caption` |
| Label | 12px | 500 | 1.2 | 0.8px (wide) | `text-label` |
| Code | 14px | 400 | 1.5 | 0 | `text-code` |

**Reasoning**: The design brief specifies "Tight" letter-spacing for body/headings and "Wide for labels". Headings use negative tracking (tight), body uses minimal positive tracking, and labels use wide tracking (0.8px). Weights follow "Bold" for headings per the design brief, with SemiBold for smaller headings.

### DD-6: Font Loading Strategy

**Decision**: Use Google Fonts `@import` for Space Grotesk (weights 400, 500, 600, 700).
**Reasoning**: Simplest integration. The project does not currently self-host fonts, and Google Fonts provides optimal caching. A `<link>` preconnect in `index.html` should be added for performance.

### DD-7: TailwindCSS v4 Configuration Approach

**Decision**: Use `@theme` directive in the main CSS file (`src/index.css`) rather than a `tailwind.config.js` file.
**Reasoning**: The project uses TailwindCSS v4 with `@tailwindcss/vite`, which uses CSS-first configuration. The `@theme` directive is the idiomatic v4 approach. No `tailwind.config.js` file exists or is needed.

### DD-8: Default Border Radius

**Decision**: Override Tailwind's default `--radius` to `4px`. The `rounded` utility will produce `4px`.
**Reasoning**: The design tokens specify `ROUND_FOUR` (4px). This is a global default — specific components can still use `rounded-full`, `rounded-none`, etc.

### DD-9: Component Base Styles via `@layer components`

**Decision**: Define `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.card`, `.input`, `.badge` in a `@layer components` block using `@apply` and CSS custom properties.
**Reasoning**: Provides ready-made styles for common patterns while remaining overridable by Tailwind utilities. Using `@layer components` ensures proper specificity ordering in Tailwind v4.

### DD-10: Dark Mode Strategy

**Decision**: Remove `color-scheme: light dark` and set `color-scheme: dark` on `:root`. Remove all `prefers-color-scheme` media queries. The application is dark-only.
**Reasoning**: The design system specifies `color_mode: "DARK"` with no light mode variant. Forcing `color-scheme: dark` ensures browser-native controls (scrollbars, form elements) also render in dark mode.

## UI/UX Details

### Color Palette Visual Reference

```
Background  ████  #0E0E0E
Surface     ████  #131313
Elevated    ████  #1A1A1A
Border      ░░░░  rgba(67,70,86,0.15)

Text Head   ████  #F0F0F0
Text Body   ████  #E0E0E0
Text Muted  ████  #6B6B6B

Primary     ████  #0057FF
Hover       ████  #0044CC
Light       ████  #3377FF
```

### Component Patterns

**Button Primary**: `bg-primary text-white rounded font-semibold hover:bg-cobalt-700 focus:ring-2 focus:ring-cobalt-500 focus:ring-offset-2 focus:ring-offset-background`

**Button Secondary**: `bg-transparent text-foreground border border-default rounded font-semibold hover:bg-gray-800 focus:ring-2 focus:ring-cobalt-500`

**Button Ghost**: `bg-transparent text-foreground-muted rounded font-semibold hover:bg-gray-800 hover:text-foreground`

**Card**: `bg-surface border border-default rounded p-6`

**Input**: `bg-surface border border-default rounded px-3 py-2 text-foreground placeholder:text-foreground-muted focus:border-primary focus:ring-1 focus:ring-ring outline-none`

**Badge**: `inline-flex items-center bg-cobalt-950 text-cobalt-400 text-caption font-medium rounded px-2 py-0.5`

## Data Requirements

N/A — This is a styling-only feature with no data models or API contracts.

## Design Tokens (Structured Reference)

```json
{
  "namespace": "--nc-",
  "colors": {
    "gray": {
      "950": "#0A0A0A",
      "900": "#0E0E0E",
      "850": "#131313",
      "800": "#1A1A1A",
      "700": "#2A2A2A",
      "600": "#3A3A3A",
      "500": "#6B6B6B",
      "400": "#8A8A8A",
      "300": "#A0A0A0",
      "200": "#C0C0C0",
      "100": "#E0E0E0",
      "50": "#F0F0F0"
    },
    "cobalt": {
      "950": "#001433",
      "900": "#002266",
      "800": "#003399",
      "700": "#0044CC",
      "600": "#0057FF",
      "500": "#3377FF",
      "400": "#6699FF",
      "300": "#99BBFF"
    },
    "semantic": {
      "background": "var(--nc-gray-900)",
      "surface": "var(--nc-gray-850)",
      "surface-elevated": "var(--nc-gray-800)",
      "foreground": "var(--nc-gray-100)",
      "foreground-muted": "var(--nc-gray-500)",
      "foreground-heading": "var(--nc-gray-50)",
      "border": "rgba(67, 70, 86, 0.15)",
      "primary": "var(--nc-cobalt-600)",
      "primary-hover": "var(--nc-cobalt-700)",
      "primary-foreground": "#FFFFFF",
      "ring": "var(--nc-cobalt-500)"
    }
  },
  "typography": {
    "font-family": "'Space Grotesk', system-ui, sans-serif",
    "font-mono": "ui-monospace, 'Cascadia Code', 'Fira Code', Consolas, monospace",
    "scale": {
      "display": {
        "size": "56px",
        "weight": 700,
        "lineHeight": 1.1,
        "letterSpacing": "-1.68px"
      },
      "heading-1": {
        "size": "40px",
        "weight": 700,
        "lineHeight": 1.15,
        "letterSpacing": "-1.2px"
      },
      "heading-2": {
        "size": "32px",
        "weight": 700,
        "lineHeight": 1.2,
        "letterSpacing": "-0.64px"
      },
      "heading-3": {
        "size": "24px",
        "weight": 600,
        "lineHeight": 1.3,
        "letterSpacing": "-0.24px"
      },
      "heading-4": {
        "size": "20px",
        "weight": 600,
        "lineHeight": 1.35,
        "letterSpacing": "0"
      },
      "heading-5": {
        "size": "16px",
        "weight": 600,
        "lineHeight": 1.4,
        "letterSpacing": "0"
      },
      "body-lg": {
        "size": "18px",
        "weight": 400,
        "lineHeight": 1.6,
        "letterSpacing": "0.18px"
      },
      "body": {
        "size": "16px",
        "weight": 400,
        "lineHeight": 1.5,
        "letterSpacing": "0.16px"
      },
      "body-sm": {
        "size": "14px",
        "weight": 400,
        "lineHeight": 1.45,
        "letterSpacing": "0.14px"
      },
      "caption": {
        "size": "12px",
        "weight": 400,
        "lineHeight": 1.4,
        "letterSpacing": "0.12px"
      },
      "label": {
        "size": "12px",
        "weight": 500,
        "lineHeight": 1.2,
        "letterSpacing": "0.8px"
      },
      "code": {
        "size": "14px",
        "weight": 400,
        "lineHeight": 1.5,
        "letterSpacing": "0"
      }
    }
  },
  "radii": {
    "default": "4px",
    "none": "0",
    "sm": "2px",
    "md": "4px",
    "lg": "8px",
    "xl": "12px",
    "full": "9999px"
  },
  "borders": {
    "default": "1px solid rgba(67, 70, 86, 0.15)"
  }
}
```

## Technical Plan

### Impact Analysis

#### Affected Areas

| Area                                        | Files           | Type of Change                                                                                                                                                           |
| ------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| HTML entry point                            | `index.html`    | Modify — add Google Fonts preconnect + stylesheet links                                                                                                                  |
| Global CSS / Design tokens / Tailwind theme | `src/index.css` | Modify — full rewrite: remove old variables, add `@import 'tailwindcss'` at top level, define `--nc-*` custom properties, `@theme` config, base styles, component styles |
| Component CSS                               | `src/App.css`   | Modify — migrate all old `--var` references to `--nc-*` tokens                                                                                                           |

#### Integration Points

- `src/main.tsx` imports `src/index.css` — no change needed, import stays the same
- `src/App.tsx` imports `src/App.css` — no change needed, import stays the same
- `src/App.tsx` uses CSS classes (`.counter`, `.hero`, `#center`, etc.) — class names stay the same, only the underlying CSS property values change
- `vite.config.ts` already has `@tailwindcss/vite` plugin — no change needed

#### Risk Areas

- **`src/index.css` full rewrite**: This file is the CSS entry point imported by `main.tsx`. The `@import 'tailwindcss'` must be the first statement (top-level, not nested). All old `:root` variables and `@media (prefers-color-scheme: dark)` blocks must be removed and replaced with the new design system. This is the highest-risk change.
- **`src/App.css` variable references**: This file references `--accent`, `--accent-bg`, `--accent-border`, `--text-h`, `--border`, `--social-bg`, `--shadow`, `--code-bg`. All must be mapped to `--nc-*` equivalents. If any reference is missed, styles will break silently (CSS custom property fallback to `initial`).
- **Tailwind `@theme` namespace**: Custom color names like `background`, `surface`, `foreground` must not break Tailwind's built-in `background-*` utilities. In Tailwind v4, `@theme` defines `--color-*` prefixed variables, so `--color-background`, `--color-surface` etc. will generate utilities like `bg-background`, `text-foreground` correctly.

### Task Breakdown

#### TASK-001: Add Google Fonts preconnect and stylesheet to `index.html`

- **Description**: Add `<link rel="preconnect">` tags for Google Fonts domains and a `<link>` stylesheet for Space Grotesk (weights 400, 500, 600, 700) to the HTML entry point. This must load before the app renders to avoid FOUT.
- **Files**: `index.html`
- **Instructions**:
  1. Read the current `index.html`
  2. Inside `<head>`, after the `<meta name="viewport">` tag and before `<title>`, add:
     ```html
     <link rel="preconnect" href="https://fonts.googleapis.com" />
     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
     <link
       href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
       rel="stylesheet"
     />
     ```
  3. Ensure the `display=swap` parameter is included in the Google Fonts URL for `font-display: swap` behavior (Edge Case 1 from spec)
- **Project context**:
  - Framework: Vite + React, entry point is `index.html` → `src/main.tsx`
  - Conventions: HTML uses 2-space indentation
  - Libraries: No font libraries; using Google Fonts CDN per DD-6
- **Dependencies**: None
- **Acceptance criteria**:
  - `index.html` contains three new `<link>` tags in `<head>`
  - The Google Fonts URL includes `family=Space+Grotesk:wght@400;500;600;700`
  - The URL includes `display=swap`
  - Two preconnect links exist (one for `fonts.googleapis.com`, one for `fonts.gstatic.com` with `crossorigin`)

---

#### TASK-002: Rewrite `src/index.css` — Tailwind import, design tokens, theme config, base styles, and component styles

- **Description**: Completely rewrite `src/index.css` to implement the Nought Cobalt design system. This is the core task. The file must be restructured from scratch: `@import 'tailwindcss'` at top level (not nested), `--nc-*` CSS custom properties on `:root`, `@theme` block for Tailwind utility generation, base element styles, and `@layer components` for component base styles. All old variables and light/dark mode logic are removed.
- **Files**: `src/index.css`
- **Instructions**:
  1. Read the current `src/index.css` (113 lines)
  2. Replace the entire file content with the following structure (in this exact order, as Tailwind v4 requires `@import` first):

  **Section 1 — Tailwind import** (must be the very first line):

  ```css
  @import 'tailwindcss';
  ```

  **Section 2 — `@theme` block** for Tailwind utility generation. Define all color tokens and typography tokens so Tailwind generates utility classes:

  ```css
  @theme {
    /* Gray scale */
    --color-gray-950: #0a0a0a;
    --color-gray-900: #0e0e0e;
    --color-gray-850: #131313;
    --color-gray-800: #1a1a1a;
    --color-gray-700: #2a2a2a;
    --color-gray-600: #3a3a3a;
    --color-gray-500: #6b6b6b;
    --color-gray-400: #8a8a8a;
    --color-gray-300: #a0a0a0;
    --color-gray-200: #c0c0c0;
    --color-gray-100: #e0e0e0;
    --color-gray-50: #f0f0f0;

    /* Cobalt accent scale */
    --color-cobalt-950: #001433;
    --color-cobalt-900: #002266;
    --color-cobalt-800: #003399;
    --color-cobalt-700: #0044cc;
    --color-cobalt-600: #0057ff;
    --color-cobalt-500: #3377ff;
    --color-cobalt-400: #6699ff;
    --color-cobalt-300: #99bbff;

    /* Semantic color aliases */
    --color-background: var(--color-gray-900);
    --color-surface: var(--color-gray-850);
    --color-surface-elevated: var(--color-gray-800);
    --color-foreground: var(--color-gray-100);
    --color-foreground-muted: var(--color-gray-500);
    --color-foreground-heading: var(--color-gray-50);
    --color-border: rgba(67, 70, 86, 0.15);
    --color-primary: var(--color-cobalt-600);
    --color-primary-hover: var(--color-cobalt-700);
    --color-primary-foreground: #ffffff;
    --color-ring: var(--color-cobalt-500);

    /* Typography — font families */
    --font-sans: 'Space Grotesk', system-ui, sans-serif;
    --font-mono:
      ui-monospace, 'Cascadia Code', 'Fira Code', Consolas, monospace;

    /* Border radius — override default */
    --radius: 4px;
    --radius-sm: 2px;
    --radius-md: 4px;
    --radius-lg: 8px;
    --radius-xl: 12px;
  }
  ```

  **Section 3 — `:root` CSS custom properties** with `--nc-*` namespace for direct CSS usage:

  ```css
  :root {
    /* NC design tokens — raw scales */
    --nc-gray-950: #0a0a0a;
    --nc-gray-900: #0e0e0e;
    --nc-gray-850: #131313;
    --nc-gray-800: #1a1a1a;
    --nc-gray-700: #2a2a2a;
    --nc-gray-600: #3a3a3a;
    --nc-gray-500: #6b6b6b;
    --nc-gray-400: #8a8a8a;
    --nc-gray-300: #a0a0a0;
    --nc-gray-200: #c0c0c0;
    --nc-gray-100: #e0e0e0;
    --nc-gray-50: #f0f0f0;

    --nc-cobalt-950: #001433;
    --nc-cobalt-900: #002266;
    --nc-cobalt-800: #003399;
    --nc-cobalt-700: #0044cc;
    --nc-cobalt-600: #0057ff;
    --nc-cobalt-500: #3377ff;
    --nc-cobalt-400: #6699ff;
    --nc-cobalt-300: #99bbff;

    /* NC design tokens — semantic */
    --nc-background: var(--nc-gray-900);
    --nc-surface: var(--nc-gray-850);
    --nc-surface-elevated: var(--nc-gray-800);
    --nc-foreground: var(--nc-gray-100);
    --nc-foreground-muted: var(--nc-gray-500);
    --nc-foreground-heading: var(--nc-gray-50);
    --nc-border: rgba(67, 70, 86, 0.15);
    --nc-primary: var(--nc-cobalt-600);
    --nc-primary-hover: var(--nc-cobalt-700);
    --nc-primary-foreground: #ffffff;
    --nc-ring: var(--nc-cobalt-500);

    /* Dark mode only */
    color-scheme: dark;
  }
  ```

  **Section 4 — Base element styles** (html, body, headings, code, etc.):

  ```css
  html {
    font-family: var(--font-sans);
    font-size: 16px;
    line-height: 1.5;
    letter-spacing: 0.16px;
    color: var(--nc-foreground);
    background: var(--nc-background);
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    margin: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: var(--nc-foreground-heading);
    font-family: var(--font-sans);
  }

  h1 {
    font-size: 40px;
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -1.2px;
    margin: 32px 0;

    @media (max-width: 1024px) {
      font-size: 32px;
      margin: 20px 0;
    }
  }

  h2 {
    font-size: 32px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.64px;
    margin: 0 0 8px;

    @media (max-width: 1024px) {
      font-size: 24px;
    }
  }

  h3 {
    font-size: 24px;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.24px;
  }

  h4 {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.35;
    letter-spacing: 0;
  }

  h5 {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0;
  }

  p {
    margin: 0;
  }

  code {
    font-family: var(--font-mono);
    font-size: 14px;
    line-height: 1.5;
    padding: 4px 8px;
    border-radius: 4px;
    color: var(--nc-foreground-heading);
    background: var(--nc-surface-elevated);
  }

  #root {
    width: 1126px;
    max-width: 100%;
    margin: 0 auto;
    text-align: center;
    border-inline: 1px solid var(--nc-border);
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }
  ```

  **Section 5 — Typography utility classes** via `@utility`:

  ```css
  @utility text-display {
    font-size: 56px;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -1.68px;
  }

  @utility text-heading-1 {
    font-size: 40px;
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -1.2px;
  }

  @utility text-heading-2 {
    font-size: 32px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.64px;
  }

  @utility text-heading-3 {
    font-size: 24px;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.24px;
  }

  @utility text-heading-4 {
    font-size: 20px;
    font-weight: 600;
    line-height: 1.35;
    letter-spacing: 0;
  }

  @utility text-heading-5 {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
    letter-spacing: 0;
  }

  @utility text-body-lg {
    font-size: 18px;
    font-weight: 400;
    line-height: 1.6;
    letter-spacing: 0.18px;
  }

  @utility text-body {
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0.16px;
  }

  @utility text-body-sm {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.45;
    letter-spacing: 0.14px;
  }

  @utility text-caption {
    font-size: 12px;
    font-weight: 400;
    line-height: 1.4;
    letter-spacing: 0.12px;
  }

  @utility text-label {
    font-size: 12px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: 0.8px;
  }

  @utility text-code {
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;
    font-family: var(--font-mono);
  }
  ```

  **Section 6 — Component base styles** via `@layer components`:

  ```css
  @layer components {
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      font-weight: 600;
      font-size: 14px;
      line-height: 1.45;
      color: var(--nc-primary-foreground);
      background: var(--nc-primary);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.15s ease;

      &:hover {
        background: var(--nc-primary-hover);
      }
      &:focus-visible {
        outline: 2px solid var(--nc-ring);
        outline-offset: 2px;
      }
      &:active {
        background: var(--nc-cobalt-800);
      }
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      font-weight: 600;
      font-size: 14px;
      line-height: 1.45;
      color: var(--nc-foreground);
      background: transparent;
      border: 1px solid var(--nc-border);
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.15s ease;

      &:hover {
        background: var(--nc-surface-elevated);
      }
      &:focus-visible {
        outline: 2px solid var(--nc-ring);
        outline-offset: 2px;
      }
    }

    .btn-ghost {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      font-weight: 600;
      font-size: 14px;
      line-height: 1.45;
      color: var(--nc-foreground-muted);
      background: transparent;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition:
        background 0.15s ease,
        color 0.15s ease;

      &:hover {
        background: var(--nc-surface-elevated);
        color: var(--nc-foreground);
      }
      &:focus-visible {
        outline: 2px solid var(--nc-ring);
        outline-offset: 2px;
      }
    }

    .card {
      background: var(--nc-surface);
      border: 1px solid var(--nc-border);
      border-radius: 4px;
      padding: 24px;
    }

    .input {
      background: var(--nc-surface);
      border: 1px solid var(--nc-border);
      border-radius: 4px;
      padding: 8px 12px;
      font-size: 16px;
      line-height: 1.5;
      color: var(--nc-foreground);
      outline: none;
      transition:
        border-color 0.15s ease,
        box-shadow 0.15s ease;

      &::placeholder {
        color: var(--nc-foreground-muted);
      }
      &:focus {
        border-color: var(--nc-primary);
        box-shadow: 0 0 0 1px var(--nc-ring);
      }
    }

    .badge {
      display: inline-flex;
      align-items: center;
      font-size: 12px;
      font-weight: 500;
      line-height: 1.4;
      letter-spacing: 0.12px;
      color: var(--nc-cobalt-400);
      background: var(--nc-cobalt-950);
      border-radius: 4px;
      padding: 2px 8px;
    }
  }
  ```

  3. Verify the final file has NO `@media (prefers-color-scheme: dark)` blocks
  4. Verify `@import 'tailwindcss'` is on line 1 (not nested)
  5. Verify all old variables (`--text`, `--bg`, `--accent`, `--text-h`, `--border`, `--code-bg`, `--accent-bg`, `--accent-border`, `--social-bg`, `--shadow`, `--sans`, `--heading`, `--mono`) are completely removed

- **Project context**:
  - Framework: TailwindCSS v4.2.2 with `@tailwindcss/vite` plugin — CSS-first configuration, no `tailwind.config.js`
  - Conventions: No semicolons in TS (Prettier), but CSS uses standard semicolons. 2-space indentation.
  - Libraries: Tailwind v4 uses `@theme` for utility class generation, `@utility` for custom utilities, `@layer components` for component-level styles
  - CRITICAL: In Tailwind v4, `@import 'tailwindcss'` MUST be at the top level of the file, never inside a media query or any other at-rule
  - CRITICAL: In Tailwind v4, `@theme` variables use `--color-*` prefix for colors, `--font-*` for font families, `--radius-*` for border radii. Tailwind auto-generates the corresponding utility classes (e.g., `--color-primary` → `bg-primary`, `text-primary`; `--font-sans` → `font-sans`).
  - CRITICAL: In Tailwind v4, custom multi-property utilities must use `@utility` (not `@layer utilities`). The `@utility` directive allows defining compound utilities like `text-heading-1` that set multiple properties.
- **Dependencies**: None (TASK-001 is independent; font availability is a runtime concern, not a build concern)
- **Acceptance criteria**:
  - `@import 'tailwindcss'` is on line 1, at the top level
  - No `@media (prefers-color-scheme: dark)` blocks exist
  - No old CSS variable names (`--text`, `--bg`, `--accent`, etc.) exist
  - `:root` contains all `--nc-*` custom properties per the Design Tokens spec
  - `:root` has `color-scheme: dark`
  - `@theme` block defines all colors, font families, and border radii
  - Typography utility classes (`text-display`, `text-heading-1`, ..., `text-code`) are defined via `@utility`
  - Component classes (`.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.card`, `.input`, `.badge`) are defined in `@layer components`
  - Base element styles for `html`, `body`, `h1`–`h5`, `p`, `code`, `#root` are present
  - The Tailwind build succeeds without errors (AC-15)
  - `bg-background` produces `#0E0E0E` (AC-2), `bg-surface` produces `#131313` (AC-3), `bg-primary` produces `#0057FF` (AC-4)
  - `text-foreground` produces `#E0E0E0` (AC-5), `text-muted` produces `#6B6B6B` (AC-6 — note: Tailwind generates `text-foreground-muted` from `--color-foreground-muted`; to also support `text-muted`, add `--color-muted` as alias or document that `text-foreground-muted` is the correct class)
  - `border-default` produces `rgba(67, 70, 86, 0.15)` (AC-7 — note: the Tailwind utility will be `border-border` from `--color-border`; to support `border-default`, add `--color-default` alias in `@theme` mapping to the same value)
  - `font-sans` resolves to `'Space Grotesk', system-ui, sans-serif` (AC-9)

  **Important AC-6 and AC-7 clarifications**: The spec acceptance criteria mention `text-muted` and `border-default`. To satisfy these exactly, add these aliases in the `@theme` block:

  ```css
  --color-muted: var(--color-gray-500);
  --color-default: rgba(67, 70, 86, 0.15);
  ```

  This ensures `text-muted` and `border-default` work as specified in the ACs, in addition to `text-foreground-muted` and `border-border`.

---

#### TASK-003: Migrate `src/App.css` to use `--nc-*` design tokens

- **Description**: Update all CSS custom property references in `App.css` from the old variable names (`--accent`, `--accent-bg`, `--accent-border`, `--text-h`, `--border`, `--social-bg`, `--shadow`) to the new `--nc-*` token names. The old variables will no longer exist after TASK-002, so this migration is required for visual correctness.
- **Files**: `src/App.css`
- **Instructions**:
  1. Read the current `src/App.css` (184 lines)
  2. Apply the following variable mapping for all occurrences:

  | Old Variable           | New Variable                                                              | Reasoning                                                                       |
  | ---------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
  | `var(--accent)`        | `var(--nc-primary)`                                                       | Primary accent color                                                            |
  | `var(--accent-bg)`     | `var(--nc-cobalt-950)`                                                    | Accent background (dark subtle cobalt)                                          |
  | `var(--accent-border)` | `var(--nc-cobalt-700)`                                                    | Accent border on hover                                                          |
  | `var(--text-h)`        | `var(--nc-foreground-heading)`                                            | Heading/high-emphasis text                                                      |
  | `var(--border)`        | `var(--nc-border)`                                                        | Default border color                                                            |
  | `var(--social-bg)`     | `var(--nc-surface-elevated)`                                              | Social link button background                                                   |
  | `var(--shadow)`        | `0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.25)` | Dark mode shadow (inline, since `--nc-shadow` is not part of the design tokens) |
  3. Specific changes by line:
     - Line 5: `color: var(--accent)` → `color: var(--nc-primary)`
     - Line 6: `background: var(--accent-bg)` → `background: var(--nc-cobalt-950)`
     - Line 12: `border-color: var(--accent-border)` → `border-color: var(--nc-cobalt-700)`
     - Line 15: `outline: 2px solid var(--accent)` → `outline: 2px solid var(--nc-primary)`
     - Line 75: `border-top: 1px solid var(--border)` → `border-top: 1px solid var(--nc-border)`
     - Line 99: `border-right: 1px solid var(--border)` → `border-right: 1px solid var(--nc-border)`
     - Line 103: `border-bottom: 1px solid var(--border)` → `border-bottom: 1px solid var(--nc-border)`
     - Line 119: `color: var(--text-h)` → `color: var(--nc-foreground-heading)`
     - Line 122: `background: var(--social-bg)` → `background: var(--nc-surface-elevated)`
     - Line 131: `box-shadow: var(--shadow)` → `box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.25)`
     - Line 158: `border-top: 1px solid var(--border)` → `border-top: 1px solid var(--nc-border)`
     - Line 178: `border-left-color: var(--border)` → `border-left-color: var(--nc-border)`
     - Line 182: `border-right-color: var(--border)` → `border-right-color: var(--nc-border)`

  4. Also remove the `.counter` `display: inline-flex` and `border-radius` properties if they conflict with the updated base `code` styles in `index.css` — keep them as-is since `.counter` is a button, not a code element, and has its own styling needs. However, update `border-radius: 5px` (line 4) to `border-radius: 4px` to match the design system's default radius.

- **Project context**:
  - Framework: React 19, component styles in separate `.css` files imported by components
  - Conventions: CSS uses native nesting (`&` syntax), 2-space indentation
  - Libraries: No CSS-in-JS; plain CSS files
  - The `#social .button-icon { filter: invert(1) brightness(2); }` dark mode rule in the old `index.css` can be moved here if needed, but since the app is now dark-only, this filter should be the default state. Check if icons need inversion. The old rule was inside `@media (prefers-color-scheme: dark)` and will be removed with TASK-002. If the icons need the filter, add it directly (unconditionally) in this file.
- **Dependencies**: TASK-002 must complete first (the old variables are removed in TASK-002; this task expects the new `--nc-*` variables to exist)
- **Acceptance criteria**:
  - No references to old variable names (`--accent`, `--accent-bg`, `--accent-border`, `--text-h`, `--border`, `--social-bg`, `--shadow`) remain in `App.css`
  - All replacements use the correct `--nc-*` equivalents per the mapping table
  - `.counter` border-radius is `4px` (matching design system default)
  - The dark mode icon filter (`#social .button-icon { filter: invert(1) brightness(2); }`) is added unconditionally if icons require it for visibility on dark background
  - The application builds successfully (`npm run build`)
  - Visual styles remain functionally equivalent (same intent, new token values)

---

### Execution Order

#### Parallel Group 1 (no dependencies)

- **TASK-001**: Add Google Fonts to `index.html`
- **TASK-002**: Rewrite `src/index.css` with design system

#### Parallel Group 2 (depends on Group 1)

- **TASK-003**: Migrate `src/App.css` to `--nc-*` tokens (depends on TASK-002)

### Verification Checklist

- [x] All requirements from the spec are covered:
  - AC-1: `--nc-*` custom properties on `:root` (TASK-002, Section 3)
  - AC-2–6: Color utilities via `@theme` (TASK-002, Section 2)
  - AC-7: Border color via `@theme` (TASK-002, Section 2 — `--color-default` alias)
  - AC-8: Default border-radius 4px via `@theme` (TASK-002, Section 2 — `--radius: 4px`)
  - AC-9: `font-sans` → Space Grotesk via `@theme` (TASK-002, Section 2)
  - AC-10: `color-scheme: dark` on `:root` (TASK-002, Section 3)
  - AC-11: Typography utilities via `@utility` (TASK-002, Section 5)
  - AC-12: `.btn-primary` via `@layer components` (TASK-002, Section 6)
  - AC-13: `.card` via `@layer components` (TASK-002, Section 6)
  - AC-14: `.input` via `@layer components` (TASK-002, Section 6)
  - AC-15: Clean Tailwind build (verified after all tasks)
  - AC-16: Space Grotesk font loading (TASK-001)
- [x] No task modifies files outside its scope (TASK-001 → `index.html`, TASK-002 → `src/index.css`, TASK-003 → `src/App.css`)
- [x] Dependencies are correctly mapped (TASK-003 depends on TASK-002; TASK-001 and TASK-002 are independent)
- [x] Each task has clear acceptance criteria
- [x] Edge cases are addressed:
  - Edge Case 1 (font failure): `font-display: swap` in Google Fonts URL (TASK-001) + fallback chain in `@theme` (TASK-002)
  - Edge Case 2 (existing styles): Full rewrite of `index.css` (TASK-002) + migration of `App.css` (TASK-003)
  - Edge Case 3 (namespace collisions): Semantic names (`background`, `surface`, `foreground`) extend Tailwind, plus `--nc-*` namespace for direct CSS usage
  - Edge Case 4 (opacity modifiers): All base colors in hex format (supports Tailwind opacity modifiers); `border` color in `rgba` as exception
  - Edge Case 5 (App.css migration): Explicit variable mapping in TASK-003

## Notes

- The project uses **TailwindCSS v4.2.2** with the `@tailwindcss/vite` plugin, which means configuration is CSS-first via `@theme` directives, NOT via a `tailwind.config.js` file.
- The existing `src/index.css` has a problematic structure: `@import 'tailwindcss'` is nested inside a `@media (prefers-color-scheme: dark)` block. This must be restructured — `@import 'tailwindcss'` should be at the top level.
- Existing CSS custom properties (`--text`, `--bg`, `--accent`, etc.) in `index.css` and `App.css` reference the old design system. These will need to be migrated to the new `--nc-*` tokens. The migration of component-specific styles in `App.css` is in-scope for this spec.
- The design brief mentions "Dot Matrix" for headings — this appears to be a stylistic descriptor for the aesthetic rather than an actual Dot Matrix font. Space Grotesk Bold is the actual heading font per the token `"headings": "Dot Matrix / Space Grotesk Bold"`.
- The `saturation: 0` token confirms the gray scale is pure grayscale with no color tint.

## Changelog

- 2026-04-03: Initial draft
- 2026-04-03: Technical plan added by TPM
- 2026-04-03: Implementation completed — 3 tasks (TASK-001, TASK-002, TASK-003) all passed TPM verification and Validator review (APPROVED, 0 CRITICAL, 0 MAJOR, 3 MINOR). Build succeeds.
