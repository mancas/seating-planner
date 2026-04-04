# Validation Report — Import Guests Feature

## Metadata

- **Spec**: `spec/import-guests.md`
- **Iteration**: 2 of 2
- **Date**: 2026-04-04
- **Validator**: Validator Agent

## Files Reviewed

| File                                            | Lines | Status            |
| ----------------------------------------------- | ----- | ----------------- |
| `src/utils/csv-import.ts`                       | 240   | NEW               |
| `src/components/molecules/FileDropZone.tsx`     | 132   | MODIFIED (iter 2) |
| `src/components/organisms/ImportGuestsPage.tsx` | 269   | MODIFIED (iter 2) |
| `src/pages/ImportGuestsView.tsx`                | 42    | NEW               |
| `src/main.tsx`                                  | 34    | MODIFIED          |
| `src/components/organisms/LeftSidebar.tsx`      | 124   | MODIFIED (iter 2) |
| `src/components/organisms/EmptyState.tsx`       | 40    | MODIFIED (iter 2) |
| `src/pages/GuestListView.tsx`                   | 170   | MODIFIED (iter 2) |

## Automated Checks

| Check             | Result             |
| ----------------- | ------------------ |
| `tsc -b --noEmit` | PASS (zero errors) |

---

## Iteration 1 Fix Verification

### M-1: Unhandled Promise Rejection — FIXED

- **File**: `src/components/organisms/ImportGuestsPage.tsx:111-118`
- **Verification**: `file.text().then(...)` now has a `.catch(() => { ... })` handler that sets `phase: 'error'` with `fileError: 'READ_ERROR // FAILED TO READ FILE CONTENTS'`. This surfaces a user-visible error message on read failure and prevents unhandled promise rejection.
- **Status**: **RESOLVED**

### M-2: FileDropZone Keyboard Accessibility — FIXED

- **File**: `src/components/molecules/FileDropZone.tsx:55-82`
- **Verification**:
  1. `role="button"` — present (line 67)
  2. `tabIndex={0}` — present (line 68)
  3. `onKeyDown={handleKeyDown}` — present (line 73), handler at lines 55-63 handles Enter and Space keys with `e.preventDefault()`
  4. `focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2` — present in className (line 74)
- **Status**: **RESOLVED**

---

## Iteration 2: New Changes Review

### LeftSidebar.tsx — Import Link Addition

| Check                             | Status | Notes                                                                                                         |
| --------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------- |
| `onImportGuests` prop is optional | PASS   | `onImportGuests?: () => void` at line 12                                                                      |
| Conditional rendering             | PASS   | `{onImportGuests && (...)}` at line 108 — safe guard                                                          |
| Button placement                  | PASS   | Below ADD GUEST, only in non-canvas view (`else` branch at line 99)                                           |
| Button styling                    | PASS   | `btn-secondary w-full flex items-center justify-center gap-2 mt-2` — consistent with ADD GUEST button pattern |
| Icon convention                   | PASS   | `LuUpload` from `react-icons/lu`, `size={16}` matches other sidebar icons                                     |
| Label convention                  | PASS   | `IMPORT_CSV` — uppercase with underscore, consistent cyberpunk naming                                         |
| No `type="button"` attribute      | NOTE   | Existing sidebar buttons also omit this — follows file convention                                             |
| Import statement                  | PASS   | `LuUpload` added to existing icon import at line 1                                                            |

### EmptyState.tsx — Import Link Addition

| Check                             | Status | Notes                                                                                       |
| --------------------------------- | ------ | ------------------------------------------------------------------------------------------- |
| `onImportGuests` prop is optional | PASS   | `onImportGuests?: () => void` at line 5                                                     |
| Conditional rendering             | PASS   | `{onImportGuests && (...)}` at line 26                                                      |
| Button placement                  | PASS   | Adjacent to NEW_ENTRY inside `flex items-center gap-3` wrapper (line 18)                    |
| Button styling                    | PASS   | `btn-secondary flex items-center gap-2` — secondary action paired with primary NEW_ENTRY    |
| Icon convention                   | PASS   | `LuUpload` from `react-icons/lu`, `size={14}` matches `LuPlus size={14}` on adjacent button |
| Label convention                  | PASS   | `IMPORT_CSV` — consistent cyberpunk naming                                                  |
| Import statement                  | PASS   | `LuUpload` added to existing icon import at line 1                                          |

### GuestListView.tsx — Wiring

