# Task Report — TASK-009: Update LeftSidebar with `onAddGuest` Callback

## Status: COMPLETE

## Summary

Modified `LeftSidebar` to accept an `onAddGuest` callback prop and wire it to the ADD GUEST button, replacing the previous no-op `onClick` handler.

## File Modified

- `src/components/organisms/LeftSidebar.tsx`

## Changes Made

1. Added `Props` interface with `onAddGuest: () => void`
2. Updated function signature to destructure `{ onAddGuest }` from `Props`
3. Replaced `onClick={() => {}}` with `onClick={onAddGuest}` on the ADD GUEST button

## Conventions Followed

- No semicolons
- Single quotes for imports
- 2-space indentation
- `Props` interface declared above function declaration
- Props destructured in function parameters
- Function declaration (not arrow)
- Default export

## Verification

- No LSP errors in modified file
- All existing styling, icon SVG, and button text preserved unchanged
- Only the specified changes were made — no other modifications
