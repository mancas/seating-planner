# Task Report — TASK-004: Add Settings navigation to LeftSidebar

## Status: COMPLETE

## Files Modified

- `src/components/organisms/LeftSidebar.tsx`

## Changes Made

### Step 1 — Updated imports

- Removed: `LuDownload` from `react-icons/lu`
- Removed: `ConfirmDialog` from `../molecules/ConfirmDialog`
- Removed: `downloadProjectExport` from `../../utils/project-export`
- Removed: `useProjectImport` from `../../hooks/useProjectImport`
- Kept: `LuUpload` (still used by IMPORT_CSV button)
- Consolidated icon imports to single line

### Step 2 — Removed useProjectImport hook call

- Deleted the entire `useProjectImport()` destructuring block (`fileInputRef`, `importError`, `pendingImport`, `openFilePicker`, `handleFileSelected`, `confirmImport`, `cancelImport`)

### Step 3 — Fixed nav items active state and added Settings

- Changed "Listado de invitados" `isActive` from `{!isCanvasView}` to `{!isCanvasView && location.pathname !== '/settings'}` so it doesn't highlight when on `/settings`
- Added third `SidebarNavItem` with label "Settings", active when `location.pathname === '/settings'`, navigates to `/settings`

### Step 4 — Removed export/import from bottom section

- Removed project actions separator (`border-t border-border my-3`)
- Removed EXPORT_PROJECT button (used `LuDownload` + `downloadProjectExport`)
- Removed IMPORT_PROJECT button (used `LuUpload` + `openFilePicker`)
- Removed import error paragraph (`importError` display)
- Removed `ConfirmDialog` for pending import confirmation
- Removed hidden `<input type="file">` for project import
- Kept IMPORT_CSV button (in the guest list view section)

## Verification

- `npx tsc --noEmit` passes with zero errors
- File reduced from 184 lines to 129 lines
- No semicolons, single quotes, 2-space indent conventions maintained
- All removed imports are no longer referenced anywhere in the file
