# Codebase Context — Seating Plan

> Generated: 2026-04-05
> Purpose: Comprehensive context for technical planning and development agents.

---

## 1. Project Overview

A dark-themed, event seating plan management application for organizing guests and assigning them to tables. Two main views: **Guest List** (tabular CRUD) and **Seating Canvas** (visual 2D floor plan with DnD). Futuristic "Nought Cobalt" design system with uppercase labels, monospaced identifiers, NATO phonetic table naming.

Fully client-side SPA — no backend. Data persisted to `localStorage` with in-memory fallback. PWA support via service worker and web app manifest.

### Framework & Tooling

| Concern         | Technology                                                                                               |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| Language        | TypeScript 5.9, strict mode, `verbatimModuleSyntax`, `erasableSyntaxOnly`                                |
| Framework       | React 19.2 (with React Compiler ESLint rules)                                                            |
| Build tool      | Vite 8 (`@vitejs/plugin-react`, `@tailwindcss/vite`)                                                     |
| Styling         | Tailwind CSS 4 (v4 `@theme` + `@utility` directives)                                                     |
| Router          | react-router 7.14 (BrowserRouter, layout routes)                                                         |
| Drag & drop     | @dnd-kit/react 0.3                                                                                       |
| Table rendering | @tanstack/react-table 8.21                                                                               |
| Forms           | react-hook-form 7.72                                                                                     |
| Icons           | react-icons 5.6 (`react-icons/lu` — Lucide only)                                                         |
| Mobile drawers  | vaul 1.1                                                                                                 |
| Zoom/pan        | react-zoom-pan-pinch 3.7                                                                                 |
| IDs             | uuid 13                                                                                                  |
| Linting         | ESLint 9 + typescript-eslint + react-hooks + react-refresh + prettier                                    |
| Formatting      | Prettier 3.8 (`semi: false`, `singleQuote: true`, `trailingComma: all`, `tabWidth: 2`, `printWidth: 80`) |
| Pre-commit      | Husky (runs `prettier --check .` + `npm run lint`)                                                       |

### Package.json Scripts

| Script          | Command                      |
| --------------- | ---------------------------- |
| `dev`           | `vite --host`                |
| `build`         | `tsc -b && vite build`       |
| `lint`          | `eslint .`                   |
| `format`        | `prettier --write .`         |
| `format:check`  | `prettier --check .`         |
| `preview`       | `vite preview`               |
| `prepare`       | `husky`                      |
| `release`       | `./scripts/release.sh patch` |
| `release:minor` | `./scripts/release.sh minor` |
| `release:major` | `./scripts/release.sh major` |

### Directory Structure

```
src/
├── App.tsx                     # Thin layout shell (26 lines)
├── main.tsx                    # Router config, entry point (34 lines)
├── index.css                   # Tailwind config, design tokens, component styles (478 lines)
├── assets/
│   └── hero.png
├── components/
│   ├── atoms/                  # 11 files
│   │   ├── CanvasStatusBar.tsx
│   │   ├── FAB.tsx
│   │   ├── FormError.tsx
│   │   ├── IconButton.tsx
│   │   ├── SeatIndicator.tsx
│   │   ├── SeatSlot.tsx
│   │   ├── ShapeToggle.tsx
│   │   ├── StatCard.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── StatusIcon.tsx
│   │   └── TabBarItem.tsx
│   ├── molecules/              # 11 files
│   │   ├── CanvasTable.tsx
│   │   ├── CanvasToolbar.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── FileDropZone.tsx
│   │   ├── FormField.tsx
│   │   ├── FormSection.tsx
│   │   ├── GuestDetailSection.tsx
│   │   ├── GuestRow.tsx
│   │   ├── SeatAssignmentPopover.tsx
│   │   ├── SidebarNavItem.tsx
│   │   └── TableGroupHeader.tsx
│   └── organisms/              # 17 files
│       ├── BottomTabBar.tsx
│       ├── CanvasPropertiesPanel.tsx
│       ├── EmptyState.tsx
│       ├── GuestDetailPanel.tsx
│       ├── GuestForm.tsx
│       ├── GuestListFooterStats.tsx
│       ├── GuestListHeader.tsx
│       ├── GuestTable.tsx
│       ├── ImportGuestsPage.tsx
│       ├── LeftSidebar.tsx
│       ├── MobileGuestsSheet.tsx
│       ├── MobilePropertiesSheet.tsx
│       ├── MobileSeatAssignmentSheet.tsx
│       ├── ProjectActionsSheet.tsx
│       ├── SeatingCanvas.tsx
│       ├── TablePropertiesForm.tsx
│       └── TopNav.tsx
├── data/                       # Types, stores, utilities (10 files)
│   ├── canvas-utils.ts
│   ├── dnd-types.ts
│   ├── guest-store.ts
│   ├── guest-types.ts
│   ├── guest-utils.ts
│   ├── mock-guests.ts
│   ├── outlet-context.ts
│   ├── storage-utils.ts
│   ├── table-store.ts
│   └── table-types.ts
├── hooks/                      # 7 custom hooks
│   ├── useDragEndHandler.ts
│   ├── useGuestStats.ts
│   ├── useIsMobile.ts
│   ├── useOverlayPanel.ts
│   ├── useProjectImport.ts
│   ├── useTableState.ts
│   └── useTableTouchDrag.ts
├── pages/                      # 5 route-level views
│   ├── AddGuestPage.tsx
│   ├── EditGuestPage.tsx
│   ├── GuestListView.tsx
│   ├── ImportGuestsView.tsx
│   └── SeatingPlanView.tsx
└── utils/
    ├── csv-import.ts
    └── project-export.ts
```

