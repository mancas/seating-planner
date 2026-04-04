# Task Report — TASK-003: Remove logistics from mock guests

## Status: DONE

## Summary

Removed all 6 `logistics: { ... }` blocks from the mock guest data in `src/data/mock-guests.ts`.

## Changes Made

| File                      | Action   | Details                                               |
| ------------------------- | -------- | ----------------------------------------------------- |
| `src/data/mock-guests.ts` | Modified | Removed `logistics` property from all 6 guest objects |

## Details

Each guest object had a `logistics` block containing `shuttleRequired`, `shuttleFrom`, `lodgingBooked`, and `lodgingVenue` fields. All 6 blocks were removed:

1. Guest `4492-AX` (ELARA RIVERA) — lines 18-23 removed
2. Guest `3371-BK` (ALEXANDER VANCE) — lines 38-43 removed
3. Guest `5580-CR` (MARCUS CHEN) — lines 58-63 removed
4. Guest `1039-CK` (MARCUS STERLING) — lines 78-83 removed
5. Guest `3311-DS` (SARA MORGAN) — lines 98-103 removed
6. Guest `8821-BL` (JULIAN KANE) — lines 118-123 removed

File reduced from 125 lines to 89 lines. Comma placement verified correct on all remaining properties.

## Verification

- TypeScript compilation: PASS (`npx tsc --noEmit` — no errors)
- The `Guest` type did not include a `logistics` property, confirming these blocks were already inconsistent with the type definition
