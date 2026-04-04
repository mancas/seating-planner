# Spec: Export & Import Project

## Metadata

- **Slug**: `export-import-project`
- **Date**: 2026-04-04
- **Status**: Completed
- **Author**: User
- **Related specs**: [spec/guest-crud-flow.md](./guest-crud-flow.md), [spec/seating-canvas.md](./seating-canvas.md), [spec/sidebar-navigation.md](./sidebar-navigation.md), [spec/import-guests.md](./import-guests.md), [spec/mobile-canvas.md](./mobile-canvas.md)

## Description

Implement an export and import feature that allows the user to save the entire project state (guests, tables, and table counter) to a `.json` file and restore it on another machine or browser by uploading that file. This enables progress portability — the user can back up their work, transfer it between devices, or share it with collaborators.

### Core Behaviors

- **Export**: A single action that reads all localStorage data (`seating-plan:guests`, `seating-plan:tables`, `seating-plan:table-counter`), bundles it into a structured JSON object with a version identifier, and triggers a browser download of a `.json` file.
- **Import**: A file upload flow that accepts a `.json` file, validates its structure, shows a confirmation warning (since import replaces all current data), and on confirmation overwrites all localStorage keys with the imported data. After a successful import, the app state refreshes to reflect the imported data.

### Entry Points

- **Desktop (≥768px)**: Both actions are accessible from the left sidebar, visible on all views. The export action is a direct button click (no separate page needed). The import action opens a confirmation flow inline or via a dialog.
- **Mobile (<768px)**: Both actions are accessible via the `TopNav` right section, which displays an "overflow menu" icon button. Tapping the menu icon opens a `ProjectActionsSheet` (vaul Drawer bottom sheet) containing the export and import buttons. This sheet is available on all views (guest list and canvas).

## User Stories

1. As a **wedding planner**, I want to export my entire project (guests and seating plan) to a file so that I can back up my progress.
2. As a **wedding planner**, I want to import a previously exported project file so that I can restore my work on another machine or browser.
3. As a **wedding planner**, I want to be warned before importing that it will replace my current data so that I don't accidentally lose my work.
4. As a **wedding planner**, I want the exported file to include all my data (guests, tables, seat assignments, table counter) so that the restored project is a complete replica of the original.
5. As a **wedding planner on mobile**, I want to access export and import from my phone so that I can back up or restore my project without needing a desktop.
6. As a **wedding planner on mobile**, I want the export/import actions to be discoverable in a menu so that I can find them even though the sidebar is hidden.

## Acceptance Criteria

### Export

1. GIVEN the app is loaded on any view (guest list or canvas) WHEN the user clicks the "EXPORT" button in the left sidebar THEN a `.json` file is generated and downloaded to the user's device.

2. GIVEN the export button is clicked WHEN the file is generated THEN it contains a JSON object with the following structure:

   ```json
   {
     "version": 1,
     "exportedAt": "2026-04-04T12:00:00.000Z",
     "data": {
       "guests": [...],
       "tables": [...],
       "tableCounter": 0
     }
   }
   ```

3. GIVEN the export button is clicked WHEN the file is downloaded THEN the filename follows the format `seating-plan-YYYY-MM-DD.json` using the current date.

4. GIVEN the project has no guests and no tables WHEN the user clicks export THEN the file is still generated with empty arrays and counter 0 (export always succeeds).

5. GIVEN the export button is clicked WHEN the download triggers THEN no navigation occurs — the user stays on the current view.

### Import

6. GIVEN the app is loaded on any view WHEN the user clicks the "IMPORT" button in the left sidebar THEN a file picker dialog opens filtered to `.json` files.

7. GIVEN the user selects a `.json` file WHEN the file is read THEN its content is parsed and validated against the expected schema (must have `version`, `data.guests`, `data.tables`, `data.tableCounter`).

8. GIVEN the selected file is not valid JSON or does not match the expected schema WHEN validation runs THEN an error message is shown: "INVALID_FILE // THE SELECTED FILE IS NOT A VALID PROJECT EXPORT" and no data is changed.

9. GIVEN the selected file is valid WHEN validation passes THEN a confirmation dialog is shown with the message: "IMPORT_PROJECT // THIS WILL REPLACE ALL CURRENT DATA (GUESTS, TABLES, AND SEATING ASSIGNMENTS). THIS ACTION CANNOT BE UNDONE." with "CANCEL" and "CONFIRM_IMPORT" buttons.

10. GIVEN the confirmation dialog is shown WHEN the user clicks "CANCEL" THEN the dialog closes and no data is changed.

11. GIVEN the confirmation dialog is shown WHEN the user clicks "CONFIRM_IMPORT" THEN all localStorage keys are overwritten with the imported data (`seating-plan:guests`, `seating-plan:tables`, `seating-plan:table-counter`), the app state refreshes to reflect the imported data, and a brief success notification or message is shown.

12. GIVEN the import completes successfully WHEN the user views the guest list or canvas THEN all imported guests and tables are visible and functional.

13. GIVEN the user is on the guest list view WHEN the import completes THEN the user is navigated to `/` (guest list) to see the refreshed data.

14. GIVEN the user selects a file with `.json` extension but invalid content WHEN the file is parsed THEN the error message from AC-8 is displayed.

### UI Placement

15. GIVEN the app is loaded on the guest list view WHEN viewing the left sidebar bottom section THEN an "EXPORT" button and an "IMPORT" button are visible below the "ADD GUEST" and "IMPORT_CSV" buttons.

16. GIVEN the app is loaded on the canvas view WHEN viewing the left sidebar bottom section THEN an "EXPORT" button and an "IMPORT" button are visible below the "ADD TABLE" button and unassigned guests list.

17. GIVEN a mobile viewport (<768px) WHEN the user taps the overflow menu icon in the `TopNav` right section THEN a `ProjectActionsSheet` bottom sheet opens containing "EXPORT_PROJECT" and "IMPORT_PROJECT" buttons.

### Mobile Access

18. GIVEN a mobile viewport (<768px) WHEN the `ProjectActionsSheet` is open and the user taps "EXPORT_PROJECT" THEN the sheet closes and a `.json` file is generated and downloaded (same behavior as AC-1).

19. GIVEN a mobile viewport (<768px) WHEN the `ProjectActionsSheet` is open and the user taps "IMPORT_PROJECT" THEN the sheet closes and a file picker dialog opens filtered to `.json` files (same flow as AC-6 through AC-14).

