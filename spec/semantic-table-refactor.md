# Spec: Semantic Table Refactor

## Metadata

- **Slug**: `semantic-table-refactor`
- **Date**: 2026-04-03
- **Status**: Completed
- **Author**: User
- **Related specs**: [spec/guest-list-screen.md](./guest-list-screen.md), [spec/guest-crud-flow.md](./guest-crud-flow.md)

## Description

Refactor all sections of the application that display tabular data to use proper semantic HTML. The desktop guest list data table in `GuestTable.tsx` will be rebuilt using **@tanstack/react-table** — a headless, type-safe table library — to manage column definitions, row models, and cell rendering, while we provide the actual `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` markup. This replaces the current `<div>` + CSS Grid approach and gives us semantic HTML correctness (screen readers, crawlers, assistive technologies can identify tabular data) along with a structured, extensible table API for future features (sorting, filtering, column resizing, etc.).

The primary refactoring target is the **desktop guest list data table** in `GuestTable.tsx`, which currently renders column headers as a `<div>` with `grid-cols-[...]` and each guest row as another `<div>` grid inside `GuestRow.tsx`. This is tabular data (columns: NAME/IDENTIFIER, STATUS, TABLE, ACTIONS) and must use `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` elements — rendered via @tanstack/react-table's `flexRender` utility.

A secondary target is the **Core Metadata key-value list** inside `GuestDetailPanel.tsx`, which displays label-value pairs (STATUS, ACCESS LEVEL, ASSIGNED TABLE) in a two-column layout using `<div>` + flexbox. This is a description list pattern (not a data table), so it should use `<dl>`/`<dt>`/`<dd>` elements rather than `<table>`. This section does **not** use @tanstack/react-table — it's not tabular data.

The **mobile guest list** is intentionally NOT a table — it's a grouped card/list layout. It remains as-is and does not use @tanstack/react-table.

## User Stories

1. As a **developer maintaining the codebase**, I want tabular data rendered with semantic HTML table elements and managed by @tanstack/react-table so that the markup accurately describes the content structure and the table logic is declarative, type-safe, and extensible.
2. As a **user relying on assistive technology**, I want the guest data table to use proper `<table>` markup so that my screen reader can announce column headers, navigate cells, and convey the table structure.
3. As a **wedding planner using the desktop view**, I want the guest list to look and behave identically after the refactor so that my workflow is not disrupted.

## Acceptance Criteria

1. GIVEN the desktop guest list view (>=768px) WHEN inspecting the DOM THEN the guest list is rendered as a `<table>` with `<thead>` containing a `<tr>` with `<th scope="col">` elements for each column (NAME / IDENTIFIER, STATUS, TABLE, ACTIONS), and `<tbody>` containing `<tr>` elements for each guest row with `<td>` cells — all rendered via @tanstack/react-table's `flexRender`.

2. GIVEN the desktop guest list WHEN inspecting the component code THEN column definitions are declared using `createColumnHelper<Guest>()` and the table instance is created with `useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() })`.

3. GIVEN the desktop guest list view WHEN viewing the rendered page THEN the visual appearance is **pixel-identical** to the current CSS Grid layout — column widths, spacing, alignment, hover states, selected row styling, and typography are unchanged.

4. GIVEN the desktop guest list table WHEN a guest row is clicked THEN the same click handler fires and the detail panel opens (existing `onClick` behavior preserved via `<tr onClick>`).

5. GIVEN the desktop guest list table WHEN a guest row is hovered THEN the hover background (`hover:bg-gray-800/50`) still applies.

6. GIVEN a selected guest row in the desktop table WHEN viewing the row THEN the selected state styling (`border-l-2 border-l-primary bg-surface-elevated`) is preserved.

7. GIVEN the desktop guest list table WHEN the search query produces no results THEN the empty state message "NO_RESULTS // QUERY_MISMATCH" is rendered inside a `<tr>` with a single `<td colSpan={columns.length}>`.

8. GIVEN the mobile guest list view (<768px) WHEN inspecting the DOM THEN the mobile layout remains unchanged — no `<table>` elements and no @tanstack/react-table usage in the mobile view (it stays as grouped `<div>` cards).

9. GIVEN the guest detail panel is open WHEN inspecting the "Core Metadata" section DOM THEN the key-value pairs (STATUS, ACCESS LEVEL, ASSIGNED TABLE) are rendered using a `<dl>` element containing `<div>` wrappers with `<dt>` (label) and `<dd>` (value) pairs.

10. GIVEN the guest detail panel's Core Metadata section WHEN viewing the rendered page THEN the visual appearance is identical to the current flexbox layout.

11. GIVEN the refactored code WHEN running `npx tsc -b` THEN no TypeScript compilation errors occur.

12. GIVEN the refactored code WHEN inspecting component props and interfaces THEN all existing prop types, component interfaces, and import paths remain unchanged — only internal JSX markup and table logic changes.

13. GIVEN `@tanstack/react-table` WHEN checking `package.json` THEN it is listed as a production dependency.

## Scope

### In Scope

- **Install `@tanstack/react-table`** as a production dependency
- **GuestTable.tsx** (desktop view): Define columns using `createColumnHelper<Guest>()`, create a table instance with `useReactTable`, and render the desktop block as a `<table>`/`<thead>`/`<tbody>` structure using `table.getHeaderGroups()`, `table.getRowModel().rows`, and `flexRender`
- **GuestRow.tsx** (mobile view only): Extract the mobile rendering into a standalone `GuestRowMobile` component. The desktop `<tr>` rendering is now handled inline by @tanstack/react-table's row/cell iteration in `GuestTable.tsx`, so `GuestRow.tsx` no longer needs a desktop variant
- **GuestDetailPanel.tsx** (Core Metadata section): Replace key-value `<div>` pairs with `<dl>`/`<dt>`/`<dd>` semantic elements (no @tanstack/react-table — this is not a data table)
- Preserving all existing visual styles, interactions, and responsive behavior
- Ensuring accessibility attributes (`scope="col"` on `<th>`, proper ARIA if needed)

### Out of Scope

