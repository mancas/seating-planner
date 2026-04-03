# Spec: Seating Canvas

## Metadata

- **Slug**: `seating-canvas`
- **Date**: 2026-04-03
- **Status**: Completed
- **Author**: User
- **Related specs**: [spec/guest-list-screen.md](./guest-list-screen.md), [spec/guest-crud-flow.md](./guest-crud-flow.md), [spec/nought-cobalt-design-system.md](./nought-cobalt-design-system.md)

## Description

Build the interactive seating plan canvas for the Canvas tab (`/?tab=canvas`), replacing the current "CANVAS // MODULE_OFFLINE" placeholder. The canvas is a 2D layout editor where wedding planners can add rectangular or circular tables, configure seat counts, drag tables to reposition them, and assign guests from the existing guest list to specific seats.

### Core Behaviors

- **Add tables**: Users can add rectangular or circular tables to the canvas via a floating toolbar.
- **Edit seat count**: Each table has a configurable number of seats. Tables auto-resize based on seat count — no manual resizing is allowed.
- **Assign guests**: Guests from the existing guest list (localStorage) can be assigned to specific seats on a table. Assigned guests are displayed by their initials at the seat position.
- **Drag tables**: Tables can be repositioned anywhere on the canvas by clicking and dragging.
- **Select & edit**: Clicking a table selects it and opens a properties panel on the right sidebar where label, shape, and seat count can be edited.
- **Delete tables**: Tables can be deleted via the properties panel.
- **Persist data**: All table data (positions, shapes, seat counts, guest assignments) is persisted in localStorage.
- **Drag & drop guests onto seats**: Guests can be dragged from a guest list panel directly onto seat indicators to assign them, in addition to the existing click-to-assign popover mechanism.
- **Rotate tables**: Tables can be rotated to any angle (0-359 degrees) via a rotation control in the properties panel. Seats rotate with the table.
- **Swap seats**: Guests can be moved between seats via drag. Dragging an occupied seat to an empty seat moves the guest; dragging to another occupied seat swaps both guests.

### Canvas Interaction Model

The canvas uses a toolbar-based interaction model with four tools:

1. **Select tool** (default): Click to select tables, drag to reposition them.
2. **Pan tool**: Click and drag on the canvas background to pan the viewport.
3. **Add Circle Table tool**: Click on the canvas to place a new circular table at the click position.
4. **Add Rectangle Table tool**: Click on the canvas to place a new rectangular table at the click position.

## User Stories

1. As a **wedding planner**, I want to add rectangular tables to a canvas so that I can model the physical venue layout.
2. As a **wedding planner**, I want to add circular tables to a canvas so that I can represent round table arrangements.
3. As a **wedding planner**, I want to edit the number of seats on each table so that I can configure capacity per table.
4. As a **wedding planner**, I want tables to automatically resize based on seat count so that I don't need to manually size them and the visual representation stays proportional.
5. As a **wedding planner**, I want to drag tables around the canvas so that I can arrange them to match my venue floor plan.
6. As a **wedding planner**, I want to assign guests to specific seats on a table so that I can plan the seating arrangement.
7. As a **wedding planner**, I want to see guest initials on their assigned seats so that I can visually identify who sits where.
8. As a **wedding planner**, I want to select a table and edit its properties in a side panel so that I can configure it without cluttering the canvas.
9. As a **wedding planner**, I want to delete a table so that I can remove tables I no longer need.
10. As a **wedding planner**, I want my canvas layout to be saved automatically so that I don't lose my work when I leave and come back.
11. As a **wedding planner**, I want to drag a guest from the guest list panel directly onto a seat so that I can quickly assign guests without navigating through dropdowns.
12. As a **wedding planner**, I want to rotate a table so that I can align it with the venue layout orientation.
13. As a **wedding planner**, I want to drag a guest from one seat to another seat so that I can quickly rearrange seating by swapping or moving guests.

## Acceptance Criteria

### Canvas Rendering

1. GIVEN the app is loaded at `/?tab=canvas` WHEN the page renders THEN the main content area displays the interactive canvas with a subtle dot-grid background pattern and the floating toolbar in the top-left corner.

2. GIVEN the canvas is displayed WHEN no tables have been added THEN the canvas is empty (only the grid background is visible) and the toolbar is present.

3. GIVEN the canvas is displayed WHEN viewing the top-right area of the canvas THEN a status bar shows "ZOOM: 100%" and "LAYER: FLOOR_PLAN_MAIN" text in `text-label text-foreground-muted` styling.

### Toolbar

4. GIVEN the canvas is displayed WHEN viewing the toolbar THEN four tool buttons are visible: select/pointer (default active), pan/hand, add circle table, add rectangle table. The active tool has a cobalt highlight (`bg-primary text-primary-foreground`).

5. GIVEN the select tool is active WHEN the user clicks a different tool button THEN that tool becomes active (cobalt highlight) and the previous tool is deactivated.

6. GIVEN the pan tool is active WHEN the user clicks and drags on the canvas background THEN the canvas viewport pans in the direction of the drag.

### Adding Tables

7. GIVEN the "add circle table" tool is active WHEN the user clicks on the canvas THEN a new circular table is placed at the click position with default values: shape "circular", 8 seats, auto-generated label (e.g., "TABLE ALPHA", "TABLE BETA", etc.), and auto-generated ID badge (T01, T02, T03, incrementing).

8. GIVEN the "add rectangle table" tool is active WHEN the user clicks on the canvas THEN a new rectangular table is placed at the click position with default values: shape "rectangular", 8 seats, auto-generated label, and auto-generated ID badge.

9. GIVEN a table has been added WHEN the table is rendered on the canvas THEN it displays: the table shape (rectangle or circle), an ID badge in the top-right corner (e.g., "T01"), the table label centered on the table (e.g., "TABLE ALPHA"), a guest count indicator with icon and count (e.g., "0/8 Guests"), and seat indicators as small dots/circles along the table edges.

### Table Auto-Sizing

10. GIVEN a rectangular table with N seats WHEN it renders THEN the table width and height scale proportionally to accommodate N seats (seats distributed evenly along the long edges and short edges). A table with 4 seats is smaller than one with 12 seats.

11. GIVEN a circular table with N seats WHEN it renders THEN the table diameter scales proportionally to accommodate N seats arranged around the circumference. A table with 4 seats is smaller than one with 12 seats.

12. GIVEN a table's seat count is changed (e.g., from 6 to 10) WHEN the canvas re-renders THEN the table visually resizes to accommodate the new seat count. No manual resize handles are present on any table.

### Selecting & Editing Tables

13. GIVEN the select tool is active WHEN the user clicks on a table THEN the table enters selected state: a cobalt blue dashed border (`border-primary`, dashed, 2px) appears around the table, and the properties panel opens on the right side.

14. GIVEN a table is selected WHEN the user clicks on empty canvas space THEN the table is deselected, the border is removed, and the properties panel closes.

15. GIVEN a table is selected WHEN viewing the properties panel THEN it shows:
    - **INFORMATION section**: Table Label (editable text input), Reference ID (read-only, auto-generated badge e.g. "T01")
    - **CONFIGURATION section**: Shape toggle (RECTANGULAR / CIRCULAR buttons), Total Guests slider (range 1-20 with numeric display)
    - **UPDATE CHANGES button** (primary blue, full-width)
    - **DELETE ENTITY button** (ghost/subtle style, full-width)

16. GIVEN the properties panel is open WHEN the user changes the Table Label input and clicks "UPDATE CHANGES" THEN the table's label on the canvas updates to the new value.

17. GIVEN the properties panel is open WHEN the user toggles the shape from RECTANGULAR to CIRCULAR (or vice versa) and clicks "UPDATE CHANGES" THEN the table's shape on the canvas changes accordingly and re-sizes to fit the current seat count.

18. GIVEN the properties panel is open WHEN the user adjusts the Total Guests slider and clicks "UPDATE CHANGES" THEN the table's seat count updates and the table auto-resizes on the canvas. Seat indicators reflect the new count.

### Dragging Tables

19. GIVEN the select tool is active WHEN the user clicks and drags a table THEN the table follows the mouse/pointer and repositions on the canvas in real-time.

20. GIVEN the user is dragging a table WHEN the user releases the mouse THEN the table stays at the new position and the new position is persisted to localStorage.

21. GIVEN the pan tool is active WHEN the user clicks and drags on a table THEN the canvas pans (tables are not draggable when pan tool is active — pan tool always pans).

### Deleting Tables

22. GIVEN a table is selected and the properties panel is open WHEN the user clicks "DELETE ENTITY" THEN the table is removed from the canvas, the properties panel closes, and the deletion is persisted to localStorage.

### Guest Assignment

23. GIVEN a table is selected and the properties panel is open WHEN the user clicks on a seat indicator (dot) on the selected table THEN a dropdown/popover appears showing the list of unassigned guests (guests not assigned to any seat on any table).

24. GIVEN the seat assignment dropdown is open WHEN the user selects a guest from the list THEN the guest is assigned to that seat, the seat indicator changes from an empty dot to a filled dot showing the guest's initials (first letter of firstName + first letter of lastName), and the guest count updates (e.g., "1/8 Guests").

25. GIVEN a seat has an assigned guest WHEN the user clicks on that seat THEN a popover shows the assigned guest's full name with an option to "UNASSIGN" them from the seat.

26. GIVEN a seat has an assigned guest WHEN the user clicks "UNASSIGN" THEN the guest is removed from the seat, the seat indicator reverts to an empty dot, and the guest count decrements.

27. GIVEN a guest is assigned to a seat on a table WHEN the table's seat count is reduced below the guest's seat position THEN the guest is automatically unassigned (e.g., guest at seat 8, count reduced to 6 — guest is unassigned).

### Data Persistence

28. GIVEN tables have been added/edited/deleted on the canvas WHEN the page is reloaded THEN all table data (positions, shapes, seat counts, labels, guest assignments) is restored from localStorage.

29. GIVEN a guest is deleted from the guest list (via the Guests tab CRUD flow) WHEN the canvas tab is viewed THEN any seat assignments for that deleted guest are automatically cleared (seat reverts to empty).

### Drag & Drop Guest Assignment

30. GIVEN the select tool is active and the guest list panel is visible WHEN the user drags a guest from the guest list THEN a drag preview showing the guest's initials follows the cursor.

31. GIVEN a guest is being dragged over the canvas WHEN the drag preview hovers over an empty seat indicator THEN the seat visually highlights as a valid drop zone (e.g., ring highlight or color change).

32. GIVEN a guest is being dragged WHEN the user drops the guest onto an empty seat indicator THEN the guest is assigned to that seat, the seat shows the guest's initials, and the guest count updates.

33. GIVEN a guest is already assigned to a seat on any table WHEN that guest is dragged from the guest list THEN the guest does not appear in the draggable list (only unassigned guests are listed as draggable).

### Table Rotation

34. GIVEN a table is selected and the properties panel is open WHEN the user adjusts the rotation control (0-360 degrees) and clicks "UPDATE CHANGES" THEN the table rotates to the specified angle on the canvas.

35. GIVEN a table has a non-zero rotation angle WHEN it renders THEN the table body and all seat indicators rotate together as a single unit (CSS `transform: rotate()`), and the table label text remains readable.

36. GIVEN a table is rotated WHEN a guest is assigned to a seat THEN the guest's initials are displayed at the rotated seat position, rotating with the table.

### Seat Swapping

37. GIVEN the select tool is active and a seat is occupied by a guest WHEN the user drags that seat's guest indicator THEN a drag preview follows the cursor showing the guest's initials.

38. GIVEN a guest is being dragged from an occupied seat WHEN the user drops it onto an empty seat (same or different table) THEN the guest moves to the new seat and the original seat becomes empty.

39. GIVEN a guest is being dragged from an occupied seat WHEN the user drops it onto another occupied seat THEN the two guests swap seats — each guest ends up in the other's previous seat.

40. GIVEN a seat swap occurs across two different tables WHEN the swap completes THEN both tables' seat assignments and guest counts update correctly.

### Left Sidebar Context

30. GIVEN the canvas tab is active WHEN viewing the left sidebar THEN the "LAYOUT" nav item is highlighted as active (cobalt highlight) instead of "OBJECTS" (which is active on the guests tab).

31. GIVEN the canvas tab is active WHEN viewing the left sidebar bottom section THEN an "ADD TABLE" primary button replaces the "ADD GUEST" button.

## Scope

### In Scope

- Canvas area with pannable viewport and dot-grid background
- Floating toolbar with 4 tools: select, pan, add circle, add rectangle
- Add rectangular and circular tables to the canvas
- Table rendering: shape, ID badge, label, guest count, seat indicators
- Table auto-sizing based on seat count (no manual resize)
- Table selection with cobalt dashed border
- Properties panel (right sidebar) when table is selected: label, shape toggle, seat count slider
- Update table properties via "UPDATE CHANGES" button
- Delete table via "DELETE ENTITY" button
- Drag-to-reposition tables (select tool only)
- Pan canvas viewport (pan tool or canvas background drag)
- Guest assignment to specific seats via seat click > dropdown
- Guest initials displayed on assigned seats
- Unassign guest from seat
- Auto-clear assignments when seat count is reduced
- Auto-clear assignments when guest is deleted from guest list
- Canvas status bar (zoom text + layer text — display only)
- Table data model with localStorage persistence (separate key from guest data)
- Left sidebar context switching (LAYOUT active, ADD TABLE button) when canvas tab is active
- Table ID auto-generation (T01, T02, T03...)
- Table label auto-generation (TABLE ALPHA, TABLE BETA, TABLE GAMMA, etc.)
- Table rotation (0-359 degrees) with rotation control in properties panel
- Drag-and-drop guests from a guest list panel onto seats for assignment
- Seat swapping via drag (move guest to empty seat, or swap with occupied seat, across same or different tables)
- `@dnd-kit/react` (v0.x) for all drag-and-drop interactions (guest assignment, seat swapping, table repositioning)
- `react-zoom-pan-pinch` for canvas pan and zoom (replaces manual CSS transform panning)

### Out of Scope

- Visual style / color swatches for tables (v2)
- Export functionality
- Floor plan layers system (layers text is display-only)
- Room annotations ("MAIN ENTRANCE", walls, doors)
- History/undo system
- Zoom in/out controls (zoom display is static "100%", no actual zoom for v1)
- Objects panel
- Snap-to-grid or alignment guides
- Multi-select (select multiple tables at once)
- Copy/paste tables
- Keyboard shortcuts for tool switching
- Mobile-specific canvas interactions (canvas is desktop-optimized; mobile shows simplified view or placeholder)
- Table numbering customization (always auto-incremented)

