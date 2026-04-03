# Task Report: TASK-001

## Task

Add `/seating-plan` route in `main.tsx`

## Status: COMPLETE

## Changes Made

### 1. Added route entry in `src/main.tsx` (line 15)

- Added `<Route path="seating-plan" element={null} />` as a child of the `<Route element={<App />}>` layout route
- Placed immediately after `<Route index element={null} />` (line 14)
- Uses `element={null}` following the existing convention — `App.tsx` handles content rendering based on the current path
- No new imports required; `Route` was already imported from `react-router`

## Verification

- The route tree now contains: index (`/`), `seating-plan`, `guests/new`, `guests/:id/edit`
- Navigating to `/seating-plan` will match this route and render the `App` layout without a route-not-found error
- All acceptance criteria met
