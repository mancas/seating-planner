# Task Report: TASK-4-WIRING

## Summary

Wired `MobileSeatAssignmentSheet` into `SeatingCanvas` and `App.tsx` so that mobile users see the bottom sheet (not the desktop popover) when tapping a seat. Desktop behavior remains unchanged.

## Changes Made

### `src/App.tsx`

1. Destructured `handleReassignGuest` from `useTableState()` (line 65)
2. Passed `onReassignGuest={handleReassignGuest}` prop to `<SeatingCanvas>` (line 213)

### `src/components/organisms/SeatingCanvas.tsx`

1. Added import for `MobileSeatAssignmentSheet` (line 12)
2. Added `onReassignGuest` to the `Props` interface (line 41)
3. Destructured `onReassignGuest` in component function signature (line 69)
4. Updated `handleSeatClick` to call `onSelectTable(null)` on mobile, which closes `MobilePropertiesSheet` before opening the seat sheet (lines 166-167)
5. Replaced unconditional `SeatAssignmentPopover` rendering with conditional logic:
   - Desktop (`!isMobile`): renders `SeatAssignmentPopover` using `onAssignGuest` (lines 290-307)
   - Mobile (`isMobile`): renders `MobileSeatAssignmentSheet` using `onReassignGuest`, passing `tables` and `guests` for assigned-elsewhere computation (lines 308-326)

## Acceptance Criteria Verification

| AC    | Description                                       | Status                                                                                     |
| ----- | ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| AC-15 | Mobile seat tap opens MobileSeatAssignmentSheet   | PASS - conditional `isMobile` check renders sheet instead of popover                       |
| AC-16 | Mobile seat tap closes properties sheet first     | PASS - `onSelectTable(null)` called in handleSeatClick on mobile                           |
| AC-17 | Selecting assigned-elsewhere guest moves them     | PASS - mobile sheet uses `onReassignGuest` which clears old assignments first              |
| AC-18 | Desktop seat click opens SeatAssignmentPopover    | PASS - `!isMobile` condition preserves desktop behavior                                    |
| AC-19 | Closing seat sheet leaves no stale state          | PASS - `onClose` calls `setActiveSeat(null)`                                               |
| AC-20 | Mobile table body tap opens MobilePropertiesSheet | PASS - `onSelectTable(table.id)` in CanvasTable unchanged; only seat clicks deselect table |

## TypeScript Verification

`npx tsc --noEmit` passes with zero errors.
