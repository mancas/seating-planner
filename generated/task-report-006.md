# Task Report — TASK-006: Remove logistics from ImportGuestsPage

## Status: COMPLETE

## Files Modified

- `src/components/organisms/ImportGuestsPage.tsx` (lines 98-103 removed)

## Implementation Summary

Removed the `logistics` default block from the guest object construction in `ImportGuestsPage.tsx`. The block that was removed:

```ts
logistics: {
  shuttleRequired: false,
  shuttleFrom: null,
  lodgingBooked: false,
  lodgingVenue: null,
},
```

This was the only change — pure deletion, no new code added. The remaining object properties (`gift` and `dietary` as the last fields) retain correct comma placement. TypeScript compilation passes with no errors.

## Acceptance Criteria

- `logistics` block removed from guest construction in ImportGuestsPage — **MET**
- No new code added — **MET**
- Only 1 file modified — **MET**
- Build passes (`tsc --noEmit` clean) — **MET**
