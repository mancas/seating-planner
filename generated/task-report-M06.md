# Task Report: TASK-M06 — App Integration & Popover Fix

## Status: COMPLETE

## Summary

Wired mobile canvas components into `App.tsx` and fixed `SeatAssignmentPopover` close-on-outside-click for mobile touch devices.

## Changes Made

### `src/App.tsx`

1. **Added imports**: `MobilePropertiesSheet`, `MobileGuestsSheet`, `useIsMobile` hook, and `LuUsers` icon.
2. **Added state/hooks**: `isMobile` from `useIsMobile()` hook, `showMobileGuests` state for toggling the guests sheet.
3. **Computed `unassignedGuests`**: Filters guests not assigned to any seat across all tables.
4. **Mobile properties sheet**: Renders `MobilePropertiesSheet` when `isMobile && selectedCanvasTable` — props mirror `CanvasPropertiesPanel` (onUpdate, onDelete, onClose deselects table).
5. **Mobile unassigned guests FAB**: Fixed-position button at `bottom-[140px] right-4 z-30` with `LuUsers` icon and amber badge showing unassigned count. Hidden when count is 0. Also uses `md:hidden` for extra safety.
6. **Mobile unassigned guests sheet**: Renders `MobileGuestsSheet` when FAB is tapped, passing `unassignedGuests` and close handler.
7. **Hidden "Add guest" FAB on canvas**: Changed condition from `!isChildRoute` to `!isChildRoute && !isCanvasView` so the FAB doesn't appear on the seating canvas view.

### `src/components/molecules/SeatAssignmentPopover.tsx`

1. **Added `touchstart` listener**: Updated the `useEffect` close-on-outside-click handler to listen for both `mousedown` and `touchstart` events. Updated handler type to `MouseEvent | TouchEvent`. Cleanup removes both listeners.

## Acceptance Criteria Verification

| Criteria                                                                    | Status |
| --------------------------------------------------------------------------- | ------ |
| Mobile canvas shows unassigned guests FAB with amber badge                  | DONE   |
| FAB hidden when unassigned guest count is 0                                 | DONE   |
| Tapping FAB opens MobileGuestsSheet                                         | DONE   |
| Selected table on mobile opens MobilePropertiesSheet                        | DONE   |
| MobilePropertiesSheet updates table via onUpdate                            | DONE   |
| Delete via sheet removes table, closes sheet (onDelete + onClose deselects) | DONE   |
| Sheet close deselects table (setSelectedCanvasTableId(null))                | DONE   |
| "Add guest" FAB hidden on canvas view                                       | DONE   |
| SeatAssignmentPopover closes on outside tap (touchstart)                    | DONE   |
| Desktop behavior unchanged                                                  | DONE   |
| `tsc -b` compiles clean                                                     | DONE   |
| No lint errors                                                              | DONE   |

## Files Modified

- `src/App.tsx` (lines added: ~44, net new)
- `src/components/molecules/SeatAssignmentPopover.tsx` (lines changed: ~7)
