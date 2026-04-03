# Spec: Mobile Canvas

## Metadata

- **Slug**: `mobile-canvas`
- **Date**: 2026-04-03
- **Status**: Completed
- **Author**: User
- **Related specs**: [spec/seating-canvas.md](./seating-canvas.md), [spec/nought-cobalt-design-system.md](./nought-cobalt-design-system.md), [spec/sidebar-navigation.md](./sidebar-navigation.md)

## Description

Replace the mobile placeholder ("CANVAS_EDITOR // DESKTOP_REQUIRED") with a fully functional mobile canvas. On mobile (<768px), the seating plan canvas must provide the same core capabilities as on desktop: pan, zoom, add/drag/rotate tables, assign guests to seats, swap seats, and edit/delete tables — adapted for touch interactions and a single-column layout.

### Core Behaviors

- **Touch panning**: Single-finger drag on the canvas background pans the viewport (replaces mouse-based pan tool).
- **Pinch-to-zoom**: Two-finger pinch gesture zooms the canvas in and out (replaces the fixed 100% zoom on desktop).
- **Tap to select**: Tapping a table selects it (replaces mouse click).
- **Touch drag to reposition**: Long-press + drag on a selected table repositions it (replaces mouse drag in select mode).
- **Tap seat**: Tapping a seat opens the assignment popover (replaces mouse click).
- **Guest assignment**: Guests are assigned via the seat popover — the same click-to-assign mechanism as desktop. The draggable guest list from the desktop sidebar is NOT available on mobile (no sidebar); instead, guests are assigned exclusively via the seat tap popover.
- **Seat swapping**: Not available via drag on mobile. Users can unassign from one seat and reassign to another via the popover. Direct drag-based seat swapping is out of scope for mobile v1.
- **Properties panel**: Opens as a bottom sheet overlay when a table is selected, replacing the desktop right sidebar.
- **Toolbar**: Compact floating toolbar with the same 4 tools, repositioned for thumb reach at the bottom of the screen.
- **Add tables**: The "add circle" / "add rectangle" tools work via tap-to-place on mobile, same as desktop click-to-place.
- **Unassigned guest list**: Accessible via a bottom sheet triggered by a floating action button, since the sidebar is hidden on mobile.

## User Stories

1. As a **wedding planner on a phone**, I want to pan the canvas by dragging with one finger so that I can navigate the floor plan on a small screen.
2. As a **wedding planner on a phone**, I want to pinch-to-zoom the canvas so that I can see the full layout or zoom into specific tables.
3. As a **wedding planner on a phone**, I want to tap a table to select it and view its properties so that I can edit it without a mouse.
4. As a **wedding planner on a phone**, I want to long-press and drag a table to reposition it so that I can rearrange the layout by touch.
5. As a **wedding planner on a phone**, I want to tap a seat to assign or unassign a guest so that I can manage seating from my phone.
6. As a **wedding planner on a phone**, I want to add tables using the toolbar tools so that I can build the layout on mobile.
7. As a **wedding planner on a phone**, I want to edit table properties (label, shape, seat count, rotation) in a bottom sheet so that I don't need a desktop sidebar.
8. As a **wedding planner on a phone**, I want to see my unassigned guests in an accessible list so that I know who still needs seating.
9. As a **wedding planner on a phone**, I want my canvas changes to persist so that I can switch between phone and desktop seamlessly.

## Acceptance Criteria

### Mobile Canvas Rendering

1. GIVEN the app is loaded at `/seating-plan` on a mobile device (<768px) WHEN the page renders THEN the main content area displays the interactive canvas with the dot-grid background, NOT the "CANVAS_EDITOR // DESKTOP_REQUIRED" placeholder.

2. GIVEN the mobile canvas is displayed WHEN no tables have been added THEN the canvas shows only the dot-grid background, the mobile toolbar at the bottom, and the unassigned guests FAB.

3. GIVEN the mobile canvas is displayed WHEN tables exist THEN all tables render identically to desktop (same shapes, badges, labels, seat indicators, guest initials).

### Touch Panning

4. GIVEN the mobile canvas is displayed WHEN the user drags with one finger on the canvas background (not on a table) THEN the viewport pans in the direction of the drag.

5. GIVEN the user is panning WHEN the user lifts their finger THEN the canvas stays at the new pan position (no rubber-band snap-back unless at boundaries).

### Pinch-to-Zoom

6. GIVEN the mobile canvas is displayed WHEN the user performs a two-finger pinch gesture THEN the canvas zooms in or out centered on the pinch midpoint.

7. GIVEN the canvas is zoomed WHEN viewing the status bar THEN the zoom percentage updates to reflect the current zoom level (e.g., "ZOOM: 150%").

8. GIVEN the canvas is zoomed to min or max scale WHEN the user tries to zoom further THEN the zoom is clamped (min: 50%, max: 300%).

### Tap to Select Table

9. GIVEN the select tool is active WHEN the user taps a table THEN the table enters selected state (cobalt dashed border) and the properties bottom sheet opens.

10. GIVEN a table is selected WHEN the user taps on empty canvas space THEN the table is deselected, the dashed border is removed, and the bottom sheet closes.

### Touch Drag to Reposition Tables

11. GIVEN the select tool is active and a table is selected WHEN the user long-presses (300ms) on the selected table and drags THEN the table follows the finger and repositions on the canvas in real-time.

12. GIVEN the user is dragging a table WHEN the user lifts their finger THEN the table stays at the new position and the position is persisted to localStorage.

13. GIVEN the pan tool is active WHEN the user touches a table and drags THEN the canvas pans (the table does not move).

### Mobile Toolbar

14. GIVEN the mobile canvas is displayed WHEN viewing the toolbar THEN a compact floating toolbar appears at the bottom-center of the screen (above the bottom tab bar, `bottom-20`), with the same 4 tool buttons: select (default), pan, add circle, add rectangle.

15. GIVEN the toolbar is visible WHEN the user taps a different tool THEN that tool becomes active (cobalt highlight) and the previous tool is deactivated.

### Adding Tables on Mobile

16. GIVEN the "add circle table" tool is active WHEN the user taps on the canvas THEN a new circular table is placed at the tap position with defaults (8 seats, auto-label, auto-badge) and the tool auto-reverts to select.

17. GIVEN the "add rectangle table" tool is active WHEN the user taps on the canvas THEN a new rectangular table is placed at the tap position with defaults and the tool auto-reverts to select.

### Mobile Properties Panel (Bottom Sheet)

18. GIVEN a table is selected on mobile WHEN the bottom sheet renders THEN it shows the same fields as the desktop properties panel: table label input, reference ID badge, shape toggle, seat count slider, rotation slider with preset buttons, and DELETE ENTITY button.

19. GIVEN the bottom sheet is open WHEN the user changes the label and the input blurs THEN the table label updates on the canvas in real-time (same live-update behavior as desktop).

20. GIVEN the bottom sheet is open WHEN the user changes the shape toggle THEN the table shape updates on the canvas immediately.

21. GIVEN the bottom sheet is open WHEN the user adjusts the seat count slider THEN the table seat count updates and the table auto-resizes on the canvas.

22. GIVEN the bottom sheet is open WHEN the user taps DELETE ENTITY THEN the table is removed from the canvas, the bottom sheet closes, and the deletion is persisted.

23. GIVEN the bottom sheet is open WHEN the user taps the close button (X) or swipes down THEN the bottom sheet closes and the table is deselected.

### Guest Assignment on Mobile

24. GIVEN a table is rendered on the mobile canvas WHEN the user taps on a seat indicator THEN a popover appears showing unassigned guests (empty seat) or the assigned guest with UNASSIGN button (occupied seat) — same behavior as desktop.

25. GIVEN the seat assignment popover is open on mobile WHEN the user taps a guest from the list THEN the guest is assigned to that seat, the seat shows initials, and the guest count updates.

26. GIVEN the seat assignment popover shows an occupied seat WHEN the user taps UNASSIGN THEN the guest is removed from the seat.

### Unassigned Guests Sheet

27. GIVEN the mobile canvas is displayed WHEN the user taps the unassigned guests FAB (floating action button at bottom-right) THEN a bottom sheet slides up showing the list of unassigned guests with their names and initials.

28. GIVEN the unassigned guests sheet is open WHEN all guests are assigned THEN the sheet shows "NO_UNASSIGNED_GUESTS // ALL_ALLOCATED" message.

29. GIVEN the unassigned guests sheet is open WHEN the user taps a guest in the list THEN nothing happens (the list is read-only on mobile — assignment is done via seat tap). The list is informational only.

### Data Persistence & Cross-Device

30. GIVEN tables have been edited on the mobile canvas WHEN the page is reloaded THEN all data is restored from localStorage (same persistence as desktop).

31. GIVEN the user edits the canvas on desktop WHEN they open the same browser on mobile THEN the mobile canvas reflects the same data (shared localStorage).

### Status Bar

