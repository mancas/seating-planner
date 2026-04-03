# Task Report — TASK-010: Update GuestDetailPanel with `onUpdate` and `onDelete` Callbacks

## Status: DONE

## File Modified

- `src/components/organisms/GuestDetailPanel.tsx`

## Implementation Details

### New Imports

- `useState` from `react`
- `ConfirmDialog` from `../molecules/ConfirmDialog`

### Updated Props Interface

```typescript
interface Props {
  guest: Guest
  onClose: () => void
  onUpdate: () => void
  onDelete: () => void
}
```

### Component State

- `showDeleteDialog` — boolean state controlling visibility of the delete confirmation dialog

### Button Changes (both mobile and desktop)

Three buttons now rendered in each action bar:

| Button  | Style           | Behavior                                              |
| ------- | --------------- | ----------------------------------------------------- |
| CONTACT | `btn-secondary` | Non-functional (unchanged, out of scope)              |
| DELETE  | `bg-red-600`    | Opens `ConfirmDialog` via `setShowDeleteDialog(true)` |
| UPDATE  | `btn-primary`   | Calls `onUpdate` prop                                 |

- DELETE button uses `type="button"` and full Tailwind classes: `bg-red-600 hover:bg-red-700 text-white flex-1 px-5 py-2.5 rounded font-semibold text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2`
- Button order: CONTACT, DELETE, UPDATE

### ConfirmDialog Integration

Rendered conditionally at the end of the component JSX (inside the fragment, after `</aside>`):

- `title="CONFIRM_DELETION"`
- `targetName` composed from `guest.firstName` and `guest.lastName`
- `message` warns about irreversible deletion
- `onConfirm` wired to `onDelete` prop
- `onCancel` hides the dialog via `setShowDeleteDialog(false)`

### Conventions Followed

- No semicolons
- Single quotes
- 2-space indentation
- `function` declaration (not arrow)
- `export default` at bottom

## Verification

- TypeScript compilation passes with zero errors (`npx tsc --noEmit`)
- Both mobile and desktop button sections updated identically
- ConfirmDialog import resolves (TASK-004 dependency already complete)
