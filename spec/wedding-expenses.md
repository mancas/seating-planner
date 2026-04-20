# Spec: Wedding Expenses

## Metadata

- **Slug**: `wedding-expenses`
- **Date**: 2026-04-11
- **Status**: Completed
- **Author**: User
- **Related specs**: [spec/guest-crud-flow.md](./guest-crud-flow.md), [spec/settings-screen.md](./settings-screen.md), [spec/sidebar-navigation.md](./sidebar-navigation.md), [spec/export-import-project.md](./export-import-project.md), [spec/update-dietary-flags-metrics.md](./update-dietary-flags-metrics.md)

## Description

Add a wedding expenses tracker as a new top-level section of the app. The feature provides a dedicated page (`/expenses`) where the user can register, view, edit, and delete wedding cost entries. Each expense has a description and a monetary amount. The page displays the full list of expenses and a summary stat showing the total cost.

This feature tracks **expenses only** (outcomes/costs). Income is already tracked separately via per-guest `gift` values on the guest list — there is no income/outcome toggle, no automatic integration with gifts, and no net balance calculation. The expenses list is an independent data entity persisted in its own localStorage key.

### Core Behaviors

- **Expense List**: The `/expenses` page displays all expense entries in a list/table, ordered by creation (newest first). Each row shows the description and the formatted amount. A stat card at the top shows the total sum of all expenses.
- **Add Expense**: An inline form or dedicated add flow lets the user create a new expense with a description (required) and amount (required, positive number). On submission, the expense is persisted to localStorage and the list updates.
- **Edit Expense**: Each expense row has an edit action. Clicking it opens the form pre-populated with the expense's current data. On submission, the expense is updated in localStorage.
- **Delete Expense**: Each expense row has a delete action. Clicking it shows a confirmation dialog. On confirmation, the expense is removed from localStorage and the list updates.
- **Persistence**: Expenses are stored in localStorage under a new key (`seating-plan:expenses`) as a JSON-serialized `Expense[]` array, using the same `createStorage` utility pattern as guests and tables.

### Entry Points

- **Desktop (>=768px)**: An "Expenses" link in the `LeftSidebar` navigation section (between "Canvas" and "Settings"), navigating to `/expenses`.
- **Mobile (<768px)**: An "EXPENSES" tab in the `BottomTabBar`, navigating to `/expenses`.

## User Stories

1. As a **wedding planner**, I want to register wedding expenses with a description and amount so that I can keep track of all costs.
2. As a **wedding planner**, I want to see a list of all registered expenses so that I can review what I've spent.
3. As a **wedding planner**, I want to see the total sum of all expenses so that I can understand the overall wedding cost at a glance.
4. As a **wedding planner**, I want to edit an existing expense so that I can correct mistakes or update amounts.
5. As a **wedding planner**, I want to delete an expense so that I can remove entries that are no longer relevant.
6. As a **wedding planner**, I want to be warned before deleting an expense so that I don't accidentally lose data.
7. As a **wedding planner on mobile**, I want to access the expenses page from the bottom tab bar so that I can manage costs on my phone.

## Acceptance Criteria

### Expenses Page Route

1. GIVEN the app is loaded WHEN the user navigates to `/expenses` THEN an Expenses page is displayed with a total stat card, an expense list, and an add expense form.

2. GIVEN the user is on `/expenses` WHEN viewing the page THEN the `LeftSidebar` is rendered with "Expenses" highlighted as active.

### Navigation — Desktop Sidebar

3. GIVEN a desktop viewport (>=768px) WHEN viewing the `LeftSidebar` on any view THEN an "Expenses" navigation item is visible between "Canvas" and "Settings" in the nav section.

4. GIVEN the user is on `/expenses` WHEN viewing the `LeftSidebar` THEN the "Expenses" nav item is highlighted as active (same `isActive` styling as other `SidebarNavItem` entries).

5. GIVEN the user clicks the "Expenses" nav item in the sidebar WHEN on any view THEN the app navigates to `/expenses`.

6. GIVEN the user is on `/expenses` WHEN viewing the `LeftSidebar` THEN "Listado de invitados" is NOT active (the existing active state logic must exclude `/expenses`).

### Navigation — Mobile Bottom Tab Bar

7. GIVEN a mobile viewport (<768px) WHEN viewing the `BottomTabBar` THEN an "EXPENSES" tab is visible (fourth tab, after CANVAS, GUESTS, and SETTINGS).

8. GIVEN the user taps the "EXPENSES" tab WHEN on any view THEN the app navigates to `/expenses`.

9. GIVEN the user is on `/expenses` WHEN viewing the `BottomTabBar` THEN the "EXPENSES" tab is highlighted as active and no other tab is active.

### Expense Data Persistence

10. GIVEN a fresh browser with no localStorage data WHEN the user navigates to `/expenses` THEN the expense list is empty and the total shows €0.

11. GIVEN an expense has been added WHEN the page is reloaded THEN the expense still appears in the list (data persisted in localStorage).

### Add Expense

12. GIVEN the user is on `/expenses` WHEN the user fills in the description and amount fields and clicks "ADD_EXPENSE" THEN a new expense is created with an auto-generated UUID, persisted to localStorage, and appears at the top of the expense list.

13. GIVEN the add expense form is displayed WHEN the user submits with an empty description THEN a validation error is shown inline below the description field and the form is not submitted.

14. GIVEN the add expense form is displayed WHEN the user submits with an empty or zero amount THEN a validation error is shown inline below the amount field and the form is not submitted.

15. GIVEN the add expense form is displayed WHEN the user submits with a negative amount THEN a validation error is shown inline below the amount field and the form is not submitted.

16. GIVEN the user successfully adds an expense WHEN the expense is saved THEN the add form is cleared (fields reset to empty) and the total stat card updates to include the new expense.

### Edit Expense

17. GIVEN the expense list has entries WHEN the user clicks the edit action on an expense row THEN the row transitions to an inline edit state (or a form appears) with the description and amount pre-populated.

18. GIVEN the user is editing an expense WHEN the user modifies the fields and clicks "SAVE_EXPENSE" THEN the expense is updated in localStorage, the list reflects the updated values, and the total stat card recalculates.

19. GIVEN the user is editing an expense WHEN the user clicks "CANCEL" THEN the edit state is dismissed and no data is changed.

20. GIVEN the user is editing an expense WHEN the user submits with an empty description or invalid amount THEN validation errors are shown and the form is not submitted (same rules as add).

### Delete Expense

21. GIVEN the expense list has entries WHEN the user clicks the delete action on an expense row THEN a confirmation dialog is shown using `ConfirmDialog` with the title "DELETE_EXPENSE", the target name set to the expense description, and a warning message.