32. GIVEN the mobile canvas is displayed WHEN viewing the top area THEN a compact status bar shows the current zoom level and layer name, positioned at top-right.

## Scope

### In Scope

- Remove the "CANVAS_EDITOR // DESKTOP_REQUIRED" mobile placeholder
- Render the full interactive canvas on mobile (<768px)
- Touch panning via single-finger drag on canvas background
- Pinch-to-zoom via `react-zoom-pan-pinch` (enable zoom on mobile, min 0.5x, max 3x)
- Tap-to-select tables
- Long-press + drag to reposition tables (select tool only)
- Tap-to-place tables with add-circle/add-rectangle tools
- Mobile floating toolbar (bottom-center, same 4 tools)
- Mobile properties bottom sheet (replaces desktop right sidebar)
- Seat assignment via tap + popover (same mechanism as desktop)
- Unassigned guests FAB + bottom sheet (read-only list)
- Mobile status bar with live zoom percentage
- All existing localStorage persistence
- Canvas cursor changes → no-op on mobile (touch doesn't have cursors)

### Out of Scope

- Drag-and-drop guest assignment from a list onto seats (no sidebar on mobile, DnD via touch is complex — use popover instead)
- Seat swapping via drag on mobile (use unassign + reassign workflow instead)
- Desktop left sidebar rendering on mobile (already hidden via `hidden md:flex`)
- Desktop properties panel rendering on mobile (already hidden via `hidden md:flex`)
- Gesture-based table rotation (use the rotation slider in the bottom sheet instead)
- Multi-touch table manipulation (e.g., two-finger rotate)
- Offline/PWA support
- Mobile-specific table sizing (tables use the same sizing formulas as desktop)

## Edge Cases

1. **Disambiguating pan vs. table drag**: Single-finger drag on canvas background = pan. Long-press (300ms) on a selected table + drag = reposition. A quick tap on a table = select (not drag). This prevents accidental table moves while panning.

2. **Pinch-to-zoom while table selected**: If the user pinches while a table is selected, the zoom occurs and the table remains selected. The bottom sheet stays open.

3. **Bottom sheet + popover conflict**: If the properties bottom sheet is open and the user taps a seat, the seat popover opens above the bottom sheet (higher z-index). The bottom sheet remains visible beneath.

4. **Bottom sheet scroll vs. canvas pan**: Touch events on the bottom sheet scroll the sheet content. Touch events outside the bottom sheet interact with the canvas (pan/select/drag).

5. **Popover positioning on mobile**: The seat assignment popover must not overflow off-screen. On mobile, position it centered horizontally in the viewport and vertically near the seat, with viewport boundary clamping.

6. **Table at canvas edge after zoom**: If the user zooms out and tables are at extreme positions, the tables may appear very small. The minimum zoom (50%) keeps tables visible.

7. **Toolbar vs. bottom tab bar overlap**: The mobile toolbar floats at `bottom-20` (80px from bottom) to sit above the `BottomTabBar` which is fixed at `bottom-0`. No overlap occurs.

8. **Properties bottom sheet height**: The bottom sheet occupies at most 60% of the viewport height. If content overflows, it scrolls internally. The remaining 40% shows the canvas behind the sheet.

9. **Orientation change**: When the device rotates from portrait to landscape (or vice versa), the canvas and overlays adapt to the new viewport dimensions. No special handling needed — CSS layout and viewport units handle this naturally.

10. **No hover states on mobile**: Desktop hover effects (`hover:ring-2`, `hover:bg-surface-elevated`) have no effect on touch devices. This is acceptable — no changes needed since `hover:` media queries on mobile only fire on tap, which is fine.

11. **Unassigned guests FAB vs. existing FAB**: The existing "Add guest" FAB (`src/components/atoms/FAB.tsx`) is hidden when on the canvas view. On mobile canvas, a new FAB for unassigned guests is shown in its place.

## Design Decisions

### DD-M1: Touch Interaction Model

**Decision**: Mobile uses a simplified touch interaction model:

- **Single-finger drag on background**: Pans the canvas (always, regardless of active tool — `react-zoom-pan-pinch` handles this natively).
- **Pinch**: Zooms the canvas (`react-zoom-pan-pinch` handles this natively).
- **Tap on table**: Selects the table (all tools).
- **Long-press + drag on selected table**: Repositions the table (select tool only).
- **Tap on seat**: Opens assignment popover.
- **Tap on canvas (add tool active)**: Places a table.
- **Tap on empty canvas (select tool)**: Deselects current table.

The desktop "pan tool" is still available in the mobile toolbar but is less necessary since single-finger panning works by default on mobile (the `TransformWrapper` handles touch pan natively). The pan tool on mobile explicitly disables table interactions (long-press drag) for users who want a "safe pan" mode.

**Reasoning**: Touch devices don't have the cursor/pointer distinction that makes the desktop tool model necessary. On mobile, panning is the most common gesture, so it should be the default behavior without requiring a tool switch. Long-press for table drag prevents accidental repositioning during pans. This is a standard mobile pattern (e.g., Google Maps: drag to pan, long-press to drop a pin).

### DD-M2: Properties Bottom Sheet (Replaces Desktop Sidebar)

**Decision**: On mobile, the `CanvasPropertiesPanel` is NOT rendered. Instead, a new `MobilePropertiesSheet` component renders as a bottom sheet overlay. It contains the same fields (label, ID badge, shape toggle, seat slider, rotation slider + presets, delete button) but in a vertically stacked mobile-friendly layout. The sheet slides up from the bottom, occupies up to 60vh, has a drag handle at the top, and can be dismissed by tapping X, swiping down, or tapping outside (on the canvas).

**Reasoning**: The 320px fixed-width desktop sidebar doesn't fit on mobile screens. A bottom sheet is the standard mobile pattern for contextual panels (iOS action sheets, Android bottom sheets, Google Maps panels). It keeps the canvas visible above and is easy to dismiss.

### DD-M3: Unassigned Guests Access

**Decision**: On mobile, unassigned guests are accessed via a FAB (floating action button) positioned at `bottom-right`, above the toolbar. Tapping the FAB opens a bottom sheet showing the unassigned guests list. This list is read-only — guests are assigned via the seat tap popover, NOT by dragging from this list. The FAB shows a badge with the count of unassigned guests.

**Reasoning**: The desktop sidebar's draggable guest list relies on `@dnd-kit/react` drag-and-drop, which has poor UX on mobile touch (long-press to initiate drag conflicts with scroll, no visual affordance for drag handles on touch). The popover-based assignment (tap seat → select guest from dropdown) is the primary assignment mechanism on both desktop and mobile, so mobile users lose no core functionality.

### DD-M4: Long-Press Threshold for Table Drag

**Decision**: Table repositioning on mobile requires a long-press of 300ms before the drag begins. During the long-press, a subtle visual feedback (slight scale-up or highlight pulse) indicates the table is entering drag mode. If the user lifts their finger before 300ms, it's treated as a tap (select). Once the long-press triggers, subsequent finger movement drags the table.

**Reasoning**: Without a long-press gate, any touch on a table could initiate a drag, making it impossible to tap-to-select or pan across a table. The 300ms threshold is a standard mobile convention (Android's `ViewConfiguration.getLongPressTimeout()` is 500ms; iOS's is ~500ms; 300ms is snappier while still preventing accidental drags).

### DD-M5: Mobile Zoom Enable

**Decision**: On mobile, `react-zoom-pan-pinch` is configured with:

- `initialScale: 1`
- `minScale: 0.5`
- `maxScale: 3`
- `panning.disabled: false` (always enabled — single-finger panning works natively)
- `pinch.disabled: false` (pinch-to-zoom enabled)
- `wheel.disabled: true` (no mouse wheel on mobile)
- `doubleClick.disabled: true` (prevent accidental zoom on double-tap)

This differs from desktop where zoom is locked at 1.0. The zoom percentage in the status bar updates dynamically on mobile.

**Reasoning**: Mobile screens are small, so zoom is essential for viewing both the full layout (zoom out) and individual table details (zoom in). Enabling the full zoom range of `react-zoom-pan-pinch` on mobile is free — the library already supports pinch gestures natively.

### DD-M6: Toolbar Position on Mobile

**Decision**: The mobile toolbar is positioned at `fixed bottom-20 left-1/2 -translate-x-1/2 z-30` — horizontally centered, 80px from the bottom (above the `BottomTabBar`). It uses the same `CanvasToolbar` component but with a mobile-specific wrapper that changes positioning.

**Reasoning**: Bottom positioning is optimal for thumb reach on mobile. Centering keeps it accessible for both left and right hand use. The 80px offset (`bottom-20`) clears the `BottomTabBar` (which is `~56px` tall with padding).

### DD-M7: No DnD on Mobile

**Decision**: `@dnd-kit/react` drag-and-drop interactions (guest drag from sidebar, seat swapping) are disabled on mobile. The `DragDropProvider` still wraps the canvas content (for shared architecture), but:

- The sidebar with draggable guests is hidden on mobile (`hidden md:flex`).
- Seat swap drag is disabled on mobile — the `SeatSlot` draggable is not rendered or is disabled via a `disabled` prop when on mobile.
- Guest assignment on mobile uses only the tap-to-popover flow.

**Reasoning**: Touch-based drag-and-drop has fundamental UX problems: it conflicts with native scroll/pan, has no hover state for drop feedback, and requires long-press initiation which is slow and unintuitive for small targets like seat indicators (28px). The popover-based assignment provides the same functionality with a tap-friendly UX.

### DD-M8: Responsive Breakpoint Strategy

**Decision**: The mobile/desktop boundary remains at `md` (768px), consistent with all other components in the project. The canvas uses:

- `md:hidden` — shown on mobile only
- `hidden md:flex` — shown on desktop only

No intermediate breakpoints (sm, lg) are introduced. Tablets (768px+) get the desktop experience.

**Reasoning**: The project consistently uses `md` as the single responsive breakpoint. Adding intermediate breakpoints would break the convention and add complexity. Tablets at 768px+ have enough screen space for the desktop sidebar layout.

### DD-M9: Mobile Canvas Size

**Decision**: The mobile canvas inner area is the same 3000x2000px as desktop. The canvas is not resized for mobile — the user pans and zooms to navigate it.

**Reasoning**: Tables are placed at absolute pixel coordinates. Resizing the canvas for mobile would shift table positions. Using the same canvas size ensures cross-device consistency — a layout created on desktop looks identical on mobile.

### DD-M10: Detecting Mobile for Behavior Differences

**Decision**: Use the CSS breakpoint approach (not JS feature detection). Components render both mobile and desktop variants using `md:hidden` / `hidden md:flex`. For JavaScript behavior differences (e.g., enabling zoom, long-press threshold), use a `useIsMobile` hook that checks `window.matchMedia('(max-width: 767px)')` and updates on resize.

**Reasoning**: CSS media queries are the existing pattern in the project. A `useIsMobile` hook for JS-side behavior ensures the canvas component can conditionally configure `react-zoom-pan-pinch` and touch handlers without duplicating the entire component.

## UI/UX Details

### Mobile Canvas Layout

```
+----------------------------------+
| TOP NAV: PLANNER_V1.0            |
+----------------------------------+
|                                  |
|   ZOOM: 75%  LAYER: FLOOR_PLAN  |  <- status bar (top-right)
|                                  |
|   .  .  .  .  .  .  .  .  .     |
|   .  .  .  .  .  .  .  .  .     |
|   .     +--------T01-+  .  .    |  <- canvas with tables
|   .     |TABLE ALPHA |  .  .    |
|   .     | 0/8 Guests |  .  .    |
|   .     +--o--o--o---+  .  .    |
|   .  .  .  .  .  .  .  .  .     |
|   .  .  .  .  .  .  .  .  .     |
|                                  |
|                            [👤]  |  <- Unassigned guests FAB
|        [⬆][✋][⭕][⬜]           |  <- Toolbar (bottom center)
+----------------------------------+
| CANVAS  GUESTS  TOOLS  MORE     |  <- BottomTabBar
+----------------------------------+
```

### Mobile Properties Bottom Sheet

```
+----------------------------------+
|   (canvas visible above, dimmed) |
+----------------------------------+  <- sheet top edge (~40vh from top)
|          --- drag handle ---     |
|  PROPERTIES                 [X]  |
|  ____________________________    |
|                                  |
|  LABEL                           |
|  [TABLE ALPHA_______________]    |
|                                  |
|  REFERENCE_ID             T01    |
|                                  |
|  SHAPE                           |
|  [RECTANGULAR] [CIRCULAR]        |
|                                  |
|  SEAT_COUNT                  8   |
|  [--------o-----------------]    |
|                                  |
|  ROTATION                  45°   |
|  [-------o------------------]    |
|  [0°] [90°] [180°] [270°]       |
|                                  |
|  [ DELETE ENTITY ]               |
+----------------------------------+
| CANVAS  GUESTS  TOOLS  MORE     |
+----------------------------------+
```

### Unassigned Guests Bottom Sheet

```
+----------------------------------+
|   (canvas visible above)         |
+----------------------------------+
|          --- drag handle ---     |
|  UNASSIGNED_GUESTS (5)      [X]  |
|  ____________________________    |
|                                  |
|  ER  Elara Rivera                |
|  AV  Alexander Vance             |
|  MC  Marcus Chen                 |
|  SN  Sophia Nakamura             |
|  KW  Kai Westbrook               |
|                                  |
+----------------------------------+
| CANVAS  GUESTS  TOOLS  MORE     |
+----------------------------------+
```

### Mobile Toolbar Design

Same visual design as desktop `CanvasToolbar` component. The toolbar renders with:

- Container: `bg-surface border border-border rounded p-1 flex gap-1`
- Buttons: same active/inactive styling
- Position: `fixed bottom-20 left-1/2 -translate-x-1/2 z-30`

### Mobile Seat Assignment Popover

Same `SeatAssignmentPopover` component. On mobile:

- Position clamping ensures the popover stays within the viewport
- Width remains `w-56` (224px), centered horizontally on the viewport if the seat is near an edge
- The popover's `fixed z-50` positioning already works on mobile

### Long-Press Visual Feedback

When a user initiates a long-press on a selected table:

- After ~150ms: table body gets a subtle `ring-2 ring-primary/30` glow
- After 300ms: the table enters drag mode, the glow intensifies to `ring-2 ring-primary`
- While dragging: the table follows the finger with a slight `shadow-lg` elevation effect

### Unassigned Guests FAB

```
[👤 5]  <- circle button, bottom-right, above toolbar
```

- Position: `fixed bottom-[140px] right-4 z-30` (above toolbar, below status bar)
- Size: `w-14 h-14 rounded-full bg-primary text-primary-foreground`
- Icon: `LuUsers` from `react-icons/lu`
- Badge: `absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center` showing unassigned count
- Hidden when count is 0

## Data Requirements

No new data models. The mobile canvas uses the same `FloorTable`, `SeatAssignment`, and `Guest` interfaces. The same `table-store.ts` and `guest-store.ts` localStorage APIs are used. No new storage keys are needed.

### New Hook: `useIsMobile`

```typescript
// src/hooks/useIsMobile.ts
import { useState, useEffect } from 'react'

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 767px)').matches,
  )

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    function handleChange(e: MediaQueryListEvent) {
      setIsMobile(e.matches)
    }
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return isMobile
}
```

### New Hook: `useLongPress`

```typescript
// src/hooks/useLongPress.ts
import { useRef, useCallback } from 'react'

interface UseLongPressOptions {
  threshold?: number // ms, default 300
  onLongPress: () => void
  onTap?: () => void
}

export function useLongPress({
  threshold = 300,
  onLongPress,
  onTap,
}: UseLongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLongPress = useRef(false)

  const onTouchStart = useCallback(() => {
    isLongPress.current = false
    timerRef.current = setTimeout(() => {
      isLongPress.current = true
      onLongPress()
    }, threshold)
  }, [threshold, onLongPress])

  const onTouchEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (!isLongPress.current) {
      onTap?.()
    }
  }, [onTap])

  const onTouchMove = useCallback(() => {
    // Cancel long-press if finger moves significantly before threshold
    if (timerRef.current && !isLongPress.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  return { onTouchStart, onTouchEnd, onTouchMove }
}
```

## Technical Plan

### Impact Analysis

#### Affected Areas

| Area                    | Files                                                | Type of Change                                                                                                            |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Mobile detection hook   | `src/hooks/useIsMobile.ts`                           | **New** — `useIsMobile()` hook using `matchMedia`                                                                         |
| Long-press hook         | `src/hooks/useLongPress.ts`                          | **New** — `useLongPress()` hook for table drag initiation                                                                 |
| Mobile properties sheet | `src/components/organisms/MobilePropertiesSheet.tsx` | **New** — bottom sheet with same fields as `CanvasPropertiesPanel`                                                        |
| Mobile guests sheet     | `src/components/organisms/MobileGuestsSheet.tsx`     | **New** — bottom sheet for unassigned guests list                                                                         |
| Seating canvas          | `src/components/organisms/SeatingCanvas.tsx`         | **Modified** — replace mobile placeholder with mobile canvas, add touch handlers, conditional zoom config                 |
| Canvas properties panel | `src/components/organisms/CanvasPropertiesPanel.tsx` | **Unmodified** — desktop-only, already `hidden md:flex` on `:47`                                                          |
| Canvas table            | `src/components/molecules/CanvasTable.tsx`           | **Modified** — add touch event handlers (long-press + drag) for mobile table repositioning, disable DnD on mobile         |
| App root                | `src/App.tsx`                                        | **Modified** — render `MobilePropertiesSheet` and `MobileGuestsSheet` for mobile canvas, hide existing FAB on canvas view |
| Canvas status bar       | `src/components/atoms/CanvasStatusBar.tsx`           | **Modified** — accept `zoom` prop to display dynamic zoom percentage                                                      |
| Seat assignment popover | `src/components/molecules/SeatAssignmentPopover.tsx` | **Modified** — add `touchstart` listener alongside `mousedown` for close-on-outside-click on mobile                       |

#### Integration Points

1. **`SeatingCanvas` ↔ `react-zoom-pan-pinch`**: The `TransformWrapper` at `:185-194` currently has zoom locked at 1.0 and panning gated on `activeTool === 'pan'`. On mobile, reconfigure to `minScale: 0.5`, `maxScale: 3`, panning always enabled, pinch enabled. Use `onTransformed` callback (currently unused — see codebase-context line 312) to track zoom level for status bar.
2. **`SeatingCanvas` → `MobilePropertiesSheet`**: The `selectedCanvasTable` data and `handleUpdateTable`/`handleDeleteTable` callbacks already exist in `App.tsx:116-121`. Pass them to the new sheet in `canvasContent` (`:182-213`).
3. **`SeatingCanvas` → `MobileGuestsSheet`**: The `unassignedGuests` are already computed in `SeatingCanvas:77-82`. The same computation will be duplicated in `App.tsx` for the FAB badge count and sheet data.
4. **`CanvasTable` ↔ `useLongPress`**: The table's root `<div>` at `CanvasTable:130-141` currently only has `onMouseDown` and `onClick`. Touch handlers will be added alongside. The `SeatSlot` sub-component at `:30-86` uses `useDraggable` at `:55-64` which needs `disabled: isMobile` passed through.
5. **`App.tsx` → Mobile canvas overlays**: The `canvasContent` JSX block at `:182-213` renders `LeftSidebar + SeatingCanvas + CanvasPropertiesPanel`. Mobile sheets and FAB will be added inside this block. The `CanvasPropertiesPanel` at `:204-211` already has `hidden md:flex` so it auto-hides on mobile.
6. **`CanvasStatusBar` ← `SeatingCanvas`**: Currently stateless with no props (`:1-11`). Will accept optional `zoom` prop and display computed percentage.
7. **`SeatAssignmentPopover` close handler**: Currently at `:28-39`, uses `document.addEventListener('mousedown', ...)`. Must also listen for `touchstart` events for mobile close-on-outside-click behavior.

#### Risk Areas

- **Pan vs. table drag conflict**: The `TransformWrapper` wraps all content including tables. On mobile with panning always enabled, single-finger touch on a table element will be intercepted by the pan handler before reaching the table's touch handlers. **Mitigation**: Use `e.stopPropagation()` on `onTouchStart` at the table root div (`:130-141` in `CanvasTable.tsx`) to prevent the pan library from capturing table touches when in select mode. Additionally, configure `TransformWrapper` with `panning.excluded` CSS class list so table elements are excluded from pan gesture capture.
- **Pinch-to-zoom + table interaction**: During a two-finger pinch, if one finger is on a table, the zoom should still occur (not trigger table selection). `react-zoom-pan-pinch` handles multi-touch natively — the `onTouchStart` long-press timer in `CanvasTable` should be cancelled when a second finger is detected (check `e.touches.length > 1` in `onTouchMove`).
- **Bottom sheet gesture conflicts**: The bottom sheet overlay has `fixed inset-0 z-50` which sits above the canvas. Touch events on the overlay/sheet are captured by the sheet DOM, not the canvas underneath. The sheet's `onTouchMove` should call `e.stopPropagation()` to prevent canvas pan.
- **Popover z-index stacking**: Seat popover (`fixed z-50` at `SeatAssignmentPopover:63`), bottom sheet (`fixed z-50`), toolbar (`z-30`), `BottomTabBar` (`fixed z-40` at `BottomTabBar:11`). When both sheet and popover are open, the popover must render after the sheet in DOM order (both z-50, but DOM order wins for same z-index).
- **`@dnd-kit/react` on mobile**: The `DragDropProvider` wraps canvas content at `App.tsx:273-275`. The `useDraggable` in `SeatSlot` at `CanvasTable:55-64` has a `disabled` field — extend it with `|| isMobile`. The `useDroppable` calls at `:50-53` and `:118-121` are passive (accept drops) and harmless when no drags occur — no change needed.

### Task Breakdown

#### TASK-M01: Utility Hooks

**Description**: Create the `useIsMobile` and `useLongPress` hooks in `src/hooks/`.

**Affected files**:

- `src/hooks/useIsMobile.ts` (**new**)
- `src/hooks/useLongPress.ts` (**new**)

**Project context**:

- Existing hooks directory has only `src/hooks/useTableState.ts`. Follow same conventions: named export (`export function useIsMobile`), `import type` for type-only imports per `verbatimModuleSyntax`.
- No semicolons, single quotes, trailing commas (Prettier: `semi: false`, `singleQuote: true`, `trailingComma: "all"`).
- TypeScript strict mode enabled. `noUnusedLocals` and `noUnusedParameters` enforced.

**Implementation instructions**:

1. Create `src/hooks/useIsMobile.ts`:

   ```typescript
   import { useState, useEffect } from 'react'

   export function useIsMobile(): boolean {
     const [isMobile, setIsMobile] = useState(
       () => window.matchMedia('(max-width: 767px)').matches,
     )

     useEffect(() => {
       const mql = window.matchMedia('(max-width: 767px)')
       function handleChange(e: MediaQueryListEvent) {
         setIsMobile(e.matches)
       }
       mql.addEventListener('change', handleChange)
       return () => mql.removeEventListener('change', handleChange)
     }, [])

     return isMobile
   }
   ```

   Note: The `useEffect` here sets state only in response to an external event (media query change), NOT synchronous side-effect during render, so this does NOT violate G-16/G-25.

2. Create `src/hooks/useLongPress.ts`:

   ```typescript
   import { useRef, useCallback } from 'react'

   interface UseLongPressOptions {
     threshold?: number // ms, default 300
     onLongPress: () => void
     onTap?: () => void
   }

   export function useLongPress({
     threshold = 300,
     onLongPress,
     onTap,
   }: UseLongPressOptions) {
     const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
     const isLongPress = useRef(false)

     const onTouchStart = useCallback(() => {
       isLongPress.current = false
       timerRef.current = setTimeout(() => {
         isLongPress.current = true
         onLongPress()
       }, threshold)
     }, [threshold, onLongPress])

     const onTouchEnd = useCallback(() => {
       if (timerRef.current) {
         clearTimeout(timerRef.current)
         timerRef.current = null
       }
       if (!isLongPress.current) {
         onTap?.()
       }
     }, [onTap])

     const onTouchMove = useCallback(() => {
       // Cancel long-press if finger moves before threshold
       if (timerRef.current && !isLongPress.current) {
         clearTimeout(timerRef.current)
         timerRef.current = null
       }
     }, [])

     return { onTouchStart, onTouchEnd, onTouchMove }
   }
   ```

**Dependencies**: None (independent)

**Acceptance criteria**:

- Both files compile with `tsc -b`
- `useIsMobile()` returns `true` when viewport < 768px, `false` otherwise, updates on resize crossing the 768px boundary
- `useLongPress` calls `onLongPress` after 300ms of touch hold, calls `onTap` on quick tap release, cancels on touch move before threshold
- No lint errors from `npm run lint`

---

#### TASK-M02: Canvas Status Bar Update

**Description**: Update `CanvasStatusBar` to accept an optional `zoom` prop for dynamic zoom display. Currently the component (11 lines, no props) hard-codes "ZOOM: 100%".

**Affected files**:

- `src/components/atoms/CanvasStatusBar.tsx` (**modified** — all 11 lines)

**Project context**:

- Component currently at `src/components/atoms/CanvasStatusBar.tsx:1-11`. No Props interface exists — add one.
- The component uses `text-label text-foreground-muted tracking-wider` for typography.
- Convention: Props interface named `Props`, defined above the function.
- The hard-coded string `ZOOM: 100%` at `:4` must become dynamic.

**Implementation instructions**:

1. Add a `Props` interface above the function:

   ```typescript
   interface Props {
     zoom?: number // scale factor, e.g. 1.5 for 150%
   }
   ```

2. Update the function signature from `function CanvasStatusBar()` to `function CanvasStatusBar({ zoom }: Props)`.

3. Replace line 4's hard-coded `<span>ZOOM: 100%</span>` with:

   ```tsx
   <span>ZOOM: {Math.round((zoom ?? 1) * 100)}%</span>
   ```

4. No other changes. The component remains stateless. The `|` separator and `LAYER: FLOOR_PLAN_MAIN` span at `:5-6` stay unchanged.

**Dependencies**: None (independent)

**Acceptance criteria**:

- `<CanvasStatusBar />` (no props) still shows "ZOOM: 100%" — backward compatible with desktop usage at `SeatingCanvas:260`
- `<CanvasStatusBar zoom={1.5} />` shows "ZOOM: 150%"
- `<CanvasStatusBar zoom={0.5} />` shows "ZOOM: 50%"
- File compiles with `tsc -b`, no lint errors

---

#### TASK-M03: Mobile Bottom Sheet Components

**Description**: Create `MobilePropertiesSheet` and `MobileGuestsSheet` bottom sheet components for mobile canvas. These replace the desktop `CanvasPropertiesPanel` (right sidebar at `CanvasPropertiesPanel:47`, `hidden md:flex`) on mobile viewports.

**Affected files**:

- `src/components/organisms/MobilePropertiesSheet.tsx` (**new**)
- `src/components/organisms/MobileGuestsSheet.tsx` (**new**)

**Project context**:

- Follow existing component conventions: function declarations, default export, Props interface above function, no semicolons, single quotes.
- Reuse existing atoms: `ShapeToggle` (`src/components/atoms/ShapeToggle.tsx`), `IconButton` (`src/components/atoms/IconButton.tsx`), `Avatar` (`src/components/atoms/Avatar.tsx`).
- Reference `CanvasPropertiesPanel.tsx:19-161` for exact field layout and the "adjusting state during render" pattern for label local state (`:21-27`).
- Types: `FloorTable`, `TableShape` from `../../data/table-types`, `Guest` from `../../data/mock-guests`.
- Icons: `LuX` from `react-icons/lu` for close button. Use `size` prop for dimensions (G-22).
- CSS component classes: `.btn-ghost` (for DELETE ENTITY button), `.input` (for label input), `.badge` (for reference ID).
- Z-index context: BottomTabBar is `z-40`, toolbar is `z-30`. Bottom sheets must be `z-50` to appear above all canvas elements.

**Implementation instructions**:

**MobilePropertiesSheet.tsx**:

```typescript
interface Props {
  table: FloorTable
  onUpdate: (
    data: Partial<
      Pick<FloorTable, 'label' | 'shape' | 'seatCount' | 'rotation'>
    >,
  ) => void
  onDelete: () => void
  onClose: () => void
}
```

1. **Local label state with table switch detection** — same pattern as `CanvasPropertiesPanel:21-27`:

   ```typescript
   const [label, setLabel] = useState(table.label)
   const [prevTableId, setPrevTableId] = useState(table.id)
   if (table.id !== prevTableId) {
     setPrevTableId(table.id)
     setLabel(table.label)
   }
   ```

2. **Handler functions** — mirror `CanvasPropertiesPanel:29-44`:
   - `handleLabelChange(value: string)`: calls `setLabel(value)` and `onUpdate({ label: value })`
   - `handleShapeChange(shape: TableShape)`: calls `onUpdate({ shape })`
   - `handleSeatCountChange(seatCount: number)`: calls `onUpdate({ seatCount })`
   - `handleRotationChange(rotation: number)`: calls `onUpdate({ rotation })`

3. **Overlay backdrop**: `<div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} onTouchMove={(e) => e.stopPropagation()} />` — prevents canvas interaction when sheet is open. `onTouchMove` stopPropagation prevents canvas panning through the backdrop.

4. **Sheet container**: `<div className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl border-t border-border max-h-[60vh] overflow-y-auto" onTouchMove={(e) => e.stopPropagation()}>` — `onTouchMove` stopPropagation prevents pan-through.

5. **Drag handle**: `<div className="w-10 h-1 bg-gray-600 rounded-full mx-auto my-3" />`

6. **Header**: Same layout as `CanvasPropertiesPanel:49-56`:

   ```tsx
   <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
     <span className="text-label text-foreground-muted tracking-wider uppercase">
       PROPERTIES
     </span>
     <IconButton onClick={onClose} label="Close properties">
       <LuX size={20} />
     </IconButton>
   </div>
   ```

7. **Body fields** — same structure as `CanvasPropertiesPanel:58-148`, adapted for vertical mobile layout:
   - **INFORMATION section**: Label input (`.input w-full`) + Reference ID badge (`.badge`). Same as `:59-80`.
   - **CONFIGURATION section**: ShapeToggle, seat count slider (min 1, max 20, `accent-[var(--nc-primary)]`), rotation slider (min 0, max 359) + preset buttons (0°, 90°, 180°, 270°). Same as `:82-147`.

8. **DELETE ENTITY button** — same as `:151-158`:

   ```tsx
   <div className="px-4 py-4 border-t border-border">
     <button
       className="btn-ghost w-full text-foreground-muted"
       onClick={onDelete}
     >
       DELETE ENTITY
     </button>
   </div>
   ```

9. **Slide-in animation**: Add `transition-transform duration-300` to the sheet container. Use `useState`-based `isVisible` flag that transitions from `translate-y-full` to `translate-y-0` via `useEffect` on mount. Or keep it simple — render immediately without animation for v1 (the spec says "simple CSS transition", not mandatory).

**MobileGuestsSheet.tsx**:

```typescript
interface Props {
  guests: Guest[] // unassigned guests only
  onClose: () => void
}
```

1. Same overlay + sheet structure as `MobilePropertiesSheet`.

2. **Header**:

   ```tsx
   <span className="text-label text-foreground-muted tracking-wider uppercase">
     UNASSIGNED_GUESTS ({guests.length})
   </span>
   ```

3. **Guest list body**: Scrollable list of unassigned guests, each showing `Avatar` (size `sm`) + full name. Same layout pattern as `SeatAssignmentPopover:95-111` but read-only (no `onClick` on items):
   ```tsx
   <div className="px-4 pb-4">
     {guests.length > 0 ? (
       <div className="flex flex-col gap-1">
         {guests.map((guest) => (
           <div
             key={guest.id}
             className="flex items-center gap-2 px-2 py-1.5 rounded"
           >
             <Avatar
               firstName={guest.firstName}
               lastName={guest.lastName}
               size="sm"
             />
             <span className="text-body-sm text-foreground-heading">
               {guest.firstName} {guest.lastName}
             </span>
           </div>
         ))}
       </div>
     ) : (
       <p className="text-caption text-foreground-muted text-center py-4">
         NO_UNASSIGNED_GUESTS // ALL_ALLOCATED
       </p>
     )}
   </div>
   ```

**Dependencies**: None (these components only import from atoms and data types, no dependency on TASK-M01 hooks)

**Acceptance criteria**:

- Both files compile with `tsc -b`
- `MobilePropertiesSheet` shows all editable fields matching `CanvasPropertiesPanel` exactly: label input, reference ID badge, shape toggle, seat count slider (1-20), rotation slider (0-359) + 4 preset buttons, DELETE ENTITY button
- `MobilePropertiesSheet` fires `onUpdate` immediately on every field change (live update, same as desktop)
- `MobilePropertiesSheet` resets label local state when `table.id` changes (adjusting state during render pattern)
- `MobileGuestsSheet` shows guest list or "NO_UNASSIGNED_GUESTS // ALL_ALLOCATED" empty state
- Both sheets have backdrop overlay (`bg-black/40`), drag handle, close button (X), and respect `max-h-[60vh]`
- Touch events on sheet body scroll the sheet, not the canvas underneath (`onTouchMove` stopPropagation)
- No lint errors

---

#### TASK-M04: SeatingCanvas Mobile Rendering

**Description**: Replace the mobile placeholder in `SeatingCanvas` with the actual mobile canvas. Enable touch panning and pinch-to-zoom on mobile, render dual toolbar positions, and pass dynamic zoom to status bar.

**Affected files**:

- `src/components/organisms/SeatingCanvas.tsx` (**modified** — 287 lines currently)

**Project context**:

- Current file structure: imports (`:1-11`), Props interface (`:13-39`), internal types (`:41-55`), component function (`:57-285`).
- Mobile placeholder at `:176-181`: `<div className="md:hidden ...">CANVAS_EDITOR // DESKTOP_REQUIRED</div>`.
- Desktop canvas at `:183-282`: `<div className="hidden md:flex ...">` wrapping `TransformWrapper` + `TransformComponent`.
- `TransformWrapper` config at `:185-194`: zoom locked at 1, panning gated on `activeTool !== 'pan'`.
- Desktop toolbar at `:254-256`: `<div className="absolute top-4 left-4 z-10">`.
- Status bar at `:259-261`: `<div className="absolute top-4 right-4 z-10">` renders `<CanvasStatusBar />` with no props.
- Canvas inner div at `:200-249`: 3000x2000px with dot-grid background, mouse handlers.
- `transformRef` at `:69`: `useRef<ReactZoomPanPinchContentRef>(null)` used for coordinate conversion in `handleCanvasClick` at `:103-106`.
- `handleCanvasClick` at `:85-126`: handles tap-to-place and tap-to-deselect. Uses `e.target !== e.currentTarget` guard at `:93` — this also works on mobile touch events that fire `onClick`.
- `handleCanvasMouseMove/Up` at `:128-152`: mouse-only table drag — these remain desktop-only. Mobile table drag is handled in `CanvasTable` (TASK-M05).

**Implementation instructions**:

1. **Add import** at top (after `:11`):

   ```typescript
   import { useIsMobile } from '../../hooks/useIsMobile'
   ```

2. **Add state** inside component function (after `:74`):

   ```typescript
   const isMobile = useIsMobile()
   const [currentZoom, setCurrentZoom] = useState(1)
   ```

3. **Delete the mobile placeholder** — remove lines 176-181:

   ```tsx
   {
     /* Mobile placeholder */
   }
   ;<div className="md:hidden flex-1 flex items-center justify-center bg-background p-8">
     <p className="text-label text-foreground-muted tracking-wider text-center">
       CANVAS_EDITOR // DESKTOP_REQUIRED
     </p>
   </div>
   ```

4. **Remove `hidden md:flex` from desktop canvas div** — change `:184` from:

   ```tsx
   <div className="hidden md:flex flex-1 relative overflow-hidden bg-background">
   ```

   to:

   ```tsx
   <div className="flex flex-1 relative overflow-hidden bg-background">
   ```

   Both mobile and desktop now render the same canvas div.

5. **Make TransformWrapper config conditional** — replace `:185-194`:

   ```tsx
   <TransformWrapper
     ref={transformRef}
     disabled={isMobile ? false : activeTool !== 'pan'}
     initialScale={1}
     minScale={isMobile ? 0.5 : 1}
     maxScale={isMobile ? 3 : 1}
     panning={{ disabled: isMobile ? false : activeTool !== 'pan' }}
     pinch={{ disabled: !isMobile }}
     doubleClick={{ disabled: true }}
     wheel={{ disabled: true }}
     onTransformed={
       isMobile
         ? (_ref, state) => {
             setCurrentZoom(state.scale)
           }
         : undefined
     }
   >
   ```

   Note: The `onTransformed` callback signature from `react-zoom-pan-pinch` v3 is `(ref, state) => void` where `state` has `{ scale, positionX, positionY }`. The `_ref` parameter is the `ReactZoomPanPinchContentRef`. Use `_ref` prefix to satisfy `noUnusedParameters`.

6. **Replace single toolbar with dual mobile/desktop toolbars** — replace `:253-256`:

   ```tsx
   {
     /* Mobile toolbar */
   }
   ;<div className="md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-30">
     <CanvasToolbar activeTool={activeTool} onToolChange={setActiveTool} />
   </div>

   {
     /* Desktop toolbar */
   }
   ;<div className="hidden md:block absolute top-4 left-4 z-10">
     <CanvasToolbar activeTool={activeTool} onToolChange={setActiveTool} />
   </div>
   ```

7. **Update status bar** — replace `:259-261`:

   ```tsx
   <div className="absolute top-4 right-4 z-10">
     <CanvasStatusBar zoom={isMobile ? currentZoom : undefined} />
   </div>
   ```

8. **Pass `isMobile` to CanvasTable** — update the `CanvasTable` render at `:222-247` to pass `isMobile` prop:

   ```tsx
   <CanvasTable
     key={table.id}
     table={table}
     isSelected={selectedTableId === table.id}
     guests={guests}
     onSelect={() => onSelectTable(table.id)}
     onSeatClick={(seatIndex, anchorRect) =>
       handleSeatClick(table.id, seatIndex, anchorRect)
     }
     activeSeatIndex={
       activeSeat?.tableId === table.id ? activeSeat.seatIndex : null
     }
     onTableMouseDown={(e) => {
       if (activeTool !== 'select') return
       hasDragged.current = false
       setDragState({
         tableId: table.id,
         startX: e.clientX,
         startY: e.clientY,
         origX: table.x,
         origY: table.y,
       })
     }}
     isMobile={isMobile}
     activeTool={activeTool}
     onTableTouchDrag={(tableId, deltaX, deltaY) => {
       const instance = transformRef.current?.instance
       const scale = instance?.transformState.scale ?? 1
       const t = tables.find((tbl) => tbl.id === tableId)
       if (t) {
         onUpdateTable(tableId, {
           x: t.x + deltaX / scale,
           y: t.y + deltaY / scale,
         })
       }
     }}
   />
   ```

   The delta from `CanvasTable` touch drag must be divided by the current zoom scale to convert screen pixels to canvas coordinates — same pattern as `handleCanvasMouseMove` at `:139-145`.

9. **No changes to `handleCanvasClick`** — the `onClick` handler at `:85-126` already works for mobile tap. The `e.target !== e.currentTarget` guard at `:93` correctly filters out taps on tables/seats (they `stopPropagation`). Tap-to-place and tap-to-deselect work as-is.

10. **No changes to mouse handlers** — `handleCanvasMouseMove` (`:128-146`) and `handleCanvasMouseUp` (`:148-152`) only fire on `onMouseMove`/`onMouseUp` which are mouse-only events. They don't interfere with touch.

**Dependencies**: TASK-M01 (useIsMobile hook), TASK-M02 (CanvasStatusBar zoom prop)

**Acceptance criteria**:

- Mobile (<768px) shows the full interactive canvas with dot-grid background, NOT the "CANVAS_EDITOR // DESKTOP_REQUIRED" placeholder
- Single-finger drag on canvas background pans the canvas on mobile (native `react-zoom-pan-pinch` behavior with panning always enabled)
- Two-finger pinch zooms the canvas on mobile (0.5x to 3x range)
- Zoom percentage updates in the status bar dynamically on mobile
- Desktop status bar still shows "ZOOM: 100%" (static)
- Toolbar renders at `fixed bottom-20 left-1/2 -translate-x-1/2 z-30` on mobile, `absolute top-4 left-4 z-10` on desktop
- Tap-to-place tables works on mobile with add tools (uses existing `handleCanvasClick`)
- Tap on empty canvas deselects current table on mobile
- `isMobile` and `activeTool` are passed to `CanvasTable` for touch interaction support
- Touch drag deltas are scale-corrected before updating table position
- Desktop behavior is completely unchanged — zoom locked at 1, panning gated on pan tool, mouse drag works
- File compiles with `tsc -b`, no lint errors

---

#### TASK-M05: Mobile Table Touch Interactions

**Description**: Add long-press + drag touch handling to `CanvasTable` for mobile table repositioning. Disable DnD seat dragging on mobile.

**Affected files**:

- `src/components/molecules/CanvasTable.tsx` (**modified** — 204 lines currently)

**Project context**:

- Current file structure: imports (`:1-17`), Props (`:19-27`), `SeatSlot` sub-component (`:30-86`), `CanvasTable` function (`:88-201`).
- `SeatSlot` at `:55-64` uses `useDraggable` with `disabled: isEmpty`. Must add `|| isMobile` condition.
- `CanvasTable` root div at `:130-141`: has `onMouseDown={handleMouseDown}` and `onClick={(e) => e.stopPropagation()}`. Touch handlers will be added here.
- `handleMouseDown` at `:123-127`: calls `e.stopPropagation()`, `onSelect()`, `onTableMouseDown?.(e)`. Desktop-only — remains unchanged.
- The table body styling at `:146-151` includes the selected state `border-2 border-dashed border-primary`. The drag visual feedback (`shadow-lg ring-2 ring-primary`) will be added to the root container div.

**Implementation instructions**:

1. **Add imports** at top (after `:1`):

   ```typescript
   import { useState, useRef, useCallback } from 'react'
   import { useLongPress } from '../../hooks/useLongPress'
   ```

2. **Extend Props interface** — add to the existing Props at `:19-27`:

   ```typescript
   interface Props {
     table: FloorTable
     isSelected: boolean
     guests: Guest[]
     onSelect: () => void
     onSeatClick: (seatIndex: number, anchorRect: DOMRect) => void
     activeSeatIndex: number | null
     onTableMouseDown?: (e: React.MouseEvent) => void
     isMobile?: boolean
     activeTool?: string
     onTableTouchDrag?: (
       tableId: string,
       deltaX: number,
       deltaY: number,
     ) => void
   }
   ```

3. **Pass `isMobile` to `SeatSlot`** — update the `SeatSlot` function signature to accept `isMobile` prop:

   ```typescript
   function SeatSlot({
     seatIndex,
     tableId,
     assignment,
     guest,
     activeSeatIndex,
     onSeatClick,
     isMobile,
   }: {
     // ... existing types
     isMobile?: boolean
   })
   ```

   And update `useDraggable` at `:55-64`:

   ```typescript
   const { ref: dragRef, isDragging } = useDraggable({
     id: `seat-drag-${tableId}-${seatIndex}`,
     disabled: isEmpty || !!isMobile,
     data: {
       type: DRAG_TYPE_SEAT,
       tableId,
       seatIndex,
       guestId: assignment?.guestId ?? '',
     } satisfies DragSeatData,
   })
   ```

4. **Add touch state and handlers** inside `CanvasTable` function (after `:112`):

   ```typescript
   const touchStartPos = useRef<{ x: number; y: number } | null>(null)
   const [isDragMode, setIsDragMode] = useState(false)

   const handleLongPress = useCallback(() => {
     if (isSelected && isMobile && activeTool === 'select') {
       setIsDragMode(true)
     }
   }, [isSelected, isMobile, activeTool])

   const handleTap = useCallback(() => {
     onSelect()
   }, [onSelect])

   const longPressHandlers = useLongPress({
     threshold: 300,
     onLongPress: handleLongPress,
     onTap: handleTap,
   })

   function handleTouchMove(e: React.TouchEvent) {
     if (!isDragMode || !touchStartPos.current) return
     e.preventDefault() // Prevent scroll/pan while dragging table
     const touch = e.touches[0]
     const deltaX = touch.clientX - touchStartPos.current.x
     const deltaY = touch.clientY - touchStartPos.current.y
     touchStartPos.current = { x: touch.clientX, y: touch.clientY }
     onTableTouchDrag?.(table.id, deltaX, deltaY)
   }

   function handleTouchEnd() {
     if (isDragMode) {
       setIsDragMode(false)
     }
     touchStartPos.current = null
   }
   ```

5. **Update the root div** at `:130-141` — add touch handlers and drag mode visual feedback:

   ```tsx
   <div
     className={`absolute ${isDragMode ? 'shadow-lg ring-2 ring-primary rounded' : ''}`}
     style={{
       left: table.x,
       top: table.y,
       width: containerWidth,
       height: containerHeight,
       transform: `rotate(${table.rotation}deg)`,
       transformOrigin: 'center center',
     }}
     onMouseDown={handleMouseDown}
     onClick={(e) => e.stopPropagation()}
     onTouchStart={(e) => {
       if (isMobile && activeTool === 'select') {
         touchStartPos.current = {
           x: e.touches[0].clientX,
           y: e.touches[0].clientY,
         }
         longPressHandlers.onTouchStart()
         e.stopPropagation()
       }
     }}
     onTouchMove={(e) => {
       longPressHandlers.onTouchMove()
       handleTouchMove(e)
     }}
     onTouchEnd={() => {
       longPressHandlers.onTouchEnd()
       handleTouchEnd()
     }}
   >
   ```

   The `e.stopPropagation()` on `onTouchStart` prevents `react-zoom-pan-pinch` from capturing the touch for panning when the select tool is active and the user touches a table.

6. **Pass `isMobile` through to `SeatSlot`** — update the `SeatSlot` render at `:189-196`:
   ```tsx
   <SeatSlot
     seatIndex={i}
     tableId={table.id}
     assignment={assignment}
     guest={guest}
     activeSeatIndex={activeSeatIndex}
     onSeatClick={onSeatClick}
     isMobile={isMobile}
   />
   ```

**Dependencies**: TASK-M01 (useLongPress hook)

**Acceptance criteria**:

- Long-press (300ms) on a selected table on mobile with select tool active enables drag mode with visual feedback (`shadow-lg ring-2 ring-primary`)
- While in drag mode, finger movement fires `onTableTouchDrag` with screen-space deltas
- Quick tap on a table selects it (does not drag) — `onSelect()` called via `useLongPress.onTap`
- Pan tool active: `onTouchStart` does not call `e.stopPropagation()`, allowing `react-zoom-pan-pinch` to handle the pan
- Seat DnD (`useDraggable`) is disabled on mobile via `disabled: isEmpty || !!isMobile`
- Desktop behavior unchanged — `onMouseDown` still works, no touch handlers fire when `isMobile` is false
- File compiles with `tsc -b`, no lint errors

---

#### TASK-M06: App Integration & Popover Fix

**Description**: Wire mobile canvas components into `App.tsx`. Render `MobilePropertiesSheet` and `MobileGuestsSheet` for mobile canvas. Add unassigned guests FAB. Update existing FAB visibility. Fix `SeatAssignmentPopover` close-on-outside-click for mobile.

**Affected files**:

- `src/App.tsx` (**modified** — 286 lines currently)
- `src/components/molecules/SeatAssignmentPopover.tsx` (**modified** — 123 lines currently)

**Project context**:

- `App.tsx` current structure: imports (`:1-29`), `App` function (`:31-284`).
- `canvasContent` JSX at `:182-213`: renders `LeftSidebar + main > SeatingCanvas + CanvasPropertiesPanel`.
- FAB render at `:280`: `{!isChildRoute && <FAB onClick={handleNavigateToAdd} label="Add guest" />}` — currently shows on all views including canvas.
- `CanvasPropertiesPanel` at `:204-211`: already has `hidden md:flex` in its own component, so it auto-hides on mobile. No change needed to this line.
- `selectedCanvasTable` at `:116-117`: already computed, will be used for `MobilePropertiesSheet`.
- `SeatAssignmentPopover` close handler at `:28-39`: uses `document.addEventListener('mousedown', ...)`. Mobile touch does NOT fire `mousedown` events — must also listen for `touchstart`.

**Implementation instructions**:

**Part A: App.tsx modifications**

1. **Add imports** (after `:29`):

   ```typescript
   import MobilePropertiesSheet from './components/organisms/MobilePropertiesSheet'
   import MobileGuestsSheet from './components/organisms/MobileGuestsSheet'
   import { useIsMobile } from './hooks/useIsMobile'
   import { LuUsers } from 'react-icons/lu'
   ```

2. **Add state/hooks** (after `:39`):

   ```typescript
   const isMobile = useIsMobile()
   const [showMobileGuests, setShowMobileGuests] = useState(false)
   ```

3. **Compute unassigned guests** for FAB badge + sheet (after the `selectedCanvasTable` computation at `:117`):

   ```typescript
   const unassignedGuests = guests.filter(
     (g) => !tables.some((t) => t.seats.some((s) => s.guestId === g.id)),
   )
   ```

4. **Update `canvasContent`** — add mobile sheets and FAB inside the fragment at `:182-213`. After the `CanvasPropertiesPanel` block at `:204-211`, add:

   ```tsx
   {
     /* Mobile properties sheet */
   }
   {
     isMobile && selectedCanvasTable && (
       <MobilePropertiesSheet
         table={selectedCanvasTable}
         onUpdate={(data) => handleUpdateTable(selectedCanvasTable.id, data)}
         onDelete={() => handleDeleteTable(selectedCanvasTable.id)}
         onClose={() => setSelectedCanvasTableId(null)}
       />
     )
   }

   {
     /* Mobile unassigned guests FAB */
   }
   {
     isMobile && unassignedGuests.length > 0 && (
       <button
         className="md:hidden fixed bottom-[140px] right-4 z-30 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center cursor-pointer"
         onClick={() => setShowMobileGuests(true)}
         aria-label="View unassigned guests"
       >
         <LuUsers size={20} />
         <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
           {unassignedGuests.length}
         </span>
       </button>
     )
   }

   {
     /* Mobile unassigned guests sheet */
   }
   {
     isMobile && showMobileGuests && (
       <MobileGuestsSheet
         guests={unassignedGuests}
         onClose={() => setShowMobileGuests(false)}
       />
     )
   }
   ```

5. **Update existing FAB** — change `:280` from:
   ```tsx
   {
     !isChildRoute && <FAB onClick={handleNavigateToAdd} label="Add guest" />
   }
   ```
   to:
   ```tsx
   {
     !isChildRoute && !isCanvasView && (
       <FAB onClick={handleNavigateToAdd} label="Add guest" />
     )
   }
   ```
   This hides the "Add guest" FAB when on the canvas view (where the unassigned guests FAB is shown instead).

**Part B: SeatAssignmentPopover.tsx modifications**

6. **Fix close-on-outside-click for mobile** — update the `useEffect` at `:28-39`. Replace:

   ```typescript
   useEffect(() => {
     function handleMouseDown(e: MouseEvent) {
       if (
         popoverRef.current &&
         !popoverRef.current.contains(e.target as Node)
       ) {
         onClose()
       }
     }

     document.addEventListener('mousedown', handleMouseDown)
     return () => document.removeEventListener('mousedown', handleMouseDown)
   }, [onClose])
   ```

   with:

   ```typescript
   useEffect(() => {
     function handlePointerDown(e: MouseEvent | TouchEvent) {
       const target =
         e instanceof TouchEvent
           ? (e.touches[0]?.target as Node | null)
           : (e.target as Node)
       if (
         popoverRef.current &&
         target &&
         !popoverRef.current.contains(target)
       ) {
         onClose()
       }
     }

     document.addEventListener('mousedown', handlePointerDown)
     document.addEventListener('touchstart', handlePointerDown)
     return () => {
       document.removeEventListener('mousedown', handlePointerDown)
       document.removeEventListener('touchstart', handlePointerDown)
     }
   }, [onClose])
   ```

   Note: The `TouchEvent` target is on `e.touches[0].target` not `e.target` for the initial touch point. However, `e.target` also works on `TouchEvent` — it references the element where the touch started. So a simpler approach is to just use `e.target as Node` for both. Verify during implementation. The key fix is adding `touchstart` alongside `mousedown`.

**Dependencies**: TASK-M03 (MobilePropertiesSheet, MobileGuestsSheet), TASK-M04 (SeatingCanvas renders on mobile), TASK-M01 (useIsMobile)

**Acceptance criteria**:

- Mobile canvas shows the unassigned guests FAB with amber badge showing count, positioned at `fixed bottom-[140px] right-4 z-30`
- FAB hidden when unassigned guest count is 0
- Tapping the FAB opens the `MobileGuestsSheet`
- When a table is selected on mobile, the `MobilePropertiesSheet` opens with correct table data
- Editing fields in the `MobilePropertiesSheet` updates the table on the canvas in real-time
- Deleting via the sheet removes the table, closes the sheet
- When the sheet is closed (X button), the table is deselected (`setSelectedCanvasTableId(null)`)
- The "Add guest" FAB is hidden on the canvas view (`/seating-plan`)
- `SeatAssignmentPopover` closes on outside tap on mobile (touchstart listener)
- Desktop behavior is completely unchanged — `CanvasPropertiesPanel` still renders on desktop (its `hidden md:flex` handles this), desktop DnD works, desktop FAB appears on guest list view
- All changes compile with `tsc -b`, no lint errors

### Execution Order

```
Phase 1 (Independent — run in parallel):
  ├── TASK-M01: Utility Hooks (useIsMobile, useLongPress)
  └── TASK-M02: Canvas Status Bar Update

Phase 2 (Depends on Phase 1 — run in parallel):
  ├── TASK-M03: Mobile Bottom Sheet Components
  ├── TASK-M04: SeatingCanvas Mobile Rendering
  └── TASK-M05: Mobile Table Touch Interactions

Phase 3 (Depends on ALL above):
  └── TASK-M06: App Integration & Popover Fix
```

| Phase | Tasks                        | Can Parallelize | Rationale                                                                                                    |
| ----- | ---------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------ |
| 1     | TASK-M01, TASK-M02           | Yes             | Independent: new hook files + atom update, no shared files                                                   |
| 2     | TASK-M03, TASK-M04, TASK-M05 | Yes             | M03 creates new files only; M04 modifies SeatingCanvas only; M05 modifies CanvasTable only — no file overlap |
| 3     | TASK-M06                     | Single task     | Modifies App.tsx + SeatAssignmentPopover, wires everything together                                          |

**Scope isolation**:

- **Phase 1**: TASK-M01 creates `src/hooks/useIsMobile.ts` + `src/hooks/useLongPress.ts`. TASK-M02 modifies `src/components/atoms/CanvasStatusBar.tsx`. No file overlap.
- **Phase 2**: TASK-M03 creates `src/components/organisms/MobilePropertiesSheet.tsx` + `MobileGuestsSheet.tsx`. TASK-M04 modifies `src/components/organisms/SeatingCanvas.tsx`. TASK-M05 modifies `src/components/molecules/CanvasTable.tsx`. No file overlap.
- **Phase 3**: TASK-M06 modifies `src/App.tsx` + `src/components/molecules/SeatAssignmentPopover.tsx`. No overlap with Phase 2 files.

### Verification Checklist

#### Build & Compile

- [ ] `tsc -b` compiles without errors
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] No new npm dependencies required

