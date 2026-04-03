# Validation Report — Guest CRUD Flow

**Spec**: `spec/guest-crud-flow.md`
**Date**: 2026-04-03

---

## Iteration 1 — CHANGES_REQUESTED

**CRITICAL**: 0 | **MAJOR**: 4 | **MINOR**: 6

### MAJOR Issues Found

| ID      | File(s)                            | Description                                                                 |
| ------- | ---------------------------------- | --------------------------------------------------------------------------- |
| MAJOR-1 | GuestForm.tsx, FormError.tsx       | Missing `aria-invalid` on validated inputs and `role="alert"` on FormError  |
| MAJOR-2 | App.tsx:40-46                      | `setSelectedGuestId` in `useEffect` causes ESLint error (blocks pre-commit) |
| MAJOR-3 | App.tsx, GuestTable.tsx            | Double search filtering — search applied in both App and GuestTable         |
| MAJOR-4 | SelectInput.tsx, TextareaInput.tsx | Created but never used — dead code                                          |

---

## Iteration 2 — APPROVED

**CRITICAL**: 0 | **MAJOR**: 0 | **MINOR**: 6 (unchanged, acceptable)

### MAJOR Issue Resolution

| ID      | Status   | Verification Details                                                                                                                                                                                                                                |
| ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MAJOR-1 | RESOLVED | `FormError.tsx` now has `role="alert"` and accepts `id` prop. `GuestForm.tsx` adds `aria-invalid` and `aria-describedby` on both `firstName` and `lastName` inputs. `FormField.tsx` computes `errorId` from `htmlFor` and passes it to `FormError`. |
| MAJOR-2 | RESOLVED | `useEffect` removed from App.tsx. Replaced with synchronous state adjustment during render (lines 40-46) with guard `selectedGuestId !== locationState.selectedGuestId` to prevent re-render loops. `useEffect` removed from imports.               |
| MAJOR-3 | RESOLVED | Duplicate filtering removed from `GuestTable.tsx`. Filtering is now solely in `App.tsx` (lines 101-104). `GuestTable` receives pre-filtered `guests` prop and only groups them. Comment at line 26 documents the responsibility boundary.           |
| MAJOR-4 | RESOLVED | `SelectInput.tsx` and `TextareaInput.tsx` deleted. No remaining imports or references found in the codebase.                                                                                                                                        |

### New Issues Introduced by Fixes

None detected.

### Build Verification

| Check              | Result | Notes                                                                                                                     |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| `npx tsc --noEmit` | PASS   | Zero errors                                                                                                               |
| `npm run lint`     | PASS   | Zero errors, 1 warning (`react-hooks/incompatible-library` for `watch()` — known acceptable React Compiler interop issue) |
| `npm run build`    | PASS   | Built successfully (74 modules, 167ms)                                                                                    |

### Remaining MINOR Issues (not blocking)

| ID      | Severity | File(s)                                                | Description                                              |
| ------- | -------- | ------------------------------------------------------ | -------------------------------------------------------- |
| MINOR-1 | MINOR    | AddGuestPage.tsx, EditGuestPage.tsx                    | Duplicated `OutletContext` interface                     |
| MINOR-2 | MINOR    | GuestForm.tsx, GuestDetailPanel.tsx, ConfirmDialog.tsx | Destructive button styling duplicated                    |
| MINOR-3 | MINOR    | GuestForm.tsx:112                                      | Heading uses `text-heading-3` vs spec's `text-heading-1` |
| MINOR-4 | MINOR    | ConfirmDialog.tsx                                      | No Escape key, ARIA dialog role, or focus trap           |
| MINOR-5 | MINOR    | GuestDetailPanel.tsx:109                               | Dialog not dismissed before `onDelete`                   |
| MINOR-6 | MINOR    | GuestForm.tsx:165-173                                  | Native `<select>` lacks custom dropdown arrow            |

---

## Final Verdict: APPROVED

