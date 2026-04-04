# Codebase Context Updates — Export & Import Project

Updates to project structure and patterns based on the export-import-project spec implementation (validation iteration 1).

---

## New Files

### Utility Module

| File                                     | Purpose                                                                                                                                                                                       |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/utils/project-export.ts` (83 lines) | Pure TypeScript module for project export/import. Exports: `generateProjectExport()`, `validateProjectImport()`, `applyProjectImport()`, `downloadProjectExport()`, interface `ProjectExport` |

Follows the same pure utility pattern as `csv-import.ts` — no React dependencies, named exports, `import type` for type-only imports.

### Components

| File                                                           | Level    | Purpose                                                                                                             |
| -------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `src/components/organisms/ProjectActionsSheet.tsx` (143 lines) | Organism | Mobile vaul Drawer bottom sheet with export/import buttons. Follows MobilePropertiesSheet/MobileGuestsSheet pattern |

## Modified Files

| File                                       | Change                                                                                                                       |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `src/components/organisms/LeftSidebar.tsx` | Added export/import buttons, hidden file input, ConfirmDialog, inline error display. Self-contained import/export logic      |
| `src/components/organisms/TopNav.tsx`      | Added optional `onOpenProjectMenu` prop, renders mobile-only overflow menu icon (`LuEllipsisVertical`) via `md:hidden`       |
| `src/App.tsx`                              | Added `isProjectSheetOpen` state, `useIsMobile()` hook, passes callback to TopNav, conditionally renders ProjectActionsSheet |

## Architecture Notes

### Desktop vs Mobile Entry Points — Shared Utility

The export/import business logic lives entirely in `project-export.ts`. Both the desktop entry point (LeftSidebar) and mobile entry point (ProjectActionsSheet) call the same utility functions. No logic duplication.

### App.tsx State Addition

`App.tsx` now has 2 lines of UI state (`isProjectSheetOpen`, `isMobile`) and 1 conditional render. This is acceptable per G-40 (thin layout shell) since it's purely UI coordination state, not business logic. The App grew from 17 lines to 26 lines.

### File Input Pattern

Both LeftSidebar and ProjectActionsSheet use a hidden `<input type="file" accept=".json">` triggered programmatically. The input in ProjectActionsSheet is placed outside the `Drawer.Portal` to ensure it persists when the drawer closes.

## Component Counts Update

- **Atoms**: 11 (unchanged)
- **Molecules**: 11 (unchanged)
- **Organisms**: 17 (+1: ProjectActionsSheet)
- **Pages**: 5 (unchanged)
- **Utility modules**: 2 in `src/utils/` (csv-import.ts, project-export.ts)

## New Guardrails

- **G-44**: Do not unmount components that own pending dialog state — parent must keep component mounted until dialogs complete
- **G-45**: Use function declarations (not arrow expressions) for component handlers — consistency across all organisms
- **G-46**: Always set `reader.onerror` alongside `reader.onload` when using FileReader (extends G-42)

## Validation Status

**CHANGES_REQUESTED** — 3 MAJOR findings pending resolution:

1. MAJOR-1: ProjectActionsSheet unmounts before confirm/error dialogs render (mobile import broken)
2. MAJOR-2: Missing `reader.onerror` handler in ProjectActionsSheet (G-42/G-46 violation)
3. MAJOR-3: Arrow function handlers instead of function declarations (convention violation)
