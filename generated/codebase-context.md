# Codebase Context — seating-plan

## Project Overview

A dark-themed, event seating plan management application for organizing guests and assigning them to tables. The app has two main views: a **Guest List** (tabular CRUD interface for managing guest records) and a **Seating Canvas** (visual 2D floor plan for placing tables, assigning guests to seats via drag-and-drop). The aesthetic is a futuristic/sci-fi "Nought Cobalt" design system with uppercase labels, monospaced identifiers, and a NATO phonetic naming convention for tables.

Data is persisted to `localStorage` with an in-memory fallback. There is no backend/API — this is a fully client-side SPA.

## Technology Stack

- **Framework**: React 19.2.4 (with StrictMode)
- **Build tool**: Vite 8.0.1 (with `@vitejs/plugin-react` 6.0.1)
- **Language**: TypeScript ~5.9.3 (strict mode, ES2023 target, `verbatimModuleSyntax`)
- **Styling**: Tailwind CSS 4.2.2 (via `@tailwindcss/vite` plugin, v4 `@theme`/`@utility`/`@layer` syntax)
- **State management**: React `useState` + custom hooks; no external state library
- **Routing**: React Router 7.14.0 (`react-router`, BrowserRouter with nested `<Route>` + `<Outlet>`)
- **Form handling**: react-hook-form 7.72.1
- **Drag and Drop**: @dnd-kit/react 0.3.2
- **Canvas pan/zoom**: react-zoom-pan-pinch 3.7.0
- **Mobile bottom sheets**: vaul 1.1.2 (Drawer component)
- **Icons**: react-icons 5.6.0 (exclusively Lucide family — `react-icons/lu`)
- **Table rendering**: @tanstack/react-table 8.21.3
- **ID generation**: uuid 13.0.0
- **Font**: Space Grotesk (Google Fonts, with preconnect)
- **Linting**: ESLint 9.39.4 + typescript-eslint 8.57.0 + eslint-plugin-react-hooks 7.0.1 + eslint-plugin-react-refresh 0.5.2 + eslint-config-prettier 10.1.8
- **Formatting**: Prettier 3.8.1 (no semicolons, single quotes, trailing commas)
- **Pre-commit hooks**: Husky 9.1.7 (runs `prettier --check .` + `npm run lint`)

## Project Structure

