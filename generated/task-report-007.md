# Task Report — TASK-007: Organism — GuestTable

## Status: COMPLETE

## File Created

- `src/components/organisms/GuestTable.tsx`

## Implementation Details

### Props Interface

- `guests: Guest[]` — full guest list passed in
- `selectedGuestId: string | null` — currently selected guest for highlight
- `onGuestClick: (guestId: string) => void` — click handler
- `searchQuery: string` — filters guests by case-insensitive substring on full name

### Search / Filtering

- Trims and lowercases the query, then filters `firstName + ' ' + lastName` with `.includes()`
- Empty query shows all guests

### Desktop View (`hidden md:block`)

- Column header row using `grid-cols-[1fr_120px_100px_60px]` with labels: NAME / IDENTIFIER, STATUS, TABLE, ACTIONS
- Maps filtered guests to `GuestRow` with `isSelected` and `onClick` props
- Empty state: centered `NO_RESULTS // QUERY_MISMATCH` message

### Mobile View (`md:hidden`)

- Groups filtered guests by `tableAssignment` (null → 'UNASSIGNED')
- Sorts keys: named tables alphabetically first, UNASSIGNED last
- Each group renders `TableGroupHeader` with:
  - `location` derived via `getLocationLabel()` helper (TABLE_01 → LOCATION_A, etc.)
  - `tableName` formatted (TABLE_04 → "TABLE 04", UNASSIGNED → "NO TABLE")
  - `seatCount` = group size, `totalSeats` = 8 (hardcoded)
- Then renders `GuestRow` for each guest in the group
- Empty state: same message with `md:hidden`

### Helper Function

- `getLocationLabel(table: string): string` — extracts numeric portion from table name, converts to letter via `String.fromCharCode(64 + num)`, returns `LOCATION_{letter}`. Returns `'UNASSIGNED'` for unassigned.

### Wrapper

- `<div className="flex-1 overflow-y-auto">` as the outer container

## Conventions Followed

- No semicolons, single quotes, 2-space indent
- Function declaration with default export
- `import type { Guest }` from data module
- No barrel file imports

## Verification

- `npx tsc --noEmit` passes with zero errors
