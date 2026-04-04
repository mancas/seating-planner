# Spec: Import Guests

## Metadata

- **Slug**: `import-guests`
- **Date**: 2026-04-04
- **Status**: Completed
- **Author**: User
- **Related specs**: [spec/guest-crud-flow.md](./guest-crud-flow.md), [spec/guest-list-screen.md](./guest-list-screen.md), [spec/sidebar-navigation.md](./sidebar-navigation.md), [spec/nought-cobalt-design-system.md](./nought-cobalt-design-system.md)

## Description

Implement a guest import feature that allows users to bulk-add guests via CSV file upload. The feature lives at a dedicated route (`/guests/import`) within the app shell and provides two actions:

1. **Download CSV Template**: A button that generates and downloads a `.csv` file with pre-defined column headers and one example row, so users know exactly what format to fill in.
2. **Upload & Import CSV**: A file upload area that accepts a `.csv` file, parses it, validates every row, and either imports all guests or rejects the entire file with detailed error messages.

The CSV template includes 7 columns covering the most common guest data: `firstName`, `lastName`, `role`, `status`, `dietaryType`, `dietaryNotes`, and `gift`. Fields not included in the CSV (accessLevel, tableAssignment, seatNumber, shuttle, lodging) receive default values when guests are created.

Validation follows an **all-or-nothing** model: if any row in the CSV has errors, the entire file is rejected and zero guests are imported. The user sees a detailed error report listing every problem (row number, field name, reason) so they can fix the CSV and re-upload.

No duplicate detection is performed — every valid row creates a new guest entry, even if a guest with the same name already exists.

### Key Behaviors

- **Download Template**: Clicking the download button generates a CSV string in-memory (no server call) and triggers a browser download of `guest-template.csv`. The file contains a header row and one example row demonstrating the expected format.
- **Upload CSV**: The user selects a `.csv` file via a file input or drag-and-drop zone. The file is read client-side using the File API. Only `.csv` files are accepted.
- **Parse & Validate**: The CSV is parsed row by row. Every row is validated against the schema (required fields, allowed values, numeric types). All errors across all rows are collected before presenting results — the parser does not stop at the first error.
- **Error Display**: If validation fails, an error summary is shown below the upload area listing each error with its row number, field, and reason. The file is not imported. The user can fix the CSV and re-upload.
- **Successful Import**: If all rows pass validation, new guests are created via `addGuest()` from `guest-store.ts` for each row. The user sees a success message with the count of imported guests, then is navigated to the guest list (`/`).
- **Data Defaults**: Fields not in the CSV are set to: `accessLevel = ''`, `tableAssignment = null`, `seatNumber = null`, `logistics.shuttleRequired = false`, `logistics.shuttleFrom = null`, `logistics.lodgingBooked = false`, `logistics.lodgingVenue = null`.

## User Stories

1. As a **wedding planner**, I want to download a CSV template so that I know exactly what format to use when preparing my guest list in a spreadsheet.
2. As a **wedding planner**, I want to upload a filled CSV file to bulk-add guests so that I don't have to enter each guest one by one.
3. As a **wedding planner**, I want clear error messages when my CSV has problems so that I can fix the file and re-upload it.
4. As a **wedding planner**, I want the import to reject the entire file when there are errors so that I don't end up with a partially imported, inconsistent guest list.
5. As a **wedding planner**, I want fields I didn't include in the CSV (like seating and logistics) to get sensible defaults so that I can fill those in later through the edit form.

## Acceptance Criteria

### Navigation

1. GIVEN the guest list screen is displayed WHEN the user navigates to `/guests/import` THEN the import page is displayed within the app shell (sidebar visible on desktop, top nav present).

2. GIVEN the import page is displayed WHEN the user views the layout THEN the left sidebar is still visible (desktop), the top nav is present, but the detail panel and guest table are hidden. The import page replaces the guest list in the main content area.

3. GIVEN the import page is displayed WHEN the user clicks the "CANCEL" button THEN the user is navigated back to the guest list (`/`) and no data is changed.

### Download Template

4. GIVEN the import page is displayed WHEN the user clicks the "DOWNLOAD_TEMPLATE" button THEN a file named `guest-template.csv` is downloaded to the user's device.

5. GIVEN the template file is downloaded WHEN the user opens it in a spreadsheet application THEN it contains a header row with columns: `firstName`, `lastName`, `role`, `status`, `dietaryType`, `dietaryNotes`, `gift`.

6. GIVEN the template file is downloaded WHEN the user views the content THEN it contains one example row below the headers with values: `Jane`, `Doe`, `PRIORITY VIP`, `CONFIRMED`, `VEGAN`, `Severe nut allergy`, `250`.

### Upload — File Selection

7. GIVEN the import page is displayed WHEN the user views the upload section THEN a file upload area is visible with a file input that accepts `.csv` files only.

8. GIVEN the upload area is displayed WHEN the user clicks the upload area or the "SELECT_FILE" button THEN a native file picker dialog opens filtered to `.csv` files.

9. GIVEN the upload area is displayed WHEN the user drags a `.csv` file over the upload area THEN the area shows a visual hover/active state (border highlight).

10. GIVEN the upload area is displayed WHEN the user drops a `.csv` file on the upload area THEN the file is accepted and parsing begins.

11. GIVEN the upload area is displayed WHEN the user selects or drops a non-`.csv` file THEN an error message is shown: "INVALID_FORMAT // ONLY .CSV FILES ACCEPTED" and the file is rejected.

### Upload — Parsing & Validation

12. GIVEN a valid `.csv` file is selected WHEN the file is parsed THEN the first row is treated as the header row and subsequent rows are treated as guest data.

13. GIVEN a CSV file is parsed WHEN the header row does not contain the required columns (`firstName`, `lastName`) THEN the file is rejected with error: "INVALID_HEADERS // REQUIRED COLUMNS MISSING: firstName, lastName".

14. GIVEN a CSV file is parsed WHEN a data row has an empty `firstName` field THEN a validation error is recorded: "ROW {n}: REQUIRED_FIELD // firstName CANNOT BE EMPTY".

15. GIVEN a CSV file is parsed WHEN a data row has an empty `lastName` field THEN a validation error is recorded: "ROW {n}: REQUIRED_FIELD // lastName CANNOT BE EMPTY".

16. GIVEN a CSV file is parsed WHEN a data row has an empty `status` field THEN the status defaults to `PENDING` (no error).

17. GIVEN a CSV file is parsed WHEN a data row has a `status` value that is not one of `CONFIRMED`, `PENDING`, `DECLINED` (case-insensitive) THEN a validation error is recorded: "ROW {n}: INVALID_VALUE // STATUS must be CONFIRMED, PENDING, or DECLINED".

18. GIVEN a CSV file is parsed WHEN a data row has a `gift` value that is not a valid number and not empty THEN a validation error is recorded: "ROW {n}: INVALID_VALUE // GIFT must be a numeric value".

19. GIVEN a CSV file is parsed WHEN any validation errors exist across any rows THEN the entire file is rejected, zero guests are imported, and all errors are displayed in a list below the upload area.

20. GIVEN a CSV file is parsed WHEN the file contains zero data rows (only headers) THEN the file is rejected with error: "EMPTY_DATASET // CSV CONTAINS NO GUEST RECORDS".

21. GIVEN a CSV file has extra columns beyond the 7 defined WHEN the file is parsed THEN the extra columns are silently ignored (no error).

22. GIVEN a CSV file is parsed WHEN `status` values are provided in mixed case (e.g., "confirmed", "Pending") THEN they are normalized to uppercase before storage.

### Upload — Successful Import

