# Validation Report: Sticky Action Bar + Remove Logistics (Cycle 2)

## Metadata

- **Specs**: `sticky-guest-form-actions` (TASK-001) + logistics removal (TASK-002 through TASK-006)
- **Date**: 2026-04-04
- **Iteration**: 2 of 2
- **Verdict**: **APPROVED** (with 2 MINOR findings)

---

## Summary

All changes across the 6 modified source files are correct. The sticky action bar implementation in `GuestForm.tsx` matches the spec precisely. The logistics removal is complete across all source files — zero references to `logistics`, `shuttle*`, `lodging*`, `LuBus`, or `LuHotel` remain in `src/`. The build, lint, and format checks all pass cleanly.

The previous iteration's MAJOR-1 finding (out-of-scope `EditGuestPage.tsx` change) was not reverted but was instead accepted and documented as guardrail G-47. Since this was already adjudicated, it is not re-flagged.

---

## Automated Checks

| Check                  | Result                                                    |
| ---------------------- | --------------------------------------------------------- |
| `tsc -b`               | PASS (zero errors)                                        |
| `vite build`           | PASS                                                      |
| `npm run lint`         | PASS (0 errors, 1 pre-existing warning in GuestTable.tsx) |
| `npm run format:check` | PASS                                                      |

---

## Completeness Check — Sticky Action Bar (TASK-001)

| AC   | Description                                                              | Status | Notes                                                                               |
| ---- | ------------------------------------------------------------------------ | ------ | ----------------------------------------------------------------------------------- |
| AC-1 | Add guest form: action bar visible without scrolling when form overflows | PASS   | `sticky bottom-0` at GuestForm.tsx:214                                              |
| AC-2 | Edit guest form: action bar with CANCEL, DELETE, SAVE_ENTRY visible      | PASS   | Button markup unchanged; sticky applies to both modes                               |
| AC-3 | Scrolling: action bar remains fixed, content scrolls behind              | PASS   | `bg-background` prevents content showing through                                    |
| AC-4 | Tall viewport (no scroll): action bar at natural position                | PASS   | Sticky has no effect when content doesn't overflow                                  |
| AC-5 | Mobile: no overlap with BottomTabBar                                     | PASS   | Sticky within `<main>` which has `pb-16 md:pb-0`; action bar sits above the padding |
| AC-6 | Solid background and top border                                          | PASS   | `bg-background` + `border-t border-border` applied at line 214                      |
| AC-7 | Edit mode: all three buttons visible                                     | PASS   | Button JSX unchanged (lines 215–229)                                                |
| AC-8 | Create mode: CANCEL and SAVE_ENTRY visible                               | PASS   | Button JSX unchanged                                                                |

### Implementation Details

- **Action bar** (GuestForm.tsx:214): `sticky bottom-0 flex justify-end gap-3 px-4 md:px-6 py-4 bg-background border-t border-border` — exact match to spec TASK-001.
- **Form content padding** (GuestForm.tsx:93): `pb-24` — correct, provides clearance for sticky bar.
- **No overflow on `<form>`**: The `<form>` at line 81 has no `className` — sticky positioning works against `<main>` ancestor.

---

## Completeness Check — Logistics Removal (TASK-002 through TASK-006)

| Task     | File                             | Changes                                                       | Status |
| -------- | -------------------------------- | ------------------------------------------------------------- | ------ |
| TASK-002 | `data/guest-types.ts`            | `logistics` property removed from Guest interface             | PASS   |
| TASK-002 | `data/guest-store.ts`            | `logistics` deep merge removed from `updateGuest()`           | PASS   |
| TASK-003 | `data/mock-guests.ts`            | `logistics` blocks removed from all 6 mock guests             | PASS   |
| TASK-004 | `organisms/GuestForm.tsx`        | Logistics form section, fields, hooks, imports removed        | PASS   |
| TASK-005 | `organisms/GuestDetailPanel.tsx` | Logistics display section, `LuBus`/`LuHotel` imports removed  | PASS   |
| TASK-006 | `organisms/ImportGuestsPage.tsx` | Logistics defaults removed from CSV import guest construction | PASS   |