22. GIVEN the delete confirmation dialog is shown WHEN the user clicks "CANCEL" THEN the dialog closes and no data is changed.

23. GIVEN the delete confirmation dialog is shown WHEN the user clicks "CONFIRM_DELETE" THEN the expense is removed from localStorage, the list updates, and the total stat card recalculates.

### Total Stat Card

24. GIVEN expenses exist WHEN viewing the `/expenses` page THEN a stat card at the top shows label "TOTAL EXPENSES", the sum of all expense amounts formatted as currency (e.g., "€1,250"), and "X ENTRIES" sub-text where X is the count of expenses.

25. GIVEN no expenses exist WHEN viewing the `/expenses` page THEN the stat card shows "TOTAL EXPENSES", value "€0", and "NO_ENTRIES" sub-text.

### Export/Import Integration

26. GIVEN expenses exist in localStorage WHEN the user exports the project from the Settings page THEN the exported JSON file includes the expenses data under `data.expenses`.

27. GIVEN the user imports a project file that contains expenses data WHEN the import succeeds THEN the expenses localStorage key is overwritten with the imported expenses.

28. GIVEN the user imports a project file that does NOT contain an expenses field (e.g., exported from an older version) WHEN the import succeeds THEN the expenses localStorage key is cleared (reset to empty array).

29. GIVEN the user deletes/resets the project from the Settings page WHEN the delete completes THEN the expenses localStorage key is also removed.

### Responsive Layout

30. GIVEN a desktop viewport (>=768px) WHEN viewing `/expenses` THEN the expenses page content is displayed in the main content area to the right of the `LeftSidebar`, using a centered max-width container.

31. GIVEN a mobile viewport (<768px) WHEN viewing `/expenses` THEN the expenses page content fills the full width with appropriate padding, and the `BottomTabBar` is visible at the bottom.

## Scope

### In Scope

- New `/expenses` route and `ExpensesView` page component
- "Expenses" navigation link in `LeftSidebar` nav section
- "EXPENSES" tab in `BottomTabBar`
- Expense data model (`Expense` interface with id, description, amount, createdAt)
- Expense store module (`src/data/expense-store.ts`) with CRUD functions using `createStorage`
- Expense type definition (`src/data/expense-types.ts`)
- Add expense form with react-hook-form (description + amount, inline on the page)
- Edit expense (inline edit or modal form)
- Delete expense with `ConfirmDialog` confirmation
- Total expenses stat card (sum + count)
- localStorage persistence under `seating-plan:expenses` key
- Currency formatting with `€` and `Intl.NumberFormat` (consistent with TOTAL GIFTS card)
- Update `project-export.ts` to include expenses in export/import/delete
- Update `LeftSidebar` active states to exclude `/expenses` from "Listado de invitados" active check
- Update `BottomTabBar` active states for the new tab

### Out of Scope

- Income tracking (gifts are tracked per-guest in the guest list feature)
- Net balance / profit-loss calculation
- Expense categories or tags
- Date/due-date per expense
- Recurring expenses
- Budget targets or limits
- Charts or visual breakdowns
- Per-vendor or per-supplier tracking
- Receipt upload or attachments
- Multi-currency support (hardcoded to €)
- Sorting or filtering the expense list
- Pagination (not needed for typical wedding expense counts)

## Edge Cases

1. **Empty expense list**: The page shows an empty state message (e.g., "NO_ENTRIES // INITIALIZE_EXPENSE_LOG") with the total at €0 and "NO_ENTRIES" sub-text.

2. **Delete the only expense**: After deletion, the list returns to the empty state and the total resets to €0.

3. **Very large amounts**: `Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 })` handles thousands separators correctly (e.g., "€125.000"). No upper bound enforced.

4. **Decimal amounts**: The amount input accepts decimal values. The total is displayed rounded to the nearest integer (consistent with the TOTAL GIFTS card). Individual row amounts may show decimals if entered (e.g., "€1.234,50") — use `maximumFractionDigits: 2` for row display.

5. **Edit while another edit is active**: Only one expense should be in edit mode at a time. Starting to edit a different row cancels the previous edit.

6. **Delete while edit is active on the same row**: If the user clicks delete on a row that is being edited, the confirmation dialog appears. If confirmed, the row is deleted and the edit state is cleared.

7. **Concurrent tabs**: If the user has two tabs open and adds an expense in one, the other tab will not auto-update. Data syncs on the next page load/navigation (consistent with existing behavior).

8. **Import a project with no expenses field**: Older export files (version 1 without expenses) should not break import. The expenses key is cleared to `[]`, giving the user a fresh expenses list.

9. **Export/import round-trip**: Expenses survive an export-then-import cycle. The data is identical before and after.

10. **Delete project clears expenses**: The delete/reset action on the Settings page also removes the `seating-plan:expenses` localStorage key.

11. **Four-tab BottomTabBar**: Adding a fourth tab uses the existing `justify-around` layout. Four items distribute evenly on mobile screens (320px+).

12. **Amount input with non-numeric characters**: The form should use `type="number"` or input validation to reject non-numeric input. react-hook-form validation catches invalid values on submission.

## Design Decisions

### DD-1: Expenses Only — No Income Tracking

**Decision**: The expenses feature tracks only costs (outcomes). There is no income/outcome toggle or type field.
**Reasoning**: Income is already tracked via per-guest `gift` values in the guest list feature, with a TOTAL GIFTS stat card. Duplicating income tracking in expenses would create data redundancy and confusion. The user confirmed this separation: expenses are costs, gifts are income.

### DD-2: Dedicated Route at `/expenses`

**Decision**: Expenses gets its own route (`/expenses`) as a top-level navigation destination with a sidebar nav item and mobile tab bar entry.
**Reasoning**: Expenses is a distinct domain (financial tracking) separate from guest management, seating arrangement, and settings. A dedicated route follows the established navigation pattern (each major section has its own route: `/` for guests, `/seating-plan` for canvas, `/settings` for project management). The user explicitly requested this approach.

### DD-3: Separate localStorage Key

**Decision**: Expenses are stored under `seating-plan:expenses` as a separate localStorage key, not embedded within guest or table data.
**Reasoning**: Expenses are an independent data entity with no foreign-key relationship to guests or tables. A separate key follows the existing pattern (`seating-plan:guests`, `seating-plan:tables`, `seating-plan:table-counter`) and keeps concerns separated. It also simplifies CRUD operations — no need to navigate nested data structures.

### DD-4: Inline Add Form on the Page

**Decision**: The add expense form is rendered inline on the `/expenses` page (not a separate route like `/expenses/new`). The form has two fields (description + amount) and a submit button, placed above the expense list.
**Reasoning**: Expense entries are simple (2 fields). A dedicated route for adding would be over-engineered — it adds navigation overhead for a minimal form. An inline form provides faster data entry: the user types, submits, and immediately sees the new entry in the list below. This is a common pattern for simple list management UIs.

