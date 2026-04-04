# Task Report: TASK-002 — Add Export/Import Buttons to LeftSidebar

## Status: COMPLETED

## Changes Made

### `src/components/organisms/LeftSidebar.tsx` (MODIFIED)

1. **New imports added**:
   - `useState`, `useRef` from `react`
   - `LuDownload` added to existing `react-icons/lu` import
   - `ConfirmDialog` from `../molecules/ConfirmDialog`
   - `downloadProjectExport`, `validateProjectImport`, `applyProjectImport` from `../../utils/project-export`
   - `ProjectExport` type from `../../utils/project-export`

2. **State and ref added inside `LeftSidebar`**:
   - `fileInputRef` — ref for the hidden file input
   - `importError` — nullable string for inline error display
   - `pendingImport` — nullable `ProjectExport` for the confirm dialog flow

3. **Handler functions implemented**:
   - `handleExport()` — calls `downloadProjectExport()`
   - `handleImportClick()` — clears error and triggers file input click
   - `handleFileSelected(e)` — reads selected file, validates via `validateProjectImport()`, sets error or opens confirm dialog
   - `handleConfirmImport()` — calls `applyProjectImport()` then `window.location.reload()`
   - `handleCancelImport()` — clears `pendingImport` to close dialog

4. **JSX restructured**:
   - The view-specific buttons (canvas: ADD TABLE + unassigned list; guest list: ADD GUEST + IMPORT_CSV) remain in the ternary
   - After the ternary, a shared separator `<div className="border-t border-border my-3" />` is added
   - EXPORT_PROJECT button with `LuDownload` icon
   - IMPORT_PROJECT button with `LuUpload` icon
   - Conditional inline error `<p>` with `text-caption text-red-400 mt-1`

5. **ConfirmDialog added** after the bottom actions div, before the hidden file input:
   - `title="IMPORT_PROJECT"`, `targetName="PROJECT_DATA"`
   - Warning message about replacing all data
   - `confirmLabel="CONFIRM_IMPORT"`, `cancelLabel="CANCEL"`

6. **Hidden file input** added before closing `</aside>`:
   - `accept=".json"`, `className="hidden"`, wired to `fileInputRef` and `handleFileSelected`

## Conventions Followed

- No semicolons, single quotes, trailing commas, 2-space indent
- UPPERCASE text with underscore separators for user-facing labels
- `btn-secondary w-full flex items-center justify-center gap-2` button pattern
- `text-caption text-red-400 mt-1` for inline errors
- Named function declarations, `export default` at bottom

## Acceptance Criteria Verification

| Criterion                                                                                             | Status |
| ----------------------------------------------------------------------------------------------------- | ------ |
| Export button with `LuDownload` icon and "EXPORT_PROJECT" label visible below separator in both views | PASS   |
| Import button with `LuUpload` icon and "IMPORT_PROJECT" label visible below export button             | PASS   |
| Clicking export triggers `.json` file download (via `downloadProjectExport()`)                        | PASS   |
| Clicking import opens file picker filtered to `.json`                                                 | PASS   |
| Selecting a valid file shows ConfirmDialog with correct copy                                          | PASS   |
| Selecting an invalid file shows inline error message                                                  | PASS   |
| Confirming import calls `applyProjectImport()` and `window.location.reload()`                         | PASS   |
| Cancelling import closes dialog without changes                                                       | PASS   |
| TypeScript compiles cleanly (`tsc --noEmit` passes)                                                   | PASS   |