23. GIVEN all rows in the CSV pass validation WHEN the import executes THEN a new guest is created via `addGuest()` from `guest-store.ts` for each data row, with an auto-generated UUID v4 as the ID.

24. GIVEN guests are being created from CSV data WHEN a guest is created THEN fields not in the CSV are set to defaults: `accessLevel = ''`, `tableAssignment = null`, `seatNumber = null`, `logistics.shuttleRequired = false`, `logistics.shuttleFrom = null`, `logistics.lodgingBooked = false`, `logistics.lodgingVenue = null`.

25. GIVEN guests are being created from CSV data WHEN optional CSV fields (role, dietaryType, dietaryNotes, gift) are empty THEN they are stored as: `role = ''`, `dietary.type = null`, `dietary.notes = null`, `gift = null`.

26. GIVEN all guests have been successfully imported WHEN the import completes THEN a success message is displayed: "IMPORT_COMPLETE // {N} GUESTS ADDED TO DATABASE" where {N} is the number of imported guests.

27. GIVEN the success message is displayed WHEN the user clicks "VIEW_GUEST_LIST" or after a brief moment THEN the user is navigated to the guest list (`/`).

### UI/Aesthetics

28. GIVEN the import page is displayed WHEN viewing the page THEN the page heading uses the cyberpunk/sci-fi naming convention (e.g., "BATCH_IMPORT // GUEST_REGISTRY") and all labels use uppercase styling consistent with the design system.

29. GIVEN the import page is displayed on mobile (<768px) WHEN viewing the page THEN the layout is single-column, full-width, with appropriate padding.

### Form Reset

30. GIVEN a CSV file was rejected with errors WHEN the user selects a new file THEN the previous errors are cleared and the new file is parsed fresh.

## Scope

### In Scope

- Dedicated route `/guests/import` within the app shell
- CSV template generation and download (client-side, no server)
- File upload via click-to-select and drag-and-drop
- Client-side CSV parsing (no external library — simple split-based parser)
- Row-by-row validation with all-or-nothing rejection
- Detailed error display with row numbers, field names, and reasons
- Guest creation via `addGuest()` from `guest-store.ts`
- Default values for fields not in the CSV
- Case-insensitive status matching with normalization to uppercase
- Navigation entry point to `/guests/import`
- Success message with import count
- Redirect to guest list after successful import
- Mobile-responsive layout
- Cyberpunk/sci-fi naming aesthetic
- React Router route definition for `/guests/import`

### Out of Scope

- Server-side file processing / API calls / backend
- CSV export (exporting existing guests to CSV)
- Duplicate detection or merge logic
- Importing fields beyond the 7 template columns (accessLevel, tableAssignment, seatNumber, shuttle, lodging)
- Editing the CSV in-browser before import
- Import progress bar or incremental loading (file is processed synchronously)
- Undo/rollback after successful import
- Import history or logging
- Drag-and-drop reordering of imported data
- Preview of parsed data before confirming import
- JSON or other file format imports
- External CSV parsing libraries (papaparse, csv-parse, etc.)

## Edge Cases

1. **Empty file**: If the uploaded file is empty (0 bytes), display error: "EMPTY_FILE // NO DATA DETECTED". Do not attempt to parse.

2. **Header-only file**: If the file has headers but no data rows, display error: "EMPTY_DATASET // CSV CONTAINS NO GUEST RECORDS".

3. **Whitespace in values**: Leading and trailing whitespace in cell values should be trimmed before validation and storage. A cell containing only whitespace is treated as empty.

4. **Quoted CSV fields**: Fields containing commas must be enclosed in double quotes (standard CSV format). The parser handles `"value with, comma"` correctly. Fields containing double quotes use the `""` escape convention (e.g., `"He said ""hello"""` → `He said "hello"`).

5. **Line ending variations**: The parser handles `\n` (Unix), `\r\n` (Windows), and `\r` (old Mac) line endings.

6. **Very large file**: No explicit file size limit is enforced. However, since all data is processed in-memory and stored in localStorage, a practical limit is around 1,000–2,000 rows before localStorage quota becomes a concern. No error is shown for file size — the import either succeeds or fails when localStorage throws.

7. **Non-UTF-8 encoding**: The File API reads files as UTF-8 by default. Files in other encodings may produce garbled text. No encoding detection is attempted — this is the user's responsibility.

8. **Extra columns in CSV**: If the CSV has more than 7 columns, the extra columns are silently ignored. Only the columns matching the expected header names are processed.

9. **Missing optional columns**: If the CSV header omits optional columns (e.g., has only `firstName`, `lastName`, `status`), the missing optional columns default to empty. Only `firstName` and `lastName` are truly required in the headers.

10. **Reordered columns**: The parser uses header names (not column position) to map data. Columns can appear in any order as long as the header names match.

11. **Gift with decimal**: Gift values like `250.50` are valid numbers and stored as-is (the `gift` field is `number | null`, no integer restriction).

12. **Gift with currency symbol**: A gift value like `$250` or `€250` is invalid (not a pure number) and produces a validation error.

13. **Negative gift value**: Negative numbers (e.g., `-100`) are technically valid numbers and pass validation. No business rule restricts gift to positive values.

14. **Status with extra spaces**: A status value like `" CONFIRMED "` is trimmed to `"CONFIRMED"` and accepted.

## Design Decisions

### DD-1: Dedicated Route for Import

**Decision**: The import feature lives at `/guests/import` as a dedicated route within the app shell, following the same pattern as `/guests/new` and `/guests/:id/edit`.
**Reasoning**: Keeps the import flow separate from the guest list view, provides a clean URL for navigation, and follows the established routing pattern from the `guest-crud-flow` spec. The import page is a complex multi-section layout (template download + file upload + error display) that would be cramped as a modal.

### DD-2: CSV Template — 7 Core Columns

**Decision**: The CSV template includes 7 columns: `firstName`, `lastName`, `role`, `status`, `dietaryType`, `dietaryNotes`, `gift`. All other Guest fields (accessLevel, tableAssignment, seatNumber, logistics.\*) are excluded from the template and receive default values on import.
**Reasoning**: These 7 fields represent the information a wedding planner most commonly has when building a guest list from a spreadsheet — names, roles, RSVP status, dietary needs, and gift amounts. Seating assignments and logistics are typically decided later and can be filled in via the edit form. Keeping the CSV to 7 columns reduces user confusion and spreadsheet complexity.

### DD-3: All-or-Nothing Validation

**Decision**: If any row in the CSV fails validation, the entire file is rejected and zero guests are imported. All errors across all rows are collected and displayed.
**Reasoning**: Partial imports create confusion — the user doesn't know which guests were added and which were skipped, leading to a potentially inconsistent guest list. All-or-nothing forces the user to fix the CSV completely before importing, resulting in a clean, predictable import. Showing all errors at once (not just the first) minimizes the fix-upload-fix cycle.

### DD-4: Client-Side CSV Parsing — No External Library

**Decision**: Parse CSV using a custom, simple parser implemented in a utility function. Do not use external libraries like papaparse or csv-parse.
**Reasoning**: The CSV format for this feature is well-constrained (7 columns, no nested data, predictable content). A simple parser that handles commas, quoted fields, and line endings is ~30–50 lines of code. Adding an external dependency for this is unnecessary overhead. The parser needs to handle: comma-separated values, double-quote-enclosed fields (for values containing commas), `""` escape for literal quotes within quoted fields, and mixed line endings (`\n`, `\r\n`, `\r`).

### DD-5: Template Download via Blob URL

