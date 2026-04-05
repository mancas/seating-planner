# Spec: Settings Screen

## Metadata

- **Slug**: `settings-screen`
- **Date**: 2026-04-05
- **Status**: Completed
- **Author**: User
- **Related specs**: [spec/export-import-project.md](./export-import-project.md), [spec/sidebar-navigation.md](./sidebar-navigation.md), [spec/mobile-canvas.md](./mobile-canvas.md)

## Description

Create a dedicated Settings screen (`/settings`) that consolidates project management actions into a single page: export project, import project, and delete/reset project. The export and import actions are **moved** from their current locations (LeftSidebar bottom section on desktop, TopNav overflow menu + ProjectActionsSheet on mobile) into this new settings page. A new "delete project" action is added that clears all localStorage data and reloads the app to a fresh state.

### Core Behaviors

- **Settings page**: A new route (`/settings`) accessible via sidebar navigation (desktop) and bottom tab bar (mobile). The page displays three project management actions in a clean, card-based layout.
- **Export** (moved): Same behavior as the current export — reads all localStorage data, bundles into a versioned JSON object, triggers a browser download. The underlying utility (`downloadProjectExport` from `src/utils/project-export.ts`) is unchanged.
- **Import** (moved): Same behavior as the current import — file picker, validation, confirmation dialog, full data replacement, page reload. The underlying utilities (`validateProjectImport`, `applyProjectImport` from `src/utils/project-export.ts`) and hook (`useProjectImport` from `src/hooks/useProjectImport.ts`) are unchanged.
- **Delete/Reset** (new): A destructive action that clears all three localStorage keys (`seating-plan:guests`, `seating-plan:tables`, `seating-plan:table-counter`), shows a confirmation dialog before proceeding, and reloads the app to reflect the empty state.

### Entry Points

- **Desktop (≥768px)**: A "Settings" link in the `LeftSidebar` navigation section (below "Canvas"), navigating to `/settings`.
- **Mobile (<768px)**: A "SETTINGS" tab in the `BottomTabBar` (third tab, after CANVAS and GUESTS), navigating to `/settings`.

### Removals

- The export/import buttons are **removed** from the `LeftSidebar` bottom section (including the separator, the `LuDownload`/`LuUpload` buttons, and inline error display).
- The overflow menu icon (`LuEllipsisVertical`) is **removed** from `TopNav` (the `onOpenProjectMenu` prop is removed).
- The `ProjectActionsSheet` component (`src/components/organisms/ProjectActionsSheet.tsx`) is **deleted** — it is no longer needed.
- The `isProjectSheetOpen` state and `isMobile` hook usage in `App.tsx` are removed, restoring `App.tsx` to a thin layout shell.

## User Stories

1. As a **wedding planner**, I want a dedicated settings page so that I can find all project management actions in one place without cluttering the sidebar.
2. As a **wedding planner**, I want to export my project from the settings page so that I can back up my data.
3. As a **wedding planner**, I want to import a project from the settings page so that I can restore data from a backup.
4. As a **wedding planner**, I want to delete my project and start fresh so that I can reset all data without manually clearing browser storage.
5. As a **wedding planner**, I want to be warned before deleting my project so that I don't accidentally lose all my work.
6. As a **wedding planner on mobile**, I want to access settings from the bottom tab bar so that I can manage my project without the desktop sidebar.
7. As a **wedding planner**, I want navigation to the settings page from the sidebar so that it's consistent with the existing guest list and canvas navigation pattern.

## Acceptance Criteria

### Settings Page Route

1. GIVEN the app is loaded WHEN the user navigates to `/settings` THEN a Settings page is displayed with project management actions (export, import, delete).

2. GIVEN the user is on `/settings` WHEN viewing the page THEN no `LeftSidebar` is rendered (the settings page uses the full content area, same as other views that render `LeftSidebar` themselves).

### Navigation — Desktop Sidebar

3. GIVEN a desktop viewport (≥768px) WHEN viewing the `LeftSidebar` on any view (guest list, canvas, import guests) THEN a "Settings" navigation item is visible below "Canvas" in the nav section.

4. GIVEN the user is on `/settings` WHEN viewing the `LeftSidebar` THEN the "Settings" nav item is highlighted as active (same `isActive` styling as other `SidebarNavItem` entries).

5. GIVEN the user clicks the "Settings" nav item in the sidebar WHEN on any view THEN the app navigates to `/settings`.

### Navigation — Mobile Bottom Tab Bar

6. GIVEN a mobile viewport (<768px) WHEN viewing the `BottomTabBar` THEN a "SETTINGS" tab is visible as the third tab (after CANVAS and GUESTS).

7. GIVEN the user taps the "SETTINGS" tab WHEN on any view THEN the app navigates to `/settings`.

8. GIVEN the user is on `/settings` WHEN viewing the `BottomTabBar` THEN the "SETTINGS" tab is highlighted as active.

### Export Action

9. GIVEN the user is on `/settings` WHEN the user clicks the "EXPORT_PROJECT" button THEN a `.json` file is generated and downloaded (same behavior as the current sidebar export — AC-1 through AC-5 of `export-import-project` spec).

10. GIVEN the export button is clicked WHEN the file is downloaded THEN no navigation occurs — the user stays on `/settings`.

### Import Action

11. GIVEN the user is on `/settings` WHEN the user clicks the "IMPORT_PROJECT" button THEN a file picker dialog opens filtered to `.json` files.

12. GIVEN the user selects a valid `.json` file WHEN validation passes THEN a confirmation dialog is shown using `ConfirmDialog` with the message: "IMPORT_PROJECT // THIS WILL REPLACE ALL CURRENT DATA (GUESTS, TABLES, AND SEATING ASSIGNMENTS). THIS ACTION CANNOT BE UNDONE." with "CANCEL" and "CONFIRM_IMPORT" buttons.

13. GIVEN the user confirms the import WHEN the data is applied THEN all localStorage keys are overwritten, and the app reloads via `window.location.reload()`.

14. GIVEN the user selects an invalid file WHEN validation fails THEN an inline error message is displayed below the import button: "INVALID_FILE // THE SELECTED FILE IS NOT A VALID PROJECT EXPORT" (same error text as current implementation).

15. GIVEN the user clicks import again after an error WHEN the file picker opens THEN the previous error message is cleared.

### Delete/Reset Project Action

16. GIVEN the user is on `/settings` WHEN the user clicks the "DELETE_PROJECT" button THEN a confirmation dialog is shown using `ConfirmDialog` with the title "DELETE_PROJECT", target name "ALL_PROJECT_DATA", message "This will permanently delete all guests, tables, and seating assignments. This action cannot be undone.", confirm label "CONFIRM_DELETE", and cancel label "CANCEL".

