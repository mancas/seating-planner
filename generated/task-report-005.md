# Task Report: TASK-005

## Task: Add "EXPENSES" tab to BottomTabBar

## Status: COMPLETED

## Changes Made

### File: `src/components/organisms/BottomTabBar.tsx` (modified)

**1. Added `LuReceipt` icon import (line 1):**

- Before: `import { LuSquarePen, LuUser, LuSettings } from 'react-icons/lu'`
- After: `import { LuSquarePen, LuUser, LuSettings, LuReceipt } from 'react-icons/lu'`

**2. Added `isExpensesView` route detection (line 10):**

```ts
const isExpensesView = location.pathname === '/expenses'
```

**3. Updated GUESTS tab `isActive` logic (line 24):**

- Before: `isActive={!isCanvasView && !isSettingsView}`
- After: `isActive={!isCanvasView && !isSettingsView && !isExpensesView}`

This ensures GUESTS is no longer active when the expenses route is displayed.

**4. Added EXPENSES `TabBarItem` as the fourth tab (lines 33–38):**

```tsx
<TabBarItem
  icon={<LuReceipt size={16} />}
  label="EXPENSES"
  isActive={isExpensesView}
  onClick={() => navigate('/expenses')}
/>
```

## Guardrail Checks

- **G-50 (audit ALL tab items' isActive):** Verified all four tabs have correct mutual exclusion:
  - CANVAS: `isCanvasView` (pathname === '/seating-plan')
  - GUESTS: `!isCanvasView && !isSettingsView && !isExpensesView` (catch-all for remaining routes)
  - SETTINGS: `isSettingsView` (pathname === '/settings')
  - EXPENSES: `isExpensesView` (pathname === '/expenses')
- **G-21 (verify icon export name):** `LuReceipt` confirmed to exist in `react-icons/lu` — TypeScript compilation passes.

## Acceptance Criteria Verification

- [x] "EXPENSES" tab appears as the fourth tab in the bottom tab bar
- [x] Uses `LuReceipt` icon at size 16
- [x] Navigates to `/expenses` on click
- [x] `isActive` is true only when on `/expenses` route
- [x] GUESTS tab is NOT active when on `/expenses` route
- [x] Four tabs distribute evenly via existing `justify-around` on the parent flex container

## Build Verification

- [x] `npx tsc --noEmit` — passes with zero errors
- [x] Only 1 file modified (`src/components/organisms/BottomTabBar.tsx`)
- [x] No files outside task scope were touched
