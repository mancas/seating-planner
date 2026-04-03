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

---

## From: Guest List Screen (2026-04-03)

### G-11: All Interactive Elements Must Be Keyboard Accessible

**Rule**: Every clickable element must be keyboard accessible. If using a `<button>`, ensure `cursor-pointer` is set (Tailwind preflight resets it to `default`). If using a `<div onClick>`, add `role="button"`, `tabIndex={0}`, and an `onKeyDown` handler — or refactor to a real `<button>`. All buttons must include `focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2` per guardrail G-8.
**Reason**: During guest list screen validation, `IconButton` was missing `focus-visible` outline, `NavLink` was missing `cursor-pointer`, and `GuestRow`/`SidebarNavItem` used `<div onClick>` without keyboard support. These are accessibility regressions that affect keyboard-only and assistive technology users.

### G-12: Always Review Ternary Branches for Copy-Paste Errors

**Rule**: When writing conditional expressions (ternaries), verify that the true and false branches produce different outputs. A ternary where both branches return the same value is always a bug.
**Reason**: A copy-paste error in `GuestDetailPanel` caused `shuttleRequired ? 'SHUTTLE REQUIRED' : 'SHUTTLE REQUIRED'` — both branches were identical, silently producing incorrect UI. TypeScript and ESLint cannot catch semantic duplication in string literals.

### G-13: Use Design System Typography Classes Consistently

**Rule**: All text elements must use the appropriate typography utility class from the design system (`text-label`, `text-caption`, `text-body-sm`, `text-heading-*`, etc.). Never rely on inherited font sizing when a typography class is specified in the spec.
**Reason**: The `NavLink` component was missing the `text-label` class, causing it to inherit sizing from its parent rather than using the 12px/500/0.8px design system label style. Typography inconsistencies are subtle and easy to miss in reviews.

### G-14: Mobile-Specific Groups Need Contextual Data

**Rule**: When rendering grouped data with different semantics (e.g., assigned vs. unassigned groups), ensure group metadata (like `totalSeats`) reflects the group's actual context. Don't hardcode values that only apply to some groups.
**Reason**: The mobile guest table hardcoded `totalSeats={8}` for all groups, including UNASSIGNED, which incorrectly showed "2/8 seats" for guests with no table. Group-specific metadata should be derived from the group's context.

---

## From: Guest CRUD Flow (2026-04-03)

### G-15: Form Inputs with Validation Must Include `aria-invalid`

**Rule**: Any form input that has validation (required, pattern, etc.) must include `aria-invalid={errors.fieldName ? 'true' : 'false'}`. Error message elements must use `role="alert"` to be announced by screen readers.
**Reason**: The react-hook-form FAQ explicitly recommends `aria-invalid` for accessible error states. Visual error indicators (red borders) are invisible to screen readers. Discovered in Guest CRUD Flow validation where `firstName` and `lastName` inputs lacked `aria-invalid`.

### G-16: Avoid `setState` Inside `useEffect` — Use Synchronous State Adjustment

**Rule**: When you need to update state based on navigation state, location, or props, prefer the "adjusting state during render" pattern over `useEffect` with `setState`. Check React's "You Might Not Need an Effect" guide before adding any `useEffect` that calls `setState`.
**Reason**: The React Compiler ESLint rule `react-hooks/set-state-in-effect` flags synchronous `setState` inside effects as an error. This causes cascading renders and blocks the pre-commit hook. The synchronous pattern avoids the extra render pass entirely.

### G-17: Single Source of Truth for Data Transformations

**Rule**: Data filtering, sorting, and transformation should happen in exactly one place. Do not filter/transform data in a parent component and then pass the result to a child that applies the same transformation again.
**Reason**: In Guest CRUD Flow, search filtering was applied in both `App.tsx` (producing `filteredGuests`) and `GuestTable.tsx` (its own internal filter). This duplication creates a maintenance risk where changes to one filter won't propagate to the other, potentially causing divergent behavior.

### G-18: Delete Unused Component Files

**Rule**: If a component is created but never imported anywhere, delete it. Unused files are dead code that increases cognitive load, confuses new contributors, and may trigger unused-export linting errors in the future.
**Reason**: `SelectInput.tsx` and `TextareaInput.tsx` atoms were created per spec but `GuestForm.tsx` used inline native elements instead. The files served no purpose but remained in the codebase.

### G-19: Custom Modal Dialogs Need Keyboard and ARIA Support

**Rule**: Custom modal/dialog components must include: `role="alertdialog"` or `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to the title element, an `onKeyDown` handler for Escape key to close, and ideally focus trapping.
**Reason**: The `ConfirmDialog` component lacked these standard accessibility patterns. While not flagged as blocking for the initial implementation, these are important for WCAG compliance and should be added for any production modal.
