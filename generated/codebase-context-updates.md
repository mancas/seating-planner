# Codebase Context Updates — Settings Screen

Updates to project structure and patterns based on the settings-screen spec implementation.

---

## New Files

### Pages

| File                                     | Purpose                                                                                                                                                            |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/pages/SettingsView.tsx` (160 lines) | Settings page with export, import, and delete project actions. Renders LeftSidebar + main content area. Uses `useProjectImport` hook and `ConfirmDialog` molecule. |

## Modified Files

| File                                        | Change                                                                                                                                                                                       |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/utils/project-export.ts`               | Added `deleteProject()` function — removes all 3 localStorage keys                                                                                                                           |
| `src/main.tsx`                              | Added `/settings` route as child of App layout route                                                                                                                                         |
| `src/components/organisms/LeftSidebar.tsx`  | Added "Settings" nav item, fixed "Listado de invitados" active state to exclude `/settings`, removed export/import buttons, separator, ConfirmDialog, hidden file input, and related imports |
| `src/components/organisms/BottomTabBar.tsx` | Added "SETTINGS" tab with `LuSettings` icon, added `isSettingsView` variable, fixed GUESTS active state to exclude `/settings`                                                               |
| `src/components/organisms/TopNav.tsx`       | Reverted to stateless no-props component — removed all imports, Props interface, overflow menu icon                                                                                          |
| `src/App.tsx`                               | Restored to thin 17-line layout shell — removed `useState`, `useIsMobile`, `ProjectActionsSheet` imports, state, and conditional rendering                                                   |

## Deleted Files

| File                                                           | Reason                                                            |
| -------------------------------------------------------------- | ----------------------------------------------------------------- |
| `src/components/organisms/ProjectActionsSheet.tsx` (129 lines) | No longer needed — export/import moved to SettingsView. Per G-18. |

## Architecture Notes

### Settings Page Pattern

`SettingsView` follows the same page component pattern as `ImportGuestsView`: renders its own `LeftSidebar` as a sibling, with `getGuests()`/`getTables()` called directly (not in `useState`), and `useCallback` for sidebar callback props. The page is action-oriented (export, import, delete) rather than data-display, so no reactive state is needed for guests/tables.

### App.tsx Restored to Minimal Shell

With the removal of `ProjectActionsSheet`, `App.tsx` returns to its ideal thin layout shell state (G-40): only `Outlet`, `TopNav`, and `BottomTabBar`. No state, no hooks, no business logic. 17 lines total.

### Active State Fix Pattern (G-50)

When the third route (`/settings`) was added, both `LeftSidebar` and `BottomTabBar` had catch-all active states (`!isCanvasView`) that incorrectly matched `/settings`. The fix uses explicit exclusion: `!isCanvasView && location.pathname !== '/settings'` for the guest list item, and `!isCanvasView && !isSettingsView` for the GUESTS tab. Future route additions must audit these patterns.

## Component Counts Update

- **Atoms**: 11 (unchanged)
- **Molecules**: 11 (unchanged)
- **Organisms**: 16 (-1: ProjectActionsSheet deleted)
- **Pages**: 6 (+1: SettingsView)
- **Utility modules**: 2 in `src/utils/` (csv-import.ts, project-export.ts — project-export.ts now has 5 exports)

## Updated Route Table

| Path               | Component          | Description                                         |
| ------------------ | ------------------ | --------------------------------------------------- |
| `/`                | `GuestListView`    | Guest list (layout route)                           |
| `/guests/new`      | `AddGuestPage`     | Guest creation form                                 |
| `/guests/:id/edit` | `EditGuestPage`    | Guest edit form                                     |
| `/guests/import`   | `ImportGuestsView` | CSV import                                          |
| `/seating-plan`    | `SeatingPlanView`  | Interactive canvas with DnD                         |
| `/settings`        | `SettingsView`     | Project management actions (export, import, delete) |

## New Guardrails

- **G-50**: Fix active states when adding routes to navigation components — catch-all patterns (`!isCanvasView`) break when new routes are added
- **G-51**: Co-dependent file changes must be atomic — mutual dependency removal must happen in one commit
- **G-52**: Verify deletion completeness with grep after removing components

## Validation Status

**APPROVED** — 0 CRITICAL, 0 MAJOR, 3 MINOR (all non-blocking, consistent with existing codebase patterns). All 26 acceptance criteria met.
