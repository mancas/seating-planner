# Task Report — TASK-004: Create ProjectActionsSheet Component

## Status: COMPLETE

## Files Created

- `src/components/organisms/ProjectActionsSheet.tsx` — New vaul Drawer bottom sheet for project export/import actions

## Changes Made

### `src/components/organisms/ProjectActionsSheet.tsx` (CREATED)

- Created mobile bottom sheet component following the exact vaul Drawer pattern from `MobilePropertiesSheet` and `MobileGuestsSheet`
- Uses same overlay (`z-40 bg-black/40`), content (`z-50 bg-surface rounded-t-2xl border-t border-border`), drag handle, and header with close button pattern
- **State**: `importError` (string | null), `pendingImport` (ProjectExport | null)
- **Ref**: `fileInputRef` for hidden file input element
- **Handlers**:
  - `handleExport`: calls `downloadProjectExport()` then `onClose()`
  - `handleImportClick`: triggers `fileInputRef.current?.click()` without closing the sheet first
  - `handleFileSelected`: reads file via FileReader, validates with `validateProjectImport()`, sets `pendingImport` on success or `importError` on failure, then closes sheet
  - `handleConfirmImport`: calls `applyProjectImport(pendingImport)` then `window.location.reload()`
  - `handleCancelImport`: clears `pendingImport` state
- Renders two action buttons: "EXPORT_PROJECT" with `LuDownload` icon and "IMPORT_PROJECT" with `LuUpload` icon
- Hidden file input placed outside `Drawer.Root` (outside the portal) so it persists when sheet closes
- `ConfirmDialog` for import confirmation rendered when `pendingImport` is set
- `ConfirmDialog` for error display rendered when `importError` is set
- File input resets via `e.target.value = ''` so the same file can be re-selected
- No semicolons, single quotes, 2-space indent per Prettier config
- Default export per component convention

## Acceptance Criteria Verification

- [x] Sheet opens with drag handle, "PROJECT" header, close button
- [x] "EXPORT_PROJECT" button triggers download and closes sheet
- [x] "IMPORT_PROJECT" button opens file picker (without closing sheet first)
- [x] Valid file shows ConfirmDialog; confirming writes to localStorage and reloads
- [x] Invalid file shows error ConfirmDialog with "CLOSE" button
- [x] Cancel/close dismisses without changes
- [x] TypeScript compiles with zero errors in this file (`tsc --noEmit` verified)