**Decision**: Generate the CSV template as a string in JavaScript, create a `Blob` with MIME type `text/csv`, generate an object URL via `URL.createObjectURL()`, and trigger download by programmatically clicking a hidden `<a>` element with the `download` attribute set to `guest-template.csv`.
**Reasoning**: This is the standard client-side file download approach. No server needed. The Blob API is supported in all modern browsers. The template content is static and small (~200 bytes), so in-memory generation is trivial.

### DD-6: File Upload — Click + Drag-and-Drop

**Decision**: The upload area supports both click-to-select (via a hidden `<input type="file" accept=".csv">`) and drag-and-drop (via `onDragOver`/`onDrop` event handlers on the upload zone). The click behavior is triggered by clicking anywhere on the upload zone or a dedicated "SELECT_FILE" button.
**Reasoning**: Both interaction patterns are expected by users. Click-to-select is the baseline; drag-and-drop is a convenience for users who have the file visible in their file manager. The `.csv` accept attribute provides a hint to the file picker but is not a security measure — the actual file content validation happens during parsing.

### DD-7: File Type Validation — Extension Check

**Decision**: Validate that the selected file has a `.csv` extension (via `file.name.endsWith('.csv')`) before attempting to parse. Do not rely solely on the MIME type (`file.type`), as MIME types for CSV files vary across operating systems (`text/csv`, `application/vnd.ms-excel`, `text/plain`, or empty).
**Reasoning**: MIME type detection for CSV is unreliable. A `.csv` extension check is the most practical heuristic. If the file has a `.csv` extension but is not actually comma-separated data, the parser will catch the format errors during validation.

### DD-8: Header-Based Column Mapping

**Decision**: The parser uses the header row (first row) to determine which column index maps to which field. Columns are matched by header name (case-insensitive), not by position. This means columns can appear in any order, and extra columns are ignored.
**Reasoning**: Users may reorder columns in their spreadsheet or add their own notes columns. Positional parsing would break in these cases. Header-based mapping is more robust and user-friendly.

### DD-9: Error Message Format

**Decision**: Validation errors follow the format: `"ROW {n}: ERROR_TYPE // DETAIL"` where `{n}` is the 1-based row number (excluding the header row — row 1 is the first data row). Error types use the cyberpunk naming convention: `REQUIRED_FIELD`, `INVALID_VALUE`, `INVALID_HEADERS`, `EMPTY_DATASET`, `EMPTY_FILE`, `INVALID_FORMAT`.
**Reasoning**: Row numbers help the user locate the problem in their spreadsheet. The cyberpunk error format is consistent with the app's aesthetic (similar to validation errors in the guest form: "REQUIRED_FIELD // FIRST_NAME CANNOT BE EMPTY"). Collecting all errors before displaying avoids the frustrating "fix one, find another" cycle.

### DD-10: Status Default to PENDING

**Decision**: When the `status` column is empty for a row, the guest's status defaults to `PENDING` rather than producing a validation error.
**Reasoning**: PENDING is the most logical default for a newly imported guest — they haven't confirmed yet. This reduces friction for users who just want to import names and fill in statuses later. This matches the default status behavior in the add guest form (from `guest-crud-flow` spec DD-8).

### DD-11: Success Flow — Message Then Navigate

**Decision**: After a successful import, show a success message ("IMPORT_COMPLETE // {N} GUESTS ADDED TO DATABASE") with a "VIEW_GUEST_LIST" button. Clicking the button navigates to `/` via `navigate('/', { replace: true })`. The import route is replaced in history so pressing back doesn't return to the import page after completion.
**Reasoning**: Showing a success message gives the user confirmation of what happened before navigating away. Replacing the history entry prevents the user from pressing back into a completed import (same pattern as the add guest form from `guest-crud-flow` DD-9).

### DD-12: CSV Parser Utility — Separate Module

**Decision**: The CSV parsing and validation logic is implemented in a separate utility module (`src/utils/csv-import.ts`), not inline in the component. The module exports: `generateTemplate(): string`, `parseCSV(content: string): ParseResult`, and `validateGuests(rows: Record<string, string>[]): ValidationResult`.
**Reasoning**: Separating parsing/validation from the component keeps the component focused on UI concerns and makes the parsing logic independently testable. The utility module has no React dependencies — it's pure TypeScript functions operating on strings and arrays.

## UI/UX Details

### Import Page Layout — Desktop (>=768px)

```
┌──────────────────────────────────────────────────────────┐
│  TOP NAV: PLANNER_V1.0                          ⚙ 👤     │
├──────────┬───────────────────────────────────────────────┤
│          │  BATCH_IMPORT // GUEST_REGISTRY               │
│ SIDEBAR  │  ─────────────────────────────────────────    │
│          │  Import guest records from a CSV file.        │
│ Listado  │  Download the template, fill in your data,    │
│ de       │  and upload to populate the guest database.   │
│ invitados│                                               │
│          │  ┌──────────────────────────────────────┐     │
│ Canvas   │  │ STEP_01 // DOWNLOAD_TEMPLATE         │     │
│          │  │                                      │     │
│ [ADD     │  │ Download the CSV template file with  │     │
│  GUEST]  │  │ pre-defined columns and an example   │     │
│          │  │ row to use as a starting point.      │     │
│          │  │                                      │     │
│          │  │ Columns: FIRST_NAME, LAST_NAME,      │     │
│          │  │ ROLE, STATUS, DIETARY_TYPE,           │     │
│          │  │ DIETARY_NOTES, GIFT                   │     │
│          │  │                                      │     │
│          │  │ [ ↓ DOWNLOAD_TEMPLATE ]               │     │
│          │  └──────────────────────────────────────┘     │
│          │                                               │
│          │  ┌──────────────────────────────────────┐     │
│          │  │ STEP_02 // UPLOAD_GUEST_DATA         │     │
│          │  │                                      │     │
│          │  │  ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐  │     │
│          │  │  │                                │  │     │
│          │  │  │   ↑  DROP CSV FILE HERE        │  │     │
│          │  │  │      or click to select        │  │     │
│          │  │  │                                │  │     │
│          │  │  │   [ SELECT_FILE ]              │  │     │
│          │  │  │                                │  │     │
│          │  │  └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘  │     │
│          │  │                                      │     │
│          │  │  Accepted format: .csv                │     │
│          │  └──────────────────────────────────────┘     │
│          │                                               │
│          │  [CANCEL]                                     │
│          │                                               │
└──────────┴───────────────────────────────────────────────┘
```

### Import Page — Error State

```
┌──────────────────────────────────────────────────────────┐
│  TOP NAV: PLANNER_V1.0                          ⚙ 👤     │
├──────────┬───────────────────────────────────────────────┤
│          │  BATCH_IMPORT // GUEST_REGISTRY               │
│ SIDEBAR  │  ─────────────────────────────────────────    │
│          │                                               │
│          │  ┌─── STEP_01 // DOWNLOAD_TEMPLATE ──────┐   │
│          │  │ ...                                    │   │
│          │  └────────────────────────────────────────┘   │
│          │                                               │
│          │  ┌─── STEP_02 // UPLOAD_GUEST_DATA ──────┐   │
│          │  │                                        │   │
│          │  │  ✓ guests-list.csv selected             │   │
│          │  │                                        │   │
│          │  │  ┌─────────────────────────────────┐   │   │
│          │  │  │ ⚠ VALIDATION_FAILED             │   │   │
│          │  │  │ 3 ERRORS DETECTED // IMPORT     │   │   │
│          │  │  │ REJECTED                        │   │   │
│          │  │  │                                 │   │   │
│          │  │  │ ROW 2: REQUIRED_FIELD //        │   │   │
│          │  │  │   firstName CANNOT BE EMPTY     │   │   │
│          │  │  │ ROW 5: INVALID_VALUE //         │   │   │
│          │  │  │   STATUS must be CONFIRMED,     │   │   │
│          │  │  │   PENDING, or DECLINED          │   │   │
│          │  │  │ ROW 7: INVALID_VALUE //         │   │   │
│          │  │  │   GIFT must be a numeric value  │   │   │
│          │  │  │                                 │   │   │
│          │  │  │ Fix errors and re-upload.       │   │   │
│          │  │  └─────────────────────────────────┘   │   │
│          │  │                                        │   │
│          │  │  [ SELECT_NEW_FILE ]                    │   │
│          │  └────────────────────────────────────────┘   │
│          │                                               │
│          │  [CANCEL]                                     │
│          │                                               │
└──────────┴───────────────────────────────────────────────┘
```

