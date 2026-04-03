# Task Report — TASK-006: Create GuestForm Organism

## Status: COMPLETE

## File Created

- `src/components/organisms/GuestForm.tsx`

## Implementation Summary

Created the `GuestForm` organism component — a full add/edit guest form with react-hook-form integration, five form sections, conditional fields, and action buttons.

### Props

| Prop       | Type                                | Description                        |
| ---------- | ----------------------------------- | ---------------------------------- |
| `guest`    | `Guest \| undefined`                | Guest to edit (undefined for add)  |
| `onSubmit` | `(data: Omit<Guest, 'id'>) => void` | Called with transformed guest data |
| `onDelete` | `(id: string) => void \| undefined` | Called to delete guest (edit only) |
| `onCancel` | `() => void`                        | Called when cancel button clicked  |

### Form Structure

- **Mode detection**: `isEdit = !!guest` determines add vs edit mode
- **react-hook-form**: `useForm<GuestFormValues>` with `register`, `handleSubmit`, `watch`, `setValue`, `formState: { errors }`
- **Default values**: Flattened from `Guest` type for edit mode, empty strings/false/PENDING for add mode

### Form Sections

1. **IDENTITY_MATRIX** — firstName (required), lastName (required), role
2. **STATUS_CLASSIFICATION** — status (select, required), accessLevel
3. **SEATING_ALLOCATION** — tableAssignment, seatNumber (number input)
4. **DIETARY_PROTOCOL** — dietaryType, dietaryNotes (textarea)
5. **LOGISTICS_CONFIG** — shuttleRequired (Toggle), shuttleFrom (conditional), lodgingBooked (Toggle), lodgingVenue (conditional)

### Conditional Fields

- `shuttleFrom` input shown only when `shuttleRequired` is true (via `watch`)
- `lodgingVenue` input shown only when `lodgingBooked` is true (via `watch`)

### Submit Handler

Transforms flat `GuestFormValues` into nested `Omit<Guest, 'id'>` structure:

- Empty strings converted to `null` for optional fields
- `seatNumber` parsed from string to `number | null` via `parseInt`
- Nested `dietary` and `logistics` objects reconstructed

### Action Buttons

- CANCEL — calls `onCancel`
- DELETE — shown only in edit mode, opens `ConfirmDialog`
- SAVE_ENTRY — submits the form

### Delete Confirmation

- Uses `ConfirmDialog` molecule with `showDeleteDialog` state
- Displays guest full name as target
- Calls `onDelete?.(guest!.id)` on confirm

## Conventions Followed

- No semicolons
- Single quotes
- 2-space indentation
- Trailing commas
- Function declaration (`function GuestForm`)
- Default export (`export default GuestForm`)
- No barrel files
- Relative imports for all local modules

## Verification

- TypeScript type-check (`tsc --noEmit`): **PASS** — zero GuestForm-specific errors
- Pre-existing LSP errors in `App.tsx` are unrelated to this task
