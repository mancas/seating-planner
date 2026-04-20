# Codebase Context Updates: Wedding Expenses

> **Spec**: `spec/wedding-expenses.md`
> **Date**: 2026-04-12

## New Storage Key

| Key                     | Type        | Description         |
| ----------------------- | ----------- | ------------------- |
| `seating-plan:expenses` | `Expense[]` | All expense records |

## New Files

| File                         | Purpose                                      |
| ---------------------------- | -------------------------------------------- |
| `src/data/expense-types.ts`  | `Expense` and `ExpenseFormValues` interfaces |
| `src/data/expense-store.ts`  | CRUD functions for expenses (localStorage)   |
| `src/pages/ExpensesView.tsx` | Expenses page with stat card, CRUD forms     |

## Modified Files

| File                                        | Change                                                   |
| ------------------------------------------- | -------------------------------------------------------- |
| `src/utils/project-export.ts`               | Added expenses to export/import/delete                   |
| `src/components/organisms/LeftSidebar.tsx`  | Added "Expenses" nav item; fixed guest list active state |
| `src/components/organisms/BottomTabBar.tsx` | Added "EXPENSES" tab; fixed GUESTS active state          |
| `src/main.tsx`                              | Added `/expenses` route                                  |

## New Routes

| Path        | Component      | Description   |
| ----------- | -------------- | ------------- |
| `/expenses` | `ExpensesView` | Expenses page |

## New Guardrails

- **G-53**: Prefer derived state over redundant store functions when the component already holds entity data in local state.
- **G-54**: Non-null assertions in guarded handler contexts — prefer early-return guards over `!` for defensive coding.

## ProjectExport Interface Update

The `ProjectExport.data` interface now includes `expenses?: Expense[]` (optional for backward compatibility with v1 export files).