### Import Page — Success State

```
┌──────────────────────────────────────────────────────────┐
│  TOP NAV: PLANNER_V1.0                          ⚙ 👤     │
├──────────┬───────────────────────────────────────────────┤
│          │  BATCH_IMPORT // GUEST_REGISTRY               │
│ SIDEBAR  │  ─────────────────────────────────────────    │
│          │                                               │
│          │  ┌────────────────────────────────────────┐   │
│          │  │                                        │   │
│          │  │  ✓ IMPORT_COMPLETE                     │   │
│          │  │                                        │   │
│          │  │  42 GUESTS ADDED TO DATABASE            │   │
│          │  │                                        │   │
│          │  │  [ VIEW_GUEST_LIST ]                    │   │
│          │  │                                        │   │
│          │  └────────────────────────────────────────┘   │
│          │                                               │
└──────────┴───────────────────────────────────────────────┘
```

### Import Page Layout — Mobile (<768px)

```
┌──────────────────────────┐
│ ■ PLANNER_V1.0      ⚙ 👤│
├──────────────────────────┤
│ BATCH_IMPORT             │
│ GUEST_REGISTRY           │
│                          │
│ Import guest records     │
│ from a CSV file.         │
│                          │
│ STEP_01                  │
│ DOWNLOAD_TEMPLATE        │
│ ─────────────────────    │
│ Download the CSV         │
│ template file.           │
│                          │
│ [ ↓ DOWNLOAD_TEMPLATE ]  │
│                          │
│ STEP_02                  │
│ UPLOAD_GUEST_DATA        │
│ ─────────────────────    │
│                          │
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┐ │
│ │  ↑ DROP CSV HERE     │ │
│ │  or click to select  │ │
│ │  [ SELECT_FILE ]     │ │
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─┘ │
│                          │
│ [CANCEL]                 │
│                          │
├──────────────────────────┤
│ 🏠 GUESTS   📐 CANVAS    │
└──────────────────────────┘
```

### CSV Template Content

```csv
firstName,lastName,role,status,dietaryType,dietaryNotes,gift
Jane,Doe,PRIORITY VIP,CONFIRMED,VEGAN,Severe nut allergy,250
```

### Component Breakdown (Atomic Design)

**New Utility Module:**

- `src/utils/csv-import.ts` — Pure TypeScript module with no React dependencies. Exports:
  - `generateTemplate(): string` — Returns the CSV template string (headers + example row)
  - `parseCSV(content: string): ParsedRow[]` — Parses CSV string into array of key-value objects using header names
  - `validateGuestRows(rows: ParsedRow[]): ValidationResult` — Validates all rows, returns `{ valid: boolean, errors: ImportError[], guests: GuestImportData[] }`

**New Organisms:**

- `ImportGuestsPage` (`src/components/organisms/ImportGuestsPage.tsx`) — The full import page. Contains: page header, template download section, file upload section, error display, success display, cancel button. Manages file state, parse/validate flow, and calls `addGuest()` on success.

**New Molecules:**

- `FileDropZone` (`src/components/molecules/FileDropZone.tsx`) — The drag-and-drop + click-to-select file upload area. Props: `onFileSelect: (file: File) => void`, `accept: string`, `selectedFileName?: string`, `hasError?: boolean`. Renders the dashed-border drop zone with upload icon and button.

**Modified Files:**

- `src/main.tsx` (or route config) — Add route for `/guests/import` → `ImportGuestsPage`

### Interaction Details

- **Download button**: `btn-secondary` style with a download icon. Triggers immediate file download on click.
- **Drop zone idle**: Dashed border (`border-dashed border-border`), muted text, upload icon
- **Drop zone drag hover**: Border changes to cobalt (`border-primary`), subtle background (`bg-primary/5`)
- **Drop zone with file selected**: Shows filename, solid border
- **Error panel**: `bg-red-500/5 border border-red-500/30 rounded` container. Warning icon + title in `text-red-400`. Error list items in `text-body-sm text-foreground-muted`.
- **Success panel**: `bg-primary/5 border border-primary/30 rounded` container. Checkmark icon + title in `text-primary`. Count in `text-heading-4`.
- **Cancel button**: `btn-secondary` style, navigates to `/`
- **VIEW_GUEST_LIST button**: `btn-primary` style in the success panel

### Validation Error Style

Error messages are displayed in a list within a red-tinted container. Each error is a `<li>` with `text-body-sm text-foreground-muted` and the error code portion (`ROW {n}: ERROR_TYPE`) in `text-red-400 font-semibold`.

## Data Requirements

### CSV Template Columns → Guest Field Mapping

| CSV Column     | Guest Field     | Required | Default if Empty    | Validation                          |
| -------------- | --------------- | -------- | ------------------- | ----------------------------------- |
| `firstName`    | `firstName`     | Yes      | —                   | Non-empty after trim                |
| `lastName`     | `lastName`      | Yes      | —                   | Non-empty after trim                |
| `role`         | `role`          | No       | `''` (empty string) | None                                |
| `status`       | `status`        | No       | `'PENDING'`         | Must be CONFIRMED/PENDING/DECLINED  |
| `dietaryType`  | `dietary.type`  | No       | `null`              | None                                |
| `dietaryNotes` | `dietary.notes` | No       | `null`              | None                                |
| `gift`         | `gift`          | No       | `null`              | Must be a valid number if non-empty |

### Fields Not in CSV — Defaults

| Guest Field                 | Default Value                             |
| --------------------------- | ----------------------------------------- |
| `id`                        | Auto-generated UUID v4 (via `addGuest()`) |
| `accessLevel`               | `''` (empty string)                       |
| `tableAssignment`           | `null`                                    |
| `seatNumber`                | `null`                                    |
| `logistics.shuttleRequired` | `false`                                   |
| `logistics.shuttleFrom`     | `null`                                    |
| `logistics.lodgingBooked`   | `false`                                   |
| `logistics.lodgingVenue`    | `null`                                    |

### TypeScript Types (csv-import.ts)

```typescript
interface ParsedRow {
  [key: string]: string
}

interface ImportError {
  row: number // 1-based data row number (excludes header)
  field: string // column name (e.g., 'firstName', 'status')
  message: string // human-readable error reason
}

interface GuestImportData {
  firstName: string
  lastName: string
  role: string
  status: GuestStatus
  dietary: {
    type: string | null
    notes: string | null
  }
  gift: number | null
}

interface ValidationResult {
  valid: boolean
  errors: ImportError[]
  guests: GuestImportData[]
}
```

### Guest Creation from Import Data

When creating a guest from `GuestImportData`, the full `Omit<Guest, 'id'>` object is constructed by merging the import data with defaults:

```typescript
const guestData: Omit<Guest, 'id'> = {
  firstName: importData.firstName,
  lastName: importData.lastName,
  role: importData.role,
  status: importData.status,
  accessLevel: '',
  tableAssignment: null,
  seatNumber: null,
  gift: importData.gift,
  dietary: importData.dietary,
  logistics: {
    shuttleRequired: false,
    shuttleFrom: null,
    lodgingBooked: false,
    lodgingVenue: null,
  },
}
```