---

## 2. Architecture & Patterns

### Routing Setup (`src/main.tsx`, 34 lines)

```
BrowserRouter
  └── Routes
      └── Route element={<App />}                    ← layout shell
          ├── Route path="guests/import"  → ImportGuestsView
          ├── Route element={<GuestListView />}       ← nested layout route
          │   ├── Route index → null
          │   ├── Route path="guests/new" → AddGuestPage
          │   └── Route path="guests/:id/edit" → EditGuestPage
          └── Route path="seating-plan"   → SeatingPlanView
```

| Path               | Component          | Description                                               |
| ------------------ | ------------------ | --------------------------------------------------------- |
| `/`                | `GuestListView`    | Guest list with header, table, footer stats, detail panel |
| `/guests/new`      | `AddGuestPage`     | Guest creation form (via Outlet + OutletContext)          |
| `/guests/:id/edit` | `EditGuestPage`    | Guest edit form (via Outlet + OutletContext)              |
| `/guests/import`   | `ImportGuestsView` | CSV import with file upload and validation                |
| `/seating-plan`    | `SeatingPlanView`  | Interactive canvas with DnD                               |

Key patterns:

- `App` is a thin layout shell (G-40): TopNav, Outlet, BottomTabBar, and conditionally ProjectActionsSheet for mobile.
- `GuestListView` is a **layout route** that owns guest state and provides `OutletContext` to child routes (G-38).
- Service worker registered on load (`/sw.js`).

### Component Hierarchy

```
App (layout shell, 26 lines)
├── TopNav (organism)              — always visible
├── Outlet
│   ├── GuestListView (page, layout route)
│   │   ├── LeftSidebar (organism, desktop only via CSS hidden md:flex)
│   │   ├── Main content area
│   │   │   ├── GuestListHeader, GuestTable, GuestListFooterStats (list view)
│   │   │   ├── EmptyState (when no guests)
│   │   │   └── Outlet → AddGuestPage | EditGuestPage (child routes)
│   │   ├── GuestDetailPanel (overlay, desktop)
│   │   └── FAB (mobile)
│   ├── SeatingPlanView (page)
│   │   ├── LeftSidebar (organism, desktop only)
│   │   ├── SeatingCanvas (organism)
│   │   ├── CanvasPropertiesPanel (overlay, desktop)
│   │   ├── MobilePropertiesSheet (mobile, vaul drawer)
│   │   └── MobileGuestsSheet (mobile, vaul drawer)
│   └── ImportGuestsView (page)
│       ├── LeftSidebar (organism, desktop only)
│       └── ImportGuestsPage (organism)
├── BottomTabBar (organism)        — mobile only (md:hidden, fixed bottom)
└── ProjectActionsSheet (organism) — mobile only, conditional
```

### State Management

- **No global state library** — all state via React `useState` + custom hooks.
- Data stores (`guest-store.ts`, `table-store.ts`) are plain functions reading/writing `localStorage` via `createStorage<T>()`.
- Route components initialize state with `useState(() => getGuests())` and manually re-read after mutations.
- **localStorage keys**:
  - `seating-plan:guests` — `Guest[]`
  - `seating-plan:tables` — `FloorTable[]`
  - `seating-plan:table-counter` — `number`

### Responsive Strategy

- Desktop sidebar: CSS `hidden md:flex`
- Mobile bottom tab bar: CSS `md:hidden`
- Mobile overflow menu: CSS `md:hidden` wrapper in TopNav
- Mobile sheets: JS conditional with `useIsMobile()` hook + vaul `<Drawer>`
- Breakpoint: `md` (768px), maps to `useIsMobile()` using `max-width: 767px`

---

## 3. Key Files — Detailed Analysis

### `src/App.tsx` (26 lines)

**Imports:**

```ts
import { useState } from 'react'
import { Outlet } from 'react-router'
import TopNav from './components/organisms/TopNav'
import BottomTabBar from './components/organisms/BottomTabBar'
import ProjectActionsSheet from './components/organisms/ProjectActionsSheet'
import { useIsMobile } from './hooks/useIsMobile'
```

**State:**

- `isProjectSheetOpen: boolean` — controls mobile ProjectActionsSheet visibility
- `isMobile: boolean` — from `useIsMobile()` hook

**Rendering:**

- Outer `div.flex.flex-col.h-screen.overflow-hidden`
  - `<TopNav onOpenProjectMenu={() => setIsProjectSheetOpen(true)} />`
  - `<div className="flex flex-1 overflow-hidden">` → `<Outlet />`
  - `<BottomTabBar />`
  - Conditional: `{isMobile && isProjectSheetOpen && <ProjectActionsSheet onClose={...} />}`

**Export:** `export default App`

---

### `src/main.tsx` (34 lines)

**Imports:**

