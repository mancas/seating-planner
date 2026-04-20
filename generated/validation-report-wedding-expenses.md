# Validation Report: Wedding Expenses

> **Spec**: `spec/wedding-expenses.md`
> **Iteration**: 1 of 2
> **Date**: 2026-04-12
> **Verdict**: **CHANGES_REQUESTED**

---

## Step 1: Completeness Check — Acceptance Criteria

| AC  | Description                                         | Status | Notes                                                                                      |
| --- | --------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| 1   | `/expenses` page with stat card, list, add form     | PASS   | `ExpensesView.tsx` renders all three sections                                              |
| 2   | LeftSidebar rendered with "Expenses" active         | PASS   | `LeftSidebar` rendered as sibling, `isExpensesView` active logic correct                   |
| 3   | Desktop sidebar: "Expenses" between Canvas/Settings | PASS   | `LeftSidebar.tsx:78-82` — positioned correctly                                             |
| 4   | Sidebar "Expenses" active style                     | PASS   | `isActive={isExpensesView}` at `LeftSidebar.tsx:80`                                        |
| 5   | Sidebar click navigates to `/expenses`              | PASS   | `onClick={() => navigate('/expenses')}` at `LeftSidebar.tsx:81`                            |
| 6   | "Listado de invitados" NOT active on `/expenses`    | PASS   | `!isExpensesView` added at `LeftSidebar.tsx:69`                                            |
| 7   | Mobile BottomTabBar: "EXPENSES" tab visible         | PASS   | `BottomTabBar.tsx:33-38` — fourth tab with `LuReceipt`                                     |
| 8   | Mobile "EXPENSES" tab navigates to `/expenses`      | PASS   | `onClick={() => navigate('/expenses')}` at `BottomTabBar.tsx:37`                           |
| 9   | Mobile "EXPENSES" tab active on `/expenses`         | PASS   | `isActive={isExpensesView}` at `BottomTabBar.tsx:36`; GUESTS exclusion at `:24`            |
| 10  | Fresh browser: empty list, total €0                 | PASS   | `useState(() => getExpenses())` returns `[]`; `formatTotal(0)` → `€0`                      |
| 11  | Persistence across reload                           | PASS   | `addExpense` writes to localStorage; `getExpenses` reads from it                           |
| 12  | Add expense: UUID, persist, top of list             | PASS   | `addExpense` generates UUID, appends to storage; `getExpenses()` reverses for newest-first |
| 13  | Validate empty description                          | PASS   | `register('description', { required: true })` at `ExpensesView.tsx:167`                    |
| 14  | Validate empty/zero amount                          | PASS   | `required: true` + `validate: (v) => parseFloat(v) > 0` at `ExpensesView.tsx:193-195`      |
| 15  | Validate negative amount                            | PASS   | `parseFloat(v) > 0` rejects negatives                                                      |
| 16  | Form reset + total update after add                 | PASS   | `addForm.reset()` at `:63`, `setExpenses(getExpenses())` at `:62`                          |
| 17  | Edit: pre-populated form                            | PASS   | "Adjusting state during render" resets editForm at `:71-82`                                |
| 18  | Save edit: update + recalculate total               | PASS   | `updateExpense` + `setExpenses(getExpenses())` at `:85-90`                                 |
| 19  | Cancel edit                                         | PASS   | `handleCancelEdit` sets `editingId` to `null` at `:97-99`                                  |
| 20  | Edit validation (same rules as add)                 | PASS   | Same `required` + `validate` on edit form inputs at `:251-253`, `:274-276`                 |
| 21  | Delete confirmation with ConfirmDialog              | PASS   | `ConfirmDialog` at `:326-334` with correct props                                           |
| 22  | Cancel delete                                       | PASS   | `handleDeleteCancel` clears `deleteTarget` at `:115-117`                                   |
| 23  | Confirm delete: remove + recalculate                | PASS   | `deleteExpense` + `setExpenses(getExpenses())` at `:107-108`                               |
| 24  | Stat card: TOTAL EXPENSES, formatted sum, count     | PASS   | `StatCard` at `:135-139` with `formatTotal` and `{count} ENTRIES`                          |
| 25  | Empty stat card: €0, NO_ENTRIES                     | PASS   | `expenseCount > 0 ? ... : 'NO_ENTRIES'` at `:137`                                          |
| 26  | Export includes expenses                            | PASS   | `project-export.ts:20,25,34` — reads and includes expenses                                 |
| 27  | Import with expenses restores data                  | PASS   | `project-export.ts:74-77` — writes `data.data.expenses ?? []`                              |
| 28  | Import without expenses clears to `[]`              | PASS   | `data.data.expenses ?? []` handles missing field at `:76`                                  |
| 29  | Delete project clears expenses                      | PASS   | `localStorage.removeItem('seating-plan:expenses')` at `:99`                                |
| 30  | Desktop: content right of sidebar, max-width        | PASS   | `max-w-xl mx-auto` at `:128`; `LeftSidebar` as sibling                                     |
| 31  | Mobile: full width, padding, BottomTabBar visible   | PASS   | `pb-16 md:pb-0` at `:127`; `px-4` mobile padding; BottomTabBar via App layout              |