## Technical Plan

### Impact Analysis

**New files to create:**

| File                                            | Type               | Purpose                                              |
| ----------------------------------------------- | ------------------ | ---------------------------------------------------- |
| `src/utils/csv-import.ts`                       | Utility module     | CSV template generation, parsing, and validation     |
| `src/components/molecules/FileDropZone.tsx`     | Molecule component | Drag-and-drop + click file upload area               |
| `src/components/organisms/ImportGuestsPage.tsx` | Organism component | Full import page (orchestrates all sections)         |
| `src/pages/ImportGuestsView.tsx`                | Page component     | Route-level wrapper that owns guest state for import |

**Files to modify:**

| File           | Change                     | Reason                            |
| -------------- | -------------------------- | --------------------------------- |
| `src/main.tsx` | Add route `/guests/import` | Wire up the new import page route |

**Integration points:**

- `addGuest()` from `src/data/guest-store.ts` — called for each valid imported guest row
- `getGuests()` from `src/data/guest-store.ts` — used to refresh guest state after import
- `GuestStatus` type from `src/data/guest-types.ts` — used for status validation
- `Guest` type from `src/data/guest-types.ts` — used to construct `Omit<Guest, 'id'>` for `addGuest()`
- React Router `navigate()` — for cancel (back to `/`) and post-import redirect
- Design system classes from `src/index.css` — `.btn-primary`, `.btn-secondary`, `.card`, typography utilities

**Shared dependencies (modify with care):**

- `guest-store.ts` — NOT modified, only consumed (calls `addGuest()` and `getGuests()`)
- `guest-types.ts` — NOT modified, only consumed (imports `Guest`, `GuestStatus`)
- `main.tsx` — Modified to add one `<Route>` element; existing routes untouched

### Task Decomposition

---

#### TASK-001: Create CSV utility module (`src/utils/csv-import.ts`)

**Description**: Create the pure TypeScript utility module that handles CSV template generation, CSV string parsing, and guest row validation. This module has zero React dependencies and is the core logic of the import feature.

**Affected files**: `src/utils/csv-import.ts` (CREATE)

**Dependencies**: None (independent)

**Project context**:

- Language: TypeScript ~5.9.3 with strict mode, `verbatimModuleSyntax`, `erasableSyntaxOnly`
- Use `import type` for type-only imports (enforced by `verbatimModuleSyntax`)
- No enums allowed (`erasableSyntaxOnly`) — use string literal union types instead
- Named exports for all functions and types (convention for utility/data files per `codebase-context.md`)
- File naming: kebab-case for utility files (pattern: `guest-store.ts`, `canvas-utils.ts`, `storage-utils.ts`)
- Prettier: no semicolons, single quotes, trailing commas, 2-space indent
- Utility files live in dedicated modules (G-36)
- The `src/utils/` directory does not exist yet — it must be created

**Implementation instructions**:

1. Create directory `src/utils/` and file `src/utils/csv-import.ts`.

2. Import the `GuestStatus` type from `../data/guest-types` using `import type`:

   ```typescript
   import type { GuestStatus } from '../data/guest-types'
   ```

3. Define and export the following interfaces:

   ```typescript
   export interface ParsedRow {
     [key: string]: string
   }

   export interface ImportError {
     row: number
     field: string
     message: string
   }

   export interface GuestImportData {
     firstName: string
     lastName: string
     role: string
     status: GuestStatus
     dietary: {
       type: string | null
       notes: string | null
     }
     gift: number | null
   }

   export interface ValidationResult {
     valid: boolean
     errors: ImportError[]
     guests: GuestImportData[]
   }
   ```

4. Implement `generateTemplate()`:

   ```typescript
   export function generateTemplate(): string {
     return 'firstName,lastName,role,status,dietaryType,dietaryNotes,gift\nJane,Doe,PRIORITY VIP,CONFIRMED,VEGAN,Severe nut allergy,250\n'
   }
   ```

5. Implement `parseCSV(content: string): ParsedRow[]`:
   - Normalize line endings: replace `\r\n` and `\r` with `\n`
   - Split into lines, removing any trailing empty line
   - The first line is the header row — split by commas (respecting quoted fields) to get column names
   - Each subsequent line is a data row — split by commas (respecting quoted fields) to get values
   - Map each data row to a `ParsedRow` object using header names as keys, trimming each cell value
   - For quoted field parsing: iterate character by character; when inside quotes, commas are literal; `""` is an escaped quote; handle fields like `"He said ""hello"""`
   - Column matching is case-insensitive: normalize header names to match expected names (`firstName`, `lastName`, `role`, `status`, `dietaryType`, `dietaryNotes`, `gift`)

6. Implement `validateGuestRows(rows: ParsedRow[], headers: string[]): ValidationResult`:
   - Accept the parsed rows AND the header list
   - First validate that required headers exist: `firstName` and `lastName` must be present in headers (case-insensitive). If missing, return a single error: `{ row: 0, field: 'headers', message: 'INVALID_HEADERS // REQUIRED COLUMNS MISSING: firstName, lastName' }`
   - If rows array is empty, return error: `{ row: 0, field: 'dataset', message: 'EMPTY_DATASET // CSV CONTAINS NO GUEST RECORDS' }`
   - For each row (1-indexed):
     - Trim all values. Treat whitespace-only as empty.
     - `firstName`: required. If empty → error `"REQUIRED_FIELD // firstName CANNOT BE EMPTY"`
     - `lastName`: required. If empty → error `"REQUIRED_FIELD // lastName CANNOT BE EMPTY"`
     - `status`: if empty, default to `'PENDING'`. If non-empty, normalize to uppercase and check against `['CONFIRMED', 'PENDING', 'DECLINED']`. If invalid → error `"INVALID_VALUE // STATUS must be CONFIRMED, PENDING, or DECLINED"`
     - `gift`: if non-empty, parse with `Number()`. If `isNaN` or value is empty string after trim → error `"INVALID_VALUE // GIFT must be a numeric value"`
     - `role`: default to `''` if empty
     - `dietaryType`: default to `null` if empty
     - `dietaryNotes`: default to `null` if empty
   - Collect ALL errors across all rows before returning
   - If any errors exist, return `{ valid: false, errors, guests: [] }`
   - If no errors, build `GuestImportData[]` and return `{ valid: true, errors: [], guests }`

7. Refactor `parseCSV` to return both headers and rows. Options:
   - Make `parseCSV` return `{ headers: string[], rows: ParsedRow[] }`
   - Or export a separate `parseHeaders` function
   - The recommended approach is: `export function parseCSV(content: string): { headers: string[], rows: ParsedRow[] }`

**Acceptance criteria**:

- `generateTemplate()` returns the exact CSV string with headers and example row as specified in the spec
- `parseCSV()` correctly handles: comma separation, quoted fields with commas, `""` escapes, mixed line endings (`\n`, `\r\n`, `\r`), trimming, reordered columns, extra columns (ignored)
- `validateGuestRows()` catches all error types: missing required fields, invalid status, invalid gift, empty dataset, missing required headers
- All errors are collected (not stopped at first error)
- Valid rows produce correct `GuestImportData` objects with proper defaults
- Status values are normalized to uppercase
- Module exports: `generateTemplate`, `parseCSV`, `validateGuestRows`, and all interfaces
- File compiles with `tsc -b` (no type errors)

---

#### TASK-002: Create FileDropZone molecule (`src/components/molecules/FileDropZone.tsx`)

**Description**: Create a reusable drag-and-drop + click-to-select file upload component. Handles drag events, file input trigger, file type validation (`.csv` extension), and visual state changes.