```ts
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.tsx'
import GuestListView from './pages/GuestListView.tsx'
import SeatingPlanView from './pages/SeatingPlanView.tsx'
import AddGuestPage from './pages/AddGuestPage.tsx'
import EditGuestPage from './pages/EditGuestPage.tsx'
import ImportGuestsView from './pages/ImportGuestsView.tsx'
```

**Service Worker:** Registers `/sw.js` on window load.

**Export:** None (entry point).

---

### `src/utils/project-export.ts` (83 lines)

**Imports:**

```ts
import type { Guest } from '../data/guest-types'
import type { FloorTable } from '../data/table-types'
```

**Exported interface:**

```ts
export interface ProjectExport {
  version: number
  exportedAt: string
  data: {
    guests: Guest[]
    tables: FloorTable[]
    tableCounter: number
  }
}
```

**Exported functions:**

| Function                | Signature                                  | Description                                                                                                           |
| ----------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `generateProjectExport` | `(): string`                               | Reads all 3 localStorage keys, builds `ProjectExport` object, returns JSON string                                     |
| `validateProjectImport` | `(content: string): ProjectExport \| null` | Parses JSON, validates `version===1` + data shape; returns typed object or null                                       |
| `applyProjectImport`    | `(data: ProjectExport): void`              | Writes all three localStorage keys                                                                                    |
| `downloadProjectExport` | `(): void`                                 | Generates JSON, creates Blob, triggers download via hidden `<a>` element with filename `seating-plan-YYYY-MM-DD.json` |

**localStorage keys accessed:** `seating-plan:guests`, `seating-plan:tables`, `seating-plan:table-counter`

---

### `src/hooks/useProjectImport.ts` (69 lines)

**Imports:**

```ts
import { useState, useRef } from 'react'
import {
  validateProjectImport,
  applyProjectImport,
} from '../utils/project-export'
import type { ProjectExport } from '../utils/project-export'
```

**Returned API:**

```ts
{
  fileInputRef: React.RefObject<HTMLInputElement>
  importError: string | null
  pendingImport: ProjectExport | null
  openFilePicker: () => void
  handleFileSelected: (e: React.ChangeEvent<HTMLInputElement>) => void
  confirmImport: () => void      // Calls applyProjectImport + window.location.reload()
  cancelImport: () => void       // Clears pendingImport
  clearError: () => void         // Clears importError
}
```

**Key behavior:**

- `openFilePicker()` clears error, triggers `fileInputRef.current?.click()`
- `handleFileSelected()` reads file via `FileReader`, validates, sets either `pendingImport` or `importError`
- `confirmImport()` applies import and does a **full page reload** (`window.location.reload()`)
- Both `reader.onload` and `reader.onerror` are handled (per G-46)

---

### `src/components/organisms/LeftSidebar.tsx` (184 lines)

**Imports:**

```ts
import {
  LuUserPlus,
  LuPlus,
  LuGripVertical,
  LuUpload,
  LuDownload,
} from 'react-icons/lu'
import { useDraggable } from '@dnd-kit/react'
import { useLocation, useNavigate } from 'react-router'
import SidebarNavItem from '../molecules/SidebarNavItem'
import ConfirmDialog from '../molecules/ConfirmDialog'
import type { Guest } from '../../data/guest-types'
import type { FloorTable } from '../../data/table-types'
import { getUnassignedGuests } from '../../data/guest-utils'
import { DRAG_TYPE_GUEST } from '../../data/dnd-types'
import { downloadProjectExport } from '../../utils/project-export'
import { useProjectImport } from '../../hooks/useProjectImport'
```

**Props interface:**

```ts
interface Props {
  onAddGuest: () => void
  onImportGuests?: () => void
  onAddTable?: () => void
  guests?: Guest[]
  tables?: FloorTable[]
}
```

**Internal component:** `DraggableGuestItem({ guest }: { guest: Guest })` — renders draggable guest items in unassigned list on canvas view.

**Structure:**

- `<aside className="hidden md:flex flex-col min-w-55 bg-surface border-r border-border">`
  - **Session info section** (lines 74–78): hardcoded `SEATING_01` / `ACTIVE SESSION`
  - **Nav items section** (lines 80–92): two `<SidebarNavItem>` components:
    - "Listado de invitados" (active when NOT `/seating-plan`)
    - "Canvas" (active when `/seating-plan`)
  - **Bottom actions section** (lines 94–159, `mt-auto`):
    - **Canvas view** (`isCanvasView`): ADD TABLE button (`btn-primary`) + unassigned guests draggable list
    - **Guest list view**: ADD GUEST button (`btn-primary`) + optional IMPORT_CSV button (`btn-secondary`)
    - Separator (`border-t border-border my-3`)
    - EXPORT_PROJECT button (`btn-secondary`) → `downloadProjectExport()`
    - IMPORT_PROJECT button (`btn-secondary`) → `openFilePicker()`
    - Import error text (conditional, `text-caption text-red-400`)
  - `ConfirmDialog` for pending import (conditional, lines 161–171)
  - Hidden `<input type="file" accept=".json">` for file picker (lines 173–179)

**Key detail:** The sidebar is **desktop-only** (CSS `hidden md:flex`). Uses `useProjectImport()` hook directly. Navigation is handled internally via `useNavigate()`.

**Export:** `export default LeftSidebar`

---

### `src/components/organisms/TopNav.tsx` (33 lines)

**Imports:**

