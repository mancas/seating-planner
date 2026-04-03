# Task Report — Fix MAJOR-2

## Issue

`src/App.tsx` lines 40-46: `setSelectedGuestId` called synchronously inside `useEffect` produced ESLint error `react-hooks/set-state-in-effect`, blocking the pre-commit hook.

## Fix Applied

Replaced the `useEffect` with a synchronous state adjustment during render, following the React-documented pattern for "adjusting state when a prop changes":

- Removed the `useEffect` that read `location.state?.selectedGuestId` and called `setSelectedGuestId`
- Added inline conditional logic during render that checks `location.state` and calls `setSelectedGuestId` only when the value differs (preventing infinite re-renders)
- Removed `useEffect` from the React import since it was no longer used anywhere in the file

## Verification

- `npm run lint` passes with no errors in `src/App.tsx`
- No other files were modified