```
seating-plan/
├── index.html                    # SPA entry, loads Google Fonts
├── package.json                  # Dependencies & scripts
├── vite.config.ts                # Vite + React + Tailwind plugins
├── tsconfig.json                 # Project references
├── tsconfig.app.json             # App TS config (strict, ES2023)
├── tsconfig.node.json            # Node TS config (for vite.config.ts)
├── eslint.config.js              # ESLint flat config
├── .prettierrc                   # Prettier config
├── .prettierignore               # Prettier ignore
├── .husky/pre-commit             # Pre-commit: prettier check + lint
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── generated/                    # Spec-driven pipeline artifacts
│   ├── guardrails.md             # Accumulated guardrails (G-1 through G-34)
│   ├── codebase-context.md       # THIS FILE
│   └── task-report-*.md          # Development task reports
├── spec/                         # Feature specifications
│   ├── INDEX.md
│   └── *.md                      # Individual feature specs
└── src/
    ├── main.tsx                  # App entry, BrowserRouter + Routes
    ├── App.tsx                   # Root layout, state orchestration, DnD
    ├── App.css                   # Empty (all styles in index.css)
    ├── index.css                 # Design system: @theme, @utility, @layer
    ├── assets/                   # Static assets (hero.png, SVGs)
    ├── data/                     # Data layer
    │   ├── mock-guests.ts        # Guest type + seed data
    │   ├── guest-store.ts        # Guest CRUD (localStorage)
    │   ├── table-types.ts        # Table/seat types, geometry helpers
    │   ├── table-store.ts        # Table CRUD (localStorage)
    │   └── dnd-types.ts          # DnD discriminators + coordinate math
    ├── hooks/                    # Custom hooks
    │   ├── useTableState.ts      # Table state + action wrappers
    │   ├── useIsMobile.ts        # Media query hook (<768px)
    │   └── useLongPress.ts       # Touch long-press detection
    ├── pages/                    # Route-level pages
    │   ├── AddGuestPage.tsx      # Renders GuestForm for new guest
    │   └── EditGuestPage.tsx     # Renders GuestForm for existing guest
    └── components/               # Atomic Design hierarchy
        ├── atoms/                # Smallest reusable UI primitives
        │   ├── Avatar.tsx
        │   ├── CanvasStatusBar.tsx
        │   ├── FAB.tsx
        │   ├── FormError.tsx
        │   ├── IconButton.tsx
        │   ├── NavLink.tsx       # DEAD CODE — no consumers (per G-30)
        │   ├── SearchInput.tsx   # DEAD CODE — no consumers (per G-30)
        │   ├── SeatIndicator.tsx
        │   ├── ShapeToggle.tsx
        │   ├── StatCard.tsx
        │   ├── StatusBadge.tsx
        │   ├── StatusIcon.tsx
        │   ├── TabBarItem.tsx
        │   └── Toggle.tsx
        ├── molecules/            # Composed from atoms
        │   ├── CanvasTable.tsx
        │   ├── CanvasToolbar.tsx
        │   ├── ConfirmDialog.tsx
        │   ├── FormField.tsx
        │   ├── FormSection.tsx
        │   ├── GuestDetailSection.tsx
        │   ├── GuestRow.tsx
        │   ├── SeatAssignmentPopover.tsx
        │   ├── SidebarNavItem.tsx
        │   └── TableGroupHeader.tsx
        └── organisms/            # Feature-level compositions
            ├── BottomTabBar.tsx
            ├── CanvasPropertiesPanel.tsx
            ├── EmptyState.tsx
            ├── GuestDetailPanel.tsx
            ├── GuestForm.tsx
            ├── GuestListFooterStats.tsx
            ├── GuestListHeader.tsx
            ├── GuestTable.tsx
            ├── LeftSidebar.tsx
            ├── MobileGuestsSheet.tsx
            ├── MobilePropertiesSheet.tsx
            ├── MobileSeatAssignmentSheet.tsx
            ├── SeatingCanvas.tsx
            └── TopNav.tsx
```

## Key Patterns & Conventions

### Component Organization

- **Atomic Design**: `atoms/` → `molecules/` → `organisms/` hierarchy, plus `pages/` for route components.
- Components are organized by complexity, not by feature.

### Export Style

- **Default exports** for all components and pages.
- **Named exports** for types (via `export type`), constants, and utility functions.
- `GuestRow.tsx` is an exception: it uses named export `{ GuestRowMobile }`.

### Styling Approach

- **Tailwind CSS v4** with utility-first classes applied directly in JSX.
- **Design tokens** defined in `src/index.css`:
  - `@theme` block for Tailwind utility generation (color, font, radius scales).
  - `:root` block for `--nc-*` namespaced CSS custom properties.
  - `@utility` directives for typography classes (`text-display`, `text-heading-*`, `text-body-*`, `text-caption`, `text-label`, `text-code`).
  - `@layer components` for reusable component classes (`.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.card`, `.input`, `.badge`).
- **Dark mode only** — `color-scheme: dark` on `:root`, no light mode (G-4).
- **Responsive**: CSS visibility (`hidden md:block`, `md:hidden`) for layout; `useIsMobile()` JS hook for behavioral differences.

### State Management Pattern

- **No external state library**. All state lives in `App.tsx` via `useState`.
- Data stores (`guest-store.ts`, `table-store.ts`) are plain functions that read/write `localStorage`.
- `useTableState` hook wraps table store functions with React state synchronization.
- State is passed down via props; actions bubble up via callback props.
- Route child components receive data via `useOutletContext`.

### Type Definitions

- **Co-located with data**: `Guest` type in `mock-guests.ts`, `FloorTable`/`TableShape`/`SeatAssignment` in `table-types.ts`, DnD types in `dnd-types.ts`.
- **Re-exported** from store files: `guest-store.ts` re-exports `Guest`, `GuestStatus`; `table-store.ts` re-exports `FloorTable`, `TableShape`, `SeatAssignment`.
- Component props defined as inline `interface Props` at top of each component file.

### File Naming Conventions

- PascalCase for component files: `GuestForm.tsx`, `CanvasTable.tsx`.
- camelCase for hooks: `useTableState.ts`, `useIsMobile.ts`.
- kebab-case for data files: `guest-store.ts`, `table-types.ts`, `dnd-types.ts`.
- kebab-case for CSS files: `index.css`, `App.css`.

