# Spec: Sidebar Navigation

## Metadata

- **Slug**: `sidebar-navigation`
- **Date**: 2026-04-03
- **Status**: Completed
- **Author**: User
- **Related specs**: [spec/guest-list-screen.md](./guest-list-screen.md), [spec/seating-canvas.md](./seating-canvas.md), [spec/guest-crud-flow.md](./guest-crud-flow.md)

## Description

Migrate the app's primary view navigation from the TopNav tab selector to the LeftSidebar, and switch from query-param-based tab switching (`/?tab=guests`, `/?tab=canvas`) to route-based navigation (`/` for guest list, `/seating-plan` for canvas). The TopNav's CANVAS / GUEST LIST tab links are removed entirely. The LeftSidebar gains two navigation links that serve as the sole mechanism for switching between the two main views. All other existing sidebar nav items (PROPERTIES, LAYOUT, OBJECTS, EXPORT) are removed.

### Core Changes

1. **Remove TopNav tab selector and search input**: The center section of `TopNav` currently renders two `NavLink` components ("CANVAS" and "GUEST LIST") for switching between views via query params. This section is removed entirely. The search input is also removed. The TopNav retains only: brand text (PLANNER_V1.0), settings icon, and user avatar.

2. **Add sidebar navigation links**: The LeftSidebar replaces its current nav items (PROPERTIES, LAYOUT, OBJECTS, EXPORT) with two route-based links:
   - **"Listado de invitados"** → navigates to `/` (root route, renders the guest list)
   - **"Canvas"** → navigates to `/seating-plan` (renders the seating canvas)
     The active link is determined by the current route path (not query params).

3. **Route-based navigation**: Replace the `?tab=guests` / `?tab=canvas` query-param mechanism with proper React Router routes:
   - `/` → Guest list view (default)
   - `/seating-plan` → Seating canvas view
   - `/guests/new` and `/guests/:id/edit` routes remain unchanged
     All internal navigation that previously used `setSearchParams({ tab: 'canvas' })` or `setSearchParams({ tab: 'guests' })` now uses `navigate('/')` or `navigate('/seating-plan')` respectively.

4. **Remove BottomTabBar view switching for CANVAS/GUESTS**: The mobile BottomTabBar currently has CANVAS, GUESTS, TOOLS, MORE tabs. The CANVAS and GUESTS tabs are replaced by the sidebar approach. On mobile, the sidebar is hidden, so the BottomTabBar retains its navigation role but now uses route-based links (`/` and `/seating-plan`) instead of query params.

## User Stories

1. As a **wedding planner**, I want to switch between the guest list and the seating canvas via sidebar links so that the primary navigation is always visible in the sidebar.
2. As a **wedding planner**, I want a cleaner top navigation bar without tab selectors so that the navbar focuses on brand, search, and settings.
3. As a **wedding planner on mobile**, I want the bottom tab bar to still let me switch between views so that I can navigate on small screens where the sidebar is hidden.

## Acceptance Criteria

### TopNav Changes

1. GIVEN the app is loaded WHEN viewing the TopNav THEN the center section with "CANVAS" and "GUEST LIST" NavLink buttons is no longer present, and the search input is no longer present. The TopNav shows only: brand text (left), settings icon (right), and user avatar (right).

2. GIVEN the TopNav is rendered WHEN the user is on any route THEN no tab-switching UI or search input is visible in the TopNav.

### Sidebar Navigation Links

3. GIVEN the app is loaded at `/` WHEN viewing the LeftSidebar THEN two navigation links are visible: "Listado de invitados" and "Canvas". The "Listado de invitados" link has the active state (cobalt highlight).

4. GIVEN the app is loaded at `/seating-plan` WHEN viewing the LeftSidebar THEN the "Canvas" link has the active state (cobalt highlight) and "Listado de invitados" does not.

5. GIVEN the LeftSidebar is displayed WHEN the user clicks "Canvas" THEN the browser navigates to `/seating-plan` and the seating canvas view is rendered.

6. GIVEN the LeftSidebar is displayed WHEN the user clicks "Listado de invitados" THEN the browser navigates to `/` and the guest list view is rendered.

