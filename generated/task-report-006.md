# Task Report — TASK-006: Update `EditGuestPage` — fix fallback redirect

## Status: COMPLETE

## Files Modified

- `src/pages/EditGuestPage.tsx` (line 25)

## Implementation Summary

Changed the fallback redirect for non-existent guest IDs from `navigate('/?tab=guests', { replace: true })` to `navigate('/', { replace: true })`.

This is a single-line change in the `useEffect` that handles the edge case where a user navigates to `/guests/<invalid-id>/edit` with an ID that doesn't match any guest. The redirect now sends the user to `/` instead of `/?tab=guests`.

## Acceptance Criteria

- When navigating to `/guests/<invalid-id>/edit`, the user is redirected to `/` (not `/?tab=guests`). **MET** — the `useEffect` now calls `navigate('/', { replace: true })`.
