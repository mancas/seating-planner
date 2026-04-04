# Codebase Context Updates — Sticky Action Bar + Remove Logistics (Cycle 2)

## Date: 2026-04-04

### Changes to `generated/codebase-context.md`

#### 1. Type Definitions Table (line 176)

Update the `Guest` type entry. Replace:

```
| `Guest` | `data/guest-types.ts` | `id`, `firstName`, `lastName`, `status`, `accessLevel`, `tableAssignment`, `seatNumber`, `dietary`, `gift`, `logistics` |
```

With:

```
| `Guest` | `data/guest-types.ts` | `id`, `firstName`, `lastName`, `status`, `accessLevel`, `tableAssignment`, `seatNumber`, `dietary`, `gift` |
```

The `logistics` nested object (with `shuttleRequired`, `shuttleFrom`, `lodgingBooked`, `lodgingVenue`) has been removed from the Guest interface.

#### 2. Prior Spec Decisions Table

Update the `sticky-guest-form-actions` entry from "confirmed" to "completed":

```
| `sticky-guest-form-actions` (completed) | Action bar uses `sticky bottom-0` within scrollable `<main>`; `bg-background` + `border-t border-border` for visual separation; `pb-24` on form content for sticky bar clearance. Logistics fields (shuttle, lodging) removed from Guest type, form, detail panel, mock data, store, and CSV import. |
```

#### 3. Data Store Table

Update the Guest Store API description. The `updateGuest` function now deep-merges only `dietary` (not `logistics`):

Current behavior: `updateGuest(id, data)` spreads top-level fields and deep-merges `dietary: { ...existing.dietary, ...data.dietary }`.

#### 4. Organisms File Count

The organisms directory listing (line 278) shows 17 files. This count remains correct — no files were added or removed in this cycle. However, the `Toggle` atom in `atoms/` is now orphaned (zero consumers) and should be noted for cleanup.

### Architectural Notes

- The sticky action bar relies on the DOM chain: `<main overflow-y-auto>` → `<form>` (no overflow) → `<div sticky bottom-0>`. If any future change adds `overflow` to `<form>` or an intermediate wrapper, sticky positioning will break.
- The `Toggle` atom component (`src/components/atoms/Toggle.tsx`) has zero consumers after the logistics removal. It should be deleted per G-18/G-30 in a follow-up cleanup.
