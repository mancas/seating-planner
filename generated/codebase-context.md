# Codebase Context — seating-plan

## Project Overview

A dark-themed, event seating plan management application for organizing guests and assigning them to tables. The app has two main views: a **Guest List** (tabular CRUD interface for managing guest records) and a **Seating Canvas** (visual 2D floor plan for placing tables, assigning guests to seats via drag-and-drop). The aesthetic is a futuristic/sci-fi "Nought Cobalt" design system with uppercase labels, monospaced identifiers, and a NATO phonetic naming convention for tables.

Data is persisted to `localStorage` with an in-memory fallback. There is no backend/API — this is a fully client-side SPA. PWA support via service worker and web app manifest.

## Tech Stack

- **Language(s)**: TypeScript ~5.9.3 (strict mode, ES2023 target, `verbatimModuleSyntax`, `erasableSyntaxOnly`)
- **Framework**: React 19.2.4 (with StrictMode)
- **Runtime**: Node.js 22 (Docker build), Vite 8.0.1 dev server
- **Build tool**: Vite 8.0.1 (with `@vitejs/plugin-react` 6.0.1)
- **Styling**: Tailwind CSS 4.2.2 (via `@tailwindcss/vite` plugin, v4 `@theme`/`@utility`/`@layer` syntax)
- **Deployment**: Docker (multi-stage: node:22-alpine build → nginx:stable-alpine serve), GitHub Actions CI/CD to GHCR

## Key Dependencies

| Library               | Version | Purpose                                                    |
| --------------------- | ------- | ---------------------------------------------------------- |
| react                 | ^19.2.4 | UI framework                                               |
| react-dom             | ^19.2.4 | DOM renderer                                               |
| react-router          | ^7.14.0 | Client-side routing (BrowserRouter, nested Routes, Outlet) |
| react-hook-form       | ^7.72.1 | Form state management and validation                       |
| @dnd-kit/react        | ^0.3.2  | Drag-and-drop (guest→seat, seat→seat swap)                 |
| react-zoom-pan-pinch  | ^3.7.0  | Canvas pan/zoom for floor plan                             |
| vaul                  | ^1.1.2  | Mobile bottom sheet drawers                                |
| react-icons           | ^5.6.0  | Icons (exclusively Lucide family — `react-icons/lu`)       |
| @tanstack/react-table | ^8.21.3 | Desktop guest data table                                   |
| uuid                  | ^13.0.0 | Guest/table ID generation                                  |
| tailwindcss           | ^4.2.2  | Utility-first CSS framework                                |
| typescript            | ~5.9.3  | Type system                                                |
| eslint                | ^9.39.4 | Linting (flat config)                                      |
| prettier              | ^3.8.1  | Code formatting                                            |
| husky                 | ^9.1.7  | Pre-commit hooks                                           |

## Code Conventions

### Naming

- **Components**: PascalCase files (`GuestForm.tsx`, `CanvasTable.tsx`)
- **Hooks**: camelCase files prefixed with `use` (`useTableState.ts`, `useIsMobile.ts`)
- **Data/utility files**: kebab-case (`guest-store.ts`, `table-types.ts`, `canvas-utils.ts`)
- **CSS**: kebab-case (`index.css`)

### File Organization

- **Atomic Design hierarchy**: `src/components/atoms/` → `molecules/` → `organisms/`
- **Route-level views**: `src/pages/` (view components + page components)
- **Data layer**: `src/data/` (types, stores, utilities)
- **Custom hooks**: `src/hooks/`
- **Standalone utilities**: `src/utils/`
- Components organized by complexity, not by feature.

### Import Style

- Relative imports throughout (no path aliases configured)
- `verbatimModuleSyntax` requires `import type` for type-only imports
- Explicit `.tsx` extensions in some imports (e.g., `main.tsx`)

### Export Style

- **Default exports** for all components and pages
- **Named exports** for types (`export type`), constants, hook functions, and utility functions
- Exception: `GuestRow.tsx` exports both default + named `{ GuestRowMobile }`

### Linter/Formatter

- **Prettier**: No semicolons, single quotes, trailing commas (all), 80 char width, 2-space indent
- **ESLint**: Flat config (`eslint.config.js`), applies to `**/*.{ts,tsx}`, extends `@eslint/js` recommended + `typescript-eslint` recommended + `react-hooks` recommended + `react-refresh` vite + `eslint-config-prettier`
- **Pre-commit**: Husky runs `prettier --check .` + `npm run lint` — both must pass

