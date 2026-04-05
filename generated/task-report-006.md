# Task Report — TASK-006: Wire up overlay lifecycle in SeatingPlanView

## Status: COMPLETE

## Files Modified

- `src/pages/SeatingPlanView.tsx`

## Implementation Summary

Updated `SeatingPlanView` to integrate the `useOverlayPanel` hook for managing the desktop `CanvasPropertiesPanel` lifecycle with enter/exit animations.

### Changes made:

1. **Imports added** (lines 1, 6, 10):
   - `useRef` from React
   - `FloorTable` type from `../data/table-types`
   - `useOverlayPanel` from `../hooks/useOverlayPanel`

2. **Overlay panel hook wiring** (lines 87-92):
   - Computed `isPanelOpen` from `selectedCanvasTable !== null`
   - Called `useOverlayPanel(isPanelOpen, () => handleSelectTable(null))` to get `panelVisible`, `panelClosing`, and `panelAnimationEnd`

3. **Displayed table ref for exit animation** (lines 94-98):
   - Added `displayedTableRef` to retain the last selected table data during exit animation
   - `displayedTable` resolves to `selectedCanvasTable` when open, falls back to the ref during closing, and is `null` when not visible

4. **Desktop panel rendering** (lines 125-134):
   - Replaced `{selectedCanvasTable && (<CanvasPropertiesPanel .../>)}` with `{panelVisible && !isMobile && displayedTable && (<CanvasPropertiesPanel .../>)}`
   - Passes `isClosing={panelClosing}` and `onAnimationEnd={panelAnimationEnd}` to the panel
   - Uses `displayedTable` for `table`, `onUpdate`, and `onDelete` props so callbacks work during exit animation
   - Added `!isMobile` guard to prevent desktop panel from rendering on mobile during exit animation window

5. **Mobile behavior unchanged** (lines 137-180):
   - Mobile FABs and sheets still use `selectedCanvasTable` directly, not `displayedTable`

## Acceptance Criteria

- Selecting a table opens the properties overlay with slide-in animation — **MET** (via `useOverlayPanel` setting `visible: true` and `isClosing: false`, triggering `animate-slide-in-right`)
- Deselecting or pressing Escape triggers close with slide-out animation — **MET** (hook sets `isClosing: true`, panel renders with `animate-slide-out-right`; Escape handled by `useOverlayPanel`'s keydown listener)
- Panel unmounts after exit animation completes — **MET** (`onAnimationEnd` callback sets `visible: false`, `panelVisible` becomes `false`, conditional rendering removes the component)
- Canvas remains interactive (no backdrop blocking pointer events) — **MET** (panel is a fixed sidebar, no backdrop overlay added)
- Switching tables while panel is open swaps content without replaying enter animation — **MET** (`isOpen` remains `true` across table switches so `isClosing` stays `false`, `displayedTable` updates to new table)
- Mobile behavior unchanged — **MET** (mobile FABs and sheets use `selectedCanvasTable` directly; `!isMobile` guard prevents desktop panel from rendering on mobile)

## Verification

- `npx tsc --noEmit` — zero errors