```ts
import { LuEllipsisVertical } from 'react-icons/lu'
import IconButton from '../atoms/IconButton'
```

**Props interface:**

```ts
interface Props {
  onOpenProjectMenu?: () => void
}
```

**Structure:**

- `<nav className="w-full h-14 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0">`
- Left: green status dot (mobile only, `md:hidden`) + "PLANNER_V1.0" label (`text-label font-semibold text-foreground-heading tracking-wider`)
- Right: overflow menu `IconButton` with `LuEllipsisVertical` — **mobile only** (`md:hidden` wrapper), only rendered if `onOpenProjectMenu` is provided

**Export:** `export default TopNav`

---

### `src/components/organisms/BottomTabBar.tsx` (30 lines)

**Imports:**

```ts
import { LuSquarePen, LuUser } from 'react-icons/lu'
import { useLocation, useNavigate } from 'react-router'
import TabBarItem from '../atoms/TabBarItem'
```

**Props:** None (reads from router hooks internally).

**Active state logic:** `const isCanvasView = location.pathname === '/seating-plan'`

**Structure:**

- `<nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border">`
- Two `<TabBarItem>` components:
  - CANVAS (`LuSquarePen`, active when on `/seating-plan`)
  - GUESTS (`LuUser`, active otherwise)

**Export:** `export default BottomTabBar`

---

### `src/components/organisms/ProjectActionsSheet.tsx` (129 lines)

**Imports:**

```ts
import { useState } from 'react'
import { Drawer } from 'vaul'
import { LuX, LuDownload, LuUpload } from 'react-icons/lu'
import IconButton from '../atoms/IconButton'
import ConfirmDialog from '../molecules/ConfirmDialog'
import { downloadProjectExport } from '../../utils/project-export'
import { useProjectImport } from '../../hooks/useProjectImport'
```

**Props interface:**

```ts
interface Props {
  onClose: () => void
}
```

**State:**

- `drawerOpen: boolean` (initially `true`) — local state to allow closing drawer while keeping component mounted for dialogs (G-44)
- All `useProjectImport()` state (`fileInputRef`, `importError`, `pendingImport`, `openFilePicker`, `handleFileSelected`, `confirmImport`, `cancelImport`, `clearError`)

**Handlers (function declarations per G-45):**

- `handleExport()` — calls `downloadProjectExport()`, closes drawer, calls `onClose()`

**Structure:**

- `<Drawer.Root open={drawerOpen}>` with `onOpenChange` that prevents unmount when dialogs are pending (G-44)
  - Overlay + Content with rounded top, handle
  - Header: "PROJECT" label + close IconButton
  - Body: EXPORT_PROJECT button (`btn-secondary`) + IMPORT_PROJECT button (`btn-secondary`)
- Hidden `<input type="file" accept=".json">`
- Conditional `ConfirmDialog` for pending import confirmation
- Conditional `ConfirmDialog` for import error display

**Key detail:** The `onOpenChange` handler only calls `onClose()` if no `pendingImport` and no `importError` — otherwise it only sets `drawerOpen=false` to visually close the drawer while keeping the component mounted for dialog rendering.

**Export:** `export default ProjectActionsSheet`

---

### `src/components/molecules/ConfirmDialog.tsx` (52 lines)

**Imports:**

```ts
import { LuTriangleAlert } from 'react-icons/lu'
```

**Props interface:**

```ts
interface Props {
  title: string
  targetName: string
  message: string
  confirmLabel?: string // default: 'CONFIRM_DEL'
  cancelLabel?: string // default: 'CANCEL'
  onConfirm: () => void
  onCancel: () => void
}
```

**Structure:**

- Fixed fullscreen backdrop (`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm`), click-to-cancel on backdrop
- Modal card (`bg-surface border border-border rounded max-w-md w-full mx-4 p-6`):
  - Warning icon (`LuTriangleAlert`, `text-red-400`) + title (`text-heading-5 text-foreground-heading`)
  - "TARGET: {targetName}" (`text-body-sm text-foreground`)
  - Message (`text-body-sm text-foreground-muted`)
  - Two buttons: cancel (`btn-secondary`) + confirm (`btn-destructive`)

**Export:** `export default ConfirmDialog`

---

### `src/components/molecules/SidebarNavItem.tsx` (22 lines)

**Props interface:**

```ts
interface Props {
  label: string
  isActive: boolean
  onClick?: () => void
}
```

**Implementation:**

- Renders a `<div>` with `cursor-pointer`, `text-body-sm`, conditional active/inactive classes
- Active: `text-primary bg-primary/10 border-l-2 border-l-primary`
- Inactive: `text-foreground-muted hover:text-foreground hover:bg-surface-elevated border-l-2 border-l-transparent`

**Export:** `export default SidebarNavItem`

---

### `src/components/atoms/TabBarItem.tsx` (34 lines)

**Imports:**

```ts
import type { ReactNode } from 'react'
```

**Props interface:**

```ts
interface Props {
  icon: ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}
```

**Implementation:**

- Renders a `<button>` with flex column layout
- Active icon: `bg-primary text-primary-foreground rounded-lg px-3 py-1`
- Active label: `text-primary`
- Inactive: `text-foreground-muted`
- Label uses `text-caption` class

**Export:** `export default TabBarItem`

---

