# Codebase Context Updates — Semantic Table Refactor

Updates to `generated/codebase-context.md` based on validated semantic table refactor implementation.

---

## Changes to Key Dependencies

Add to the dependencies table:

| Library               | Version | Purpose                                                                                  |
| --------------------- | ------- | ---------------------------------------------------------------------------------------- |
| @tanstack/react-table | ^8.21.3 | Headless, type-safe table library for column definitions, row models, and cell rendering |

## Changes to File Structure

Update `GuestRow.tsx` description:

```
├── GuestRow.tsx        (mobile-only compact row, named export GuestRowMobile)
```

## Changes to Code Conventions

Add:

- **Named exports for sub-components**: When a component is refactored to serve a narrower role (e.g., mobile-only), use a named export (`export { GuestRowMobile }`) instead of a default export. The consuming file imports with `{ GuestRowMobile }`.

## Changes to Architectural Patterns

Add under **Component patterns observed**:

- `@tanstack/react-table` for data tables: Column definitions declared at module scope with `createColumnHelper<T>()` for reference stability. Table instance created with `useReactTable` inside the component. Headers rendered via `table.getHeaderGroups()` → `flexRender`. Rows via `table.getRowModel().rows` → `row.getVisibleCells()` → `flexRender`. Desktop table uses `hidden md:table`, mobile card layout is a separate `<div className="md:hidden">` block.
- Description list pattern for key-value metadata: `<dl>` with `<div>` wrappers (valid HTML5) containing `<dt>`/`<dd>` pairs, styled with `flex items-center justify-between`.

## Changes to Prior Spec Decisions

Update the Semantic Table Refactor entry:

### Spec: Semantic Table Refactor — Status: Completed (2026-04-03)

Key architectural decisions:

1. **DD-1: Table Styling Strategy** — `border-separate` + `border-spacing-0` on `<table>` for per-cell border control. `table-fixed` + `w-full` with explicit `<th>` widths. Column widths on `<th>` via conditional className.
2. **DD-2: @tanstack/react-table (Headless)** — `createColumnHelper<Guest>()` at module scope, `useReactTable` with `getCoreRowModel()` inside component. `flexRender` for headers and cells.
3. **DD-3: GuestRow → GuestRowMobile** — Desktop row rendering moved to column `cell` definitions in `GuestTable.tsx`. `GuestRow.tsx` exports only `GuestRowMobile` (named export).
4. **DD-4: Description List for Core Metadata** — `<dl>`/`<dt>`/`<dd>` with `<div>` wrappers inside `GuestDetailSection`.
5. **DD-5: Column Width Mapping** — auto (name), `w-[120px]` (status), `w-[100px]` (table), `w-[60px]` (actions) — matching old `grid-cols-[1fr_120px_100px_60px]`.
6. **DD-6: Click Target on `<tr>`** — `onClick` on `<tr>` with `row.original.id`. Cursor and hover via Tailwind classes.

## New Guardrails

See `generated/guardrails.md` for G-27 and G-28.