7. GIVEN the LeftSidebar is displayed WHEN viewing the nav items section THEN only the two navigation links ("Listado de invitados", "Canvas") are present. The previous nav items (PROPERTIES, LAYOUT, OBJECTS, EXPORT) are no longer rendered.

### Route Changes

8. GIVEN the app is loaded at `/` WHEN the page renders THEN the guest list view is displayed (same content as the previous `/?tab=guests`).

9. GIVEN the app is loaded at `/seating-plan` WHEN the page renders THEN the seating canvas view is displayed (same content as the previous `/?tab=canvas`).

10. GIVEN the app is loaded at `/?tab=guests` or `/?tab=canvas` (legacy URLs) WHEN the page renders THEN the query params are ignored and the view is determined solely by the route path (`/` shows guest list).

11. GIVEN the user navigates to `/guests/new` WHEN the page renders THEN the add guest form is displayed (unchanged behavior).

12. GIVEN the user navigates to `/guests/:id/edit` WHEN the page renders THEN the edit guest form is displayed (unchanged behavior).

### Mobile BottomTabBar

13. GIVEN a mobile viewport (<768px) WHEN viewing the bottom tab bar THEN the CANVAS and GUESTS tabs navigate to `/seating-plan` and `/` respectively (using route navigation instead of query params).

14. GIVEN a mobile viewport at `/` WHEN viewing the bottom tab bar THEN the GUESTS tab has the active state.

15. GIVEN a mobile viewport at `/seating-plan` WHEN viewing the bottom tab bar THEN the CANVAS tab has the active state.

### Post-Action Navigation

16. GIVEN the user submits the add guest form WHEN the submission succeeds THEN the user is redirected to `/` (not `/?tab=guests`).

17. GIVEN the user submits the edit guest form WHEN the submission succeeds THEN the user is redirected to `/` with the edited guest selected.

18. GIVEN the user deletes a guest WHEN the deletion succeeds THEN the user is redirected to `/` (not `/?tab=guests`).

### Sidebar Bottom Section

19. GIVEN the current route is `/` WHEN viewing the sidebar bottom section THEN the "ADD GUEST" button and "HISTORY" link are visible (unchanged).

20. GIVEN the current route is `/seating-plan` WHEN viewing the sidebar bottom section THEN the "ADD TABLE" button, unassigned guests list, and "HISTORY" link are visible (unchanged).

## Scope

### In Scope

- Remove the center NavLink section from `TopNav`
- Remove the search input from `TopNav`
- Remove the PROPERTIES, LAYOUT, OBJECTS, EXPORT nav items from `LeftSidebar`
- Add two route-based navigation links to `LeftSidebar`: "Listado de invitados" (`/`) and "Canvas" (`/seating-plan`)
- Convert from query-param-based tab switching to route-based navigation
- Add a `/seating-plan` route definition in `main.tsx`
- Update `App.tsx` to determine the active view from the route path instead of query params
- Update `BottomTabBar` to use route-based navigation
- Update all post-action navigation (`navigate('/?tab=guests', ...)`) to use `navigate('/', ...)`
- Update `LeftSidebar` to determine active state from route path instead of `activeTab` prop
- Remove the `NavLink` atom import from `TopNav` (no longer used there)
- Remove `onTabChange` prop from `TopNav` (no longer needed)

### Out of Scope

- Redesigning the sidebar visual style or width
- Adding new sidebar sections or features
- Changing the mobile sidebar behavior (remains hidden on mobile)
- Adding sidebar navigation for `/guests/new` or `/guests/:id/edit` routes
- Removing the `NavLink` atom component entirely (may be reused in sidebar or future features)
- Changes to the `SidebarNavItem` component styling
- Changes to the TOOLS and MORE tabs in BottomTabBar (remain as-is, non-functional placeholders)

## Edge Cases

1. **Direct navigation to `/seating-plan`**: Works correctly — the canvas view renders and the "Canvas" sidebar link is active.

