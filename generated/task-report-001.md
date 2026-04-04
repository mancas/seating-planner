# Task Report: TASK-001 — Create `src/utils/project-export.ts`

## Status: COMPLETED

## Summary

Created a pure utility module for project export/import functionality. The module handles generating export JSON from localStorage, validating imported file content, applying imported data back to localStorage, and triggering a browser file download.

## File Created

- `src/utils/project-export.ts`

## What Was Implemented

### Interface: `ProjectExport`

- Exported interface with `version` (number), `exportedAt` (string), and `data` containing `guests` (Guest[]), `tables` (FloorTable[]), and `tableCounter` (number)
- Uses `import type` for `Guest` and `FloorTable` per `verbatimModuleSyntax`

### Function: `generateProjectExport(): string`

- Reads three localStorage keys (`seating-plan:guests`, `seating-plan:tables`, `seating-plan:table-counter`)
- Parses each or defaults to `[]`/`0`
- Builds a `ProjectExport` object with `version: 1` and ISO timestamp
- Returns pretty-printed JSON (`JSON.stringify` with 2-space indent)

### Function: `validateProjectImport(content: string): ProjectExport | null`

- Wraps `JSON.parse` in try/catch — returns `null` on parse failure
- Validates `version === 1`, `data` is an object, `guests` and `tables` are arrays, `tableCounter` is a number
- Returns the parsed `ProjectExport` if all checks pass, otherwise `null`

### Function: `applyProjectImport(data: ProjectExport): void`

- Writes all three localStorage keys from the provided `ProjectExport` data

### Function: `downloadProjectExport(): void`

- Calls `generateProjectExport()` to get JSON
- Creates a Blob with `application/json` type
- Generates filename in format `seating-plan-YYYY-MM-DD.json`
- Creates temporary `<a>` element, triggers click download, cleans up

## Verification

- `npx tsc --noEmit --pretty src/utils/project-export.ts` — zero type errors
- No LSP errors in the created file (pre-existing `role` errors in other files are unrelated)

## Acceptance Criteria Checklist

- [x] `generateProjectExport()` returns valid JSON string with `version: 1`, `exportedAt` ISO timestamp, and `data` containing guests/tables/tableCounter from localStorage
- [x] `validateProjectImport()` returns `null` for invalid JSON, missing fields, wrong version, non-array guests/tables, non-number tableCounter
- [x] `validateProjectImport()` returns the parsed `ProjectExport` for valid content
- [x] `applyProjectImport()` writes all three localStorage keys
- [x] `downloadProjectExport()` triggers a file download with the correct filename format
- [x] Code style: no semicolons, single quotes, 2-space indent, `import type`, named exports only
- [x] Pure utility module — no React dependencies