20. GIVEN a mobile viewport (<768px) WHEN viewing the `TopNav` THEN an overflow menu icon button (`LuEllipsisVertical`) is visible in the right section of the nav bar, on both the guest list and canvas views.

21. GIVEN a mobile viewport (<768px) WHEN the import confirmation dialog is shown THEN it uses the same `ConfirmDialog` molecule as desktop (the dialog renders centered on screen and works on all viewports).

22. GIVEN a desktop viewport (≥768px) WHEN viewing the `TopNav` THEN the overflow menu icon button is NOT visible (hidden via `md:hidden`).

## Scope

### In Scope

- Export all localStorage data (guests, tables, table counter) to a JSON file
- File download with timestamped filename (`seating-plan-YYYY-MM-DD.json`)
- Import a JSON file via file picker
- Schema validation of the imported file
- Confirmation dialog before overwriting current data
- Overwriting all three localStorage keys on import
- Refreshing the app state after import
- Version field in the export format for future compatibility
- Export/import buttons in the left sidebar (both guest list and canvas views) — desktop
- Mobile access via `TopNav` overflow menu icon → `ProjectActionsSheet` bottom sheet (vaul Drawer)
- Error handling for invalid files
- Reusing the existing `ConfirmDialog` molecule for the import confirmation

### Out of Scope

- Server-side storage / cloud sync / API calls
- Selective import (e.g., import only guests, not tables)
- Merge strategy (combining imported data with existing data)
- Export/import of individual entities (single guest, single table)
- Automatic periodic backups
- Compression or encryption of the export file
- Migration logic between export format versions (version field is for future use)
- Export/import from settings page or dedicated route
- Undo after import

## Edge Cases

1. **Empty project export**: If there are no guests and no tables, the export produces a valid JSON file with `guests: []`, `tables: []`, `tableCounter: 0`. This file can be imported to effectively reset a project.

2. **Import replaces everything**: Import is a full replacement, not a merge. If the user has 50 guests and imports a file with 10 guests, they end up with 10 guests. The confirmation dialog makes this clear.

3. **Corrupted file**: If the user selects a file that is not valid JSON (e.g., a renamed `.txt` file), the parser catches the `JSON.parse` error and shows the invalid file error message. No data is changed.

4. **Missing fields in import**: If the imported JSON has `data.guests` but is missing `data.tables`, the import is rejected as invalid (all three data fields are required).

5. **Extra fields in import**: If the imported JSON has extra fields beyond the expected schema, they are silently ignored. Only `data.guests`, `data.tables`, and `data.tableCounter` are read.

6. **localStorage quota exceeded on import**: If the imported data is too large for localStorage, the `createStorage.write()` function's catch block falls back to in-memory storage. The app works for the session but data won't persist across reloads. No explicit error is shown (consistent with the existing graceful degradation approach from `storage-utils.ts`).

7. **Import while on canvas with selected table**: If a table is selected on the canvas when the user imports, the selection state should be cleared after import since the selected table's ID may no longer exist.

8. **Export file from a different app version**: The `version` field enables future migration logic. For now (version 1), any file with `version: 1` is accepted. Files with an unrecognized version are rejected with the invalid file error.

9. **Import a file exported from the same browser**: Works fine — it's effectively a "restore from backup" operation. The data is identical to what was already there.

10. **Concurrent tabs**: If the user has two tabs open and imports in one, the other tab won't auto-update (consistent with existing behavior). The stale tab refreshes on the next navigation.

11. **File with empty guests but populated tables**: Valid scenario — the user might have set up a floor plan without any guests yet. Import proceeds normally.

12. **Import immediately after export**: The data should be identical before and after the round-trip (export then import).

13. **Mobile: overflow menu while bottom sheet is open**: If a `MobilePropertiesSheet` or `MobileGuestsSheet` is already open when the user taps the overflow menu icon, the `ProjectActionsSheet` opens on top (higher z-index stacking via vaul portal). Alternatively, the other sheet may close first — implementation should ensure only one vaul Drawer is active at a time to avoid gesture conflicts. The simplest approach: closing any open sheet before opening the `ProjectActionsSheet`.

14. **Mobile: import triggers page reload**: On mobile, after a successful import, `window.location.reload()` fires the same as desktop. The bottom sheet and overlay are destroyed by the reload, so no cleanup is needed.

15. **Mobile: file picker on iOS Safari**: The `<input type="file" accept=".json">` may show "Browse" or "Choose File" on iOS. The accept attribute may not filter strictly on iOS — the file is validated after selection regardless, so invalid files are caught by AC-8.

## Design Decisions

### DD-1: Export Format — Versioned JSON

**Decision**: The export file is a JSON object with a `version` number (starting at 1), an `exportedAt` ISO timestamp, and a `data` object containing all three localStorage payloads (`guests`, `tables`, `tableCounter`). The file extension is `.json`.
**Reasoning**: JSON is the natural format for data that is already JSON-serialized in localStorage. A version field future-proofs the format — if the `Guest` or `FloorTable` interfaces change, a migration function can be written that reads version N and upgrades to version N+1. The timestamp provides provenance information. `.json` is universally understood and can be inspected with any text editor.

### DD-2: Export Includes All localStorage Keys

**Decision**: The export includes all three localStorage keys used by the app: `seating-plan:guests` (Guest[]), `seating-plan:tables` (FloorTable[]), and `seating-plan:table-counter` (number). This ensures a complete project snapshot.
**Reasoning**: The table counter is essential for badge ID continuity. Without it, importing a project with tables T01–T05 and then adding a new table would restart at T01 instead of T06, creating duplicate badge IDs. Including all three keys ensures a faithful replica.

### DD-3: Import Replaces All Data (No Merge)

**Decision**: Import performs a full replacement of all localStorage data. No merge, no selective import, no conflict resolution.
**Reasoning**: Merging is complex (what if both the current and imported data have a guest with the same ID but different data? what about table badge ID conflicts?). For the intended use case — transferring a project between machines — full replacement is the correct behavior. The confirmation dialog warns the user that all current data will be lost.

### DD-4: UI Placement — Sidebar Buttons (Desktop) + TopNav Overflow Menu (Mobile)

