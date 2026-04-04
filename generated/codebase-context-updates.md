# Codebase Context Updates — Refactor Codebase

Updates to project structure and patterns based on the validated refactor-codebase spec implementation.

---

## Architecture Changes

### App.tsx — Thin Layout Shell (17 lines)

`App.tsx` is now a pure layout shell rendering `TopNav`, `<Outlet />`, and `BottomTabBar`. It contains zero state, zero hooks, and zero business logic.

### Route Architecture

```
<Route element={<App />}>                    ← layout: TopNav + Outlet + BottomTabBar
  <Route element={<GuestListView />}>        ← layout: LeftSidebar + main + detail panel
    <Route index element={null} />           ← guest list (rendered by GuestListView)
    <Route path="guests/new" ... />          ← AddGuestPage (via Outlet context)
    <Route path="guests/:id/edit" ... />     ← EditGuestPage (via Outlet context)
  </Route>
  <Route path="seating-plan" ... />          ← SeatingPlanView (standalone)
</Route>
```

### View Components

- **`GuestListView`** (`src/pages/GuestListView.tsx`, 157 lines) — Owns guest state, CRUD handlers, statistics (via `useGuestStats`), navigation, FAB. Acts as layout route providing `OutletContext` to form pages.
- **`SeatingPlanView`** (`src/pages/SeatingPlanView.tsx`, 122 lines) — Owns table state (via `useTableState`), DnD handler (via `useDragEndHandler`), canvas rendering, mobile sheets.

## New Files

### Data Layer

| File                         | Purpose                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| `src/data/guest-types.ts`    | `Guest` interface and `GuestStatus` type (extracted from `mock-guests.ts`)            |
| `src/data/canvas-utils.ts`   | `screenToCanvas()` coordinate conversion (extracted from `dnd-types.ts`)              |
| `src/data/outlet-context.ts` | Shared `OutletContext` interface for form page routes                                 |
| `src/data/guest-utils.ts`    | `getUnassignedGuests(guests, tables)` utility                                         |
| `src/data/storage-utils.ts`  | `createStorage<T>(key, fallback)` — generic localStorage wrapper with memory fallback |

### Hooks

| File                             | Purpose                                                            |
| -------------------------------- | ------------------------------------------------------------------ |
| `src/hooks/useGuestStats.ts`     | `useGuestStats(guests)` — memoized statistics computation          |
| `src/hooks/useDragEndHandler.ts` | `useDragEndHandler(tables, assignFn, swapFn)` — DnD dispatch logic |

### Components

| File                                               | Purpose                                                                                                |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `src/components/organisms/TablePropertiesForm.tsx` | Shared form UI for table properties (used by both `CanvasPropertiesPanel` and `MobilePropertiesSheet`) |

## Modified File Summaries

### Significantly Changed

- **`mock-guests.ts`** — Now only exports seed data array. Types extracted to `guest-types.ts`. Dead stats functions removed.
- **`guest-store.ts`** — Uses `createStorage` utility. Imports types from `guest-types.ts`. Type re-exports removed. **Note**: Still contains unused stats functions (flagged in validation).
- **`table-store.ts`** — Uses `createStorage` for both tables and counter. Type re-exports removed.
- **`dnd-types.ts`** — Only DnD type discriminators and interfaces. `screenToCanvas` moved out.
- **`CanvasPropertiesPanel.tsx`** — Thin wrapper (41 lines). Uses `TablePropertiesForm` with `key={table.id}`.
- **`MobilePropertiesSheet.tsx`** — Thin wrapper (57 lines). Uses `TablePropertiesForm` with `key={table.id}`.
- **`GuestDetailPanel.tsx`** — Single responsive markup (no duplicated mobile/desktop blocks).
- **`GuestTable.tsx`** — Accepts `tables` prop for actual seat counts. `searchQuery` prop removed. Default import for `GuestRow`.
- **`GuestRow.tsx`** — Uses `export default` (was named export).

### CSS Changes

- **`index.css`** — `@theme` block now references `:root` `--nc-*` vars (no duplicate hex values). Added `btn-destructive` class in `@layer components`.

### Deleted Files

- `src/components/atoms/NavLink.tsx`
- `src/components/atoms/SearchInput.tsx`
- `src/App.css`
- `src/assets/react.svg`
- `src/assets/vite.svg`

## Import Graph Changes

- All `Guest`/`GuestStatus` imports now from `data/guest-types` (not `mock-guests` or `guest-store`)
- All `FloorTable`/`TableShape`/`SeatAssignment` imports from `data/table-types` (not `table-store`)
- `screenToCanvas` imported from `data/canvas-utils` (not `dnd-types`)
- `OutletContext` imported from `data/outlet-context` (not locally defined)

## Design Patterns Established

1. **`key` prop for state reset** — Parent passes `key={entity.id}` to reset child local state when entity changes
2. **Shared form + thin wrapper** — Extract shared form logic, each wrapper provides only container chrome
3. **Layout route for outlet context** — View component acts as layout route, provides context to child form pages
4. **`createStorage<T>`** — Generic localStorage abstraction with memory fallback
5. **Named constants for magic numbers** — `CANVAS_WIDTH`, `CANVAS_HEIGHT`, `POPOVER_WIDTH`, `POPOVER_GAP`, `TOUCH_MOVE_THRESHOLD`
