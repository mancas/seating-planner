# Task Report: TASK-005

## Task: Update `BottomTabBar` — route-based navigation

## Status: COMPLETED

## Changes Made

### File: `src/components/organisms/BottomTabBar.tsx` (modified)

Replaced prop-based tab switching with internal route-based navigation using React Router hooks.

**Removed:**

- `Props` interface (`activeTab: string`, `onTabChange: (tab: string) => void`)
- Props from function signature

**Added:**

- Import `useLocation` and `useNavigate` from `react-router`
- Derived `isCanvasView` from `location.pathname === '/seating-plan'`

**Updated TabBarItems:**

- CANVAS: `isActive={isCanvasView}`, `onClick={() => navigate('/seating-plan')}`
- GUESTS: `isActive={!isCanvasView}`, `onClick={() => navigate('/')}`
- TOOLS: `isActive={false}`, `onClick={() => {}}` (non-functional placeholder)
- MORE: `isActive={false}`, `onClick={() => {}}` (non-functional placeholder)

## Verification

- [x] `npx tsc --noEmit` — passes with zero errors
- [x] No `activeTab` or `onTabChange` props remain
- [x] CANVAS tab navigates to `/seating-plan` and is active on that route
- [x] GUESTS tab navigates to `/` and is active on all non-canvas routes
- [x] TOOLS and MORE are always inactive with no-op click handlers
- [x] Component is now self-contained with no external props
