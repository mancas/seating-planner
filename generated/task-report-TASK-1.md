# Task Report: TASK-1-EVENT-PROPAGATION

## Summary

Fixed touch event propagation bug where tapping a seat on mobile triggers table selection via `onTouchEnd` bubbling. Added `onTouchEnd`-based seat action for mobile.

## Files Modified

### `src/components/atoms/SeatIndicator.tsx`

- Added `onMobileTap?: (e: React.TouchEvent) => void` to `Props` interface
- Added `onTouchEnd` handler to `<button>` that calls `e.preventDefault()` (to suppress synthesized `onClick`) and forwards to `onMobileTap` when provided
- Existing `onClick` prop preserved for desktop mouse clicks

### `src/components/molecules/CanvasTable.tsx`

- Added `onTouchEnd={(e) => e.stopPropagation()}` to the seat wrapper `<div>` in `seatPositions.map` — this prevents `touchend` from bubbling to the table container, which previously triggered `longPressHandlers.onTouchEnd()` -> `onTap()` -> `onSelect()`
- Passed `onMobileTap` prop to `SeatIndicator` inside `SeatSlot`, gated by `isMobile` — on mobile, the handler calls `e.stopPropagation()`, gets the bounding rect, and calls `onSeatClick(seatIndex, rect)`

## Acceptance Criteria Verification

| AC                                                                 | Status | Rationale                                                                                                                                                                                |
| ------------------------------------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AC-1: Tapping a seat on mobile does NOT select the table           | PASS   | `onTouchEnd` stopPropagation on seat wrapper prevents the event from reaching the table's `onTouchEnd` handler which calls `longPressHandlers.onTouchEnd()` -> `onTap()` -> `onSelect()` |
| AC-2: Tapping a seat on mobile does NOT open MobilePropertiesSheet | PASS   | Table selection (`onSelect`) is what triggers MobilePropertiesSheet; since table selection is prevented (AC-1), the sheet won't open                                                     |
| AC-3: Tapping the table body still selects the table               | PASS   | Table's own `onTouchEnd` handler is unchanged; only seat wrapper children stop propagation                                                                                               |
| AC-4: Desktop seat click behavior unchanged                        | PASS   | `onClick` handler on `SeatIndicator` is untouched; `onMobileTap` is `undefined` on desktop so `onTouchEnd` on the button is a no-op                                                      |

## Type Check

`npx tsc --noEmit` passes with zero errors.
