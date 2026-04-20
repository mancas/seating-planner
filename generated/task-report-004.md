# Task Report — TASK-004: Update LeftSidebar Navigation (Expenses)

## Status: COMPLETE

## Files Modified

- `src/components/organisms/LeftSidebar.tsx`

## Changes Made

### 1. Added `isExpensesView` variable (line 50)

```ts
const isExpensesView = location.pathname === '/expenses'
```

### 2. Updated "Listado de invitados" `isActive` prop (lines 66-70)

Added `&& !isExpensesView` to the existing negation pattern so it is not active when on `/expenses`:

```tsx
isActive={!isCanvasView && location.pathname !== '/settings' && !isExpensesView}
```

### 3. Added "Expenses" `SidebarNavItem` (lines 78-82)

Inserted between "Canvas" and "Settings" nav items:

```tsx
<SidebarNavItem
  label="Expenses"
  isActive={isExpensesView}
  onClick={() => navigate('/expenses')}
/>
```

## Guardrails Audit (G-50)

All nav items' `isActive` conditions audited after adding the `/expenses` route:

| Nav Item             | `isActive` condition                                           | Correct? |
| -------------------- | -------------------------------------------------------------- | -------- |
| Listado de invitados | `!isCanvasView && pathname !== '/settings' && !isExpensesView` | Yes      |
| Canvas               | `isCanvasView` (`pathname === '/seating-plan'`)                | Yes      |
| Expenses             | `isExpensesView` (`pathname === '/expenses'`)                  | Yes      |
| Settings             | `pathname === '/settings'`                                     | Yes      |

No overlapping active states. Each route activates exactly one nav item.

## Verification

- `npx tsc --noEmit` passes with zero errors
- No files modified outside scope
- File grew from 129 to 139 lines

## Acceptance Criteria

- [x] "Expenses" nav item appears between "Canvas" and "Settings"
- [x] Clicking it navigates to `/expenses`
- [x] It is highlighted when on `/expenses`
- [x] "Listado de invitados" is NOT active when on `/expenses`