| Check                             | Status | Notes                                                                                           |
| --------------------------------- | ------ | ----------------------------------------------------------------------------------------------- |
| `handleNavigateToImport` callback | PASS   | `useCallback(() => navigate('/guests/import'), [navigate])` at lines 80-82                      |
| Consistent with existing patterns | PASS   | Identical pattern to `handleNavigateToAdd` (line 76-78) and `handleNavigateToEdit` (line 84-88) |
| Wired to LeftSidebar              | PASS   | `onImportGuests={handleNavigateToImport}` at line 115                                           |
| Wired to EmptyState               | PASS   | `onImportGuests={handleNavigateToImport}` at line 134                                           |
| Route target exists               | PASS   | `/guests/import` route configured in `main.tsx`                                                 |

---

## Iteration 2: New Findings

### CRITICAL (0)

None.

### MAJOR (0)

None.

### MINOR (5)

#### m-1 (carried from iter 1): `selectedFileName` uses `undefined` instead of `null`

- **File**: `src/components/organisms/ImportGuestsPage.tsx:30-32`
- **Description**: `useState<string | undefined>(undefined)` is used, but the project convention is `null` for "no value" (see `selectedGuestId: string | null` in `GuestListView.tsx:30`).
- **Recommendation**: Change to `useState<string | null>(null)` for consistency.

#### m-2 (carried from iter 1): Error list keys could collide

- **File**: `src/components/organisms/ImportGuestsPage.tsx:210-235`
- **Description**: File-level errors use `key={`file-${i}`}` and row-level errors use `key={i}`. A single `.map()` would be cleaner.

#### m-3 (carried from iter 1): VALIDATION_FAILED heading uses `text-body-sm` instead of `text-heading-5`

- **File**: `src/components/organisms/ImportGuestsPage.tsx:203`
- **Description**: Minor visual deviation from spec suggestion.

#### m-4 (carried from iter 1): `getTables()` called on every render without memoization

- **File**: `src/pages/ImportGuestsView.tsx:13`
- **Description**: Per G-39, store functions reading localStorage should use `useState(() => fn())`.

#### m-5 (new): FileDropZone `role="button"` missing `aria-label`

- **File**: `src/components/molecules/FileDropZone.tsx:67`
- **Description**: The outer `<div>` now correctly has `role="button"` and `tabIndex={0}`, but lacks an `aria-label`. The project uses `aria-label` on other interactive elements (FAB, IconButton, SeatIndicator, SeatingPlanView buttons). Without an `aria-label`, screen readers will announce the div's text content, which includes "DROP CSV FILE HERE or click to select SELECT_FILE" — functional but not ideal.
- **Recommendation**: Add `aria-label="Upload CSV file"` for a cleaner screen reader announcement.

---

## Verdict

### **APPROVED**

Both MAJOR issues from iteration 1 have been properly resolved:

- **M-1** (unhandled promise rejection): `.catch()` handler added with user-visible error feedback.
- **M-2** (keyboard accessibility): `tabIndex={0}`, `role="button"`, `onKeyDown`, and `focus-visible` outline all added.

The new sidebar and empty state import links follow existing project conventions for optional props, conditional rendering, button styling, icon usage, and navigation patterns. No new CRITICAL or MAJOR issues introduced.

5 MINOR findings remain as recommended (non-blocking) improvements.

---

## Summary of All Issues

### Resolved

| ID  | File                                            | Issue                          | Resolution                                           |
| --- | ----------------------------------------------- | ------------------------------ | ---------------------------------------------------- |
| M-1 | `src/components/organisms/ImportGuestsPage.tsx` | Unhandled promise rejection    | `.catch()` added at lines 111-118                    |
| M-2 | `src/components/molecules/FileDropZone.tsx`     | Missing keyboard accessibility | `role`, `tabIndex`, `onKeyDown`, focus outline added |

### Open (non-blocking)

| ID  | File                                            | Action                                                                                |
| --- | ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| m-1 | `src/components/organisms/ImportGuestsPage.tsx` | Change `useState<string \| undefined>(undefined)` to `useState<string \| null>(null)` |
| m-2 | `src/components/organisms/ImportGuestsPage.tsx` | Consider unifying error list rendering into a single `.map()`                         |
| m-3 | `src/components/organisms/ImportGuestsPage.tsx` | Consider `text-heading-5` for VALIDATION_FAILED title                                 |
| m-4 | `src/pages/ImportGuestsView.tsx`                | Wrap `getTables()` in `useState(() => ...)` per G-39                                  |
| m-5 | `src/components/molecules/FileDropZone.tsx`     | Add `aria-label="Upload CSV file"` to `role="button"` div                             |