### Other Conventions

- All user-facing text is **UPPERCASE** with underscore separators (sci-fi aesthetic): `"NO_RECORDS // INITIALIZE_DB"`.
- Icons are exclusively from `react-icons/lu` (Lucide) — never mix families (G-20).
- Icon sizing via `size` prop, not CSS classes (G-22).
- All buttons include `cursor-pointer` and `focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2` (G-8, G-11).
- Form inputs with validation must include `aria-invalid` (G-15).
- No `useEffect` with `setState` — use "adjusting state during render" pattern (G-16, G-25).
- `@tanstack/react-table` column definitions at module scope (G-27).

## Data Flow

```
localStorage
    ↕ (read/write)
Data Stores (guest-store.ts, table-store.ts)
    ↕ (function calls)
App.tsx (useState + useTableState hook)
    ↓ props
    ├── Guest List View
    │   ├── GuestListHeader (stats)
    │   ├── GuestTable (guest data, selection)
    │   ├── GuestListFooterStats (derived stats)
    │   └── GuestDetailPanel (selected guest)
    │
    ├── Seating Canvas View (wrapped in DragDropProvider)
    │   ├── LeftSidebar (nav + unassigned guests + DnD)
    │   ├── SeatingCanvas
    │   │   ├── CanvasTable → SeatSlot → SeatIndicator
    │   │   ├── CanvasToolbar
    │   │   ├── SeatAssignmentPopover (desktop)
    │   │   └── MobileSeatAssignmentSheet (mobile)
    │   ├── CanvasPropertiesPanel (desktop)
    │   └── MobilePropertiesSheet (mobile)
    │
    └── Guest Form Routes (via Outlet + context)
        ├── AddGuestPage → GuestForm
        └── EditGuestPage → GuestForm
```

### Key data flow details:

1. `App.tsx` calls `getGuests()` / `getTables()` to initialize state from localStorage.
2. All mutations go through store functions, then `setGuests(getGuests())` or `refreshTables()` re-reads from storage.
3. The `DragDropProvider` wraps only the canvas view; `handleDragEnd` in `App.tsx` dispatches to appropriate table store actions.
4. Guest CRUD forms use `react-hook-form` internally; on submit, data flows up to `App.tsx` handlers via `useOutletContext`.

## Component Hierarchy

```
<BrowserRouter>
  <Routes>
    <Route element={<App />}>           ← Root layout
      <Route index />                    ← Guest list (default view)
      <Route path="seating-plan" />      ← Canvas view
      <Route path="guests/new" />        ← AddGuestPage
      <Route path="guests/:id/edit" />   ← EditGuestPage
    </Route>
  </Routes>
</BrowserRouter>

App
├── TopNav
├── [Guest List View]
│   ├── LeftSidebar
│   │   └── SidebarNavItem
│   ├── GuestListHeader
│   │   └── StatCard
│   ├── GuestTable
│   │   ├── (desktop) @tanstack/react-table with Avatar, StatusBadge, IconButton
│   │   └── (mobile) TableGroupHeader + GuestRowMobile → StatusIcon
│   ├── GuestListFooterStats
│   │   └── StatCard
│   ├── GuestDetailPanel
│   │   ├── Avatar, StatusBadge, IconButton
│   │   └── GuestDetailSection
│   ├── FAB
│   └── EmptyState
│
├── [Canvas View] (DragDropProvider wrapper)
│   ├── LeftSidebar
│   │   └── DraggableGuestItem (unassigned guests)
│   ├── SeatingCanvas
│   │   ├── TransformWrapper/TransformComponent
│   │   ├── CanvasTable
│   │   │   └── SeatSlot (useDroppable + useDraggable)
│   │   │       └── SeatIndicator
│   │   ├── CanvasToolbar
│   │   ├── CanvasStatusBar
│   │   ├── SeatAssignmentPopover (desktop)
│   │   └── MobileSeatAssignmentSheet (mobile, vaul Drawer)
│   ├── CanvasPropertiesPanel (desktop sidebar)
│   │   └── ShapeToggle
│   ├── MobilePropertiesSheet (mobile, vaul Drawer)
│   │   └── ShapeToggle
│   └── MobileGuestsSheet (mobile, vaul Drawer)
│
├── [Form Routes] (via Outlet)
│   ├── AddGuestPage → GuestForm
│   └── EditGuestPage → GuestForm
│       ├── FormSection
│       ├── FormField → FormError
│       ├── Toggle
│       └── ConfirmDialog
│
└── BottomTabBar
    └── TabBarItem
```

