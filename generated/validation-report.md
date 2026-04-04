# Validation Report — Refactor Codebase

**Date**: 2026-04-04
**Spec**: `spec/refactor-codebase.md`
**Validator**: Validator Agent
**Iteration**: 2 (re-review)

---

## Build Status

**PASS** — `npx tsc -b && npx vite build` completed successfully (169 modules, 551.84 kB JS, 35.79 kB CSS). Vite warns about chunk size >500 kB (pre-existing, not introduced by this refactor).

## Lint Status

**2 errors, 2 warnings** — unchanged from iteration 1 (all pre-existing or justified)

| Finding                                                    | Severity | Source                                                                  |
| ---------------------------------------------------------- | -------- | ----------------------------------------------------------------------- |
| `react-hooks/refs` — `SeatingCanvas.tsx:232`               | error    | **Pre-existing** — accessing `transformRef.current` during render       |
| `react-hooks/set-state-in-effect` — `GuestListView.tsx:35` | error    | **Introduced by T-07/T-10** — justified in spec (side effect in render) |
| `react-hooks/incompatible-library` — `GuestForm.tsx:78`    | warning  | **Pre-existing** — react-hook-form `watch()`                            |
| `react-hooks/incompatible-library` — `GuestTable.tsx:111`  | warning  | **Pre-existing** — TanStack Table `useReactTable()`                     |

---

## Re-Review: Iteration 1 Findings

### M-1: `guest-store.ts` dead statistics functions — **FIXED**

`guest-store.ts` is now 50 lines containing only 5 CRUD functions (`getGuests`, `getGuestById`, `addGuest`, `updateGuest`, `deleteGuest`). All 7 dead statistics functions (`getConfirmedCount`, `getPendingCount`, `getConfirmationRate`, `getDietaryFlagCount`, `getTotalGuests`, `getWaitlistCount`, `getGuestsByTable`) have been deleted. Build and lint pass with no regressions.

---

## Findings

### CRITICAL

None

### MAJOR

None — M-1 has been resolved. M-2 remains as a documented design decision (see MINOR below).

### MINOR (carried forward from iteration 1)

**m-0: `SeatingPlanView` guest state uses `useState` with no setter — misleading pattern** (downgraded from M-2)

- **Location**: `src/pages/SeatingPlanView.tsx:20`
- **Issue**: `const [guests] = useState<Guest[]>(() => getGuests())` uses a state hook but never calls the setter. Functionally correct because route navigation causes remounts, but the pattern implies the value could change.
- **Recommendation**: Document as known limitation. Consider using `useMemo` for clarity.

### MINOR

**m-1: ESLint error on `setSelectedGuestId` in `useEffect` should be suppressed**

- **Location**: `src/pages/GuestListView.tsx:32-38`
- **Issue**: The `react-hooks/set-state-in-effect` rule flags this. The spec explicitly chose `useEffect` over setState-during-render because `window.history.replaceState` is a side effect that shouldn't run during render. This is a valid trade-off against guardrail G-16/G-25.
- **Recommendation**: Add `// eslint-disable-next-line react-hooks/set-state-in-effect` with a comment referencing the spec justification.

**m-2: Inconsistent `onUpdate` prop types between `CanvasPropertiesPanel` and `MobilePropertiesSheet`**

- **Location**: `CanvasPropertiesPanel.tsx:8-13` vs `MobilePropertiesSheet.tsx:9-12`
- **Issue**: CPC defines `onUpdate` as a manual inline type `{ label?: string; shape?: TableShape; ... }`, while MPS uses `Partial<Pick<FloorTable, ...>>`. Both are semantically identical but violate guardrail G-33.
- **Recommendation**: Both wrappers should use `Partial<Pick<FloorTable, 'label' | 'shape' | 'seatCount' | 'rotation'>>`.

**m-3: `CanvasPropertiesPanel` imports unused `TableShape` type**

- **Location**: `src/components/organisms/CanvasPropertiesPanel.tsx:2`
- **Issue**: `TableShape` is only referenced in the inline `onUpdate` type. If unified per m-2, this import becomes unnecessary.
- **Recommendation**: Unify type and remove import.

**m-4: `GuestListView` calls `getTables()` on every render without memoization**

- **Location**: `src/pages/GuestListView.tsx:40`
- **Issue**: `const tables = getTables()` deserializes from localStorage on every render. For current data size this is negligible but inconsistent with the `useState` lazy initializer pattern used for guests.
- **Recommendation**: Wrap in `useMemo` or `useState` for consistency.

**m-5: `LeftSidebar` and `SeatingPlanView` call `getUnassignedGuests` without memoization**