### `src/components/atoms/IconButton.tsx` (21 lines)

**Imports:**

```ts
import type { ReactNode } from 'react'
```

**Props interface:**

```ts
interface Props {
  onClick?: () => void
  label: string
  children: ReactNode
}
```

**Implementation:**

- Renders a `<button>` with `aria-label={label}`, `p-2 rounded`
- Hover: `hover:bg-surface-elevated`, `hover:text-foreground`
- Focus: `focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2`
- Default: `text-foreground-muted`

**Export:** `export default IconButton`

---

### `src/pages/GuestListView.tsx` (194 lines)

**Imports:**

```ts
import { useState, useCallback } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router'
import {
  getGuests,
  addGuest as storeAddGuest,
  updateGuest as storeUpdateGuest,
  deleteGuest as storeDeleteGuest,
} from '../data/guest-store'
import type { Guest } from '../data/guest-types'
import { useGuestStats } from '../hooks/useGuestStats'
import { useOverlayPanel } from '../hooks/useOverlayPanel'
import {
  getTables,
  clearGuestAssignments as storeClearGuestAssignments,
} from '../data/table-store'
import LeftSidebar from '../components/organisms/LeftSidebar'
import GuestListHeader from '../components/organisms/GuestListHeader'
import GuestTable from '../components/organisms/GuestTable'
import GuestListFooterStats from '../components/organisms/GuestListFooterStats'
import GuestDetailPanel from '../components/organisms/GuestDetailPanel'
import FAB from '../components/atoms/FAB'
import EmptyState from '../components/organisms/EmptyState'
```

**LeftSidebar usage:**

```tsx
<LeftSidebar
  onAddGuest={handleNavigateToAdd}
  onImportGuests={handleNavigateToImport}
  onAddTable={handleSidebarAddTable}
  guests={guests}
  tables={tables}
/>
```

All optional props provided. `onImportGuests` navigates to `/guests/import`. `onAddTable` navigates to `/seating-plan`.

**Key state:**

- `guests` (Guest[]) — initialized from `getGuests()`, re-read after CRUD
- `selectedGuestId` (string | null)
- `prevLocationState` — for "adjusting state during render" pattern (G-16)
- `displayedGuest` — preserved for exit animation of overlay panel
- `useGuestStats(guests)` — memoized statistics
- `useOverlayPanel(isPanelOpen, handleClosePanel)` — overlay animation state

**Export:** `export default GuestListView`

---

### `src/pages/SeatingPlanView.tsx` (195 lines)

**Imports:**

```ts
import { useState, useCallback, useReducer } from 'react'
import { useNavigate } from 'react-router'
import { DragDropProvider } from '@dnd-kit/react'
import { getGuests } from '../data/guest-store'
import type { Guest } from '../data/guest-types'
import type { FloorTable } from '../data/table-types'
import { getUnassignedGuests } from '../data/guest-utils'
import { useDragEndHandler } from '../hooks/useDragEndHandler'
import { useTableState } from '../hooks/useTableState'
import { useOverlayPanel } from '../hooks/useOverlayPanel'
import { useIsMobile } from '../hooks/useIsMobile'
import SeatingCanvas from '../components/organisms/SeatingCanvas'
import CanvasPropertiesPanel from '../components/organisms/CanvasPropertiesPanel'
import LeftSidebar from '../components/organisms/LeftSidebar'
import MobilePropertiesSheet from '../components/organisms/MobilePropertiesSheet'
import MobileGuestsSheet from '../components/organisms/MobileGuestsSheet'
import { LuUsers, LuSettings2 } from 'react-icons/lu'
```

**LeftSidebar usage:**

```tsx
<LeftSidebar
  onAddGuest={handleNavigateToAdd}
  onAddTable={handleSidebarAddTable}
  guests={guests}
  tables={tables}
/>
```

`onImportGuests` is **NOT** passed → IMPORT_CSV button won't render in sidebar on canvas view.

**Key patterns:**

- Mobile UI managed via `useReducer` with `MobileSheet` state machine (`'none' | 'properties' | 'guests'`)
- `DragDropProvider` wraps entire view
- `useTableState()` hook for all table CRUD + seat operations

**Export:** `export default SeatingPlanView`

---

### `src/pages/ImportGuestsView.tsx` (42 lines)

**Imports:**

```ts
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { getGuests } from '../data/guest-store'
import type { Guest } from '../data/guest-types'
import { getTables } from '../data/table-store'
import LeftSidebar from '../components/organisms/LeftSidebar'
import ImportGuestsPage from '../components/organisms/ImportGuestsPage'
```

**LeftSidebar usage:**

```tsx
<LeftSidebar
  onAddGuest={handleNavigateToAdd}
  onAddTable={handleSidebarAddTable}
  guests={guests}
  tables={tables}
/>
```

`onImportGuests` is **NOT** passed.

**Export:** `export default ImportGuestsView`

---

### `src/data/guest-store.ts` (49 lines)

**Imports:**

```ts
import type { Guest } from './guest-types'
import { v4 as uuidv4 } from 'uuid'
import { createStorage } from './storage-utils'
```

**localStorage key:** `seating-plan:guests` (via `createStorage<Guest[]>(STORAGE_KEY, [])`)

**Exported functions:**

