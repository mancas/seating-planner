# Task Report — Fix Validation Issues (6 CRITICAL + MAJOR)

**Date**: 2026-04-03
**Source**: `generated/validation-report.md` — Seating Canvas iteration 1

---

## Fixes Applied

### C-1: CanvasPropertiesPanel.tsx — useEffect + setState anti-pattern

**File**: `src/components/organisms/CanvasPropertiesPanel.tsx`

- Removed `useEffect` import (now imports only `useState` from React)
- Removed the `useEffect` block that called `setLabel`, `setShape`, `setSeatCount`, `setRotation` on `[table.id]` change
- Replaced with "adjusting state during render" pattern: tracks `prevTableId` via `useState`, synchronously resets form state when `table.id` changes
- This eliminates the `react-hooks/set-state-in-effect` ESLint error and the `react-hooks/exhaustive-deps` warning

### C-2: table-store.ts — updateTable can't update label

**File**: `src/data/table-store.ts:94`

- Changed `data: Partial<Omit<FloorTable, 'id' | 'badgeId' | 'label'>>` to `data: Partial<Omit<FloorTable, 'id' | 'badgeId'>>`
- `label` is now included in the accepted data type, matching spec AC-16 and the actual runtime behavior

### M-1: table-store.ts — Badge ID padding 3 → 2 digits

**File**: `src/data/table-store.ts:72`

- Changed `padStart(3, '0')` to `padStart(2, '0')`
- Badge IDs now produce `T01`, `T02`, etc. per spec DD-5

### M-2: SeatingCanvas.tsx — Default seat count 6 → 8

**File**: `src/components/organisms/SeatingCanvas.tsx:173`

- Changed `seatCount: 6` to `seatCount: 8` in the canvas click handler for adding new tables
- Matches spec AC-7/AC-8 default of 8 seats

### M-3: table-types.ts — 'ALFA' → 'ALPHA'

**File**: `src/data/table-types.ts:30`

- Changed first NATO label from `'ALFA'` to `'ALPHA'`
- Matches spec's `NATO_LABELS` array exactly

### M-4: table-store.ts — Identical if/else branches in swapSeats

**File**: `src/data/table-store.ts:204-219`

- Collapsed identical `if (sourceTableId === targetTableId) { ... } else { ... }` branches into a single unconditional block
- Added clarifying comment: "Remove target assignment (works for both same-table and cross-table cases)"
- Functionally equivalent; eliminates G-12 violation (branch duplication)

---

## Verification

| Check              | Result | Notes                       |
| ------------------ | ------ | --------------------------- |
| `npx tsc --noEmit` | PASS   | Zero errors                 |
| `npm run build`    | PASS   | 102 modules, built in 231ms |

---

## Files Modified

| File                                                 | Changes                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| `src/components/organisms/CanvasPropertiesPanel.tsx` | C-1: useEffect → render-time state adjustment                      |
| `src/data/table-store.ts`                            | C-2: updateTable type, M-1: badge padding, M-4: swapSeats branches |
| `src/components/organisms/SeatingCanvas.tsx`         | M-2: default seatCount 6 → 8                                       |
| `src/data/table-types.ts`                            | M-3: ALFA → ALPHA                                                  |
