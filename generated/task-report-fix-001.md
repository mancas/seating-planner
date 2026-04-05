# Task Report: Fix CRITICAL-1 and MAJOR-1

## Summary

Fixed two validation issues across `GuestListView.tsx` and `SeatingPlanView.tsx`:

1. **CRITICAL-1** — ESLint `react-hooks/refs` violations from reading/writing `ref.current` during render
2. **MAJOR-1** — Unstable `onClose` callback causing Escape-listener churn in `useOverlayPanel`

## Changes

### CRITICAL-1: Replace `useRef` with `useState` "adjusting state during render" pattern

**GuestListView.tsx**

- Removed `useRef` from imports (no other uses remained)
- Removed `displayedGuestRef` ref
- Added `useState<Guest | null>(null)` for `displayedGuest`
- Added render-time sync: `if (selectedGuest && selectedGuest !== displayedGuest) setDisplayedGuest(selectedGuest)`
- Introduced `panelGuest` derived variable to replace inline ref reads
- Updated `GuestDetailPanel` JSX to use `panelGuest` instead of `displayedGuest`

**SeatingPlanView.tsx**

- Removed `useRef` from imports (no other uses remained)
- Removed `displayedTableRef` ref
- Added `useState<FloorTable | null>(null)` for `displayedTable`
- Added render-time sync: `if (selectedCanvasTable && selectedCanvasTable !== displayedTable) setDisplayedTable(selectedCanvasTable)`
- Introduced `panelTable` derived variable to replace inline ref reads
- Updated `CanvasPropertiesPanel` JSX to use `panelTable` instead of `displayedTable`

### MAJOR-1: Wrap `onClose` in `useCallback`

**GuestListView.tsx**

- Added `handleClosePanel = useCallback(() => setSelectedGuestId(null), [])`
- Passed `handleClosePanel` to `useOverlayPanel` and `GuestDetailPanel.onClose`

**SeatingPlanView.tsx**

- Added `handleClosePanel = useCallback(() => handleSelectTable(null), [handleSelectTable])`
- Passed `handleClosePanel` to `useOverlayPanel` and `CanvasPropertiesPanel.onClose`
- Note: `handleSelectTable` is already memoized with `useCallback`, so the dependency is stable

## Verification

| Check                                                                  | Result                       |
| ---------------------------------------------------------------------- | ---------------------------- |
| `npx tsc --noEmit`                                                     | Pass (no errors)             |
| `npx eslint src/pages/GuestListView.tsx src/pages/SeatingPlanView.tsx` | Pass (no warnings or errors) |

## Files Modified

- `src/pages/GuestListView.tsx`
- `src/pages/SeatingPlanView.tsx`