2. **Legacy query params in URL**: If a user bookmarked `/?tab=canvas`, they will see the guest list at `/` since query params are no longer used for view switching. The `tab` query param is simply ignored.

3. **Browser back/forward**: Route-based navigation integrates with browser history. Navigating from `/` to `/seating-plan` and pressing back returns to `/`.

4. **Sidebar hidden on mobile**: On mobile (<768px), the sidebar is hidden. The BottomTabBar provides the equivalent navigation. This behavior is unchanged.

5. **Active state on child routes**: When on `/guests/new` or `/guests/:id/edit`, the "Listado de invitados" sidebar link should show as active (since these are sub-routes of the guest domain).

6. **No view for unknown routes**: If the user navigates to an undefined route (e.g., `/foo`), React Router's existing behavior applies (no route match). This is out of scope — a 404 page can be added separately.

## Design Decisions

### DD-1: Route-Based Navigation Over Query Params

**Decision**: Replace `/?tab=guests` and `/?tab=canvas` with `/` and `/seating-plan` as proper React Router routes. The `activeTab` concept derived from `searchParams.get('tab')` is replaced by route matching using `useLocation().pathname`.
**Reasoning**: Route-based navigation is the standard pattern in React Router apps. It provides cleaner URLs, proper browser history integration, and better semantics. The query-param approach was a pragmatic choice from the initial spec when the app was a single-page with tab switching, but now that the app has grown to include multiple routes (`/guests/new`, `/guests/:id/edit`), it's natural to promote the main views to proper routes as well.

### DD-2: Sidebar as Primary Navigation

**Decision**: The LeftSidebar becomes the primary desktop navigation for switching between views. The TopNav tab selector is removed entirely. The BottomTabBar remains for mobile navigation.
**Reasoning**: This aligns with the user's request. Sidebar navigation is a common pattern for applications with a fixed set of main sections. The TopNav is freed up for global actions (search, settings) rather than section switching.

### DD-3: Navigation Link Labels

**Decision**: The sidebar links use the labels "Listado de invitados" and "Canvas" as specified by the user. These are not in the cyberpunk uppercase style — they use title case with Spanish for the guest list link.
**Reasoning**: The user explicitly specified these labels. The mixed language (Spanish for guest list, English for canvas) reflects the user's preference. If consistency with the cyberpunk aesthetic is desired later, the labels can be updated.

### DD-4: Route Path for Canvas

**Decision**: Use `/seating-plan` as the route path for the canvas view. The user wrote "/seeting-plan" which is a typo.
**Reasoning**: "seating-plan" is the correct English spelling and matches the project name. The route should use kebab-case and be semantically meaningful.

### DD-5: Determining Active View

**Decision**: The active view is determined by `useLocation().pathname`:

- `/` or `/guests/new` or `/guests/:id/edit` → guest domain (sidebar highlights "Listado de invitados")
- `/seating-plan` → canvas domain (sidebar highlights "Canvas")

The `activeTab` state variable is replaced by a derived `activeView` computed from the pathname.
**Reasoning**: Deriving the active state from the URL is the source-of-truth approach — no state synchronization needed. Child routes under `/guests/` are part of the guest domain, so the guest nav link stays active.

### DD-6: Reuse SidebarNavItem for Links

**Decision**: The existing `SidebarNavItem` molecule component is reused to render the two new navigation links. The component already supports `label` and `isActive` props. An `onClick` prop is added (if not already present) to handle navigation.
**Reasoning**: Reusing the existing component maintains visual consistency and avoids creating new components unnecessarily.

### DD-7: BottomTabBar Route Navigation

**Decision**: The BottomTabBar's `onTabChange` callback is replaced with route-based navigation. Instead of calling `setSearchParams({ tab: 'canvas' })`, the CANVAS tab calls `navigate('/seating-plan')` and GUESTS calls `navigate('/')`. The TOOLS and MORE tabs remain non-functional placeholders.
**Reasoning**: The BottomTabBar must mirror the sidebar's route-based navigation for consistency. Mobile users navigate to the same routes as desktop users.

## UI/UX Details

### TopNav (After Change)

