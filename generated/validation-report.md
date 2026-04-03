# Validation Report — Guest CRUD Flow

**Spec**: `spec/guest-crud-flow.md`
**Date**: 2026-04-03

---

## Iteration 1 — CHANGES_REQUESTED

**CRITICAL**: 0 | **MAJOR**: 4 | **MINOR**: 6

### MAJOR Issues Found

| ID      | File(s)                            | Description                                                                 |
| ------- | ---------------------------------- | --------------------------------------------------------------------------- |
| MAJOR-1 | GuestForm.tsx, FormError.tsx       | Missing `aria-invalid` on validated inputs and `role="alert"` on FormError  |
| MAJOR-2 | App.tsx:40-46                      | `setSelectedGuestId` in `useEffect` causes ESLint error (blocks pre-commit) |
| MAJOR-3 | App.tsx, GuestTable.tsx            | Double search filtering — search applied in both App and GuestTable         |
| MAJOR-4 | SelectInput.tsx, TextareaInput.tsx | Created but never used — dead code                                          |

---

## Iteration 2 — APPROVED

**CRITICAL**: 0 | **MAJOR**: 0 | **MINOR**: 6 (unchanged, acceptable)

### MAJOR Issue Resolution

| ID      | Status   | Verification Details                                                                                                                                                                                                                                |
| ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MAJOR-1 | RESOLVED | `FormError.tsx` now has `role="alert"` and accepts `id` prop. `GuestForm.tsx` adds `aria-invalid` and `aria-describedby` on both `firstName` and `lastName` inputs. `FormField.tsx` computes `errorId` from `htmlFor` and passes it to `FormError`. |
| MAJOR-2 | RESOLVED | `useEffect` removed from App.tsx. Replaced with synchronous state adjustment during render (lines 40-46) with guard `selectedGuestId !== locationState.selectedGuestId` to prevent re-render loops. `useEffect` removed from imports.               |
| MAJOR-3 | RESOLVED | Duplicate filtering removed from `GuestTable.tsx`. Filtering is now solely in `App.tsx` (lines 101-104). `GuestTable` receives pre-filtered `guests` prop and only groups them. Comment at line 26 documents the responsibility boundary.           |
| MAJOR-4 | RESOLVED | `SelectInput.tsx` and `TextareaInput.tsx` deleted. No remaining imports or references found in the codebase.                                                                                                                                        |

### New Issues Introduced by Fixes

None detected.

### Build Verification

| Check              | Result | Notes                                                                                                                     |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| `npx tsc --noEmit` | PASS   | Zero errors                                                                                                               |
| `npm run lint`     | PASS   | Zero errors, 1 warning (`react-hooks/incompatible-library` for `watch()` — known acceptable React Compiler interop issue) |
| `npm run build`    | PASS   | Built successfully (74 modules, 167ms)                                                                                    |

### Remaining MINOR Issues (not blocking)

| ID      | Severity | File(s)                                                | Description                                              |
| ------- | -------- | ------------------------------------------------------ | -------------------------------------------------------- |
| MINOR-1 | MINOR    | AddGuestPage.tsx, EditGuestPage.tsx                    | Duplicated `OutletContext` interface                     |
| MINOR-2 | MINOR    | GuestForm.tsx, GuestDetailPanel.tsx, ConfirmDialog.tsx | Destructive button styling duplicated                    |
| MINOR-3 | MINOR    | GuestForm.tsx:112                                      | Heading uses `text-heading-3` vs spec's `text-heading-1` |
| MINOR-4 | MINOR    | ConfirmDialog.tsx                                      | No Escape key, ARIA dialog role, or focus trap           |
| MINOR-5 | MINOR    | GuestDetailPanel.tsx:109                               | Dialog not dismissed before `onDelete`                   |
| MINOR-6 | MINOR    | GuestForm.tsx:165-173                                  | Native `<select>` lacks custom dropdown arrow            |

---

## Final Verdict: APPROVED

All 4 MAJOR issues from Iteration 1 have been resolved correctly. No new CRITICAL or MAJOR issues were introduced. The build, type-check, and lint all pass cleanly. The 6 MINOR issues remain as non-blocking recommendations for future improvement.