**Result**: 31/31 acceptance criteria PASS

---

## Step 2: Convention Compliance

| Check                                     | Status | Notes                                                                           |
| ----------------------------------------- | ------ | ------------------------------------------------------------------------------- |
| Naming: files kebab-case                  | PASS   | `expense-types.ts`, `expense-store.ts` — correct                                |
| Naming: component PascalCase              | PASS   | `ExpensesView.tsx` — correct                                                    |
| Naming: functions camelCase               | PASS   | All functions use camelCase                                                     |
| Naming: types PascalCase                  | PASS   | `Expense`, `ExpenseFormValues`                                                  |
| Import style: relative imports            | PASS   | All imports use relative paths                                                  |
| Import style: type-only imports           | PASS   | `import type { Expense, ExpenseFormValues }` at `ExpensesView.tsx:13`           |
| Function declarations (G-45)              | PASS   | All handlers use `function` declarations                                        |
| Default export                            | PASS   | All components/pages use `export default`                                       |
| `useState(() => fn())` (G-39)             | PASS   | `useState<Expense[]>(() => getExpenses())` at `ExpensesView.tsx:33`             |
| No `setState` in `useEffect` (G-16)       | PASS   | Uses "adjusting state during render" pattern at `:70-82`                        |
| Icons from `react-icons/lu` (G-20)        | PASS   | `LuPlus`, `LuPencil`, `LuTrash2`, `LuReceipt` — all from `lu`                   |
| `aria-invalid` on validated inputs (G-15) | PASS   | Present on all 4 form inputs                                                    |
| Active state audit (G-50)                 | PASS   | `LeftSidebar`: `!isExpensesView` added; `BottomTabBar`: `!isExpensesView` added |
| Scope isolation (G-47)                    | PASS   | Only spec-listed files modified/created                                         |
| Consistent with SettingsView              | PASS   | Same pattern for sidebar props, page layout, `useCallback` wrapping             |

---

## Step 3: Best Practices Research

Confirmed via React docs and research:

1. **"Adjusting state during render" pattern** (`ExpensesView.tsx:70-82`): Correct per React docs. `prevEditingId` tracking with `setState` during render is the officially recommended alternative to `useEffect` + `setState`.

2. **react-hook-form**: `useForm` with `register`, `handleSubmit`, `reset`, and `formState.errors` — standard usage. Separate form instances for add vs edit is correct.

3. **TypeScript**: Interfaces with `Omit`/`Partial` for store functions match project conventions. `import type` enforced.

4. **localStorage**: Using existing `createStorage` abstraction with memory fallback — appropriate for this app's scale.