**Decision**: On desktop (≥768px), the export and import buttons are placed in the left sidebar's bottom section, below the existing action buttons (ADD GUEST/IMPORT_CSV on guest list view, ADD TABLE on canvas view). Both buttons are visible on both views. Export uses `btn-secondary` style with a download icon. Import uses `btn-secondary` style with an upload icon. On mobile (<768px), the same actions are accessible via a `ProjectActionsSheet` bottom sheet triggered by an overflow menu icon in the `TopNav` (see DD-11).
**Reasoning**: The sidebar is the persistent navigation element visible on both views on desktop. On mobile, the sidebar is hidden (`hidden md:flex`), so a separate entry point is needed. The `TopNav` overflow menu provides a view-agnostic, always-visible entry point that follows standard mobile patterns. See DD-11 for detailed reasoning on the mobile approach.

### DD-5: File Download via Blob URL

**Decision**: Generate the JSON string, create a `Blob` with MIME type `application/json`, generate an object URL via `URL.createObjectURL()`, and trigger download by programmatically clicking a hidden `<a>` element with the `download` attribute. Revoke the object URL after download.
**Reasoning**: This is the standard client-side file download approach (same pattern used in the CSV template download from the `import-guests` spec DD-5). No server needed. The Blob API is supported in all modern browsers.

### DD-6: File Import via Hidden Input

**Decision**: The import button triggers a hidden `<input type="file" accept=".json">` element. The file is read client-side using `FileReader.readAsText()`. After validation and confirmation, the data is written to localStorage.
**Reasoning**: A hidden file input triggered by a button click is the standard pattern for custom-styled file selection. The same approach is used by the `FileDropZone` component in the import-guests feature. No drag-and-drop is needed for project import since it's a less frequent action than CSV import.

### DD-7: Confirmation Dialog — Reuse ConfirmDialog

**Decision**: The import confirmation uses the existing `ConfirmDialog` molecule component (`src/components/molecules/ConfirmDialog.tsx`), which already provides the overlay, card layout, cancel/confirm buttons, and accessibility.
**Reasoning**: The `ConfirmDialog` was created in the guest-crud-flow spec and is already used for guest deletion. Reusing it for import confirmation avoids creating a new dialog component. The `title`, `targetName`, `message`, `confirmLabel`, and `cancelLabel` props provide sufficient customization.

### DD-8: Export/Import Utility Module

**Decision**: Create a new utility module `src/utils/project-export.ts` that contains the pure logic for generating the export JSON, validating an import file, and applying the imported data to localStorage. The component only handles UI concerns (button click, file selection, dialog state).
**Reasoning**: Separating the logic from the UI follows the existing pattern (`csv-import.ts` for CSV logic, `storage-utils.ts` for localStorage abstraction). The utility module is independently testable and has no React dependencies.

### DD-9: App State Refresh After Import

**Decision**: After a successful import, the app triggers a full page reload via `window.location.reload()` to ensure all components re-read their data from localStorage.
**Reasoning**: The app's state management pattern (React state initialized from localStorage on mount, then kept in sync manually) means that overwriting localStorage directly doesn't update React state. While it would be possible to manually re-initialize all state variables, a page reload is simpler, more reliable, and ensures every component (including deeply nested ones with their own localStorage reads) picks up the new data. The brief flash of reload is acceptable for an infrequent operation like project import.

### DD-10: Filename Format

**Decision**: The exported file is named `seating-plan-YYYY-MM-DD.json` where `YYYY-MM-DD` is the current date in local time. Example: `seating-plan-2026-04-04.json`.
**Reasoning**: Including the date helps the user identify when the backup was taken. Using the project name as a prefix makes the file recognizable. ISO date format sorts chronologically in file managers.

### DD-11: Mobile Access — TopNav Overflow Menu + Bottom Sheet

**Decision**: On mobile (<768px), export and import are accessed via an overflow menu icon button (`LuEllipsisVertical`) placed in the `TopNav` right section (currently empty). Tapping the icon opens a `ProjectActionsSheet` — a vaul Drawer bottom sheet containing the "EXPORT_PROJECT" and "IMPORT_PROJECT" buttons styled identically to their sidebar counterparts. The overflow menu icon is hidden on desktop (≥768px) via `md:hidden` since the sidebar provides direct access.

**Reasoning**: Three mobile placement options were evaluated:

1. **BottomTabBar**: Currently has 2 tabs (CANVAS, GUESTS). Adding a third tab ("MORE" or "SETTINGS") was considered, but export/import are infrequent project-level actions, not top-level navigation destinations. A tab implies a persistent view, while these are one-shot actions. Adding items to the BottomTabBar also requires modifying a shared layout component, increasing scope.

2. **Floating Action Button (FAB)**: The canvas view already has 2 FABs (table properties, unassigned guests). Adding a third FAB for project actions would crowd the mobile canvas UI and create visual noise for rarely used functionality.

3. **TopNav overflow menu (chosen)**: The `TopNav` right section (`<div className="flex items-center gap-2 md:gap-3"></div>`) is currently empty. An overflow/kebab menu icon is a well-known mobile pattern for secondary actions (Android action bar overflow, iOS navigation bar actions). It's always visible regardless of which view the user is on (guest list or canvas), and it doesn't interfere with view-specific UI elements. The vaul Drawer bottom sheet for the menu content is consistent with the existing mobile sheet pattern (`MobilePropertiesSheet`, `MobileGuestsSheet`, `MobileSeatAssignmentSheet`).

This approach adds minimal UI surface (one icon in the header) while providing a natural, discoverable entry point. It also creates a reusable pattern — future project-level actions (e.g., "reset project", "settings") can be added to the same overflow sheet without additional UI changes.

## UI/UX Details

### Left Sidebar — Bottom Section (Guest List View)

```
+---------------------------+
| [  ADD GUEST  ]           |  ← btn-primary
| [  IMPORT_CSV ]           |  ← btn-secondary
|                           |
| ─────────────────────     |  ← visual separator
|                           |
| [↓ EXPORT_PROJECT]        |  ← btn-secondary
| [↑ IMPORT_PROJECT]        |  ← btn-secondary
+---------------------------+
```

### Left Sidebar — Bottom Section (Canvas View)

```
+---------------------------+
| [  ADD TABLE  ]           |  ← btn-primary
|                           |
| UNASSIGNED (5)            |
| ≡ ER  Elara Rivera        |
| ≡ AV  Alexander Vance     |
| ...                       |
|                           |
| ─────────────────────     |  ← visual separator
|                           |
| [↓ EXPORT_PROJECT]        |  ← btn-secondary
| [↑ IMPORT_PROJECT]        |  ← btn-secondary
+---------------------------+
```

