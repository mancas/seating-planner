# Task Report: TASK-002 — Create FileDropZone molecule

## Status: COMPLETED

## Changes Made

### `src/components/molecules/FileDropZone.tsx` (CREATED)

1. **Props interface** — defined `onFileSelect`, `accept`, `selectedFileName`, `hasError`, `onReset` props
2. **Drag state management** — `isDragOver` boolean state with `handleDragOver`, `handleDragLeave`, `handleDrop` callbacks
3. **File input handling** — hidden `<input type="file">` triggered via ref, with `handleFileChange` that resets input value for re-selection
4. **Visual states** — conditional border/background classes for drag-over (primary), error (red), selected (surface), and default (border with hover)
5. **Default view** — `LuUpload` icon (size 24), "DROP CSV FILE HERE" text, "or click to select" caption, and `SELECT_FILE` button
6. **Selected view** — displays `selectedFileName` and optional `SELECT_NEW_FILE` button (when `onReset` provided)
7. **Event propagation** — buttons use `e.stopPropagation()` to prevent double-triggering the parent div's `onClick`

## Conventions Followed

- `interface Props` at top of file
- Named function declaration (`function FileDropZone`)
- `export default FileDropZone` at bottom
- `import type` for type-only imports (`DragEvent`, `ChangeEvent`)
- Icons from `react-icons/lu` with `size` prop
- No semicolons, single quotes, trailing commas, 2-space indent
- UPPERCASE text with underscore separators for user-facing strings
- `cursor-pointer` on interactive container
- `btn-secondary` class for buttons
- Dark mode color tokens (`border`, `primary`, `foreground-muted`, `foreground`, `surface`)

## Acceptance Criteria Verification

| Criterion                                                      | Status |
| -------------------------------------------------------------- | ------ |
| Renders dashed-border drop zone with upload icon and text      | PASS   |
| SELECT_FILE button present in default state                    | PASS   |
| Clicking zone or button opens native file picker via input ref | PASS   |
| Drag-over changes border to primary with subtle background     | PASS   |
| Dropping a file triggers `onFileSelect` callback               | PASS   |
| `selectedFileName` shows filename and SELECT_NEW_FILE button   | PASS   |
| `hasError` applies red-tinted border/background                | PASS   |
| `onReset` fires on SELECT_NEW_FILE click                       | PASS   |
| `tsc -b` compiles without errors                               | PASS   |