## Existing Abstractions

### Custom Hooks

| Hook            | File                                     | Purpose                                                                                                |
| --------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `useTableState` | `src/hooks/useTableState.ts` (112 lines) | Wraps table-store CRUD with React state. Returns `tables`, `selectedTableId`, and all action handlers. |
| `useIsMobile`   | `src/hooks/useIsMobile.ts` (18 lines)    | Returns boolean based on `(max-width: 767px)` media query.                                             |
| `useLongPress`  | `src/hooks/useLongPress.ts` (66 lines)   | Touch long-press detection with configurable threshold and move cancellation.                          |

### Data Stores

| Store       | File                                  | Purpose                                                                                        |
| ----------- | ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Guest Store | `src/data/guest-store.ts` (114 lines) | CRUD + aggregation for guest records (localStorage with memory fallback).                      |
| Table Store | `src/data/table-store.ts` (243 lines) | CRUD + seat assignment/swap/unassign for floor tables. Auto-generates NATO labels + badge IDs. |

### Shared UI Components (Atoms)

| Component         | File                        | Purpose                                                      |
| ----------------- | --------------------------- | ------------------------------------------------------------ |
| `Avatar`          | `atoms/Avatar.tsx`          | Circular initials avatar (sm/md/lg).                         |
| `IconButton`      | `atoms/IconButton.tsx`      | Accessible icon-only button with hover/focus states.         |
| `StatusBadge`     | `atoms/StatusBadge.tsx`     | Colored badge for guest status (CONFIRMED/PENDING/DECLINED). |
| `StatusIcon`      | `atoms/StatusIcon.tsx`      | Mobile-only status icon (checkmark or ellipsis).             |
| `StatCard`        | `atoms/StatCard.tsx`        | Card displaying a label + numeric value.                     |
| `FAB`             | `atoms/FAB.tsx`             | Floating action button (mobile only).                        |
| `Toggle`          | `atoms/Toggle.tsx`          | Accessible switch component with `role="switch"`.            |
| `ShapeToggle`     | `atoms/ShapeToggle.tsx`     | Toggle between rectangular/circular table shapes.            |
| `SeatIndicator`   | `atoms/SeatIndicator.tsx`   | Circular seat dot (empty/occupied/selected/drop-target).     |
| `CanvasStatusBar` | `atoms/CanvasStatusBar.tsx` | Zoom level + layer info display.                             |
| `FormError`       | `atoms/FormError.tsx`       | Validation error message with `role="alert"`.                |
| `TabBarItem`      | `atoms/TabBarItem.tsx`      | Mobile bottom tab bar item.                                  |
| `NavLink`         | `atoms/NavLink.tsx`         | **DEAD CODE** — previously used in TopNav, no consumers.     |
| `SearchInput`     | `atoms/SearchInput.tsx`     | **DEAD CODE** — previously used in TopNav, no consumers.     |

### Shared UI Components (Molecules)

| Component                     | File                                  | Purpose                                                    |
| ----------------------------- | ------------------------------------- | ---------------------------------------------------------- |
| `CanvasTable`                 | `molecules/CanvasTable.tsx`           | Renders a table on the canvas with seats, DnD, touch drag. |
| `CanvasToolbar`               | `molecules/CanvasToolbar.tsx`         | Tool selection bar (select/pan/add-circle/add-rect).       |
| `SeatAssignmentPopover`       | `molecules/SeatAssignmentPopover.tsx` | Desktop popover for assigning guests to seats.             |
| `GuestRow` / `GuestRowMobile` | `molecules/GuestRow.tsx`              | Mobile guest row with status icon.                         |
| `TableGroupHeader`            | `molecules/TableGroupHeader.tsx`      | Mobile group header for table-grouped guests.              |
| `GuestDetailSection`          | `molecules/GuestDetailSection.tsx`    | Titled section in guest detail panel.                      |
| `ConfirmDialog`               | `molecules/ConfirmDialog.tsx`         | Modal confirmation dialog (delete actions).                |
| `FormField`                   | `molecules/FormField.tsx`             | Label + input + error wrapper for forms.                   |
| `FormSection`                 | `molecules/FormSection.tsx`           | Titled section in forms.                                   |
| `SidebarNavItem`              | `molecules/SidebarNavItem.tsx`        | Sidebar navigation item.                                   |

