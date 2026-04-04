# Task Report: Fix Validation Issues in ProjectActionsSheet

## File Modified

- `src/components/organisms/ProjectActionsSheet.tsx`

## Issues Fixed

### MAJOR-1: Component unmounts before confirm/error dialogs render

**Problem**: `onClose()` was called inside `handleFileSelected`, which unmounts the entire component via `isProjectSheetOpen=false` in App.tsx. This destroyed `pendingImport` and `importError` state before dialogs could render, breaking the entire mobile import flow.

**Fix**: Added a local `drawerOpen` state (`useState(true)`) to control the Drawer's `open` prop independently from the component's mount lifecycle:

- `handleFileSelected`: sets `setDrawerOpen(false)` instead of calling `onClose()`, keeping the component mounted so dialogs can render
- `handleExport`: sets `setDrawerOpen(false)` then calls `onClose()`
- `handleCancelImport`: clears `pendingImport` and calls `onClose()` to unmount
- Error dialog dismiss: clears `importError` and calls `onClose()` to unmount
- `Drawer.Root onOpenChange`: if no dialogs are pending, calls `onClose()`; otherwise just closes the drawer visually

### MAJOR-2: Missing `reader.onerror` handler on FileReader

**Problem**: `handleFileSelected` had no `reader.onerror` handler. If the FileReader encountered an error, the user would see no feedback.

**Fix**: Added `reader.onerror` handler that sets the import error message and closes the drawer:

```typescript
reader.onerror = () => {
  setImportError(
    'INVALID_FILE // THE SELECTED FILE IS NOT A VALID PROJECT EXPORT',
  )
  setDrawerOpen(false)
}
```

### MAJOR-3: Arrow function expressions instead of function declarations

**Problem**: All 5 handlers used `const handleX = () => {}` arrow function expressions. Every other organism in the codebase uses function declarations for component-level handlers.

**Fix**: Converted all 5 handlers to function declarations:

- `const handleExport = () =>` -> `function handleExport()`
- `const handleImportClick = () =>` -> `function handleImportClick()`
- `const handleFileSelected = (e) =>` -> `function handleFileSelected(e)`
- `const handleConfirmImport = () =>` -> `function handleConfirmImport()`
- `const handleCancelImport = () =>` -> `function handleCancelImport()`

## Verification

- `npx tsc --noEmit` passes with no errors