---

## Step 4: Framework Best Practices Validation

### Performance

| Check                                    | Status | Notes                                                                                                                                                   |
| ---------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No unnecessary re-renders                | PASS   | Derived values (`totalExpenses`, `expenseCount`) computed inline — no extra state                                                                       |
| `useCallback` for stable refs            | PASS   | `handleNavigateToAdd`, `handleSidebarAddTable` wrapped in `useCallback`                                                                                 |
| `getGuests()`/`getTables()` without memo | NOTE   | Called in render body without memoization — matches `SettingsView` pattern but violates G-39. **Pre-existing pattern**, not introduced by this feature. |
| Format functions at module scope         | PASS   | `formatTotal`, `formatAmount` are module-scope functions — no re-creation per render                                                                    |

### Security

| Check                             | Status | Notes                                                  |
| --------------------------------- | ------ | ------------------------------------------------------ |
| No XSS vectors                    | PASS   | All user input rendered via React JSX (auto-escaped)   |
| No `dangerouslySetInnerHTML`      | PASS   | Not used                                               |
| `JSON.parse` wrapped in try/catch | PASS   | Handled in `createStorage` and `validateProjectImport` |

### Error Handling

| Check                                 | Status | Notes                                                                                                                                      |
| ------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Form validation errors shown inline   | PASS   | `FormField` + `FormError` with `role="alert"`                                                                                              |
| Non-null assertion on `editingId!`    | MINOR  | `handleEditSubmit` uses `editingId!` — safe because the form only renders when `editingId !== null`, but could be defended more explicitly |
| Non-null assertion on `deleteTarget!` | MINOR  | `handleDeleteConfirm` uses `deleteTarget!` — safe because dialog only renders when `deleteTarget !== null`                                 |

---

## Step 5: Code Quality Assessment

### Readability

- **GOOD**: Clear component structure with named sections (stat card, add form, expense log)
- **GOOD**: Format functions extracted to module scope with descriptive names
- **GOOD**: Consistent naming and organization matching existing codebase patterns
- **GOOD**: "Adjusting state during render" block is clearly commented at `:69`

### Maintainability

- **GOOD**: Store module cleanly separates data persistence from UI
- **GOOD**: Type definitions in a separate file
- **GOOD**: Export/import integration follows existing patterns

### DRY

- **MINOR**: Add form and edit form share identical validation rules and error messages. The duplication is acceptable given they are separate `useForm` instances, and extracting shared validation would add indirection without significant benefit at this scale.

### Simplicity

- **GOOD**: Flat component structure — no unnecessary abstraction layers
- **GOOD**: Single-file page component matching project pattern

---

## Step 6: Findings Classification

### CRITICAL (0)

None.

### MAJOR (1)

**MAJOR-1: `handleNavigateToAdd` and `handleSidebarAddTable` use `useCallback` with arrow expressions instead of function declarations (G-45 violation)**

- **File**: `src/pages/ExpensesView.tsx:45-52`
- **Description**: The spec's instructions and codebase context (G-45) mandate function declarations for handlers inside React components. However, `handleNavigateToAdd` and `handleSidebarAddTable` use `const` + arrow expression pattern with `useCallback`. This is inconsistent with the function declaration convention.
- **However**: Looking at `SettingsView.tsx:27-33`, the **exact same pattern** is used there — `const handleNavigateToAdd = useCallback(() => ...)`. This is a pre-existing convention for `useCallback`-wrapped handlers. In the existing codebase, `useCallback` is always written as a `const` + arrow expression because `useCallback` is a hook that wraps a function — you cannot use a function declaration with `useCallback`. The G-45 rule applies to standard event handlers (like `handleAddSubmit`, `handleCancelEdit`), not to `useCallback`-wrapped callbacks.
- **Resolution**: On closer inspection, this is **NOT a violation**. The `useCallback` pattern inherently requires arrow expression syntax. All event handlers that don't need `useCallback` (lines 59, 84, 93, 97, 102, 106, 115) correctly use function declarations. **Downgraded to non-issue.**