```
┌──────────────────────────────────────────────────────────┐
│  PLANNER_V1.0                                ⚙ 👤       │
└──────────────────────────────────────────────────────────┘
```

The center section is empty — the nav links and search input are gone. The brand remains on the left, settings/avatar on the right.

### LeftSidebar Navigation Section (After Change)

```
+---------------------------+
| SEATING_01                |
| ACTIVE SESSION            |
+---------------------------+
|                           |
| Listado de invitados  *   |  ← active (cobalt) when on /
| Canvas                    |  ← active (cobalt) when on /seating-plan
|                           |
+---------------------------+
| [ADD GUEST] or [ADD TABLE]|
| HISTORY                   |
+---------------------------+
```

The nav items section shows only the two links. The active state uses the same cobalt highlight styling as the existing `SidebarNavItem` component.

### BottomTabBar (Unchanged Structure)

```
┌──────────────────────────┐
│ CANVAS GUESTS TOOLS MORE │
└──────────────────────────┘
```

Same visual appearance, but CANVAS navigates to `/seating-plan` and GUESTS navigates to `/`.

## Data Requirements

No new data models or storage changes. This is a navigation/routing refactor only.

## Technical Plan

### Impact Analysis

#### Affected Areas

| Area               | Files                                       | Type of Change                                                                                                                        |
| ------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Route definitions  | `src/main.tsx`                              | Modify — add `/seating-plan` route                                                                                                    |
| App shell / layout | `src/App.tsx`                               | Modify — replace query-param tab logic with route-based view derivation, restructure content rendering, update post-action navigation |
| Top navigation     | `src/components/organisms/TopNav.tsx`       | Modify — remove center nav links and search input, simplify props                                                                     |
| Left sidebar       | `src/components/organisms/LeftSidebar.tsx`  | Modify — replace nav items with route-based links, derive active state from pathname                                                  |
| Bottom tab bar     | `src/components/organisms/BottomTabBar.tsx` | Modify — replace query-param navigation with route-based navigation                                                                   |
| Edit guest page    | `src/pages/EditGuestPage.tsx`               | Modify — update fallback redirect from `/?tab=guests` to `/`                                                                          |

#### Integration Points

- `App.tsx` → `TopNav`: Props interface simplified (remove `activeTab`, `onTabChange`, `searchQuery`, `onSearchChange`)
- `App.tsx` → `LeftSidebar`: Props interface changed (remove `activeTab`, no longer passed from parent; sidebar derives its own active state internally via `useLocation`)
- `App.tsx` → `BottomTabBar`: Props interface changed (remove `activeTab`, `onTabChange`; component derives active state and navigates internally)
- `App.tsx` content rendering: The `activeTab === 'canvas'` conditional becomes route-path-based (`pathname === '/seating-plan'`)
- `App.tsx` post-action navigation: Three `navigate('/?tab=guests', ...)` calls become `navigate('/', ...)`
- `main.tsx` route tree: New `<Route path="seating-plan" element={null} />` sibling to the existing index route
- `EditGuestPage.tsx`: Fallback redirect from `/?tab=guests` to `/`

#### Risk Areas

- **`App.tsx` is the central orchestrator**: It owns state, DnD handling, and layout composition. Changes must preserve all existing functionality while swapping the tab-switching mechanism. This is the highest-risk file.
- **`LeftSidebar.tsx` is rendered in both `canvasContent` and `defaultContent` blocks**: Currently receives `activeTab` as a prop from `App.tsx`. After the change, it must derive its own active state. Both render sites must be updated consistently.
- **`BottomTabBar` TOOLS/MORE tabs**: These currently use `onTabChange('tools')` and `onTabChange('more')`. After removing `onTabChange`, they become no-ops. The spec says they remain as "non-functional placeholders" — they must still render but do nothing.

### Task Breakdown

#### TASK-001: Add `/seating-plan` route in `main.tsx`

