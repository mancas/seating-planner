# Task Report — T-07: Fix State Management Antipatterns

**Status**: Complete
**Date**: 2026-04-04

## Changes Made

### 1. Fix setState-during-render in `src/App.tsx`

**Before**: The `location.state` handling ran synchronously during render, calling `setSelectedGuestId` and `window.history.replaceState` directly in the component body — a React antipattern that can cause infinite re-render loops or unpredictable behavior.

**After**: Moved into a `useEffect` with `[location.state]` dependency. The effect reads `location.state`, conditionally sets `selectedGuestId`, and clears the history state. This follows React's rules of hooks and avoids setState-during-render.

**File**: `src/App.tsx` (lines 43–49)

### 2. Create `src/hooks/useGuestStats.ts` — Extract statistics computation

**Created** a new custom hook `useGuestStats` that accepts a `Guest[]` and returns memoized statistics (`confirmedCount`, `pendingCount`, `totalGuests`, `confirmationRate`, `dietaryFlagCount`, `waitlistCount`) via `useMemo`.

**Updated** `src/App.tsx` to import and use `useGuestStats(guests)` instead of computing the 6 statistics inline. This eliminates redundant filter passes on every render and centralizes the computation for reuse.

**Files**: `src/hooks/useGuestStats.ts` (new), `src/App.tsx`

### 3. Rename `onGuestClick` to `handleGuestClick` in `src/App.tsx`

Renamed the local function declaration from `onGuestClick` to `handleGuestClick` and updated its usage when passed as a prop to `<GuestTable>`. The `onGuestClick` prop name on the `GuestTable` component interface is preserved (props use `on` prefix per React convention; handlers in the parent use `handle` prefix).

**File**: `src/App.tsx` (lines 105, 234)

### 4. Fix hardcoded `totalSeats` in `src/components/organisms/GuestTable.tsx`

**Before**: Mobile view used `totalSeats={tableKey === 'UNASSIGNED' ? 0 : 8}`, hardcoding 8 seats for all tables.

**After**:

- Added a `tables` prop of type `FloorTable[]` to the `GuestTable` Props interface.
- Built a lookup map (`seatCountMap`) keyed by `FloorTable.label`, `FloorTable.badgeId`, and `FloorTable.id` to handle any assignment key format.
- Replaced the hardcoded `8` with `seatCountMap.get(tableKey) ?? groupGuests.length`, falling back to the number of assigned guests when no matching table is found.
- Updated `App.tsx` to pass `tables={tables}` to `<GuestTable>`.

**Files**: `src/components/organisms/GuestTable.tsx`, `src/App.tsx`

## Verification

- `npx tsc -b` — passes with zero errors
- `npx vite build` — builds successfully (551.69 kB JS, 35.79 kB CSS)
- All existing functionality preserved; no behavioral changes beyond fixing the antipatterns