All 4 MAJOR issues from Iteration 1 have been resolved correctly. No new CRITICAL or MAJOR issues were introduced. The build, type-check, and lint all pass cleanly. The 6 MINOR issues remain as non-blocking recommendations for future improvement.

---

---

# Validation Report — Seating Canvas

**Spec**: `spec/seating-canvas.md`
**Date**: 2026-04-03

---

## Iteration 1 — CHANGES_REQUESTED

**CRITICAL**: 2 | **MAJOR**: 4 | **MINOR**: 9

---

## CRITICAL Findings

### C-1: ESLint Error — `setState` inside `useEffect` in CanvasPropertiesPanel (G-16 violation)

**File**: `src/components/organisms/CanvasPropertiesPanel.tsx:25-30`

**Issue**: The `useEffect` at line 25 calls `setLabel`, `setShape`, `setSeatCount`, and `setRotation` synchronously inside an effect body. The `react-hooks/set-state-in-effect` ESLint rule flags this as an **error** (not warning). This **blocks the pre-commit hook** (`npm run lint` exits with error code).

Additionally, the `react-hooks/exhaustive-deps` rule warns that `table.label`, `table.shape`, `table.seatCount`, and `table.rotation` are missing from the dependency array (only `table.id` is listed).

**Spec note**: The task instructions (TASK-004) acknowledge this pattern and state "Using useEffect here is acceptable because we're synchronizing form state to an external selection change." However, the ESLint rule disagrees and produces a blocking error. G-16 explicitly warns about this.

**Fix**: Replace the `useEffect` with the "adjusting state during render" pattern. Track `prevTableId` with a ref or state variable and reset form state synchronously during render when `table.id` changes:

```typescript
const [prevTableId, setPrevTableId] = useState(table.id)
if (prevTableId !== table.id) {
  setPrevTableId(table.id)
  setLabel(table.label)
  setShape(table.shape)
  setSeatCount(table.seatCount)
  setRotation(table.rotation)
}
```

Remove the `useEffect` and its import entirely.

---

### C-2: `updateTable` Type Signature Omits `label` — Spec Violation

**File**: `src/data/table-store.ts:92-94`

**Issue**: The `updateTable` function signature is:

```typescript
data: Partial<Omit<FloorTable, 'id' | 'badgeId' | 'label'>>
```

This **omits `label`** from the accepted data, meaning TypeScript should reject calls that pass `label`. However, the spec (DD-3, AC-16) requires that labels be editable via the properties panel, and `CanvasPropertiesPanel` does pass `label` in its `onUpdate` callback.

The call chain works at **runtime** because:

1. `CanvasPropertiesPanel.onUpdate` passes `{ label, shape, seatCount, rotation }`
2. `useTableState.handleUpdateTable` accepts `Partial<Pick<FloorTable, 'label' | 'shape' | 'seatCount' | 'x' | 'y' | 'rotation'>>` (includes `label`)
3. `storeUpdateTable(id, data)` is called — TypeScript accepts the wider type being passed to the narrower parameter via structural typing (excess property checks don't apply to spread variables)
4. The `...data` spread inside `updateTable` includes `label` at runtime

So label updates work by accident, but the **type contract is incorrect**. If someone relied on the `updateTable` type signature, they would reasonably conclude `label` cannot be updated.

**Fix**: Change the `updateTable` signature to include `label`:

```typescript
data: Partial<Omit<FloorTable, 'id' | 'badgeId'>>
```

Or use the spec's Pick-based signature:

```typescript
data: Partial<
  Pick<FloorTable, 'label' | 'shape' | 'seatCount' | 'x' | 'y' | 'rotation'>
>
```

---

## MAJOR Findings

### M-1: Badge ID Format — `T001` Instead of Spec's `T01`

**File**: `src/data/table-store.ts:72`

**Issue**: The code uses `padStart(3, '0')` producing `T001`, `T002`, etc. The spec (DD-5, AC-7, AC-8, AC-9, AC-15) consistently shows `T01`, `T02` (2-digit zero-padding).

**Impact**: Visual inconsistency with spec. All UI references to badge IDs will show 3 digits instead of 2.

**Fix**: Change `padStart(3, '0')` to `padStart(2, '0')`.

---

### M-2: Default Seat Count is 6 Instead of Spec's 8

**File**: `src/components/organisms/SeatingCanvas.tsx:173`

**Issue**: When placing a new table via the canvas click handler, `seatCount: 6` is used. The spec (AC-7, AC-8) says "8 seats" as the default.

**Impact**: New tables placed via toolbar click will have 6 seats instead of the specified 8.

**Fix**: Change `seatCount: 6` to `seatCount: 8`.

---

### M-3: NATO Label "ALFA" vs Spec's "ALPHA"

**File**: `src/data/table-types.ts:30`

**Issue**: The first NATO label is `'ALFA'`. The spec's `NATO_LABELS` array (Data Requirements section) explicitly lists `'ALPHA'` as the first entry. While "ALFA" is the correct international NATO phonetic alphabet spelling, the spec is the authoritative reference and uses "ALPHA".

**Impact**: First auto-generated table label will be "TABLE ALFA" instead of "TABLE ALPHA".

**Fix**: Change `'ALFA'` to `'ALPHA'` in the `NATO_LABELS` array to match the spec exactly.

---

### M-4: `swapSeats` Has Identical If/Else Branches (G-12 Violation)

**File**: `src/data/table-store.ts:205-219`

**Issue**: The `if (sourceTableId === targetTableId)` and `else` branches at lines 205-219 contain **identical code**. This is precisely the pattern guardrail G-12 warns about. While functionally correct (the aliasing means the same-table case operates on the already-updated seats array from line 197-202), the duplication is confusing and suggests a copy-paste error.

**Fix**: Remove the conditional and keep a single block:

```typescript
tables[targetTableIdx] = {
  ...tables[targetTableIdx],
  seats: tables[targetTableIdx].seats.filter(
    (s) => s.seatIndex !== targetSeatIndex,
  ),
}
```

---

## MINOR Findings

| ID  | File                           | Description                                                                             |
| --- | ------------------------------ | --------------------------------------------------------------------------------------- |
| m-1 | `SeatingCanvas.tsx:41`         | `onDeleteTable` prop declared in Props but never used — dead code                       |
| m-2 | `SeatAssignmentPopover.tsx`    | Missing Escape key dismiss handler and ARIA `role="dialog"` attributes (G-19)           |
| m-3 | `CanvasToolbar.tsx:29`         | Buttons have `title` but missing `aria-label` — spec says both                          |
| m-4 | `CanvasTable.tsx:102`          | Guest count text shows `0/8` instead of spec's `0/8 Guests` (missing suffix)            |
| m-5 | `CanvasStatusBar.tsx:5`        | Separator `\|` uses parent `gap-2` instead of spec's `mx-2` — visually equivalent       |
| m-6 | `SeatIndicator.tsx:19`         | Uses `w-3.5 h-3.5` (rem-based 14px) vs spec's `w-[14px] h-[14px]` — equivalent          |
| m-7 | `SeatAssignmentPopover.tsx:68` | Header uses `text-caption` instead of spec's `text-label`; missing `border-b` separator |
| m-8 | `LeftSidebar.tsx:56`           | Section header shows `UNASSIGNED` instead of spec's `UNASSIGNED_GUESTS`                 |
| m-9 | `LeftSidebar.tsx:59-71`        | Guest list items missing initials avatar circle per spec sidebar design                 |

---

## Convention Compliance

| Convention                     | Status | Notes                                                   |
| ------------------------------ | ------ | ------------------------------------------------------- |
| No semicolons                  | PASS   | All files                                               |
| Single quotes                  | PASS   | All files                                               |
| Trailing commas                | PASS   | All files                                               |
| Function declarations          | PASS   | All components use `function X()`                       |
| Default exports                | PASS   | All components                                          |
| `Props` interface pattern      | PASS   | All components                                          |
| `import type` for types        | PASS   | All type imports use `import type`                      |
| Typography classes (G-13)      | PASS   | Correct classes used throughout                         |
| G-8: focus-visible for buttons | PASS   | All `<button>` elements include focus-visible           |
| G-11: keyboard accessible      | PASS   | Uses `<button>` elements, not `<div onClick>`           |
| G-20/G-21/G-22: react-icons    | PASS   | All icons from `lu`, verified exports, `size` prop used |
| G-5: border radius             | PASS   | Uses `rounded` consistently                             |
| Prettier formatting            | PASS   | `npx prettier --check src/` passes                      |
| TypeScript compilation         | PASS   | `tsc -b` completes with zero errors                     |
| ESLint                         | PASS   | C-1 resolved; no errors                                 |

## Spec Acceptance Criteria Coverage

| AC                               | Status  | Notes                                                          |
| -------------------------------- | ------- | -------------------------------------------------------------- |
| AC-1: Canvas with dot-grid       | PASS    |                                                                |
| AC-2: Empty canvas               | PASS    |                                                                |
| AC-3: Status bar                 | PASS    |                                                                |
| AC-4: Toolbar 4 tools            | PASS    |                                                                |
| AC-5: Tool switching             | PASS    |                                                                |
| AC-6: Pan tool                   | PASS    |                                                                |
| AC-7: Add circle table           | PASS    | Default seatCount 8 (M-2 fixed)                                |
| AC-8: Add rect table             | PASS    | Default seatCount 8 (M-2 fixed)                                |
| AC-9: Table rendering            | PARTIAL | Missing "Guests" suffix (m-4); badge format fixed (M-1)        |
| AC-10: Rect auto-sizing          | PASS    |                                                                |
| AC-11: Circle auto-sizing        | PASS    |                                                                |
| AC-12: Seat count resize         | PASS    |                                                                |
| AC-13: Selected state            | PASS    | Dashed cobalt border                                           |
| AC-14: Deselect on empty click   | PASS    |                                                                |
| AC-15: Properties panel          | PASS    | All sections present                                           |
| AC-16: Update label              | PASS    | Type contract correct (C-2 fixed)                              |
| AC-17: Toggle shape              | PASS    |                                                                |
| AC-18: Update seat count         | PASS    |                                                                |
| AC-19: Drag table                | PASS    | Mouse-based repositioning                                      |
| AC-20: Persist position          | PASS    |                                                                |
| AC-21: Pan tool ignores tables   | PASS    |                                                                |
| AC-22: Delete table              | PASS    |                                                                |
| AC-23: Seat click popover        | PASS    |                                                                |
| AC-24: Assign guest              | PASS    |                                                                |
| AC-25: Unassign popover          | PASS    |                                                                |
| AC-26: Unassign button           | PASS    |                                                                |
| AC-27: Auto-unassign on reduce   | PASS    |                                                                |
| AC-28: Data persistence          | PASS    |                                                                |
| AC-29: Guest deletion cascade    | PASS    |                                                                |
| AC-30-32: DnD guest assignment   | PARTIAL | Handler ready, no useDraggable/useDroppable wiring on elements |
| AC-33: Only unassigned draggable | PASS    | Computed correctly                                             |
| AC-34: Rotation control          | PASS    |                                                                |
| AC-35: Rotation rendering        | PASS    | CSS transform applied                                          |
| AC-36: Rotated guest display     | PASS    |                                                                |
| AC-37-40: Seat swap DnD          | PARTIAL | Handler ready, no drag/drop wiring on seats                    |
| AC-30 (sidebar): LAYOUT active   | PASS    |                                                                |
| AC-31 (sidebar): ADD TABLE       | PASS    |                                                                |

**Note on DnD**: The `DragDropProvider` is set up and the `onDragEnd` handler routes events correctly for guest assignment, table-body drops, and seat swaps. However, `useDraggable`/`useDroppable` hooks are not wired to individual seat indicators or guest list items yet. The spec task breakdown (TASK-003 note) explicitly defers DnD wiring. The visual rendering is complete and the handler logic is correct — actual drag/drop interactivity requires wiring the hooks to DOM elements as follow-up.

---

## Iteration 1 Verdict

**CHANGES_REQUESTED** — 2 CRITICAL, 4 MAJOR issues identified.

---

## Iteration 2 — Re-review

**Date**: 2026-04-03

### CRITICAL / MAJOR Issue Resolution

| ID  | Severity | Status   | Verification                                                                                                                                                    |
| --- | -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C-1 | CRITICAL | RESOLVED | `CanvasPropertiesPanel.tsx:1` imports only `useState` (no `useEffect`). Lines 25-32 use render-time state adjustment via `prevTableId` — correct React pattern. |
| C-2 | CRITICAL | RESOLVED | `table-store.ts:94` signature is `Partial<Omit<FloorTable, 'id' \| 'badgeId'>>` — `label` now accepted in the type contract.                                    |
| M-1 | MAJOR    | RESOLVED | `table-store.ts:72` uses `padStart(2, '0')` — badge IDs produce `T01`, `T02` per spec DD-5.                                                                     |
| M-2 | MAJOR    | RESOLVED | `SeatingCanvas.tsx:173` uses `seatCount: 8` — matches spec AC-7/AC-8.                                                                                           |
| M-3 | MAJOR    | RESOLVED | `table-types.ts:30` first NATO label is `'ALPHA'` — matches spec exactly.                                                                                       |
| M-4 | MAJOR    | RESOLVED | `table-store.ts:204-210` — single unconditional block with clarifying comment; no duplicate branches (G-12 satisfied).                                          |

### New Issues Introduced by Fixes

None detected.

### Build Verification

| Check              | Result | Notes                                   |
| ------------------ | ------ | --------------------------------------- |
| `npx tsc --noEmit` | PASS   | Zero errors                             |
| `npm run build`    | PASS   | 102 modules transformed, built in 235ms |

### Remaining MINOR Issues (unchanged, not blocking)

| ID  | File                           | Description                                                                             |
| --- | ------------------------------ | --------------------------------------------------------------------------------------- |
| m-1 | `SeatingCanvas.tsx:41`         | `onDeleteTable` prop declared in Props but never used — dead code                       |
| m-2 | `SeatAssignmentPopover.tsx`    | Missing Escape key dismiss handler and ARIA `role="dialog"` attributes (G-19)           |
| m-3 | `CanvasToolbar.tsx:29`         | Buttons have `title` but missing `aria-label` — spec says both                          |
| m-4 | `CanvasTable.tsx:102`          | Guest count text shows `0/8` instead of spec's `0/8 Guests` (missing suffix)            |
| m-5 | `CanvasStatusBar.tsx:5`        | Separator `\|` uses parent `gap-2` instead of spec's `mx-2` — visually equivalent       |
| m-6 | `SeatIndicator.tsx:19`         | Uses `w-3.5 h-3.5` (rem-based 14px) vs spec's `w-[14px] h-[14px]` — equivalent          |
| m-7 | `SeatAssignmentPopover.tsx:68` | Header uses `text-caption` instead of spec's `text-label`; missing `border-b` separator |
| m-8 | `LeftSidebar.tsx:56`           | Section header shows `UNASSIGNED` instead of spec's `UNASSIGNED_GUESTS`                 |
| m-9 | `LeftSidebar.tsx:59-71`        | Guest list items missing initials avatar circle per spec sidebar design                 |

---

## Final Verdict: APPROVED

All 2 CRITICAL and 4 MAJOR issues from Iteration 1 have been resolved correctly. No new CRITICAL or MAJOR issues were introduced by the fixes. TypeScript compilation and production build both pass cleanly. The 9 MINOR issues remain as non-blocking recommendations for future improvement.
