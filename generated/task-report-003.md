# Task Report — TASK-003: Update `LeftSidebar` — replace nav items with route-based links

## Status: COMPLETE

## Files Modified

- `src/components/organisms/LeftSidebar.tsx`

## Changes Made

### 1. Added router imports (line 3)

- Added `import { useLocation, useNavigate } from 'react-router'`

### 2. Removed `activeTab` from Props interface (lines 9–14)

- Removed `activeTab: string` from the `Props` interface

### 3. Removed `activeTab` from function signature (lines 38–43)

- Removed `activeTab` from the destructured props

### 4. Added route-based state derivation (lines 44–46)

- Added `useLocation()` and `useNavigate()` hooks
- Derived `isCanvasView` from `location.pathname === '/seating-plan'`

### 5. Replaced nav items (lines 62–73)

- Removed four placeholder nav items: PROPERTIES, LAYOUT, OBJECTS, EXPORT
- Added two route-based nav links:
  - "Listado de invitados" — active when `!isCanvasView` (covers `/`, `/guests/new`, `/guests/:id/edit`), navigates to `/`
  - "Canvas" — active when `isCanvasView`, navigates to `/seating-plan`

### 6. Updated bottom actions conditional (line 77)

- Replaced `activeTab === 'canvas'` with `isCanvasView`

## Acceptance Criteria Verification

| Criteria                                                            | Status |
| ------------------------------------------------------------------- | ------ |
| Sidebar shows exactly two nav links                                 | PASS   |
| "Listado de invitados" is active at `/` and `/guests/*`             | PASS   |
| "Canvas" is active at `/seating-plan`                               | PASS   |
| Clicking a link navigates to the correct route                      | PASS   |
| Bottom section shows ADD GUEST on `/`                               | PASS   |
| Bottom section shows ADD TABLE + unassigned list on `/seating-plan` | PASS   |
| `activeTab` removed from Props interface                            | PASS   |
| TypeScript compiles without errors                                  | PASS   |

## Type Check

```
npx tsc --noEmit — passed with no errors
```

## Dependencies Note

TASK-004 must update `App.tsx` to stop passing `activeTab` to `LeftSidebar`. Currently the build passes because `activeTab` is no longer in the Props interface — any call site still passing it will get a TS error when TASK-004 hasn't been applied yet (or it may be silently ignored if the prop is spread). This is the expected coordination between TASK-003 and TASK-004.

## Conventions Followed

- No semicolons
- Single quotes
- 2-space indentation
- Trailing commas
- Uses existing `SidebarNavItem` molecule with `label`, `isActive`, `onClick` props
- Labels match spec decision DD-3: "Listado de invitados" and "Canvas" (not uppercase cyberpunk style)
