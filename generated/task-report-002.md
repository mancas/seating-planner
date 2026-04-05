# Task Report: TASK-002 — Create `SettingsView.tsx`

## Status: COMPLETE

## Summary

Created `src/pages/SettingsView.tsx` — the settings page component providing project export, import, and delete functionality.

## Files Created

### `src/pages/SettingsView.tsx`

- New page component following the same layout pattern as `ImportGuestsView.tsx` (LeftSidebar + main content)
- Uses `useProjectImport` hook for file import flow (file picker, validation, confirmation)
- Uses `downloadProjectExport` and `deleteProject` utilities from `project-export.ts`
- Three action sections under "PROJECT DATA" heading:
  - **Export**: triggers JSON file download via `downloadProjectExport()`
  - **Import**: opens file picker, validates JSON, shows `ConfirmDialog` before applying
  - **Delete**: shows destructive `ConfirmDialog`, then clears localStorage and redirects to `/`
- Hidden `<input type="file">` for import file selection
- Two `ConfirmDialog` instances: one for import confirmation, one for delete confirmation
- Sidebar callbacks (`onAddGuest`, `onAddTable`) navigate to `/guests/new` and `/seating-plan` respectively

## Dependencies Used

- `react` (`useState`, `useCallback`)
- `react-router` (`useNavigate`)
- `react-icons/lu` (`LuDownload`, `LuUpload`, `LuTrash2`)
- Internal: `guest-store`, `table-store`, `LeftSidebar`, `ConfirmDialog`, `project-export`, `useProjectImport`

## Validation

- TypeScript compilation: **PASS** (`npx tsc --noEmit` — zero errors)
- No files modified outside task scope