### Export Button

- Style: `btn-secondary w-full`
- Icon: `LuDownload` from `react-icons/lu` (size 16)
- Label: `EXPORT_PROJECT`
- Layout: `flex items-center justify-center gap-2`

### Import Button

- Style: `btn-secondary w-full mt-2`
- Icon: `LuUpload` from `react-icons/lu` (size 16) — note: `LuUpload` is already imported in `LeftSidebar.tsx`
- Label: `IMPORT_PROJECT`
- Layout: `flex items-center justify-center gap-2`

### Import Confirmation Dialog

```
┌─────────────────────────────────────┐
│                                     │
│  ⚠ IMPORT_PROJECT                  │
│                                     │
│  TARGET: PROJECT_DATA               │
│                                     │
│  This will replace all current      │
│  data including guests, tables,     │
│  and seating assignments. This      │
│  action cannot be undone.           │
│                                     │
│  [CANCEL]        [CONFIRM_IMPORT]   │
│                                     │
└─────────────────────────────────────┘
```

Uses the existing `ConfirmDialog` molecule with:

- `title="IMPORT_PROJECT"`
- `targetName="PROJECT_DATA"`
- `message="This will replace all current data including guests, tables, and seating assignments. This action cannot be undone."`
- `confirmLabel="CONFIRM_IMPORT"`
- `cancelLabel="CANCEL"`

### Import Error Message

If the file is invalid, show an inline error below the import button:

```
+---------------------------+
| [↑ IMPORT_PROJECT]        |
|                           |
| ⚠ INVALID_FILE //        |
|   THE SELECTED FILE IS    |
|   NOT A VALID PROJECT     |
|   EXPORT                  |
+---------------------------+
```

- Style: `text-caption text-red-400 mt-1`
- Disappears when the user clicks import again (new file selection clears the error)

### Mobile — TopNav Overflow Menu Icon

```
+------------------------------------------+
| ● PLANNER_V1.0                      [⋮]  |  ← TopNav (mobile only: overflow icon)
+------------------------------------------+
```

- Icon: `LuEllipsisVertical` from `react-icons/lu` (size 20)
- Button: `IconButton` atom with `label="Project menu"`
- Visibility: `md:hidden` — only shown on mobile (<768px)
- Position: inside the existing `TopNav` right section div

### Mobile — ProjectActionsSheet (Bottom Sheet)

```
+----------------------------------+
|   (current view visible above)   |
+----------------------------------+
|          --- drag handle ---     |
|  PROJECT                     [X] |
|  ____________________________    |
|                                  |
|  [↓ EXPORT_PROJECT]              |  ← btn-secondary w-full
|  [↑ IMPORT_PROJECT]              |  ← btn-secondary w-full mt-2
|                                  |
+----------------------------------+
| CANVAS         GUESTS            |  ← BottomTabBar
+----------------------------------+
```

- Component: `ProjectActionsSheet` — new organism using vaul `Drawer`
- Pattern: Same structure as `MobilePropertiesSheet` and `MobileGuestsSheet`
- Overlay: `fixed inset-0 z-40 bg-black/40`
- Sheet: `fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl border-t border-border`
- Header: `text-label text-foreground-muted tracking-wider uppercase` — "PROJECT"
- Close button: `IconButton` with `LuX`
- Export button: same styling as sidebar export (`btn-secondary w-full`, `LuDownload` icon)
- Import button: same styling as sidebar import (`btn-secondary w-full mt-2`, `LuUpload` icon)
- After tapping export: sheet closes, download triggers
- After tapping import: sheet closes, file picker opens
- Error handling: if import file is invalid, the error is shown in a re-opened sheet or via the `ConfirmDialog` (since the sheet closes before file picker opens, errors can be shown via a toast or by re-opening the sheet with the error message)

### Mobile — Import Error on Mobile

On mobile, since the `ProjectActionsSheet` closes before the file picker opens, the import error message cannot be shown inline in the sheet. Instead, if the selected file is invalid, the error is shown via the same `ConfirmDialog` molecule (used as an alert dialog with only a "CLOSE" button):

```
┌─────────────────────────────────────┐
│                                     │
│  ⚠ INVALID_FILE                    │
│                                     │
│  THE SELECTED FILE IS NOT A VALID   │
│  PROJECT EXPORT                     │
│                                     │
│              [CLOSE]                │
│                                     │
└─────────────────────────────────────┘
```

This approach works on both desktop (as a fallback) and mobile. On desktop, the inline error below the sidebar import button remains the primary error display.

## Data Requirements

### Export File Schema

```typescript
interface ProjectExport {
  version: 1
  exportedAt: string // ISO 8601 timestamp
  data: {
    guests: Guest[]
    tables: FloorTable[]
    tableCounter: number
  }
}
```

### localStorage Keys

| Key                          | Type           | Description                 |
| ---------------------------- | -------------- | --------------------------- |
| `seating-plan:guests`        | `Guest[]`      | All guest records           |
| `seating-plan:tables`        | `FloorTable[]` | All table records           |
| `seating-plan:table-counter` | `number`       | Next table badge ID counter |

### Utility Module API (`src/utils/project-export.ts`)

```typescript
import type { Guest } from '../data/guest-types'
import type { FloorTable } from '../data/table-types'

interface ProjectExport {
  version: number
  exportedAt: string
  data: {
    guests: Guest[]
    tables: FloorTable[]
    tableCounter: number
  }
}

// Generate the export JSON string from current localStorage data
function generateProjectExport(): string

// Validate an imported file's content — returns the parsed data or null if invalid
function validateProjectImport(content: string): ProjectExport | null

// Apply imported data to localStorage (overwrites all three keys)
function applyProjectImport(data: ProjectExport): void
```

## Technical Plan

### Impact Analysis

#### Affected Areas

| Area                | Files                                              | Type of Change                                                                      |
| ------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Utility module      | `src/utils/project-export.ts`                      | **Create** — export generation, validation, apply logic                             |
| Left sidebar        | `src/components/organisms/LeftSidebar.tsx`         | **Modify** — add export/import buttons, error state, file input, confirm dialog     |
| Top nav             | `src/components/organisms/TopNav.tsx`              | **Modify** — add mobile overflow menu icon button                                   |
| Mobile bottom sheet | `src/components/organisms/ProjectActionsSheet.tsx` | **Create** — vaul Drawer with export/import buttons                                 |
| App shell           | `src/App.tsx`                                      | **Modify** — add state + callbacks for mobile project actions sheet, pass to TopNav |
| Guest list view     | `src/pages/GuestListView.tsx`                      | **Modify** — pass export/import callbacks to LeftSidebar                            |
| Seating plan view   | `src/pages/SeatingPlanView.tsx`                    | **Modify** — pass export/import callbacks to LeftSidebar                            |