- **Location**: `src/components/organisms/LeftSidebar.tsx:49`, `src/pages/SeatingPlanView.tsx:53`
- **Issue**: `SeatingCanvas.tsx` wraps the same call in `useMemo`, but these two locations don't. Low impact but inconsistent.
- **Recommendation**: Add `useMemo` wrappers for consistency.

**m-6: `onDeleteTable` and `onSwapSeats` declared in `SeatingCanvas` Props but never destructured or used**

- **Location**: `src/components/organisms/SeatingCanvas.tsx:33,36-42`
- **Issue**: Pre-existing — these props are accepted but not used within the component. `SeatingPlanView` passes them unnecessarily.
- **Recommendation**: Remove from Props interface and stop passing from `SeatingPlanView`. Follow-up cleanup.

### INFO

**I-1: All 10 tasks completed — all 20 proposed changes addressed**
The only deliberately deferred item is Proposed Change #10 (reactive store pattern), well-documented with rationale in the spec.

**I-2: App.tsx reduction: 332 lines → 17 lines**
The god component was successfully decomposed into `GuestListView` (157 lines), `SeatingPlanView` (122 lines), plus extracted hooks (`useGuestStats`, `useDragEndHandler`) and utilities (`guest-utils`, `canvas-utils`, `storage-utils`, `outlet-context`).

**I-3: Route architecture follows react-router v7 layout route pattern correctly**
`GuestListView` acts as a layout route providing `OutletContext` to child form routes. `SeatingPlanView` is a standalone sibling route. `App` is a thin layout shell.

**I-4: CSS token consolidation is clean**
`:root` defines hex values once. `@theme` references them via `var(--nc-*)`. Both utility classes and `@layer components` classes resolve correctly.

**I-5: `TablePropertiesForm` with `key` prop is idiomatic React**
Cleanly replaces the error-prone `prevTableId` tracking pattern per React docs recommendation.

**I-6: Bundle size unchanged (551 kB)**
Expected for a structural refactor with no feature changes.

**I-7: Dead file cleanup verified**
`NavLink.tsx`, `SearchInput.tsx`, `App.css`, `react.svg`, `vite.svg` all confirmed deleted. No references to `mock-guests` type imports, `prevTableId`, or `searchQuery` remain anywhere.

**I-8: Type re-exports properly removed**
`guest-store.ts` no longer re-exports `Guest`/`GuestStatus`. `table-store.ts` no longer re-exports `FloorTable`/`TableShape`/`SeatAssignment`. All consumers import from type files directly.

---

## Acceptance Criteria Verification

| Task | Criteria                                                                                                                                 | Status |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| T-01 | Guest types in `guest-types.ts`, dead code removed from `mock-guests.ts`, `screenToCanvas` in `canvas-utils.ts`, type re-exports removed | PASS   |
| T-02 | Dead files deleted, `searchQuery` prop removed                                                                                           | PASS   |
| T-03 | `OutletContext` shared, `getUnassignedGuests` utility, `btn-destructive` CSS class                                                       | PASS   |
| T-04 | `TablePropertiesForm` extracted, wrappers thinned, `prevTableId` eliminated                                                              | PASS   |
| T-05 | `GuestDetailPanel` unified markup, `GuestRow` default export                                                                             | PASS   |
| T-06 | `createStorage` utility, stores refactored, magic numbers extracted                                                                      | PASS   |
| T-07 | `useEffect` for location state, `useGuestStats` hook, `handleGuestClick` rename, `totalSeats` fix                                        | PASS   |
| T-08 | `useDragEndHandler` hook extracted                                                                                                       | PASS   |
| T-09 | CSS tokens consolidated (`:root` → `@theme` via `var()`)                                                                                 | PASS   |
| T-10 | `GuestListView` + `SeatingPlanView` extracted, `App.tsx` thin shell, routes updated                                                      | PASS   |

---

## Verdict: **APPROVED**

## Summary

The refactoring is complete and high quality. All 10 tasks are done, the build passes, dead code has been fully cleaned up, and the architecture is significantly improved.

- The god component (`App.tsx`) has been decomposed from 332 lines to 17 lines.
- Route architecture follows react-router v7 layout patterns correctly.
- All dead files, dead functions, and dead imports have been removed.
- CSS tokens are consolidated. Shared utilities are well-factored.
- The only MAJOR issue from iteration 1 (M-1: dead statistics functions in `guest-store.ts`) has been fixed — verified the file is now 50 lines with only CRUD operations.

Remaining minor findings (m-0 through m-6) are low-impact code style observations suitable for follow-up work, not blockers.