#### Mobile Canvas Rendering (AC-1 through AC-3)

- [ ] Mobile (<768px) shows interactive canvas, NOT the placeholder (AC-1)
- [ ] Empty mobile canvas shows dot-grid + toolbar + FAB (AC-2)
- [ ] Tables render identically on mobile and desktop (AC-3)

#### Touch Panning (AC-4, AC-5)

- [ ] Single-finger drag on background pans the canvas (AC-4)
- [ ] Pan position persists after finger lift (AC-5)

#### Pinch-to-Zoom (AC-6 through AC-8)

- [ ] Two-finger pinch zooms the canvas (AC-6)
- [ ] Status bar shows dynamic zoom percentage (AC-7)
- [ ] Zoom clamped at 50% min, 300% max (AC-8)

#### Tap to Select (AC-9, AC-10)

- [ ] Tap on table selects it (cobalt dashed border + bottom sheet) (AC-9)
- [ ] Tap on empty canvas deselects (AC-10)

#### Touch Drag to Reposition (AC-11 through AC-13)

- [ ] Long-press + drag repositions table (AC-11)
- [ ] Position persists after finger lift (AC-12)
- [ ] Pan tool: table touch pans canvas, not table (AC-13)

#### Mobile Toolbar (AC-14, AC-15)

- [ ] Toolbar at bottom-center, above BottomTabBar (AC-14)
- [ ] Tool switching works (AC-15)

