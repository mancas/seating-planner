# Task Report: TASK-003 — Update Project Export/Import to Include Expenses

## Status: COMPLETE

## Summary

Extended `src/utils/project-export.ts` to handle expenses data across all export/import/delete operations, with backward compatibility for v1 files that lack an `expenses` field.

## Changes Made

### `src/utils/project-export.ts`

1. **Added type-only import** for `Expense` from `../data/expense-types` (line 1)

2. **Updated `ProjectExport` interface** — added optional `expenses?: Expense[]` to the `data` property (line 12)

3. **Updated `generateProjectExport()`**:
   - Reads `localStorage.getItem('seating-plan:expenses')` into `expensesRaw` (line 20)
   - Parses to `Expense[]` with `[]` default (line 25)
   - Includes `expenses` in the exported `data` object (line 34)

4. **Updated `validateProjectImport()`**:
   - Added validation: if `data.expenses` exists and is not an array, returns `null` (line 62)
   - If `data.expenses` is `undefined`, validation passes (backward compatibility)

5. **Updated `applyProjectImport()`**:
   - Sets `localStorage.setItem('seating-plan:expenses', JSON.stringify(data.data.expenses ?? []))` (lines 74–77)
   - Uses `?? []` so imports without an expenses field clear to empty array

6. **Updated `deleteProject()`**:
   - Added `localStorage.removeItem('seating-plan:expenses')` (line 99)

## Acceptance Criteria Verification

| Criterion                                                                 | Status |
| ------------------------------------------------------------------------- | ------ |
| Export includes `data.expenses`                                           | Pass   |
| Import with expenses field restores data                                  | Pass   |
| Import without expenses field clears to `[]`                              | Pass   |
| Delete removes `seating-plan:expenses` key                                | Pass   |
| Validation rejects files where `data.expenses` exists but is not an array | Pass   |
| Version stays at 1                                                        | Pass   |

## Type Check

- `npx tsc --noEmit` passes with zero errors.
