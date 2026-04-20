# Task Report — TASK-006: Create ExpensesView Page Component

## Status: COMPLETE

## Files Created

- `src/pages/ExpensesView.tsx`

## Changes

### `src/pages/ExpensesView.tsx` (new file — 340 lines)

Created the full Expenses page component with the following features:

**Imports**: React hooks (`useState`, `useCallback`), `useNavigate` from react-router, `useForm` from react-hook-form, icons (`LuPlus`, `LuPencil`, `LuTrash2`), expense store functions, guest/table stores, types, and UI components (`LeftSidebar`, `StatCard`, `ConfirmDialog`, `IconButton`, `FormField`).

**State management**:

- `expenses` — lazy-initialized from `getExpenses()` via `useState(() => ...)`
- `editingId` — tracks which expense row is in edit mode
- `deleteTarget` — tracks which expense is pending delete confirmation
- `prevEditingId` — used for "adjusting state during render" pattern to reset edit form

**Derived values** (not state):

- `totalExpenses` — sum via `reduce`
- `expenseCount` — `expenses.length`

**Two separate react-hook-form instances**:

- `addForm` — for the inline add expense form with `defaultValues`
- `editForm` — for the inline edit form, reset via adjusting-state-during-render pattern

**Validation**: Both forms validate description (required) and amount (required + `parseFloat(v) > 0`).

**Delete flow**: Click delete icon -> sets `deleteTarget` -> renders `ConfirmDialog` -> confirm calls `deleteExpense` and refreshes list -> cancel clears target.

**Currency formatting**: Two formatters using `Intl.NumberFormat('de-DE')`:

- `formatTotal` — max 0 fraction digits (for stat card)
- `formatAmount` — max 2 fraction digits (for list items)

**JSX structure**:

- `LeftSidebar` rendered as sibling with navigation callbacks (matches SettingsView pattern)
- `<main>` with `pb-16 md:pb-0` for mobile bottom tab bar padding
- Stat card showing total and entry count
- Add expense form section with FormField components
- Expense log section with empty state or list of expenses
- Each expense row: display mode (description, formatted amount, edit/delete icon buttons) or edit mode (inline form)
- Delete confirmation dialog conditionally rendered

## Patterns Followed

- **SettingsView** — page + sidebar layout, `useCallback` for navigation handlers
- **GuestForm** — react-hook-form registration, validation, error display, `noValidate`
- **GuestListFooterStats** — currency formatting with `Intl.NumberFormat('de-DE')`
- **StatCard** — `label` + `value` + children pattern
- **ConfirmDialog** — all props including `confirmLabel`/`cancelLabel`
- **IconButton** — `label` + `onClick` + children pattern
- **FormField** — `label`, `htmlFor`, `required`, `error` props with `aria-invalid`/`aria-describedby`

## Conventions

- Function declaration for component and all handlers
- Default export
- `useState(() => fn())` lazy init for localStorage reads
- No `setState` in `useEffect` — used "adjusting state during render" pattern
- Dark mode design system classes: `text-heading-4`, `text-body-sm`, `text-caption`, `text-label`, `.input`, `.btn-primary`, `.btn-secondary`, `.card`, `border-b border-border`

## Validation

- `npx tsc --noEmit` — zero type errors
- All acceptance criteria met (see below)

## Acceptance Criteria Verification

| Criteria                                                                                                         | Status |
| ---------------------------------------------------------------------------------------------------------------- | ------ |
| Page renders with h1 "EXPENSES", stat card, add form, expense log section                                        | PASS   |
| Add form validates required description and positive amount, creates expense, resets form, updates list and stat | PASS   |
| Edit mode replaces row with form, pre-populated, validates, saves, cancels                                       | PASS   |
| Delete shows ConfirmDialog, removes expense on confirm, cancels on cancel                                        | PASS   |
| Empty state displayed when no expenses                                                                           | PASS   |
| Stat card shows formatted total and count (or NO_ENTRIES)                                                        | PASS   |
| Currency formatted with `Intl.NumberFormat('de-DE')`                                                             | PASS   |
| LeftSidebar rendered as sibling with correct props                                                               | PASS   |
| Responsive: `pb-16 md:pb-0` for bottom tab bar padding on mobile                                                 | PASS   |