### Design System Classes (index.css)

- **Buttons**: `.btn-primary`, `.btn-secondary`, `.btn-ghost`
- **Containers**: `.card`
- **Inputs**: `.input`
- **Badges**: `.badge`
- **Typography utilities**: `text-display`, `text-heading-1` through `text-heading-5`, `text-body-lg`, `text-body`, `text-body-sm`, `text-caption`, `text-label`, `text-code`

### Type Definitions

| Type             | File                          | Key Fields                                                                                                                      |
| ---------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `Guest`          | `data/mock-guests.ts`         | `id`, `firstName`, `lastName`, `role`, `status`, `accessLevel`, `tableAssignment`, `seatNumber`, `dietary`, `gift`, `logistics` |
| `GuestStatus`    | `data/mock-guests.ts`         | `'CONFIRMED' \| 'PENDING' \| 'DECLINED'`                                                                                        |
| `FloorTable`     | `data/table-types.ts`         | `id`, `badgeId`, `label`, `shape`, `seatCount`, `x`, `y`, `rotation`, `seats`                                                   |
| `TableShape`     | `data/table-types.ts`         | `'rectangular' \| 'circular'`                                                                                                   |
| `SeatAssignment` | `data/table-types.ts`         | `seatIndex`, `guestId`                                                                                                          |
| `DragGuestData`  | `data/dnd-types.ts`           | `type: 'guest'`, `guestId`                                                                                                      |
| `DragSeatData`   | `data/dnd-types.ts`           | `type: 'seat'`, `tableId`, `seatIndex`, `guestId`                                                                               |
| `DropSeatData`   | `data/dnd-types.ts`           | `tableId`, `seatIndex`                                                                                                          |
| `DropTableData`  | `data/dnd-types.ts`           | `tableId`                                                                                                                       |
| `CanvasTool`     | `molecules/CanvasToolbar.tsx` | `'select' \| 'pan' \| 'add-circle' \| 'add-rectangle'`                                                                          |

## Routing

| Path               | Component                    | Description                                                        |
| ------------------ | ---------------------------- | ------------------------------------------------------------------ |
| `/`                | `App` → Guest list view      | Default: shows GuestListHeader + GuestTable + GuestListFooterStats |
| `/seating-plan`    | `App` → Canvas view          | Seating canvas with DragDropProvider                               |
| `/guests/new`      | `AddGuestPage` (via Outlet)  | Guest creation form                                                |
| `/guests/:id/edit` | `EditGuestPage` (via Outlet) | Guest edit form                                                    |

Routes are defined in `main.tsx` as nested routes under `<App />`. Child routes (`/guests/*`) render via `<Outlet>` with context passing guest data and action handlers.

## Build & Development

### Scripts

| Script         | Command                | Description                           |
| -------------- | ---------------------- | ------------------------------------- |
| `dev`          | `vite --host`          | Dev server (accessible on LAN)        |
| `build`        | `tsc -b && vite build` | Type-check + production build         |
| `lint`         | `eslint .`             | Run ESLint                            |
| `format`       | `prettier --write .`   | Format all files                      |
| `format:check` | `prettier --check .`   | Check formatting (used in pre-commit) |
| `preview`      | `vite preview`         | Preview production build              |
| `prepare`      | `husky`                | Install husky hooks                   |

### Pre-commit Hook (`.husky/pre-commit`)

```sh
npx prettier --check .
npm run lint
```

Both must pass before commits are accepted.

### Prettier Config

- No semicolons
- Single quotes
- Trailing commas (all)
- 80 character print width
- 2-space indentation

### TypeScript Config