**Affected files**: `src/components/molecules/FileDropZone.tsx` (CREATE)

**Dependencies**: None (independent)

**Project context**:

- Components use `interface Props` defined at top of file
- Default exports for all components
- Icons from `react-icons/lu` only (G-20), use `size` prop for dimensions (G-22)
- All interactive elements must have `cursor-pointer` and `focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2` (G-8, G-11)
- Tailwind CSS v4 utility classes applied directly in JSX
- Design system button classes: `.btn-secondary`
- Dark mode only; color tokens: `border`, `primary`, `foreground-muted`, `foreground`
- All user-facing text is UPPERCASE with underscore separators
- Prettier: no semicolons, single quotes, trailing commas, 2-space indent
- Existing molecules for reference: `ConfirmDialog.tsx`, `FormField.tsx`, `FormSection.tsx`

**Implementation instructions**:

1. Create `src/components/molecules/FileDropZone.tsx`.

2. Define the Props interface:

   ```typescript
   interface Props {
     onFileSelect: (file: File) => void
     accept: string
     selectedFileName?: string
     hasError?: boolean
     onReset?: () => void
   }
   ```

3. Import `useState`, `useRef`, `useCallback` from `react`, and the upload icon from `react-icons/lu`:

   ```typescript
   import { useState, useRef, useCallback } from 'react'
   import type { DragEvent, ChangeEvent } from 'react'
   import { LuUpload } from 'react-icons/lu'
   ```

4. Implement the component:
   - Internal state: `isDragOver: boolean` (for hover styling)
   - Ref: `inputRef = useRef<HTMLInputElement>(null)` for the hidden file input
   - `handleDragOver`: `e.preventDefault()`, set `isDragOver = true`
   - `handleDragLeave`: set `isDragOver = false`
   - `handleDrop`: `e.preventDefault()`, set `isDragOver = false`, get file from `e.dataTransfer.files[0]`, validate extension (`.csv`), call `onFileSelect(file)` if valid
   - `handleFileChange`: get file from input's `e.target.files[0]`, validate extension, call `onFileSelect(file)` if valid. Reset the input's value after so same file can be re-selected.
   - File extension validation: `file.name.toLowerCase().endsWith('.csv')`. If not CSV, call `onFileSelect` is NOT called — instead, the component should accept an `onInvalidFile?: () => void` prop OR the parent handles this. **Decision**: Keep it simple — the parent component (`ImportGuestsPage`) will handle the `.csv` check since it also needs to show the error. `FileDropZone` passes the file through unconditionally. The parent checks the extension.
   - Actually, re-reading the spec (DD-7): validate that the file has `.csv` extension in the drop zone. To keep the molecule reusable, let the `accept` prop hint at file types, but delegate actual validation to the parent. The `FileDropZone` just passes whatever file the user selects/drops. This keeps the component generic.

5. Render structure:

   ```tsx
   <div
     onDragOver={handleDragOver}
     onDragLeave={handleDragLeave}
     onDrop={handleDrop}
     onClick={() => inputRef.current?.click()}
     className={`border-2 border-dashed rounded p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors ${
       isDragOver
         ? 'border-primary bg-primary/5'
         : hasError
           ? 'border-red-500/30 bg-red-500/5'
           : selectedFileName
             ? 'border-border bg-surface'
             : 'border-border hover:border-foreground-muted'
     }`}
   >
     <input
       ref={inputRef}
       type="file"
       accept={accept}
       className="hidden"
       onChange={handleFileChange}
     />
     {selectedFileName ? (
       <>
         <p className="text-body-sm text-foreground">{selectedFileName}</p>
         {onReset && (
           <button
             type="button"
             className="btn-secondary"
             onClick={(e) => {
               e.stopPropagation()
               onReset()
             }}
           >
             SELECT_NEW_FILE
           </button>
         )}
       </>
     ) : (
       <>
         <LuUpload size={24} className="text-foreground-muted" />
         <p className="text-body-sm text-foreground-muted">
           DROP CSV FILE HERE
         </p>
         <p className="text-caption text-foreground-muted">
           or click to select
         </p>
         <button
           type="button"
           className="btn-secondary"
           onClick={(e) => {
             e.stopPropagation()
             inputRef.current?.click()
           }}
         >
           SELECT_FILE
         </button>
       </>
     )}
   </div>
   ```

6. Export as default: `export default FileDropZone`

**Acceptance criteria**:

- Component renders a dashed-border drop zone with upload icon, text, and SELECT_FILE button
- Clicking the zone or the button opens the native file picker (filtered to `.csv` via `accept` prop)
- Dragging a file over the zone changes the border to cobalt and adds subtle background
- Dropping a file triggers `onFileSelect` callback
- When `selectedFileName` is provided, the zone shows the filename and a SELECT_NEW_FILE button
- When `hasError` is true, the zone border turns red-tinted
- `onReset` callback fires when clicking SELECT_NEW_FILE
- File compiles with `tsc -b`

---

#### TASK-003: Create ImportGuestsPage organism (`src/components/organisms/ImportGuestsPage.tsx`)

**Description**: Create the main import page organism that composes the template download section, file upload section (using FileDropZone), error display, and success display. This component manages the import workflow state machine.

**Affected files**: `src/components/organisms/ImportGuestsPage.tsx` (CREATE)

**Dependencies**: TASK-001 (csv-import.ts), TASK-002 (FileDropZone.tsx)

**Project context**:

- Organisms are feature-level compositions (see: `GuestForm.tsx`, `EmptyState.tsx`, `GuestDetailPanel.tsx`)
- Default exports for components
- Icons from `react-icons/lu` only (G-20), `size` prop for dimensions (G-22)
- All user-facing text UPPERCASE with underscore separators (sci-fi aesthetic)
- Design system classes: `.btn-primary`, `.btn-secondary`, `.card`, typography utilities (`text-label`, `text-heading-3`, `text-heading-4`, `text-heading-5`, `text-body-sm`, `text-caption`)
- Error styling pattern from spec: `bg-red-500/5 border border-red-500/30 rounded`, error code in `text-red-400 font-semibold`
- Success styling from spec: `bg-primary/5 border border-primary/30 rounded`, title in `text-primary`
- Page header pattern from `GuestForm.tsx`: `text-label text-primary tracking-wider` for subtitle, `text-heading-3 text-foreground-heading` for title
- No `setState` inside `useEffect` (G-16/G-25)
- Prettier: no semicolons, single quotes, trailing commas, 2-space indent
- Template download approach (DD-5): Blob URL + hidden `<a>` element with `download` attribute
- File type validation (DD-7): check `file.name.toLowerCase().endsWith('.csv')` before parsing
- `addGuest()` from `guest-store.ts` takes `Omit<Guest, 'id'>` and returns `Guest`

**Implementation instructions**:

1. Create `src/components/organisms/ImportGuestsPage.tsx`.

2. Imports:

   ```typescript
   import { useState, useCallback } from 'react'
   import { useNavigate } from 'react-router'
   import { LuDownload, LuTriangleAlert, LuCheckCircle } from 'react-icons/lu'
   import {
     generateTemplate,
     parseCSV,
     validateGuestRows,
   } from '../../utils/csv-import'
   import type { ImportError, GuestImportData } from '../../utils/csv-import'
   import { addGuest } from '../../data/guest-store'
   import type { Guest } from '../../data/guest-types'
   import FileDropZone from '../molecules/FileDropZone'
   ```

3. Define props interface:

   ```typescript
   interface Props {
     onImportComplete: () => void
   }
   ```

   The `onImportComplete` callback lets the parent (`ImportGuestsView`) refresh its guest state after import.

