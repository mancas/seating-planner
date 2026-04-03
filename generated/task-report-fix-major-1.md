# Fix Report: MAJOR-1 — Accessibility: Missing ARIA attributes

## Problem

- `FormError` lacked `role="alert"`, so screen readers did not announce validation errors.
- `firstName` and `lastName` inputs lacked `aria-invalid`, so assistive technology could not identify fields in an error state.
- No `aria-describedby` linked inputs to their error messages.

## Changes

### `src/components/atoms/FormError.tsx`

- Added `role="alert"` to the `<p>` element.
- Added optional `id` prop so error messages can be referenced by `aria-describedby`.

### `src/components/molecules/FormField.tsx`

- Derives an `errorId` from `htmlFor` (e.g. `firstName-error`) and passes it to `FormError` as `id`.

### `src/components/organisms/GuestForm.tsx`

- Added `aria-invalid={!!errors.firstName}` and `aria-describedby` to the `firstName` input.
- Added `aria-invalid={!!errors.lastName}` and `aria-describedby` to the `lastName` input.

## Verification

- `role="alert"` ensures live-region announcement of error text on render.
- `aria-invalid` marks inputs as invalid when form errors exist.
- `aria-describedby` links each input to its corresponding error message by id (`firstName-error`, `lastName-error`).
- No unrelated code was modified.
