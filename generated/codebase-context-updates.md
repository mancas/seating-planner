# Codebase Context Updates — Sidebar Navigation

Updates to `generated/codebase-context.md` based on validated sidebar navigation implementation.

---

## Changes to Routing Architecture

Replace the current routing architecture section with:

- `main.tsx` wraps `<App />` in `<BrowserRouter>` with `<Routes>`
- `<App>` is a layout route (`<Route element={<App />}>`) with child routes:
  - `<Route index element={null} />` — default (guest list rendered by App itself)
  - `<Route path="seating-plan" element={null} />` — canvas view (rendered by App based on pathname)
  - `<Route path="guests/new" element={<AddGuestPage />} />`
  - `<Route path="guests/:id/edit" element={<EditGuestPage />} />`
- `App.tsx` renders `<Outlet>` for child routes in the main content area when `isChildRoute` is true
- Outlet context passes `{ guests, onAdd, onUpdate, onDelete, onCancel }` to child pages
- **View switching uses route-based navigation**: `/` for guest list, `/seating-plan` for canvas. No query params.
- Active view derived from `useLocation().pathname` in each component independently (no prop threading)
- Canvas view wraps content in `<DragDropProvider>` for DnD support

## Changes to State Management

Update state management section — remove references to `searchQuery`, `activeTab`, `useSearchParams`:

- **State management**: Local component state via `useState` in `App.tsx`. No global state library. `App` owns `guests` (read from localStorage on mount) and `selectedGuestId`. Active view (`isCanvasView`) is derived from `useLocation().pathname` — not stored as state. Table state managed via `useTableState` custom hook. Data and callbacks passed down as props. Child routes receive data via `useOutletContext`.

## Changes to Component Descriptions

Update the following in the file structure:

```
├── TopNav.tsx          (brand text + LuSettings + avatar — no props)
├── LeftSidebar.tsx     (2 route-based nav links + ADD GUEST/ADD TABLE buttons, desktop-only, draggable guests, derives active state via useLocation)
├── BottomTabBar.tsx    (4-tab mobile nav bar, fixed bottom, route-based navigation for CANVAS/GUESTS, TOOLS/MORE are placeholders)
```

## Changes to Architectural Patterns — Structure

Update the structure description:

- **Structure**: Single-page application (SPA) with React + BrowserRouter. App shell with nested route layout: `<App>` is a layout route rendering `<Outlet>` for child routes (`/guests/new`, `/guests/:id/edit`). **Route-based view switching**: `/` renders guest list, `/seating-plan` renders canvas. Three-panel desktop layout (TopNav, LeftSidebar with navigation links, main content + optional detail/properties panel). Mobile layout with bottom tab bar, FAB, and table-grouped guest list. Responsive breakpoint at 768px (`md:` Tailwind prefix).

## Changes to Prior Spec Decisions

Update the Sidebar Navigation entry status:

### Spec: Sidebar Navigation — Status: Completed (2026-04-03)

Key architectural decisions:

1. **DD-1: Route-based navigation** — `/` and `/seating-plan` as proper React Router routes, replacing `/?tab=guests` and `/?tab=canvas`.
2. **DD-2: Sidebar as primary navigation** — Two links: "Listado de invitados" (`/`) and "Canvas" (`/seating-plan`). TopNav tab selector and search input removed.
3. **DD-3: Navigation link labels** — "Listado de invitados" and "Canvas" (not uppercase cyberpunk style — explicit user preference).
4. **DD-4: Route path** — `/seating-plan` for canvas view (kebab-case, correct English spelling).
5. **DD-5: Active state from route path** — Derive active view from `useLocation().pathname === '/seating-plan'` in each component independently. `!isCanvasView` covers all guest-domain routes (`/`, `/guests/new`, `/guests/:id/edit`).
6. **DD-6: Reuse SidebarNavItem** — Existing molecule component with `label`, `isActive`, `onClick` props.
7. **DD-7: BottomTabBar self-contained** — Uses `useLocation` and `useNavigate` internally. No props.

## Removed Patterns

The following patterns no longer exist in the codebase:

- `useSearchParams` for tab switching — **removed** (no file imports or uses `useSearchParams`)
- `activeTab` prop threading from `App` → `TopNav`/`LeftSidebar`/`BottomTabBar` — **removed**
- `onTabChange` callback prop — **removed**
- `searchQuery` state in `App.tsx` — **removed** (search functionality removed from TopNav)
- `filteredGuests` computation in `App.tsx` — **removed**
- `NavLink` atom import in `TopNav.tsx` — **removed** (component file still exists but has zero consumers)
- `SearchInput` atom import in `TopNav.tsx` — **removed** (component file may have zero consumers)

## New Guardrails

See `generated/guardrails.md` for G-29 and G-30.