| Function       | Signature                                                            | Description                                    |
| -------------- | -------------------------------------------------------------------- | ---------------------------------------------- |
| `getGuests`    | `(): Guest[]`                                                        | Read all guests                                |
| `getGuestById` | `(id: string): Guest \| undefined`                                   | Find guest by ID                               |
| `addGuest`     | `(data: Omit<Guest, 'id'>): Guest`                                   | Create with UUID                               |
| `updateGuest`  | `(id: string, data: Partial<Omit<Guest, 'id'>>): Guest \| undefined` | Merge update with special `dietary` deep merge |
| `deleteGuest`  | `(id: string): boolean`                                              | Filter-based deletion                          |

---

### `src/data/table-store.ts` (215 lines)

**Imports:**

```ts
import type { FloorTable, SeatAssignment } from './table-types'
import { NATO_LABELS } from './table-types'
import { v4 as uuidv4 } from 'uuid'
import { createStorage } from './storage-utils'
```

**localStorage keys:**

- `seating-plan:tables` (via `createStorage<FloorTable[]>('seating-plan:tables', [])`)
- `seating-plan:table-counter` (via `createStorage<number>('seating-plan:table-counter', 0)`)

**Exported functions:**

| Function                | Signature                                                                                                      | Description                                                         |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `getTables`             | `(): FloorTable[]`                                                                                             | Read all tables                                                     |
| `getTableById`          | `(id: string): FloorTable \| undefined`                                                                        | Find table by ID                                                    |
| `addTable`              | `(data: Omit<FloorTable, 'id' \| 'badgeId' \| 'label' \| 'seats'> & { seats?: SeatAssignment[] }): FloorTable` | Create with auto-generated badgeId (`T01`, `T02`...) and NATO label |
| `updateTable`           | `(id: string, data: Partial<Omit<FloorTable, 'id' \| 'badgeId'>>): FloorTable \| undefined`                    | Update with rotation clamping + seat-count reduction auto-unassign  |
| `deleteTable`           | `(id: string): boolean`                                                                                        | Filter-based deletion                                               |
| `assignGuestToSeat`     | `(tableId: string, seatIndex: number, guestId: string): FloorTable \| undefined`                               | Clears guest from ALL tables first, then assigns                    |
| `unassignSeat`          | `(tableId: string, seatIndex: number): FloorTable \| undefined`                                                | Remove seat assignment                                              |
| `swapSeats`             | `(sourceTableId, sourceSeatIndex, targetTableId, targetSeatIndex): void`                                       | Swap two seats (same or cross-table)                                |
| `findFirstEmptySeat`    | `(table: FloorTable): number \| null`                                                                          | Find first empty seat index                                         |
| `clearGuestAssignments` | `(guestId: string): void`                                                                                      | Remove guest from all tables                                        |

---

### Type Definitions

**`src/data/guest-types.ts` (13 lines):**

```ts
export type GuestStatus = 'CONFIRMED' | 'PENDING' | 'DECLINED'

export interface Guest {
  id: string
  firstName: string
  lastName: string
  status: GuestStatus
  dietary: {
    type: string | null
    notes: string | null
  }
  gift: number | null
}
```

**`src/data/table-types.ts` (131 lines):**

```ts
export type TableShape = 'rectangular' | 'circular'

export interface SeatAssignment {
  seatIndex: number
  guestId: string
}

export interface FloorTable {
  id: string
  badgeId: string
  label: string
  shape: TableShape
  seatCount: number
  x: number
  y: number
  rotation: number
  seats: SeatAssignment[]
}
```

Also exports: `SEAT_SPACING`, `TABLE_PADDING`, `SEAT_RADIUS`, `MIN_RECT_WIDTH`, `MIN_RECT_HEIGHT`, `MIN_CIRCLE_DIAMETER`, `NATO_LABELS` (string[]), and geometry helper functions (`getRectTableSize`, `getCircleTableDiameter`, `getSeatPositions`).

**`src/data/storage-utils.ts` (24 lines):**

```ts
export function createStorage<T>(
  key: string,
  fallbackValue: T,
): {
  read(): T
  write(value: T): void
}
```

Uses `localStorage` with try/catch and in-memory fallback on errors.

**`src/data/dnd-types.ts` (66 lines):**

- Constants: `DRAG_TYPE_GUEST = 'guest'`, `DRAG_TYPE_SEAT = 'seat'`
- Interfaces: `DragGuestData`, `DragSeatData`, `DropSeatData`, `DropTableData`
- Type guards: `isDragGuestData()`, `isDragSeatData()`, `isDropSeatData()`, `isDropTableData()`

**`src/data/guest-utils.ts` (29 lines):**

- `getUnassignedGuests(guests, tables): Guest[]`
- `getGuestSeatLocation(guestId, tables): { tableId, tableLabel, seatIndex } | null`

### Custom Hooks

**`src/hooks/useGuestStats.ts` (24 lines):**

```ts
export function useGuestStats(guests: Guest[]): {
  confirmedCount: number
  pendingCount: number
  totalGuests: number
  confirmationRate: number
  totalGifts: number
  giftCount: number
  waitlistCount: number
}
```

Uses `useMemo` for computation.

**`src/hooks/useOverlayPanel.ts` (49 lines):**

