# Task Report: TASK-001 — Create CSV utility module

## Status: COMPLETED

## Summary

Created `src/utils/csv-import.ts`, a pure TypeScript utility module for CSV template generation, CSV string parsing, and guest row validation. The module has zero React dependencies.

## Files Created

- `src/utils/csv-import.ts` — new file (239 lines)

## What Was Implemented

### Exported Types

- `ParsedRow` — dictionary interface for parsed CSV rows
- `ImportError` — error descriptor with row number, field, and message
- `GuestImportData` — validated guest data structure matching the spec
- `ValidationResult` — aggregated validation outcome with errors and guest list

### Exported Functions

1. **`generateTemplate()`** — Returns a CSV string with header row and one example data row matching the expected column format.

2. **`parseCSV(content: string)`** — Parses a CSV string into headers and row objects:
   - Normalizes `\r\n` and `\r` line endings to `\n`
   - Strips trailing empty line
   - Handles quoted fields: commas inside quotes are literal, `""` is an escaped quote
   - Case-insensitive header normalization to expected column names (firstName, lastName, role, status, dietaryType, dietaryNotes, gift)
   - Extra/unknown columns are preserved as-is
   - All cell values are trimmed

3. **`validateGuestRows(rows, headers)`** — Validates parsed rows against guest data rules:
   - Checks required headers (firstName, lastName) are present (case-insensitive)
   - Checks for empty dataset
   - Per-row validation (1-indexed):
     - `firstName` and `lastName` required (non-empty after trim)
     - `status` defaults to `'PENDING'`; if provided, normalized to uppercase and validated against `CONFIRMED | PENDING | DECLINED`
     - `gift` validated as numeric if provided
     - `role` defaults to `''`, `dietaryType`/`dietaryNotes` default to `null`
   - Collects ALL errors across all rows before returning
   - Returns `{ valid: false, errors, guests: [] }` if any errors; `{ valid: true, errors: [], guests }` otherwise

## Verification

- `npx tsc -b` — zero type errors
- `npx eslint src/utils/csv-import.ts` — zero lint issues
- `npx prettier --check src/utils/csv-import.ts` — formatting correct

## Acceptance Criteria Checklist

- [x] `generateTemplate()` returns exact CSV string with headers and example row
- [x] `parseCSV()` handles: comma separation, quoted fields with commas, `""` escapes, mixed line endings, trimming, reordered columns, extra columns
- [x] `validateGuestRows()` catches: missing required fields, invalid status, invalid gift, empty dataset, missing required headers
- [x] All errors collected (not stopped at first error)
- [x] Valid rows produce correct `GuestImportData` with proper defaults
- [x] Status values normalized to uppercase
- [x] All interfaces and functions exported as named exports
- [x] File compiles with `tsc -b` (no type errors)
- [x] Uses `import type` for `GuestStatus` (enforced by `verbatimModuleSyntax`)
- [x] No enums used (enforced by `erasableSyntaxOnly`)
- [x] Prettier formatting: no semicolons, single quotes, trailing commas, 2-space indent
