# Task Report: TASK-002 — Refactor GuestTable Desktop to `<table>` + GuestRow to Mobile-Only

## Status: COMPLETED

## Changes Made

### Part A: `src/components/molecules/GuestRow.tsx`

1. **Renamed** `GuestRow` to `GuestRowMobile`
2. **Removed desktop block** — deleted the entire `{/* Desktop layout */}` div with `hidden md:grid` and all its children
3. **Removed desktop-only imports**: `LuEllipsis`, `Avatar`, `StatusBadge`, `IconButton`
4. **Kept mobile-relevant imports**: `Guest` type, `StatusIcon`
5. **Simplified component structure** — removed `md:hidden` from inner div since visibility is controlled by the parent
6. **Changed export** from `export default GuestRow` to `export { GuestRowMobile }` (named export, no default)

### Part B: `src/components/organisms/GuestTable.tsx`

1. **Updated import** from `import GuestRow from ...` to `import { GuestRowMobile } from ...`
2. **Added `useReactTable` call** after `hasActiveSearch`/`isEmpty`, consuming `guests` and `columns`
3. **Replaced desktop block** — the old `<div className="hidden md:block">` with manual grid header and `GuestRow` map is now a semantic `<table className="hidden md:table ...">` with:
   - `<thead>` rendered via `table.getHeaderGroups()` → `flexRender`
   - `<th>` elements with `scope="col"` for accessibility
   - Column widths: auto (name), `w-[120px]` (status), `w-[100px]` (table), `w-[60px]` (actions)
   - `<tbody>` rows rendered via `table.getRowModel().rows` → `row.getVisibleCells()` → `flexRender`
   - Row click, hover, and selected styling preserved
   - Empty search state as `<tr><td colSpan={...}>NO_RESULTS // QUERY_MISMATCH</td></tr>`
4. **Updated mobile block** — all `<GuestRow` references replaced with `<GuestRowMobile`

## Acceptance Criteria Verification

| Criterion                                                                             | Status |
| ------------------------------------------------------------------------------------- | ------ |
| `GuestRow.tsx` exports only `GuestRowMobile` as named export (no default)             | PASS   |
| `GuestRowMobile` renders only mobile card layout                                      | PASS   |
| `GuestRow.tsx` no longer imports `Avatar`, `StatusBadge`, `IconButton`, `LuEllipsis`  | PASS   |
| Desktop guest list renders as `<table>` with `<thead>` and `<tbody>`                  | PASS   |
| `<th>` elements have `scope="col"`                                                    | PASS   |
| Headers rendered via `table.getHeaderGroups()` → `flexRender`                         | PASS   |
| Rows rendered via `table.getRowModel().rows` → `row.getVisibleCells()` → `flexRender` | PASS   |
| Row click, hover, and selected styling work correctly                                 | PASS   |
| Column widths: auto, 120px, 100px, 60px                                               | PASS   |
| Empty search state renders as `<tr><td colSpan>`                                      | PASS   |
| Mobile layout unchanged — uses `GuestRowMobile`                                       | PASS   |
| `npx tsc -b` compiles without errors                                                  | PASS   |