### Codebase-Wide Search

Searched all `*.{ts,tsx,js,jsx,css,html}` in the project for: `logistics`, `shuttleRequired`, `shuttleFrom`, `lodgingBooked`, `lodgingVenue`, `LuBus`, `LuHotel`.

**Result**: Zero matches in source code. References remain only in:

- `generated/` task reports (historical records of what was done)
- `generated/guardrails.md` G-12 (historical example — acceptable)
- `generated/codebase-context.md` line 176 (stale — MINOR-2)
- `spec/` files (historical specifications — no action needed)

---

## Convention Compliance

| Convention                   | Status | Notes                                                                          |
| ---------------------------- | ------ | ------------------------------------------------------------------------------ |
| Tailwind v4 utilities        | PASS   | All classes are valid Tailwind v4 utilities                                    |
| Design system tokens         | PASS   | `bg-background`, `border-border` map to correct CSS variables                  |
| Prettier formatting          | PASS   | `npm run format:check` passes                                                  |
| ESLint                       | PASS   | No new errors                                                                  |
| TypeScript                   | PASS   | `tsc -b && vite build` succeeds with zero errors                               |
| No unused imports            | PASS   | `useWatch`, `control`, `setValue`, `Toggle`, `LuBus`, `LuHotel` all cleaned up |
| `import type` for type-only  | PASS   | `import type { Guest, GuestStatus }` used correctly                            |
| Function declarations (G-45) | PASS   | `handleFormSubmit` uses function declaration                                   |

---

## Findings

### MINOR-1: Orphaned `Toggle` Atom Component

**Severity**: MINOR
**File**: `src/components/atoms/Toggle.tsx`
**Description**: The `Toggle` atom component has zero consumers after removing the logistics form section from `GuestForm.tsx`. A grep for `from.*atoms/Toggle` returns zero results. Per G-18 and G-30, unused component files should be deleted.
**Impact**: Dead code that increases cognitive load. No functional impact.
**Recommendation**: Delete `src/components/atoms/Toggle.tsx` in a follow-up cleanup task.

### MINOR-2: Stale `logistics` Reference in `codebase-context.md`

**Severity**: MINOR
**File**: `generated/codebase-context.md:176`
**Description**: The Type Definitions table still lists `logistics` as a key field of the `Guest` type. The Guest type no longer has this property.
**Impact**: Misleading documentation for future agents/developers. No functional impact.
**Recommendation**: Addressed in `codebase-context-updates.md` below.

---

### No CRITICAL findings.

### No MAJOR findings.

---

## Verification Checklist

- [x] `npm run build` — PASS
- [x] `npm run lint` — PASS
- [x] `npm run format:check` — PASS
- [x] Sticky action bar: `sticky bottom-0 bg-background border-t border-border py-4` (GuestForm.tsx:214)
- [x] Form content padding: `pb-24` (GuestForm.tsx:93)
- [x] Guest interface: no `logistics` property (guest-types.ts:3-16)
- [x] updateGuest: no `logistics` deep merge (guest-store.ts:33-37)
- [x] Mock guests: no `logistics` blocks (mock-guests.ts — all 6 guests clean)
- [x] GuestForm: no logistics fields, no Toggle import, no useWatch/control/setValue
- [x] GuestDetailPanel: no LuBus/LuHotel imports, no logistics section
- [x] ImportGuestsPage: no logistics defaults in addGuest call
- [x] Zero logistics/shuttle/lodging references in `src/` (grep verified)
- [x] No broken references or TypeScript errors

---

## Verdict

**APPROVED**

Two MINOR findings documented. Both are non-blocking cleanup/documentation items.
