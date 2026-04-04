# Task Report: T-05 — Unify GuestDetailPanel Markup and Normalize GuestRow Export

**Status**: Complete
**Date**: 2026-04-04

## Changes Made

### 1. Unified GuestDetailPanel Markup (`src/components/organisms/GuestDetailPanel.tsx`)

**Before**: Two fully duplicated blocks — a mobile full-screen overlay (`<div className="md:hidden fixed inset-0 ...">`, lines 22-49) and a desktop side panel (`<aside className="hidden md:flex ...">`, lines 52-79) — each containing identical header, `renderContent(guest)`, and action buttons.

**After**: Single responsive `<aside>` container that adapts via Tailwind responsive classes:

```tsx
<aside className="fixed inset-0 z-50 flex flex-col bg-background overflow-y-auto md:static md:inset-auto md:z-auto md:w-[320px] md:min-w-[320px] md:bg-surface md:border-l md:border-border">
```

- **Mobile** (`< md`): full-screen fixed overlay with `z-50`, `bg-background`
- **Desktop** (`md:`): static side panel with `w-[320px]`, `bg-surface`, `border-l`

The header, `renderContent(guest)`, and action buttons are now rendered once. The action buttons row uses `shrink-0` (from the mobile variant) which is harmless on desktop. Delete buttons already use `btn-destructive flex-1` (set by T-03).

**Line reduction**: 218 → 187 lines (31 lines removed — the entire duplicated block).

### 2. Normalized GuestRow Export (`src/components/molecules/GuestRow.tsx`)

Changed `export { GuestRowMobile }` (named export) to `export default GuestRowMobile` to match the codebase convention where every other component uses default exports.

### 3. Updated GuestTable Import (`src/components/organisms/GuestTable.tsx`)

Changed `import { GuestRowMobile } from '../molecules/GuestRow'` to `import GuestRowMobile from '../molecules/GuestRow'` to match the new default export.

## Verification

- `npx tsc -b` — passes (no type errors)
- `npx vite build` — passes (165 modules, dist output generated)

## Acceptance Criteria

- [x] `GuestDetailPanel` has a single responsive markup tree (no duplicated mobile/desktop blocks)
- [x] Mobile layout (full-screen overlay) and desktop layout (side panel) render identically
- [x] Delete buttons use `btn-destructive` class
- [x] `GuestRow.tsx` uses `export default GuestRowMobile`
- [x] `GuestTable.tsx` uses default import for `GuestRowMobile`
- [x] Build passes (`tsc -b && vite build`)
