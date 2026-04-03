# Codebase Context Updates: Mobile Canvas

**Date**: 2026-04-03
**Spec**: `spec/mobile-canvas.md`

---

## Changes to Apply to `generated/codebase-context.md`

### 1. Update SeatingCanvas Description

**Section**: Canvas-Specific Architecture > SeatingCanvas Component

**Old**:

> **Mobile placeholder** (lines 176-181): `<div className="md:hidden ...">CANVAS_EDITOR // DESKTOP_REQUIRED</div>`
> **Desktop canvas** (lines 183-282): `<div className="hidden md:flex ...">` wrapping `TransformWrapper` + `TransformComponent` + tables + toolbar + status bar + seat popover

**New**:

> **Single canvas** (lines 178-304): `<div className="flex flex-1 ...">` renders on both mobile and desktop. No placeholder. `TransformWrapper` config is conditional on `isMobile` — mobile enables pinch zoom (0.5x–3x) and always-on panning; desktop keeps zoom locked at 1x with panning gated on pan tool.
> **Mobile toolbar** (line 271): `md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-30`
> **Desktop toolbar** (line 276): `hidden md:block absolute top-4 left-4 z-10`
> **Status bar** (line 281-283): Passes dynamic `zoom` on mobile, `undefined` on desktop.

### 2. Update CanvasTable Description

**Section**: Canvas-Specific Architecture > CanvasTable Component

**Old**:

> **No touch handlers**: Only `onMouseDown` and `onClick` (stopPropagation) are wired

**New**:

> **Touch handlers for mobile**: `onTouchStart`, `onTouchMove`, `onTouchEnd` wired at root div (lines 188-205). Long-press (300ms via `useLongPress` hook) initiates drag mode on selected tables with select tool active. Touch drag deltas sent to parent via `onTableTouchDrag` callback. Seat DnD (`useDraggable`) disabled on mobile.
> **New props**: `isMobile?: boolean`, `activeTool?: string`, `onTableTouchDrag?: (tableId, deltaX, deltaY) => void`

### 3. Update CanvasStatusBar Description

**Section**: Canvas-Specific Architecture > CanvasStatusBar Component

**Old**:

> **Stateless, no props**: Renders hard-coded "ZOOM: 100%" and "LAYER: FLOOR_PLAN_MAIN"
> Needs `zoom` prop added for mobile dynamic zoom display

**New**:

> **Props**: `{ zoom?: number }` — scale factor (e.g., 1.5 for 150%). Defaults to 1 when omitted (backward compatible). Renders `ZOOM: {Math.round((zoom ?? 1) * 100)}%` dynamically.

### 4. Update SeatAssignmentPopover Description

**Section**: Canvas-Specific Architecture > SeatAssignmentPopover

**Old**:

> Close-on-outside-click via `document.addEventListener('mousedown', ...)` in `useEffect`
> **Note**: Uses `mousedown` listener, not `pointerdown` — may need update for mobile touch events

**New**:

> Close-on-outside-click via `document.addEventListener('mousedown', ...)` AND `document.addEventListener('touchstart', ...)` in `useEffect`. Handles both mouse and touch for cross-device support.

### 5. Add New Components to File Structure

**Section**: Current File Structure > `src/components/organisms/`

Add:

```
├── MobilePropertiesSheet.tsx  (bottom sheet: edit selected table on mobile, z-50, max-h-[60vh])
├── MobileGuestsSheet.tsx      (bottom sheet: read-only unassigned guest list, z-50, max-h-[60vh])
```

**Section**: Current File Structure > `src/hooks/`

Update:

```
├── hooks/
│   ├── useIsMobile.ts      (returns boolean, matchMedia max-width:767px, updates on resize)
│   ├── useLongPress.ts     (300ms threshold, returns onTouchStart/onTouchEnd/onTouchMove handlers)
│   └── useTableState.ts    (custom hook: table CRUD + selection + seat assignment state)
```

### 6. Update Z-Index Stacking Order

**Section**: Z-Index Stacking Order

Add rows:

```
| Mobile toolbar        | z-30    | `fixed bottom-20 left-1/2 -translate-x-1/2` |
| Mobile guests FAB     | z-30    | `fixed bottom-[140px] right-4`               |
| Bottom sheet backdrop  | z-40    | `fixed inset-0`                              |
| Bottom sheet content   | z-50    | `fixed bottom-0 left-0 right-0`              |
```

### 7. Update App.tsx Description

**Section**: App.tsx Canvas Integration

**Old**:

> FAB renders unconditionally on `!isChildRoute` — needs conditional hide on canvas view

**New**:

> Add guest FAB renders on `!isChildRoute && !isCanvasView` (hidden on canvas view).
> Mobile canvas view renders: `MobilePropertiesSheet` (when table selected), unassigned guests FAB (with badge count, hidden when count=0), `MobileGuestsSheet` (when FAB tapped).
> `useIsMobile()` hook used in App.tsx for conditional mobile component rendering.
> `showMobileGuests` state controls guests sheet visibility.

### 8. Update Prior Spec Decisions

**Section**: Prior Spec Decisions > Spec: Mobile Canvas

Update status from "Confirmed" to "Completed":

> ### Spec: Mobile Canvas — Status: Completed (2026-04-03)
