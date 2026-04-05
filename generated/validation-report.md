# Validation Report: Overlay Sidebar

## Metadata

- **Spec**: `spec/overlay-sidebar.md`
- **Iteration**: 2 of 2
- **Date**: 2026-04-04
- **Validator**: Validator Agent
- **Build**: `tsc -b` PASS, ESLint PASS (zero errors)

## Files Reviewed

| File                                                 | Lines | Status   |
| ---------------------------------------------------- | ----- | -------- |
| `src/pages/GuestListView.tsx`                        | 193   | MODIFIED |
| `src/pages/SeatingPlanView.tsx`                      | 195   | MODIFIED |
| `src/hooks/useOverlayPanel.ts`                       | 49    | NEW      |
| `src/components/organisms/GuestDetailPanel.tsx`      | 160   | MODIFIED |
| `src/components/organisms/CanvasPropertiesPanel.tsx` | 57    | MODIFIED |
| `src/index.css`                                      | 478   | MODIFIED |

## Automated Checks

| Check    | Result             |
| -------- | ------------------ |
| `tsc -b` | PASS (zero errors) |
| ESLint   | PASS (zero errors) |

---

## Iteration 1 Findings — Re-review

### CRITICAL-1: useRef read/write during render

**Status**: RESOLVED

Both views previously used `useRef` to track the displayed entity during exit animation, reading `ref.current` during render (a React Compiler violation).

**Fix verified**:

- **GuestListView.tsx** (lines 110-114): Replaced with `useState<Guest | null>` for `displayedGuest`. The pattern `if (selectedGuest && selectedGuest !== displayedGuest) { setDisplayedGuest(selectedGuest) }` is the React-recommended "adjusting state during render" approach. No ref reads during render.
- **SeatingPlanView.tsx** (lines 102-108): Identical pattern with `useState<FloorTable | null>` for `displayedTable`. No ref reads during render.
- **useOverlayPanel.ts** (lines 13-26): Already used `useState` for `prevIsOpen` tracking — confirmed clean, no ref reads.

No `useRef` is imported or used in any of the reviewed files. CRITICAL-1 is fully resolved.

### MAJOR-1: Unstable onClose callback

**Status**: RESOLVED

Both views previously passed inline arrow functions as `onClose` to `useOverlayPanel`, causing the Escape key `useEffect` to re-attach on every render.

**Fix verified**:

- **GuestListView.tsx** (line 100): `const handleClosePanel = useCallback(() => setSelectedGuestId(null), [])` — empty deps since `setSelectedGuestId` is a stable state setter. Passed to both `useOverlayPanel` (line 106) and `GuestDetailPanel` (line 181). Stable reference.
- **SeatingPlanView.tsx** (lines 89-92): `const handleClosePanel = useCallback(() => handleSelectTable(null), [handleSelectTable])` — `handleSelectTable` is itself wrapped in `useCallback` (lines 76-82) with `[setSelectedCanvasTableId]` dep (stable setter). So `handleClosePanel` is stable. Passed to `useOverlayPanel` (line 98) and `CanvasPropertiesPanel` (line 140). Stable reference.
- **useOverlayPanel.ts** (line 46): The `useEffect` for Escape key has `[visible, onClose]` deps — both now stable, so the effect won't needlessly re-run.

MAJOR-1 is fully resolved.

---

## Verification: No Accidental Modifications to Other Files

| File                                                 | Status                                              |
| ---------------------------------------------------- | --------------------------------------------------- |
| `src/hooks/useOverlayPanel.ts`                       | Unchanged from iteration 1 — correct implementation |
| `src/components/organisms/GuestDetailPanel.tsx`      | Unchanged from iteration 1 — correct implementation |
| `src/components/organisms/CanvasPropertiesPanel.tsx` | Unchanged from iteration 1 — correct implementation |
| `src/index.css`                                      | Unchanged from iteration 1 — correct implementation |

---

## New Issues Introduced by Fixes

None found. The fixes are minimal and surgical:

- Replacing `useRef<T>(null)` + `ref.current` with `useState<T>(null)` + conditional `setState` in render is a direct 1:1 pattern swap.
- Wrapping inline arrows in `useCallback` is standard React practice.
- No new imports, no structural changes, no logic alterations.

**Minor observation** (non-blocking): In both views, the state-during-render comparison uses reference equality (`selectedGuest !== displayedGuest`, `selectedCanvasTable !== displayedTable`). If the parent data arrays are rebuilt with new object references (e.g., after `setGuests(getGuests())`), `setDisplayedGuest` / `setDisplayedTable` will fire an extra state update when the selected entity is truthy. This is functionally harmless — React batches the update and the rendered output is identical — but could be optimized with an ID comparison in a future pass.

---

## Acceptance Criteria Checklist

| AC   | Description                                       | Status | Notes                                                                                                                                  |
| ---- | ------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| AC-1 | GuestDetailPanel overlays content on desktop      | PASS   | `fixed` positioning, `md:z-40`, `md:w-[320px]`, main content does not shift                                                            |
| AC-2 | CanvasPropertiesPanel overlays content on desktop | PASS   | `fixed` positioning, `z-40`, `w-[320px]`, canvas does not resize                                                                       |
| AC-3 | Slide-in/slide-out animation                      | PASS   | `animate-slide-in-right` (200ms ease-out), `animate-slide-out-right` (150ms ease-in) via `@keyframes` in index.css                     |
| AC-4 | Semi-transparent backdrop (GuestDetailPanel only) | PASS   | Backdrop div with `bg-black/20`, `onClick={onClose}`, `hidden md:block`                                                                |
| AC-5 | CanvasPropertiesPanel — no backdrop               | PASS   | No backdrop element, `shadow-xl` provides visual separation                                                                            |
| AC-6 | Mobile behavior unchanged                         | PASS   | GuestDetailPanel: `fixed inset-0 z-50` preserved. CanvasPropertiesPanel: `hidden md:flex` preserved, mobile uses MobilePropertiesSheet |
| AC-7 | Panel width unchanged (320px)                     | PASS   | Both panels: `w-[320px]`                                                                                                               |
| AC-8 | Escape key closes panel                           | PASS   | `useOverlayPanel` attaches `keydown` listener when `visible`, calls stable `onClose`                                                   |

---

## Verdict: APPROVED

Both issues from iteration 1 have been properly resolved:

- **CRITICAL-1** (useRef read/write during render): Replaced with `useState`-based "adjusting state during render" pattern in both views. No ref reads during render anywhere.
- **MAJOR-1** (unstable onClose callback): Both views now wrap `onClose` in `useCallback` with stable dependencies.

No new CRITICAL, MAJOR, or MINOR issues were introduced by the fixes. All 8 acceptance criteria pass. The build and lint checks are clean.