```ts
export function useOverlayPanel(
  isOpen: boolean,
  onClose: () => void,
): {
  visible: boolean
  isClosing: boolean
  onAnimationEnd: () => void
}
```

Three-phase state machine (`'closed' | 'open' | 'closing'`). Handles Escape key. Uses "adjusting state during render" pattern for `prevIsOpen`.

**`src/hooks/useIsMobile.ts` (18 lines):**

```ts
export function useIsMobile(): boolean
```

Based on `matchMedia('(max-width: 767px)')`.

---

## 4. Design System

### Typography Utility Classes

| Class            | Size | Weight | Line-height | Letter-spacing |
| ---------------- | ---- | ------ | ----------- | -------------- |
| `text-display`   | 56px | 700    | 1.1         | -1.68px        |
| `text-heading-1` | 40px | 700    | 1.15        | -1.2px         |
| `text-heading-2` | 32px | 700    | 1.2         | -0.64px        |
| `text-heading-3` | 24px | 600    | 1.3         | -0.24px        |
| `text-heading-4` | 20px | 600    | 1.35        | 0              |
| `text-heading-5` | 16px | 600    | 1.4         | 0              |
| `text-body-lg`   | 18px | 400    | 1.6         | 0.18px         |
| `text-body`      | 16px | 400    | 1.5         | 0.16px         |
| `text-body-sm`   | 14px | 400    | 1.45        | 0.14px         |
| `text-caption`   | 12px | 400    | 1.4         | 0.12px         |
| `text-label`     | 12px | 500    | 1.2         | 0.8px          |
| `text-code`      | 14px | 400    | 1.5         | 0, monospace   |

### Component CSS Classes

| Class              | Purpose                                                       |
| ------------------ | ------------------------------------------------------------- |
| `.btn-primary`     | Primary action (cobalt bg, white text, 10px 20px padding)     |
| `.btn-secondary`   | Secondary (transparent bg, border, foreground text)           |
| `.btn-ghost`       | Ghost (no border, muted text, hover reveals bg)               |
| `.btn-destructive` | Destructive (red-600 bg, white text)                          |
| `.card`            | Card container (surface bg, border, 24px padding, 4px radius) |
| `.input`           | Form input (surface bg, border, focus ring, 8px 12px padding) |
| `.badge`           | Badge (cobalt-400 text, cobalt-950 bg, 2px 8px padding)       |

### Semantic Color Tokens

