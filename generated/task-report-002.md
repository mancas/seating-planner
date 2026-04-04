# Task Report: TASK-002 — Remove logistics from Guest type and store

## Status: COMPLETED

## Changes Made

### `src/data/guest-types.ts` (MODIFIED)

- Removed the `logistics` property from the `Guest` interface (lines 16–21 in original)
- The removed property was a nested object with fields: `shuttleRequired`, `shuttleFrom`, `lodgingBooked`, `lodgingVenue`
- No other properties or types were modified

### `src/data/guest-store.ts` (MODIFIED)

- Removed the `logistics` deep merge line from the `updateGuest()` function (line 37 in original):
  `logistics: { ...existing.logistics, ...data.logistics },`
- No other logic was modified

## Verification

- Both files contain only removals — no new code was added
- The `Guest` interface now has 10 properties: `id`, `firstName`, `lastName`, `status`, `accessLevel`, `tableAssignment`, `seatNumber`, `dietary`, `gift`
- The `updateGuest()` function still correctly deep-merges `dietary` but no longer references `logistics`
