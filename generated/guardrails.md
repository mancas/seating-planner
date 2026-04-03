# Guardrails

Lessons learned and constraints established from validated specs.

---

## From: Nought Cobalt Design System (2026-04-03)

### G-1: Tailwind v4 `@import` Must Be Top-Level

**Rule**: `@import 'tailwindcss'` must always be the very first line of `src/index.css`, at the top level. Never nest it inside a media query, selector, or any other at-rule.
**Reason**: The original codebase had `@import 'tailwindcss'` nested inside `@media (prefers-color-scheme: dark)`, which was incorrect and caused issues. Tailwind v4 requires top-level imports.

### G-2: Use `@theme` for Tailwind Utility Generation, `:root` for Direct CSS Variables

**Rule**: Design tokens that should generate Tailwind utility classes go in the `@theme` block (using `--color-*`, `--font-*`, `--radius-*` namespaces). Tokens intended for direct CSS consumption (in component styles, animations, overrides) go in `:root` with the `--nc-*` prefix.
**Reason**: Tailwind v4's `@theme` directive has a dual purpose — it both defines CSS variables and generates corresponding utility classes. The `--nc-*` namespace in `:root` provides a clean API for non-Tailwind CSS usage.

### G-3: All Design Tokens Use `--nc-*` Namespace

**Rule**: When referencing design tokens in custom CSS (outside Tailwind utilities), always use `var(--nc-*)` variables, never raw hex values or Tailwind's generated `var(--color-*)` variables.
**Reason**: The `--nc-*` namespace prevents collisions with third-party CSS and Tailwind internals. It provides clear provenance when debugging.

### G-4: No Light Mode — Dark Only

**Rule**: Never add `prefers-color-scheme` media queries or `color-scheme: light dark` to any CSS file. The application is dark-mode only with `color-scheme: dark` on `:root`.
**Reason**: Design decision DD-10. The design system specifies `color_mode: "DARK"` with no light mode variant.

### G-5: Default Border Radius is 4px

**Rule**: Use `4px` (or the `rounded` Tailwind utility) as the default border radius for all new components. Only deviate with explicit design justification.
**Reason**: Design decision DD-8. The design tokens specify `ROUND_FOUR` (4px) as the global default.

### G-6: Use `@utility` for Multi-Property Utility Classes

**Rule**: When defining custom Tailwind utilities that set multiple CSS properties (e.g., typography classes that set font-size, weight, line-height, and letter-spacing), use the `@utility` directive, not `@layer utilities`.
**Reason**: Tailwind v4 best practice. `@utility` is the v4 mechanism for custom utilities that work with variants.

### G-7: Use `@layer components` for Component Base Styles

**Rule**: Component base styles (`.btn-*`, `.card`, `.input`, `.badge`, etc.) go in `@layer components` to ensure proper specificity ordering — they can be overridden by Tailwind utilities.
**Reason**: Tailwind v4 CSS architecture. The `components` layer sits between `base` and `utilities` in specificity.

### G-8: `focus-visible` for Buttons, `focus` for Inputs

**Rule**: Interactive elements that are primarily clicked (buttons) should use `:focus-visible` for focus styling. Form inputs should use `:focus` since they always need visible focus indication.
**Reason**: Accessibility best practice. `:focus-visible` prevents distracting focus rings on mouse click for buttons while preserving keyboard accessibility.

### G-9: Google Fonts Must Include Preconnect

**Rule**: When loading fonts from Google Fonts, always include both preconnect links (`fonts.googleapis.com` and `fonts.gstatic.com` with `crossorigin`) before the stylesheet link in `<head>`.
**Reason**: Performance optimization. Preconnect hints reduce DNS lookup and connection time for font loading.

### G-10: Variable Migration Completeness

**Rule**: When renaming CSS custom properties, grep the entire `src/` directory for the old variable names to ensure zero references remain. Silent fallback to `initial` can cause hard-to-debug visual regressions.
**Reason**: CSS custom properties silently fall back to `initial` when undefined, rather than throwing errors. Missed references are invisible without visual inspection or automated checking.