- **Description**: Add a new route entry for `/seating-plan` in the route tree. This route renders `null` (like the index route) because `App.tsx` handles the actual content rendering based on the current path.
- **Files**: `src/main.tsx`
- **Instructions**:
  1. Open `src/main.tsx`
  2. Inside the `<Route element={<App />}>` parent, add a new child route: `<Route path="seating-plan" element={null} />`
  3. Place it after the `<Route index element={null} />` line
  4. No new imports needed
- **Project context**:
  - Framework: React Router ^7.14.0, routes defined in JSX within `<BrowserRouter>` → `<Routes>`
  - Conventions: Existing pattern uses `element={null}` for routes whose content is rendered by the layout component (`App.tsx`)
  - Libraries: `react-router` — `Route` component already imported
- **Dependencies**: None
- **Acceptance criteria**: Navigating to `/seating-plan` in the browser does not produce a route-not-found error; the App layout renders.

---

#### TASK-002: Simplify `TopNav` — remove center nav links and search input

- **Description**: Remove the center section (CANVAS / GUEST LIST `NavLink` buttons) and the search input from `TopNav`. Simplify the Props interface to remove `activeTab`, `onTabChange`, `searchQuery`, and `onSearchChange`. Remove unused imports (`NavLink`, `SearchInput`).
- **Files**: `src/components/organisms/TopNav.tsx`
- **Instructions**:
  1. Remove the `NavLink` import (`import NavLink from '../atoms/NavLink'`)
  2. Remove the `SearchInput` import (`import SearchInput from '../atoms/SearchInput'`)
  3. Replace the `Props` interface with an empty interface (or remove it entirely and use no props):
     ```typescript
     // No props needed
     ```
  4. Remove props from the function signature: `function TopNav() {`
  5. Remove the entire center section (`{/* Center section — desktop only */}` div with the two `NavLink` components)
  6. In the right section, remove the `SearchInput` wrapper div (`<div className="hidden md:block">` containing `SearchInput`)
  7. The remaining right section keeps only the `IconButton` (settings) and `Avatar`
- **Project context**:
  - Framework: React 19, function declaration components with default export
  - Conventions: Props interface named `Props` above the function; if no props, omit the interface. `text-label`, `tracking-wider` for brand text. Icons from `react-icons/lu`.
  - Libraries: `LuSettings` from `react-icons/lu`, `IconButton` and `Avatar` atoms remain
- **Dependencies**: None
- **Acceptance criteria**: `TopNav` renders only the brand text (left), settings icon (right), and avatar (right). No `NavLink` buttons or search input visible. TypeScript compiles without errors (no unused imports or props).

---

#### TASK-003: Update `LeftSidebar` — replace nav items with route-based links

- **Description**: Replace the four nav items (PROPERTIES, LAYOUT, OBJECTS, EXPORT) with two route-based navigation links: "Listado de invitados" (navigates to `/`) and "Canvas" (navigates to `/seating-plan`). The sidebar derives its active state internally from `useLocation().pathname` instead of receiving `activeTab` as a prop. The bottom section's conditional rendering (ADD GUEST vs ADD TABLE) also switches based on the pathname. Remove `activeTab` from the Props interface.
- **Files**: `src/components/organisms/LeftSidebar.tsx`
- **Instructions**:
  1. Add imports: `import { useLocation, useNavigate } from 'react-router'`
  2. Remove `activeTab` from the `Props` interface
  3. Remove `activeTab` from the destructured props in the function signature
  4. Inside the component, derive the active view:
     ```typescript
     const location = useLocation()
     const navigate = useNavigate()
     const isCanvasView = location.pathname === '/seating-plan'
     ```
  5. Replace the nav items section (`{/* Nav items */}` div) — remove the four `SidebarNavItem` entries and replace with two:
     ```tsx
     <SidebarNavItem
       label="Listado de invitados"
       isActive={!isCanvasView}
       onClick={() => navigate('/')}
     />
     <SidebarNavItem
       label="Canvas"
       isActive={isCanvasView}
       onClick={() => navigate('/seating-plan')}
     />
     ```
     Note: `!isCanvasView` covers `/`, `/guests/new`, and `/guests/:id/edit` — all guest-domain routes. This satisfies edge case #5 from the spec.
  6. In the bottom actions section, replace `activeTab === 'canvas'` with `isCanvasView`
