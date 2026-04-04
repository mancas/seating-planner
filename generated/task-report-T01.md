# Task Report T-01: Extract Guest Types and Clean Up Dead Code

## Changes Made

- Extracted `Guest` interface and `GuestStatus` type into a dedicated `src/data/guest-types.ts` module
- Removed type definitions and dead utility functions from `mock-guests.ts` (kept only seed data array)
- Moved `screenToCanvas` function from `dnd-types.ts` into new `src/data/canvas-utils.ts`
- Removed `screenToCanvas` from `dnd-types.ts` (now only contains DnD type discriminators)
- Removed `export type { Guest, GuestStatus }` re-export from `guest-store.ts`
- Removed `export type { FloorTable, TableShape, SeatAssignment }` re-export from `table-store.ts`
- Updated all 15 consumer files to import `Guest`/`GuestStatus` from `guest-types` instead of `mock-guests`
- Updated `SeatingCanvas.tsx` to import `screenToCanvas` from `canvas-utils` instead of `dnd-types`

## Files Created

- `src/data/guest-types.ts` — `Guest` interface and `GuestStatus` type
- `src/data/canvas-utils.ts` — `screenToCanvas` coordinate conversion utility

## Files Modified

- `src/data/mock-guests.ts` — Removed type definitions (lines 1-23), dead utility functions (lines 155-191); added import from `guest-types`
- `src/data/guest-store.ts` — Changed import source to `guest-types`, removed type re-export, removed unused `GuestStatus` import
- `src/data/table-store.ts` — Removed `export type { FloorTable, TableShape, SeatAssignment }` re-export, removed unused `TableShape` import
- `src/data/dnd-types.ts` — Removed `screenToCanvas` function (lines 30-45)
- `src/App.tsx` — Import `Guest` from `guest-types`
- `src/pages/AddGuestPage.tsx` — Import `Guest` from `guest-types`
- `src/pages/EditGuestPage.tsx` — Import `Guest` from `guest-types`
- `src/components/organisms/GuestForm.tsx` — Import `Guest`, `GuestStatus` from `guest-types`
- `src/components/organisms/GuestDetailPanel.tsx` — Import `Guest` from `guest-types`
- `src/components/organisms/GuestTable.tsx` — Import `Guest` from `guest-types`
- `src/components/organisms/LeftSidebar.tsx` — Import `Guest` from `guest-types`
- `src/components/organisms/SeatingCanvas.tsx` — Import `Guest` from `guest-types`, `screenToCanvas` from `canvas-utils`
- `src/components/organisms/MobileSeatAssignmentSheet.tsx` — Import `Guest` from `guest-types`
- `src/components/organisms/MobileGuestsSheet.tsx` — Import `Guest` from `guest-types`
- `src/components/molecules/CanvasTable.tsx` — Import `Guest` from `guest-types`
- `src/components/molecules/SeatAssignmentPopover.tsx` — Import `Guest` from `guest-types`
- `src/components/molecules/GuestRow.tsx` — Import `Guest` from `guest-types`
- `src/components/atoms/StatusIcon.tsx` — Import `GuestStatus` from `guest-types`
- `src/components/atoms/StatusBadge.tsx` — Import `GuestStatus` from `guest-types`

## Build Result

**PASS** — `tsc -b && vite build` completed successfully (163 modules, 259ms build time)
