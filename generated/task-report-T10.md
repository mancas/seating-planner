# Task Report: T-10 — Slim Down App.tsx — Extract View Components

**Status**: Complete
**Date**: 2026-04-04

## Summary

Decomposed the monolithic `App.tsx` (275 lines) into three focused files:

- `App.tsx` — thin layout shell (17 lines)
- `GuestListView.tsx` — guest list view with CRUD, stats, and form route outlet (154 lines)
- `SeatingPlanView.tsx` — canvas view with DnD, table state, and mobile sheets (122 lines)

## Changes Made

### Files Created

1. **`src/pages/GuestListView.tsx`** (154 lines)
   - Owns guest state (`useState` for guests, selectedGuestId)
   - All guest CRUD handlers (add, update, delete) using store functions directly
   - Uses `useGuestStats` hook for statistics
   - Handles `location.state` via `useEffect` (the fix from T-07)
   - Navigation handlers (handleNavigateToAdd, handleNavigateToEdit, handleCancel)
   - Renders: `LeftSidebar`, `<main>` with conditional Outlet/EmptyState/GuestList, `GuestDetailPanel`
   - Provides `OutletContext` via `<Outlet context={...}>` for AddGuestPage/EditGuestPage child routes
   - FAB button (conditionally shown when not on child route)
   - Detects child routes via `location.pathname.startsWith('/guests/')` to show Outlet vs guest list content
   - Calls `clearGuestAssignments` directly from `table-store` (instead of via `useTableState`) for guest deletion
   - Reads tables via `getTables()` for sidebar and GuestTable display

2. **`src/pages/SeatingPlanView.tsx`** (122 lines)
   - Reads guests via `getGuests()` (fresh data on mount for canvas display)
   - Owns table state via `useTableState()` hook
   - Uses `useDragEndHandler` hook for DnD logic
   - `DragDropProvider` wrapper wraps entire view
   - Renders: `LeftSidebar`, `SeatingCanvas`, `CanvasPropertiesPanel`, `MobilePropertiesSheet`, mobile guests FAB/sheet
   - Owns `showMobileGuests` state and `MobileGuestsSheet` component
   - Computes `unassignedGuests` via `getUnassignedGuests` utility

### Files Modified

3. **`src/App.tsx`** — Reduced from 275 lines to 17 lines
   - Thin layout shell: `TopNav` + `<Outlet />` + `BottomTabBar`
   - No state, no hooks, no business logic
   - All imports reduced to just `Outlet`, `TopNav`, `BottomTabBar`

4. **`src/main.tsx`** — Updated route configuration
   - `GuestListView` is a layout route that wraps guest form child routes
   - `SeatingPlanView` is a standalone route at `/seating-plan`
   - Route structure: `App > [GuestListView > [index, guests/new, guests/:id/edit], seating-plan]`

## Route Architecture

```
<Route element={<App />}>                    ← layout: TopNav + Outlet + BottomTabBar
  <Route element={<GuestListView />}>        ← layout: LeftSidebar + main + detail panel
    <Route index element={null} />           ← guest list (rendered by GuestListView)
    <Route path="guests/new" ... />          ← AddGuestPage (rendered via Outlet)
    <Route path="guests/:id/edit" ... />     ← EditGuestPage (rendered via Outlet)
  </Route>
  <Route path="seating-plan" ... />          ← SeatingPlanView (standalone)
</Route>
```

## Key Design Decisions

1. **GuestListView as layout route**: Since `AddGuestPage` and `EditGuestPage` receive data via `useOutletContext`, GuestListView must be their parent layout route providing the context via `<Outlet context={...}>`.

2. **Table data in GuestListView**: Uses `getTables()` directly (read-only) for the sidebar and GuestTable display. No `useTableState` needed since GuestListView doesn't mutate tables.

3. **Guest deletion clearing seat assignments**: Calls `clearGuestAssignments` directly from `table-store` rather than going through `useTableState`, since GuestListView doesn't need the full table state management.

4. **SeatingPlanView reads guests on mount**: Uses `useState(() => getGuests())` to load guests once when the view mounts. This is sufficient since when the user navigates back from GuestListView, the component remounts with fresh data.

5. **FAB moved to GuestListView**: The FAB is guest-list-specific so it lives in GuestListView, shown only when no child route is active.

## Acceptance Criteria

- [x] `GuestListView.tsx` exists and handles guest list, CRUD, and child form routes
- [x] `SeatingPlanView.tsx` exists and handles canvas, DnD, table state
- [x] `App.tsx` is reduced to ~17 lines (layout shell only)
- [x] Route configuration in `main.tsx` uses proper element props
- [x] Guest list view works identically (stats, table, detail panel, FAB)
- [x] Canvas view works identically (DnD, table management, properties panel)
- [x] Form routes (add/edit guest) work correctly with outlet context
- [x] Build passes (`tsc -b && vite build`)
