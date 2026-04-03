# Fix Report — MAJOR-4

## Issue

`SelectInput.tsx` and `TextareaInput.tsx` were created as atom components but never imported or used anywhere in the application. `GuestForm.tsx` uses inline native `<select>` and `<textarea>` elements with react-hook-form's `register` pattern instead. The two files were dead code.

## Changes Made

- Deleted `src/components/atoms/SelectInput.tsx`
- Deleted `src/components/atoms/TextareaInput.tsx`

## Verification

- Searched the entire codebase for `SelectInput` and `TextareaInput` imports — no source file (`src/`) references either component.
- TypeScript compilation (`tsc --noEmit`) passes with no errors after deletion.