#### Adding Tables (AC-16, AC-17)

- [ ] Tap-to-place works with add tools on mobile (AC-16, AC-17)

#### Bottom Sheet Properties (AC-18 through AC-23)

- [ ] Bottom sheet shows label, ID, shape, seats, rotation, delete (AC-18)
- [ ] Live updates for all fields (AC-19 through AC-21)
- [ ] Delete removes table and closes sheet (AC-22)
- [ ] Close/swipe-down dismisses sheet (AC-23)

#### Guest Assignment (AC-24 through AC-26)

- [ ] Tap seat opens popover on mobile (AC-24)
- [ ] Assign guest via popover (AC-25)
- [ ] Unassign guest via popover (AC-26)

#### Unassigned Guests Sheet (AC-27 through AC-29)

- [ ] FAB opens unassigned guests sheet (AC-27)
- [ ] Empty state message when all assigned (AC-28)
- [ ] List is read-only (AC-29)

#### Persistence (AC-30, AC-31)

- [ ] Data persists across mobile page reload (AC-30)
- [ ] Same data visible on mobile and desktop (AC-31)

#### Edge Cases

- [ ] Pan vs. table drag: quick tap selects, long-press drags (EC-1)
- [ ] Pinch with table selected: zoom occurs, table stays selected (EC-2)
- [ ] Popover over bottom sheet: correct z-index stacking (EC-3)
- [ ] Bottom sheet scroll doesn't pan canvas (EC-4)
- [ ] Popover clamped within mobile viewport (EC-5)
- [ ] Toolbar doesn't overlap BottomTabBar (EC-7)
- [ ] Bottom sheet max 60vh (EC-8)
- [ ] FAB hidden when unassigned count is 0 (EC-11)