### UI/Text Conventions

- All user-facing text is **UPPERCASE** with underscore separators (sci-fi aesthetic): `"NO_RECORDS // INITIALIZE_DB"`
- Icons exclusively from `react-icons/lu` (Lucide) — never mix families (G-20)
- Icon sizing via `size` prop, not CSS classes (G-22)

## Architectural Patterns

### Structure

- **Atomic Design**: atoms → molecules → organisms → pages
- `App.tsx` is a thin layout shell (26 lines): TopNav + Outlet + BottomTabBar + ProjectActionsSheet (mobile) — no business logic (G-40)
- View components (`GuestListView`, `SeatingPlanView`) own their domain state

### State Management

- **No external state library**. React `useState` + custom hooks.
- Data stores (`guest-store.ts`, `table-store.ts`) are plain functions that read/write `localStorage` via `createStorage<T>()`.
- `useTableState` hook wraps table store functions with React state synchronization.
- `useGuestStats` hook provides memoized guest statistics.
- State passed down via props; actions bubble up via callback props.
- Store read functions initialized with `useState(() => fn())` to avoid re-reading localStorage on every render (G-39).
- Guest CRUD form routes receive data via `useOutletContext` from `GuestListView` layout route (G-38).
- Mobile UI state in `SeatingPlanView` managed via `useReducer` (mobile sheet state machine).

### Data Fetching

- No remote data fetching — all data in localStorage.
- `createStorage<T>(key, fallback)` provides a generic localStorage wrapper with JSON serialization and in-memory fallback on storage errors.

### Error Handling

- localStorage read/write wrapped in try/catch with memory fallback (`storage-utils.ts`)
- CSV import uses all-or-nothing validation with detailed per-row error reporting (`csv-import.ts`)
- Form validation via react-hook-form with `aria-invalid` on error fields (G-15)

### Routing

```
<BrowserRouter>
  <Routes>
    <Route element={<App />}>                    ← Thin layout shell
      <Route path="guests/import" element={<ImportGuestsView />} />
      <Route element={<GuestListView />}>        ← Layout route (owns guest state)
        <Route index element={null} />           ← Guest list (default view)
        <Route path="guests/new" element={<AddGuestPage />} />
        <Route path="guests/:id/edit" element={<EditGuestPage />} />
      </Route>
      <Route path="seating-plan" element={<SeatingPlanView />} />
    </Route>
  </Routes>
</BrowserRouter>
```

| Path               | Component          | Description                                               |
| ------------------ | ------------------ | --------------------------------------------------------- |
| `/`                | `GuestListView`    | Guest list with header, table, footer stats, detail panel |
| `/guests/new`      | `AddGuestPage`     | Guest creation form (via Outlet + OutletContext)          |
| `/guests/:id/edit` | `EditGuestPage`    | Guest edit form (via Outlet + OutletContext)              |
| `/guests/import`   | `ImportGuestsView` | CSV import with file upload and validation                |
| `/seating-plan`    | `SeatingPlanView`  | Interactive canvas with DnD                               |

## Test Conventions

No test framework is configured. No test files exist in the codebase. No test runner in `package.json` scripts.

## Project-Specific Practices

### Design System (`src/index.css`)