### DD-5: Inline Editing

**Decision**: Editing an expense transforms the row into an editable state (inline edit) rather than navigating to a separate page or opening a modal.
**Reasoning**: Consistent with the inline add approach. Since the form is just 2 fields, inline editing keeps the user in context. The row switches from display mode to edit mode with pre-populated inputs, save/cancel buttons. Only one row can be in edit mode at a time.

### DD-6: UUID for Expense IDs

**Decision**: Each expense is assigned a UUID v4 ID (via the existing `uuid` package) on creation.
**Reasoning**: Consistent with guest IDs. UUIDs provide collision-free client-side ID generation without needing a counter or sequence.

### DD-7: Currency Format — Euro with German Locale

**Decision**: Use `€` prefix with `Intl.NumberFormat('de-DE')` for formatting. Total stat card uses `maximumFractionDigits: 0` (integers). Individual row amounts use `maximumFractionDigits: 2` to preserve user-entered precision.
**Reasoning**: Consistent with the TOTAL GIFTS stat card (spec `update-dietary-flags-metrics`, DD-1). The euro symbol and German locale thousands separator match the app's locale context.

### DD-8: Export/Import Includes Expenses

**Decision**: Update `project-export.ts` to include expenses in the export payload (`data.expenses`), import flow, and delete/reset function. Backward compatibility: if an imported file lacks the `expenses` field, treat it as an empty array.
**Reasoning**: Expenses are project data and should be portable across machines, same as guests and tables. Backward compatibility ensures older export files (without expenses) can still be imported without errors.

### DD-9: ExpensesView Renders Its Own LeftSidebar

**Decision**: The `ExpensesView` page component renders `LeftSidebar` as a sibling, same as all other page components.
**Reasoning**: Consistent with the existing pattern — `GuestListView`, `SeatingPlanView`, `ImportGuestsView`, and `SettingsView` all render `LeftSidebar` themselves. The sidebar's bottom section shows guest list actions (ADD GUEST) for non-canvas routes, which is acceptable.

### DD-10: Sidebar Nav Item Position

**Decision**: The "Expenses" nav item is placed between "Canvas" and "Settings" in the sidebar.
**Reasoning**: Settings is a utility/admin section and should remain last. Expenses is a content section (like guests and canvas) and logically groups with them. The order becomes: Listado de invitados → Canvas → Expenses → Settings.

## UI/UX Details

### Expenses Page Layout — Desktop

```
+---------------------------+----------------------------------------------+
|  SEATING_01               |                                              |
|  ACTIVE SESSION           |    EXPENSES                                  |
|                           |                                              |
|  > Listado de invitados   |    ┌──────────────────────────────────────┐   |
|  > Canvas                 |    │ TOTAL EXPENSES                       │   |
|  > Expenses          ●    |    │ €3,450                               │   |
|  > Settings               |    │ 8 ENTRIES                            │   |
|                           |    └──────────────────────────────────────┘   |
|                           |                                              |
|                           |    ── ADD EXPENSE ─────────────────────       |
|                           |                                              |
|                           |    DESCRIPTION*                               |
|                           |    [_________________________________]        |
|                           |    AMOUNT*                                    |
|                           |    [_________________________________]        |
|                           |    [+ ADD_EXPENSE]                            |
|                           |                                              |
|                           |    ── EXPENSE LOG ─────────────────────       |
|                           |                                              |
|                           |    Venue rental               €2,000  [✎][✕] |
|                           |    ──────────────────────────────────         |
|                           |    Catering deposit             €800  [✎][✕] |
|                           |    ──────────────────────────────────         |
|                           |    Flowers                      €650  [✎][✕] |
|                           |    ──────────────────────────────────         |
|                           |                                              |
|  ┌───────────────────┐    |                                              |
|  │ ADD GUEST          │    |                                              |
|  └───────────────────┘    |                                              |
|                           |                                              |
+---------------------------+----------------------------------------------+
```

### Expenses Page — Mobile Layout

```
+------------------------------------------+
| ● PLANNER_V1.0                           |  ← TopNav
+------------------------------------------+
|                                          |
|  EXPENSES                                |
|                                          |
|  ┌──────────────────────────────────┐    |
|  │ TOTAL EXPENSES                   │    |
|  │ €3,450                           │    |
|  │ 8 ENTRIES                        │    |
|  └──────────────────────────────────┘    |
|                                          |
|  ── ADD EXPENSE ────────────────         |
|                                          |
|  DESCRIPTION*                            |
|  [________________________________]      |
|  AMOUNT*                                 |
|  [________________________________]      |
|  [+ ADD_EXPENSE]                         |
|                                          |
|  ── EXPENSE LOG ────────────────         |
|                                          |
|  Venue rental             €2,000  [✎][✕] |
|  ─────────────────────────────────       |
|  Catering deposit           €800  [✎][✕] |
|  ─────────────────────────────────       |
|                                          |
+------------------------------------------+
| CANVAS  GUESTS  SETTINGS  EXPENSES       |  ← BottomTabBar (4 tabs)
+------------------------------------------+
```

### Page Header

- Element: `<h1>` with `text-heading-4 text-foreground-heading tracking-wider`
- Text: `EXPENSES`

### Total Stat Card

- Uses existing `StatCard` atom (`src/components/atoms/StatCard.tsx`)
- Label: `TOTAL EXPENSES`
- Value: `€{formatted_total}` using `Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 })`
- Sub-text: `{count} ENTRIES` or `NO_ENTRIES` when zero
- Sub-text style: `text-caption text-foreground-muted mt-1`

### Section Header — "ADD EXPENSE"

- Style: `text-label text-foreground-muted tracking-wider uppercase`
- Separator: `border-b border-border pb-2 mb-4` below the label

### Add Form Fields

| Field       | Input Type | Placeholder            | Cyberpunk Label | Required |
| ----------- | ---------- | ---------------------- | --------------- | -------- |
| Description | text       | `E.G. VENUE RENTAL...` | DESCRIPTION     | Yes      |
| Amount      | number     | `E.G. 2500...`         | AMOUNT          | Yes      |

- Description input: `.input` CSS class, full width
- Amount input: `.input` CSS class, full width, `type="number"`, `step="0.01"`, `min="0.01"`
- Submit button: `btn-primary flex items-center justify-center gap-2`, label `ADD_EXPENSE` with `LuPlus` icon
- Button width: full-width on mobile, auto-width on desktop

### Section Header — "EXPENSE LOG"

- Style: `text-label text-foreground-muted tracking-wider uppercase`
- Separator: `border-b border-border pb-2 mb-4` below the label

### Expense Row (Display Mode)