#### Desktop Regression

- [ ] Desktop canvas behavior completely unchanged
- [ ] Desktop toolbar position unchanged (top-left)
- [ ] Desktop properties panel unchanged (right sidebar)
- [ ] Desktop DnD (guest drag, seat swap) still works
- [ ] Desktop pan tool behavior unchanged

## Notes

- No new npm dependencies are needed. `react-zoom-pan-pinch` already supports touch gestures natively — pinch-to-zoom and touch panning are built in. The changes are primarily about enabling these features (they were disabled on desktop) and adding mobile-specific UI (bottom sheets, toolbar repositioning).
- The `@dnd-kit/react` library is retained for desktop DnD but is effectively disabled on mobile. The `DragDropProvider` wrapper in `App.tsx` remains unchanged — it has no performance cost when no drag operations occur.
- The `useLongPress` hook is a simple implementation. If complex gesture conflicts arise during implementation, consider using a library like `@use-gesture/react` instead. However, the simple implementation should be sufficient for the long-press + drag pattern.
- Table coordinates (x, y) are in canvas space and are resolution-independent. A table placed at (500, 300) on desktop appears at the same logical position on mobile. The user may need to pan/zoom to find it.
- The `SeatAssignmentPopover` already uses `fixed` positioning with viewport clamping. It should work on mobile without changes, but the positioning logic should be tested on small viewports (320px wide) to ensure the 224px-wide popover doesn't overflow.
- Bottom sheets use `vaul` (v1.1.2) for native swipe-to-dismiss, spring animations, and accessible drawer behavior. Replaced the initial custom implementation after user feedback.
- The canvas snap-back issue was fixed by setting `limitToBounds={false}` on `TransformWrapper` and removing `contentStyle` from `TransformComponent`, allowing the 3000x2000 inner div to define the natural content bounds.

## Changelog

- 2026-04-03: Initial draft created by PM agent
- 2026-04-03: Technical Plan enriched by TPM agent — added precise line references, code-level implementation instructions, exact file impact analysis with line numbers, refined execution order (4 phases → 3 phases by parallelizing M03/M04/M05 in Phase 2), added SeatAssignmentPopover touchstart fix to TASK-M06 scope, added project context sections to all tasks, added scale-correction for mobile table drag deltas
- 2026-04-03: Implementation completed — 6 tasks (TASK-M01 through TASK-M06) all verified by TPM and approved by Validator (0 CRITICAL, 0 MAJOR, 7 MINOR). Post-validation fixes: bottom sheets refactored from custom CSS to `vaul` Drawer for native swipe gestures; canvas snap-back fixed via `limitToBounds={false}` + removed `contentStyle` constraint. Build succeeds. 9 files created/modified. Library added: vaul 1.1.2.