#### Integration Points

1. **localStorage keys**: The utility reads/writes the same three keys used by `guest-store.ts` (`seating-plan:guests`), `table-store.ts` (`seating-plan:tables`, `seating-plan:table-counter`). Import writes directly via `localStorage.setItem()` to bypass module-level caching, followed by `window.location.reload()`.
2. **ConfirmDialog molecule**: Reused for import confirmation and mobile error display — no changes needed to the component itself.
3. **LeftSidebar props**: New optional callback props (`onExport`, `onImport`) added; existing consumers must pass them.
4. **TopNav**: Currently stateless with no props. Will receive an `onOpenProjectMenu` callback and render a mobile-only icon button.
5. **App.tsx**: The thin layout shell must lift the `ProjectActionsSheet` state since `TopNav` and the sheet are siblings in the layout. This is the minimal state needed — a boolean `isProjectSheetOpen`.
6. **vaul Drawer**: `ProjectActionsSheet` follows the identical pattern used by `MobilePropertiesSheet`, `MobileGuestsSheet`, and `MobileSeatAssignmentSheet`.

#### Risk Areas

1. **Scope isolation of LeftSidebar**: Both `GuestListView` and `SeatingPlanView` render `LeftSidebar`. The export/import logic (file input, dialog state, error state) lives inside `LeftSidebar` itself to avoid duplicating it in both views. The views only pass a thin signal (no new state).
2. **File input on iOS Safari**: The `accept=".json"` attribute may not strictly filter on iOS. Validation catches invalid files regardless.
3. **Import overwrites all data**: After `localStorage.setItem()` calls, `window.location.reload()` is essential to re-initialize all module-level `createStorage` instances.

### Task Breakdown

#### TASK-001: Create `src/utils/project-export.ts` — Export/Import Utility Module

