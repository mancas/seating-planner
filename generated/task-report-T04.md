# Task Report: T-04 — Unify Table Properties Form

## Summary

Extracted the ~90% shared logic and UI from `CanvasPropertiesPanel` and `MobilePropertiesSheet` into a new `TablePropertiesForm` component. Each existing component is now a thin wrapper providing only its container (aside vs Drawer).

## Changes Made

### Created

- **`src/components/organisms/TablePropertiesForm.tsx`** (145 lines)
  - Contains all shared state and handlers: local `label` state, `handleLabelChange`, `handleShapeChange`, `handleSeatCountChange`, `handleRotationChange`
  - Contains full form UI: INFORMATION section (label input, badge), CONFIGURATION section (shape toggle, seat count slider, rotation slider with preset buttons), and DELETE ENTITY action button
  - Uses `key={table.id}` from parent to reset local state on table change (replaces the `prevTableId` antipattern)
  - Returns a React fragment so children become direct flex children of the parent container
  - Actions div includes `mt-auto` which takes effect in the CPC flex-col aside but is inert in the MPS scrollable div

### Modified

- **`src/components/organisms/CanvasPropertiesPanel.tsx`** (163 → 41 lines, **-75%**)
  - Removed: `useState` import, `ShapeToggle` import, all local state (`label`, `prevTableId`), all handler functions
  - Kept: outer `<aside>` wrapper with header (PROPERTIES title + close button)
  - Added: `<TablePropertiesForm key={table.id} ... />` as the form content

- **`src/components/organisms/MobilePropertiesSheet.tsx`** (181 → 57 lines, **-69%**)
  - Removed: `useState` import, `ShapeToggle` import, `TableShape` type import, all local state (`label`, `prevTableId`), all handler functions, all inline form markup
  - Kept: Vaul `<Drawer>` wrapper with portal/overlay/content/handle/title, header, and scrollable body container
  - Added: `<TablePropertiesForm key={table.id} ... />` inside the scrollable body

## Issues Addressed

- **Issue 2.1**: CanvasPropertiesPanel and MobilePropertiesSheet are no longer near-identical — shared logic is now in one place
- **Issue 4.2**: The `prevTableId` getDerivedStateFromProps antipattern is eliminated — `key={table.id}` causes React to remount `TablePropertiesForm` when the selected table changes, naturally resetting local state

## Verification

- `npx tsc -b` — passes with no type errors
- `npx vite build` — passes successfully

## Acceptance Criteria

- [x] `TablePropertiesForm.tsx` exists with all shared form logic and UI
- [x] `CanvasPropertiesPanel.tsx` is reduced to ~41 lines (wrapper only)
- [x] `MobilePropertiesSheet.tsx` is reduced to ~57 lines (Drawer wrapper only)
- [x] No `prevTableId` state pattern in any file (replaced by `key` prop)
- [x] Form behavior (label editing, shape toggle, sliders, presets) is identical
- [x] Build passes (`tsc -b && vite build`)