- Layout: flex row with description on the left, amount on the right, action icons after amount
- Description: `text-body-sm text-foreground` — displayed as entered (not forced uppercase)
- Amount: `text-body-sm text-foreground-heading font-semibold` — formatted as `€{amount}` with `Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 })`
- Edit icon: `LuPencil` (size 14), rendered as `IconButton` with `label="Edit expense"`
- Delete icon: `LuTrash2` (size 14), rendered as `IconButton` with `label="Delete expense"`
- Row separator: `border-b border-border` between rows

### Expense Row (Edit Mode)

- The description and amount display text is replaced with input fields pre-populated with current values
- Same input styling as the add form
- Two buttons: "SAVE_EXPENSE" (`btn-primary`, compact) and "CANCEL" (`btn-secondary`, compact)
- Managed by react-hook-form (separate form instance from the add form)

### Delete Confirmation Dialog

```
┌─────────────────────────────────────┐
│                                     │
│  ⚠ DELETE_EXPENSE                   │
│                                     │
│  TARGET: VENUE RENTAL               │
│                                     │
│  This expense entry will be         │
│  permanently removed. This action   │
│  cannot be undone.                  │
│                                     │
│  [CANCEL]       [CONFIRM_DELETE]    │
│                                     │
└─────────────────────────────────────┘
```

Uses the existing `ConfirmDialog` molecule with:

- `title="DELETE_EXPENSE"`
- `targetName={expense.description}`
- `message="This expense entry will be permanently removed. This action cannot be undone."`
- `confirmLabel="CONFIRM_DELETE"`
- `cancelLabel="CANCEL"`

### Empty State

```
┌───────────────────────────────────┐
│                                   │
│   NO_ENTRIES //                   │
│   INITIALIZE_EXPENSE_LOG          │
│                                   │
│   Register your first expense     │
│   to begin tracking costs.        │
│                                   │
└───────────────────────────────────┘
```

- Displayed below the "EXPENSE LOG" section header when the expense list is empty
- Style: centered text, `text-heading-5 text-foreground-heading` for the title, `text-body-sm text-foreground-muted` for the description

### Sidebar Navigation Item

- Uses existing `SidebarNavItem` molecule
- Label: `"Expenses"`
- Position: after "Canvas", before "Settings"
- Active when `location.pathname === '/expenses'`

### Bottom Tab Bar — Expenses Tab

- Uses existing `TabBarItem` atom
- Icon: `LuReceipt` from `react-icons/lu` (size 16)
- Label: `"EXPENSES"`
- Active when `location.pathname === '/expenses'`
- Position: fourth tab (after CANVAS, GUESTS, SETTINGS)

### Validation Error Style

- Inline error messages appear below the field in `text-caption` size with `text-red-400` color
- Example: "REQUIRED_FIELD // DESCRIPTION_CANNOT_BE_EMPTY"
- Consistent with guest form validation styling

## Data Requirements

### Expense Interface

```typescript
// src/data/expense-types.ts

export interface Expense {
  id: string // UUID v4
  description: string // free-text description of the expense
  amount: number // positive number, monetary value in euros
  createdAt: string // ISO 8601 timestamp of creation
}
```

### Expense Store API (`src/data/expense-store.ts`)

```typescript
import type { Expense } from './expense-types'
import { v4 as uuidv4 } from 'uuid'
import { createStorage } from './storage-utils'

const storage = createStorage<Expense[]>('seating-plan:expenses', [])

function getExpenses(): Expense[]
function getExpenseById(id: string): Expense | undefined
function addExpense(data: Omit<Expense, 'id' | 'createdAt'>): Expense
function updateExpense(
  id: string,
  data: Partial<Omit<Expense, 'id' | 'createdAt'>>,
): Expense | undefined
function deleteExpense(id: string): boolean
function getTotalExpenses(): number // sum of all amounts
function getExpenseCount(): number // count of all expenses
```

### localStorage Key

| Key                     | Type        | Description         |
| ----------------------- | ----------- | ------------------- |
| `seating-plan:expenses` | `Expense[]` | All expense records |

### react-hook-form Types

```typescript
interface ExpenseFormValues {
  description: string
  amount: string // string from input, parsed to number on submission
}
```

### Export Format Update

The `ProjectExport` interface in `src/utils/project-export.ts` is extended:

```typescript
export interface ProjectExport {
  version: number
  exportedAt: string
  data: {
    guests: Guest[]
    tables: FloorTable[]
    tableCounter: number
    expenses?: Expense[] // optional for backward compatibility with v1 files
  }
}
```

The `expenses` field is optional in the interface to support importing older export files that don't include it. On export, the field is always present.

## Technical Plan

### Impact Analysis

#### Affected Areas

| Area                 | Files                                       | Type of Change |
| -------------------- | ------------------------------------------- | -------------- |
| Expense types        | `src/data/expense-types.ts`                 | Create         |
| Expense store        | `src/data/expense-store.ts`                 | Create         |
| Expenses page        | `src/pages/ExpensesView.tsx`                | Create         |
| Routing              | `src/main.tsx`                              | Modify         |
| Desktop navigation   | `src/components/organisms/LeftSidebar.tsx`  | Modify         |
| Mobile navigation    | `src/components/organisms/BottomTabBar.tsx` | Modify         |
| Export/Import/Delete | `src/utils/project-export.ts`               | Modify         |

#### Integration Points

