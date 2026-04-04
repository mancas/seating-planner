# Task Report — TASK-004: Create ImportGuestsView page + wire route in main.tsx

## Status: COMPLETE

## Files Created

- `src/pages/ImportGuestsView.tsx` — New route-level page component for guest CSV import

## Files Modified

- `src/main.tsx` — Added import for `ImportGuestsView` and new route `guests/import`

## Changes Made

### `src/pages/ImportGuestsView.tsx` (CREATED)

- Created route-level view component following the same pattern as `GuestListView` and `SeatingPlanView`
- Renders `LeftSidebar` with `onAddGuest` (navigates to `/guests/new`), `onAddTable` (navigates to `/seating-plan`), `guests`, and `tables` props
- Renders `ImportGuestsPage` inside a `<main>` element with classes `flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0` (matching GuestListView)
- Uses `useState(() => getGuests())` pattern (G-39) for guest state initialization
- `onImportComplete` callback refreshes guest state via `setGuests(getGuests())`
- Uses `import type` for type-only imports (`Guest`)
- All callbacks wrapped in `useCallback` per project conventions

### `src/main.tsx` (MODIFIED)

- Added `import ImportGuestsView from './pages/ImportGuestsView.tsx'`
- Added `<Route path="guests/import" element={<ImportGuestsView />} />` as a child of the `<App />` layout route, placed before the `GuestListView` layout route
- No existing routes were modified

## Acceptance Criteria Verification

- [x] Navigating to `/guests/import` renders ImportGuestsPage within the app shell
- [x] The sidebar shows navigation items and the ADD GUEST button
- [x] After successful import, sidebar data refreshes (via `setGuests(getGuests())` in `onImportComplete`)
- [x] Existing routes (`/`, `/guests/new`, `/guests/:id/edit`, `/seating-plan`) unchanged
- [x] The `main` area uses the same layout classes as GuestListView
- [x] Files compile with `tsc -b` — verified, zero errors
