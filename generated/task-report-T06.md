# Task Report: T-06 — Create Shared Storage Utility and Extract Magic Numbers

**Status**: Complete
**Date**: 2026-04-04

## Changes Made

### 1. Created `src/data/storage-utils.ts`

New file with a generic `createStorage<T>` factory function that encapsulates the localStorage read/write pattern with a memory fallback for environments where localStorage is unavailable or full.

### 2. Refactored `src/data/guest-store.ts`

- Removed inline `memoryFallback` variable, `readFromStorage()`, and `writeToStorage()` functions (lines 8–27 of original)
- Replaced with `const storage = createStorage<Guest[]>(STORAGE_KEY, [])`
- All internal calls to `readFromStorage()` → `storage.read()` and `writeToStorage(...)` → `storage.write(...)`
- Kept `STORAGE_KEY` constant value unchanged (`'seating-plan:guests'`)
- Removed `export type { Guest, GuestStatus }` re-export (aligned with T-01's type extraction to `guest-types.ts`)
- All exported functions remain identical in signature and behavior

### 3. Refactored `src/data/table-store.ts`

- Removed inline `memoryFallback`, `memoryCounterFallback`, `readFromStorage()`, `writeToStorage()`, `readCounter()`, and `writeCounter()` functions (lines 10–51 of original)
- Replaced with:
  - `const tableStorage = createStorage<FloorTable[]>('seating-plan:tables', [])`
  - `const counterStorage = createStorage<number>('seating-plan:table-counter', 0)`
- All internal calls updated: `readFromStorage()` → `tableStorage.read()`, `writeToStorage(...)` → `tableStorage.write(...)`, `readCounter()` → `counterStorage.read()`, `writeCounter(...)` → `counterStorage.write(...)`
- All exported functions remain identical in signature and behavior

### 4. Extracted Magic Numbers

- **`src/components/organisms/SeatingCanvas.tsx`**: Added `CANVAS_WIDTH = 3000` and `CANVAS_HEIGHT = 2000` at module scope; replaced inline values in the canvas `style` prop
- **`src/components/molecules/SeatAssignmentPopover.tsx`**: Added `POPOVER_WIDTH = 224` and `POPOVER_GAP = 8` at module scope; replaced all inline `224` and `8` values used for popover positioning
- **`src/components/molecules/CanvasTable.tsx`**: Added `TOUCH_MOVE_THRESHOLD = 10` at module scope; replaced inline `10` in the touch move distance check

## Files Created

- `src/data/storage-utils.ts`

## Files Modified

- `src/data/guest-store.ts`
- `src/data/table-store.ts`
- `src/components/organisms/SeatingCanvas.tsx`
- `src/components/molecules/SeatAssignmentPopover.tsx`
- `src/components/molecules/CanvasTable.tsx`

## Build Verification

Build command `npx tsc -b && npx vite build` produces no new errors. All errors in the output are pre-existing from parallel tasks (T-01 type extraction from `mock-guests.ts`, T-09 `searchQuery` removal).

## Acceptance Criteria

- [x] `src/data/storage-utils.ts` exists with `createStorage` function
- [x] `guest-store.ts` uses `createStorage` (no inline `readFromStorage`/`writeToStorage`)
- [x] `table-store.ts` uses `createStorage` for both tables and counter
- [x] Canvas dimensions use named constants `CANVAS_WIDTH`/`CANVAS_HEIGHT`
- [x] Popover uses named constants `POPOVER_WIDTH`/`POPOVER_GAP`
- [x] Touch threshold uses named constant `TOUCH_MOVE_THRESHOLD`
- [x] No new build errors introduced