**MAJOR-1 (REVISED): No remaining MAJOR issues.**

### MINOR (4)

**MINOR-1: Non-null assertions (`!`) on `editingId` and `deleteTarget` in handlers**

- **File**: `src/pages/ExpensesView.tsx:85` (`editingId!`) and `ExpensesView.tsx:107,109` (`deleteTarget!`)
- **Description**: Uses TypeScript non-null assertion operator. These are safe because the handlers are only callable when the values are non-null (enforced by UI rendering conditions), but early-return guards would be more defensive.
- **Recommendation**: Consider adding early-return guards: `if (!editingId) return` and `if (!deleteTarget) return` for robustness.

**MINOR-2: `aria-describedby` references IDs that don't match `FormError` output**

- **File**: `src/pages/ExpensesView.tsx:163-164` (add-description), `ExpensesView.tsx:189-190` (add-amount)
- **Description**: `aria-describedby` references `'add-description-error'` and `'add-amount-error'`, which are correctly generated by `FormField` → `FormError` (the `FormField` passes `errorId = htmlFor ? \`${htmlFor}-error\` : undefined`to`FormError`). The `FormError`renders with`id={id}`, so `id="add-description-error"`matches`aria-describedby="add-description-error"`. **Actually correct on inspection.** Non-issue.
- **Resolution**: Downgraded. The IDs match correctly through the `FormField` component chain.

**MINOR-2 (REVISED): Edit form inputs missing `aria-describedby`**

- **File**: `src/pages/ExpensesView.tsx:244-254` (edit description), `ExpensesView.tsx:267-278` (edit amount)
- **Description**: The add form inputs include `aria-describedby` linking to the error message, but the edit form inputs omit `aria-describedby`. While `FormField` + `FormError` still renders the error with an `id`, the input itself doesn't reference it. This is a minor accessibility gap.
- **Recommendation**: Add `aria-describedby` to edit form inputs, same pattern as add form.

**MINOR-3: `BottomTabBar` tab order differs from spec**

- **File**: `src/components/organisms/BottomTabBar.tsx:33-38`
- **Description**: The spec (AC-7) says "fourth tab, after CANVAS, GUESTS, and SETTINGS". The implementation places tabs in order: CANVAS, GUESTS, SETTINGS, EXPENSES — matching the spec. However, the spec's UI mockup (line 307) shows: `CANVAS  GUESTS  SETTINGS  EXPENSES`. The implementation matches. **Non-issue on inspection.**
- **Resolution**: Confirmed correct.

**MINOR-3 (REVISED): Unused store functions `getTotalExpenses` and `getExpenseCount`**

- **File**: `src/data/expense-store.ts:53-58`
- **Description**: The spec defines `getTotalExpenses()` and `getExpenseCount()` as part of the store API, and they are implemented. However, `ExpensesView.tsx` computes `totalExpenses` and `expenseCount` as derived values from the local `expenses` state (lines 38-39) rather than calling these store functions. The store functions have zero consumers.
- **Impact**: Dead code per G-37. However, since the spec explicitly defines these functions as part of the store API, removing them would violate the spec. The component correctly derives these values from state rather than making redundant localStorage reads.
- **Recommendation**: Keep for now — the spec defines them as part of the store contract, and they may be useful for future features. Document as intentional.

**MINOR-4: `type="number"` input may allow `e`, `+`, `-` characters in some browsers**