## Edge Cases

1. **No tables on canvas**: Canvas shows only the dot-grid background and toolbar. Properties panel is hidden. Status bar is visible.

2. **Delete the only table**: Canvas returns to empty state. Properties panel closes.

3. **Delete a table with assigned guests**: All guest seat assignments for that table are cleared. The guests themselves are not deleted — they return to the unassigned pool.

4. **Reduce seat count below assigned guests**: If a table has guests assigned to seats 7 and 8, and the seat count is reduced from 10 to 6, guests at seats 7 and 8 are automatically unassigned. Guests at seats 1-6 remain assigned.

5. **All guests assigned**: When all guests in the guest list are assigned to seats, the seat assignment dropdown shows "NO_UNASSIGNED_GUESTS // ALL_ALLOCATED" empty state message.

6. **Guest deleted externally**: If a guest is deleted from the Guests tab, and that guest was assigned to a seat on the canvas, the seat is automatically cleared when the canvas re-renders (compare stored guest IDs with current guest list).

7. **Duplicate table labels**: The user can set duplicate labels (e.g., two tables named "TABLE ALPHA"). No uniqueness validation is enforced on labels. The table ID (T01, T02) remains unique.

8. **Table placed at canvas edge**: Tables can be placed anywhere on the canvas. If placed near the edge, parts of the table may be partially out of the visible viewport. The user can pan to see them.

9. **Very high seat count**: The maximum seat count is 20 (slider range 1-20). Tables with 20 seats will be larger but should still be manageable on the canvas.

10. **Click on overlapping tables**: If tables overlap, the click selects the topmost table (last added or last interacted with — highest z-index).

11. **Drag table off-screen**: The table can be dragged to any position, including off the currently visible viewport. The user can pan to retrieve it.

12. **Browser reload with stale guest references**: On reload, table data is loaded from localStorage. Guest assignments reference guest IDs. If a guest ID no longer exists in the guest store (e.g., localStorage was partially cleared), the assignment is silently removed.

13. **Drag guest onto already-occupied seat**: If a guest is dragged from the guest list panel onto a seat that is already occupied, the drop is rejected (no assignment). The user must first unassign the existing guest or use seat swapping. Visual feedback indicates the seat is not a valid drop target when occupied.

14. **Drag guest onto table body (not a specific seat)**: If a guest is dragged onto the table body area but not onto a specific seat indicator, the guest is assigned to the first empty seat on that table. If no empty seats exist, the drop is rejected with visual feedback.

15. **Rotate table with assigned guests**: When a table with assigned guests is rotated, the guest initials rotate with the table and remain at their respective seat positions. No guest assignments are affected by rotation.

16. **Drag interaction conflicting with pan**: DnD interactions (guest drag, seat swap) are only active when the select tool is selected. When the pan tool is active, drag gestures pan the canvas — no DnD occurs. This prevents accidental seat changes while navigating.

17. **Seat swap where source and target are the same seat**: If a user drags a guest and drops it back on the same seat, no change occurs (no-op).

## Design Decisions

### DD-1: Canvas Rendering Technology

**Decision**: Use an HTML/CSS-based canvas (not `<canvas>` element or WebGL). Tables are absolutely positioned `<div>` elements inside a large scrollable/pannable container. The canvas viewport is a `div` with `overflow: hidden` that contains a transformable inner container.
**Reasoning**: HTML/CSS provides accessibility, easy styling with Tailwind/design system tokens, native text rendering, and straightforward event handling. The number of tables in a wedding plan (typically 10-30) does not require the performance of `<canvas>` or WebGL. HTML elements are also easier to make interactive (clicks, hovers, tooltips) and testable.

### DD-2: Pan and Zoom via react-zoom-pan-pinch

**Decision**: The canvas viewport uses `react-zoom-pan-pinch` for panning and zooming. The canvas content is wrapped in `<TransformWrapper>` / `<TransformComponent>`. The library provides `state.scale`, `state.positionX`, `state.positionY` which are used for coordinate conversion (translating screen coordinates to canvas coordinates for table placement, DnD drop targets, etc.). For v1, zoom is fixed at 1.0 (100%) — the zoom display is cosmetic. Panning is the primary interaction.
**Reasoning**: `react-zoom-pan-pinch` provides a well-maintained, battle-tested pan/zoom solution with built-in gesture handling. It replaces manual CSS transform + mouse event panning, reducing custom code and edge cases. The library's coordinate state is essential for correct DnD behavior inside a transformed container — `@dnd-kit/react` needs to know the current pan offset and scale to compute drop positions accurately.

### DD-3: Table Data Model

**Decision**: Use the following TypeScript interfaces for table and seat data:

```typescript
type TableShape = 'rectangular' | 'circular'

interface SeatAssignment {
  seatIndex: number // 0-based index of the seat on the table
  guestId: string // references Guest.id from guest-store
}

interface FloorTable {
  id: string // UUID v4
  badgeId: string // display ID: "T01", "T02", etc.
  label: string // user-editable label: "TABLE ALPHA"
  shape: TableShape
  seatCount: number // 1-20
  x: number // position on canvas (px)
  y: number // position on canvas (px)
  rotation: number // degrees 0-359, default 0
  seats: SeatAssignment[] // assigned guests (sparse — only seats with guests)
}
```

**Reasoning**: `FloorTable` is separate from the `Guest` model — tables own their seat assignments (via `SeatAssignment`), not the other way around. This avoids modifying the existing `Guest` interface. The `badgeId` is a display-only auto-incremented ID for the user to reference tables by short codes. `seats` is a sparse array — only seats with assigned guests have entries, rather than having a fixed-length array with null entries.

### DD-4: Table Auto-Sizing Formula

**Decision**: Table dimensions are computed from seat count using these formulas:

- **Rectangular**:
  - Long-side seats: `Math.ceil(seatCount / 2)`
  - Short-side seats: remaining seats split across the two short ends
  - Width: `longSideSeats * SEAT_SPACING + TABLE_PADDING` (minimum 120px)
  - Height: `80px` base + adjustments for short-side seats (minimum 60px)
  - Seat positions: evenly distributed along the four edges
- **Circular**:
  - Diameter: `Math.max(80, seatCount * 16 + 40)` (scales linearly, minimum 80px)
  - Seat positions: evenly spaced around the circumference at `(360 / seatCount) * i` degrees

Constants:

- `SEAT_SPACING`: 36px (distance between seat centers along an edge)
- `TABLE_PADDING`: 24px (padding at table ends)
- `SEAT_RADIUS`: 14px (visual size of a seat indicator)

**Reasoning**: Linear scaling based on seat count keeps the visual proportional. The minimum sizes prevent tables from becoming too small at low seat counts (1-2 seats). The formulas are deterministic — the same seat count always produces the same size, making layout predictable.

### DD-5: Table ID Badge Auto-Generation

**Decision**: Table badge IDs are auto-generated as "T" + zero-padded sequential number: T01, T02, T03, ..., T99. The counter is derived from the maximum existing badge number + 1, not from the array length (to handle deletions without reuse).
**Reasoning**: Badge IDs should be stable and not change when other tables are deleted. Using max + 1 prevents confusing reuse of IDs. Zero-padding to 2 digits handles up to 99 tables, sufficient for wedding venues.

### DD-6: Table Label Auto-Generation

**Decision**: Default labels cycle through NATO phonetic alphabet names: "TABLE ALPHA", "TABLE BRAVO", "TABLE CHARLIE", "TABLE DELTA", "TABLE ECHO", "TABLE FOXTROT", "TABLE GOLF", "TABLE HOTEL", "TABLE INDIA", "TABLE JULIET", etc. The next label is derived from the count of tables created (total ever, tracked by a counter in localStorage).
**Reasoning**: NATO alphabet provides memorable, distinct names that fit the cyberpunk/military aesthetic. Labels are user-editable, so the auto-generated name is just a starting point.

### DD-7: localStorage Key for Table Data

**Decision**: Use localStorage key `"seating-plan:tables"` for the table data (`FloorTable[]` JSON array) and `"seating-plan:table-counter"` for the badge/label counter.
**Reasoning**: Consistent with the existing `"seating-plan:guests"` key pattern from `guest-store.ts`. Separate counter key avoids recalculating max badge number from the array on every add.

### DD-8: Guest Assignment Model — Tables Own Assignments

**Decision**: Guest-to-seat assignments are stored in the `FloorTable.seats` array, not on the `Guest` object. The existing `Guest.tableAssignment` and `Guest.seatNumber` fields are not used by the canvas — they remain for backward compatibility with the guest list display but are not synchronized.
**Reasoning**: Keeping assignments in the table model is simpler for canvas operations (adding/removing seats, deleting tables). Synchronizing two sources of truth (Guest fields + Table seats) would create consistency bugs. In a future iteration, `Guest.tableAssignment` / `Guest.seatNumber` can be deprecated or derived from the canvas data.

### DD-9: Properties Panel Reuse

**Decision**: The canvas properties panel is a new component (`CanvasPropertiesPanel`) separate from `GuestDetailPanel`. Both panels occupy the same right sidebar position but are mutually exclusive (only one is visible based on the active tab).
**Reasoning**: The canvas properties panel has fundamentally different content (shape toggle, seat slider, no guest metadata). Sharing the `GuestDetailPanel` component would require excessive conditional logic. Two separate panels with the same positioning is cleaner.

### DD-10: Tool State Management

**Decision**: Tool state is managed via `useState` in the canvas page component. The four tools are: `'select' | 'pan' | 'add-circle' | 'add-rectangle'`. Default is `'select'`. After placing a table (add tools), the tool auto-reverts to `'select'`. DnD interactions (guest-to-seat drag, seat swapping, table repositioning) are only active when the select tool is active. When the pan tool is active, all DnD is disabled — drag gestures pan the canvas instead.
**Reasoning**: Simple local state is sufficient. Auto-reverting to select after placement follows the common pattern in design tools (Figma, etc.) where placement tools are "one-shot" — place one item, then return to select. Gating DnD on the select tool prevents conflicting interactions between pan and drag-and-drop.

### DD-11: Seat Click Interaction — Popover Pattern

**Decision**: Clicking a seat opens a small popover anchored to the seat position. For empty seats, the popover shows a list of unassigned guests to pick from. For occupied seats, the popover shows the guest name and an "UNASSIGN" button. Only one popover can be open at a time.
**Reasoning**: Popovers are contextual and don't disrupt the canvas layout. A dropdown anchored to the seat is intuitive — the user clicks where they want to assign, and the UI responds at that location. This avoids the complexity of drag-and-drop from a separate guest list.

### DD-12: Left Sidebar Context — Tab-Aware Content

**Decision**: The `LeftSidebar` component receives the `activeTab` prop and conditionally renders different content:

- Guests tab: "OBJECTS" nav item active, "ADD GUEST" button
- Canvas tab: "LAYOUT" nav item active, "ADD TABLE" button (triggers adding a table via the default add-rectangle tool)

**Reasoning**: The left sidebar is shared app chrome, but its context should reflect the active tab. The design reference shows "LAYOUT" as the active sidebar item on the canvas view. The "ADD TABLE" button provides an alternative entry point to adding tables (in addition to the toolbar).

### DD-13: Mobile Canvas View

**Decision**: On mobile (<768px), the canvas tab shows a simplified placeholder message: "CANVAS_EDITOR // DESKTOP_REQUIRED" with a note encouraging the user to use a larger screen. The full canvas editor is not rendered on mobile.
**Reasoning**: The canvas interaction model (dragging, precise clicking on seats, pan/zoom) is fundamentally designed for pointer-based desktop interaction. Attempting to support touch interactions adds significant complexity without a good UX outcome. This is acceptable for v1 — mobile canvas support can be a future spec.

### DD-14: Library Choice — @dnd-kit/react for Drag & Drop

**Decision**: Use `@dnd-kit/react` (v0.x, the React 19-compatible rewrite) for all drag-and-drop interactions: dragging guests from the guest list onto seats, seat swapping between seats, and table repositioning on the canvas. The library provides `useDraggable` and `useDroppable` hooks. Coordinate transformations account for the pan/zoom state from `react-zoom-pan-pinch`.
**Reasoning**: `@dnd-kit/react` is the latest iteration of the widely-used `@dnd-kit` library, designed for React 19 compatibility. It provides accessible drag-and-drop with keyboard support, customizable collision detection, and coordinate transformation utilities. Using a single DnD library for all drag interactions (guest assignment, seat swapping, table repositioning) provides a consistent interaction model and reduces custom mouse event handling.

### DD-15: Library Choice — react-zoom-pan-pinch for Pan/Zoom

**Decision**: Use `react-zoom-pan-pinch` for canvas pan and zoom. The canvas content is wrapped in `<TransformWrapper>` / `<TransformComponent>`. The library exposes `state.scale`, `state.positionX`, `state.positionY` for coordinate conversion. This replaces the manual CSS `transform: translate()` approach from the original spec.
**Reasoning**: `react-zoom-pan-pinch` is a well-maintained library (500k+ weekly npm downloads) that handles pan/zoom with proper gesture support, inertia, and boundary constraints. It eliminates custom mouse event handling for panning and provides the coordinate state needed by `@dnd-kit/react` for accurate drop position calculation inside a transformed container.

### DD-16: Table Rotation Model

**Decision**: Each `FloorTable` has a `rotation` property (number, 0-359 degrees). Rotation is applied via CSS `transform: rotate({rotation}deg)` on the table's root element. Seats are children of the table element and rotate with it. The rotation control in the properties panel is a numeric input and/or slider (0-360). Rotation is persisted with the table in localStorage.
**Reasoning**: CSS transform rotation is the simplest approach — the browser handles rotating all child elements (seats, labels, badges) automatically. Storing rotation as degrees (0-359) is intuitive and matches CSS rotate() syntax. The properties panel control allows precise angle entry. Seat position calculations remain relative to the table's local coordinate space; only the visual rendering rotates.

### DD-17: Seat Swap Interaction

**Decision**: When the select tool is active, occupied seat indicators are draggable. Dragging an occupied seat to another seat triggers a swap/move:

