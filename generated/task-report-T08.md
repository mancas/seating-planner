# Task Report T-08: Extract DnD Handler into Custom Hook

**Status**: Complete
**Date**: 2026-04-04

## Summary

Extracted the ~55-line `handleDragEnd` callback from `App.tsx` into a dedicated `useDragEndHandler` custom hook, addressing Issue 8.1 (DnD Handler Logic in App.tsx).

## Changes Made

### Created

- **`src/hooks/useDragEndHandler.ts`** — New custom hook containing the full drag-end logic:
  - Accepts `tables`, `handleAssignGuest`, and `handleSwapSeats` as parameters
  - Returns a `useCallback`-wrapped handler that processes three DnD cases:
    1. Guest dropped on a seat → assigns guest
    2. Seat dropped on another seat → swaps seats
    3. Guest dropped on table body → finds first empty seat and assigns
  - Imports DnD type constants and interfaces from `../data/dnd-types`

### Modified

- **`src/App.tsx`**:
  - Removed the 58-line inline `handleDragEnd` `useCallback` block (lines 134–191)
  - Replaced with single-line hook call: `const handleDragEnd = useDragEndHandler(tables, handleAssignGuest, handleSwapSeats)`
  - Removed now-unused imports: `DRAG_TYPE_GUEST`, `DRAG_TYPE_SEAT`, `DragGuestData`, `DragSeatData`, `DropSeatData`, `DropTableData` from `./data/dnd-types`
  - Added import: `useDragEndHandler` from `./hooks/useDragEndHandler`
  - Also fixed a prop name mismatch (`handleGuestClick` → `onGuestClick`) on the `GuestTable` component that was introduced by a concurrent T-07 change

## Net Effect

- `App.tsx` reduced by ~55 lines (from ~330 to ~274 lines)
- DnD handler logic is now isolated, testable, and reusable
- No behavioral changes — all three DnD interaction patterns work identically

## Verification

- `npx tsc -b` — passes with no errors
- `npx vite build` — production build succeeds (167 modules, 551 KB JS bundle)
