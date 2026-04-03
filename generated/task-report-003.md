# Task Report — TASK-003: Canvas Molecule Components

## Status: COMPLETE

## Files Created

- `src/components/molecules/CanvasToolbar.tsx`
- `src/components/molecules/CanvasTable.tsx`
- `src/components/molecules/SeatAssignmentPopover.tsx`

## Component Summary

### CanvasToolbar.tsx

- Exports `CanvasTool` type (`'select' | 'pan' | 'add-circle' | 'add-rectangle'`)
- Renders horizontal toolbar with four tool buttons (LuMousePointer2, LuHand, LuCircle, LuSquare)
- Active tool gets `bg-primary text-primary-foreground`; inactive gets muted styling with hover states
- All buttons have `focus-visible` outlines and `title` attributes for accessibility
- Icons use `size={16}` per G-22 guideline

### CanvasTable.tsx

- Renders a single floor table with its seats on the canvas
- Computes dimensions via `getRectTableSize` / `getCircleTableDiameter` based on table shape
- Computes seat positions via `getSeatPositions`
- Root container is `absolute` positioned at `(table.x, table.y)` with rotation transform
- Container sized with `SEAT_RADIUS * 2` padding on each axis to accommodate seats
- Table body has shape-dependent border-radius (50% for circle, 8px for rect)
- Selected state: `border-2 border-dashed border-primary`; default: `border border-border`
- Badge ID shown in top-right corner with primary styling
- Label and guest count (with LuUsers icon) centered inside table body
- Seats rendered as `SeatIndicator` atoms positioned at computed coordinates
- Each seat click provides the button's `DOMRect` to the parent for popover positioning
- No @dnd-kit imports — DnD is layered on in TASK-004

### SeatAssignmentPopover.tsx

- Fixed-position popover anchored to a seat's bounding rect
- Click-outside handler via `useRef` + `useEffect` mousedown listener
- Positioned centered horizontally below anchor with 8px gap; flips above if below viewport
- Left position clamped to stay within viewport bounds
- **Occupied seat**: Shows "ASSIGNED // TABLE_LABEL // SEAT_XX" header, guest Avatar + name, red UNASSIGN button (`btn-ghost`)
- **Empty seat**: Shows "ASSIGN_GUEST // TABLE_LABEL // SEAT_XX" header, scrollable guest list (max-h-48), or "NO_UNASSIGNED_GUESTS // ALL_ALLOCATED" empty state
- Guest list items are full-width buttons with Avatar + name, hover:bg-surface-elevated

## Type Check

```
npx tsc --noEmit — passed with no errors
```

## Conventions Followed

- Function declarations (not arrow functions) for components
- Default export
- Props interface (not inline)
- No semicolons
- Single quotes
- Trailing commas
- 2-space indentation
