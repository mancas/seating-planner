# Task Report: TASK-001 (Settings Screen) — Add `deleteProject()` to project-export.ts

## Status: COMPLETED

## Summary

Added the `deleteProject()` named export function to `src/utils/project-export.ts`. This function clears all project data from `localStorage` by removing the three keys used by the application.

## File Modified

- `src/utils/project-export.ts` (lines 85-89)

## Changes Made

Appended a new named export function after the existing `downloadProjectExport()` function:

```typescript
export function deleteProject(): void {
  localStorage.removeItem('seating-plan:guests')
  localStorage.removeItem('seating-plan:tables')
  localStorage.removeItem('seating-plan:table-counter')
}
```

The function removes the three `localStorage` keys that store project state:

- `seating-plan:guests` — guest list data
- `seating-plan:tables` — table layout data
- `seating-plan:table-counter` — table ID counter

## Conventions Followed

- [x] No semicolons
- [x] Single quotes
- [x] 2-space indentation
- [x] Named export (not default)
- [x] Consistent with existing functions in the file (`applyProjectImport`, `downloadProjectExport`)