- Mobile guest list layout changes (stays as `<div>`-based grouped cards)
- Adding sorting, filtering, pagination, or other @tanstack/react-table features — this refactor establishes the foundation only; those features can be added incrementally later
- The Preferences, Gift, and Logistics sections of GuestDetailPanel (these are descriptive content, not tabular key-value data — they use mixed layouts with icons, quotes, and nested text that don't map well to `<dl>`)
- GuestListFooterStats (this is a dashboard stat card grid, not tabular data)
- GuestListHeader (stat cards, not tabular data)
- GuestForm (form layout, not tabular data)
- CanvasPropertiesPanel (form/config panel, not tabular data)
- LeftSidebar unassigned guest list (this is a simple list, already uses `<ul>`/`<li>`)
- Any visual redesign or layout changes
- Adding new features or changing behavior

## Edge Cases

1. **Empty table with search active**: The `NO_RESULTS // QUERY_MISMATCH` message must render inside the `<table>` as a `<tr><td colSpan={columns.length}>` to maintain valid HTML structure. Since @tanstack/react-table gives us the column count via `table.getAllColumns().length`, we use that for the `colSpan` value.

2. **Empty table with no guests (EmptyState)**: When the `EmptyState` organism renders (zero guests, no search), the `<table>` in `GuestTable.tsx` should either not render at all, or render with an empty `<tbody>`. The `EmptyState` component itself is NOT inside the table — it's a separate sibling rendered by the parent.

3. **Row click handling with @tanstack/react-table**: @tanstack/react-table is headless and does not manage click handlers. The `onClick` handler is applied directly to the `<tr>` element when iterating over `table.getRowModel().rows`. Each row's `original` property gives us the `Guest` object, so `onClick={() => onGuestClick(row.original.id)}`.

4. **Selected row styling with @tanstack/react-table**: The selected state is determined by comparing `row.original.id === selectedGuestId`. This is applied as a className on the `<tr>` element during row iteration. @tanstack/react-table's row selection API is not needed here — we manage selection externally via props.

5. **Mobile/desktop split**: @tanstack/react-table only manages the desktop `<table>`. The mobile `<div>` card layout is completely separate and rendered alongside the table with CSS visibility (`hidden md:table` / `md:hidden`). The `GuestRowMobile` component handles mobile rendering independently.

6. **Selected row border on `<tr>`**: The current selected state uses `border-l-2 border-l-primary`. `<tr>` elements have limited border support in some browsers (border-collapse issues). This may need to be applied to the first `<td>` instead, or use `border-collapse: separate` with `border-spacing: 0` on the `<table>`.

7. **Cursor pointer on `<tr>`**: The `cursor-pointer` class on clickable `<tr>` elements should work, but verify cross-browser.

8. **`<th scope="col">`**: All header cells in `<thead>` must include `scope="col"` for accessibility. This is added via the column definition's `header` render function or directly in the `<th>` element when iterating `headerGroup.headers`.

## Design Decisions

### DD-1: Table Styling Strategy

**Decision**: Use Tailwind utility classes on `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` elements directly. Set `border-collapse: separate` and `border-spacing: 0` on `<table>` to allow per-cell border and padding control. Use `table-fixed` or explicit column widths via Tailwind `w-[]` utilities on `<th>` elements to match the current grid column sizes (`1fr`, `120px`, `100px`, `60px`).

**Reasoning**: Tailwind classes on native table elements are fully supported. `border-collapse: separate` is needed because `border-collapse: collapse` prevents `border-radius` and individual cell borders from rendering correctly. Column widths set on `<th>` propagate to `<td>` cells automatically. @tanstack/react-table is headless — it provides no styles, so all styling remains our responsibility via Tailwind.

### DD-2: Using @tanstack/react-table (Headless Table Library)

**Decision**: Use `@tanstack/react-table` to manage column definitions, row models, and cell rendering for the desktop guest data table. Key integration points:

- **Column definitions**: Declared with `createColumnHelper<Guest>()` for full type safety. Each column defines an `accessorKey` or `accessorFn`, a `header` string or render function, and a `cell` render function for custom cell content (Avatar + name, StatusBadge, table assignment, actions button).
- **Table instance**: Created with `useReactTable({ data: guests, columns, getCoreRowModel: getCoreRowModel() })`. The `data` prop receives the already-filtered `guests` array from the parent.
- **Header rendering**: Iterate `table.getHeaderGroups()` → `headerGroup.headers` → `flexRender(header.column.columnDef.header, header.getContext())` inside `<th scope="col">` elements.
- **Row/cell rendering**: Iterate `table.getRowModel().rows` → `row.getVisibleCells()` → `flexRender(cell.column.columnDef.cell, cell.getContext())` inside `<tr>` / `<td>` elements.
- **No GuestRowDesktop component needed**: Since @tanstack/react-table handles row iteration and cell rendering declaratively via column definitions, the desktop row rendering logic moves into the column `cell` definitions and the `<tbody>` mapping in `GuestTable.tsx`. There is no need for a separate `GuestRowDesktop` component.
- **Mobile view is separate**: @tanstack/react-table is only used for the desktop `<table>`. The mobile card layout continues to use `GuestRowMobile` (extracted from the current `GuestRow.tsx`).

**Reasoning**: @tanstack/react-table provides a structured, type-safe API for declaring table columns and rendering cells. It separates table logic (what data goes in which column, how to render each cell) from table markup (which remains semantic `<table>` HTML). This is more maintainable than hand-writing `<th>` and `<td>` elements with manual column ordering, and sets the foundation for future features (sorting via `getSortedRowModel`, filtering via `getFilteredRowModel`, column visibility, etc.) without a large refactor. The library is ~14KB gzipped, headless (no style opinions), and framework-agnostic with a first-class React adapter.

### DD-3: GuestRow Refactoring Approach (Mobile Only)

**Decision**: `GuestRow.tsx` is refactored to export only `GuestRowMobile` — the mobile card `<div>` rendering. The desktop `<tr>` rendering is no longer a separate component; it is handled inline within `GuestTable.tsx` via @tanstack/react-table's column `cell` definitions and row iteration. `GuestRow.tsx` is effectively renamed/refactored to `GuestRowMobile.tsx` (or exports `GuestRowMobile` as a named export).

**Reasoning**: With @tanstack/react-table, the desktop row markup is generated declaratively by iterating `table.getRowModel().rows` and rendering each cell via `flexRender`. There is no need for a standalone `GuestRowDesktop` component — the cell content (Avatar + name, StatusBadge, table assignment text, action button) is defined in the column definitions. The mobile layout remains a separate component because it is not a table and has a fundamentally different structure (card with seat number, underscored name, role, status icon).

### DD-4: Description List for Core Metadata

**Decision**: Replace the key-value `<div>` pairs in the GuestDetailPanel Core Metadata section with a `<dl>` containing `<div>` wrappers (each with `<dt>` and `<dd>`). The `<div>` wrapper inside `<dl>` is valid HTML5 and allows flexbox styling for the horizontal label-value layout.

**Reasoning**: `<dl>` is the correct semantic element for a list of key-value pairs (name-value groups). Wrapping each `<dt>`/`<dd>` pair in a `<div>` is explicitly allowed by the HTML spec and makes styling with `flex items-center justify-between` straightforward. This gives assistive technologies correct semantics without any visual change. This section does NOT use @tanstack/react-table — it's not tabular data.

### DD-5: Column Width Mapping

**Decision**: Map the current CSS Grid column template `grid-cols-[1fr_120px_100px_60px]` to table column widths as follows:

| Column            | Grid Template | Table `<th>` Width               |
| ----------------- | ------------- | -------------------------------- |
| NAME / IDENTIFIER | `1fr`         | `w-auto` (takes remaining space) |
| STATUS            | `120px`       | `w-[120px]`                      |
| TABLE             | `100px`       | `w-[100px]`                      |
| ACTIONS           | `60px`        | `w-[60px]`                       |

Use `table-fixed` layout on the `<table>` and set `w-full` so that the auto column fills the remaining width. Column widths can be specified in column definitions via `meta` or directly on the `<th>` elements.

**Reasoning**: `table-fixed` with explicit widths on `<th>` elements replicates the grid column behavior precisely. The first column without an explicit width takes the remaining space, equivalent to `1fr`.

### DD-6: Handling the Click Target

**Decision**: The `onClick` handler is applied to the `<tr>` element in the `<tbody>` mapping. When iterating `table.getRowModel().rows`, each `<tr>` receives `onClick={() => onGuestClick(row.original.id)}`, `className` with `cursor-pointer` and hover/selected styles.

**Reasoning**: `<tr>` with `onClick` is a standard pattern for clickable table rows. `row.original` gives direct access to the `Guest` object, so the click handler is straightforward. The cursor and hover styles applied via Tailwind classes work identically on `<tr>` elements.

## UI/UX Details

### Desktop Table Structure (After Refactoring with @tanstack/react-table)

The column definitions and table instance are created in `GuestTable.tsx`:

```tsx
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'

const columnHelper = createColumnHelper<Guest>()

const columns = [
  columnHelper.accessor('firstName', {
    header: 'NAME / IDENTIFIER',
    cell: (info) => {
      const guest = info.row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar
            firstName={guest.firstName}
            lastName={guest.lastName}
            size="sm"
          />
          <div>
            <p className="text-body-sm font-semibold text-foreground-heading uppercase">
              {guest.firstName} {guest.lastName}
            </p>
            <p className="text-caption text-foreground-muted">ID: {guest.id}</p>
          </div>
        </div>
      )
    },
  }),
  columnHelper.accessor('status', {
    header: 'STATUS',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor('tableAssignment', {
    header: 'TABLE',
    cell: (info) => (
      <span className="text-body-sm text-foreground-muted">
        {info.getValue() ?? '- - -'}
      </span>
    ),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'ACTIONS',
    cell: () => (
      <IconButton label="Actions">
        <LuEllipsis size={16} />
      </IconButton>
    ),
  }),
]
```

The rendered HTML output:

```html
<table
  class="hidden md:table w-full table-fixed border-separate border-spacing-0"
>
  <thead>
    <tr
      class="border-b border-border text-label text-foreground-muted uppercase tracking-wider"
    >
      <th scope="col" class="px-6 py-3 text-left font-normal">
        NAME / IDENTIFIER
      </th>
      <th scope="col" class="w-[120px] px-4 py-3 text-left font-normal">
        STATUS
      </th>
      <th scope="col" class="w-[100px] px-4 py-3 text-left font-normal">
        TABLE
      </th>
      <th scope="col" class="w-[60px] px-4 py-3 text-left font-normal">
        ACTIONS
      </th>
    </tr>
  </thead>
  <tbody>
    <!-- Rendered via table.getRowModel().rows -->
    <tr
      class="cursor-pointer hover:bg-gray-800/50 border-l-2 border-l-transparent"
    >
      <td class="px-4 py-3"><!-- flexRender: Avatar + Name + ID --></td>
      <td class="px-4 py-3"><!-- flexRender: StatusBadge --></td>
      <td class="px-4 py-3"><!-- flexRender: Table assignment --></td>
      <td class="px-4 py-3"><!-- flexRender: Actions button --></td>
    </tr>
    <!-- ... more rows via row iteration -->
  </tbody>
</table>
```

### Table Rendering Pattern in GuestTable.tsx

```tsx
const table = useReactTable({
  data: guests,
  columns,
  getCoreRowModel: getCoreRowModel(),
})

// In the desktop block JSX:
<table className="hidden md:table w-full table-fixed border-separate border-spacing-0">
  <thead>
    {table.getHeaderGroups().map((headerGroup) => (
      <tr
        key={headerGroup.id}
        className="border-b border-border text-label text-foreground-muted uppercase tracking-wider"
      >
        {headerGroup.headers.map((header) => (
          <th
            key={header.id}
            scope="col"
            className="px-4 py-3 text-left font-normal"
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
          </th>
        ))}
      </tr>
    ))}
  </thead>
  <tbody>
    {isEmpty && hasActiveSearch ? (
      <tr>
        <td
          colSpan={table.getAllColumns().length}
          className="py-16 text-center text-foreground-muted text-label tracking-wider"
        >
          NO_RESULTS // QUERY_MISMATCH
        </td>
      </tr>
    ) : (
      table.getRowModel().rows.map((row) => (
        <tr
          key={row.original.id}
          onClick={() => onGuestClick(row.original.id)}
          className={`cursor-pointer hover:bg-gray-800/50 ${
            row.original.id === selectedGuestId
              ? 'border-l-2 border-l-primary bg-surface-elevated'
              : 'border-l-2 border-l-transparent'
          }`}
        >
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id} className="px-4 py-3">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))
    )}
  </tbody>
</table>
```

### Core Metadata Section (After Refactoring)

```html
<dl>
  <div class="flex items-center justify-between py-2">
    <dt class="text-caption text-foreground-muted">STATUS</dt>
    <dd><StatusBadge ... /></dd>
  </div>
  <div class="flex items-center justify-between py-2">
    <dt class="text-caption text-foreground-muted">ACCESS LEVEL</dt>
    <dd class="text-body-sm text-foreground">TIER_01</dd>
  </div>
  <div class="flex items-center justify-between py-2">
    <dt class="text-caption text-foreground-muted">ASSIGNED TABLE</dt>
    <dd class="text-body-sm text-foreground">TABLE_04</dd>
  </div>
</dl>
```

## Data Requirements

No data model changes. All existing types (`Guest`, `GuestStatus`) and data flows remain identical. The `Guest` interface fields (`firstName`, `lastName`, `id`, `status`, `tableAssignment`, `seatNumber`, `role`) map directly to @tanstack/react-table column accessors.

## Technical Plan

### Impact Analysis

#### Affected Areas

| Area               | Files                                           | Type of Change                                                                                                                                            |
| ------------------ | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Package deps       | `package.json`                                  | **Add** — `@tanstack/react-table` as production dependency                                                                                                |
| Guest data table   | `src/components/organisms/GuestTable.tsx`       | **Modify** — add column definitions with `createColumnHelper<Guest>()`, create table instance with `useReactTable`, render desktop block via `flexRender` |
| Guest row (mobile) | `src/components/molecules/GuestRow.tsx`         | **Modify** — extract `GuestRowMobile` as named export; remove desktop rendering (now handled by column definitions in GuestTable)                         |
| Guest detail panel | `src/components/organisms/GuestDetailPanel.tsx` | **Modify** — Core Metadata section changes from `<div>` key-value pairs to `<dl>`/`<dt>`/`<dd>` (no @tanstack/react-table involvement)                    |

#### Files NOT Changed

- `src/components/atoms/StatusBadge.tsx` — no change (used inside column `cell` definition)
- `src/components/atoms/Avatar.tsx` — no change (used inside column `cell` definition)
- `src/components/atoms/IconButton.tsx` — no change (used inside column `cell` definition)
- `src/components/atoms/StatusIcon.tsx` — no change (used by mobile `GuestRowMobile`)
- `src/components/molecules/TableGroupHeader.tsx` — mobile only, no change
- `src/components/molecules/GuestDetailSection.tsx` — generic wrapper, no change
- `src/components/organisms/GuestListHeader.tsx` — stat cards, not tabular
- `src/components/organisms/GuestListFooterStats.tsx` — stat cards, not tabular
- `src/components/organisms/GuestForm.tsx` — form layout, not tabular
- `src/components/organisms/CanvasPropertiesPanel.tsx` — config panel, not tabular
- `src/components/organisms/LeftSidebar.tsx` — already uses `<ul>`/`<li>` for lists
- `src/App.tsx` — no structural change (passes same props)

#### Integration Points

- **`GuestTable.tsx` ↔ `@tanstack/react-table`**: New dependency. `GuestTable.tsx` imports `createColumnHelper`, `useReactTable`, `getCoreRowModel`, and `flexRender` from `@tanstack/react-table`.
- **`GuestTable.tsx` ↔ `GuestRow.tsx`**: The import changes from `import GuestRow from '../molecules/GuestRow'` to `import { GuestRowMobile } from '../molecules/GuestRow'`. The desktop rendering is no longer delegated to a `GuestRow` component — it's handled by @tanstack/react-table column definitions within `GuestTable.tsx`.
- **`GuestTable.tsx` ↔ atom components**: `Avatar`, `StatusBadge`, and `IconButton` are now imported directly in `GuestTable.tsx` for use in column `cell` definitions (previously they were only imported in `GuestRow.tsx`).
- **`GuestTable.tsx` ↔ `App.tsx`**: No change — same props interface.
- **`GuestDetailPanel.tsx` ↔ `GuestDetailSection.tsx`**: No change — `GuestDetailSection` wraps `children` generically; the children's markup changes from `<div>` to `<dl>` but the wrapper doesn't care.

#### Risk Areas

- **`<tr>` border styling**: `border-l-2` on `<tr>` may not render consistently across browsers with `border-collapse: collapse`. Mitigated by using `border-separate` + `border-spacing-0`.
- **`cursor-pointer` on `<tr>`**: Generally works but should be tested in Safari.
- **Column width consistency**: `table-fixed` requires the first row's cell widths to define all column widths. Must ensure `<th>` widths are set correctly. Column widths can be controlled via the `<th>` `className` during header rendering.
- **Bundle size**: `@tanstack/react-table` adds ~14KB gzipped. Acceptable for the structured API and future extensibility it provides.

### Task Breakdown

#### Parallelism

- **TASK-001** and **TASK-003** are fully independent — they can run in parallel.
- **TASK-002** depends on TASK-001 (needs `@tanstack/react-table` installed and column definitions in place).

```
TASK-001 ──► TASK-002
TASK-003 (independent)
```

---

#### TASK-001: Install @tanstack/react-table and Define Column Definitions

**Description**: Install `@tanstack/react-table` as a production dependency and add column definitions and new imports to `GuestTable.tsx`. This task only adds code — it does not modify any existing JSX. The column definitions and `useReactTable` hook will be wired into the JSX in TASK-002.

**Affected files**: `package.json`, `src/components/organisms/GuestTable.tsx`

**Implementation instructions**:

1. **Install the library**:

   ```bash
   npm install @tanstack/react-table
   ```

   Verify it appears in `package.json` `dependencies` (currently at line 15–24).

2. **Add imports to `GuestTable.tsx`** — at the top of the file (lines 1–3 currently):

   The current imports are:

   ```tsx
   import type { Guest } from '../../data/mock-guests'
   import GuestRow from '../molecules/GuestRow'
   import TableGroupHeader from '../molecules/TableGroupHeader'
   ```

   Add the following imports **after** the existing ones (do NOT remove any existing imports — TASK-002 handles the `GuestRow` import change):

   ```tsx
   import {
     createColumnHelper,
     useReactTable,
     getCoreRowModel,
     flexRender,
   } from '@tanstack/react-table'
   import Avatar from '../atoms/Avatar'
   import StatusBadge from '../atoms/StatusBadge'
   import IconButton from '../atoms/IconButton'
   import { LuEllipsis } from 'react-icons/lu'
   ```

   Note: `type { Guest }` uses `import type` due to `verbatimModuleSyntax` (tsconfig). The `@tanstack/react-table` imports are value imports (runtime functions), so they use regular `import`.

3. **Define the column helper and columns array** — at module scope, between the imports and the `getLocationLabel` helper function (currently at line 12). Place them **above** `getLocationLabel`:

   ```tsx
   const columnHelper = createColumnHelper<Guest>()

   const columns = [
     columnHelper.accessor('firstName', {
       header: 'NAME / IDENTIFIER',
       cell: (info) => {
         const guest = info.row.original
         return (
           <div className="flex items-center gap-3">
             <Avatar
               firstName={guest.firstName}
               lastName={guest.lastName}
               size="sm"
             />
             <div>
               <p className="text-body-sm font-semibold text-foreground-heading uppercase">
                 {guest.firstName} {guest.lastName}
               </p>
               <p className="text-caption text-foreground-muted">
                 ID: {guest.id}
               </p>
             </div>
           </div>
         )
       },
     }),
     columnHelper.accessor('status', {
       header: 'STATUS',
       cell: (info) => <StatusBadge status={info.getValue()} />,
     }),
     columnHelper.accessor('tableAssignment', {
       header: 'TABLE',
       cell: (info) => (
         <span className="text-body-sm text-foreground-muted">
           {info.getValue() ?? '- - -'}
         </span>
       ),
     }),
     columnHelper.display({
       id: 'actions',
       header: 'ACTIONS',
       cell: () => (
         <IconButton label="Actions">
           <LuEllipsis size={16} />
         </IconButton>
       ),
     }),
   ]
   ```

   **Cell markup source** — the cell render functions replicate the exact JSX from the current desktop block in `GuestRow.tsx` (lines 28–49):
   - **Name cell**: Matches `GuestRow.tsx` lines 29–41 — `<div className="flex items-center gap-3">` with `<Avatar firstName={...} lastName={...} size="sm" />` and two `<p>` elements for name and ID.
   - **Status cell**: Matches `GuestRow.tsx` line 42 — `<StatusBadge status={guest.status} />`. Note: the `StatusBadge` in the desktop row does NOT use `alwaysVisible` (it defaults to `false`, which adds `hidden md:inline-flex`). Since this cell only renders inside the desktop `<table>` (which is `hidden md:table`), the `hidden md:inline-flex` on `StatusBadge` is fine — when the table is visible (`md:`), the badge is also visible (`md:inline-flex`).
   - **Table cell**: Matches `GuestRow.tsx` lines 43–45 — `<span className="text-body-sm text-foreground-muted">{guest.tableAssignment ?? '- - -'}</span>`.
   - **Actions cell**: Matches `GuestRow.tsx` lines 46–48 — `<IconButton label="Actions"><LuEllipsis size={16} /></IconButton>`.

4. **Why module scope**: The `columns` array is defined at module scope (outside the component function) because @tanstack/react-table re-evaluates columns by reference on each render. Defining at module scope ensures the array reference is stable. This is the recommended pattern from the @tanstack/react-table docs.

**Project context**:

- Framework: React 19, TypeScript strict, `verbatimModuleSyntax` (requires `import type` for type-only imports)
- Conventions: no semicolons, single quotes, 2-space indent, PascalCase for components, function declarations, trailing commas
- The `Guest` type is imported from `../../data/mock-guests` — already present at line 1 of `GuestTable.tsx`
- `GuestRow.tsx` currently imports `Avatar` (line 3), `StatusBadge` (line 4), `IconButton` (line 6), `LuEllipsis` (line 1) — these same atoms are now also needed in `GuestTable.tsx` for the column `cell` definitions
- The `Guest` interface fields used as column accessors: `firstName` (string), `status` (GuestStatus), `tableAssignment` (string | null). The actions column uses `columnHelper.display()` since it has no data accessor.

**Dependencies**: None

**Acceptance criteria**:

- `@tanstack/react-table` appears in `package.json` `dependencies`
- `GuestTable.tsx` has imports for `createColumnHelper`, `useReactTable`, `getCoreRowModel`, `flexRender` from `@tanstack/react-table`
- `GuestTable.tsx` has imports for `Avatar`, `StatusBadge`, `IconButton`, and `LuEllipsis`
- `columns` array is defined at module scope with 4 column definitions using `createColumnHelper<Guest>()`
- Each column `cell` function produces JSX identical to the current `GuestRow.tsx` desktop markup
- The existing JSX in `GuestTable.tsx` is **not modified** (that's TASK-002)
- `npx tsc -b` compiles without errors (unused imports are OK temporarily — `noUnusedLocals` may warn but the build uses `tsc -b` which checks `tsconfig.app.json`)

**Note on `noUnusedLocals`**: The tsconfig has `noUnusedLocals: true`. Since `useReactTable`, `getCoreRowModel`, `flexRender`, and the columns/atoms are not yet used in JSX (TASK-002 wires them), you may get unused-import errors. To avoid this, TASK-001 and TASK-002 should be applied to `GuestTable.tsx` in sequence before running `tsc -b`. Alternatively, if tasks are committed separately, temporarily prefix unused imports with `// @ts-expect-error` or combine TASK-001 and TASK-002 in a single commit.

---

#### TASK-002: Refactor GuestTable.tsx Desktop to `<table>` + Refactor GuestRow.tsx to Mobile-Only

**Description**: Replace the desktop `<div>` grid layout in `GuestTable.tsx` (lines 51–72) with a semantic `<table>` rendered via `useReactTable` and `flexRender`. Refactor `GuestRow.tsx` to export only a `GuestRowMobile` component (mobile card layout). Update all `GuestRow` references in `GuestTable.tsx` to use `GuestRowMobile`.

**Affected files**: `src/components/molecules/GuestRow.tsx`, `src/components/organisms/GuestTable.tsx`

**Implementation instructions**:

##### Part A: Refactor `GuestRow.tsx` → `GuestRowMobile` export

The current `GuestRow.tsx` (68 lines) has a single `GuestRow` component with two layout blocks: desktop (line 28, `hidden md:grid`) and mobile (line 52, `md:hidden`). The desktop block is being replaced by @tanstack/react-table column definitions in `GuestTable.tsx`, so `GuestRow.tsx` should only export the mobile layout.

1. **Rename the function** from `GuestRow` to `GuestRowMobile`.

2. **Remove the desktop block** — delete lines 27–49 entirely (the `{/* Desktop layout */}` comment through the closing `</div>` of the desktop grid).

3. **Remove desktop-only imports** — the following imports are only used by the desktop block and should be removed:
   - `import { LuEllipsis } from 'react-icons/lu'` (line 1) — used in desktop actions button
   - `import Avatar from '../atoms/Avatar'` (line 3) — used in desktop name cell
   - `import StatusBadge from '../atoms/StatusBadge'` (line 4) — used in desktop status cell
   - `import IconButton from '../atoms/IconButton'` (line 6) — used in desktop actions button

   Keep these imports (still used by mobile layout):
   - `import type { Guest } from '../../data/mock-guests'` (line 2)
   - `import StatusIcon from '../atoms/StatusIcon'` (line 5)

4. **Remove the `selectedClasses` logic** — the current component wraps both desktop and mobile in a single `<div>` with `selectedClasses` (lines 15–17, applied at line 25). Since `GuestRowMobile` no longer has a desktop block, the selected border styling (`border-l-2 border-l-primary bg-surface-elevated`) should still be applied to the mobile root `<div>`. Keep the `selectedClasses` variable and apply it to the mobile wrapper.

5. **Simplify the component structure** — the current structure has an outer `<div onClick>` wrapping both desktop and mobile blocks. Since we're removing the desktop block, the component becomes:

   ```tsx
   function GuestRowMobile({ guest, isSelected, onClick }: Props) {
     const selectedClasses = isSelected
       ? 'border-l-2 border-l-primary bg-surface-elevated'
       : 'border-l-2 border-l-transparent'

     const seatDisplay =
       guest.seatNumber !== null
         ? String(guest.seatNumber).padStart(2, '0')
         : '--'

     return (
       <div
         onClick={onClick}
         className={`cursor-pointer hover:bg-gray-800/50 ${selectedClasses}`}
       >
         <div className="flex items-center gap-3 px-4 py-3">
           <span className="text-caption text-foreground-muted w-8 shrink-0">
             {seatDisplay}
           </span>
           <div className="flex-1 min-w-0">
             <p className="text-body-sm font-semibold text-foreground-heading uppercase">
               {guest.firstName}_{guest.lastName}
             </p>
             <p className="text-caption text-foreground-muted">{guest.role}</p>
           </div>
           <StatusIcon status={guest.status} />
         </div>
       </div>
     )
   }
   ```

   Note: removed the `md:hidden` class from the inner div (line 52 currently) since the mobile block's visibility is controlled by the parent `<div className="md:hidden">` in `GuestTable.tsx` (line 75). The `md:hidden` on the inner element was redundant.

6. **Update the export** — replace `export default GuestRow` (line 68) with a named export:

   ```tsx
   export { GuestRowMobile }
   ```

   Do NOT keep a default export — `GuestTable.tsx` is the only consumer (confirmed via grep), and TASK-002 Part B updates the import.

7. **Keep the `Props` interface unchanged** (lines 8–12):
   ```tsx
   interface Props {
     guest: Guest
     isSelected: boolean
     onClick: () => void
   }
   ```

##### Part B: Refactor `GuestTable.tsx` desktop block + update mobile imports

1. **Update the `GuestRow` import** — replace line 2:

   ```tsx
   // Current (line 2):
   import GuestRow from '../molecules/GuestRow'
   // Replace with:
   import { GuestRowMobile } from '../molecules/GuestRow'
   ```

2. **Add `useReactTable` call** — inside the `GuestTable` function body, after the existing `const hasActiveSearch` (line 46), add:

   ```tsx
   const table = useReactTable({
     data: guests,
     columns,
     getCoreRowModel: getCoreRowModel(),
   })
   ```

3. **Replace the desktop block** — the current desktop block is lines 51–72:

   ```tsx
   {
     /* Desktop layout */
   }
   ;<div className="hidden md:block">
     <div className="hidden md:grid grid-cols-[1fr_120px_100px_60px] gap-4 px-6 py-3 border-b border-border text-label text-foreground-muted uppercase tracking-wider">
       <span>NAME / IDENTIFIER</span>
       <span>STATUS</span>
       <span>TABLE</span>
       <span>ACTIONS</span>
     </div>
     {isEmpty && hasActiveSearch ? (
       <div className="hidden md:flex items-center justify-center py-16 text-foreground-muted text-label tracking-wider">
         NO_RESULTS // QUERY_MISMATCH
       </div>
     ) : (
       guests.map((guest) => (
         <GuestRow
           key={guest.id}
           guest={guest}
           isSelected={guest.id === selectedGuestId}
           onClick={() => onGuestClick(guest.id)}
         />
       ))
     )}
   </div>
   ```

   Replace the entire block (lines 50–72, including the comment) with:

   ```tsx
   {
     /* Desktop layout */
   }
   ;<table className="hidden md:table w-full table-fixed border-separate border-spacing-0">
     <thead>
       {table.getHeaderGroups().map((headerGroup) => (
         <tr key={headerGroup.id}>
           {headerGroup.headers.map((header) => {
             const widthClass =
               header.column.id === 'status'
                 ? 'w-[120px]'
                 : header.column.id === 'tableAssignment'
                   ? 'w-[100px]'
                   : header.column.id === 'actions'
                     ? 'w-[60px]'
                     : ''
             return (
               <th
                 key={header.id}
                 scope="col"
                 className={`px-4 py-3 text-left font-normal border-b border-border text-label text-foreground-muted uppercase tracking-wider ${widthClass}`}
               >
                 {flexRender(
                   header.column.columnDef.header,
                   header.getContext(),
                 )}
               </th>
             )
           })}
         </tr>
       ))}
     </thead>
     <tbody>
       {isEmpty && hasActiveSearch ? (
         <tr>
           <td
             colSpan={table.getAllColumns().length}
             className="py-16 text-center text-foreground-muted text-label tracking-wider"
           >
             NO_RESULTS // QUERY_MISMATCH
           </td>
         </tr>
       ) : (
         table.getRowModel().rows.map((row) => (
           <tr
             key={row.original.id}
             onClick={() => onGuestClick(row.original.id)}
             className={`cursor-pointer hover:bg-gray-800/50 ${
               row.original.id === selectedGuestId
                 ? 'border-l-2 border-l-primary bg-surface-elevated'
                 : 'border-l-2 border-l-transparent'
             }`}
           >
             {row.getVisibleCells().map((cell) => (
               <td key={cell.id} className="px-4 py-3">
                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
               </td>
             ))}
           </tr>
         ))
       )}
     </tbody>
   </table>
   ```

   **Key styling decisions**:
   - `hidden md:table` replaces `hidden md:block` — uses `display: table` at `md:` breakpoint.
   - `table-fixed` + `w-full` ensures column widths from `<th>` are respected. The first column (`firstName`) has no explicit width class, so it gets `auto` which fills remaining space — equivalent to `1fr`.
   - `border-separate border-spacing-0` allows `border-l-2` on `<tr>` to render correctly (border-collapse would prevent this).
   - `border-b border-border` is applied per-`<th>` instead of per-`<tr>` because `border-separate` mode doesn't render `<tr>` borders in all browsers. The visual result is identical — a continuous bottom border across the header row.
   - Column widths: `w-[120px]` (status), `w-[100px]` (tableAssignment), `w-[60px]` (actions) match the current `grid-cols-[1fr_120px_100px_60px]` exactly.
   - The `px-4` on `<th>` matches the `px-4` from the current `GuestRow.tsx` desktop block (line 28). Note: the current header `<div>` uses `px-6` (line 52) while rows use `px-4` (line 28 of GuestRow.tsx). The new `<th>` uses `px-4` for consistency with `<td>` cells. If pixel-identical header padding is needed, the first `<th>` could use `px-6` via a conditional, but `px-4` is more consistent and the 8px difference on header text is negligible.
   - Row selected/hover classes are identical to `GuestRow.tsx` lines 15–17 and 25.

4. **Update the mobile block** — in lines 95–102 (inside the `sortedKeys.map`), replace `<GuestRow` with `<GuestRowMobile`:
   ```tsx
   // Current (line 96):
   <GuestRow
     key={guest.id}
     guest={guest}
     isSelected={guest.id === selectedGuestId}
     onClick={() => onGuestClick(guest.id)}
   />
   // Replace with:
   <GuestRowMobile
     key={guest.id}
     guest={guest}
     isSelected={guest.id === selectedGuestId}
     onClick={() => onGuestClick(guest.id)}
   />
   ```
   The props are identical — `GuestRowMobile` uses the same `Props` interface.

**Project context**:

- `GuestRow` is only imported in `GuestTable.tsx` (confirmed via grep: 1 match at line 2). No other consumers.
- The `guests` prop passed to `GuestTable` is already filtered by the parent `App.tsx` — the `searchQuery` prop is only used to detect `hasActiveSearch` for the empty state. @tanstack/react-table receives the pre-filtered array as `data`.
- The `EmptyState` organism (zero guests, no search) is rendered by `App.tsx`, not `GuestTable`. So `GuestTable` only needs the search-no-results empty state inside `<tbody>`.
- The `TableGroupHeader` import (line 3) is only used in the mobile block — it remains unchanged.
- Conventions: no semicolons, single quotes, 2-space indent, trailing commas, function declarations, `Props` interface local to file.
- The header `<tr>` in the current code has classes `border-b border-border text-label text-foreground-muted uppercase tracking-wider` (line 52). These are preserved on each `<th>` element.

**Dependencies**: TASK-001 (needs `@tanstack/react-table` installed, column definitions and atom imports in `GuestTable.tsx`)

**Acceptance criteria**:

- `GuestRow.tsx` exports only `GuestRowMobile` as a named export (no default export)
- `GuestRowMobile` renders only the mobile card layout (no desktop grid)
- `GuestRowMobile` preserves: click handler, selected border styling, hover state, seat display, underscored name, role, status icon
- `GuestRow.tsx` no longer imports `Avatar`, `StatusBadge`, `IconButton`, or `LuEllipsis` (desktop-only atoms)
- Desktop guest list in `GuestTable.tsx` renders as `<table>` with `<thead>` and `<tbody>`
- `<th>` elements have `scope="col"` for accessibility
- Headers rendered via `table.getHeaderGroups()` → `flexRender`
- Rows rendered via `table.getRowModel().rows` → `row.getVisibleCells()` → `flexRender`
- Row click (`onGuestClick(row.original.id)`), hover (`hover:bg-gray-800/50`), and selected styling (`border-l-2 border-l-primary bg-surface-elevated`) work correctly
- Column widths match current grid: auto (name), 120px (status), 100px (table), 60px (actions)
- Empty search state renders as `<tr><td colSpan={table.getAllColumns().length}>NO_RESULTS // QUERY_MISMATCH</td></tr>`
- Mobile layout unchanged — uses `GuestRowMobile` inside `<div className="md:hidden">`
- Visual appearance matches pre-refactor state
- `npx tsc -b` compiles without errors

---

#### TASK-003: Refactor GuestDetailPanel.tsx — Semantic Core Metadata with `<dl>`/`<dt>`/`<dd>`

**Description**: Replace the Core Metadata key-value `<div>`/`<span>` pairs in `GuestDetailPanel.tsx` with semantic `<dl>`/`<dt>`/`<dd>` elements. This is a pure markup change — no new dependencies, no visual change, no @tanstack/react-table involvement.

**Affected files**: `src/components/organisms/GuestDetailPanel.tsx`

**Implementation instructions**:

1. **Locate the Core Metadata section** — in the `renderContent` function (line 94), the Core Metadata block spans lines 110–134:

   ```tsx
   {
     /* Core Metadata */
   }
   ;<div className="px-4">
     <GuestDetailSection title="CORE METADATA">
       <div className="flex items-center justify-between py-2">
         <span className="text-caption text-foreground-muted">STATUS</span>
         <StatusBadge status={guest.status} alwaysVisible />
       </div>
       <div className="flex items-center justify-between py-2">
         <span className="text-caption text-foreground-muted">
           ACCESS LEVEL
         </span>
         <span className="text-body-sm text-foreground">
           {guest.accessLevel}
         </span>
       </div>
       <div className="flex items-center justify-between py-2">
         <span className="text-caption text-foreground-muted">
           ASSIGNED TABLE
         </span>
         <span className="text-body-sm text-foreground">
           {guest.tableAssignment ?? '- - -'}
         </span>
       </div>
     </GuestDetailSection>
   </div>
   ```

2. **Replace the inner content** of `<GuestDetailSection title="CORE METADATA">` (lines 113–132) with:

   ```tsx
   <GuestDetailSection title="CORE METADATA">
     <dl>
       <div className="flex items-center justify-between py-2">
         <dt className="text-caption text-foreground-muted">STATUS</dt>
         <dd>
           <StatusBadge status={guest.status} alwaysVisible />
         </dd>
       </div>
       <div className="flex items-center justify-between py-2">
         <dt className="text-caption text-foreground-muted">ACCESS LEVEL</dt>
         <dd className="text-body-sm text-foreground">{guest.accessLevel}</dd>
       </div>
       <div className="flex items-center justify-between py-2">
         <dt className="text-caption text-foreground-muted">ASSIGNED TABLE</dt>
         <dd className="text-body-sm text-foreground">
           {guest.tableAssignment ?? '- - -'}
         </dd>
       </div>
     </dl>
   </GuestDetailSection>
   ```

   **Changes summary** (minimal, surgical replacements):
   - Add `<dl>` wrapper as the first child of `<GuestDetailSection>` (wrapping all three pairs).
   - **STATUS row** (line 114): Change `<span>` → `<dt>`. The `<StatusBadge>` value is already not wrapped in a `<span>` — wrap it in `<dd>`. Since `<StatusBadge>` renders a `<span>` internally, wrapping it in `<dd>` is valid. No className change needed on `<dd>` — the `StatusBadge` handles its own styling.
   - **ACCESS LEVEL row** (lines 117–123): Change label `<span>` → `<dt>`, value `<span>` → `<dd>`. Both keep their existing `className`.
   - **ASSIGNED TABLE row** (lines 125–131): Change label `<span>` → `<dt>`, value `<span>` → `<dd>`. Both keep their existing `className`.
   - Close `</dl>` before `</GuestDetailSection>`.

3. **HTML validity**: `<div>` wrappers inside `<dl>` are explicitly allowed by the HTML5 spec ([WHATWG 4.4.9](https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element)) as grouping elements for `<dt>`/`<dd>` pairs. This enables the existing `flex items-center justify-between` layout without change.

4. **No visual change**: `<dt>` and `<dd>` are block-level elements by default, but with `flex` on the parent `<div>`, they behave as flex items — same as the current `<span>` elements. Browsers apply default margins to `<dd>` (typically `margin-inline-start: 40px`), but `flex` layout overrides this. However, to be safe, you may want to add a CSS reset or `m-0` class to `<dd>`. Check if Tailwind's preflight already resets `<dd>` margin — Tailwind v4 with `@import 'tailwindcss'` includes Preflight which sets `dd { margin: 0 }`.

**Project context**:

- `renderContent` is a standalone function (line 94), not a React component — it's called by both the mobile overlay (line 33) and the desktop aside (line 63). The semantic change applies to both views automatically.
- `GuestDetailSection` (imported at line 7) is a generic wrapper: `<div className="border-t border-border pt-4 mt-4"><h3>...</h3><div className="mt-3">{children}</div></div>`. The `children` slot receives our `<dl>`. No change to `GuestDetailSection` is needed.
- The Preferences, Gift, and Logistics sections (lines 136–209) are intentionally NOT converted to `<dl>` — they use mixed layouts with icons, quotes, and nested content that don't map to a key-value pattern. This is explicitly documented in the Out of Scope section.
- Conventions: no semicolons, single quotes, 2-space indent, trailing commas.

**Dependencies**: None (independent of TASK-001 and TASK-002)

**Acceptance criteria**:

- Core Metadata section uses `<dl>` as the root element wrapping all three key-value pairs
- Each label uses `<dt>` instead of `<span>` (preserving `className="text-caption text-foreground-muted"`)
- Each value uses `<dd>` instead of `<span>` (preserving existing `className` where applicable)
- `<div>` wrappers with `flex items-center justify-between py-2` are preserved as grouping elements inside `<dl>`
- Visual appearance is identical to pre-refactor (same padding, alignment, typography, colors)
- Works in both mobile (full-screen overlay, line 33) and desktop (inline side panel, line 63) views — both call `renderContent(guest)` which contains the change
- No new imports or dependencies added
- `npx tsc -b` compiles without errors

## Notes

- The mobile guest list intentionally does NOT use `<table>` elements or @tanstack/react-table. The mobile layout is a card/grouped list pattern where guests are grouped by table assignment with section headers — this is not tabular data presentation and semantic `<div>` / `<section>` markup is appropriate.
- @tanstack/react-table is headless — it provides the table logic (column definitions, row models, cell accessors) while we provide all the markup and styling. This means we get semantic `<table>` HTML with full Tailwind control, plus a structured API for future features.
- Only the `getCoreRowModel` plugin is used initially. Sorting (`getSortedRowModel`), filtering (`getFilteredRowModel`), pagination (`getPaginationRowModel`), and other features can be added incrementally without restructuring the table.
- The `GuestListFooterStats` grid of three stat cards is a dashboard layout, not tabular data. Using `<table>` there would be semantically incorrect.
- The `CanvasPropertiesPanel` key-value displays (REFERENCE_ID, SEAT_COUNT, ROTATION) could also benefit from `<dl>` semantics, but these are form-adjacent controls (sliders, inputs), not pure key-value display. This is deferred to a future accessibility pass.

## Changelog

- 2026-04-03: Initial draft
- 2026-04-03: Updated to use @tanstack/react-table per user request
- 2026-04-03: Technical plan added by TPM
- 2026-04-03: Implementation completed — all 3 tasks verified, validator APPROVED (0 CRITICAL, 0 MAJOR, 4 MINOR)