- **Project context**:
  - Framework: React Router ^7.14.0 — `useLocation` returns `{ pathname }`, `useNavigate` returns a navigate function
  - Conventions: `SidebarNavItem` molecule already supports `label`, `isActive`, `onClick` props. Active state uses cobalt highlight + `border-l-2 border-l-primary`. Labels per spec: "Listado de invitados" and "Canvas" (not uppercase cyberpunk style — explicit spec decision DD-3).
  - Libraries: `react-router` for `useLocation` and `useNavigate`; `SidebarNavItem` molecule component
- **Dependencies**: None (but TASK-004 must update `App.tsx` to stop passing `activeTab` to `LeftSidebar`)
- **Acceptance criteria**: Sidebar shows exactly two nav links. "Listado de invitados" is active at `/` and `/guests/*`. "Canvas" is active at `/seating-plan`. Clicking a link navigates to the correct route. Bottom section shows ADD GUEST on `/` and ADD TABLE + unassigned list on `/seating-plan`.

---

#### TASK-004: Refactor `App.tsx` — route-based view switching and navigation

- **Description**: This is the core refactor. Replace the `useSearchParams`-based tab switching with route-path-based view derivation. Update the content rendering logic to use `pathname`. Update all post-action navigation from `/?tab=guests` to `/`. Remove `activeTab`, `onTabChange`, `searchQuery`, `searchParams`, `setSearchParams` state/variables. Remove the `searchQuery`-based filtering (search is being removed from TopNav). Update `TopNav`, `LeftSidebar`, and `BottomTabBar` call sites to match their new simplified props.
- **Files**: `src/App.tsx`
- **Instructions**:
  1. **Remove `useSearchParams` import and usage**:
     - Remove `useSearchParams` from the `react-router` import
     - Remove `const [searchParams, setSearchParams] = useSearchParams()`
     - Remove `rawTab`, `activeTab`, and `onTabChange` derivations (lines 32–40)
  2. **Derive active view from pathname**:
     - After the existing `const location = useLocation()` line, add:
       ```typescript
       const isCanvasView = location.pathname === '/seating-plan'
       ```
  3. **Remove search state**:
     - Remove `const [searchQuery, setSearchQuery] = useState('')`
     - Remove the `filteredGuests` computation (lines 126–129)
     - Replace `filteredGuests` usage in `GuestTable` with `guests` directly
  4. **Update post-action navigation** (3 occurrences):
     - `handleAddGuest`: change `navigate('/?tab=guests', { replace: true })` to `navigate('/', { replace: true })`
     - `handleUpdateGuest`: change `navigate('/?tab=guests', { state: { selectedGuestId: id } })` to `navigate('/', { state: { selectedGuestId: id } })`
     - `handleDeleteGuest`: change `navigate('/?tab=guests', { replace: true })` to `navigate('/', { replace: true })`
  5. **Update `canvasContent` block**:
     - Remove `activeTab={activeTab}` from the `LeftSidebar` JSX
     - Change the `<main>` className: replace `` `flex-1 flex flex-col ${activeTab === 'canvas' ? 'overflow-hidden' : 'overflow-y-auto'} pb-16 md:pb-0` `` with `"flex-1 flex flex-col overflow-hidden pb-16 md:pb-0"` (canvas is always overflow-hidden)
  6. **Update `defaultContent` block**:
     - Remove `activeTab={activeTab}` from the `LeftSidebar` JSX
     - The `<main>` className stays as `"flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0"`
     - Replace the `activeTab === 'guests'` condition (line 253) — this branch now always shows the guest list (since the default content only renders on non-canvas routes):
       - Remove the `: activeTab === 'guests' ? (` ternary branch
       - Remove the `MODULE_OFFLINE` fallback div (lines 276–279) — no longer needed since non-guest/non-canvas tabs don't exist as routes
       - The structure becomes: if `isChildRoute` → Outlet, else if `guests.length === 0` → EmptyState, else → guest list content
     - Update `selectedGuest && activeTab === 'guests' && !isChildRoute` (line 282): remove the `activeTab === 'guests'` check, keep `selectedGuest && !isChildRoute`
  7. **Update `TopNav` call site** (line 295–300):
     - Remove all props: `<TopNav />`
  8. **Update `BottomTabBar` call site** (line 311):
     - Remove all props: `<BottomTabBar />`
  9. **Update the canvas/default conditional** (line 302):
     - Replace `activeTab === 'canvas' && !isChildRoute` with `isCanvasView && !isChildRoute`
  10. **Remove `GuestTable` `searchQuery` prop**:
      - Remove `searchQuery={searchQuery}` from the `GuestTable` JSX — the `searchQuery` prop was used for search empty state detection; pass an empty string or remove the prop (check `GuestTable` interface)
  11. **Clean up unused imports**: Remove `useSearchParams` from the `react-router` import. Ensure no unused variables.
