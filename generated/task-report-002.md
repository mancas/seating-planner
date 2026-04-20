# Task Report: TASK-002 — Create Expense Store Module

## Status: COMPLETED

## Summary

Created `src/data/expense-store.ts` with all 7 required CRUD and aggregate functions, following the exact pattern from `src/data/guest-store.ts`.

## Files Created

- `src/data/expense-store.ts`

## Implementation Details

### Storage Setup

- Storage key: `seating-plan:expenses`
- Uses `createStorage<Expense[]>('seating-plan:expenses', [])` pattern from `storage-utils.ts`

### Exported Functions

| Function           | Signature                                                                               | Notes                                                                       |
| ------------------ | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `getExpenses`      | `(): Expense[]`                                                                         | Returns `storage.read().slice().reverse()` — newest first                   |
| `getExpenseById`   | `(id: string): Expense \| undefined`                                                    | Finds by id                                                                 |
| `addExpense`       | `(data: Omit<Expense, 'id' \| 'createdAt'>): Expense`                                   | Generates UUID via `uuidv4()`, ISO timestamp via `new Date().toISOString()` |
| `updateExpense`    | `(id: string, data: Partial<Omit<Expense, 'id' \| 'createdAt'>>): Expense \| undefined` | Merges with spread, returns undefined if not found                          |
| `deleteExpense`    | `(id: string): boolean`                                                                 | Filters out by id, returns true if removed                                  |
| `getTotalExpenses` | `(): number`                                                                            | Reduces all amounts to sum                                                  |
| `getExpenseCount`  | `(): number`                                                                            | Returns array length                                                        |

### Conventions Followed

- `import type` for the `Expense` interface
- Function declarations (not arrow functions)
- camelCase function names, kebab-case file name
- Pattern matches `guest-store.ts` exactly (variable naming, control flow, return patterns)

## Acceptance Criteria Verification

- [x] All 7 functions are exported
- [x] `addExpense` generates UUID and ISO timestamp
- [x] `getExpenses` returns newest first (`.slice().reverse()`)
- [x] Storage key is `seating-plan:expenses`
- [x] TypeScript compiles with no errors

## Dependencies

- TASK-001 (expense-types.ts) — confirmed present and used
