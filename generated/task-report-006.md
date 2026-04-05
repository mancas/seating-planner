# Task Report — TASK-006: Revert TopNav to stateless no-props component

## Status: COMPLETE

## Files Modified

- `src/components/organisms/TopNav.tsx`

## Changes

### `src/components/organisms/TopNav.tsx`

- Removed `import { LuEllipsisVertical } from 'react-icons/lu'`
- Removed `import IconButton from '../atoms/IconButton'`
- Removed `Props` interface (`onOpenProjectMenu` prop)
- Converted from `function TopNav({ onOpenProjectMenu }: Props)` to `function TopNav()`
- Removed the ellipsis menu icon button from the right section
- Right section is now an empty `div` (no children)
- File reduced from 33 lines to 19 lines

## Rationale

The project menu button and `ProjectActionsSheet` are being removed as part of the settings-screen migration. TopNav no longer needs to communicate with App.tsx to open a project actions sheet, so it reverts to a simple stateless component with no props.

## Validation

- `npx tsc --noEmit` — zero errors
- Component renders nav bar with PLANNER_V1.0 label and no action buttons