- **Project context**:
  - Framework: React 19, React Router ^7.14.0. `useLocation()` provides `pathname`. `useNavigate()` for programmatic navigation.
  - Conventions: Function declaration components. No semicolons. Single quotes. Trailing commas. 2-space indentation. `useCallback` for handlers passed as props.
  - Libraries: `@dnd-kit/react` `DragDropProvider` wraps the canvas view — this must remain.
  - Guardrails: G-16 — no `setState` in `useEffect`. G-17 — single source of truth for data transformations.
- **Dependencies**: TASK-001 (route must exist), TASK-002 (TopNav props simplified), TASK-003 (LeftSidebar props simplified)
- **Acceptance criteria**: The app compiles. `/` renders guest list. `/seating-plan` renders canvas. `DragDropProvider` wraps canvas view. Post-action navigation goes to `/`. No `searchParams`, `activeTab`, or `onTabChange` references remain in `App.tsx`. `TopNav` and `BottomTabBar` are rendered without props. `LeftSidebar` is rendered without `activeTab`.

---

#### TASK-005: Update `BottomTabBar` — route-based navigation

- **Description**: Replace `activeTab`/`onTabChange` props with internal route-based navigation. The CANVAS and GUESTS tabs use `useNavigate` and `useLocation` to navigate and determine active state. TOOLS and MORE tabs remain as non-functional placeholders (no navigation, never active).
- **Files**: `src/components/organisms/BottomTabBar.tsx`
- **Instructions**:
  1. Add imports: `import { useLocation, useNavigate } from 'react-router'`
  2. Remove the `Props` interface entirely
  3. Remove props from function signature: `function BottomTabBar() {`
  4. Inside the component, derive state:
     ```typescript
     const location = useLocation()
     const navigate = useNavigate()
     const isCanvasView = location.pathname === '/seating-plan'
     ```
  5. Update the CANVAS `TabBarItem`:
     - `isActive={isCanvasView}`
     - `onClick={() => navigate('/seating-plan')}`
  6. Update the GUESTS `TabBarItem`:
     - `isActive={!isCanvasView}` (active on `/` and `/guests/*` routes)
     - `onClick={() => navigate('/')}`
  7. Update the TOOLS `TabBarItem`:
     - `isActive={false}` (always inactive — non-functional placeholder)
     - `onClick={() => {}}` (no-op)
  8. Update the MORE `TabBarItem`:
     - `isActive={false}` (always inactive — non-functional placeholder)
     - `onClick={() => {}}` (no-op)
- **Project context**:
  - Framework: React Router ^7.14.0 — `useLocation` and `useNavigate` hooks
  - Conventions: Function declaration. `TabBarItem` atom takes `icon`, `label`, `isActive`, `onClick` props. Icons from `react-icons/lu`.
  - Libraries: `react-router` for navigation hooks; `TabBarItem` atom
- **Dependencies**: None (but TASK-004 must update `App.tsx` to stop passing props to `BottomTabBar`)
- **Acceptance criteria**: CANVAS tab navigates to `/seating-plan` and is active when on that route. GUESTS tab navigates to `/` and is active when on `/` or `/guests/*`. TOOLS and MORE render but are always inactive and do nothing on click. No `activeTab` or `onTabChange` props.

