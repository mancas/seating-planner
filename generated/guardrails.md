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

---

## From: Replace Icons with react-icons (2026-04-03)

### G-20: Use a Single Icon Family for Consistency

**Rule**: All icons must come from a single `react-icons` sub-package (currently `react-icons/lu` — Lucide). Do not mix icon families (e.g., don't use `ri` icons alongside `lu` icons) unless there is an explicit design justification.
**Reason**: Mixing icon families produces inconsistent stroke widths, corner radii, and visual weight across the UI. The Nought Cobalt design system uses a clean, stroke-based aesthetic that aligns well with Lucide's consistent 2px stroke style.

### G-21: Verify Icon Export Names Against the Actual Package

**Rule**: Before specifying an icon component name in a spec or task, verify the export exists in the target `react-icons` sub-package by checking the library's documentation or source. Icon names may differ between the upstream icon library and the `react-icons` export (e.g., Lucide's `square-pen` is exported as `LuSquarePen`, not `LuPenSquare`).
**Reason**: The spec's icon mapping listed `LuPenSquare` which does not exist in `react-icons/lu`. The developer correctly used `LuSquarePen` instead, but the discrepancy between spec and implementation creates confusion for future reviewers.

### G-22: Use `size` Prop for Icon Dimensions, Not CSS Width/Height

**Rule**: Set icon dimensions via the `size` prop on `react-icons` components (e.g., `<LuX size={20} />`), not via CSS `w-*`/`h-*` classes. Only fall back to CSS sizing when matching an existing pattern that already uses CSS classes for the same element.
**Reason**: The `size` prop directly sets the SVG's `width` and `height` attributes, which is the canonical react-icons API. Using CSS classes introduces an indirection layer and may conflict with the component's default `1em` sizing.

---

## From: Seating Canvas (2026-04-03)

### G-23: Data Store Function Signatures Must Match Their Intended Contract

**Rule**: When a data store function is designed to accept certain fields for updates, the TypeScript type signature must accurately reflect which fields are accepted. Do not use `Omit` to accidentally exclude fields that should be updatable. Prefer `Partial<Pick<T, ...>>` to be explicit about which fields are accepted.
**Reason**: `table-store.ts` `updateTable` used `Omit<FloorTable, 'id' | 'badgeId' | 'label'>` which excluded `label` from the type. The function worked at runtime (JavaScript ignores TypeScript types), but the type contract told consumers `label` was not updatable — contradicting the spec. Always verify that `Omit` and `Pick` types include/exclude exactly the intended fields.

### G-24: Spec Is the Authoritative Reference for Literal Values

**Rule**: When the spec defines specific literal values (string constants, padding numbers, default counts), use those exact values. Do not substitute alternatives — even technically correct ones — without explicit spec amendment.
**Reason**: The implementation used `'ALFA'` (correct NATO spelling) instead of the spec's `'ALPHA'`, `padStart(3, '0')` instead of `padStart(2, '0')`, and default `seatCount: 6` instead of `8`. Each deviation was individually small but collectively undermined spec compliance. The spec is the contract.

### G-25: G-16 Applies Even When `useEffect` Seems Justified

**Rule**: The `react-hooks/set-state-in-effect` ESLint rule will block the pre-commit hook for ANY synchronous `setState` inside `useEffect`, regardless of justification. Always use the synchronous "adjusting state during render" pattern instead, even for resetting form state when a prop (like `table.id`) changes.
**Reason**: `CanvasPropertiesPanel` used `useEffect` to reset form state when the selected table changed, with a comment explaining why it was acceptable. The ESLint rule still flagged it as an error, blocking commits. The "adjusting state during render" pattern (tracking `prevTableId` in state, comparing during render) achieves the same result without triggering the rule.

### G-26: Collapse Identical Conditional Branches

**Rule**: Extends G-12. When an if/else or ternary has identical branches, collapse them into a single unconditional block — even if the code is functionally correct due to aliasing or side effects. Identical branches confuse reviewers and suggest incomplete implementation.
**Reason**: `swapSeats` had identical if/else branches with a comment "Re-read target table in case source and target are the same table." While the aliasing made both branches functionally correct, the identical code violated G-12 and was misleading.

---

## From: Semantic Table Refactor (2026-04-03)

### G-27: Define @tanstack/react-table Column Definitions at Module Scope

**Rule**: When using `@tanstack/react-table`, define the `columns` array (via `createColumnHelper<T>()`) at module scope (outside the component function), not inside the component. This ensures a stable reference and prevents unnecessary re-renders from `useReactTable` detecting a new columns reference on every render.
**Reason**: The TanStack Table docs explicitly warn that `data` and `columns` need stable references. Defining columns inside the component creates a new array reference on every render, causing the table to re-evaluate all row models unnecessarily. Module-scope columns are the recommended pattern from official docs.

### G-28: Use `border-separate` + `border-spacing-0` for Styled `<table>` Elements

**Rule**: When applying per-row or per-cell borders (e.g., `border-l-2` on `<tr>` for selected state indicators), use `border-collapse: separate` with `border-spacing: 0` on the `<table>` element. Do not use `border-collapse: collapse`.
**Reason**: `border-collapse: collapse` prevents `<tr>` borders from rendering in some browsers and blocks `border-radius` on cells. `border-separate` with `border-spacing-0` gives full control over individual cell/row borders while maintaining zero spacing between cells. The Tailwind classes are `border-separate border-spacing-0`.

---

## From: Sidebar Navigation (2026-04-03)

### G-29: Clean Up Vestigial Props After Interface Changes

**Rule**: When a feature removes functionality (e.g., search, tab switching), audit all components that consumed the removed data to eliminate vestigial props, state, and derived values. A required prop that is always passed a constant (like `searchQuery=""`) is dead code that confuses future developers.
**Reason**: After removing search from `TopNav`, the `GuestTable` component retained `searchQuery` as a required prop, and `App.tsx` passed `searchQuery=""`. The `hasActiveSearch` check and `NO_RESULTS // QUERY_MISMATCH` empty state in `GuestTable` became unreachable dead code. Props that always receive the same constant value should be removed or made optional.

### G-30: Verify Component Import Graph After Removing Consumers

**Rule**: When removing imports of a component from its only consumer (e.g., removing `NavLink` from `TopNav`, removing `SearchInput` from `TopNav`), check whether any other file still imports the component. If not, the component file is dead code per G-18. Document for cleanup even if deletion is out of scope for the current spec.
**Reason**: After the sidebar navigation refactor, `NavLink.tsx` and potentially `SearchInput.tsx` have zero consumers but were not flagged during development. A simple `grep import.*ComponentName` catches these orphaned files immediately.