- **File**: `src/pages/ExpensesView.tsx:181-182` (add), `ExpensesView.tsx:268-269` (edit)
- **Description**: HTML `type="number"` inputs allow scientific notation characters (`e`, `E`, `+`, `-`) in most browsers. The validation function `parseFloat(v) > 0` will catch invalid values on submit, so this is only a UX concern — users may type `e` or `-` and see it accepted by the input before submit. The spec (Edge Case #12) acknowledges this: "react-hook-form validation catches invalid values on submission."
- **Recommendation**: No action needed — spec explicitly documents this behavior as acceptable.

---

## Step 7: Issue Verdict

| Severity | Count |
| -------- | ----- |
| CRITICAL | 0     |
| MAJOR    | 0     |
| MINOR    | 2     |

**Verdict: APPROVED**

All 31 acceptance criteria pass. TypeScript compiles without errors. ESLint produces no warnings. Prettier formatting is correct. No CRITICAL or MAJOR issues found. The implementation closely follows the spec instructions and matches existing codebase patterns.

### Remaining MINOR items (non-blocking):

1. **MINOR-1**: Non-null assertions on `editingId!` and `deleteTarget!` — consider adding early-return guards for defensive coding.
2. **MINOR-2**: Edit form inputs missing `aria-describedby` — minor accessibility gap.

---

## Step 8: Guardrails Review

### Existing guardrails checked:

| Guardrail | Status | Notes                                                       |
| --------- | ------ | ----------------------------------------------------------- |
| G-1       | N/A    | No CSS changes                                              |
| G-4       | PASS   | No light mode additions                                     |
| G-7       | PASS   | Uses existing `.btn-primary`, `.input`, `.card` classes     |
| G-8       | PASS   | No new focus styles added; uses existing components         |
| G-15      | PASS   | `aria-invalid` on all validated inputs                      |
| G-16      | PASS   | "Adjusting state during render" pattern for edit form       |
| G-20      | PASS   | All icons from `react-icons/lu`                             |
| G-21      | PASS   | `LuReceipt` verified to exist in `react-icons/lu`           |
| G-22      | PASS   | `size` prop used on all icons                               |
| G-24      | PASS   | Literal values match spec (labels, keys, formatters)        |
| G-35      | N/A    | No `key` prop reset needed (edit uses `prevEditingId`)      |
| G-39      | PASS   | `useState(() => getExpenses())` for lazy init               |
| G-40      | PASS   | No business logic in App.tsx                                |
| G-45      | PASS   | Function declarations for all handlers                      |
| G-47      | PASS   | Only spec-listed files modified                             |
| G-48      | PASS   | No `useRef.current` reads during render                     |
| G-49      | PASS   | `useCallback` for handlers passed to `LeftSidebar`          |
| G-50      | PASS   | All nav items' `isActive` logic audited and updated         |
| G-51      | PASS   | Navigation changes atomic across LeftSidebar + BottomTabBar |

### New guardrails identified:

**G-53: Prefer Derived State Over Redundant Store Functions**

**Rule**: When a component already holds entity data in local state (e.g., `expenses` array from `useState`), derive aggregate values (totals, counts) directly from that state rather than calling separate store functions that re-read localStorage. Store-level aggregate functions remain useful as a public API for other consumers but should not be the primary computation path in the owning component.

**Reason**: `ExpensesView` correctly derives `totalExpenses` and `expenseCount` from the local `expenses` state rather than calling `getTotalExpenses()` and `getExpenseCount()`, which would redundantly deserialize localStorage. This pattern avoids unnecessary I/O during render.

**G-54: Non-null Assertions in Guarded Handler Contexts**

**Rule**: When a handler function is only callable within a UI context that guarantees a state value is non-null (e.g., a form that only renders when `editingId !== null`), a non-null assertion (`!`) is acceptable but an early-return guard is preferred for defensive coding. If using `!`, add a comment explaining the invariant.

**Reason**: `ExpensesView` uses `editingId!` in `handleEditSubmit` and `deleteTarget!` in `handleDeleteConfirm`. These are safe because the UI rendering conditions prevent calling these handlers when the values are null, but the assertions make the code fragile to future refactoring that might change the rendering conditions.