- `@theme` block for Tailwind utility generation (color, font, radius scales)
- `:root` block for `--nc-*` namespaced CSS custom properties (raw design tokens)
- `@utility` directives for typography classes: `text-display`, `text-heading-1` through `text-heading-5`, `text-body-lg`, `text-body`, `text-body-sm`, `text-caption`, `text-label`, `text-code`
- `@layer components` for reusable component classes: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-destructive`, `.card`, `.input`, `.badge`
- Color tokens: `gray-50`–`gray-950`, `cobalt-300`–`cobalt-950`, semantic aliases (`background`, `surface`, `surface-elevated`, `foreground`, `foreground-muted`, `foreground-heading`, `border`, `primary`, `primary-hover`, `primary-foreground`, `ring`, `muted`, `default`)
- Radius tokens: `rounded` (4px default), `rounded-sm` (2px), `rounded-md` (4px), `rounded-lg` (8px), `rounded-xl` (12px)
- Animation: `@keyframes fadeSlideUp` (opacity 0→1, translateY 8px→0)
- **Dark mode only** — `color-scheme: dark` on `:root`, no light mode (G-4)
- Font: Space Grotesk (Google Fonts, with preconnect)

### Data Layer

| Store         | File                        | API                                                                                                                                                                                       |
| ------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Storage Utils | `src/data/storage-utils.ts` | `createStorage<T>(key, fallback)` → `{ read(): T, write(value: T): void }`                                                                                                                |
| Guest Store   | `src/data/guest-store.ts`   | `getGuests()`, `getGuestById(id)`, `addGuest(data)`, `updateGuest(id, data)`, `deleteGuest(id)`                                                                                           |
| Table Store   | `src/data/table-store.ts`   | `getTables()`, `getTableById(id)`, `addTable(data)`, `updateTable(id, data)`, `deleteTable(id)`, `assignGuestToSeat()`, `unassignSeat()`, `swapSeats()`, `clearGuestAssignments(guestId)` |

### Custom Hooks

| Hook                | File                             | Purpose                                                                                    |
| ------------------- | -------------------------------- | ------------------------------------------------------------------------------------------ |
| `useTableState`     | `src/hooks/useTableState.ts`     | Wraps table-store CRUD with React state. Returns `tables`, `selectedTableId`, all actions. |
| `useGuestStats`     | `src/hooks/useGuestStats.ts`     | Memoized guest statistics (confirmed, pending, total, rate, gifts, waitlist).              |
| `useDragEndHandler` | `src/hooks/useDragEndHandler.ts` | DnD drop handler: guest→seat assign, seat→seat swap, guest→table body auto-assign.         |
| `useIsMobile`       | `src/hooks/useIsMobile.ts`       | Returns boolean based on `(max-width: 767px)` media query.                                 |
| `useLongPress`      | `src/hooks/useLongPress.ts`      | Touch long-press detection with configurable threshold and move cancellation.              |

### Type Definitions

| Type             | File                     | Key Fields                                                                                                              |
| ---------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `Guest`          | `data/guest-types.ts`    | `id`, `firstName`, `lastName`, `status`, `accessLevel`, `tableAssignment`, `seatNumber`, `dietary`, `gift`, `logistics` |
| `GuestStatus`    | `data/guest-types.ts`    | `'CONFIRMED' \| 'PENDING' \| 'DECLINED'`                                                                                |
| `FloorTable`     | `data/table-types.ts`    | `id`, `badgeId`, `label`, `shape`, `seatCount`, `x`, `y`, `rotation`, `seats`                                           |
| `TableShape`     | `data/table-types.ts`    | `'rectangular' \| 'circular'`                                                                                           |
| `SeatAssignment` | `data/table-types.ts`    | `seatIndex`, `guestId`                                                                                                  |
| `OutletContext`  | `data/outlet-context.ts` | `guests`, `onAdd`, `onUpdate`, `onDelete`, `onCancel`                                                                   |
| `DragGuestData`  | `data/dnd-types.ts`      | `type: 'guest'`, `guestId`                                                                                              |
| `DragSeatData`   | `data/dnd-types.ts`      | `type: 'seat'`, `tableId`, `seatIndex`, `guestId`                                                                       |
| `DropSeatData`   | `data/dnd-types.ts`      | `tableId`, `seatIndex`                                                                                                  |
| `DropTableData`  | `data/dnd-types.ts`      | `tableId`                                                                                                               |

### Project Structure

```
seating-plan/
├── index.html                    # SPA entry, loads Google Fonts, PWA meta
├── package.json                  # Dependencies & scripts (ESM: "type": "module")
├── vite.config.ts                # Vite + React + Tailwind plugins
├── tsconfig.json                 # Project references (app + node)
├── tsconfig.app.json             # App TS config (strict, ES2023, react-jsx)
├── tsconfig.node.json            # Node TS config (for vite.config.ts)
├── eslint.config.js              # ESLint flat config (ts/tsx only)
├── .prettierrc                   # Prettier config
├── .prettierignore               # Prettier ignore (dist, node_modules, lockfile)
├── .husky/pre-commit             # Pre-commit: prettier check + lint
├── Dockerfile                    # Multi-stage: node:22-alpine build → nginx serve
├── nginx.conf                    # Nginx config for SPA
├── .github/workflows/docker.yml  # CI: build + push Docker image to GHCR
├── scripts/release.sh            # Semver release script (patch/minor/major)
├── guests-import.csv             # Sample CSV import file
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   ├── apple-touch-icon.png
│   ├── pwa-icon-192x192.png
│   ├── pwa-icon-512x512.png
│   ├── manifest.webmanifest
│   └── sw.js                     # Service worker
├── generated/                    # Spec-driven pipeline artifacts
│   ├── guardrails.md             # Accumulated guardrails (G-1 through G-46)
│   ├── codebase-context.md       # THIS FILE
│   └── task-report-*.md          # Development task reports
├── spec/                         # Feature specifications
│   ├── INDEX.md
│   └── *.md                      # Individual feature specs
└── src/
    ├── main.tsx                  # App entry: BrowserRouter, route definitions, SW registration
    ├── App.tsx                   # Thin layout shell: TopNav + Outlet + BottomTabBar + ProjectActionsSheet (26 lines)
    ├── index.css                 # Design system: @theme, @utility, @layer components
    ├── assets/
    │   └── hero.png              # Static image asset
    ├── data/                     # Data layer (types, stores, utilities)
    │   ├── guest-types.ts        # Guest, GuestStatus type definitions
    │   ├── guest-store.ts        # Guest CRUD (localStorage via createStorage)
    │   ├── guest-utils.ts        # Guest utility functions (getUnassignedGuests)
    │   ├── table-types.ts        # FloorTable, SeatAssignment, geometry helpers, NATO labels
    │   ├── table-store.ts        # Table CRUD, seat assignment/swap (localStorage)
    │   ├── storage-utils.ts      # Generic localStorage wrapper (createStorage<T>)
    │   ├── canvas-utils.ts       # screenToCanvas coordinate conversion
    │   ├── dnd-types.ts          # DnD type discriminators (DRAG_TYPE_GUEST, DRAG_TYPE_SEAT)
    │   ├── outlet-context.ts     # OutletContext type for guest form routes
    │   └── mock-guests.ts        # Seed guest records
    ├── hooks/                    # Custom React hooks
    │   ├── useTableState.ts      # Table state + action wrappers
    │   ├── useGuestStats.ts      # Memoized guest statistics computation
    │   ├── useDragEndHandler.ts  # DnD drop handler (guest→seat, seat→seat swap)
    │   ├── useIsMobile.ts        # Media query hook (<768px)
    │   └── useLongPress.ts       # Touch long-press detection
    ├── utils/                    # Standalone utilities
    │   ├── csv-import.ts         # CSV parsing, validation, template generation
    │   └── project-export.ts     # Project data export/import (versioned JSON)
    ├── pages/                    # Route-level view components
    │   ├── GuestListView.tsx     # Layout route: guest state, CRUD, sidebar, table, detail panel
    │   ├── SeatingPlanView.tsx   # Canvas view: table state, DnD, mobile sheets
    │   ├── AddGuestPage.tsx      # New guest form (Outlet consumer)
    │   ├── EditGuestPage.tsx     # Edit guest form (Outlet consumer)
    │   └── ImportGuestsView.tsx  # CSV import page
    └── components/               # Atomic Design hierarchy
        ├── atoms/                # Smallest reusable UI primitives (11 files)
        │   ├── CanvasStatusBar.tsx
        │   ├── FAB.tsx
        │   ├── FormError.tsx
        │   ├── IconButton.tsx
        │   ├── SeatIndicator.tsx
        │   ├── ShapeToggle.tsx
        │   ├── StatCard.tsx
        │   ├── StatusBadge.tsx
        │   ├── StatusIcon.tsx
        │   ├── TabBarItem.tsx
        │   └── Toggle.tsx
        ├── molecules/            # Composed from atoms (11 files)
        │   ├── CanvasTable.tsx
        │   ├── CanvasToolbar.tsx
        │   ├── ConfirmDialog.tsx
        │   ├── FileDropZone.tsx
        │   ├── FormField.tsx
        │   ├── FormSection.tsx
        │   ├── GuestDetailSection.tsx
        │   ├── GuestRow.tsx
        │   ├── SeatAssignmentPopover.tsx
        │   ├── SidebarNavItem.tsx
        │   └── TableGroupHeader.tsx
        └── organisms/            # Feature-level compositions (17 files)
            ├── BottomTabBar.tsx
            ├── CanvasPropertiesPanel.tsx
            ├── EmptyState.tsx
            ├── GuestDetailPanel.tsx
            ├── GuestForm.tsx
            ├── GuestListFooterStats.tsx
            ├── GuestListHeader.tsx
            ├── GuestTable.tsx
            ├── ImportGuestsPage.tsx
            ├── LeftSidebar.tsx
            ├── MobileGuestsSheet.tsx
            ├── MobilePropertiesSheet.tsx
            ├── MobileSeatAssignmentSheet.tsx
            ├── ProjectActionsSheet.tsx
            ├── SeatingCanvas.tsx
            ├── TablePropertiesForm.tsx
            └── TopNav.tsx