| Tailwind Class                | CSS Variable                 | Resolves To            |
| ----------------------------- | ---------------------------- | ---------------------- |
| `bg-background`               | `--color-background`         | gray-900 (#0e0e0e)     |
| `bg-surface`                  | `--color-surface`            | gray-850 (#131313)     |
| `bg-surface-elevated`         | `--color-surface-elevated`   | gray-800 (#1a1a1a)     |
| `text-foreground`             | `--color-foreground`         | gray-100 (#e0e0e0)     |
| `text-foreground-muted`       | `--color-foreground-muted`   | gray-500 (#6b6b6b)     |
| `text-foreground-heading`     | `--color-foreground-heading` | gray-50 (#f0f0f0)      |
| `border-border`               | `--color-border`             | rgba(67,70,86,0.15)    |
| `bg-primary` / `text-primary` | `--color-primary`            | cobalt-600 (#0057ff)   |
| `bg-primary-hover`            | `--color-primary-hover`      | cobalt-700 (#0044cc)   |
| `text-primary-foreground`     | `--color-primary-foreground` | #ffffff                |
| `outline-ring`                | `--color-ring`               | cobalt-500 (#3377ff)   |
| `text-red-400`                | Tailwind default             | Error/destructive text |
| `text-muted`                  | `--color-muted`              | gray-500               |

### Border Radius Tokens

| Class        | Value         |
| ------------ | ------------- |
| `rounded`    | 4px (default) |
| `rounded-sm` | 2px           |
| `rounded-md` | 4px           |
| `rounded-lg` | 8px           |
| `rounded-xl` | 12px          |

### Animations

| Tailwind Class                         | Animation                                   |
| -------------------------------------- | ------------------------------------------- |
| `animate-slide-in-right`               | 200ms ease-out translateX(100% → 0)         |
| `animate-slide-out-right`              | 150ms ease-in translateX(0 → 100%) forwards |
| `animate-backdrop-in`                  | 200ms ease-out opacity(0 → 1)               |
| `animate-backdrop-out`                 | 150ms ease-in opacity(1 → 0) forwards       |
| `animate-[fadeSlideUp_200ms_ease-out]` | Inline keyframe for FABs                    |

---

## 5. Conventions & Patterns

### Import Style

- **Named imports** for utilities, hooks, types, icons: `import { useState } from 'react'`
- **Default imports** for components: `import TopNav from './components/organisms/TopNav'`
- **`import type`** required for type-only imports (enforced by `verbatimModuleSyntax`)
- Icons always from `react-icons/lu` (Lucide family only, per G-20)
- Relative imports throughout (no path aliases)

### Code Formatting

- No semicolons (`semi: false`)
- Single quotes (`singleQuote: true`)
- Trailing commas everywhere (`trailingComma: all`)
- 2-space indent (`tabWidth: 2`)
- 80-character print width (`printWidth: 80`)

### Component Export Pattern

- All components use **`export default ComponentName`** at the bottom of the file
- Hooks use **named exports**: `export function useXxx()`
- Store functions use **named exports**: `export function getGuests()`
- Types use **named exports**: `export interface Guest`, `export type GuestStatus`
- Exception: `GuestRow.tsx` exports both default + named `{ GuestRowMobile }`

### File Naming Conventions

- Components: PascalCase (`LeftSidebar.tsx`, `IconButton.tsx`)
- Hooks: camelCase with `use` prefix (`useIsMobile.ts`, `useProjectImport.ts`)
- Data/utils: kebab-case (`guest-store.ts`, `project-export.ts`, `storage-utils.ts`)
- Types files: kebab-case with `-types` suffix (`guest-types.ts`, `table-types.ts`)

### Handler Naming

- Function declarations inside components (per G-45): `function handleExport() { ... }`
- Callback props: `onXxx` prefix (`onClose`, `onAddGuest`, `onUpdate`)
- Store-wrapped handlers: alias with `store` prefix to avoid shadowing: `import { addGuest as storeAddGuest }`

### UI/Text Conventions

- All user-facing text is **UPPERCASE** with underscore separators (sci-fi aesthetic): `"NO_RECORDS // INITIALIZE_DB"`
- Icon sizing via `size` prop, not CSS classes (G-22)

---

## 6. Existing Guardrails

Full document at `generated/guardrails.md` (300 lines, 49 guardrails: G-1 through G-49).

### Summary Table

| ID       | Category | Summary                                                            |
| -------- | -------- | ------------------------------------------------------------------ |
| **G-1**  | CSS      | `@import 'tailwindcss'` must be first line of `index.css`          |
| **G-2**  | CSS      | `@theme` for Tailwind utilities, `:root` for direct CSS vars       |
| **G-3**  | CSS      | Always use `var(--nc-*)` namespace for custom CSS                  |
| **G-4**  | CSS      | Dark mode only — no `prefers-color-scheme`                         |
| **G-5**  | CSS      | Default border radius 4px                                          |
| **G-6**  | CSS      | Use `@utility` for multi-property custom utilities                 |
| **G-7**  | CSS      | Use `@layer components` for component base styles                  |
| **G-8**  | A11y     | `focus-visible` for buttons, `focus` for inputs                    |
| **G-9**  | Perf     | Google Fonts must include preconnect                               |
| **G-10** | CSS      | Grep all `src/` when renaming CSS variables                        |
| **G-11** | A11y     | All interactive elements must be keyboard accessible               |
| **G-12** | Code     | No identical conditional branches (ternaries)                      |
| **G-13** | A11y     | Use design system typography classes consistently                  |
| **G-14** | Code     | Mobile-specific groups need contextual data                        |
| **G-15** | A11y     | Form inputs with validation must include `aria-invalid`            |
| **G-16** | React    | Avoid `setState` in `useEffect` — use synchronous state adjustment |
| **G-17** | React    | Single source of truth for data transformations                    |
| **G-18** | Code     | Delete unused component files                                      |
| **G-19** | A11y     | Custom modal dialogs need keyboard + ARIA support                  |
| **G-20** | Icons    | All icons from `react-icons/lu` (Lucide) only                      |
| **G-21** | Icons    | Verify icon export names against actual package                    |
| **G-22** | Icons    | Use `size` prop for icon dimensions                                |
| **G-23** | Code     | Store function signatures must match intended contract             |
| **G-24** | Code     | Spec is authoritative for literal values                           |
| **G-25** | React    | G-16 applies even when `useEffect` seems justified                 |
| **G-26** | Code     | Collapse identical conditional branches                            |
| **G-27** | React    | `@tanstack/react-table` columns at module scope                    |
| **G-28** | CSS      | `border-separate` + `border-spacing-0` for styled tables           |
| **G-29** | React    | Clean up vestigial props after interface changes                   |
| **G-30** | React    | Verify import graph after removing consumers                       |
| **G-31** | React    | Clean up timer refs on unmount                                     |
| **G-32** | React    | Choose one responsive visibility strategy per element              |
| **G-33** | React    | Align equivalent type definitions across components                |
| **G-34** | Code     | Touch event listeners must accompany mouse listeners               |
| **G-35** | React    | Use `key` prop to reset component state                            |
| **G-36** | Code     | Extract shared logic into dedicated utility files                  |
| **G-37** | Code     | Remove dead exports after creating replacements                    |
| **G-38** | React    | Layout routes own their Outlet context                             |
| **G-39** | React    | Store functions are not hooks — memoize in render                  |
| **G-40** | React    | Thin App.tsx layout shell — no business logic                      |
| **G-41** | React    | Side effects justify `useEffect` with `setState` (G-16 exception)  |
| **G-42** | Code     | Handle Promise rejections from File API reads                      |
| **G-43** | A11y     | Interactive `<div>` must have full keyboard support                |
| **G-44** | React    | Do not unmount components that own pending dialog state            |
| **G-45** | Code     | Function declarations for component handlers                       |
| **G-46** | Code     | Always set `reader.onerror` when using FileReader                  |
| **G-47** | Code     | Do not include out-of-scope changes in feature commits             |
| **G-48** | React    | Do not read/write `useRef.current` during render — use `useState`  |
| **G-49** | React    | Stabilize callback props with `useCallback`                        |