17. GIVEN the delete confirmation dialog is shown WHEN the user clicks "CANCEL" THEN the dialog closes and no data is changed.

18. GIVEN the delete confirmation dialog is shown WHEN the user clicks "CONFIRM_DELETE" THEN all three localStorage keys are removed (`seating-plan:guests`, `seating-plan:tables`, `seating-plan:table-counter`), and the app reloads via `window.location.reload()`.

19. GIVEN the delete action completes WHEN the app reloads THEN the user lands on `/` (guest list) and sees the empty state.

### Removal of Export/Import from LeftSidebar

20. GIVEN the app is loaded on any view WHEN viewing the `LeftSidebar` bottom section THEN there are NO export/import buttons, NO separator before them, and NO inline error message (only the view-specific buttons remain: ADD GUEST / IMPORT_CSV on guest list, ADD TABLE / unassigned list on canvas).

21. GIVEN the `LeftSidebar` component WHEN inspecting its imports THEN `downloadProjectExport`, `useProjectImport`, `LuDownload`, and `ConfirmDialog` (if only used for import) are no longer imported.

### Removal of Mobile Overflow Menu

22. GIVEN a mobile viewport (<768px) WHEN viewing the `TopNav` THEN there is NO overflow menu icon button — the right section is empty.

23. GIVEN the `TopNav` component WHEN inspecting its props THEN the `onOpenProjectMenu` prop no longer exists. `TopNav` is a stateless component with no props.

24. GIVEN the `App.tsx` component WHEN inspecting its code THEN there is no `isProjectSheetOpen` state, no `useIsMobile` import, no `ProjectActionsSheet` import or render, and `TopNav` is rendered with no props.

### Responsive Layout

25. GIVEN a desktop viewport (≥768px) WHEN viewing `/settings` THEN the settings page content is displayed in the main content area to the right of the `LeftSidebar`, using a centered max-width container.

26. GIVEN a mobile viewport (<768px) WHEN viewing `/settings` THEN the settings page content fills the full width with appropriate padding, and the `BottomTabBar` is visible at the bottom.

## Scope

### In Scope

- New `/settings` route and `SettingsView` page component
- "Settings" navigation link in `LeftSidebar` nav section
- "SETTINGS" tab in `BottomTabBar`
- Export action on the settings page (reuses existing `downloadProjectExport` utility)
- Import action on the settings page (reuses existing `useProjectImport` hook)
- Delete/Reset project action with confirmation dialog
- New `deleteProject` utility function in `src/utils/project-export.ts`
- Removal of export/import buttons from `LeftSidebar` bottom section
- Removal of overflow menu icon from `TopNav` (restore to no-props stateless component)
- Deletion of `ProjectActionsSheet` component file
- Cleanup of `App.tsx` (remove sheet state, isMobile hook, ProjectActionsSheet import)
- Reuse of existing `ConfirmDialog` molecule for both import confirmation and delete confirmation

### Out of Scope

- User preferences / app settings (theme, language, etc.)
- Account management or authentication
- Per-table or per-guest settings
- Settings persistence (the page only provides actions, not stored preferences)
- Undo after delete
- Partial delete (e.g., delete only guests, keep tables)
- Any changes to the export/import utility logic — only the UI entry points change
- Renaming or restructuring the `project-export.ts` utility module

## Edge Cases

1. **Delete with empty project**: If there are no guests, no tables, and counter is 0, delete still clears localStorage keys and reloads. The user ends up on the same empty state — no harm done.

2. **Delete while on settings page**: After `window.location.reload()`, the user is navigated to `/` (guest list) rather than staying on `/settings`, because the reload resets the app state and it's more intuitive to land on the main view after a fresh start.

3. **Import then delete in same session**: If the user imports a project and then immediately deletes it, the delete confirmation clearly warns that all data will be lost. No special handling needed.

4. **Navigate to /settings via direct URL**: The route is registered in the router, so direct URL access works. The `LeftSidebar` shows "Settings" as active. On mobile, the `BottomTabBar` shows "SETTINGS" as active.

5. **Back/forward navigation**: Standard browser back/forward works with `/settings` since it's a regular route. No special history management needed.