```

### Data Flow

```
localStorage
    ↕ (read/write via createStorage<T>)
Data Stores (guest-store.ts, table-store.ts)
    ↕ (function calls)
View Components (GuestListView, SeatingPlanView)
    ↓ props
    ├── Guest List View (GuestListView — layout route)
    │   ├── LeftSidebar (nav + stats)
    │   ├── GuestListHeader (stats via useGuestStats)
    │   ├── GuestTable (guest data, selection)
    │   ├── GuestListFooterStats (derived stats)
    │   ├── GuestDetailPanel (selected guest)
    │   ├── FAB (add guest)
    │   ├── EmptyState (no guests)
    │   └── [Outlet → AddGuestPage / EditGuestPage → GuestForm]
    │
    ├── Seating Canvas View (SeatingPlanView — DragDropProvider wrapper)
    │   ├── LeftSidebar (nav + actions)
    │   ├── SeatingCanvas
    │   │   ├── CanvasTable → SeatSlot → SeatIndicator
    │   │   ├── CanvasToolbar
    │   │   ├── CanvasStatusBar
    │   │   ├── SeatAssignmentPopover (desktop)
    │   │   └── MobileSeatAssignmentSheet (mobile, vaul Drawer)
    │   ├── CanvasPropertiesPanel (desktop sidebar) → TablePropertiesForm
    │   ├── MobilePropertiesSheet (mobile, vaul Drawer)
    │   └── MobileGuestsSheet (mobile, vaul Drawer)
    │
    └── App.tsx (thin shell)
        ├── TopNav
        ├── Outlet (renders GuestListView or SeatingPlanView)
        ├── BottomTabBar
        └── ProjectActionsSheet (mobile only)
