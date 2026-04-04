# Task Report: T-03 — Create Shared Utilities (OutletContext, getUnassignedGuests, btn-destructive)

**Status**: Complete
**Date**: 2026-04-04

## Changes Made

### Files Created

1. **`src/data/outlet-context.ts`** — Shared `OutletContext` interface importing `Guest` from `guest-types`. Defines the context shape (`guests`, `onAdd`, `onUpdate`, `onDelete`, `onCancel`) used by outlet page components.

2. **`src/data/guest-utils.ts`** — Utility module with `getUnassignedGuests(guests, tables)` function using the efficient `Set` + `flatMap` pattern to compute guests not assigned to any table seat.

### Files Modified

3. **`src/pages/AddGuestPage.tsx`** — Removed local `OutletContext` interface and `Guest` type import. Now imports `OutletContext` from `../data/outlet-context`.

4. **`src/pages/EditGuestPage.tsx`** — Removed local `OutletContext` interface and `Guest` type import. Now imports `OutletContext` from `../data/outlet-context`.

5. **`src/App.tsx`** — Added import of `getUnassignedGuests` from `./data/guest-utils`. Replaced inline `guests.filter(g => !tables.some(...))` computation (line 126-128) with `getUnassignedGuests(guests, tables)`.

6. **`src/components/organisms/SeatingCanvas.tsx`** — Added import of `getUnassignedGuests`. Replaced `useMemo` body (the `Set` + `flatMap` inline logic) with `getUnassignedGuests(guests, tables)` while preserving the `useMemo` wrapper and dependency array.

7. **`src/components/organisms/LeftSidebar.tsx`** — Added import of `getUnassignedGuests`. Replaced inline `allAssignedGuestIds` Set computation + filter with single `getUnassignedGuests(guests, tables)` call.

8. **`src/index.css`** — Added `.btn-destructive` class in the `@layer components` block with: red background (#dc2626), white text, hover state (#b91c1c), focus-visible outline using `var(--nc-ring)`, matching the existing button pattern structure.

9. **`src/components/organisms/GuestDetailPanel.tsx`** — Replaced both inline destructive button class strings (mobile line 40, desktop line 70) with `"btn-destructive flex-1"`.

10. **`src/components/organisms/GuestForm.tsx`** — Replaced inline destructive button class string (line 292) with `"btn-destructive"`.

11. **`src/components/molecules/ConfirmDialog.tsx`** — Replaced inline destructive button class string (line 45) with `"btn-destructive"`.

## Acceptance Criteria Verification

- [x] `OutletContext` defined once in `src/data/outlet-context.ts`
- [x] `AddGuestPage.tsx` and `EditGuestPage.tsx` import `OutletContext` from shared file
- [x] No local `OutletContext` interface in either page file
- [x] `getUnassignedGuests` utility exists in `src/data/guest-utils.ts`
- [x] All 3 locations use `getUnassignedGuests` instead of inline computation
- [x] `btn-destructive` CSS class exists in `index.css`
- [x] All 4 inline destructive button styles replaced with `btn-destructive`
- [x] Build passes (`tsc -b && vite build`)