- Target: ES2023
- Strict mode with: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`
- `verbatimModuleSyntax`: requires `import type` for type-only imports
- `erasableSyntaxOnly`: no enums or parameter properties

## Files Inventory

### Source Files (52 files, ~4,740 lines total)

| File                                                     | Lines | Description                                                        |
| -------------------------------------------------------- | ----- | ------------------------------------------------------------------ |
| `src/main.tsx`                                           | 22    | App entry: BrowserRouter, route definitions                        |
| `src/App.tsx`                                            | 332   | Root layout: state management, DnD, view switching                 |
| `src/App.css`                                            | 0     | Empty (unused)                                                     |
| `src/index.css`                                          | 398   | Full design system: tokens, typography, components                 |
| **Data Layer**                                           |       |                                                                    |
| `src/data/mock-guests.ts`                                | 191   | Guest type definition + 6 seed records + helpers                   |
| `src/data/guest-store.ts`                                | 114   | Guest CRUD with localStorage persistence                           |
| `src/data/table-types.ts`                                | 117   | Table/seat types, geometry helpers, NATO labels                    |
| `src/data/table-store.ts`                                | 243   | Table CRUD, seat assignment, swap, localStorage                    |
| `src/data/dnd-types.ts`                                  | 45    | DnD type discriminators + coordinate conversion                    |
| **Hooks**                                                |       |                                                                    |
| `src/hooks/useTableState.ts`                             | 112   | Table state wrapper with React sync                                |
| `src/hooks/useIsMobile.ts`                               | 18    | Mobile detection via matchMedia                                    |
| `src/hooks/useLongPress.ts`                              | 66    | Touch long-press gesture detection                                 |
| **Pages**                                                |       |                                                                    |
| `src/pages/AddGuestPage.tsx`                             | 18    | New guest page (Outlet consumer)                                   |
| `src/pages/EditGuestPage.tsx`                            | 41    | Edit guest page (Outlet consumer, redirect on invalid ID)          |
| **Atoms**                                                |       |                                                                    |
| `src/components/atoms/Avatar.tsx`                        | 25    | Circular initials avatar                                           |
| `src/components/atoms/CanvasStatusBar.tsx`               | 15    | Zoom/layer info                                                    |
| `src/components/atoms/FAB.tsx`                           | 20    | Floating action button (mobile)                                    |
| `src/components/atoms/FormError.tsx`                     | 16    | Validation error with role="alert"                                 |
| `src/components/atoms/IconButton.tsx`                    | 21    | Accessible icon button                                             |
| `src/components/atoms/NavLink.tsx`                       | 22    | DEAD CODE — orphaned after sidebar refactor                        |
| `src/components/atoms/SearchInput.tsx`                   | 28    | DEAD CODE — orphaned after sidebar refactor                        |
| `src/components/atoms/SeatIndicator.tsx`                 | 56    | Seat circle (empty/occupied/selected/target)                       |
| `src/components/atoms/ShapeToggle.tsx`                   | 30    | Rectangular/circular shape toggle                                  |
| `src/components/atoms/StatCard.tsx`                      | 24    | Stat display card                                                  |
| `src/components/atoms/StatusBadge.tsx`                   | 27    | Status pill badge                                                  |
| `src/components/atoms/StatusIcon.tsx`                    | 16    | Mobile status icon                                                 |
| `src/components/atoms/TabBarItem.tsx`                    | 34    | Bottom tab bar item                                                |
| `src/components/atoms/Toggle.tsx`                        | 28    | Accessible switch toggle                                           |
| **Molecules**                                            |       |                                                                    |
| `src/components/molecules/CanvasTable.tsx`               | 304   | Table on canvas with seats, DnD, touch handling                    |
| `src/components/molecules/CanvasToolbar.tsx`             | 45    | Canvas tool selection bar                                          |
| `src/components/molecules/ConfirmDialog.tsx`             | 56    | Modal confirmation dialog                                          |
| `src/components/molecules/FormField.tsx`                 | 30    | Form label + input + error wrapper                                 |
| `src/components/molecules/FormSection.tsx`               | 19    | Titled form section                                                |
| `src/components/molecules/GuestDetailSection.tsx`        | 19    | Titled detail section                                              |
| `src/components/molecules/GuestRow.tsx`                  | 39    | Mobile guest row (named export: GuestRowMobile)                    |
| `src/components/molecules/SeatAssignmentPopover.tsx`     | 127   | Desktop seat assignment popover                                    |
| `src/components/molecules/SidebarNavItem.tsx`            | 22    | Sidebar nav item                                                   |
| `src/components/molecules/TableGroupHeader.tsx`          | 32    | Mobile table group header                                          |
| **Organisms**                                            |       |                                                                    |
| `src/components/organisms/BottomTabBar.tsx`              | 42    | Mobile bottom navigation                                           |
| `src/components/organisms/CanvasPropertiesPanel.tsx`     | 163   | Desktop table properties sidebar                                   |
| `src/components/organisms/EmptyState.tsx`                | 28    | Empty guest list state                                             |
| `src/components/organisms/GuestDetailPanel.tsx`          | 218   | Guest detail sidebar (desktop) / overlay (mobile)                  |
| `src/components/organisms/GuestForm.tsx`                 | 317   | Full guest add/edit form                                           |
| `src/components/organisms/GuestListFooterStats.tsx`      | 41    | Desktop footer stats bar                                           |
| `src/components/organisms/GuestListHeader.tsx`           | 50    | Guest list header with stats                                       |
| `src/components/organisms/GuestTable.tsx`                | 205   | Guest table (desktop: @tanstack/react-table, mobile: grouped rows) |
| `src/components/organisms/LeftSidebar.tsx`               | 116   | Desktop sidebar nav + actions                                      |
| `src/components/organisms/MobileGuestsSheet.tsx`         | 68    | Mobile unassigned guests drawer                                    |
| `src/components/organisms/MobilePropertiesSheet.tsx`     | 181   | Mobile table properties drawer                                     |
| `src/components/organisms/MobileSeatAssignmentSheet.tsx` | 177   | Mobile seat assignment drawer                                      |
| `src/components/organisms/SeatingCanvas.tsx`             | 335   | Main canvas with pan/zoom, table placement, seat interaction       |
| `src/components/organisms/TopNav.tsx`                    | 27    | Top navigation bar                                                 |

### Known Dead Code

- `src/components/atoms/NavLink.tsx` — No imports anywhere (G-30).
- `src/components/atoms/SearchInput.tsx` — No imports anywhere (G-30).
- `src/App.css` — Empty file, all styles in `index.css`.
- `GuestTable.searchQuery` prop — Always passed `""`, never used meaningfully (G-29).

## Guardrails Summary

The project has 34 established guardrails (G-1 through G-34) documented in `generated/guardrails.md`. Key rules developers must follow:

### CSS & Styling

- **G-1**: `@import 'tailwindcss'` must be the first line of `index.css`
- **G-2**: Use `@theme` for Tailwind utilities, `:root` for direct CSS vars
- **G-3**: Always use `var(--nc-*)` namespace for custom CSS
- **G-4**: Dark mode only — no `prefers-color-scheme`
- **G-5**: Default border radius is 4px
- **G-6**: Use `@utility` for multi-property custom utilities
- **G-7**: Use `@layer components` for component base styles
- **G-10**: Grep all `src/` when renaming CSS variables
- **G-28**: Use `border-separate` + `border-spacing-0` for styled tables

### Accessibility

- **G-8**: `focus-visible` for buttons, `focus` for inputs
- **G-11**: All interactive elements must be keyboard accessible
- **G-15**: Form inputs with validation must include `aria-invalid`
- **G-19**: Custom modals need keyboard + ARIA support

### React Patterns

- **G-16/G-25**: No `setState` inside `useEffect` — use sync state adjustment
- **G-17**: Single source of truth for data transformations
- **G-27**: `@tanstack/react-table` columns at module scope
- **G-29**: Clean up vestigial props after interface changes
- **G-30**: Verify component import graph after removing consumers
- **G-31**: Clean up timer refs on unmount
- **G-32**: Choose one responsive visibility strategy per element

### Icons

- **G-20**: All icons from `react-icons/lu` (Lucide) only
- **G-21**: Verify icon export names against actual package
- **G-22**: Use `size` prop for icon dimensions

### Code Quality

- **G-12/G-26**: No identical conditional branches
- **G-13**: Use design system typography classes consistently
- **G-18**: Delete unused component files
- **G-23**: Store function signatures must match intended contract
- **G-24**: Spec is authoritative for literal values
- **G-33**: Align equivalent type definitions across components
- **G-34**: Touch event listeners must accompany mouse listeners
