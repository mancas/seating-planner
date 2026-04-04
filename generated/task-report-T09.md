# Task Report: T-09 — Consolidate CSS Tokens (Remove Duplicated :root Block)

**Status**: Complete
**Date**: 2026-04-04

## Summary

Consolidated duplicated color tokens in `src/index.css` by making the `@theme` block reference the `:root` `--nc-*` custom properties instead of duplicating hex values. The `:root` block remains the single source of truth for all raw color values.

## Changes Made

### File: `src/index.css`

**`@theme` block updates (lines 3-55):**

1. **Gray scale (12 variables)**: Replaced all hardcoded hex values with `var(--nc-gray-*)` references
   - e.g., `--color-gray-950: #0a0a0a` → `--color-gray-950: var(--nc-gray-950)`

2. **Cobalt accent scale (8 variables)**: Replaced all hardcoded hex values with `var(--nc-cobalt-*)` references
   - e.g., `--color-cobalt-600: #0057ff` → `--color-cobalt-600: var(--nc-cobalt-600)`

3. **Semantic aliases with hardcoded values (3 variables)**:
   - `--color-border: rgba(67, 70, 86, 0.15)` → `--color-border: var(--nc-border)`
   - `--color-primary-foreground: #ffffff` → `--color-primary-foreground: var(--nc-primary-foreground)`
   - `--color-default: rgba(67, 70, 86, 0.15)` → `--color-default: var(--nc-border)`

4. **Unchanged**: Semantic aliases that already referenced other `@theme` variables (e.g., `--color-background: var(--color-gray-900)`) were left as-is since they chain through the now-updated gray/cobalt variables.

**`:root` block**: Untouched — remains the single source of truth with hex values.

**TSX files**: No modifications — existing `var(--nc-*)` references in TSX components continue to work correctly.

## Token Resolution Chain

```
:root --nc-gray-900: #0e0e0e
  ↑
@theme --color-gray-900: var(--nc-gray-900)
  ↑
@theme --color-background: var(--color-gray-900)
  ↑
Tailwind utility: bg-background → resolves to #0e0e0e
```

## Build Verification

- `npx vite build`: **Passes** — CSS compiled successfully, output at `dist/assets/index-DWOOvEoZ.css` (35.27 KB)
- `npx tsc -b`: Pre-existing TS errors from other refactoring tasks (T-01, T-06); **no CSS-related errors**

## Visual Impact

None. All color values resolve to the same hex codes as before — the change only affects the source-of-truth hierarchy, not computed values.

## Acceptance Criteria

- [x] All `@theme` hardcoded hex color values replaced with `var(--nc-*)` references
- [x] `:root` block left unmodified with hex values as single source of truth
- [x] No TSX files modified
- [x] Semantic `@theme` aliases properly chain through updated scale variables
- [x] Vite build passes
- [x] Visual appearance remains identical
