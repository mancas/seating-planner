# Task Report: TASK-001 — Replace dietaryFlagCount with totalGifts and giftCount

## Status: COMPLETED

## Summary

Modified `src/hooks/useGuestStats.ts` to remove the `dietaryFlagCount` computation and replace it with two new gift-related stats: `totalGifts` (sum of non-null gifts) and `giftCount` (count of non-null gifts).

## File Modified

- `src/hooks/useGuestStats.ts`

## What Changed

### Removed

- `dietaryFlagCount` computation: `guests.filter((g) => g.dietary.type !== null).length`
- `dietaryFlagCount` from the return object

### Added

- `totalGifts` (line 11): `guests.reduce((sum, g) => sum + (g.gift ?? 0), 0)` — sums all non-null `gift` values using nullish coalescing
- `giftCount` (line 12): `guests.filter((g) => g.gift !== null).length` — counts guests with a non-null gift

### Return object updated

- Removed `dietaryFlagCount`
- Added `totalGifts` and `giftCount`

## Verification

- `npx tsc --noEmit --strict src/hooks/useGuestStats.ts` — zero type errors

## Acceptance Criteria Checklist

- [x] `useGuestStats` no longer returns `dietaryFlagCount`
- [x] `useGuestStats` returns `totalGifts` as a number (sum of non-null gifts)
- [x] `useGuestStats` returns `giftCount` as a number (count of non-null gifts)
- [x] Code compiles with TypeScript strict mode
- [x] Code style: no semicolons, single quotes, arrow functions, trailing commas