- **Description**: Create the pure utility module that handles generating the export JSON, validating an imported file, and applying imported data to localStorage. No React dependencies.
- **Files**: `src/utils/project-export.ts` (create)
- **Instructions**:
  1. Create `src/utils/project-export.ts` with the following exports:
  2. Define the `ProjectExport` interface:

     ```typescript
     import type { Guest } from '../data/guest-types'
     import type { FloorTable } from '../data/table-types'

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

  3. Implement `generateProjectExport(): string`:
     - Read `localStorage.getItem('seating-plan:guests')`, parse or default to `[]`
     - Read `localStorage.getItem('seating-plan:tables')`, parse or default to `[]`
     - Read `localStorage.getItem('seating-plan:table-counter')`, parse or default to `0`
     - Build a `ProjectExport` object with `version: 1`, `exportedAt: new Date().toISOString()`, and the data
     - Return `JSON.stringify(exportedData, null, 2)`
  4. Implement `validateProjectImport(content: string): ProjectExport | null`:
     - Wrap `JSON.parse(content)` in try/catch — return `null` on parse failure
     - Check that parsed object has `version === 1` (number) — return `null` if not
     - Check that `data` is an object with `guests` (Array), `tables` (Array), `tableCounter` (number) — return `null` if any missing
     - Return the parsed object as `ProjectExport` if valid
  5. Implement `applyProjectImport(data: ProjectExport): void`:
     - `localStorage.setItem('seating-plan:guests', JSON.stringify(data.data.guests))`
     - `localStorage.setItem('seating-plan:tables', JSON.stringify(data.data.tables))`
     - `localStorage.setItem('seating-plan:table-counter', JSON.stringify(data.data.tableCounter))`
  6. Implement `downloadProjectExport(): void`:
     - Call `generateProjectExport()` to get the JSON string
     - Create a `Blob` with type `application/json`
     - Create object URL via `URL.createObjectURL(blob)`
     - Build the filename: `seating-plan-${new Date().toISOString().slice(0, 10)}.json`
     - Create a temporary `<a>` element, set `href` and `download`, append to `document.body`, click, remove, revoke object URL
  7. Follow project conventions: no semicolons, single quotes, 2-space indent, `import type` for type-only imports, named exports for all functions and the interface

- **Project context**: Follow the pattern of `src/utils/csv-import.ts` — pure functions with named exports, no React dependencies. localStorage keys are `seating-plan:guests`, `seating-plan:tables`, `seating-plan:table-counter` (see `src/data/guest-store.ts:5`, `src/data/table-store.ts:6-7`). Use `import type` for `Guest` and `FloorTable` per `verbatimModuleSyntax`.
- **Dependencies**: None
- **Acceptance criteria**:
  - `generateProjectExport()` returns a valid JSON string with `version: 1`, `exportedAt` ISO timestamp, and `data` containing guests/tables/tableCounter from localStorage
  - `validateProjectImport()` returns `null` for invalid JSON, missing fields, wrong version, non-array guests/tables, non-number tableCounter
  - `validateProjectImport()` returns the parsed `ProjectExport` for valid content
  - `applyProjectImport()` writes all three localStorage keys
  - `downloadProjectExport()` triggers a file download with the correct filename format
  - File passes `prettier --check` and `eslint`

#### TASK-002: Add Export/Import Buttons to `LeftSidebar`

- **Description**: Add the export and import buttons to the `LeftSidebar` bottom section (both guest list and canvas views), including the hidden file input for import, inline error display, and the ConfirmDialog for import confirmation. All import/export logic is self-contained within the sidebar.
- **Files**: `src/components/organisms/LeftSidebar.tsx` (modify)
- **Instructions**:
  1. Add new imports at the top:
     ```typescript
     import { useState, useRef } from 'react'
     import { LuDownload } from 'react-icons/lu'
     import ConfirmDialog from '../molecules/ConfirmDialog'
     import {
       downloadProjectExport,
       validateProjectImport,
       applyProjectImport,
     } from '../../utils/project-export'
     import type { ProjectExport } from '../../utils/project-export'
     ```
     Note: `LuUpload` is already imported. `LuDownload` needs to be added to the existing import.
  2. Inside the `LeftSidebar` function, add state and a ref:
     ```typescript
     const fileInputRef = useRef<HTMLInputElement>(null)
     const [importError, setImportError] = useState<string | null>(null)
     const [pendingImport, setPendingImport] = useState<ProjectExport | null>(
       null,
     )
     ```
  3. Implement `handleExport`:
     ```typescript
     function handleExport() {
       downloadProjectExport()
     }
     ```
  4. Implement `handleImportClick`:
     ```typescript
     function handleImportClick() {
       setImportError(null)
       fileInputRef.current?.click()
     }
     ```
  5. Implement `handleFileSelected`:

     ```typescript
     function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
       const file = e.target.files?.[0]
       if (!file) return
       // Reset the input so the same file can be re-selected
       e.target.value = ''

       const reader = new FileReader()
       reader.onload = () => {
         const content = reader.result as string
         const parsed = validateProjectImport(content)
         if (!parsed) {
           setImportError(
             'INVALID_FILE // THE SELECTED FILE IS NOT A VALID PROJECT EXPORT',
           )
           return
         }
         setImportError(null)
         setPendingImport(parsed)
       }
       reader.onerror = () => {
         setImportError(
           'INVALID_FILE // THE SELECTED FILE IS NOT A VALID PROJECT EXPORT',
         )
       }
       reader.readAsText(file)
     }
     ```

  6. Implement confirm/cancel handlers:

     ```typescript
     function handleConfirmImport() {
       if (!pendingImport) return
       applyProjectImport(pendingImport)
       setPendingImport(null)
       window.location.reload()
     }

     function handleCancelImport() {
       setPendingImport(null)
     }
     ```

  7. Add a hidden file input right before the closing `</aside>`:
     ```tsx
     <input
       ref={fileInputRef}
       type="file"
       accept=".json"
       className="hidden"
       onChange={handleFileSelected}
     />
     ```
  8. In the bottom actions `<div>`, after the existing buttons for **both** branches (canvas and guest list), add a separator and the export/import buttons:

     ```tsx
     {/* Project actions separator */}
     <div className="border-t border-border my-3" />

     <button
       className="btn-secondary w-full flex items-center justify-center gap-2"
       onClick={handleExport}
     >
       <LuDownload size={16} />
       EXPORT_PROJECT
     </button>
     <button
       className="btn-secondary w-full flex items-center justify-center gap-2 mt-2"
       onClick={handleImportClick}
     >
       <LuUpload size={16} />
       IMPORT_PROJECT
     </button>
     {importError && (
       <p className="text-caption text-red-400 mt-1">{importError}</p>
     )}
     ```

     This block appears once, AFTER the ternary's closing — restructure so the ternary only controls the view-specific buttons (ADD GUEST/IMPORT_CSV vs ADD TABLE/unassigned list), and the separator + export/import buttons are shared below.

  9. Add the ConfirmDialog at the end of the component JSX, just before the hidden file input:
     ```tsx
     {
       pendingImport && (
         <ConfirmDialog
           title="IMPORT_PROJECT"
           targetName="PROJECT_DATA"
           message="This will replace all current data including guests, tables, and seating assignments. This action cannot be undone."
           confirmLabel="CONFIRM_IMPORT"
           cancelLabel="CANCEL"
           onConfirm={handleConfirmImport}
           onCancel={handleCancelImport}
         />
       )
     }
     ```
  10. Since ConfirmDialog uses `fixed` positioning (z-50), it renders above the sidebar — no portal needed.

- **Project context**: `LeftSidebar` is rendered by both `GuestListView` (`src/pages/GuestListView.tsx:114`) and `SeatingPlanView` (`src/pages/SeatingPlanView.tsx:89`). No new props are needed — the export/import logic is self-contained. The `LuUpload` icon is already imported (line 1). `LuDownload` must be added. Follow existing button patterns: `btn-secondary w-full flex items-center justify-center gap-2`. Inline error style: `text-caption text-red-400 mt-1`. The `ConfirmDialog` molecule (`src/components/molecules/ConfirmDialog.tsx`) accepts `title`, `targetName`, `message`, `confirmLabel`, `cancelLabel`, `onConfirm`, `onCancel`.
- **Dependencies**: TASK-001 (needs `project-export.ts` utility)
- **Acceptance criteria**:
  - Export button with `LuDownload` icon and "EXPORT_PROJECT" label visible below a separator in the sidebar on both guest list and canvas views
  - Import button with `LuUpload` icon and "IMPORT_PROJECT" label visible below the export button
  - Clicking export triggers a `.json` file download
  - Clicking import opens a file picker filtered to `.json`
  - Selecting a valid file shows the ConfirmDialog with correct copy
  - Selecting an invalid file shows the inline error message
  - Confirming import calls `applyProjectImport()` and `window.location.reload()`
  - Cancelling import closes the dialog without changes
  - File passes `prettier --check` and `eslint`

#### TASK-003: Add Mobile Overflow Menu to `TopNav`

- **Description**: Add a mobile-only overflow menu icon button (`LuEllipsisVertical`) to the `TopNav` right section that triggers a callback to open the project actions sheet.
- **Files**: `src/components/organisms/TopNav.tsx` (modify)
- **Instructions**:
  1. Add imports:
     ```typescript
     import { LuEllipsisVertical } from 'react-icons/lu'
     import IconButton from '../atoms/IconButton'
     ```
  2. Add an `onOpenProjectMenu` optional prop:

     ```typescript
     interface Props {
       onOpenProjectMenu?: () => void
     }

     function TopNav({ onOpenProjectMenu }: Props) {
     ```

  3. Inside the right section `<div>`, add the overflow menu button:
     ```tsx
     <div className="flex items-center gap-2 md:gap-3">
       {onOpenProjectMenu && (
         <div className="md:hidden">
           <IconButton onClick={onOpenProjectMenu} label="Project menu">
             <LuEllipsisVertical size={20} />
           </IconButton>
         </div>
       )}
     </div>
     ```
  4. The `md:hidden` class ensures the button is only visible on mobile (<768px), per AC-22.

- **Project context**: `TopNav` is currently a stateless component with no props (`src/components/organisms/TopNav.tsx`). It's rendered by `App.tsx` (`src/App.tsx:8`). The right section div is currently empty (line 13). `IconButton` atom is at `src/components/atoms/IconButton.tsx` — it wraps a `<button>` with `aria-label`, hover styles, and `focus-visible` outline. Icons use `size` prop (G-22).
- **Dependencies**: None
- **Acceptance criteria**:
  - On mobile (<768px), an overflow menu icon (`LuEllipsisVertical`) is visible in the TopNav right section
  - On desktop (≥768px), the icon is hidden (`md:hidden`)
  - Clicking the icon calls the `onOpenProjectMenu` callback
  - If `onOpenProjectMenu` is not provided, no icon is rendered (backward compatible)
  - File passes `prettier --check` and `eslint`

#### TASK-004: Create `ProjectActionsSheet` Component

- **Description**: Create a new vaul Drawer bottom sheet component that displays the export and import project action buttons for mobile users. Includes file input, error dialog, and confirm dialog.
- **Files**: `src/components/organisms/ProjectActionsSheet.tsx` (create)
- **Instructions**:
  1. Create `src/components/organisms/ProjectActionsSheet.tsx` following the vaul Drawer pattern from `MobilePropertiesSheet.tsx`:
     ```typescript
     import { useState, useRef } from 'react'
     import { Drawer } from 'vaul'
     import { LuX, LuDownload, LuUpload } from 'react-icons/lu'
     import IconButton from '../atoms/IconButton'
     import ConfirmDialog from '../molecules/ConfirmDialog'
     import {
       downloadProjectExport,
       validateProjectImport,
       applyProjectImport,
     } from '../../utils/project-export'
     import type { ProjectExport } from '../../utils/project-export'
     ```
  2. Define Props:
     ```typescript
     interface Props {
       onClose: () => void
     }
     ```
  3. Implement the component:
     - State: `importError` (string | null), `pendingImport` (ProjectExport | null)
     - Ref: `fileInputRef` for the hidden file input
     - `handleExport`: call `downloadProjectExport()`, then `onClose()`
     - `handleImportClick`: clear error, close the sheet via `onClose()`, then after a short timeout (to let the sheet animate out) trigger `fileInputRef.current?.click()`. Alternative: keep the file input outside the Drawer portal so it persists after sheet close. The simplest approach: place the `<input type="file">` at the root level of the component (outside `Drawer.Portal`), so it stays mounted after the sheet closes.
     - `handleFileSelected`: same logic as TASK-002 — read file, validate, set `pendingImport` or `importError`
     - `handleConfirmImport`: call `applyProjectImport(pendingImport)`, then `window.location.reload()`
     - `handleCancelImport`: set `pendingImport(null)`, call `onClose()`
  4. Render structure:

     ```tsx
     <Drawer.Root
       open
       onOpenChange={(open) => {
         if (!open) onClose()
       }}
     >
       <Drawer.Portal>
         <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
         <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl border-t border-border flex flex-col outline-none">
           <Drawer.Handle className="bg-gray-600 my-3" />
           <Drawer.Title className="sr-only">Project Actions</Drawer.Title>

           {/* Header */}
           <div className="flex items-center justify-between px-4 pb-3 border-b border-border shrink-0">
             <span className="text-label text-foreground-muted tracking-wider uppercase">
               PROJECT
             </span>
             <IconButton onClick={onClose} label="Close project menu">
               <LuX size={20} />
             </IconButton>
           </div>

           {/* Body */}
           <div className="px-4 py-4">
             <button
               className="btn-secondary w-full flex items-center justify-center gap-2"
               onClick={handleExport}
             >
               <LuDownload size={16} />
               EXPORT_PROJECT
             </button>
             <button
               className="btn-secondary w-full flex items-center justify-center gap-2 mt-2"
               onClick={handleImportClick}
             >
               <LuUpload size={16} />
               IMPORT_PROJECT
             </button>
           </div>
         </Drawer.Content>
       </Drawer.Portal>
     </Drawer.Root>
     ```

  5. After the `Drawer.Root`, render:
     - The hidden file input (outside the portal so it persists)
     - The `ConfirmDialog` for import confirmation (when `pendingImport` is set)
     - The `ConfirmDialog` for error display (when `importError` is set) — used as an alert with only a close button:
       ```tsx
       {
         importError && (
           <ConfirmDialog
             title="INVALID_FILE"
             targetName=""
             message="THE SELECTED FILE IS NOT A VALID PROJECT EXPORT"
             confirmLabel="CLOSE"
             onConfirm={() => setImportError(null)}
             onCancel={() => setImportError(null)}
           />
         )
       }
       ```
  6. For the import click flow: since the sheet closes before the file picker opens, structure the handler to:
     - Set a local flag or use a ref to track that import was requested
     - Close the sheet (`onClose()`)
     - The file input click must happen after the sheet closes. Use a pattern: close the Drawer but keep the component mounted (the parent controls mounting). The file `<input>` is rendered outside the Drawer, so clicking it works even after the Drawer closes. Actually, the simplest approach: don't close the sheet before opening the file picker. Instead, trigger the file input click directly — the native file picker overlay will appear on top. After file selection, close the sheet in the `handleFileSelected` callback. This avoids timing issues.
     - Revised flow: `handleImportClick` → `fileInputRef.current?.click()` (file picker opens over the sheet) → `handleFileSelected` reads and validates → if valid, close sheet and show ConfirmDialog; if invalid, close sheet and show error dialog.

- **Project context**: Follow the vaul Drawer pattern from `MobilePropertiesSheet` (`src/components/organisms/MobilePropertiesSheet.tsx`), `MobileGuestsSheet` (`src/components/organisms/MobileGuestsSheet.tsx`). Same overlay z-40, content z-50, `bg-surface rounded-t-2xl border-t border-border`, drag handle, header with close button. Default export per component convention. `ConfirmDialog` renders with `fixed inset-0 z-50` so it stacks above the sheet overlay.
- **Dependencies**: TASK-001 (needs `project-export.ts` utility)
- **Acceptance criteria**:
  - Sheet opens with drag handle, "PROJECT" header, close button
  - "EXPORT_PROJECT" button triggers download and closes sheet
  - "IMPORT_PROJECT" button opens file picker
  - Valid file shows ConfirmDialog; confirming writes to localStorage and reloads
  - Invalid file shows error ConfirmDialog with "CLOSE" button
  - Cancel/close dismisses without changes
  - File passes `prettier --check` and `eslint`

#### TASK-005: Wire Up Mobile Project Actions in `App.tsx` and Views

- **Description**: Add state management in `App.tsx` for the mobile project actions sheet, pass the `onOpenProjectMenu` callback to `TopNav`, and render `ProjectActionsSheet` conditionally. This is the integration task that connects the mobile overflow menu to the sheet.
- **Files**: `src/App.tsx` (modify)
- **Instructions**:
  1. Add imports:
     ```typescript
     import { useState } from 'react'
     import ProjectActionsSheet from './components/organisms/ProjectActionsSheet'
     import { useIsMobile } from './hooks/useIsMobile'
     ```
  2. Add state inside `App`:
     ```typescript
     const [isProjectSheetOpen, setIsProjectSheetOpen] = useState(false)
     const isMobile = useIsMobile()
     ```
  3. Pass the callback to `TopNav`:
     ```tsx
     <TopNav onOpenProjectMenu={() => setIsProjectSheetOpen(true)} />
     ```
  4. Render the sheet conditionally after `<BottomTabBar />`:
     ```tsx
     {
       isMobile && isProjectSheetOpen && (
         <ProjectActionsSheet onClose={() => setIsProjectSheetOpen(false)} />
       )
     }
     ```
  5. The `App.tsx` remains thin — only 2 lines of state and 1 conditional render added. The export/import business logic remains in the utility module and `ProjectActionsSheet`/`LeftSidebar`.
- **Project context**: `App.tsx` is a thin layout shell (G-40) at `src/App.tsx`. It currently has no state and no imports beyond `Outlet`, `TopNav`, and `BottomTabBar`. Adding minimal state for the sheet toggle is acceptable — it's UI state, not business logic. `useIsMobile` hook is at `src/hooks/useIsMobile.ts`. The `isMobile` guard prevents the sheet from rendering on desktop.
- **Dependencies**: TASK-003 (TopNav with `onOpenProjectMenu` prop), TASK-004 (ProjectActionsSheet component)
- **Acceptance criteria**:
  - On mobile, tapping the TopNav overflow icon opens the `ProjectActionsSheet`
  - Closing the sheet (via close button, overlay tap, or swipe down) sets `isProjectSheetOpen` to false
  - On desktop, the sheet is never rendered
  - `App.tsx` remains concise — no business logic, just UI state
  - File passes `prettier --check` and `eslint`

### Execution Order

#### Parallel Group 1 (no dependencies)

- **TASK-001**: Create `src/utils/project-export.ts` — utility module
- **TASK-003**: Add mobile overflow menu to `TopNav`

#### Parallel Group 2 (depends on TASK-001)

- **TASK-002**: Add export/import buttons to `LeftSidebar`
- **TASK-004**: Create `ProjectActionsSheet` component

#### Parallel Group 3 (depends on TASK-003 + TASK-004)

- **TASK-005**: Wire up mobile project actions in `App.tsx`

### Verification Checklist

- [ ] Export produces a valid `.json` file with `version: 1`, `exportedAt`, and complete `data` (AC-1, AC-2, AC-3, AC-4)
- [ ] Export does not navigate away from the current view (AC-5)
- [ ] Import opens a file picker filtered to `.json` (AC-6)
- [ ] Valid file is parsed and validated against schema (AC-7)
- [ ] Invalid file shows error message (AC-8, AC-14)
- [ ] Valid file shows confirmation dialog with correct copy (AC-9)
- [ ] Cancel in confirmation dialog closes it without changes (AC-10)
- [ ] Confirm import overwrites all localStorage keys, refreshes state (AC-11, AC-12, AC-13)
- [ ] Export/import buttons visible in sidebar on guest list view (AC-15)
- [ ] Export/import buttons visible in sidebar on canvas view (AC-16)
- [ ] Mobile overflow menu icon visible in TopNav on mobile only (AC-17, AC-20, AC-22)
- [ ] Mobile export triggers download and closes sheet (AC-18)
- [ ] Mobile import opens file picker and follows same flow (AC-19)
- [ ] Mobile import confirmation uses ConfirmDialog (AC-21)
- [ ] Empty project export produces valid file with empty arrays (Edge Case 1)
- [ ] Import replaces all data (Edge Case 2)
- [ ] Corrupted file shows error (Edge Case 3)
- [ ] Missing fields rejected (Edge Case 4)
- [ ] Extra fields ignored (Edge Case 5)
- [ ] `npm run build` passes (TypeScript + Vite)
- [ ] `prettier --check .` passes
- [ ] `npm run lint` passes

## Notes

- The `version` field is set to `1` for this initial implementation. If the `Guest` or `FloorTable` interfaces change in the future, the version can be incremented and a migration function can convert older formats.
- The existing `createStorage` utility from `storage-utils.ts` wraps localStorage with a memory fallback. The export reads directly from `localStorage.getItem()` for simplicity, but could also use the store functions (`getGuests()`, `getTables()`). The import writes directly via `localStorage.setItem()` to bypass the module-level caching in the store modules, followed by a page reload to re-initialize everything cleanly.
- The `ConfirmDialog` molecule is already implemented and tested (from guest-crud-flow). It supports custom labels for both buttons and flexible message content.
- This feature is complementary to the `import-guests` CSV feature. CSV import adds guests incrementally; project import replaces everything. Both can coexist in the sidebar.
- The `TopNav` right section is currently an empty `<div>`. The overflow menu icon is the first element added here. Future project-level actions can be added to the same `ProjectActionsSheet` without modifying the `TopNav` layout further.
- The `ProjectActionsSheet` component follows the same vaul Drawer pattern as `MobilePropertiesSheet`, `MobileGuestsSheet`, and `MobileSeatAssignmentSheet`. It uses the same styling conventions (drag handle, header, close button, `bg-surface` background, `z-50` positioning).
- The export/import utility module (`src/utils/project-export.ts`) is shared between desktop (sidebar buttons) and mobile (sheet buttons) — only the UI entry point differs, the underlying logic is identical.

## Changelog

- 2026-04-04: Initial draft
- 2026-04-04: Added mobile export/import solution per user feedback — TopNav overflow menu icon + ProjectActionsSheet bottom sheet (vaul Drawer); removed "Mobile access" from Out of Scope; added mobile acceptance criteria (AC-17 through AC-22), user stories (US-5, US-6), edge cases (EC-13 through EC-15), design decision DD-11, and mobile UI/UX wireframes
- 2026-04-04: Technical plan added — 5 tasks across 3 parallel groups; impact analysis covering 7 files (2 new, 5 modified)
- 2026-04-04: Implementation completed — all 5 tasks done, validation approved after 2 iterations (3 MAJOR fixes in ProjectActionsSheet: lifecycle bug, missing error handler, convention compliance)
