# Task Report: TASK-2-MOBILE-SHEET

## Task

Create MobileSeatAssignmentSheet component using the vaul Drawer pattern.

## Status: COMPLETE

## Files Created

- `src/components/organisms/MobileSeatAssignmentSheet.tsx`

## Implementation Summary

Created a new bottom sheet component following the exact same vaul Drawer pattern used by `MobilePropertiesSheet` and `MobileGuestsSheet`. The component:

1. **Props**: Accepts `seatIndex`, `tableLabel`, `assignedGuest`, `unassignedGuests`, `tables`, `guests`, `onAssign`, `onUnassign`, and `onClose`.

2. **Computed data**: Uses `useMemo` to derive `assignedElsewhere` — guests assigned to other seats across all tables — for reassignment.

3. **Two views**:
   - **Occupied seat**: Shows the assigned guest with Avatar and full name, plus a red UNASSIGN button.
   - **Empty seat**: Shows unassigned guests first (tappable to assign), then assigned-elsewhere guests with their current table/seat location (also tappable to reassign).

4. **Empty state**: When no unassigned guests and no assigned-elsewhere guests exist, displays "NO_UNASSIGNED_GUESTS // ALL_ALLOCATED".

5. **Drawer behavior**: Uses `open` prop with `onOpenChange` for close-on-swipe/overlay-tap, `data-vaul-no-drag` on scrollable body.

## Acceptance Criteria Verification

- AC-5: Empty seat header shows seat reference, unassigned list, and assigned-elsewhere with location
- AC-6: Tapping unassigned guest calls `onAssign(guestId)`
- AC-7: Tapping assigned-elsewhere guest calls `onAssign(guestId)`
- AC-8: Occupied seat shows assigned guest + UNASSIGN button calling `onUnassign`
- AC-9: Close button, swipe-down, overlay tap all call `onClose` via `onOpenChange`
- AC-10: Empty state message shown when no guests available
- AC-11: Guest list scrolls with `data-vaul-no-drag`

## Type Check

`npx tsc --noEmit` passes with no errors related to the new component.