```

### Build & Scripts

| Script          | Command                      | Description                           |
| --------------- | ---------------------------- | ------------------------------------- |
| `dev`           | `vite --host`                | Dev server (accessible on LAN)        |
| `build`         | `tsc -b && vite build`       | Type-check + production build         |
| `lint`          | `eslint .`                   | Run ESLint                            |
| `format`        | `prettier --write .`         | Format all files                      |
| `format:check`  | `prettier --check .`         | Check formatting (used in pre-commit) |
| `preview`       | `vite preview`               | Preview production build              |
| `prepare`       | `husky`                      | Install husky hooks                   |
| `release`       | `./scripts/release.sh patch` | Semver patch release                  |
| `release:minor` | `./scripts/release.sh minor` | Semver minor release                  |
| `release:major` | `./scripts/release.sh major` | Semver major release                  |

### TypeScript Config

- Target: ES2023
- Strict mode with: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`
- `verbatimModuleSyntax`: requires `import type` for type-only imports
- `erasableSyntaxOnly`: no enums or parameter properties
- `jsx`: `react-jsx` (automatic JSX transform)
- `moduleResolution`: `bundler`
- Project references: `tsconfig.app.json` (src/) + `tsconfig.node.json` (vite.config.ts)

## Prior Spec Decisions

14 specs completed, 2 confirmed (pending implementation):