- **Drop on empty seat** (same or different table): guest moves to the new seat; original seat becomes empty.
- **Drop on occupied seat** (same or different table): both guests swap — each ends up in the other's previous seat.
- **Drop on same seat**: no-op.
  The drag preview shows the guest's initials. Valid drop targets (other seat indicators) highlight during drag.
  **Reasoning**: Seat swapping by drag is intuitive — it mirrors physical card/name-tag swapping. Supporting cross-table swaps adds flexibility without additional complexity (the operation is the same: reassign seat A's guest to seat B and vice versa). Using `@dnd-kit/react` for this leverages the same DnD infrastructure as guest assignment.

### DD-18: Guest List Panel on Canvas

**Decision**: The draggable guest list lives in the existing left sidebar when the canvas tab is active. Below the "ADD TABLE" button, a scrollable list of unassigned guests is rendered. Each guest item is a draggable element (via `useDraggable` from `@dnd-kit/react`). The list shows guest initials and name, styled consistently with the guest list on the Guests tab but more compact. Only unassigned guests appear in the draggable list.
**Reasoning**: Reusing the left sidebar keeps the UI clean — no additional floating panels. The sidebar already switches context based on the active tab (DD-12), so adding a guest list section is a natural extension. Showing only unassigned guests reduces clutter and makes the drag source clear. The existing popover-based assignment (DD-11) remains available as an alternative interaction path.

## UI/UX Details

### Canvas Layout Structure (Desktop)

```
+------------------------------------------------------------------+
|  TOP NAV: PLANNER_V1.0 | CANVAS  GUEST LIST | search  settings   |
+----------+-------------------------------------------+-----------+
|          |  [Select][Pan][Circle][Rect]               |           |
| SIDEBAR  |                              ZOOM: 100%    | PROPERTIES|
|          |                       LAYER: FLOOR_PLAN    | (when     |
| SEATING  |        .  .  .  .  .  .  .  .  .  .       | table is  |
| _01      |        .  .  .  .  .  .  .  .  .  .       | selected) |
|          |        .  .  .  .  .  .  .  .  .  .       |           |
| Props    |        .     +--------T01-+  .  .  .       | INFO      |
| Layout*  |        .     |TABLE ALPHA |  .  .  .       | Label: [_]|
| Objects  |        .     | 0/8 Guests |  .  .  .       | ID: T01   |
| Export   |        .     +--o--o--o---+  .  .  .       |           |
|          |        .  .  .  .  .  .  .  .  .  .       | CONFIG    |
| [ADD     |        .  .  +----T02----+.  .  .  .       | Shape:[R] |
|  TABLE]  |        .  .  |TABLE BRAVO|.  .  .  .       | Seats:[8] |
|          |        .  .  | 3/6 Guests|.  .  .  .       |           |
| HISTORY  |        .  .  +--o--o--o--+.  .  .  .       | [UPDATE]  |
|          |        .  .  .  .  .  .  .  .  .  .       | [DELETE]  |
+----------+-------------------------------------------+-----------+
```

### Toolbar Design

The toolbar is a floating bar positioned `top-4 left-4` relative to the canvas area (not the full page). It has a `bg-surface border border-border rounded` card appearance with 4 icon buttons in a row:

| Tool          | Icon                   | Tooltip          |
| ------------- | ---------------------- | ---------------- |
| Select        | Pointer/cursor arrow   | SELECT_TOOL      |
| Pan           | Hand/grab              | PAN_TOOL         |
| Add Circle    | Circle shape           | ADD_CIRCLE_TABLE |
| Add Rectangle | Rectangle/square shape | ADD_RECT_TABLE   |

Active tool: `bg-primary text-primary-foreground rounded`. Inactive: `text-foreground-muted hover:text-foreground hover:bg-surface-elevated`.

### Table Visual Design

**Rectangular Table:**

```
  o    o    o    o        <- seats (top edge)
+--------------------+
|       [T01]        |    <- badge top-right
|                    |
|   TABLE ALPHA      |    <- label centered
|   o 3/8 Guests     |    <- guest count with icon
|                    |
+--------------------+
  o    o    o    o        <- seats (bottom edge)
```

**Circular Table:**

```
        o
      o   o
     +------+
   o | T02  | o
     |TABLE |
     |BRAVO |
   o |2/6   | o
     +------+
      o   o
        o
```

- Table body: `bg-surface-elevated border border-border rounded` (rectangular) or `rounded-full` (circular)
- Badge: small `bg-primary text-primary-foreground text-caption rounded px-1.5 py-0.5` positioned absolute top-right
- Label: `text-body-sm text-foreground-heading font-semibold` centered
- Guest count: `text-caption text-foreground-muted` with a small person icon
- Selected state: dashed border `border-2 border-dashed border-primary` replaces solid border
- Seats (empty): `w-[14px] h-[14px] rounded-full bg-gray-700 border border-gray-600`
- Seats (occupied): `w-[14px] h-[14px] rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center` showing initials

### Properties Panel Design

Width: 320px (same as `GuestDetailPanel`). Positioned on the right side.

```
+---------------------------+
| PROPERTIES          [X]   |
+---------------------------+
|                           |
| INFORMATION               |
| _________________________ |
|                           |
| TABLE_LABEL               |
| [TABLE ALPHA_________]    |
|                           |
| REFERENCE_ID              |
| T01  (read-only badge)    |
|                           |
| CONFIGURATION             |
| _________________________ |
|                           |
| SHAPE                     |
| [RECTANGULAR] [CIRCULAR]  |
|                           |
| TOTAL_GUESTS              |
| [----o-----------] 8      |
|                           |
| [  UPDATE CHANGES  ]      |  <- btn-primary full-width
|                           |
| [  DELETE ENTITY   ]       |  <- btn-ghost full-width
|                           |
+---------------------------+
```

- Header: `text-label text-foreground-muted tracking-wider` + close button
- Section titles: `text-label text-foreground-muted uppercase tracking-wider border-t border-border pt-4 mt-4`
- Shape toggle: two buttons side by side, active shape has `bg-primary text-primary-foreground`, inactive has `bg-surface-elevated text-foreground-muted`
- Seat slider: native `<input type="range" min="1" max="20">` styled with `accent-color: var(--nc-primary)`, with the current value displayed to the right as `text-heading-5`
- Input fields use the existing `.input` CSS class

### Seat Assignment Popover

```
+------------------------------+
| ASSIGN_GUEST // SEAT_03      |
| ___________________________  |
|                              |
| o  ELARA RIVERA              |
| o  ALEXANDER VANCE           |
| o  MARCUS CHEN               |
|                              |
| (or when occupied:)          |
|                              |
| ASSIGNED // SEAT_03          |
| ___________________________  |
|                              |
| ER  ELARA RIVERA             |
|     LEAD SYSTEMS ARCHITECT   |
|                              |
| [ UNASSIGN ]                 |
+------------------------------+
```

- Popover: `bg-surface border border-border rounded shadow-lg p-3 w-56`
- Positioned anchored to the seat, opening upward or downward based on available space
- Guest list items: clickable rows with initials avatar and name
- Unassign button: `btn-ghost` with red text (`text-red-400`)

### Dot-Grid Background

The canvas background uses a repeating dot pattern:

- Dot color: `var(--nc-gray-700)` (subtle, low contrast)
- Dot size: 1px
- Dot spacing: 24px grid
- Implementation: CSS `background-image` with `radial-gradient`

```css
background-image: radial-gradient(
  circle,
  var(--nc-gray-700) 1px,
  transparent 1px
);
background-size: 24px 24px;
```

### Guest List Drag Source (Left Sidebar)

When the canvas tab is active, the left sidebar shows a scrollable list of unassigned guests below the "ADD TABLE" button:

```
+---------------------------+
| SEATING_01                |
| _________________________ |
|                           |
| Props                     |
| Layout*                   |
| Objects                   |
| Export                    |
|                           |
| [ADD TABLE]               |
|                           |
| UNASSIGNED_GUESTS (5)     |
| _________________________ |
|                           |
| ≡ ER  Elara Rivera        |
| ≡ AV  Alexander Vance     |
| ≡ MC  Marcus Chen         |
| ≡ SN  Sophia Nakamura     |
| ≡ KW  Kai Westbrook       |
|                           |
| HISTORY                   |
+---------------------------+
```

- Each guest row: `flex items-center gap-2 px-2 py-1.5 rounded cursor-grab hover:bg-surface-elevated`
- Drag handle icon: `≡` (grip icon) in `text-foreground-muted`
- Initials avatar: `w-6 h-6 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center`
- Guest name: `text-body-sm text-foreground`
- Section header: `text-label text-foreground-muted uppercase tracking-wider` with count badge

### Drop Zone Visual Feedback

During drag operations (guest-to-seat or seat swap), valid drop targets provide visual feedback:

- **Valid empty seat (drop target)**: `ring-2 ring-primary ring-offset-1 ring-offset-surface-elevated` + slight scale up (`scale-110`)
- **Valid occupied seat (swap target)**: `ring-2 ring-amber-400 ring-offset-1 ring-offset-surface-elevated` (amber ring indicates swap)
- **Invalid drop area**: No highlight change
- **Table body (guest drag)**: If a guest is dragged over a table body (not a specific seat), the table border highlights with `border-primary border-dashed` to indicate it can accept the guest (assigns to first empty seat)

### Drag Preview

- **Guest drag preview**: A compact badge showing the guest's initials, styled as `bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-body-sm font-bold shadow-lg opacity-90`
- **Seat swap drag preview**: Same initials badge style, indicating the guest being moved
- Preview follows the cursor with a slight offset

### Rotation Control (Properties Panel)

Added to the CONFIGURATION section of the properties panel, below the seat count slider:

```
| ROTATION                  |
| [-------o--------] 45°    |
| [0°] [90°] [180°] [270°]  |
```

- Rotation slider: `<input type="range" min="0" max="359" step="1">` styled with `accent-color: var(--nc-primary)`
- Current value display: `text-heading-5` showing degrees with ° symbol
- Preset angle buttons: `text-caption bg-surface-elevated rounded px-2 py-0.5 hover:bg-primary hover:text-primary-foreground` for common angles (0°, 90°, 180°, 270°)
- Clicking a preset immediately sets the rotation value in the form

### Canvas Status Bar

Positioned absolute `top-4 right-4` relative to the canvas area:

```
ZOOM: 100%  |  LAYER: FLOOR_PLAN_MAIN
```

- `text-label text-foreground-muted tracking-wider`
- Separator: `|` character with `mx-2`
- Non-interactive (display only for v1)

## Data Requirements

### FloorTable Interface

```typescript
type TableShape = 'rectangular' | 'circular'

interface SeatAssignment {
  seatIndex: number
  guestId: string
}

interface FloorTable {
  id: string
  badgeId: string
  label: string
  shape: TableShape
  seatCount: number
  x: number
  y: number
  rotation: number // degrees, 0-359
  seats: SeatAssignment[]
}
```

### Table Store API (`src/data/table-store.ts`)

```typescript
const STORAGE_KEY = 'seating-plan:tables'
const COUNTER_KEY = 'seating-plan:table-counter'

function getTables(): FloorTable[]
function getTableById(id: string): FloorTable | undefined
function addTable(
  data: Omit<FloorTable, 'id' | 'badgeId' | 'label'>,
): FloorTable
// auto-generates UUID, badgeId (T01, T02...), label (TABLE ALPHA, etc.)
function updateTable(
  id: string,
  data: Partial<Omit<FloorTable, 'id' | 'badgeId'>>,
): FloorTable | undefined
function deleteTable(id: string): boolean
function assignGuestToSeat(
  tableId: string,
  seatIndex: number,
  guestId: string,
): FloorTable | undefined
function unassignSeat(
  tableId: string,
  seatIndex: number,
): FloorTable | undefined
function swapSeats(
  sourceTableId: string,
  sourceSeatIndex: number,
  targetTableId: string,
  targetSeatIndex: number,
): void
// Swaps guests between two seats. If target is empty, moves guest.
// If both occupied, exchanges guests. Handles cross-table swaps.
function clearGuestAssignments(guestId: string): void
// removes guest from all tables (called when guest is deleted)
```

### Table Sizing Constants

```typescript
const SEAT_SPACING = 36 // px between seat centers
const TABLE_PADDING = 24 // px padding at table ends
const SEAT_RADIUS = 14 // px visual size of seat dot
const MIN_RECT_WIDTH = 120 // px minimum rectangular table width
const MIN_RECT_HEIGHT = 60 // px minimum rectangular table height
const MIN_CIRCLE_DIAMETER = 80 // px minimum circular table diameter

// Rectangular sizing
function getRectTableSize(seatCount: number): { width: number; height: number }

// Circular sizing
function getCircleTableDiameter(seatCount: number): number

// Seat position calculation
function getSeatPositions(
  shape: TableShape,
  seatCount: number,
  tableWidth: number,
  tableHeight: number,
): { x: number; y: number }[]
// Note: seat positions are in local table coordinates (pre-rotation).
// CSS transform: rotate() on the table element handles visual rotation.
```

### NATO Alphabet Labels

```typescript
const NATO_LABELS = [
  'ALPHA',
  'BRAVO',
  'CHARLIE',
  'DELTA',
  'ECHO',
  'FOXTROT',
  'GOLF',
  'HOTEL',
  'INDIA',
  'JULIET',
  'KILO',
  'LIMA',
  'MIKE',
  'NOVEMBER',
  'OSCAR',
  'PAPA',
  'QUEBEC',
  'ROMEO',
  'SIERRA',
  'TANGO',
  'UNIFORM',
  'VICTOR',
  'WHISKEY',
  'XRAY',
  'YANKEE',
  'ZULU',
]
```

### Integration with Guest Store

The canvas reads the guest list from `guest-store.ts` to:

1. Populate the seat assignment dropdown with unassigned guests
2. Display guest initials on assigned seats
3. Validate that assigned guest IDs still exist on render

```typescript
import { getGuests } from './guest-store'
import type { Guest } from './mock-guests'
```

## Technical Plan

### Impact Analysis

#### Affected Areas

| Area                  | Files                                                | Type of Change                                                                                               |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| DnD types & utils     | `src/data/dnd-types.ts`                              | **New** — drag/drop type constants, interfaces, coordinate conversion utility                                |
| Table types & sizing  | `src/data/table-types.ts`                            | **New** — FloorTable, SeatAssignment, TableShape, sizing functions, NATO labels                              |
| Table data layer      | `src/data/table-store.ts`                            | **New** — localStorage CRUD for tables + assignment + swap functions                                         |
| Seat indicator        | `src/components/atoms/SeatIndicator.tsx`             | **New** — seat dot (empty/occupied with initials), droppable zone, draggable when occupied                   |
| Shape toggle          | `src/components/atoms/ShapeToggle.tsx`               | **New** — RECTANGULAR/CIRCULAR toggle button group                                                           |
| Canvas status bar     | `src/components/atoms/CanvasStatusBar.tsx`           | **New** — ZOOM/LAYER display                                                                                 |
| Canvas toolbar        | `src/components/molecules/CanvasToolbar.tsx`         | **New** — floating toolbar with 4 tool buttons                                                               |
| Table element         | `src/components/molecules/CanvasTable.tsx`           | **New** — individual table rendering (shape, badge, label, seats, rotation)                                  |
| Seat popover          | `src/components/molecules/SeatAssignmentPopover.tsx` | **New** — assign/unassign guest popover                                                                      |
| Canvas page component | `src/components/organisms/SeatingCanvas.tsx`         | **New** — main canvas with TransformWrapper, DnD context, tool state, table rendering                        |
| Properties panel      | `src/components/organisms/CanvasPropertiesPanel.tsx` | **New** — right sidebar for editing selected table (label, shape, seats, rotation)                           |
| App root              | `src/App.tsx`                                        | **Modified** — table state, canvas rendering, properties panel, guest deletion cascade, sidebar context      |
| Left sidebar          | `src/components/organisms/LeftSidebar.tsx`           | **Modified** — `activeTab` prop, conditional nav active state, ADD TABLE button, unassigned guests drag list |

#### Integration Points

1. **`App.tsx` → `SeatingCanvas`**: App manages table state (via `table-store.ts`), passes `tables`, `guests`, and all CRUD/assignment callbacks to SeatingCanvas
2. **`App.tsx` → `CanvasPropertiesPanel`**: App renders properties panel conditionally when a canvas table is selected, passing the selected `FloorTable` and update/delete/close callbacks
3. **`App.tsx` → `LeftSidebar`**: Pass `activeTab`, `onAddTable`, `guests`, and `tables` props so sidebar renders context-appropriate content
4. **`table-store.ts` ← `App.tsx`**: `clearGuestAssignments(guestId)` called inside `handleDeleteGuest` to cascade guest deletion to table seat assignments
5. **`CanvasTable` → `SeatAssignmentPopover`**: Clicking a seat opens the popover; the popover receives unassigned guests from parent (SeatingCanvas)
6. **`SeatingCanvas` ↔ `@dnd-kit/react`**: DnD context wraps the canvas; `onDragEnd` routes drops to `onAssignGuest` or `onSwapSeats`
7. **`SeatingCanvas` ↔ `react-zoom-pan-pinch`**: TransformWrapper provides pan state; `screenToCanvas()` from `dnd-types.ts` converts coordinates for table placement and DnD

#### Risk Areas

- **`App.tsx` complexity**: Adding table state management to an already complex component (171 lines). Mitigated by extracting a `useTableState` custom hook in `src/hooks/useTableState.ts`.
- **`LeftSidebar` regression**: Currently has no `activeTab` awareness. Adding conditional rendering requires preserving the existing guests-tab behavior unchanged. Test both tabs after modification.
- **Coordinate system**: Mouse click positions must be translated from screen coordinates to canvas coordinates (accounting for pan offset from `react-zoom-pan-pinch`). The `screenToCanvas()` utility in `dnd-types.ts` centralizes this logic.
- **Guest deletion cascade**: When a guest is deleted via the Guests tab, `clearGuestAssignments` must run and `setTables(getTables())` must refresh table state. This cross-module dependency is wired in `App.tsx`.
- **`@dnd-kit/react` v0.x API**: This is the React 19-compatible rewrite. Its API differs from `@dnd-kit/core`. Use `useDraggable`/`useDroppable` hooks, not the older `DndContext` sensors pattern. Verify import paths after install.
- **DnD inside TransformWrapper**: Drag coordinates must account for the pan/zoom transform. The `screenToCanvas()` utility handles this, but collision detection in `@dnd-kit/react` may need custom modifiers.

### Task Breakdown

#### TASK-001: Table Types and Store

**Description**: Create the table type definitions, sizing geometry functions, and localStorage-backed data layer for canvas tables.

**Affected files**:

- `src/data/table-types.ts` (**new**)
- `src/data/table-store.ts` (**new**)

**Implementation instructions**:

1. Create `src/data/table-types.ts` with these exact exports:

```typescript
// --- Type definitions ---
export type TableShape = 'rectangular' | 'circular'

export interface SeatAssignment {
  seatIndex: number // 0-based seat index
  guestId: string // references Guest.id from guest-store
}

export interface FloorTable {
  id: string // UUID v4
  badgeId: string // "T01", "T02", etc.
  label: string // "TABLE ALPHA", user-editable
  shape: TableShape
  seatCount: number // 1-20
  x: number // canvas position px
  y: number // canvas position px
  rotation: number // degrees 0-359, default 0
  seats: SeatAssignment[] // sparse — only seats with guests
}

// --- Sizing constants ---
export const SEAT_SPACING = 36
export const TABLE_PADDING = 24
export const SEAT_RADIUS = 14
export const MIN_RECT_WIDTH = 120
export const MIN_RECT_HEIGHT = 60
export const MIN_CIRCLE_DIAMETER = 80

// --- NATO phonetic alphabet for auto-labels ---
export const NATO_LABELS = [
  'ALPHA',
  'BRAVO',
  'CHARLIE',
  'DELTA',
  'ECHO',
  'FOXTROT',
  'GOLF',
  'HOTEL',
  'INDIA',
  'JULIET',
  'KILO',
  'LIMA',
  'MIKE',
  'NOVEMBER',
  'OSCAR',
  'PAPA',
  'QUEBEC',
  'ROMEO',
  'SIERRA',
  'TANGO',
  'UNIFORM',
  'VICTOR',
  'WHISKEY',
  'XRAY',
  'YANKEE',
  'ZULU',
]
```

2. In the same file, export these sizing functions:

```typescript
export function getRectTableSize(seatCount: number): {
  width: number
  height: number
} {
  const longSideSeats = Math.max(1, Math.ceil(seatCount / 2))
  const width = Math.max(
    MIN_RECT_WIDTH,
    longSideSeats * SEAT_SPACING + TABLE_PADDING,
  )
  const height = Math.max(MIN_RECT_HEIGHT, 60 + (seatCount <= 2 ? 0 : 20))
  return { width, height }
}

export function getCircleTableDiameter(seatCount: number): number {
  return Math.max(MIN_CIRCLE_DIAMETER, seatCount * 16 + 40)
}

export function getSeatPositions(
  shape: TableShape,
  seatCount: number,
  width: number,
  height: number,
): { x: number; y: number }[] {
  // For rectangular: distribute seats along 4 edges
  //   - Top edge: first Math.ceil(seatCount / 2) seats, evenly spaced
  //   - Bottom edge: remaining seats, evenly spaced
  //   - (For seatCount > 4, optionally place 1 seat on each short end)
  //   - Seat y positions: top seats at -SEAT_RADIUS (above table),
  //     bottom seats at height + SEAT_RADIUS (below table)
  //   - Seat x positions: evenly distributed along width
  // For circular: evenly space around circumference
  //   - Center at (width / 2, height / 2) (which equals diameter / 2)
  //   - Radius = diameter / 2 + SEAT_RADIUS (seats sit outside the circle)
  //   - Angle per seat = (2 * Math.PI / seatCount) * i, starting from top (-PI/2)
  //   - x = centerX + radius * Math.cos(angle)
  //   - y = centerY + radius * Math.sin(angle)
  // Returns positions in LOCAL table coordinates (origin = table top-left)
}
```

Rectangular seat distribution algorithm:

- `topCount = Math.ceil(seatCount / 2)`
- `bottomCount = seatCount - topCount`
- Top seats: for each `i` in `0..topCount-1`, `x = (width / (topCount + 1)) * (i + 1)`, `y = -SEAT_RADIUS`
- Bottom seats: for each `i` in `0..bottomCount-1`, `x = (width / (bottomCount + 1)) * (i + 1)`, `y = height + SEAT_RADIUS`

Circular seat distribution algorithm:

- `radius = (width / 2) + SEAT_RADIUS` (seats outside circle edge)
- `centerX = width / 2`, `centerY = height / 2` (height = diameter for circles)
- For each `i` in `0..seatCount-1`:
  - `angle = ((2 * Math.PI) / seatCount) * i - Math.PI / 2` (start from top)
  - `x = centerX + radius * Math.cos(angle)`
  - `y = centerY + radius * Math.sin(angle)`

3. Create `src/data/table-store.ts` following the exact `guest-store.ts` pattern (see `src/data/guest-store.ts` lines 1-114):

```typescript
import type { FloorTable, TableShape } from './table-types'
import { NATO_LABELS } from './table-types'
import { v4 as uuidv4 } from 'uuid'

export type { FloorTable, TableShape }

const STORAGE_KEY = 'seating-plan:tables'
const COUNTER_KEY = 'seating-plan:table-counter'

let memoryFallback: FloorTable[] | null = null
let counterFallback: number | null = null
```

Internal helpers (private, not exported):

- `readFromStorage(): FloorTable[]` — try `localStorage.getItem(STORAGE_KEY)`, parse JSON, fallback to `memoryFallback ?? []`
- `writeToStorage(tables: FloorTable[]): void` — try `localStorage.setItem(...)`, catch sets `memoryFallback`
- `readCounter(): number` — try `localStorage.getItem(COUNTER_KEY)`, parse as `Number(...)`, fallback to `counterFallback ?? 0`
- `writeCounter(count: number): void` — try `localStorage.setItem(COUNTER_KEY, String(count))`, catch sets `counterFallback`

Exported functions:

- `getTables(): FloorTable[]` — returns `readFromStorage()`
- `getTableById(id: string): FloorTable | undefined` — `readFromStorage().find(t => t.id === id)`
- `addTable(data: { shape: TableShape; seatCount: number; x: number; y: number }): FloorTable`:
  ```
  counter = readCounter()
  newTable = {
    id: uuidv4(),
    badgeId: `T${String(counter + 1).padStart(2, '0')}`,
    label: `TABLE ${NATO_LABELS[counter % 26]}`,
    shape: data.shape,
    seatCount: data.seatCount,
    x: data.x,
    y: data.y,
    rotation: 0,
    seats: [],
  }
  tables = readFromStorage()
  tables.push(newTable)
  writeToStorage(tables)
  writeCounter(counter + 1)
  return newTable
  ```
- `updateTable(id: string, data: Partial<Pick<FloorTable, 'label' | 'shape' | 'seatCount' | 'x' | 'y' | 'rotation'>>): FloorTable | undefined`:
  - Find table by id; if not found return `undefined`
  - Merge `data` into found table
  - If `data.seatCount` is set and less than current, filter out `seats` where `seatIndex >= data.seatCount` (auto-unassign, per AC-27)
  - If `data.rotation` is set, clamp to `((data.rotation % 360) + 360) % 360` (handles negative values)
  - Write back to storage, return updated table
- `deleteTable(id: string): boolean` — filter out table, return `true` if removed
- `assignGuestToSeat(tableId: string, seatIndex: number, guestId: string): FloorTable | undefined`:
  - Find table; if not found return `undefined`
  - Remove any existing `SeatAssignment` at `seatIndex` on this table
  - Push `{ seatIndex, guestId }` to `table.seats`
  - Write and return
- `unassignSeat(tableId: string, seatIndex: number): FloorTable | undefined`:
  - Find table; filter out assignment at `seatIndex`; write and return
- `swapSeats(sourceTableId: string, sourceSeatIndex: number, targetTableId: string, targetSeatIndex: number): void`:
  - Read all tables
  - Find source table and target table (may be same table)
  - Get source assignment (guest at `sourceSeatIndex` on source table)
  - Get target assignment (guest at `targetSeatIndex` on target table, may be `undefined`)
  - If source is empty, return (no-op)
  - If same table and same seat, return (no-op, per EC-17)
  - Remove source assignment from source table
  - Remove target assignment from target table (if exists)
  - If target had a guest, add that guest to source table at `sourceSeatIndex`
  - Add source guest to target table at `targetSeatIndex`
  - Write all tables back to storage
- `clearGuestAssignments(guestId: string): void`:
  - Read all tables
  - For each table, filter `seats` to remove entries where `guestId` matches
  - Write back (only if any changes were made)

**Guardrails**: G-16 (no `setState` in `useEffect` — N/A, this is pure data layer), G-17 (single source of truth — tables own assignments)

**Dependencies**: None (independent — can run in Phase 1)

**Acceptance criteria**:

- Both files compile with `tsc -b` (no errors, no unused variables)
- `addTable` auto-generates badgeId (`T01`, `T02`, ...) and label (`TABLE ALPHA`, `TABLE BRAVO`, ...) correctly
- `addTable` defaults `rotation` to `0` and `seats` to `[]`
- `updateTable` with reduced `seatCount` auto-unassigns seats beyond new count (AC-27, EC-4)
- `updateTable` with `rotation: -10` clamps to `350`; `rotation: 400` clamps to `40`
- `swapSeats` correctly: moves guest to empty seat, swaps two occupied seats, handles cross-table, no-ops on same seat (EC-17)
- `clearGuestAssignments` removes a guest from all tables (AC-29, EC-6)
- `getRectTableSize(8)` returns wider table than `getRectTableSize(4)` (AC-10)
- `getCircleTableDiameter(8)` returns larger diameter than `getCircleTableDiameter(4)` (AC-11)
- `getSeatPositions` returns correct count of positions for both shapes
- All functions handle empty localStorage gracefully (no crashes on first load)

---

#### TASK-002: Canvas Atom Components

**Description**: Create three atom-level components: SeatIndicator (seat dot with empty/occupied states), ShapeToggle (rectangular/circular toggle group), and CanvasStatusBar (static zoom/layer display).

**Affected files**:

- `src/components/atoms/SeatIndicator.tsx` (**new**)
- `src/components/atoms/ShapeToggle.tsx` (**new**)
- `src/components/atoms/CanvasStatusBar.tsx` (**new**)

**Implementation instructions**:

**SeatIndicator.tsx**:

```typescript
import type { ReactNode } from 'react'

interface Props {
  isEmpty: boolean
  initials?: string
  isSelected?: boolean
  isDropTarget?: boolean // highlighted during DnD hover
  isSwapTarget?: boolean // amber highlight for occupied seat during DnD hover
  onClick?: (e: React.MouseEvent) => void
  children?: ReactNode // slot for DnD wrapper (useDroppable/useDraggable element)
}
```

1. Render a `<button>` element (not `<div>` — keyboard accessible per G-11) with dimensions `w-[14px] h-[14px] rounded-full` and `aria-label={isEmpty ? 'Empty seat' : \`Seat: ${initials}\`}`
2. **Empty state**: `bg-gray-700 border border-gray-600`
3. **Occupied state**: `bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center` — render `initials` text inside
4. **Selected state** (`isSelected`): add `ring-2 ring-primary ring-offset-1 ring-offset-surface-elevated`
5. **Drop target highlight** (`isDropTarget`): add `ring-2 ring-primary ring-offset-1 ring-offset-surface-elevated scale-110 transition-transform`
6. **Swap target highlight** (`isSwapTarget`): add `ring-2 ring-amber-400 ring-offset-1 ring-offset-surface-elevated` (amber ring indicates swap will occur)
7. Base interactivity: `cursor-pointer hover:ring-2 hover:ring-primary/50 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2` (G-8, G-11)
8. Click handler: `onClick` with `e.stopPropagation()` handled by caller (CanvasTable)

**ShapeToggle.tsx**:

```typescript
import type { TableShape } from '../../data/table-types'

interface Props {
  value: TableShape
  onChange: (shape: TableShape) => void
}
```

1. Render two `<button>` elements side by side in a `flex rounded overflow-hidden border border-border` container
2. Button text: `"RECTANGULAR"` and `"CIRCULAR"` — use `text-label tracking-wider` typography (G-13)
3. Active button (matches `value`): `bg-primary text-primary-foreground px-3 py-2 cursor-pointer`
4. Inactive button: `bg-surface-elevated text-foreground-muted hover:text-foreground px-3 py-2 cursor-pointer`
5. Both buttons: `flex-1 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2` (G-8)
6. `onClick` calls `onChange('rectangular')` or `onChange('circular')`

**CanvasStatusBar.tsx**:

```typescript
// No props — static display for v1
```

1. Render: `<div className="text-label text-foreground-muted tracking-wider flex items-center gap-2">ZOOM: 100%<span className="mx-2">|</span>LAYER: FLOOR_PLAN_MAIN</div>`
2. No interactivity. Parent positions it absolute `top-4 right-4`.

**Project context**:

- Convention: function declaration (`function SeatIndicator(...) { }`) with `default export` (see `IconButton.tsx` lines 1-21 for reference pattern)
- `Props` interface named `Props`, defined above the component function
- No semicolons, single quotes, trailing commas, 2-space indent
- Import `type { TableShape }` from `../../data/table-types` (verbatimModuleSyntax — G-43 in tsconfig)
- Use `<button>` for interactive elements, not `<div onClick>` (G-11)

**Guardrails**: G-5 (4px border radius — use `rounded`), G-8 (`focus-visible` for buttons), G-11 (keyboard accessible), G-13 (typography classes)

**Dependencies**: TASK-001 (for `TableShape` type import)

**Acceptance criteria**:

- All 3 files compile with `tsc -b`
- `SeatIndicator` renders 14x14 circle, shows initials when occupied, applies ring highlights for drop/swap targets
- `ShapeToggle` toggles between two states with cobalt active highlight
- `CanvasStatusBar` displays static text
- All components follow project conventions (function declarations, default exports, Props interface)

---

#### TASK-003: Canvas Molecule Components

**Description**: Create three molecule components: CanvasToolbar (floating 4-tool toolbar), CanvasTable (table rendering with seats, badge, rotation), and SeatAssignmentPopover (assign/unassign guest popover).

**Affected files**:

- `src/components/molecules/CanvasToolbar.tsx` (**new**)
- `src/components/molecules/CanvasTable.tsx` (**new**)
- `src/components/molecules/SeatAssignmentPopover.tsx` (**new**)

**Implementation instructions**:

**CanvasToolbar.tsx**:

```typescript
import { LuMousePointer2, LuHand, LuCircle, LuSquare } from 'react-icons/lu'

export type CanvasTool = 'select' | 'pan' | 'add-circle' | 'add-rectangle'

interface Props {
  activeTool: CanvasTool
  onToolChange: (tool: CanvasTool) => void
}
```

1. Export `CanvasTool` type from this file (other components import it here)
2. Define a `tools` array for rendering:
   ```typescript
   const tools: { id: CanvasTool; icon: ReactNode; label: string }[] = [
     { id: 'select', icon: <LuMousePointer2 size={16} />, label: 'SELECT_TOOL' },
     { id: 'pan', icon: <LuHand size={16} />, label: 'PAN_TOOL' },
     { id: 'add-circle', icon: <LuCircle size={16} />, label: 'ADD_CIRCLE_TABLE' },
     { id: 'add-rectangle', icon: <LuSquare size={16} />, label: 'ADD_RECT_TABLE' },
   ]
   ```
3. Render container: `<div className="bg-surface border border-border rounded p-1 flex gap-1">`
4. Each tool button: `<button>` with `aria-label={tool.label}`, `title={tool.label}` (tooltip)
5. Active tool: `className="p-2 rounded bg-primary text-primary-foreground cursor-pointer"` (G-8)
6. Inactive tool: `className="p-2 rounded text-foreground-muted hover:text-foreground hover:bg-surface-elevated cursor-pointer"`
7. All buttons: `focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2`
8. Click handler: `onClick={() => onToolChange(tool.id)}`

   **Icon verification** (G-21): The Lucide icons `LuMousePointer2`, `LuHand`, `LuCircle`, `LuSquare` are verified exports from `react-icons/lu`. If `LuMousePointer2` is unavailable, fall back to `LuPointer` or `LuMouse`. Icon sizing via `size` prop (G-22).

**CanvasTable.tsx**:

```typescript
import type { FloorTable } from '../../data/table-types'
import type { Guest } from '../../data/mock-guests'
import {
  getRectTableSize,
  getCircleTableDiameter,
  getSeatPositions,
} from '../../data/table-types'
import { LuUsers } from 'react-icons/lu'
import SeatIndicator from '../atoms/SeatIndicator'

interface Props {
  table: FloorTable
  isSelected: boolean
  guests: Guest[] // full guest list for initials lookup
  onSelect: () => void
  onSeatClick: (seatIndex: number, anchorRect: DOMRect) => void
  activeSeatIndex: number | null // currently open popover seat
}
```

1. Compute table dimensions:
   ```typescript
   const { width, height } =
     table.shape === 'rectangular'
       ? getRectTableSize(table.seatCount)
       : (() => {
           const d = getCircleTableDiameter(table.seatCount)
           return { width: d, height: d }
         })()
   ```
2. Compute seat positions: `const seatPositions = getSeatPositions(table.shape, table.seatCount, width, height)`
3. Compute assigned guest count: `const assignedCount = table.seats.length`
4. Render **root container** — absolutely positioned at `(table.x, table.y)` with rotation:
   ```tsx
   <div
     className="absolute"
     style={{
       left: table.x,
       top: table.y,
       width: width + SEAT_RADIUS * 2,       // extra space for seats outside edges
       height: height + SEAT_RADIUS * 2,
       transform: `rotate(${table.rotation}deg)`,
       transformOrigin: 'center center',
     }}
     onMouseDown={(e) => {
       e.stopPropagation()
       onSelect()
     }}
   >
   ```
5. Render **table body** inside root (offset by `SEAT_RADIUS` to center within the extra seat space):
   ```tsx
   <div
     className={`absolute ${
       table.shape === 'circular' ? 'rounded-full' : 'rounded'
     } bg-surface-elevated ${
       isSelected
         ? 'border-2 border-dashed border-primary'
         : 'border border-border'
     }`}
     style={{
       left: SEAT_RADIUS,
       top: SEAT_RADIUS,
       width,
       height,
     }}
   >
   ```
6. Inside table body:
   - **Badge** (top-right): `<span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-caption rounded px-1.5 py-0.5 font-bold">{table.badgeId}</span>`
   - **Label** (centered): `<p className="text-body-sm text-foreground-heading font-semibold text-center">{table.label}</p>`
   - **Guest count**: `<p className="text-caption text-foreground-muted flex items-center justify-center gap-1"><LuUsers size={10} />{assignedCount}/{table.seatCount} Guests</p>`
7. Render **seat indicators** — positioned absolutely within the root container (positions from `getSeatPositions` plus `SEAT_RADIUS` offset):

   ```tsx
   {
     seatPositions.map((pos, i) => {
       const assignment = table.seats.find((s) => s.seatIndex === i)
       const guest = assignment
         ? guests.find((g) => g.id === assignment.guestId)
         : null
       const initials = guest
         ? `${guest.firstName[0]}${guest.lastName[0]}`
         : undefined
       return (
         <div
           key={i}
           className="absolute"
           style={{
             left: pos.x + SEAT_RADIUS - 7, // center the 14px indicator
             top: pos.y + SEAT_RADIUS - 7,
           }}
         >
           <SeatIndicator
             isEmpty={!assignment}
             initials={initials}
             isSelected={activeSeatIndex === i}
             onClick={(e) => {
               e.stopPropagation()
               const rect = (e.target as HTMLElement).getBoundingClientRect()
               onSeatClick(i, rect)
             }}
           />
         </div>
       )
     })
   }
   ```

   **Note**: DnD integration (droppable seats, draggable occupied seats) is wired in TASK-004 (SeatingCanvas) by wrapping SeatIndicator elements with `useDroppable`/`useDraggable` hooks. This component provides the visual rendering; DnD behavior is layered on top. This avoids importing `@dnd-kit/react` directly in this molecule and keeps TASK-003 independent of TASK-006's library installation.

**SeatAssignmentPopover.tsx**:

```typescript
import { useEffect, useRef } from 'react'
import type { Guest } from '../../data/mock-guests'
import Avatar from '../atoms/Avatar'

interface Props {
  seatIndex: number
  tableLabel: string
  assignedGuest: Guest | null
  unassignedGuests: Guest[]
  onAssign: (guestId: string) => void
  onUnassign: () => void
  onClose: () => void
  anchorRect: DOMRect // screen-space rect of the seat button
}
```

1. Use a `useRef<HTMLDivElement>` and a click-outside handler (G-19):
   ```typescript
   const ref = useRef<HTMLDivElement>(null)
   useEffect(() => {
     function handleClickOutside(e: MouseEvent) {
       if (ref.current && !ref.current.contains(e.target as Node)) {
         onClose()
       }
     }
     document.addEventListener('mousedown', handleClickOutside)
     return () => document.removeEventListener('mousedown', handleClickOutside)
   }, [onClose])
   ```
2. Position: `fixed` positioning calculated from `anchorRect`:
   - `left: anchorRect.left + anchorRect.width / 2 - 112` (center the 224px / `w-56` popover)
   - `top: anchorRect.bottom + 8` (8px below seat)
   - If the popover would go below viewport, position above: `top: anchorRect.top - popoverHeight - 8`
3. Container styling: `<div ref={ref} className="fixed z-50 bg-surface border border-border rounded shadow-lg p-3 w-56" style={{ left, top }}>`
4. **Empty seat** (`assignedGuest === null`):
   - Header: `<p className="text-label text-foreground-muted tracking-wider border-b border-border pb-2 mb-2">ASSIGN_GUEST // SEAT_{String(seatIndex + 1).padStart(2, '0')}</p>`
   - If `unassignedGuests.length === 0`: show `<p className="text-caption text-foreground-muted">NO_UNASSIGNED_GUESTS // ALL_ALLOCATED</p>` (EC-5)
   - Else: scrollable list (`max-h-48 overflow-y-auto`) of guest rows:
     ```tsx
     {
       unassignedGuests.map((guest) => (
         <button
           key={guest.id}
           className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-elevated cursor-pointer text-left"
           onClick={() => onAssign(guest.id)}
         >
           <Avatar
             firstName={guest.firstName}
             lastName={guest.lastName}
             size="sm"
           />
           <span className="text-body-sm text-foreground">
             {guest.firstName} {guest.lastName}
           </span>
         </button>
       ))
     }
     ```
5. **Occupied seat** (`assignedGuest !== null`):
   - Header: `<p className="text-label text-foreground-muted tracking-wider border-b border-border pb-2 mb-2">ASSIGNED // SEAT_{String(seatIndex + 1).padStart(2, '0')}</p>`
   - Guest info: Avatar + name + role
   - Unassign button: `<button className="btn-ghost w-full mt-2 text-red-400 hover:text-red-300" onClick={onUnassign}>UNASSIGN</button>`

**Project context**:

- Import `Avatar` from `../atoms/Avatar` (existing atom — `sm` size gives `w-6 h-6`)
- Import `LuMousePointer2`, `LuHand`, `LuCircle`, `LuSquare`, `LuUsers` from `react-icons/lu` (G-20, G-21, G-22)
- Import types with `import type { ... }` (verbatimModuleSyntax)
- Convention: function declarations, default export, `Props` interface
- No `@dnd-kit/react` imports in this task — DnD wiring is in TASK-004

**Guardrails**: G-8 (focus-visible for buttons), G-11 (keyboard accessible — using `<button>` elements), G-13 (typography classes), G-20 (Lucide only), G-21 (verify icon names), G-22 (size prop)

**Dependencies**: TASK-001 (types + sizing functions), TASK-002 (SeatIndicator, Avatar atoms)

**Acceptance criteria**:

- All 3 files compile with `tsc -b`
- CanvasToolbar renders 4 tool buttons with correct icons, active state highlighted in cobalt (AC-4, AC-5)
- CanvasTable renders rectangular tables with `rounded` and circular tables with `rounded-full` (AC-9)
- CanvasTable auto-sizes based on `seatCount` (AC-10, AC-11)
- CanvasTable applies CSS `transform: rotate(Xdeg)` for rotated tables (AC-35)
- CanvasTable displays badge, label, guest count, and seat indicators at computed positions (AC-9)
- SeatAssignmentPopover shows unassigned guest list for empty seats and unassign button for occupied seats (AC-23, AC-25)
- Empty state shows "NO_UNASSIGNED_GUESTS // ALL_ALLOCATED" when all guests are assigned (EC-5)

---

#### TASK-004: Canvas Organisms

**Description**: Create the main SeatingCanvas organism (canvas area with TransformWrapper, DnD context, tool state, table rendering) and the CanvasPropertiesPanel organism (right sidebar for editing selected table properties including rotation).

**Affected files**:

- `src/components/organisms/SeatingCanvas.tsx` (**new**)
- `src/components/organisms/CanvasPropertiesPanel.tsx` (**new**)

**Implementation instructions**:

**SeatingCanvas.tsx**:

```typescript
import { useState, useCallback, useRef } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import { DragDropProvider } from '@dnd-kit/react'
import type { FloorTable, TableShape } from '../../data/table-types'
import type { Guest } from '../../data/mock-guests'
import type {
  DragGuestData,
  DragSeatData,
  DropSeatData,
} from '../../data/dnd-types'
import {
  DRAG_TYPE_GUEST,
  DRAG_TYPE_SEAT,
  screenToCanvas,
} from '../../data/dnd-types'
import CanvasToolbar from '../molecules/CanvasToolbar'
import type { CanvasTool } from '../molecules/CanvasToolbar'
import CanvasTable from '../molecules/CanvasTable'
import SeatAssignmentPopover from '../molecules/SeatAssignmentPopover'
import CanvasStatusBar from '../atoms/CanvasStatusBar'

interface Props {
  tables: FloorTable[]
  guests: Guest[]
  selectedTableId: string | null
  onSelectTable: (id: string | null) => void
  onAddTable: (data: {
    shape: TableShape
    seatCount: number
    x: number
    y: number
  }) => void
  onUpdateTable: (
    id: string,
    data: Partial<
      Pick<FloorTable, 'label' | 'shape' | 'seatCount' | 'x' | 'y' | 'rotation'>
    >,
  ) => void
  onDeleteTable: (id: string) => void
  onAssignGuest: (tableId: string, seatIndex: number, guestId: string) => void
  onUnassignSeat: (tableId: string, seatIndex: number) => void
  onSwapSeats: (
    srcTableId: string,
    srcSeatIdx: number,
    tgtTableId: string,
    tgtSeatIdx: number,
  ) => void
}
```

1. Internal state:

   ```typescript
   const [activeTool, setActiveTool] = useState<CanvasTool>('select')
   const [activeSeat, setActiveSeat] = useState<{
     tableId: string
     seatIndex: number
     anchorRect: DOMRect
   } | null>(null)
   const transformRef = useRef<ReactZoomPanPinchRef>(null)
   ```

2. **DnD handler** — `onDragEnd` callback for `DragDropProvider`:

   ```typescript
   const handleDragEnd = useCallback(
     (event) => {
       // event.operation contains source (draggable) and target (droppable) data
       // Route based on drag type:
       // - DRAG_TYPE_GUEST: call onAssignGuest(targetTableId, targetSeatIndex, guestId)
       //   If target is table body (not specific seat), find first empty seat index
       // - DRAG_TYPE_SEAT: call onSwapSeats(sourceTableId, sourceSeatIndex, targetTableId, targetSeatIndex)
       // If no valid target, no-op
     },
     [onAssignGuest, onSwapSeats, tables],
   )
   ```

3. **Canvas click handler** — for placing tables and deselecting:

   ```typescript
   const handleCanvasClick = useCallback(
     (e: React.MouseEvent) => {
       // Close any open popover
       setActiveSeat(null)

       if (activeTool === 'add-circle' || activeTool === 'add-rectangle') {
         // Convert screen click to canvas coordinates using transformRef
         const state = transformRef.current?.instance.transformState
         const canvasPos = screenToCanvas(
           e.clientX,
           e.clientY,
           state?.scale ?? 1,
           state?.positionX ?? 0,
           state?.positionY ?? 0,
         )
         // Offset for the canvas container's screen position
         const containerRect = (
           e.currentTarget as HTMLElement
         ).getBoundingClientRect()
         const x =
           (e.clientX - containerRect.left - (state?.positionX ?? 0)) /
           (state?.scale ?? 1)
         const y =
           (e.clientY - containerRect.top - (state?.positionY ?? 0)) /
           (state?.scale ?? 1)

         onAddTable({
           shape: activeTool === 'add-circle' ? 'circular' : 'rectangular',
           seatCount: 8,
           x,
           y,
         })
         setActiveTool('select') // auto-revert to select (DD-10)
         return
       }

       // Select tool — click on empty canvas deselects
       if (activeTool === 'select') {
         onSelectTable(null)
       }
     },
     [activeTool, onAddTable, onSelectTable],
   )
   ```

4. **Table drag handling** — for repositioning tables (select tool only):
   - Use `@dnd-kit/react`'s `useDraggable` on each CanvasTable's root, OR use mouse events:
   - `onMouseDown` on table: set `dragTableId`, record start position
   - `onMouseMove` on canvas: if dragging, compute delta, call `onUpdateTable(dragTableId, { x: newX, y: newY })`
   - `onMouseUp`: clear drag state, position is already persisted via `onUpdateTable`
   - Only when `activeTool === 'select'` (AC-21: pan tool ignores table drag)

5. **Unassigned guests computation** (for popover):

   ```typescript
   const allAssignedGuestIds = new Set(
     tables.flatMap((t) => t.seats.map((s) => s.guestId)),
   )
   const unassignedGuests = guests.filter((g) => !allAssignedGuestIds.has(g.id))
   ```

6. **Render structure**:

   ```tsx
   <>
     {/* Mobile placeholder */}
     <div className="md:hidden flex-1 flex items-center justify-center text-foreground-muted text-label tracking-wider">
       CANVAS_EDITOR // DESKTOP_REQUIRED
     </div>

     {/* Desktop canvas */}
     <div className="hidden md:flex flex-1 relative overflow-hidden bg-background">
       <DragDropProvider onDragEnd={handleDragEnd}>
         <TransformWrapper
           ref={transformRef}
           disabled={activeTool !== 'pan'}
           initialScale={1}
           minScale={1}
           maxScale={1}
           panning={{ disabled: activeTool !== 'pan' }}
         >
           <TransformComponent
             wrapperStyle={{ width: '100%', height: '100%' }}
             contentStyle={{ width: '100%', height: '100%' }}
           >
             {/* Canvas background with dot grid */}
             <div
               className="w-full h-full min-h-full relative"
               style={{
                 backgroundImage:
                   'radial-gradient(circle, var(--nc-gray-700) 1px, transparent 1px)',
                 backgroundSize: '24px 24px',
                 minWidth: '3000px',
                 minHeight: '2000px',
               }}
               onClick={handleCanvasClick}
             >
               {tables.map((table) => (
                 <CanvasTable
                   key={table.id}
                   table={table}
                   isSelected={selectedTableId === table.id}
                   guests={guests}
                   onSelect={() => onSelectTable(table.id)}
                   onSeatClick={(seatIndex, anchorRect) => {
                     setActiveSeat({ tableId: table.id, seatIndex, anchorRect })
                   }}
                   activeSeatIndex={
                     activeSeat?.tableId === table.id
                       ? activeSeat.seatIndex
                       : null
                   }
                 />
               ))}
             </div>
           </TransformComponent>
         </TransformWrapper>

         {/* Toolbar — outside TransformComponent so it doesn't pan */}
         <div className="absolute top-4 left-4 z-10">
           <CanvasToolbar
             activeTool={activeTool}
             onToolChange={setActiveTool}
           />
         </div>

         {/* Status bar — outside TransformComponent */}
         <div className="absolute top-4 right-4 z-10">
           <CanvasStatusBar />
         </div>
       </DragDropProvider>

       {/* Seat assignment popover — outside TransformComponent, fixed positioned */}
       {activeSeat &&
         (() => {
           const table = tables.find((t) => t.id === activeSeat.tableId)
           if (!table) return null
           const assignment = table.seats.find(
             (s) => s.seatIndex === activeSeat.seatIndex,
           )
           const assignedGuest = assignment
             ? (guests.find((g) => g.id === assignment.guestId) ?? null)
             : null
           return (
             <SeatAssignmentPopover
               seatIndex={activeSeat.seatIndex}
               tableLabel={table.label}
               assignedGuest={assignedGuest}
               unassignedGuests={unassignedGuests}
               onAssign={(guestId) => {
                 onAssignGuest(table.id, activeSeat.seatIndex, guestId)
                 setActiveSeat(null)
               }}
               onUnassign={() => {
                 onUnassignSeat(table.id, activeSeat.seatIndex)
                 setActiveSeat(null)
               }}
               onClose={() => setActiveSeat(null)}
               anchorRect={activeSeat.anchorRect}
             />
           )
         })()}
     </div>
   </>
   ```

   **Note on `DragDropProvider`**: `@dnd-kit/react` v0.x uses `DragDropProvider` (not `DndContext` from `@dnd-kit/core`). Verify the exact import after installing in TASK-006. If the API differs, adjust the import — the key integration point is the `onDragEnd` callback that routes drops to `onAssignGuest` or `onSwapSeats`.

**CanvasPropertiesPanel.tsx**:

```typescript
import { useState, useEffect } from 'react'
import { LuX } from 'react-icons/lu'
import type { FloorTable, TableShape } from '../../data/table-types'
import IconButton from '../atoms/IconButton'
import ShapeToggle from '../atoms/ShapeToggle'

interface Props {
  table: FloorTable
  onUpdate: (data: {
    label: string
    shape: TableShape
    seatCount: number
    rotation: number
  }) => void
  onDelete: () => void
  onClose: () => void
}
```

1. Internal form state — reset when `table.id` changes:

   ```typescript
   const [label, setLabel] = useState(table.label)
   const [shape, setShape] = useState<TableShape>(table.shape)
   const [seatCount, setSeatCount] = useState(table.seatCount)
   const [rotation, setRotation] = useState(table.rotation)

   useEffect(() => {
     setLabel(table.label)
     setShape(table.shape)
     setSeatCount(table.seatCount)
     setRotation(table.rotation)
   }, [table.id]) // only reset when a DIFFERENT table is selected
   ```

   **Note**: Using `useEffect` here is acceptable because we're synchronizing form state to an external selection change (table.id), not deriving state from props. This is the "synchronize with external system" pattern, not the anti-pattern warned about in G-16.

2. Panel layout — mirrors `GuestDetailPanel` desktop aside (see `GuestDetailPanel.tsx` line 52):

   ```tsx
   <aside className="hidden md:flex flex-col w-[320px] min-w-[320px] bg-surface border-l border-border h-full overflow-y-auto">
   ```

3. **Header**:

   ```tsx
   <div className="flex items-center justify-between px-4 py-3 border-b border-border">
     <span className="text-label text-foreground-muted tracking-wider uppercase">
       PROPERTIES
     </span>
     <IconButton onClick={onClose} label="Close properties">
       <LuX size={20} />
     </IconButton>
   </div>
   ```

4. **INFORMATION section**:

   ```tsx
   <div className="px-4 pt-4">
     <p className="text-label text-foreground-muted uppercase tracking-wider border-t border-border pt-4">
       INFORMATION
     </p>
     <div className="mt-3">
       <label className="text-label text-foreground-muted tracking-wider block mb-1">
         TABLE_LABEL
       </label>
       <input
         type="text"
         className="input w-full"
         value={label}
         onChange={(e) => setLabel(e.target.value)}
       />
     </div>
     <div className="mt-3">
       <label className="text-label text-foreground-muted tracking-wider block mb-1">
         REFERENCE_ID
       </label>
       <span className="badge">{table.badgeId}</span>
     </div>
   </div>
   ```

5. **CONFIGURATION section**:

   ```tsx
   <div className="px-4 pt-4">
     <p className="text-label text-foreground-muted uppercase tracking-wider border-t border-border pt-4">
       CONFIGURATION
     </p>

     {/* Shape toggle */}
     <div className="mt-3">
       <label className="text-label text-foreground-muted tracking-wider block mb-1">
         SHAPE
       </label>
       <ShapeToggle value={shape} onChange={setShape} />
     </div>

     {/* Seat count slider */}
     <div className="mt-3">
       <label className="text-label text-foreground-muted tracking-wider block mb-1">
         TOTAL_GUESTS
       </label>
       <div className="flex items-center gap-3">
         <input
           type="range"
           min={1}
           max={20}
           value={seatCount}
           onChange={(e) => setSeatCount(Number(e.target.value))}
           className="flex-1 accent-[var(--nc-primary)]"
         />
         <span className="text-heading-5 text-foreground-heading w-8 text-right">
           {seatCount}
         </span>
       </div>
     </div>

     {/* Rotation slider */}
     <div className="mt-3">
       <label className="text-label text-foreground-muted tracking-wider block mb-1">
         ROTATION
       </label>
       <div className="flex items-center gap-3">
         <input
           type="range"
           min={0}
           max={359}
           step={1}
           value={rotation}
           onChange={(e) => setRotation(Number(e.target.value))}
           className="flex-1 accent-[var(--nc-primary)]"
         />
         <span className="text-heading-5 text-foreground-heading w-12 text-right">
           {rotation}°
         </span>
       </div>
       {/* Preset angle buttons */}
       <div className="flex gap-2 mt-2">
         {[0, 90, 180, 270].map((angle) => (
           <button
             key={angle}
             className={`text-caption px-2 py-0.5 rounded cursor-pointer ${
               rotation === angle
                 ? 'bg-primary text-primary-foreground'
                 : 'bg-surface-elevated text-foreground-muted hover:bg-primary hover:text-primary-foreground'
             } focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2`}
             onClick={() => setRotation(angle)}
           >
             {angle}°
           </button>
         ))}
       </div>
     </div>
   </div>
   ```

6. **Action buttons**:
   ```tsx
   <div className="px-4 py-4 mt-auto border-t border-border">
     <button
       className="btn-primary w-full"
       onClick={() => onUpdate({ label, shape, seatCount, rotation })}
     >
       UPDATE CHANGES
     </button>
     <button
       className="btn-ghost w-full mt-2 text-foreground-muted"
       onClick={onDelete}
     >
       DELETE ENTITY
     </button>
   </div>
   ```

**Project context**:

- Import `TransformWrapper`, `TransformComponent` from `react-zoom-pan-pinch` (installed in TASK-006)
- Import `DragDropProvider` from `@dnd-kit/react` (installed in TASK-006)
- Import DnD types from `../../data/dnd-types`
- Import molecules: `CanvasToolbar`, `CanvasTable`, `SeatAssignmentPopover`
- Import atoms: `CanvasStatusBar`, `ShapeToggle`, `IconButton`
- Mirror `GuestDetailPanel` desktop aside pattern (`hidden md:flex flex-col w-[320px]...`)
- Convention: function declarations, default export, no semicolons, single quotes

**Guardrails**: G-3 (use `var(--nc-*)` for CSS custom properties in inline styles), G-5 (4px border radius), G-8 (focus-visible for buttons), G-11 (all interactive elements keyboard accessible), G-13 (typography classes), G-22 (icon size prop)

**Dependencies**: TASK-001 (types + sizing), TASK-002 (atoms), TASK-003 (molecules), TASK-006 (libraries installed)

**Acceptance criteria**:

- Both files compile with `tsc -b`
- SeatingCanvas renders dot-grid background (AC-1, AC-2)
- Mobile (<768px) shows "CANVAS_EDITOR // DESKTOP_REQUIRED" placeholder (DD-13)
- Canvas wraps content in TransformWrapper for panning (AC-6)
- Toolbar renders at top-left, does not move with pan (AC-4)
- Status bar renders at top-right (AC-3)
- Click with add-circle/add-rectangle tool places table at click position and auto-reverts to select (AC-7, AC-8, DD-10)
- Click on empty canvas (select tool) deselects table (AC-14)
- Seat click opens SeatAssignmentPopover (AC-23)
- CanvasPropertiesPanel shows label input, ID badge, shape toggle, seat slider, rotation slider with presets (AC-15)
- UPDATE CHANGES calls `onUpdate` with form state (AC-16, AC-17, AC-18, AC-34)
- DELETE ENTITY calls `onDelete` (AC-22)
- DnD context routes guest drops to `onAssignGuest` and seat drops to `onSwapSeats` (AC-30-32, AC-37-40)
- Pan tool disables table interaction and DnD (AC-21, EC-16)

---

#### TASK-005: Integration — App.tsx & LeftSidebar Updates

**Description**: Wire the canvas into the app shell. Add table state management to App.tsx via a custom hook. Render SeatingCanvas and CanvasPropertiesPanel when canvas tab is active. Modify LeftSidebar to show tab-aware content with draggable guest list.

**Affected files**:

- `src/hooks/useTableState.ts` (**new**)
- `src/App.tsx` (**modified**)
- `src/components/organisms/LeftSidebar.tsx` (**modified**)

**Implementation instructions**:

**`src/hooks/useTableState.ts`** (new file):

Extract table state management into a custom hook to keep `App.tsx` manageable (it's already 171 lines):

```typescript
import { useState, useCallback } from 'react'
import type { FloorTable, TableShape } from '../data/table-types'
import {
  getTables,
  addTable as storeAddTable,
  updateTable as storeUpdateTable,
  deleteTable as storeDeleteTable,
  assignGuestToSeat as storeAssignGuestToSeat,
  unassignSeat as storeUnassignSeat,
  swapSeats as storeSwapSeats,
  clearGuestAssignments as storeClearGuestAssignments,
} from '../data/table-store'

export function useTableState() {
  const [tables, setTables] = useState<FloorTable[]>(() => getTables())
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)

  const refreshTables = useCallback(() => setTables(getTables()), [])

  const handleAddTable = useCallback(
    (data: { shape: TableShape; seatCount: number; x: number; y: number }) => {
      storeAddTable(data)
      refreshTables()
    },
    [refreshTables],
  )

  const handleUpdateTable = useCallback(
    (
      id: string,
      data: Partial<
        Pick<
          FloorTable,
          'label' | 'shape' | 'seatCount' | 'x' | 'y' | 'rotation'
        >
      >,
    ) => {
      storeUpdateTable(id, data)
      refreshTables()
    },
    [refreshTables],
  )

  const handleDeleteTable = useCallback(
    (id: string) => {
      storeDeleteTable(id)
      refreshTables()
      setSelectedTableId(null)
    },
    [refreshTables],
  )

  const handleAssignGuest = useCallback(
    (tableId: string, seatIndex: number, guestId: string) => {
      storeAssignGuestToSeat(tableId, seatIndex, guestId)
      refreshTables()
    },
    [refreshTables],
  )

  const handleUnassignSeat = useCallback(
    (tableId: string, seatIndex: number) => {
      storeUnassignSeat(tableId, seatIndex)
      refreshTables()
    },
    [refreshTables],
  )

  const handleSwapSeats = useCallback(
    (
      srcTableId: string,
      srcSeatIdx: number,
      tgtTableId: string,
      tgtSeatIdx: number,
    ) => {
      storeSwapSeats(srcTableId, srcSeatIdx, tgtTableId, tgtSeatIdx)
      refreshTables()
    },
    [refreshTables],
  )

  const handleClearGuestAssignments = useCallback(
    (guestId: string) => {
      storeClearGuestAssignments(guestId)
      refreshTables()
    },
    [refreshTables],
  )

  return {
    tables,
    selectedTableId,
    setSelectedTableId,
    handleAddTable,
    handleUpdateTable,
    handleDeleteTable,
    handleAssignGuest,
    handleUnassignSeat,
    handleSwapSeats,
    handleClearGuestAssignments,
  }
}
```

**`src/App.tsx` changes** (modify existing file — currently 171 lines):

1. Add imports at the top of the file (after existing imports):

   ```typescript
   import SeatingCanvas from './components/organisms/SeatingCanvas'
   import CanvasPropertiesPanel from './components/organisms/CanvasPropertiesPanel'
   import { useTableState } from './hooks/useTableState'
   import type { FloorTable } from './data/table-types'
   ```

2. Inside the `App()` function, after the existing `filteredGuests` computation (around line 104), add:

   ```typescript
   const {
     tables,
     selectedTableId: selectedCanvasTableId,
     setSelectedTableId: setSelectedCanvasTableId,
     handleAddTable,
     handleUpdateTable,
     handleDeleteTable,
     handleAssignGuest,
     handleUnassignSeat,
     handleSwapSeats,
     handleClearGuestAssignments,
   } = useTableState()

   const selectedCanvasTable =
     tables.find((t) => t.id === selectedCanvasTableId) ?? null
   ```

3. Modify the existing `handleDeleteGuest` callback to cascade to table assignments. Change lines 66-74 from:

   ```typescript
   const handleDeleteGuest = useCallback(
     (id: string) => {
       storeDeleteGuest(id)
       setGuests(getGuests())
       setSelectedGuestId(null)
       navigate('/?tab=guests', { replace: true })
     },
     [navigate],
   )
   ```

   to:

   ```typescript
   const handleDeleteGuest = useCallback(
     (id: string) => {
       storeDeleteGuest(id)
       handleClearGuestAssignments(id)
       setGuests(getGuests())
       setSelectedGuestId(null)
       navigate('/?tab=guests', { replace: true })
     },
     [navigate, handleClearGuestAssignments],
   )
   ```

4. Add a handler for the "ADD TABLE" sidebar button:

   ```typescript
   const handleSidebarAddTable = useCallback(() => {
     handleAddTable({
       shape: 'rectangular',
       seatCount: 8,
       x: 400,
       y: 300,
     })
   }, [handleAddTable])
   ```

5. Update the `LeftSidebar` rendering (around line 115). Change:

   ```tsx
   <LeftSidebar onAddGuest={handleNavigateToAdd} />
   ```

   to:

   ```tsx
   <LeftSidebar
     activeTab={activeTab}
     onAddGuest={handleNavigateToAdd}
     onAddTable={handleSidebarAddTable}
     guests={guests}
     tables={tables}
   />
   ```

6. Update the main content area. Replace the placeholder for non-guests tabs (around lines 150-154):

   ```tsx
   ) : (
     <div className="flex-1 flex items-center justify-center text-foreground-muted text-label tracking-wider">
       {activeTab.toUpperCase()} // MODULE_OFFLINE
     </div>
   )
   ```

   with:

   ```tsx
   ) : activeTab === 'canvas' ? (
     <SeatingCanvas
       tables={tables}
       guests={guests}
       selectedTableId={selectedCanvasTableId}
       onSelectTable={setSelectedCanvasTableId}
       onAddTable={handleAddTable}
       onUpdateTable={handleUpdateTable}
       onDeleteTable={handleDeleteTable}
       onAssignGuest={handleAssignGuest}
       onUnassignSeat={handleUnassignSeat}
       onSwapSeats={handleSwapSeats}
     />
   ) : (
     <div className="flex-1 flex items-center justify-center text-foreground-muted text-label tracking-wider">
       {activeTab.toUpperCase()} // MODULE_OFFLINE
     </div>
   )
   ```

7. Add the CanvasPropertiesPanel after GuestDetailPanel (around line 163). After the `{selectedGuest && activeTab === 'guests' && ...}` block:

   ```tsx
   {
     selectedCanvasTable && activeTab === 'canvas' && !isChildRoute && (
       <CanvasPropertiesPanel
         table={selectedCanvasTable}
         onUpdate={(data) => handleUpdateTable(selectedCanvasTable.id, data)}
         onDelete={() => handleDeleteTable(selectedCanvasTable.id)}
         onClose={() => setSelectedCanvasTableId(null)}
       />
     )
   }
   ```

8. The `<main>` element needs to **NOT** have `overflow-y-auto` when on the canvas tab (the canvas manages its own scrolling/panning). Change line 116 from:
   ```tsx
   <main className="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0">
   ```
   to:
   ```tsx
   <main className={`flex-1 flex flex-col ${activeTab === 'canvas' ? 'overflow-hidden' : 'overflow-y-auto'} pb-16 md:pb-0`}>
   ```

**`src/components/organisms/LeftSidebar.tsx` changes** (modify existing file — currently 42 lines):

1. Update imports and Props:

   ```typescript
   import { LuUserPlus, LuPlus, LuGripVertical } from 'react-icons/lu'
   import type { Guest } from '../../data/mock-guests'
   import type { FloorTable } from '../../data/table-types'
   import SidebarNavItem from '../molecules/SidebarNavItem'
   import Avatar from '../atoms/Avatar'

   interface Props {
     activeTab: string
     onAddGuest: () => void
     onAddTable?: () => void
     guests?: Guest[]
     tables?: FloorTable[]
   }
   ```

2. Update function signature:

   ```typescript
   function LeftSidebar({ activeTab, onAddGuest, onAddTable, guests = [], tables = [] }: Props) {
   ```

3. Compute unassigned guests (for the draggable list on canvas tab):

   ```typescript
   const allAssignedGuestIds = new Set(
     tables.flatMap((t) => t.seats.map((s) => s.guestId)),
   )
   const unassignedGuests = guests.filter((g) => !allAssignedGuestIds.has(g.id))
   ```

4. Update nav items active state (replace the hardcoded `isActive` values):

   ```tsx
   <SidebarNavItem label="PROPERTIES" isActive={false} />
   <SidebarNavItem label="LAYOUT" isActive={activeTab === 'canvas'} />
   <SidebarNavItem label="OBJECTS" isActive={activeTab === 'guests'} />
   <SidebarNavItem label="EXPORT" isActive={false} />
   ```

5. Update bottom actions section:

   ```tsx
   <div className="mt-auto px-4 py-4 border-t border-border">
     {activeTab === 'canvas' ? (
       <>
         <button
           className="btn-primary w-full flex items-center justify-center gap-2"
           onClick={onAddTable}
         >
           <LuPlus size={16} />
           ADD TABLE
         </button>
         {/* Unassigned guests drag list */}
         {unassignedGuests.length > 0 && (
           <div className="mt-3">
             <p className="text-label text-foreground-muted uppercase tracking-wider mb-2">
               UNASSIGNED_GUESTS ({unassignedGuests.length})
             </p>
             <div className="max-h-48 overflow-y-auto space-y-0.5">
               {unassignedGuests.map((guest) => (
                 <div
                   key={guest.id}
                   className="flex items-center gap-2 px-2 py-1.5 rounded cursor-grab hover:bg-surface-elevated"
                 >
                   <LuGripVertical
                     size={12}
                     className="text-foreground-muted shrink-0"
                   />
                   <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center shrink-0">
                     {guest.firstName[0]}
                     {guest.lastName[0]}
                   </div>
                   <span className="text-body-sm text-foreground truncate">
                     {guest.firstName} {guest.lastName}
                   </span>
                 </div>
               ))}
             </div>
           </div>
         )}
       </>
     ) : (
       <button
         className="btn-primary w-full flex items-center justify-center gap-2"
         onClick={onAddGuest}
       >
         <LuUserPlus size={16} />
         ADD GUEST
       </button>
     )}
     <p className="text-caption text-foreground-muted hover:text-foreground cursor-pointer mt-3 text-center">
       HISTORY
     </p>
   </div>
   ```

   **Note on DnD for guest list items**: The unassigned guest list items in LeftSidebar are rendered as regular `<div>` elements with `cursor-grab` in this task. To make them actually draggable via `@dnd-kit/react`, each item needs `useDraggable` from `@dnd-kit/react` — this requires the LeftSidebar to be inside the same `DragDropProvider` context as the canvas. Since `DragDropProvider` is in `SeatingCanvas.tsx`, the DnD provider must be lifted to `App.tsx` to wrap both LeftSidebar and SeatingCanvas. **If this creates scope issues**, the DnD provider can be moved to `App.tsx` in this task as follows:

   In `App.tsx`, wrap the `<div className="flex flex-1 overflow-hidden">` that contains LeftSidebar + main + properties panel in `<DragDropProvider>` when `activeTab === 'canvas'`. This allows DnD to work across LeftSidebar (drag source) and SeatingCanvas (drop targets).

   The LeftSidebar guest items then use `useDraggable` from `@dnd-kit/react`:

   ```tsx
   // Each guest item becomes a draggable:
   import { useDraggable } from '@dnd-kit/react'
   // Inside the map:
   const { ref, isDragging } = useDraggable({
     id: `guest-${guest.id}`,
     data: { type: DRAG_TYPE_GUEST, guestId: guest.id },
   })
   // Apply ref to the guest div, add opacity when dragging
   ```

**Guardrails**: G-11 (keyboard accessible buttons), G-13 (typography classes), G-16 (no unnecessary useEffect in App — table state init via lazy useState), G-17 (single source of truth — tables read from store only in hook)

**Dependencies**: TASK-001 (table store + types), TASK-004 (SeatingCanvas + CanvasPropertiesPanel organisms), TASK-006 (libraries)

**Acceptance criteria**:

- `tsc -b` compiles without errors
- Canvas tab (`/?tab=canvas`) renders SeatingCanvas component (AC-1)
- Other tabs still work: guests tab shows guest list, tools/more show MODULE_OFFLINE placeholder
- Tables persist across page reloads via localStorage (AC-28)
- LeftSidebar shows "LAYOUT" nav active when `activeTab === 'canvas'` (AC-30 sidebar)
- LeftSidebar shows "OBJECTS" nav active when `activeTab === 'guests'` (unchanged behavior)
- LeftSidebar shows "ADD TABLE" button on canvas tab (AC-31 sidebar)
- LeftSidebar shows "ADD GUEST" button on guests tab (unchanged behavior)
- LeftSidebar shows unassigned guest list on canvas tab (DD-18)
- Guest deletion cascades: deleting a guest from Guests tab clears all their seat assignments (AC-29, EC-6)
- CanvasPropertiesPanel opens when a table is selected, closes when deselected (AC-13, AC-14)
- `handleSidebarAddTable` places a table at (400, 300) with default 8 seats (DD-12)
- Canvas `<main>` uses `overflow-hidden` (not `overflow-y-auto`) to prevent native scrolling conflicting with pan

---

#### TASK-006: Library Installation & DnD Types

**Description**: Install `@dnd-kit/react` and `react-zoom-pan-pinch` npm packages. Create a shared DnD configuration module with drag/drop type constants, data interfaces, and a coordinate conversion utility.

**Affected files**:

- `package.json` (**modified** — via npm install)
- `src/data/dnd-types.ts` (**new**)

**Implementation instructions**:

1. Install dependencies:

   ```bash
   npm install @dnd-kit/react react-zoom-pan-pinch
   ```

   Verify the installed versions:
   - `@dnd-kit/react` should be `^0.x` (the React 19-compatible rewrite). If npm installs `@dnd-kit/core` instead, that's the wrong package. The correct package is `@dnd-kit/react`.
   - `react-zoom-pan-pinch` should be `^3.x` (latest stable).

2. Create `src/data/dnd-types.ts`:

```typescript
// Drag item type discriminators
export const DRAG_TYPE_GUEST = 'guest' as const
export const DRAG_TYPE_SEAT = 'seat' as const

// Data attached to a draggable guest item (from sidebar guest list)
export interface DragGuestData {
  type: typeof DRAG_TYPE_GUEST
  guestId: string
}

// Data attached to a draggable occupied seat (for seat swapping)
export interface DragSeatData {
  type: typeof DRAG_TYPE_SEAT
  tableId: string
  seatIndex: number
  guestId: string
}

// Data attached to a droppable seat zone
export interface DropSeatData {
  tableId: string
  seatIndex: number
}

// Data attached to a droppable table body zone (for "drop on table" → first empty seat)
export interface DropTableData {
  tableId: string
}

/**
 * Convert screen (viewport) coordinates to canvas coordinates,
 * accounting for the pan offset and scale from react-zoom-pan-pinch.
 *
 * @param screenX - clientX from mouse event
 * @param screenY - clientY from mouse event
 * @param containerRect - bounding rect of the TransformComponent wrapper
 * @param scale - current zoom scale (transformState.scale)
 * @param positionX - current pan X offset (transformState.positionX)
 * @param positionY - current pan Y offset (transformState.positionY)
 * @returns canvas-space coordinates
 */
export function screenToCanvas(
  screenX: number,
  screenY: number,
  containerRect: DOMRect,
  scale: number,
  positionX: number,
  positionY: number,
): { x: number; y: number } {
  const x = (screenX - containerRect.left - positionX) / scale
  const y = (screenY - containerRect.top - positionY) / scale
  return { x, y }
}
```

**Project context**:

- `@dnd-kit/react` v0.x has a different API from `@dnd-kit/core`. Key exports: `DragDropProvider`, `useDraggable`, `useDroppable`. There is no `DndContext` — it's `DragDropProvider`. Sensors and collision detection may differ from the core API. After install, check `node_modules/@dnd-kit/react/dist/index.d.ts` for exact exports.
- `react-zoom-pan-pinch` exports: `TransformWrapper`, `TransformComponent`, type `ReactZoomPanPinchRef`. The `ref` on `TransformWrapper` gives access to `instance.transformState` (`{ scale, positionX, positionY }`).
- Convention: no semicolons, single quotes, trailing commas, 2-space indent, `import type` for type-only imports
- The `as const` on string constants enables literal type narrowing for discriminated unions

**Dependencies**: None (independent — can run in Phase 1 alongside TASK-001)

**Acceptance criteria**:

- `npm install` succeeds, both packages appear in `package.json` `dependencies`
- `npm run build` succeeds (no TypeScript errors from new dependencies)
- `src/data/dnd-types.ts` compiles with `tsc -b`
- `DRAG_TYPE_GUEST` and `DRAG_TYPE_SEAT` are string literal types (not `string`)
- `screenToCanvas` returns correct coordinates (e.g., for screen (500, 400), container at (220, 56), scale 1, positionX 0, positionY 0 → canvas (280, 344))
- Import `DragDropProvider` from `@dnd-kit/react` resolves without error (verify manually)
- Import `TransformWrapper`, `TransformComponent` from `react-zoom-pan-pinch` resolves without error

### Execution Order

```
Phase 1 (Independent — run in parallel):
  ├── TASK-001: Table Types and Store
  └── TASK-006: Library Installation & DnD Types

Phase 2 (Depends on TASK-001):
  └── TASK-002: Canvas Atom Components

Phase 3 (Depends on TASK-001 + TASK-002):
  └── TASK-003: Canvas Molecule Components

Phase 4 (Depends on TASK-001 + TASK-002 + TASK-003 + TASK-006):
  └── TASK-004: Canvas Organisms

Phase 5 (Depends on ALL above):
  └── TASK-005: Integration — App.tsx & LeftSidebar Updates
```

| Phase | Tasks              | Can Parallelize                 | Rationale                                                   |
| ----- | ------------------ | ------------------------------- | ----------------------------------------------------------- |
| 1     | TASK-001, TASK-006 | Yes — independent of each other | TASK-001 is pure data; TASK-006 is npm install + type file  |
| 2     | TASK-002           | Single task                     | Atoms depend on `TableShape` from TASK-001 only             |
| 3     | TASK-003           | Single task                     | Molecules use atoms + types, no library imports yet         |
| 4     | TASK-004           | Single task                     | Organisms import libraries from TASK-006 + all components   |
| 5     | TASK-005           | Single task (integration)       | Wires everything into App.tsx + LeftSidebar, final assembly |

**Scope isolation**: No two tasks modify the same file. TASK-005 is the only task that modifies existing files (`App.tsx` and `LeftSidebar.tsx`). All other tasks create new files exclusively.

### Verification Checklist

#### Build & Compile

- [ ] `tsc -b` compiles without errors
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] `@dnd-kit/react` and `react-zoom-pan-pinch` listed in `package.json` dependencies

#### Canvas Rendering (AC-1 through AC-3)

- [ ] Canvas renders at `/?tab=canvas` with dot-grid background (AC-1)
- [ ] Empty canvas shows only grid background + toolbar (AC-2)
- [ ] Status bar shows "ZOOM: 100%" and "LAYER: FLOOR_PLAN_MAIN" at top-right (AC-3)

#### Toolbar (AC-4 through AC-6)

- [ ] Toolbar has 4 tool buttons with correct icons (AC-4)
- [ ] Active tool has cobalt highlight `bg-primary text-primary-foreground` (AC-4)
- [ ] Clicking a different tool switches active state (AC-5)
- [ ] Pan tool enables canvas panning via drag on background (AC-6)

#### Adding Tables (AC-7 through AC-9)

- [ ] Add circle tool places circular table at click position with defaults: 8 seats, auto-label, auto-badge (AC-7)
- [ ] Add rectangle tool places rectangular table at click position with defaults (AC-8)
- [ ] Tool auto-reverts to select after placing a table (DD-10)
- [ ] Tables display: shape, badge (T01), label (TABLE ALPHA), guest count (0/8 Guests), seat indicators (AC-9)

#### Table Auto-Sizing (AC-10 through AC-12)

- [ ] Rectangular table width scales with seat count (AC-10)
- [ ] Circular table diameter scales with seat count (AC-11)
- [ ] Changing seat count triggers visual resize — no manual resize handles (AC-12)

#### Selecting & Editing (AC-13 through AC-18)

- [ ] Selected table has cobalt dashed border `border-2 border-dashed border-primary` (AC-13)
- [ ] Selecting a table opens the properties panel on the right (AC-13)
- [ ] Clicking empty canvas deselects table and closes properties panel (AC-14)
- [ ] Properties panel shows: label input, reference ID badge, shape toggle, seat slider, rotation slider with presets (AC-15)
- [ ] Label edit + UPDATE CHANGES updates table label on canvas (AC-16)
- [ ] Shape toggle + UPDATE CHANGES changes table shape on canvas (AC-17)
- [ ] Seat slider + UPDATE CHANGES updates seat count and resizes table (AC-18)

#### Dragging Tables (AC-19 through AC-21)

- [ ] Select tool: drag table repositions it in real-time (AC-19)
- [ ] Release drag persists new position to localStorage (AC-20)
- [ ] Pan tool: dragging on table pans canvas, does not move table (AC-21)

#### Deleting Tables (AC-22)

- [ ] DELETE ENTITY removes table, closes properties panel, persists to localStorage (AC-22)

#### Guest Assignment (AC-23 through AC-27)

- [ ] Clicking empty seat opens popover with unassigned guest list (AC-23)
- [ ] Selecting a guest assigns them to seat, shows initials, updates count (AC-24)
- [ ] Clicking occupied seat shows guest name + UNASSIGN button (AC-25)
- [ ] UNASSIGN reverts seat to empty, decrements count (AC-26)
- [ ] Reducing seat count auto-unassigns guests at removed seats (AC-27)

#### Data Persistence (AC-28, AC-29)

- [ ] All table data persists across page reload via localStorage (AC-28)
- [ ] Deleting a guest from Guests tab clears their seat assignments on canvas (AC-29)

#### Drag & Drop Guest Assignment (AC-30 through AC-33)

- [ ] Dragging a guest from sidebar shows drag preview with initials (AC-30)
- [ ] Hovering drag over empty seat highlights it as valid drop zone (AC-31)
- [ ] Dropping guest on empty seat assigns them, shows initials, updates count (AC-32)
- [ ] Already-assigned guests do not appear in the draggable sidebar list (AC-33)

#### Table Rotation (AC-34 through AC-36)

- [ ] Rotation slider (0-359°) + UPDATE CHANGES rotates table on canvas (AC-34)
- [ ] Preset angle buttons (0°, 90°, 180°, 270°) set rotation (AC-34)
- [ ] Rotated table body + seats rotate as a single unit via CSS transform (AC-35)
- [ ] Assigned guest initials display at rotated seat positions (AC-36)

#### Seat Swapping (AC-37 through AC-40)

- [ ] Dragging an occupied seat shows drag preview with guest initials (AC-37)
- [ ] Dropping occupied seat onto empty seat moves guest there (AC-38)
- [ ] Dropping occupied seat onto another occupied seat swaps both guests (AC-39)
- [ ] Cross-table seat swap correctly updates both tables (AC-40)

#### Left Sidebar Context (AC-30, AC-31 sidebar)

- [ ] Canvas tab: "LAYOUT" nav item active with cobalt highlight (AC-30 sidebar)
- [ ] Canvas tab: "ADD TABLE" button replaces "ADD GUEST" (AC-31 sidebar)
- [ ] Canvas tab: Unassigned guests section visible below ADD TABLE (DD-18)
- [ ] Guests tab: "OBJECTS" nav item active (unchanged behavior)
- [ ] Guests tab: "ADD GUEST" button (unchanged behavior)

#### Edge Cases

- [ ] Empty canvas: only grid + toolbar visible (EC-1)
- [ ] Delete only table: canvas returns to empty state (EC-2)
- [ ] Delete table with assigned guests: guests return to unassigned pool (EC-3)
- [ ] Reduce seats below assignments: overflow guests auto-unassigned (EC-4)
- [ ] All guests assigned: popover shows "NO_UNASSIGNED_GUESTS // ALL_ALLOCATED" (EC-5)
- [ ] Guest deleted externally: seat assignment silently cleared (EC-6)
- [ ] Duplicate table labels: allowed, no validation error (EC-7)
- [ ] Overlapping tables: topmost (last interacted) is selected on click (EC-10)
- [ ] Stale guest references: cleaned on render/load (EC-12)
- [ ] Drag guest onto occupied seat: drop rejected, no highlight (EC-13)
- [ ] Drag guest onto table body (not seat): assigns to first empty seat (EC-14)
- [ ] Rotate table with assigned guests: initials rotate with table (EC-15)
- [ ] DnD only active when select tool is active (EC-16)
- [ ] Seat swap same seat: no-op (EC-17)

#### Mobile

- [ ] Mobile (<768px) shows "CANVAS_EDITOR // DESKTOP_REQUIRED" placeholder (DD-13)

## Notes

- The canvas uses HTML/CSS for rendering, not `<canvas>` or WebGL. This keeps the implementation within the existing tech stack (React + Tailwind) and avoids introducing a new rendering paradigm.
- `Guest.tableAssignment` and `Guest.seatNumber` fields in the existing `Guest` interface are NOT used by the canvas. Table ownership of seat assignments (via `FloorTable.seats`) is the single source of truth. Synchronizing these fields is deferred to a future spec.
- The `react-icons` library is already installed in the project (added in the `replace-icons-with-react-icons` spec). Prefer react-icons for toolbar and UI icons.
- The zoom display is cosmetic only (always shows 100%). Actual zoom controls and coordinate scaling are deferred to a future iteration.
- The canvas is desktop-optimized. Mobile shows a placeholder message, not the full editor.
- The pan interaction uses mouse events. Touch events for mobile pan are out of scope.
- The "ADD TABLE" button in the sidebar places a table at the center of the current viewport. The toolbar add tools place tables at the click position on the canvas.
- `@dnd-kit/react` (v0.x) is the React 19-compatible rewrite of `@dnd-kit`. It uses `useDraggable` and `useDroppable` hooks. Do NOT confuse with the older `@dnd-kit/core` package.
- `react-zoom-pan-pinch` wraps the canvas in `<TransformWrapper>` / `<TransformComponent>`. Access transform state for coordinate conversion when handling DnD drops and table placement.
- The click-to-assign popover (DD-11) is retained alongside drag-and-drop assignment. Both are valid interaction paths for assigning guests to seats.
- Table rotation is stored as degrees (0-359) and applied via CSS `transform: rotate()`. Seat positions are computed in local table coordinates and rotate visually with the table element.

## Changelog

- 2026-04-03: Initial draft created by PM agent
- 2026-04-03: Added drag-and-drop guest assignment, table rotation, and seat swapping features. Added `@dnd-kit/react` and `react-zoom-pan-pinch` as library dependencies. Moved table rotation and guest DnD from Out of Scope to In Scope. Updated DD-2 (pan/zoom via react-zoom-pan-pinch), DD-10 (DnD gated on select tool). Added DD-14 through DD-18 (library choices, rotation model, seat swap, guest list panel). Added `rotation` property to FloorTable. Added `swapSeats` to table store API. Added TASK-006 (DnD & Library Setup). Updated acceptance criteria (AC-30 through AC-40), user stories (11-13), edge cases (EC-13 through EC-17), and verification checklist.
- 2026-04-03: Technical plan refined by TPM
- 2026-04-03: Implementation completed — 6 tasks (TASK-001 through TASK-006) all passed TPM verification and Validator review (APPROVED iteration 2, 0 CRITICAL, 0 MAJOR, 9 MINOR). Build succeeds. 15 files created/modified: table-types, table-store, dnd-types, 3 atoms, 3 molecules, 2 organisms, useTableState hook, App.tsx, LeftSidebar.tsx. Libraries added: @dnd-kit/react 0.3.2, react-zoom-pan-pinch 3.7.0.
