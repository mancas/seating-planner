# Task Report: TASK-3-REASSIGNMENT

## Task

Add `handleReassignGuest` support to `useTableState` hook.

## Status: COMPLETE

## Changes Made

### `src/hooks/useTableState.ts`

- **Added `handleReassignGuest` callback** (lines 61-68): A new `useCallback` that first calls `storeClearGuestAssignments(guestId)` to remove the guest from all existing seat assignments across all tables, then calls `storeAssignGuestToSeat(tableId, seatIndex, guestId)` to assign them to the new seat, and finally calls `refreshTables()` to update React state.
- **Exported `handleReassignGuest`** in the return object (line 107).

## Implementation Details

- The store imports (`storeClearGuestAssignments` and `storeAssignGuestToSeat`) were already present in the file (lines 8, 11), so no import changes were needed.
- The existing `handleAssignGuest` remains unchanged -- it only calls `storeAssignGuestToSeat` without clearing prior assignments, which is correct for the desktop popover flow where the user explicitly picks an unassigned guest.
- Both store operations (`clearGuestAssignments` then `assignGuestToSeat`) read/write localStorage independently and sequentially, so ordering is safe.

## Acceptance Criteria Verification

- **AC-12**: `handleReassignGuest("table2", 3, "guestA")` will call `storeClearGuestAssignments("guestA")` (removing guestA from all tables) then `storeAssignGuestToSeat("table2", 3, "guestA")` (assigning to Table 2 / Seat 3). SATISFIED.
- **AC-13**: `refreshTables()` is called after both store operations, which triggers `setTables(getTables())`, causing all table components on the canvas to re-render with updated guest counts. SATISFIED.
- **AC-14**: `handleAssignGuest` (lines 53-59) is completely unchanged. SATISFIED.

## Files Modified

- `src/hooks/useTableState.ts` (only file modified, as scoped)

## Verification

- TypeScript compilation (`npx tsc --noEmit`) passes with zero errors.
