# Task Report — TASK-007: Register Expenses Route in Main Router

## Status: COMPLETE

## Files Modified

- `src/main.tsx`

## Changes

### `src/main.tsx`

1. **Added import** (line 11): `import ExpensesView from './pages/ExpensesView.tsx'`
2. **Added route** (line 32): `<Route path="expenses" element={<ExpensesView />} />` — placed after the `seating-plan` route and before the `settings` route, nested inside `<Route element={<App />}>`

## Acceptance Criteria

- Navigating to `/expenses` will render the `ExpensesView` component
- The route is nested under the `App` layout route, so `TopNav` and `BottomTabBar` are rendered around it
- Route ordering: guests > seating-plan > **expenses** > settings

## Notes

- Minimal change: 1 import line + 1 Route element added
- Follows existing conventions: `.tsx` extension in import, direct child of App layout route