6. **Delete confirmation dismissed by overlay click**: The `ConfirmDialog` calls `onCancel` when the overlay is clicked (existing behavior from the component's `onClick={onCancel}` on the backdrop div). No data is changed.

7. **Import error followed by delete**: If the user sees an import error and then clicks delete, the delete flow is independent. The import error message remains visible but is irrelevant. It clears on the next import click or page navigation.

8. **Mobile: BottomTabBar with three tabs**: Adding a third tab to the `BottomTabBar` uses `justify-around` layout (already in place), so three items distribute evenly. The compact `TabBarItem` component handles the layout.

9. **Settings page while LeftSidebar shows canvas-specific content**: The `LeftSidebar` renders different bottom actions based on `isCanvasView` (pathname === `/seating-plan`). On `/settings`, `isCanvasView` is false, so the guest list actions (ADD GUEST / IMPORT_CSV) are shown. This is acceptable — the sidebar's bottom section remains contextual to the last relevant view.

10. **Delete mid-import**: If the user has a `pendingImport` (confirmation dialog open) and somehow also triggers delete, the two `ConfirmDialog` instances would stack (both use `fixed inset-0 z-50`). This is unlikely since only one dialog should be visible at a time. The implementation should ensure delete is not clickable while the import confirmation is open, or the import dialog takes priority.

## Design Decisions

### DD-1: Dedicated Settings Page vs. Keeping in Sidebar

**Decision**: Move export/import out of the sidebar and into a dedicated `/settings` page. Add the new delete/reset action to the same page.
**Reasoning**: The sidebar is a navigation element, not an action panel. Having action buttons (export, import) in the sidebar's bottom section conflates navigation with actions, and the separator + two extra buttons add visual weight to every view. A settings page provides a natural home for project-level management actions that are used infrequently. This also eliminates the need for the mobile overflow menu and `ProjectActionsSheet` — mobile users simply navigate to `/settings` via the bottom tab bar, which is more discoverable than a kebab menu icon.

### DD-2: Navigation via Sidebar Link + Bottom Tab Bar

**Decision**: Add a "Settings" `SidebarNavItem` in the desktop sidebar and a "SETTINGS" `TabBarItem` in the mobile `BottomTabBar`. The settings page is a first-class navigation destination, not hidden behind a menu.
**Reasoning**: The existing navigation pattern uses `SidebarNavItem` for desktop and `TabBarItem` for mobile. Adding settings as a third item in both follows the established pattern. Three items in the bottom tab bar is a common mobile pattern and the `justify-around` layout already handles it. This replaces the overflow menu icon (which was a secondary action entry point) with a primary navigation tab, improving discoverability on mobile.

### DD-3: Delete Operation — Clear localStorage Keys

**Decision**: The delete/reset operation removes all three localStorage keys (`seating-plan:guests`, `seating-plan:tables`, `seating-plan:table-counter`) using `localStorage.removeItem()` and then triggers `window.location.reload()`.
**Reasoning**: Using `removeItem()` rather than writing empty defaults (`[], [], 0`) ensures a clean slate — the `createStorage` utility's `read()` function returns the `fallbackValue` when the key doesn't exist, which is `[]` for guests/tables and `0` for the counter. This matches what a brand-new user would see. The page reload ensures all module-level `createStorage` instances re-initialize, same rationale as the import reload (DD-9 of `export-import-project`).

### DD-4: Delete Utility in `project-export.ts`

**Decision**: Add a `deleteProject()` function to the existing `src/utils/project-export.ts` utility module rather than creating a new module.
**Reasoning**: The function operates on the same three localStorage keys that the export/import functions manage. Keeping it in the same module maintains cohesion — all project-level data operations live together. The module could be renamed to `project-data.ts` in the future, but that's out of scope for this spec.

### DD-5: Settings Page Layout — Sections with Action Buttons

**Decision**: The settings page uses a simple layout: a page header ("SETTINGS"), followed by a "Project Data" section containing three action cards/buttons (export, import, delete). The delete button uses `btn-destructive` styling to visually distinguish it.
**Reasoning**: A minimal layout is appropriate because the page currently only has three actions. A card-based or section-based layout with clear labels and descriptions for each action provides enough context without over-designing. The destructive styling on the delete button follows the convention used by `ConfirmDialog`'s confirm button (`btn-destructive`).

### DD-6: SettingsView Renders Its Own LeftSidebar

**Decision**: The `SettingsView` page component renders `LeftSidebar` as a sibling, same as `GuestListView`, `SeatingPlanView`, and `ImportGuestsView`.
**Reasoning**: All existing page components follow this pattern — they render `<LeftSidebar ... />` followed by `<main>...</main>`. The `LeftSidebar` is not rendered by `App.tsx` because its bottom section content varies by view. `SettingsView` continues this pattern for consistency.

### DD-7: Redirect After Delete

**Decision**: After the delete action completes and `window.location.reload()` fires, the user lands on `/` (guest list empty state), not `/settings`.
**Reasoning**: After deleting all data, the most useful landing page is the guest list, which shows the empty state with prompts to add guests. Staying on `/settings` after deletion would be a dead end — there's nothing left to export or delete. The redirect is achieved by navigating to `/` before reloading: `window.location.href = '/'`.

## UI/UX Details

### Settings Page Layout

```
+---------------------------+----------------------------------------------+
|  SEATING_01               |                                              |
|  ACTIVE SESSION           |    SETTINGS                                  |
|                           |                                              |
|  > Listado de invitados   |    ── PROJECT DATA ────────────────────       |
|  > Canvas                 |                                              |
|  > Settings          ●    |    Export your project data to a JSON file    |
|                           |    for backup or transfer.                    |
|                           |    [↓ EXPORT_PROJECT]                         |
|                           |                                              |
|                           |    ─────────────────────────────────────      |
|                           |                                              |
|                           |    Import a previously exported project       |
|                           |    file. This replaces all current data.      |
|                           |    [↑ IMPORT_PROJECT]                         |
|                           |    ⚠ INVALID_FILE // ...  (if error)         |
|                           |                                              |
|                           |    ─────────────────────────────────────      |
|                           |                                              |
|  ┌───────────────────┐    |    Permanently delete all project data        |
|  │ ADD GUEST          │    |    including guests, tables, and seating      |
|  │ IMPORT_CSV         │    |    assignments.                               |
|  └───────────────────┘    |    [✕ DELETE_PROJECT]                         |
|                           |                                              |
+---------------------------+----------------------------------------------+
```

### Settings Page — Mobile Layout

```
+------------------------------------------+
| ● PLANNER_V1.0                           |  ← TopNav (no overflow icon)
+------------------------------------------+
|                                          |
|  SETTINGS                                |
|                                          |
|  ── PROJECT DATA ─────────────────       |
|                                          |
|  Export your project data to a JSON      |
|  file for backup or transfer.            |
|  [↓ EXPORT_PROJECT]                       |
|                                          |
|  ─────────────────────────────────       |
|                                          |
|  Import a previously exported project    |
|  file. This replaces all current data.   |
|  [↑ IMPORT_PROJECT]                       |
|                                          |
|  ─────────────────────────────────       |
|                                          |
|  Permanently delete all project data     |
|  including guests, tables, and seating   |
|  assignments.                            |
|  [✕ DELETE_PROJECT]                       |
|                                          |
+------------------------------------------+
| CANVAS      GUESTS      SETTINGS         |  ← BottomTabBar (3 tabs)
+------------------------------------------+
```

### Page Header

- Element: `<h1>` with `text-heading-4 text-foreground-heading tracking-wider`
- Text: `SETTINGS`

### Section Header — "PROJECT DATA"

- Style: `text-label text-foreground-muted tracking-wider uppercase`
- Separator: `border-b border-border pb-2 mb-4` below the label

### Action Items

Each action is a vertical block with:

- **Description text**: `text-body-sm text-foreground-muted mb-2` — explains what the action does
- **Button**: full-width on mobile, auto-width on desktop

### Export Button

- Style: `btn-secondary flex items-center justify-center gap-2`
- Icon: `LuDownload` from `react-icons/lu` (size 16)
- Label: `EXPORT_PROJECT`

### Import Button

- Style: `btn-secondary flex items-center justify-center gap-2`
- Icon: `LuUpload` from `react-icons/lu` (size 16)
- Label: `IMPORT_PROJECT`

### Import Error Message

- Style: `text-caption text-red-400 mt-1`
- Text: `INVALID_FILE // THE SELECTED FILE IS NOT A VALID PROJECT EXPORT`
- Clears when the user clicks import again

### Delete Button

- Style: `btn-destructive flex items-center justify-center gap-2`
- Icon: `LuTrash2` from `react-icons/lu` (size 16)
- Label: `DELETE_PROJECT`

### Delete Confirmation Dialog

```
┌─────────────────────────────────────┐
│                                     │
│  ⚠ DELETE_PROJECT                   │
│                                     │
│  TARGET: ALL_PROJECT_DATA           │
│                                     │
│  This will permanently delete all   │
│  guests, tables, and seating        │
│  assignments. This action cannot    │
│  be undone.                         │
│                                     │
│  [CANCEL]       [CONFIRM_DELETE]    │
│                                     │
└─────────────────────────────────────┘
```

Uses the existing `ConfirmDialog` molecule with:

- `title="DELETE_PROJECT"`
- `targetName="ALL_PROJECT_DATA"`
- `message="This will permanently delete all guests, tables, and seating assignments. This action cannot be undone."`
- `confirmLabel="CONFIRM_DELETE"`
- `cancelLabel="CANCEL"`

### Import Confirmation Dialog

Same as current implementation — uses `ConfirmDialog` with:

- `title="IMPORT_PROJECT"`
- `targetName="PROJECT_DATA"`
- `message="This will replace all current data including guests, tables, and seating assignments. This action cannot be undone."`
- `confirmLabel="CONFIRM_IMPORT"`
- `cancelLabel="CANCEL"`

### Sidebar Navigation Item

- Uses existing `SidebarNavItem` molecule (`src/components/molecules/SidebarNavItem.tsx`)
- Label: `"Settings"`
- Active when `location.pathname === '/settings'`

### Bottom Tab Bar — Settings Tab

- Uses existing `TabBarItem` atom (`src/components/atoms/TabBarItem.tsx`)
- Icon: `LuSettings` from `react-icons/lu` (size 16)
- Label: `"SETTINGS"`
- Active when `location.pathname === '/settings'`

## Data Requirements

### localStorage Keys Affected by Delete

| Key                          | Type           | Delete Action         |
| ---------------------------- | -------------- | --------------------- |
| `seating-plan:guests`        | `Guest[]`      | `removeItem()` called |
| `seating-plan:tables`        | `FloorTable[]` | `removeItem()` called |
| `seating-plan:table-counter` | `number`       | `removeItem()` called |

### New Utility Function — `deleteProject()`

Added to `src/utils/project-export.ts`:

```typescript
export function deleteProject(): void {
  localStorage.removeItem('seating-plan:guests')
  localStorage.removeItem('seating-plan:tables')
  localStorage.removeItem('seating-plan:table-counter')
}
```

### Existing Utilities Reused (No Changes)

- `downloadProjectExport()` from `src/utils/project-export.ts` — used by export button
- `validateProjectImport()` from `src/utils/project-export.ts` — used by `useProjectImport` hook
- `applyProjectImport()` from `src/utils/project-export.ts` — used by `useProjectImport` hook
- `useProjectImport()` from `src/hooks/useProjectImport.ts` — used by the settings page for import flow (file input ref, pending import state, confirm/cancel handlers)

## Technical Plan

### Impact Analysis

#### Affected Areas

| Area                | Files                                              | Type of Change                                                                |
| ------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------- |
| Utility module      | `src/utils/project-export.ts`                      | **Modify** — add `deleteProject()` function (append after line 83)            |
| Settings page       | `src/pages/SettingsView.tsx`                       | **Create** — new page component with export/import/delete actions             |
| Routing             | `src/main.tsx`                                     | **Modify** — add `/settings` route (after line 29)                            |
| Left sidebar        | `src/components/organisms/LeftSidebar.tsx`         | **Modify** — add "Settings" nav item, fix active states, remove export/import |
| Bottom tab bar      | `src/components/organisms/BottomTabBar.tsx`        | **Modify** — add "SETTINGS" tab, fix GUESTS active state                      |
| Top nav             | `src/components/organisms/TopNav.tsx`              | **Modify** — remove `onOpenProjectMenu` prop and overflow menu icon           |
| App shell           | `src/App.tsx`                                      | **Modify** — remove ProjectActionsSheet state, isMobile, and sheet rendering  |
| Mobile bottom sheet | `src/components/organisms/ProjectActionsSheet.tsx` | **Delete** — no longer needed (129 lines)                                     |

#### Integration Points

1. **`LeftSidebar`** (184 lines): Currently rendered by `GuestListView`, `SeatingPlanView`, `ImportGuestsView`, and will be rendered by `SettingsView`. The sidebar's nav section gets a third item ("Settings"). The bottom section loses the export/import buttons — only view-specific actions remain. **Critical**: The "Listado de invitados" nav item currently uses `isActive={!isCanvasView}` (line 84), which would incorrectly be active on `/settings`. This must be fixed.
2. **`BottomTabBar`** (30 lines): Currently has 2 tabs (CANVAS, GUESTS). Gets a third tab (SETTINGS). The `justify-around` layout (line 12) handles 3 items without any CSS changes. **Critical**: The GUESTS tab uses `isActive={!isCanvasView}` (line 22), which would incorrectly be active on `/settings`. This must be fixed.
3. **`TopNav`** (33 lines): Reverts to a no-props stateless component. The `LuEllipsisVertical` icon (line 1) and `IconButton` (line 2) imports are removed.
4. **`App.tsx`** (26 lines): Becomes a thin shell again — only `Outlet`, `TopNav`, and `BottomTabBar`. No state, no hooks beyond what React Router provides.
5. **`useProjectImport` hook** (69 lines): Reused unchanged by `SettingsView`. Returns: `fileInputRef`, `importError`, `pendingImport`, `openFilePicker`, `handleFileSelected`, `confirmImport`, `cancelImport`, `clearError`.
6. **`ConfirmDialog` molecule** (52 lines): Reused unchanged for both import confirmation and delete confirmation on the settings page. Props: `title`, `targetName`, `message`, `confirmLabel?`, `cancelLabel?`, `onConfirm`, `onCancel`.

#### Risk Areas

1. **Three-tab BottomTabBar**: Adding a third tab changes the mobile navigation layout. Visual testing should confirm that three tabs distribute well on small screens (320px+).
2. **LeftSidebar bottom section on settings page**: On `/settings`, the sidebar's `isCanvasView` check is false, so it renders guest list actions (ADD GUEST, IMPORT_CSV if prop provided). `SettingsView` does NOT pass `onImportGuests` to `LeftSidebar`, so only ADD GUEST shows. This is acceptable — the sidebar consistently shows guest list actions for non-canvas routes.
3. **Delete redirect**: `window.location.href = '/'` triggers a full page navigation + reload to `/`, ensuring the user lands on the guest list. This is a navigation (not just a reload), so the browser will load `/` from scratch.
4. **Active state bug in existing code**: Both `LeftSidebar` (line 84) and `BottomTabBar` (line 22) use `!isCanvasView` as the "guests" active state. Adding `/settings` as a third route requires updating these to exclude the settings path, or both "Listado de invitados" (sidebar) and "GUESTS" (tab bar) would incorrectly appear active on `/settings`.

### Dependency Graph

```
TASK-001 (project-export.ts)  ──┐
                                 ├──> TASK-002 (SettingsView.tsx) ──> TASK-003 (main.tsx route)
                                 │
TASK-004 (LeftSidebar.tsx)  ─────┘  (independent, no deps)
TASK-005 (BottomTabBar.tsx)         (independent, no deps)
TASK-006 (TopNav.tsx)         ──┐
                                 ├──> must be done together (co-dependent)
TASK-007 (App.tsx + delete)   ──┘
```

**Parallel groups:**

- **Group A** (independent, run in parallel): TASK-001, TASK-004, TASK-005, TASK-006+007
- **Group B** (depends on TASK-001): TASK-002
- **Group C** (depends on TASK-002): TASK-003

### Task Breakdown

#### TASK-001: Add `deleteProject()` to `src/utils/project-export.ts`

- **Description**: Add a new utility function that removes all three localStorage keys used by the app.
- **Files**: `src/utils/project-export.ts` (modify)
- **Dependencies**: None
- **Exact change location**: Append after line 83 (end of file, after the closing `}` of `downloadProjectExport`)
- **Instructions**:
  1. Add the following function after the last line (83) of the file:

     ```typescript
     export function deleteProject(): void {
       localStorage.removeItem('seating-plan:guests')
       localStorage.removeItem('seating-plan:tables')
       localStorage.removeItem('seating-plan:table-counter')
     }
     ```

  2. Resulting file will be 89 lines. The function order will be: `generateProjectExport` (line 14), `validateProjectImport` (line 36), `applyProjectImport` (line 61), `downloadProjectExport` (line 70), `deleteProject` (line 85).
  3. Follow project conventions: no semicolons, single quotes, 2-space indent, named export.

- **Project context**: The three localStorage keys are the same ones used by `generateProjectExport()` (lines 15-17) and `applyProjectImport()` (lines 62-67): `seating-plan:guests`, `seating-plan:tables`, `seating-plan:table-counter`. Using `removeItem()` is preferred over writing defaults because `createStorage.read()` in `src/data/storage-utils.ts` already returns `fallbackValue` when keys are absent.
- **Acceptance criteria**:
  - `deleteProject()` is exported from `src/utils/project-export.ts`
  - After calling `deleteProject()`, all three localStorage keys return `null` from `localStorage.getItem()`
  - File passes `prettier --check` and `eslint`

#### TASK-002: Create `SettingsView` Page Component

- **Description**: Create the settings page component that renders the LeftSidebar and a main content area with export, import, and delete project actions.
- **Files**: `src/pages/SettingsView.tsx` (create)
- **Dependencies**: TASK-001 (needs `deleteProject()` export from `project-export.ts`)
- **Instructions**:
  1. Create `src/pages/SettingsView.tsx` following the page layout pattern from `ImportGuestsView` (`src/pages/ImportGuestsView.tsx`, 42 lines — the simplest page example):

     ```typescript
     import { useState, useCallback } from 'react'
     import { useNavigate } from 'react-router'
     import { LuDownload, LuUpload, LuTrash2 } from 'react-icons/lu'
     import { getGuests } from '../data/guest-store'
     import { getTables } from '../data/table-store'
     import LeftSidebar from '../components/organisms/LeftSidebar'
     import ConfirmDialog from '../components/molecules/ConfirmDialog'
     import {
       downloadProjectExport,
       deleteProject,
     } from '../utils/project-export'
     import { useProjectImport } from '../hooks/useProjectImport'
     ```

  2. Define the component. Key patterns to follow:
     - `getGuests()` and `getTables()` called directly (not wrapped in `useState`) — same pattern as `ImportGuestsView` line 13: `const tables = getTables()`. Settings page doesn't mutate guest/table state so no reactive state needed.
     - `useCallback` for sidebar callback props (`onAddGuest`, `onAddTable`) — per G-49.
     - Function declarations for local handlers (`handleExport`, `handleDeleteConfirm`, `handleDeleteCancel`) — per G-45.
     - `LeftSidebar` receives `onAddGuest` and `onAddTable` but NOT `onImportGuests` — same as `ImportGuestsView` (line 29-34). This means IMPORT_CSV button won't render in sidebar on settings page.

     ```typescript
     function SettingsView() {
       const navigate = useNavigate()
       const guests = getGuests()
       const tables = getTables()
       const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

       const {
         fileInputRef,
         importError,
         pendingImport,
         openFilePicker,
         handleFileSelected,
         confirmImport,
         cancelImport,
       } = useProjectImport()

       const handleNavigateToAdd = useCallback(() => {
         navigate('/guests/new')
       }, [navigate])

       const handleSidebarAddTable = useCallback(() => {
         navigate('/seating-plan')
       }, [navigate])

       function handleExport() {
         downloadProjectExport()
       }

       function handleDeleteConfirm() {
         deleteProject()
         window.location.href = '/'
       }

       function handleDeleteCancel() {
         setShowDeleteConfirm(false)
       }

       return (
         <>
           <LeftSidebar
             onAddGuest={handleNavigateToAdd}
             onAddTable={handleSidebarAddTable}
             guests={guests}
             tables={tables}
           />
           <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
             <div className="max-w-xl mx-auto px-4 md:px-6 py-6 md:py-10">
               <h1 className="text-heading-4 text-foreground-heading tracking-wider mb-8">
                 SETTINGS
               </h1>

               {/* Section: Project Data */}
               <div>
                 <h2 className="text-label text-foreground-muted tracking-wider uppercase border-b border-border pb-2 mb-6">
                   PROJECT DATA
                 </h2>

                 {/* Export */}
                 <div className="mb-6">
                   <p className="text-body-sm text-foreground-muted mb-2">
                     Export your project data to a JSON file for backup or
                     transfer.
                   </p>
                   <button
                     className="btn-secondary flex items-center justify-center gap-2 w-full md:w-auto"
                     onClick={handleExport}
                   >
                     <LuDownload size={16} />
                     EXPORT_PROJECT
                   </button>
                 </div>

                 <div className="border-t border-border my-6" />

                 {/* Import */}
                 <div className="mb-6">
                   <p className="text-body-sm text-foreground-muted mb-2">
                     Import a previously exported project file. This replaces
                     all current data.
                   </p>
                   <button
                     className="btn-secondary flex items-center justify-center gap-2 w-full md:w-auto"
                     onClick={openFilePicker}
                   >
                     <LuUpload size={16} />
                     IMPORT_PROJECT
                   </button>
                   {importError && (
                     <p className="text-caption text-red-400 mt-1">
                       {importError}
                     </p>
                   )}
                 </div>

                 <div className="border-t border-border my-6" />

                 {/* Delete */}
                 <div>
                   <p className="text-body-sm text-foreground-muted mb-2">
                     Permanently delete all project data including guests,
                     tables, and seating assignments.
                   </p>
                   <button
                     className="btn-destructive flex items-center justify-center gap-2 w-full md:w-auto"
                     onClick={() => setShowDeleteConfirm(true)}
                   >
                     <LuTrash2 size={16} />
                     DELETE_PROJECT
                   </button>
                 </div>
               </div>
             </div>
           </main>

           {/* Hidden file input for import */}
           <input
             ref={fileInputRef}
             type="file"
             accept=".json"
             className="hidden"
             onChange={handleFileSelected}
           />

           {/* Import confirmation dialog */}
           {pendingImport && (
             <ConfirmDialog
               title="IMPORT_PROJECT"
               targetName="PROJECT_DATA"
               message="This will replace all current data including guests, tables, and seating assignments. This action cannot be undone."
               confirmLabel="CONFIRM_IMPORT"
               cancelLabel="CANCEL"
               onConfirm={confirmImport}
               onCancel={cancelImport}
             />
           )}

           {/* Delete confirmation dialog */}
           {showDeleteConfirm && (
             <ConfirmDialog
               title="DELETE_PROJECT"
               targetName="ALL_PROJECT_DATA"
               message="This will permanently delete all guests, tables, and seating assignments. This action cannot be undone."
               confirmLabel="CONFIRM_DELETE"
               cancelLabel="CANCEL"
               onConfirm={handleDeleteConfirm}
               onCancel={handleDeleteCancel}
             />
           )}
         </>
       )
     }

     export default SettingsView
     ```

  3. Follow project conventions: no semicolons, single quotes, 2-space indent, `import type` for type-only imports, default export. Note: long description strings will be broken across lines by prettier at 80-char print width — the code above accounts for this.

- **Project context**: The `LeftSidebar` Props interface (lines 19-25 of `LeftSidebar.tsx`) is:
  ```ts
  interface Props {
    onAddGuest: () => void
    onImportGuests?: () => void // optional — NOT passed by SettingsView
    onAddTable?: () => void // optional
    guests?: Guest[] // optional, defaults to []
    tables?: FloorTable[] // optional, defaults to []
  }
  ```
  The `useProjectImport` hook (line 8 of `useProjectImport.ts`) returns 8 values; we use 7 (all except `clearError` — which is only needed by `ProjectActionsSheet`). The `ConfirmDialog` molecule (lines 3-11 of `ConfirmDialog.tsx`) requires `title`, `targetName`, `message`, `onConfirm`, `onCancel`; optionally accepts `confirmLabel` and `cancelLabel`.
- **Acceptance criteria**:
  - `SettingsView` renders `LeftSidebar` and a settings page content area
  - Page header shows "SETTINGS"
  - "PROJECT DATA" section with export, import, and delete actions
  - Export button triggers file download via `downloadProjectExport()`
  - Import button opens file picker; valid file shows import ConfirmDialog; invalid file shows error
  - Delete button shows delete ConfirmDialog; confirming clears localStorage and navigates to `/`
  - Responsive: full-width buttons on mobile, auto-width on desktop
  - File passes `prettier --check` and `eslint`

#### TASK-003: Add `/settings` Route to `src/main.tsx`

- **Description**: Register the `/settings` route in the app router.
- **Files**: `src/main.tsx` (modify)
- **Dependencies**: TASK-002 (needs `SettingsView` component)
- **Exact change locations**: Line 10 (imports) and line 29 (routes)
- **Instructions**:
  1. Add import after line 10 (`import ImportGuestsView from './pages/ImportGuestsView.tsx'`):
     ```typescript
     import SettingsView from './pages/SettingsView.tsx'
     ```
  2. Add a new `<Route>` after line 29 (`<Route path="seating-plan" element={<SeatingPlanView />} />`), inside the `<Route element={<App />}>` block:
     ```tsx
     <Route path="settings" element={<SettingsView />} />
     ```
  3. The resulting route tree inside `<Route element={<App />}>` (lines 22-31) becomes:
     ```tsx
     <Route element={<App />}>
       <Route path="guests/import" element={<ImportGuestsView />} />
       <Route element={<GuestListView />}>
         <Route index element={null} />
         <Route path="guests/new" element={<AddGuestPage />} />
         <Route path="guests/:id/edit" element={<EditGuestPage />} />
       </Route>
       <Route path="seating-plan" element={<SeatingPlanView />} />
       <Route path="settings" element={<SettingsView />} />
     </Route>
     ```
- **Project context**: The router in `src/main.tsx` (34 lines) uses `BrowserRouter` + `Routes` + `Route` from `react-router` (v7). All page routes are children of the `<Route element={<App />}>` layout route (line 22). The `App` component renders `TopNav`, `<Outlet />`, and `BottomTabBar`.
- **Acceptance criteria**:
  - Navigating to `/settings` renders the `SettingsView` component
  - The route is a child of the `App` layout route
  - File passes `prettier --check` and `eslint`

#### TASK-004: Add "Settings" Navigation to `LeftSidebar` and Remove Export/Import

- **Description**: Add a third `SidebarNavItem` for "Settings" in the navigation section. Fix the "Listado de invitados" active state to exclude `/settings`. Remove the export/import buttons, separator, error display, ConfirmDialog, hidden file input, and related imports from the bottom section.
- **Files**: `src/components/organisms/LeftSidebar.tsx` (modify)
- **Dependencies**: None (can be done independently)
- **Exact change locations with line-by-line instructions**:

  **Step 1 — Update imports (lines 1-17).** Replace the entire import block:

  Current (lines 1-17):

  ```typescript
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

  Replace with (removed: `LuDownload`, `ConfirmDialog`, `downloadProjectExport`, `useProjectImport`; kept: `LuUpload` for IMPORT_CSV button):

  ```typescript
  import { LuUserPlus, LuPlus, LuGripVertical, LuUpload } from 'react-icons/lu'
  import { useDraggable } from '@dnd-kit/react'
  import { useLocation, useNavigate } from 'react-router'
  import SidebarNavItem from '../molecules/SidebarNavItem'
  import type { Guest } from '../../data/guest-types'
  import type { FloorTable } from '../../data/table-types'
  import { getUnassignedGuests } from '../../data/guest-utils'
  import { DRAG_TYPE_GUEST } from '../../data/dnd-types'
  ```

  **Step 2 — Remove `useProjectImport()` hook call (lines 62-70).** Delete these lines entirely:

  ```typescript
  const {
    fileInputRef,
    importError,
    pendingImport,
    openFilePicker,
    handleFileSelected,
    confirmImport,
    cancelImport,
  } = useProjectImport()
  ```

  **Step 3 — Add "Settings" nav item and fix "Listado de invitados" active state (lines 80-92).**

  Current nav items (lines 80-92):

  ```tsx
  {
    /* Nav items */
  }
  ;<div className="flex-1 py-2">
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
  </div>
  ```

  Replace with (add `isSettingsView` variable, fix "Listado" active state, add "Settings" item):

  ```tsx
  {
    /* Nav items */
  }
  ;<div className="flex-1 py-2">
    <SidebarNavItem
      label="Listado de invitados"
      isActive={!isCanvasView && location.pathname !== '/settings'}
      onClick={() => navigate('/')}
    />
    <SidebarNavItem
      label="Canvas"
      isActive={isCanvasView}
      onClick={() => navigate('/seating-plan')}
    />
    <SidebarNavItem
      label="Settings"
      isActive={location.pathname === '/settings'}
      onClick={() => navigate('/settings')}
    />
  </div>
  ```

  **Note**: The "Listado de invitados" `isActive` changes from `{!isCanvasView}` to `{!isCanvasView && location.pathname !== '/settings'}`. This is **critical** — without it, the guest list nav item would show as active on `/settings`. An alternative is to compute `const isSettingsView = location.pathname === '/settings'` alongside `isCanvasView` (line 58) and use `isActive={!isCanvasView && !isSettingsView}`.

  **Step 4 — Remove export/import buttons, separator, ConfirmDialog, and file input from bottom section (lines 138-179).** Delete everything from the separator comment through the hidden input:

  Current (lines 138-179):

  ```tsx
        {/* Project actions separator */}
        <div className="border-t border-border my-3" />

        <button
          className="btn-secondary w-full flex items-center justify-center gap-2"
          onClick={downloadProjectExport}
        >
          <LuDownload size={16} />
          EXPORT_PROJECT
        </button>
        <button
          className="btn-secondary w-full flex items-center justify-center gap-2 mt-2"
          onClick={openFilePicker}
        >
          <LuUpload size={16} />
          IMPORT_PROJECT
        </button>
        {importError && (
          <p className="text-caption text-red-400 mt-1">{importError}</p>
        )}
      </div>

      {pendingImport && (
        <ConfirmDialog
          title="IMPORT_PROJECT"
          targetName="PROJECT_DATA"
          message="This will replace all current data including guests, tables, and seating assignments. This action cannot be undone."
          confirmLabel="CONFIRM_IMPORT"
          cancelLabel="CANCEL"
          onConfirm={confirmImport}
          onCancel={cancelImport}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileSelected}
      />
  ```

  Replace with just the closing `</div>` for the bottom actions section:

  ```tsx
      </div>
  ```

  The bottom actions `<div>` (line 95) now ends after the canvas/guest list conditional block (line 137) with just `</div>`.

- **Project context**: After this change, the `LeftSidebar` imports shrink from 10 import statements to 7. The `useProjectImport` hook is no longer called, and no `ConfirmDialog` is rendered. The `LuUpload` icon is kept because it's used for the IMPORT_CSV button (line 132). The component will go from 184 lines to approximately 135 lines.
- **Acceptance criteria**:
  - "Settings" nav item visible below "Canvas" in the sidebar
  - "Settings" nav item navigates to `/settings` and shows active styling when on that route
  - "Listado de invitados" is NOT active when on `/settings`
  - No export/import buttons in the sidebar bottom section
  - No `ConfirmDialog` or hidden file input in `LeftSidebar`
  - Unused imports removed (`LuDownload`, `ConfirmDialog`, `downloadProjectExport`, `useProjectImport`)
  - `LuUpload` import retained (used by IMPORT_CSV button)
  - File passes `prettier --check` and `eslint`

#### TASK-005: Add "SETTINGS" Tab to `BottomTabBar`

- **Description**: Add a third tab for "SETTINGS" in the mobile bottom tab bar. Fix the GUESTS tab active state to exclude `/settings`.
- **Files**: `src/components/organisms/BottomTabBar.tsx` (modify)
- **Dependencies**: None (can be done independently)
- **Exact change locations with line-by-line instructions**:

  **Step 1 — Update icon import (line 1).**

  Current:

  ```typescript
  import { LuSquarePen, LuUser } from 'react-icons/lu'
  ```

  Replace with:

  ```typescript
  import { LuSquarePen, LuUser, LuSettings } from 'react-icons/lu'
  ```

  **Step 2 — Add `isSettingsView` variable after `isCanvasView` (after line 8).**

  Current (line 8):

  ```typescript
  const isCanvasView = location.pathname === '/seating-plan'
  ```

  Add after it:

  ```typescript
  const isSettingsView = location.pathname === '/settings'
  ```

  **Step 3 — Fix GUESTS tab active state (line 22).**

  Current:

  ```tsx
          isActive={!isCanvasView}
  ```

  Replace with:

  ```tsx
          isActive={!isCanvasView && !isSettingsView}
  ```

  **Step 4 — Add SETTINGS tab after the GUESTS `TabBarItem` (after line 24, before `</div>`).**

  Insert:

  ```tsx
  <TabBarItem
    icon={<LuSettings size={16} />}
    label="SETTINGS"
    isActive={isSettingsView}
    onClick={() => navigate('/settings')}
  />
  ```

  **Resulting full file:**

  ```typescript
  import { LuSquarePen, LuUser, LuSettings } from 'react-icons/lu'
  import { useLocation, useNavigate } from 'react-router'
  import TabBarItem from '../atoms/TabBarItem'

  function BottomTabBar() {
    const location = useLocation()
    const navigate = useNavigate()
    const isCanvasView = location.pathname === '/seating-plan'
    const isSettingsView = location.pathname === '/settings'

    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border">
        <div className="flex items-center justify-around py-2 px-4">
          <TabBarItem
            icon={<LuSquarePen size={16} />}
            label="CANVAS"
            isActive={isCanvasView}
            onClick={() => navigate('/seating-plan')}
          />
          <TabBarItem
            icon={<LuUser size={16} />}
            label="GUESTS"
            isActive={!isCanvasView && !isSettingsView}
            onClick={() => navigate('/')}
          />
          <TabBarItem
            icon={<LuSettings size={16} />}
            label="SETTINGS"
            isActive={isSettingsView}
            onClick={() => navigate('/settings')}
          />
        </div>
      </nav>
    )
  }

  export default BottomTabBar
  ```

- **Project context**: `BottomTabBar` (`src/components/organisms/BottomTabBar.tsx`, 30 lines) currently renders 2 `TabBarItem` components. The container uses `flex items-center justify-around` (line 12), which naturally accommodates 3 items. The `TabBarItem` atom (`src/components/atoms/TabBarItem.tsx`, 34 lines) accepts `icon: ReactNode`, `label: string`, `isActive: boolean`, `onClick: () => void`.
- **Acceptance criteria**:
  - "SETTINGS" tab visible as third tab in `BottomTabBar` on mobile
  - Settings tab has `LuSettings` icon
  - Settings tab navigates to `/settings`
  - Settings tab shows active styling when on `/settings`
  - GUESTS tab is NOT active when on `/settings`
  - CANVAS tab is NOT active when on `/settings`
  - File passes `prettier --check` and `eslint`

#### TASK-006: Revert `TopNav` to Stateless No-Props Component

- **Description**: Remove the overflow menu icon button and `onOpenProjectMenu` prop from `TopNav`, restoring it to a simple stateless header.
- **Files**: `src/components/organisms/TopNav.tsx` (modify)
- **Dependencies**: Must be done together with TASK-007 (co-dependent — `App.tsx` passes `onOpenProjectMenu` to `TopNav`; both files must be updated atomically)
- **Exact change**: Replace the entire file content (33 lines).

  Current file (`src/components/organisms/TopNav.tsx`, 33 lines):

  ```typescript
  import { LuEllipsisVertical } from 'react-icons/lu'
  import IconButton from '../atoms/IconButton'

  interface Props {
    onOpenProjectMenu?: () => void
  }

  function TopNav({ onOpenProjectMenu }: Props) {
    return (
      <nav className="w-full h-14 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-primary md:hidden" />
          <span className="text-label font-semibold text-foreground-heading tracking-wider">
            PLANNER_V1.0
          </span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 md:gap-3">
          {onOpenProjectMenu && (
            <div className="md:hidden">
              <IconButton onClick={onOpenProjectMenu} label="Project menu">
                <LuEllipsisVertical size={20} />
              </IconButton>
            </div>
          )}
        </div>
      </nav>
    )
  }

  export default TopNav
  ```

  Replace with (no imports, no props, no interface):

  ```typescript
  function TopNav() {
    return (
      <nav className="w-full h-14 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-primary md:hidden" />
          <span className="text-label font-semibold text-foreground-heading tracking-wider">
            PLANNER_V1.0
          </span>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 md:gap-3" />
      </nav>
    )
  }

  export default TopNav
  ```

  Removals:
  - Line 1: `import { LuEllipsisVertical } from 'react-icons/lu'`
  - Line 2: `import IconButton from '../atoms/IconButton'`
  - Lines 4-6: `interface Props { onOpenProjectMenu?: () => void }`
  - Line 8: `{ onOpenProjectMenu }` parameter
  - Lines 21-27: conditional `{onOpenProjectMenu && <div className="md:hidden">...}` block (replaced with self-closing `<div>`)

- **Project context**: `TopNav` at `src/components/organisms/TopNav.tsx` (33 lines) currently has the `onOpenProjectMenu` prop added by the `export-import-project` spec. The only consumer is `App.tsx` line 14 (`<TopNav onOpenProjectMenu={() => setIsProjectSheetOpen(true)} />`), which is removed in TASK-007.
- **Acceptance criteria**:
  - `TopNav` has no props and no interface
  - No overflow menu icon on any viewport
  - No imports at top of file (all imports removed)
  - File passes `prettier --check` and `eslint`

#### TASK-007: Clean Up `App.tsx` and Delete `ProjectActionsSheet`

- **Description**: Remove the ProjectActionsSheet state, isMobile hook, and conditional rendering from `App.tsx`. Delete the `ProjectActionsSheet` component file.
- **Files**: `src/App.tsx` (modify), `src/components/organisms/ProjectActionsSheet.tsx` (delete)
- **Dependencies**: Must be done together with TASK-006 (co-dependent)
- **Exact change for `App.tsx`**: Replace entire file (26 lines).

  Current file (`src/App.tsx`, 26 lines):

  ```typescript
  import { useState } from 'react'
  import { Outlet } from 'react-router'
  import TopNav from './components/organisms/TopNav'
  import BottomTabBar from './components/organisms/BottomTabBar'
  import ProjectActionsSheet from './components/organisms/ProjectActionsSheet'
  import { useIsMobile } from './hooks/useIsMobile'

  function App() {
    const [isProjectSheetOpen, setIsProjectSheetOpen] = useState(false)
    const isMobile = useIsMobile()

    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <TopNav onOpenProjectMenu={() => setIsProjectSheetOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <Outlet />
        </div>
        <BottomTabBar />
        {isMobile && isProjectSheetOpen && (
          <ProjectActionsSheet onClose={() => setIsProjectSheetOpen(false)} />
        )}
      </div>
    )
  }

  export default App
  ```

  Replace with:

  ```typescript
  import { Outlet } from 'react-router'
  import TopNav from './components/organisms/TopNav'
  import BottomTabBar from './components/organisms/BottomTabBar'

  function App() {
    return (
      <div className="flex flex-col h-screen overflow-hidden">
        <TopNav />
        <div className="flex flex-1 overflow-hidden">
          <Outlet />
        </div>
        <BottomTabBar />
      </div>
    )
  }

  export default App
  ```

  Removals:
  - Line 1: `import { useState } from 'react'`
  - Line 5: `import ProjectActionsSheet from './components/organisms/ProjectActionsSheet'`
  - Line 6: `import { useIsMobile } from './hooks/useIsMobile'`
  - Line 9: `const [isProjectSheetOpen, setIsProjectSheetOpen] = useState(false)`
  - Line 10: `const isMobile = useIsMobile()`
  - Line 14: `onOpenProjectMenu={() => setIsProjectSheetOpen(true)}` prop on `<TopNav>`
  - Lines 19-21: `{isMobile && isProjectSheetOpen && <ProjectActionsSheet ... />}`

  **Delete file**: `src/components/organisms/ProjectActionsSheet.tsx` (129 lines) — per G-18 (delete unused component files).

- **Project context**: `App.tsx` (26 lines) was expanded by the `export-import-project` spec to manage the `ProjectActionsSheet`. Reverting it restores the thin layout shell per G-40. After deletion, `ProjectActionsSheet.tsx` has no remaining imports anywhere in the codebase — it was only imported by `App.tsx` line 5.
- **Acceptance criteria**:
  - `App.tsx` has no state, no hooks, no ProjectActionsSheet
  - `TopNav` rendered with no props
  - `ProjectActionsSheet.tsx` file is deleted
  - `App.tsx` file passes `prettier --check` and `eslint`

## Changelog

### 2026-04-05 — Initial Implementation

- Created `SettingsView` page (`src/pages/SettingsView.tsx`) with export, import, and delete project actions
- Added `/settings` route to `src/main.tsx`
- Added `deleteProject()` utility to `src/utils/project-export.ts`
- Added "Settings" nav item to `LeftSidebar` with correct active state handling
- Added "SETTINGS" tab to `BottomTabBar` as third tab with `LuSettings` icon
- Removed export/import buttons from `LeftSidebar` bottom section
- Reverted `TopNav` to stateless no-props component (removed overflow menu)
- Cleaned up `App.tsx` (removed sheet state, isMobile hook, ProjectActionsSheet)
- Deleted `ProjectActionsSheet.tsx` component
- Validation: 0 CRITICAL, 0 MAJOR, 3 MINOR (non-blocking), 4 INFO. APPROVED.
