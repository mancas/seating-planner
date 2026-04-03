# Fix MAJOR-3: Remove duplicate search filtering (DRY violation)

## Problem

Search filtering was applied twice:

1. `App.tsx` (lines 101-104) filtered `guests` into `filteredGuests` by `searchQuery`
2. `GuestTable.tsx` (lines 25-31) applied the same filter again on the already-filtered `guests` prop

This is a DRY violation and causes unnecessary computation.

## Fix Applied

### `src/components/organisms/GuestTable.tsx`

- **Removed** the internal filtering logic (`query`/`filtered` variables, lines 25-31)
- **Changed** all references from `filtered` to `guests` (the prop is already pre-filtered by `App.tsx`)
- **Added** `hasActiveSearch` derived from `searchQuery` to guard the "NO_RESULTS // QUERY_MISMATCH" empty state — it now only displays when there is an active search query and the filtered list is empty
- The `searchQuery` prop is retained in the interface for this empty-state differentiation

### `src/App.tsx`

- No changes needed. It already correctly computes `filteredGuests` and passes it as the `guests` prop to `GuestTable`.

## Verification

- `npx tsc --noEmit` passes with no errors
- "NO_RESULTS // QUERY_MISMATCH" still renders when a search returns zero matches (both desktop and mobile layouts)
- `EmptyState` in `App.tsx` still handles the "no guests at all" case (when `guests.length === 0`)