4. State management — use a discriminated state approach:

   ```typescript
   type ImportState =
     | { phase: 'idle' }
     | {
         phase: 'error'
         fileName: string
         errors: ImportError[]
         fileError?: string
       }
     | { phase: 'success'; count: number }

   const [importState, setImportState] = useState<ImportState>({
     phase: 'idle',
   })
   const [selectedFileName, setSelectedFileName] = useState<string | null>(null)
   ```

5. Implement `handleDownloadTemplate`:

   ```typescript
   const handleDownloadTemplate = useCallback(() => {
     const csv = generateTemplate()
     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
     const url = URL.createObjectURL(blob)
     const a = document.createElement('a')
     a.href = url
     a.download = 'guest-template.csv'
     document.body.appendChild(a)
     a.click()
     document.body.removeChild(a)
     URL.revokeObjectURL(url)
   }, [])
   ```

6. Implement `handleFileSelect(file: File)`:
   - Check for empty file: `if (file.size === 0)` → set error state with `fileError: 'EMPTY_FILE // NO DATA DETECTED'`
   - Check extension: `if (!file.name.toLowerCase().endsWith('.csv'))` → set error state with `fileError: 'INVALID_FORMAT // ONLY .CSV FILES ACCEPTED'`
   - Read file content: `file.text().then(content => { ... })` (or use async/await in the callback via a nested async function)
   - Parse: `const { headers, rows } = parseCSV(content)`
   - Validate: `const result = validateGuestRows(rows, headers)`
   - If `!result.valid`: set `importState` to `{ phase: 'error', fileName: file.name, errors: result.errors }`
   - If `result.valid`: create guests via `addGuest()` for each `GuestImportData`, constructing the full `Omit<Guest, 'id'>` with defaults:
     ```typescript
     for (const guest of result.guests) {
       addGuest({
         firstName: guest.firstName,
         lastName: guest.lastName,
         role: guest.role,
         status: guest.status,
         accessLevel: '',
         tableAssignment: null,
         seatNumber: null,
         gift: guest.gift,
         dietary: guest.dietary,
         logistics: {
           shuttleRequired: false,
           shuttleFrom: null,
           lodgingBooked: false,
           lodgingVenue: null,
         },
       })
     }
     ```
   - After creating all guests: call `onImportComplete()`, then set `importState` to `{ phase: 'success', count: result.guests.length }`
   - Set `selectedFileName` to `file.name`

7. Implement `handleReset`:

   ```typescript
   const handleReset = useCallback(() => {
     setImportState({ phase: 'idle' })
     setSelectedFileName(null)
   }, [])
   ```

8. Render structure (follow page header pattern from `GuestForm.tsx`):

   ```tsx
   <div className="px-4 md:px-6 py-4 md:py-6">
     <p className="text-label text-primary tracking-wider">
       BATCH_IMPORT // GUEST_REGISTRY
     </p>
     <h1 className="text-heading-3 text-foreground-heading mt-1">
       IMPORT_GUEST_DATA
     </h1>
     <p className="text-body-sm text-foreground-muted mt-2">
       Import guest records from a CSV file. Download the template, fill in your
       data, and upload to populate the guest database.
     </p>
   </div>
   ```

9. If `importState.phase === 'success'`, render the success panel:

   ```tsx
   <div className="px-4 md:px-6 pb-6">
     <div className="bg-primary/5 border border-primary/30 rounded p-6 flex flex-col items-center gap-3">
       <LuCheckCircle size={32} className="text-primary" />
       <h2 className="text-heading-4 text-primary">IMPORT_COMPLETE</h2>
       <p className="text-heading-5 text-foreground-heading">
         {importState.count} GUESTS ADDED TO DATABASE
       </p>
       <button
         className="btn-primary mt-2"
         onClick={() => navigate('/', { replace: true })}
       >
         VIEW_GUEST_LIST
       </button>
     </div>
   </div>
   ```

10. Otherwise, render the two-step layout:
    - **Step 1 — Download Template** section: a `.card` (or bordered container) with title `STEP_01 // DOWNLOAD_TEMPLATE`, description, column list, and a `btn-secondary` download button with `LuDownload` icon.
    - **Step 2 — Upload Guest Data** section: a bordered container with title `STEP_02 // UPLOAD_GUEST_DATA`, the `FileDropZone` component, and any error display below it.
    - Format hint below the drop zone: `"Accepted format: .csv"` in `text-caption text-foreground-muted`.

11. Error display (when `importState.phase === 'error'`):
    - If `importState.fileError` exists, show it as a single-line error
    - Otherwise, show the validation error list:

    ```tsx
    <div className="bg-red-500/5 border border-red-500/30 rounded p-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <LuTriangleAlert size={18} className="text-red-400" />
        <h3 className="text-heading-5 text-red-400">VALIDATION_FAILED</h3>
      </div>
      <p className="text-body-sm text-foreground-muted mb-3">
        {importState.errors.length} ERRORS DETECTED // IMPORT REJECTED
      </p>
      <ul className="space-y-1">
        {importState.errors.map((err, i) => (
          <li key={i} className="text-body-sm">
            <span className="text-red-400 font-semibold">
              ROW {err.row}: {err.message.split(' // ')[0]}
            </span>
            <span className="text-foreground-muted">
              {' // '}
              {err.message.split(' // ')[1]}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-caption text-foreground-muted mt-3">
        Fix errors and re-upload.
      </p>
    </div>
    ```

    - For file-level errors (like `EMPTY_FILE`, `INVALID_FORMAT`, `INVALID_HEADERS`, `EMPTY_DATASET`), render a single error item instead of a list.

12. Cancel button at the bottom:

    ```tsx
    <div className="flex gap-3 mt-6 px-4 md:px-6 pb-6">
      <button
        type="button"
        className="btn-secondary"
        onClick={() => navigate('/')}
      >
        CANCEL
      </button>
    </div>
    ```

13. Export: `export default ImportGuestsPage`

**Acceptance criteria**:

- Page renders with cyberpunk heading "BATCH_IMPORT // GUEST_REGISTRY"
- Download Template button triggers browser download of `guest-template.csv` with correct content
- File upload via FileDropZone triggers parsing and validation
- Empty file shows "EMPTY_FILE // NO DATA DETECTED" error
- Non-CSV file shows "INVALID_FORMAT // ONLY .CSV FILES ACCEPTED" error
- Validation errors render in a red-tinted panel with row numbers, field names, and reasons
- Selecting a new file clears previous errors
- Successful import creates guests via `addGuest()`, shows success panel with count
- VIEW_GUEST_LIST button navigates to `/` with history replacement
- CANCEL button navigates to `/`
- Layout is responsive (single-column on mobile, padded on desktop)
- File compiles with `tsc -b`

---

#### TASK-004: Create ImportGuestsView page + wire route in main.tsx

**Description**: Create the route-level page component that renders the import page within the app shell (with sidebar visible), and add the `/guests/import` route to the router configuration in `main.tsx`.

**Affected files**:

- `src/pages/ImportGuestsView.tsx` (CREATE)
- `src/main.tsx` (MODIFY)

**Dependencies**: TASK-003 (ImportGuestsPage.tsx)

**Project context**:

- Route-level components live in `src/pages/` (pattern: `GuestListView.tsx`, `SeatingPlanView.tsx`, `AddGuestPage.tsx`)
- `App.tsx` is a thin layout shell with `<TopNav />`, `<Outlet />`, `<BottomTabBar />` — no business logic (G-40)
- Current routing structure in `main.tsx`:
  ```tsx
  <Route element={<App />}>
    <Route element={<GuestListView />}>
      <Route index element={null} />
      <Route path="guests/new" element={<AddGuestPage />} />
      <Route path="guests/:id/edit" element={<EditGuestPage />} />
    </Route>
    <Route path="seating-plan" element={<SeatingPlanView />} />
  </Route>
  ```