- **Routing (`src/main.tsx`)**: New `<Route path="expenses" element={<ExpensesView />} />` added as a sibling to `seating-plan` and `settings` routes, inside the `<Route element={<App />}>` layout route.
- **LeftSidebar (`src/components/organisms/LeftSidebar.tsx`)**: New `SidebarNavItem` for "Expenses" between "Canvas" and "Settings". The "Listado de invitados" `isActive` logic must be updated to exclude `/expenses` (currently it's a catch-all `!isCanvasView && location.pathname !== '/settings'`).
- **BottomTabBar (`src/components/organisms/BottomTabBar.tsx`)**: New `TabBarItem` for "EXPENSES" with `LuReceipt` icon. The "GUESTS" tab `isActive` logic must be updated to exclude `/expenses` (currently `!isCanvasView && !isSettingsView`).
- **project-export.ts (`src/utils/project-export.ts`)**: The `ProjectExport` interface, `generateProjectExport`, `validateProjectImport`, `applyProjectImport`, and `deleteProject` functions must all be updated to include expenses data.
- **Storage utilities (`src/data/storage-utils.ts`)**: Reused via `createStorage<Expense[]>('seating-plan:expenses', [])` — no modification needed.
- **ConfirmDialog (`src/components/molecules/ConfirmDialog.tsx`)**: Reused for delete confirmation — no modification needed.
- **StatCard (`src/components/atoms/StatCard.tsx`)**: Reused for total stat card — no modification needed.
- **FormField / FormError**: Reused for add/edit form validation — no modification needed.

#### Risk Areas

- **LeftSidebar `isActive` logic (G-50)**: The "Listado de invitados" nav item currently uses a negation pattern (`!isCanvasView && location.pathname !== '/settings'`). Adding `/expenses` requires extending the exclusion. Must audit all nav items' `isActive` conditions.
- **BottomTabBar `isActive` logic (G-50)**: The "GUESTS" tab uses `!isCanvasView && !isSettingsView`. Must add `!isExpensesView` exclusion.
- **project-export.ts `validateProjectImport`**: Currently validates `version === 1`. Adding `expenses` as optional keeps backward compatibility with v1 files. The version number remains 1 (expenses are additive, not a breaking schema change). Files without `data.expenses` are treated as `[]`.

### Task Breakdown

#### TASK-001: Create Expense Type Definition

- **Description**: Create the `Expense` interface and `ExpenseFormValues` type in a new type definition file.
- **Files**: `src/data/expense-types.ts` (create)
- **Instructions**:
  1. Create `src/data/expense-types.ts`
  2. Define and export the `Expense` interface with fields: `id: string`, `description: string`, `amount: number`, `createdAt: string`
  3. Define and export the `ExpenseFormValues` interface with fields: `description: string`, `amount: string` (string from input, parsed to number on submission)
- **Project context**:
  - Framework: TypeScript ~5.9.3 strict mode
  - Conventions: PascalCase for types/interfaces, kebab-case for data files, `import type` enforced by `verbatimModuleSyntax: true` (G-62 style)
  - Libraries: None needed — pure type definitions
  - Reference: `src/data/guest-types.ts` for pattern
- **Dependencies**: None
- **Acceptance criteria**: File exists with correctly typed `Expense` and `ExpenseFormValues` interfaces. TypeScript compiles without errors.

#### TASK-002: Create Expense Store Module

- **Description**: Create the expense store with CRUD functions, total calculation, and count, using the `createStorage` utility pattern.
- **Files**: `src/data/expense-store.ts` (create)
- **Instructions**:
  1. Create `src/data/expense-store.ts`
  2. Import `Expense` type from `./expense-types` using `import type`
  3. Import `{ v4 as uuidv4 }` from `'uuid'`
  4. Import `{ createStorage }` from `'./storage-utils'`
  5. Create storage instance: `const storage = createStorage<Expense[]>('seating-plan:expenses', [])`
  6. Implement and export the following functions:
     - `getExpenses(): Expense[]` — returns `storage.read()` (ordered by creation, newest first is handled at read time via `.slice().reverse()` or stored in insertion order and reversed on read)
     - `getExpenseById(id: string): Expense | undefined` — finds by id
     - `addExpense(data: Omit<Expense, 'id' | 'createdAt'>): Expense` — creates with `uuidv4()` id and `new Date().toISOString()` createdAt, appends to array, writes, returns new expense
     - `updateExpense(id: string, data: Partial<Omit<Expense, 'id' | 'createdAt'>>): Expense | undefined` — finds by id, merges data, writes, returns updated or undefined
     - `deleteExpense(id: string): boolean` — filters out by id, writes, returns true if removed
     - `getTotalExpenses(): number` — reduces all amounts to sum
     - `getExpenseCount(): number` — returns array length
  7. Note: `getExpenses()` should return newest first. Since expenses are appended, reverse the array on read: `return storage.read().slice().reverse()`
- **Project context**:
  - Framework: TypeScript, ESM
  - Conventions: camelCase functions, kebab-case files. Store functions are NOT hooks — they perform I/O and should be wrapped in `useState(() => fn())` in components (G-39)
  - Libraries: `uuid` (^13.0.0, already installed), `createStorage` from `src/data/storage-utils.ts`
  - Reference: `src/data/guest-store.ts` for exact pattern
- **Dependencies**: TASK-001
- **Acceptance criteria**: All 7 functions are exported. `addExpense` generates UUID and ISO timestamp. `getExpenses` returns newest first. Storage key is `seating-plan:expenses`.

#### TASK-003: Update Project Export/Import to Include Expenses

- **Description**: Extend the project export, import validation, import application, and delete functions to handle expenses data. Maintain backward compatibility with export files that lack an `expenses` field.
- **Files**: `src/utils/project-export.ts` (modify)
- **Instructions**:
  1. Add `import type { Expense } from '../data/expense-types'` at the top (type-only import)
  2. Update the `ProjectExport` interface's `data` property to include `expenses?: Expense[]` (optional for backward compatibility)
  3. Update `generateProjectExport()`:
     - Read `localStorage.getItem('seating-plan:expenses')` into `expensesRaw`
     - Parse to `Expense[]` (default `[]`)
     - Add `expenses` to the `exportData.data` object
  4. Update `validateProjectImport()`:
     - After existing validations, add: if `data.expenses` exists and is not an array, return `null`
     - If `data.expenses` does not exist, that's fine (backward compat) — the field is optional
  5. Update `applyProjectImport()`:
     - Add `localStorage.setItem('seating-plan:expenses', JSON.stringify(data.data.expenses ?? []))` — if no expenses field in imported data, clear to empty array
  6. Update `deleteProject()`:
     - Add `localStorage.removeItem('seating-plan:expenses')`
- **Project context**:
  - Framework: TypeScript strict mode
  - Conventions: Type-only imports via `import type`. Relative imports throughout
  - Libraries: None additional
  - Reference: Existing functions in `src/utils/project-export.ts` for pattern
  - Guardrails: G-47 (scope isolation), backward compatibility for v1 files without expenses
- **Dependencies**: TASK-001
- **Acceptance criteria**: Export includes `data.expenses`. Import with expenses field restores data. Import without expenses field clears to `[]`. Delete removes `seating-plan:expenses` key. Validation rejects files where `data.expenses` exists but is not an array. Version stays at 1.

#### TASK-004: Update LeftSidebar Navigation

- **Description**: Add an "Expenses" nav item to the LeftSidebar between "Canvas" and "Settings", and fix the "Listado de invitados" active state to exclude `/expenses`.
- **Files**: `src/components/organisms/LeftSidebar.tsx` (modify)
- **Instructions**:
  1. Add a new variable: `const isExpensesView = location.pathname === '/expenses'`
  2. Update the "Listado de invitados" `SidebarNavItem` `isActive` prop from:
     `!isCanvasView && location.pathname !== '/settings'`
     to:
     `!isCanvasView && !isExpensesView && location.pathname !== '/settings'`
  3. Add a new `SidebarNavItem` between the "Canvas" and "Settings" items:
     ```tsx
     <SidebarNavItem
       label="Expenses"
       isActive={isExpensesView}
       onClick={() => navigate('/expenses')}
     />
     ```
- **Project context**:
  - Framework: React 19, react-router v7
  - Conventions: Function declarations for components (G-45). `SidebarNavItem` molecule already exists
  - Libraries: react-router (`useLocation`, `useNavigate` already imported)
  - Guardrails: G-50 (audit ALL nav items' isActive when adding routes), G-51 (co-dependent navigation changes)
  - Reference: Existing nav items in `LeftSidebar.tsx` lines 63-77
- **Dependencies**: None
- **Acceptance criteria**: "Expenses" nav item appears between "Canvas" and "Settings". Clicking it navigates to `/expenses`. It is highlighted when on `/expenses`. "Listado de invitados" is NOT active when on `/expenses`.

#### TASK-005: Update BottomTabBar Navigation

- **Description**: Add an "EXPENSES" tab to the BottomTabBar with `LuReceipt` icon, and fix the "GUESTS" tab active state to exclude `/expenses`.
- **Files**: `src/components/organisms/BottomTabBar.tsx` (modify)
- **Instructions**:
  1. Add `LuReceipt` to the import from `react-icons/lu`: `import { LuSquarePen, LuUser, LuSettings, LuReceipt } from 'react-icons/lu'`
  2. Add a new variable: `const isExpensesView = location.pathname === '/expenses'`
  3. Update the "GUESTS" `TabBarItem` `isActive` prop from:
     `!isCanvasView && !isSettingsView`
     to:
     `!isCanvasView && !isSettingsView && !isExpensesView`
  4. Add a new `TabBarItem` as the fourth tab (after SETTINGS):
     ```tsx
     <TabBarItem
       icon={<LuReceipt size={16} />}
       label="EXPENSES"
       isActive={isExpensesView}
       onClick={() => navigate('/expenses')}
     />
     ```
- **Project context**:
  - Framework: React 19, react-router v7
  - Conventions: `TabBarItem` atom already exists. Icons from `react-icons/lu` only (G-20)
  - Libraries: react-icons (`LuReceipt`), react-router
  - Guardrails: G-50 (audit ALL tab items' isActive), G-21 (verify icon export name — `LuReceipt` exists in `react-icons/lu`)
  - Reference: Existing tabs in `BottomTabBar.tsx` lines 14-31
- **Dependencies**: None
- **Acceptance criteria**: "EXPENSES" tab appears as the fourth tab. Clicking it navigates to `/expenses`. It is highlighted when on `/expenses`. "GUESTS" tab is NOT active when on `/expenses`. Four tabs distribute evenly via `justify-around`.

#### TASK-006: Create ExpensesView Page Component

- **Description**: Create the full Expenses page with: stat card, inline add form (react-hook-form), expense list with inline edit/delete, empty state, and delete confirmation dialog. Renders LeftSidebar as a sibling.
- **Files**: `src/pages/ExpensesView.tsx` (create)
- **Instructions**:
  1. Create `src/pages/ExpensesView.tsx`
  2. Import dependencies:
     - `useState`, `useCallback` from `'react'`
     - `useNavigate` from `'react-router'`
     - `useForm` from `'react-hook-form'`
     - `LuPlus`, `LuPencil`, `LuTrash2` from `'react-icons/lu'`
     - Store functions: `getExpenses`, `addExpense`, `updateExpense`, `deleteExpense`, `getTotalExpenses`, `getExpenseCount` from `'../data/expense-store'`
     - `getGuests` from `'../data/guest-store'`
     - `getTables` from `'../data/table-store'`
     - Type: `import type { Expense } from '../data/expense-types'`; `import type { ExpenseFormValues } from '../data/expense-types'`
     - Components: `LeftSidebar`, `StatCard`, `ConfirmDialog`, `IconButton`, `FormField`
  3. Component structure (`function ExpensesView()`):
     - **State**:
       - `const [expenses, setExpenses] = useState<Expense[]>(() => getExpenses())`
       - `const [editingId, setEditingId] = useState<string | null>(null)`
       - `const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null)`
     - **Derived values**:
       - `const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)`
       - `const expenseCount = expenses.length`
     - **Sidebar props** (same pattern as SettingsView):
       - `const guests = getGuests()`
       - `const tables = getTables()`
       - `const navigate = useNavigate()`
       - `const handleNavigateToAdd = useCallback(() => navigate('/guests/new'), [navigate])`
       - `const handleSidebarAddTable = useCallback(() => navigate('/seating-plan'), [navigate])`
     - **Add form** (react-hook-form):
       - `const addForm = useForm<ExpenseFormValues>({ defaultValues: { description: '', amount: '' } })`
       - `function handleAddSubmit(values: ExpenseFormValues)`:
         - Parse `amount` to float: `const amount = parseFloat(values.amount)`
         - Call `addExpense({ description: values.description, amount })`
         - `setExpenses(getExpenses())`
         - `addForm.reset()`
       - Validation: `description` required, `amount` required + validate function that checks `parseFloat(value) > 0`
     - **Edit form** (separate react-hook-form instance per edit):
       - `const editForm = useForm<ExpenseFormValues>()` — reset with values when editingId changes
       - When `editingId` changes, call `editForm.reset({ description: expense.description, amount: expense.amount.toString() })`
       - Use "adjusting state during render" pattern: track `prevEditingId` with useState, when editingId changes reset the form
       - `function handleEditSubmit(values: ExpenseFormValues)`:
         - Parse amount, call `updateExpense(editingId!, { description: values.description, amount: parseFloat(values.amount) })`
         - `setExpenses(getExpenses())`
         - `setEditingId(null)`
       - Same validation rules as add form
     - **Edit activation**:
       - `function handleStartEdit(expense: Expense)`: sets `editingId` to expense.id (cancels any previous edit — only one edit at a time)
     - **Cancel edit**:
       - `function handleCancelEdit()`: sets `editingId` to `null`
     - **Delete flow**:
       - `function handleDeleteClick(expense: Expense)`: sets `deleteTarget` to the expense
       - `function handleDeleteConfirm()`: calls `deleteExpense(deleteTarget!.id)`, `setExpenses(getExpenses())`, clears `deleteTarget`, if `editingId === deleteTarget!.id` also clears `editingId`
       - `function handleDeleteCancel()`: clears `deleteTarget`
     - **Currency formatters**:
       - `const formatTotal = (n: number) => '€' + new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n)` (for stat card)
       - `const formatAmount = (n: number) => '€' + new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(n)` (for row display)
  4. JSX structure:

     ```tsx
     <>
       <LeftSidebar
         onAddGuest={handleNavigateToAdd}
         onAddTable={handleSidebarAddTable}
         guests={guests}
         tables={tables}
       />
       <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
         <div className="max-w-xl mx-auto px-4 md:px-6 py-6 md:py-10">
           {/* Page header */}
           <h1 className="text-heading-4 text-foreground-heading tracking-wider mb-6">
             EXPENSES
           </h1>

           {/* Stat card */}
           <StatCard label="TOTAL EXPENSES" value={formatTotal(totalExpenses)}>
             <p className="text-caption text-foreground-muted mt-1">
               {expenseCount > 0 ? `${expenseCount} ENTRIES` : 'NO_ENTRIES'}
             </p>
           </StatCard>

           {/* Add expense section */}
           <h2 className="text-label text-foreground-muted tracking-wider uppercase border-b border-border pb-2 mb-4 mt-8">
             ADD EXPENSE
           </h2>
           <form onSubmit={addForm.handleSubmit(handleAddSubmit)} noValidate>
             <div className="flex flex-col gap-4">
               <FormField
                 label="DESCRIPTION"
                 htmlFor="add-description"
                 required
                 error={
                   addForm.formState.errors.description
                     ? 'REQUIRED_FIELD // DESCRIPTION_CANNOT_BE_EMPTY'
                     : undefined
                 }
               >
                 <input
                   id="add-description"
                   className={`input w-full ${addForm.formState.errors.description ? 'border-red-500/50' : ''}`}
                   placeholder="E.G. VENUE RENTAL..."
                   aria-invalid={!!addForm.formState.errors.description}
                   aria-describedby={
                     addForm.formState.errors.description
                       ? 'add-description-error'
                       : undefined
                   }
                   {...addForm.register('description', { required: true })}
                 />
               </FormField>
               <FormField
                 label="AMOUNT"
                 htmlFor="add-amount"
                 required
                 error={
                   addForm.formState.errors.amount
                     ? 'REQUIRED_FIELD // AMOUNT_MUST_BE_POSITIVE'
                     : undefined
                 }
               >
                 <input
                   id="add-amount"
                   type="number"
                   step="0.01"
                   min="0.01"
                   className={`input w-full ${addForm.formState.errors.amount ? 'border-red-500/50' : ''}`}
                   placeholder="E.G. 2500..."
                   aria-invalid={!!addForm.formState.errors.amount}
                   aria-describedby={
                     addForm.formState.errors.amount
                       ? 'add-amount-error'
                       : undefined
                   }
                   {...addForm.register('amount', {
                     required: true,
                     validate: (v) => parseFloat(v) > 0,
                   })}
                 />
               </FormField>
               <button
                 type="submit"
                 className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto"
               >
                 <LuPlus size={16} />
                 ADD_EXPENSE
               </button>
             </div>
           </form>

           {/* Expense log section */}
           <h2 className="text-label text-foreground-muted tracking-wider uppercase border-b border-border pb-2 mb-4 mt-8">
             EXPENSE LOG
           </h2>

           {expenses.length === 0 ? (
             /* Empty state */
             <div className="text-center py-8">
               <p className="text-heading-5 text-foreground-heading">
                 NO_ENTRIES // INITIALIZE_EXPENSE_LOG
               </p>
               <p className="text-body-sm text-foreground-muted mt-2">
                 Register your first expense to begin tracking costs.
               </p>
             </div>
           ) : (
             /* Expense rows */
             <div>
               {expenses.map((expense) => (
                 <div key={expense.id} className="border-b border-border py-3">
                   {editingId === expense.id ? (
                     /* Edit mode */
                     <form
                       onSubmit={editForm.handleSubmit(handleEditSubmit)}
                       noValidate
                     >
                       <div className="flex flex-col gap-3">
                         <FormField
                           label="DESCRIPTION"
                           htmlFor={`edit-description-${expense.id}`}
                           required
                           error={
                             editForm.formState.errors.description
                               ? 'REQUIRED_FIELD // DESCRIPTION_CANNOT_BE_EMPTY'
                               : undefined
                           }
                         >
                           <input
                             id={`edit-description-${expense.id}`}
                             className={`input w-full ${editForm.formState.errors.description ? 'border-red-500/50' : ''}`}
                             placeholder="E.G. VENUE RENTAL..."
                             aria-invalid={
                               !!editForm.formState.errors.description
                             }
                             {...editForm.register('description', {
                               required: true,
                             })}
                           />
                         </FormField>
                         <FormField
                           label="AMOUNT"
                           htmlFor={`edit-amount-${expense.id}`}
                           required
                           error={
                             editForm.formState.errors.amount
                               ? 'REQUIRED_FIELD // AMOUNT_MUST_BE_POSITIVE'
                               : undefined
                           }
                         >
                           <input
                             id={`edit-amount-${expense.id}`}
                             type="number"
                             step="0.01"
                             min="0.01"
                             className={`input w-full ${editForm.formState.errors.amount ? 'border-red-500/50' : ''}`}
                             placeholder="E.G. 2500..."
                             aria-invalid={!!editForm.formState.errors.amount}
                             {...editForm.register('amount', {
                               required: true,
                               validate: (v) => parseFloat(v) > 0,
                             })}
                           />
                         </FormField>
                         <div className="flex gap-2">
                           <button type="submit" className="btn-primary">
                             SAVE_EXPENSE
                           </button>
                           <button
                             type="button"
                             className="btn-secondary"
                             onClick={handleCancelEdit}
                           >
                             CANCEL
                           </button>
                         </div>
                       </div>
                     </form>
                   ) : (
                     /* Display mode */
                     <div className="flex items-center gap-2">
                       <span className="text-body-sm text-foreground flex-1 truncate">
                         {expense.description}
                       </span>
                       <span className="text-body-sm text-foreground-heading font-semibold whitespace-nowrap">
                         {formatAmount(expense.amount)}
                       </span>
                       <IconButton
                         label="Edit expense"
                         onClick={() => handleStartEdit(expense)}
                       >
                         <LuPencil size={14} />
                       </IconButton>
                       <IconButton
                         label="Delete expense"
                         onClick={() => handleDeleteClick(expense)}
                       >
                         <LuTrash2 size={14} />
                       </IconButton>
                     </div>
                   )}
                 </div>
               ))}
             </div>
           )}
         </div>
       </main>

       {/* Delete confirmation dialog */}
       {deleteTarget && (
         <ConfirmDialog
           title="DELETE_EXPENSE"
           targetName={deleteTarget.description}
           message="This expense entry will be permanently removed. This action cannot be undone."
           confirmLabel="CONFIRM_DELETE"
           cancelLabel="CANCEL"
           onConfirm={handleDeleteConfirm}
           onCancel={handleDeleteCancel}
         />
       )}
     </>
     ```

  5. Export: `export default ExpensesView`
  6. Key implementation notes:
     - Use `useState(() => getExpenses())` for lazy initialization (G-39)
     - Use function declarations for all handlers (G-45)
     - Use `aria-invalid` on form inputs with validation (G-15)
     - The edit form reset must happen when `editingId` changes. Use the "adjusting state during render" pattern (G-16): track `prevEditingId` with useState, compare in render, reset form when changed
     - Only one row in edit mode at a time (edge case #5)
     - Delete while editing same row clears editingId (edge case #6)

- **Project context**:
  - Framework: React 19, react-hook-form ^7.72.1, react-router ^7.14.0
  - Conventions: Function declarations for components and handlers (G-45). Default export. Props interface named `Props`. `useState(() => fn())` for lazy init from localStorage (G-39). No `setState` in `useEffect` — use adjusting state during render (G-16)
  - Libraries: react-hook-form (`useForm`), react-icons/lu (`LuPlus`, `LuPencil`, `LuTrash2`), uuid (via store)
  - Design system: Dark mode only (G-4). Typography classes: `text-heading-4`, `text-heading-5`, `text-body-sm`, `text-caption`, `text-label`. Component classes: `.input`, `.btn-primary`, `.btn-secondary`, `.card`. Border: `border-b border-border`
  - Reference: `src/pages/SettingsView.tsx` for page + sidebar pattern, `src/components/organisms/GuestForm.tsx` for react-hook-form validation pattern, `src/components/organisms/GuestListFooterStats.tsx` for currency formatting pattern
- **Dependencies**: TASK-001, TASK-002
- **Acceptance criteria**:
  - Page renders with h1 "EXPENSES", stat card, add form, expense log section
  - Add form validates required description and positive amount, creates expense, resets form, updates list and stat
  - Edit mode replaces row with form, pre-populated, validates, saves, cancels
  - Delete shows ConfirmDialog, removes expense on confirm, cancels on cancel
  - Empty state displayed when no expenses
  - Stat card shows formatted total and count (or NO_ENTRIES)
  - Currency formatted with `Intl.NumberFormat('de-DE')`
  - LeftSidebar rendered as sibling with correct props
  - Responsive: `pb-16 md:pb-0` for bottom tab bar padding on mobile

#### TASK-007: Register Expenses Route in Main Router

- **Description**: Add the `/expenses` route to the application router in `main.tsx`.
- **Files**: `src/main.tsx` (modify)
- **Instructions**:
  1. Add import: `import ExpensesView from './pages/ExpensesView.tsx'`
  2. Add a new `<Route>` element inside the `<Route element={<App />}>` block, as a sibling to the `seating-plan` and `settings` routes:
     ```tsx
     <Route path="expenses" element={<ExpensesView />} />
     ```
  3. Place it after the `seating-plan` route and before the `settings` route (logical grouping)
- **Project context**:
  - Framework: React 19, react-router ^7.14.0 (BrowserRouter, declarative Routes)
  - Conventions: Each top-level route is a direct child of `<Route element={<App />}>`. Import includes `.tsx` extension
  - Reference: Existing routes in `src/main.tsx` lines 23-32
- **Dependencies**: TASK-006
- **Acceptance criteria**: Navigating to `/expenses` renders the `ExpensesView` component. The route is nested under the `App` layout route so `TopNav` and `BottomTabBar` are rendered.

### Execution Order

#### Parallel Group 1 (no dependencies)

- TASK-001, TASK-004, TASK-005

#### Parallel Group 2 (depends on TASK-001)

- TASK-002 (after TASK-001)
- TASK-003 (after TASK-001)

#### Parallel Group 3 (depends on TASK-002)

- TASK-006 (after TASK-001, TASK-002)

#### Parallel Group 4 (depends on TASK-006)

- TASK-007 (after TASK-006)

### Verification Checklist

- [x] All requirements from the spec are covered
  - AC-1 (page route): TASK-006, TASK-007
  - AC-2 (sidebar active): TASK-004
  - AC-3 (sidebar nav item): TASK-004
  - AC-4 (sidebar active style): TASK-004
  - AC-5 (sidebar click): TASK-004
  - AC-6 (sidebar excludes expenses from guest list active): TASK-004
  - AC-7 (mobile tab): TASK-005
  - AC-8 (mobile tab click): TASK-005
  - AC-9 (mobile tab active): TASK-005
  - AC-10 (empty localStorage): TASK-006
  - AC-11 (persistence): TASK-002, TASK-006
  - AC-12 (add expense): TASK-006
  - AC-13 (validate empty description): TASK-006
  - AC-14 (validate empty/zero amount): TASK-006
  - AC-15 (validate negative amount): TASK-006
  - AC-16 (form reset + total update): TASK-006
  - AC-17 (edit pre-populated): TASK-006
  - AC-18 (save edit): TASK-006
  - AC-19 (cancel edit): TASK-006
  - AC-20 (edit validation): TASK-006
  - AC-21 (delete confirmation): TASK-006
  - AC-22 (cancel delete): TASK-006
  - AC-23 (confirm delete): TASK-006
  - AC-24 (total stat card): TASK-006
  - AC-25 (empty stat card): TASK-006
  - AC-26 (export includes expenses): TASK-003
  - AC-27 (import with expenses): TASK-003
  - AC-28 (import without expenses): TASK-003
  - AC-29 (delete clears expenses): TASK-003
  - AC-30 (desktop layout): TASK-006
  - AC-31 (mobile layout): TASK-006
- [x] No task modifies files outside its scope
- [x] Dependencies are correctly mapped
- [x] Each task has clear acceptance criteria
- [x] No two tasks modify the same files (scope isolation)
- [x] Parallel groups are correctly identified
- [x] Every task includes relevant project context from `generated/codebase-context.md`

## Notes

- The `uuid` package is already installed (used by `guest-store.ts`)
- The `createStorage` utility at `src/data/storage-utils.ts` is reused for the expenses localStorage abstraction
- The `ConfirmDialog` molecule at `src/components/molecules/ConfirmDialog.tsx` is reused for delete confirmation
- The `StatCard` atom at `src/components/atoms/StatCard.tsx` is reused for the total stat card
- `react-hook-form` is already installed (used by guest forms)
- Currency formatting follows the same pattern as the TOTAL GIFTS card (`Intl.NumberFormat('de-DE')`)
- The `LeftSidebar` active state logic must be updated to exclude `/expenses` from the "Listado de invitados" active check (same pattern used when `/settings` was added)
- The `BottomTabBar` active state for "GUESTS" must be updated to exclude `/expenses` (same pattern used for `/settings`)

## Changelog

- 2026-04-11: Initial draft
- 2026-04-12: Technical plan added by TPM
- 2026-04-12: Implementation completed — 7 tasks across 4 parallel groups, all 31 ACs met, validation APPROVED (0 critical, 0 major, 2 minor)
