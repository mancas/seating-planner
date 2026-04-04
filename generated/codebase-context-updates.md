# Codebase Context Updates — Import Guests

Updates to project structure and patterns based on the import-guests spec implementation (validation iteration 1).

---

## Route Architecture Update

```
<Route element={<App />}>                    ← layout: TopNav + Outlet + BottomTabBar
  <Route path="guests/import" ... />         ← ImportGuestsView (NEW — standalone, sibling of GuestListView)
  <Route element={<GuestListView />}>        ← layout: LeftSidebar + main + detail panel
    <Route index element={null} />           ← guest list (rendered by GuestListView)
    <Route path="guests/new" ... />          ← AddGuestPage (via Outlet context)
    <Route path="guests/:id/edit" ... />     ← EditGuestPage (via Outlet context)
  </Route>
  <Route path="seating-plan" ... />          ← SeatingPlanView (standalone)
</Route>
```

The `guests/import` route is placed **before** the `GuestListView` layout route so the static segment matches before the layout route's children. `ImportGuestsView` is a sibling of `GuestListView`, not a child, because it does not use `GuestListView`'s `OutletContext`.

## New Files

### Utility Module

| File                                  | Purpose                                                                                                                                                                                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/utils/csv-import.ts` (240 lines) | Pure TypeScript CSV template generation, parsing, and validation. Zero React dependencies. Exports: `generateTemplate()`, `parseCSV()`, `validateGuestRows()`, interfaces `ParsedRow`, `ImportError`, `GuestImportData`, `ValidationResult` |

**Note**: This is the first file in the new `src/utils/` directory, establishing it as the home for non-data utility modules (vs `src/data/` for data-layer utilities).

### Components

| File                                                        | Level    | Purpose                                                                                                                              |
| ----------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `src/components/molecules/FileDropZone.tsx` (119 lines)     | Molecule | Generic drag-and-drop + click-to-select file upload area. Props: `onFileSelect`, `accept`, `selectedFileName`, `hasError`, `onReset` |
| `src/components/organisms/ImportGuestsPage.tsx` (259 lines) | Organism | Full import workflow: template download, file upload via FileDropZone, CSV parsing/validation, guest creation, error/success display |
| `src/pages/ImportGuestsView.tsx` (42 lines)                 | Page     | Route-level wrapper rendering LeftSidebar + ImportGuestsPage. Owns guest state for sidebar data refresh after import                 |

## Modified Files

| File           | Change                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| `src/main.tsx` | Added import for `ImportGuestsView` and `<Route path="guests/import">` as first child of `<App />` route |

## New Patterns Established

### Discriminated Union State Machine

`ImportGuestsPage` uses a discriminated union type (`ImportState`) with phases `idle`, `error`, and `success` to model the import workflow. Each phase carries its own data shape. This pattern is recommended for components with distinct UI phases.

### Pure Utility Module Pattern

`csv-import.ts` in `src/utils/` demonstrates the pure utility module pattern: exported functions with no React imports, no side effects, type-safe interfaces. This is the recommended pattern for business logic that should be independently testable.

### Blob Download Pattern

The template download uses: generate string → `new Blob([csv], { type: 'text/csv' })` → `URL.createObjectURL()` → programmatic `<a>` click with `download` attribute → cleanup with `URL.revokeObjectURL()`. This is the standard client-side file download approach.

## Component Counts Update

- **Atoms**: 12 (unchanged)
- **Molecules**: 11 (+1: FileDropZone)
- **Organisms**: 16 (+1: ImportGuestsPage)
- **Pages**: 5 (+1: ImportGuestsView)
- **Utility modules**: 1 in `src/utils/` (csv-import.ts), 5 in `src/data/`

## New Guardrails

- **G-42**: Always handle promise rejections from File API reads (`.catch()` on `file.text()`)
- **G-43**: Interactive `<div>` elements need full keyboard support checklist: `tabIndex`, `role`, `onKeyDown`, `focus-visible` outline

## Validation Status

**CHANGES_REQUESTED** — 2 MAJOR findings pending resolution:

1. M-1: Missing `.catch()` on `file.text().then()` (`ImportGuestsPage.tsx:73`)
2. M-2: Missing keyboard accessibility on FileDropZone container (`FileDropZone.tsx:56-69`)
