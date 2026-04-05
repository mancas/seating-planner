# Task Report: TASK-003 — Add /settings route to main.tsx

## Status: COMPLETE

## Summary

Added the `/settings` route to `src/main.tsx`, wiring up the existing `SettingsView` component.

## Changes Made

### `src/main.tsx`

1. **Added import** for `SettingsView` after the `ImportGuestsView` import (line 11):

   ```typescript
   import SettingsView from './pages/SettingsView.tsx'
   ```

2. **Added `<Route>`** inside the `<Route element={<App />}>` block, after the `seating-plan` route (line 31):
   ```tsx
   <Route path="settings" element={<SettingsView />} />
   ```

## Verification

- `npx tsc --noEmit` passes with zero errors.
