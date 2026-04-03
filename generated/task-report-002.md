# Task Report: TASK-002 — Create Guest Store

## Task

Create the localStorage-backed data layer (`src/data/guest-store.ts`) that replaces direct consumption of `mock-guests.ts`. Exports CRUD functions and stat helpers.

## Status: COMPLETED

## Changes Made

### Files Created

1. **`src/data/guest-store.ts`** (new) — localStorage-backed guest data store with:
   - Type re-exports: `Guest`, `GuestStatus` (using `import type`)
   - Storage key: `seating-plan:guests`
   - Internal helpers: `readFromStorage()` and `writeToStorage()` with in-memory fallback
   - CRUD operations: `getGuests`, `getGuestById`, `addGuest`, `updateGuest`, `deleteGuest`
   - Stat helpers: `getConfirmedCount`, `getPendingCount`, `getConfirmationRate`, `getDietaryFlagCount`, `getTotalGuests`, `getWaitlistCount`, `getGuestsByTable`

### Implementation Details

- **UUID generation**: Uses `v4` from `uuid` package for new guest IDs
- **Deep merge**: `updateGuest` performs nested spread for `dietary` and `logistics` objects to avoid overwriting unspecified nested fields
- **Division-by-zero guard**: `getConfirmationRate` returns `0` when there are no guests
- **In-memory fallback**: When `localStorage` is unavailable (SSR, quota exceeded), falls back to an in-memory `Guest[]` array
- **All named exports**: No default export; all functions and types are named exports

## Conventions Verified

| Convention                          | Status |
| ----------------------------------- | ------ |
| No semicolons                       | PASS   |
| Single quotes                       | PASS   |
| Trailing commas                     | PASS   |
| 2-space indent                      | PASS   |
| `import type` for type-only imports | PASS   |
| Named exports only (no default)     | PASS   |
| Explicit return types               | PASS   |

## Validation

| Check              | Result                                                                 |
| ------------------ | ---------------------------------------------------------------------- |
| `npx tsc --noEmit` | PASS — zero errors                                                     |
| Scope isolation    | PASS — only `src/data/guest-store.ts` created; no other files modified |