| Spec                                    | Key Architectural Decisions                                                                                                                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nought-cobalt-design-system`           | Dark-mode only; Tailwind v4 `@theme`/`@utility`/`@layer` for design tokens; `--nc-*` CSS variable namespace; Space Grotesk font; 4px default border radius                                  |
| `guest-list-screen`                     | Atomic Design hierarchy (atoms/molecules/organisms); three-panel desktop layout (sidebar + main + detail); mobile single-column; `@tanstack/react-table` for desktop table                  |
| `guest-crud-flow`                       | react-hook-form for forms; localStorage persistence via stores; uuid for IDs; dedicated routes for add/edit (`/guests/new`, `/guests/:id/edit`); OutletContext for form data passing        |
| `seating-canvas`                        | react-zoom-pan-pinch for canvas; @dnd-kit/react for drag-and-drop; auto-generated NATO labels + badge IDs; geometry helpers for table/seat sizing                                           |
| `semantic-table-refactor`               | `@tanstack/react-table` column defs at module scope; `border-separate border-spacing-0` for styled tables                                                                                   |
| `sidebar-navigation`                    | Route-based navigation (`/` and `/seating-plan`) via LeftSidebar; removed query-param tabs                                                                                                  |
| `mobile-canvas`                         | vaul Drawer for mobile bottom sheets; useLongPress hook for touch drag; useReducer for mobile UI state machine                                                                              |
| `fix-mobile-seat-assignment`            | Bottom sheet (vaul Drawer) for mobile seat assignment instead of popover; touch+mouse event listeners                                                                                       |
| `refactor-codebase`                     | Thin App.tsx shell (G-40); layout routes own their OutletContext (G-38); `key` prop for state reset (G-35); dedicated utility files (G-36); useGuestStats hook; useDragEndHandler hook      |
| `replace-icons-with-react-icons`        | All icons from `react-icons/lu` (Lucide); `size` prop for dimensions                                                                                                                        |
| `update-dietary-flags-metrics`          | Replaced DIETARY FLAGS stat card with TOTAL GIFTS showing sum of guest gifts (€) and count                                                                                                  |
| `import-guests`                         | Dedicated route `/guests/import`; client-side CSV parsing (no external lib); all-or-nothing validation; `src/utils/csv-import.ts` utility; FileDropZone molecule; ImportGuestsPage organism |
| `export-import-project`                 | Export all localStorage data to versioned JSON; import with confirmation dialog and full data replacement; ProjectActionsSheet for mobile                                                   |
| `sticky-guest-form-actions` (confirmed) | Make guest form action bar sticky at bottom of viewport, always visible without scrolling                                                                                                   |

## Guardrails and Lessons Learned

Full guardrails documented in `generated/guardrails.md` (G-1 through G-46). Summary by category:

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
- **G-9**: Google Fonts must include preconnect
- **G-11**: All interactive elements must be keyboard accessible
- **G-13**: Use design system typography classes consistently
- **G-15**: Form inputs with validation must include `aria-invalid`
- **G-19**: Custom modals need keyboard + ARIA support
- **G-43**: Interactive `<div>` elements must have full keyboard support

### Component State & Lifecycle

- **G-44**: Do not unmount components that own pending dialog state
- **G-45**: Use function declarations (not arrow expressions) for component handlers
- **G-46**: Always set `reader.onerror` when using FileReader (extends G-42)

### React Patterns

- **G-16/G-25**: No `setState` inside `useEffect` — use sync state adjustment
- **G-17**: Single source of truth for data transformations
- **G-27**: `@tanstack/react-table` columns at module scope
- **G-29**: Clean up vestigial props after interface changes
- **G-30**: Verify component import graph after removing consumers
- **G-31**: Clean up timer refs on unmount
- **G-32**: Choose one responsive visibility strategy per element
- **G-33**: Align equivalent type definitions across components
- **G-35**: Use `key` prop to reset component state instead of `prevId` tracking
- **G-36**: Extract shared logic into dedicated utility files
- **G-37**: Remove dead exports after creating replacements
- **G-38**: Layout routes own their Outlet context
- **G-39**: Store functions are not hooks — don't call in render without memoization
- **G-40**: Thin layout shell App.tsx — no business logic
- **G-41**: G-16 exception — side effects justify `useEffect` with `setState`

### Icons

- **G-20**: All icons from `react-icons/lu` (Lucide) only
- **G-21**: Verify icon export names against actual package
- **G-22**: Use `size` prop for icon dimensions

### Code Quality

- **G-12/G-26**: No identical conditional branches
- **G-14**: Mobile-specific groups need contextual data
- **G-18**: Delete unused component files
- **G-23**: Store function signatures must match intended contract
- **G-24**: Spec is authoritative for literal values
- **G-34**: Touch event listeners must accompany mouse listeners
- **G-42**: Handle Promise rejections from File API reads