- The import page should NOT be nested inside `<GuestListView />` because it is a standalone page that replaces the guest table (not an Outlet child of the guest list). It needs the sidebar visible but does NOT use GuestListView's OutletContext. Following the pattern of `SeatingPlanView` (a direct child of `App`), the import page should be a sibling route of `GuestListView`.
- The LeftSidebar is currently rendered inside `GuestListView` and `SeatingPlanView` — each view renders its own sidebar. The import view needs to render its own sidebar too.
- Store read functions initialized with `useState(() => fn())` pattern (G-39)
- `getGuests()` and `getTables()` from stores to provide sidebar data

**Implementation instructions**:

1. Create `src/pages/ImportGuestsView.tsx`:

   ```typescript
   import { useState, useCallback } from 'react'
   import { useNavigate } from 'react-router'
   import { getGuests } from '../data/guest-store'
   import { getTables } from '../data/table-store'
   import type { Guest } from '../data/guest-types'
   import LeftSidebar from '../components/organisms/LeftSidebar'
   import ImportGuestsPage from '../components/organisms/ImportGuestsPage'
   ```

2. The component renders the sidebar + main content area (matching `GuestListView` layout pattern):

   ```tsx
   function ImportGuestsView() {
     const navigate = useNavigate()
     const [guests, setGuests] = useState<Guest[]>(() => getGuests())
     const tables = getTables()

     const handleImportComplete = useCallback(() => {
       setGuests(getGuests())
     }, [])

     return (
       <>
         <LeftSidebar
           onAddGuest={() => navigate('/guests/new')}
           onAddTable={() => navigate('/seating-plan')}
           guests={guests}
           tables={tables}
         />
         <main className="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0">
           <ImportGuestsPage onImportComplete={handleImportComplete} />
         </main>
       </>
     )
   }

   export default ImportGuestsView
   ```

   The `<main>` wrapper matches the pattern from `GuestListView.tsx:115` (`flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0`).

3. Modify `src/main.tsx` — add the import for `ImportGuestsView` and add the route:

   Add import at the top (after the existing page imports):

   ```typescript
   import ImportGuestsView from './pages/ImportGuestsView.tsx'
   ```

   Add the route as a sibling of `GuestListView` and `SeatingPlanView`, inside the `<Route element={<App />}>` wrapper. It must be placed **before** the `GuestListView` layout route so that `/guests/import` is matched before the `GuestListView` layout route's children:

   ```tsx
   <Route element={<App />}>
     <Route path="guests/import" element={<ImportGuestsView />} />
     <Route element={<GuestListView />}>
       <Route index element={null} />
       <Route path="guests/new" element={<AddGuestPage />} />
       <Route path="guests/:id/edit" element={<EditGuestPage />} />
     </Route>
     <Route path="seating-plan" element={<SeatingPlanView />} />
   </Route>
   ```

   Note: The `guests/import` route must be placed before the layout route that nests `guests/new` and `guests/:id/edit` to avoid ambiguity. React Router v7 matches routes by specificity, so `guests/import` (static segment) wins over `guests/:id/edit` (dynamic segment) regardless of order, but placing it first makes the intent clear.

**Acceptance criteria**:

- Navigating to `/guests/import` renders the ImportGuestsPage within the app shell (TopNav visible via App, sidebar visible via ImportGuestsView, BottomTabBar visible via App)
- The sidebar shows navigation items and the ADD GUEST button (not canvas mode)
- Guest list data is available in the sidebar (unassigned counts, etc.)
- After successful import, the sidebar data refreshes to reflect new guests
- Existing routes (`/`, `/guests/new`, `/guests/:id/edit`, `/seating-plan`) continue to work unchanged
- The `main` area uses the same layout classes as GuestListView
- File compiles with `tsc -b`

### Parallelism

```
TASK-001 (csv-import.ts)     ──┐
                                ├──→ TASK-003 (ImportGuestsPage.tsx) ──→ TASK-004 (ImportGuestsView + route)
TASK-002 (FileDropZone.tsx)  ──┘
```

- **Parallel group 1**: TASK-001 and TASK-002 can run in parallel (no shared files, no dependencies)
- **Sequential**: TASK-003 depends on both TASK-001 and TASK-002 (imports from both)
- **Sequential**: TASK-004 depends on TASK-003 (imports `ImportGuestsPage`)

### Requirement Coverage Matrix

| Spec Requirement                                         | Task(s)                      |
| -------------------------------------------------------- | ---------------------------- |
| AC-1, AC-2: Route `/guests/import` within app shell      | TASK-004                     |
| AC-3: Cancel button navigates to `/`                     | TASK-003                     |
| AC-4, AC-5, AC-6: Download template with correct content | TASK-001, TASK-003           |
| AC-7, AC-8: File upload area with `.csv` filter          | TASK-002                     |
| AC-9, AC-10: Drag-and-drop with visual feedback          | TASK-002                     |
| AC-11: Non-CSV file rejection                            | TASK-003                     |
| AC-12: Header row parsing                                | TASK-001                     |
| AC-13: Missing required headers validation               | TASK-001                     |
| AC-14, AC-15: Required field validation                  | TASK-001                     |
| AC-16: Status default to PENDING                         | TASK-001                     |
| AC-17: Status enum validation                            | TASK-001                     |
| AC-18: Gift numeric validation                           | TASK-001                     |
| AC-19: All-or-nothing rejection with error display       | TASK-001, TASK-003           |
| AC-20: Empty dataset rejection                           | TASK-001                     |
| AC-21: Extra columns ignored                             | TASK-001                     |
| AC-22: Status case normalization                         | TASK-001                     |
| AC-23: Guest creation via `addGuest()`                   | TASK-003                     |
| AC-24: Default values for non-CSV fields                 | TASK-003                     |
| AC-25: Optional field defaults                           | TASK-001                     |
| AC-26: Success message with count                        | TASK-003                     |
| AC-27: Navigate to guest list after success              | TASK-003                     |
| AC-28: Cyberpunk naming convention                       | TASK-003                     |
| AC-29: Mobile responsive layout                          | TASK-002, TASK-003, TASK-004 |
| AC-30: Form reset on new file                            | TASK-002, TASK-003           |
| Edge case: Empty file                                    | TASK-003                     |
| Edge case: Whitespace trimming                           | TASK-001                     |
| Edge case: Quoted CSV fields                             | TASK-001                     |
| Edge case: Line ending variations                        | TASK-001                     |
| Edge case: Missing optional columns                      | TASK-001                     |
| Edge case: Reordered columns                             | TASK-001                     |
| Edge case: Gift with decimal                             | TASK-001                     |
| Edge case: Gift with currency symbol                     | TASK-001                     |

## Notes

- The CSV parser is intentionally simple and does not cover every CSV edge case (e.g., multi-line values within quoted fields). For wedding guest data, multi-line cell values are extremely unlikely. If this becomes a need, the parser can be upgraded or replaced with papaparse.
- The 7-column template was chosen to balance completeness with usability. Users who need to set logistics or seating data should use the individual edit form after import.
- No navigation entry point (sidebar button, etc.) is explicitly specified for reaching `/guests/import`. The user can navigate there directly via URL, or a link/button can be added to the empty state or guest list header in a future iteration. The route exists and is functional regardless of how the user reaches it.

## Changelog

- 2026-04-04: Initial draft
- 2026-04-04: Confirmed by user
- 2026-04-04: Technical plan added — 4 tasks decomposed (2 parallel, 2 sequential)