---

#### TASK-006: Update `EditGuestPage` — fix fallback redirect

- **Description**: Update the fallback redirect for non-existent guest IDs from `/?tab=guests` to `/`.
- **Files**: `src/pages/EditGuestPage.tsx`
- **Instructions**:
  1. On line 25, change `navigate('/?tab=guests', { replace: true })` to `navigate('/', { replace: true })`
- **Project context**:
  - Framework: React Router ^7.14.0
  - Conventions: Existing pattern uses `useEffect` for redirect (note: this is a navigation side effect, not a state-setting issue, so G-16 does not apply)
- **Dependencies**: None
- **Acceptance criteria**: When navigating to `/guests/<invalid-id>/edit`, the user is redirected to `/` (not `/?tab=guests`).

### Execution Order

#### Parallel Group 1 (no dependencies)

- TASK-001: Add `/seating-plan` route in `main.tsx`
- TASK-002: Simplify `TopNav`
- TASK-003: Update `LeftSidebar` with route-based links
- TASK-005: Update `BottomTabBar` with route-based navigation
- TASK-006: Update `EditGuestPage` fallback redirect

#### Parallel Group 2 (depends on Group 1)

- TASK-004: Refactor `App.tsx` (depends on TASK-001, TASK-002, TASK-003, TASK-005 — since it updates the call sites for all modified components)

### Verification Checklist

- [x] All requirements from the spec are covered
  - AC-1, AC-2: TopNav simplified → TASK-002
  - AC-3, AC-4, AC-5, AC-6, AC-7: Sidebar nav links → TASK-003
  - AC-8, AC-9, AC-10: Route-based views → TASK-001, TASK-004
  - AC-11, AC-12: Guest form routes unchanged → verified (no changes to route paths)
  - AC-13, AC-14, AC-15: BottomTabBar → TASK-005
  - AC-16, AC-17, AC-18: Post-action navigation → TASK-004
  - AC-19, AC-20: Sidebar bottom section → TASK-003
- [x] No task modifies files outside its scope
  - TASK-001: only `main.tsx`
  - TASK-002: only `TopNav.tsx`
  - TASK-003: only `LeftSidebar.tsx`
  - TASK-004: only `App.tsx`
  - TASK-005: only `BottomTabBar.tsx`
  - TASK-006: only `EditGuestPage.tsx`
- [x] Dependencies are correctly mapped
  - TASK-004 depends on all Group 1 tasks (it updates call sites to match new interfaces)
  - All other tasks are independent
- [x] Each task has clear acceptance criteria
- [x] Edge cases covered:
  - Direct `/seating-plan` navigation: TASK-001 + TASK-004
  - Legacy query params ignored: TASK-004 (removes `useSearchParams`)
  - Browser back/forward: inherent in React Router route-based navigation
  - Sidebar hidden on mobile: unchanged (CSS `hidden md:flex`)
  - Active state on child routes (`/guests/*`): TASK-003 uses `!isCanvasView` which covers all non-`/seating-plan` paths

## Notes

- The `NavLink` atom component (`src/components/atoms/NavLink.tsx`) is no longer imported by `TopNav` after this change. It may still be used elsewhere or could be removed in a cleanup pass. The spec does not mandate its deletion.
- The `activeTab` prop and `onTabChange` callback pattern used across components (`TopNav`, `LeftSidebar`, `BottomTabBar`) will be replaced by route-aware patterns (using `useLocation` or `useNavigate` hooks, or receiving the current path as a prop).

## Changelog

- 2026-04-03: Initial draft
- 2026-04-03: Added removal of search input from TopNav
- 2026-04-03: Technical plan added — 6 tasks across 6 files, 2 parallel groups
- 2026-04-03: Implementation completed — all 6 tasks verified, validator APPROVED (0 critical, 0 major, 4 minor). Migrated from query-param tabs to route-based navigation. TopNav simplified (no tabs, no search). Sidebar has 2 route links. BottomTabBar uses routes internally.
