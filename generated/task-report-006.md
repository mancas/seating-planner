# Task Report — TASK-006: Library Installation & DnD Types

## Status: COMPLETE

## Files Modified / Created

- `package.json` (modified — two new dependencies added)
- `package-lock.json` (modified — lockfile updated)
- `src/data/dnd-types.ts` (new)

## Implementation Summary

### 1. Package Installation

Installed both packages via `npm install`:

| Package                | Version | Purpose                          |
| ---------------------- | ------- | -------------------------------- |
| `@dnd-kit/react`       | 0.3.2   | Drag-and-drop for React          |
| `react-zoom-pan-pinch` | 3.7.0   | Pannable/zoomable canvas wrapper |

Both added to `dependencies` in `package.json`.

### 2. DnD Types Module

Created `src/data/dnd-types.ts` with:

- `DRAG_TYPE_GUEST` and `DRAG_TYPE_SEAT` — string literal constants (`as const`)
- `DragGuestData` — interface for draggable guest items from the sidebar
- `DragSeatData` — interface for draggable occupied seats (seat swapping)
- `DropSeatData` — interface for droppable seat zones
- `DropTableData` — interface for droppable table body zones
- `screenToCanvas()` — coordinate conversion utility (screen → canvas accounting for pan/zoom)

### 3. Verified @dnd-kit/react API (v0.3.2)

**Exports from `@dnd-kit/react`:**

| Export               | Kind      | Notes                                                                         |
| -------------------- | --------- | ----------------------------------------------------------------------------- |
| `DragDropProvider`   | Component | Wraps tree; accepts `onDragStart`, `onDragEnd`, `onDragOver`, etc.            |
| `DragOverlay`        | Component | Renders a floating overlay during drag                                        |
| `useDraggable`       | Hook      | Returns `{ ref, handleRef, isDragging, isDropping, isDragSource, draggable }` |
| `useDroppable`       | Hook      | Returns `{ ref, isDropTarget, droppable }`                                    |
| `useDragDropManager` | Hook      | Returns the manager instance                                                  |
| `useDragDropMonitor` | Hook      | Subscribe to events anywhere in the tree                                      |
| `useDragOperation`   | Hook      | Returns `{ source, target }` of current operation                             |

**Sub-path exports:**

- `@dnd-kit/react/sortable` — sortable preset
- `@dnd-kit/react/hooks` — utility hooks (`useConstant`, `useComputed`, etc.)
- `@dnd-kit/react/utilities` — utility functions

**`useDraggable` input:**

```ts
interface UseDraggableInput<T extends Data> {
  id: UniqueIdentifier
  data?: T // custom data accessible as source.data
  disabled?: boolean
  type?: Type
  handle?: RefOrValue<Element>
  element?: RefOrValue<Element>
  // ... plus sensors, modifiers, feedback
}
```

**`useDroppable` input:**

```ts
interface UseDroppableInput<T extends Data> {
  id: UniqueIdentifier
  data?: T // custom data accessible as target.data
  disabled?: boolean
  type?: Type
  collisionDetector?: CollisionDetector
  element?: RefOrValue<Element>
}
```

**`onDragEnd` event structure:**

```ts
onDragEnd(event, manager) => void
// event = {
//   operation: {
//     source: Draggable | null   // source.id, source.data
//     target: Droppable | null   // target.id, target.data
//     status, position, transform, shape, canceled, activatorEvent
//   },
//   canceled: boolean,
//   nativeEvent?: Event,
//   suspend(): { resume(), abort() }
// }
```

Key pattern for downstream tasks: access `event.operation.source?.data` and `event.operation.target?.data` to read the custom data attached to draggables/droppables.

**Entity data access:** Both `Draggable` and `Droppable` extend `Entity<T>` which has an `accessor data: Data` property. The `Data` type is `Record<string, any>` by default but is generic, so you can pass your typed interface (e.g., `DragGuestData`) via the generic parameter.

### 4. Verified react-zoom-pan-pinch API (v3.7.0)

| Export                  | Kind      | Notes                                                     |
| ----------------------- | --------- | --------------------------------------------------------- |
| `TransformWrapper`      | Component | Wraps the zoomable/pannable area                          |
| `TransformComponent`    | Component | The inner content container                               |
| `useTransformContext`   | Hook      | Returns the full `ZoomPanPinch` instance                  |
| `useControls`           | Hook      | Returns `ReactZoomPanPinchContentRef` with `zoomIn`, etc. |
| `useTransformComponent` | Hook      | Subscribe to transform state changes                      |

State shape: `{ scale, positionX, positionY, previousScale }` — these are the values used by `screenToCanvas()`.

## Conventions Followed

- No semicolons
- Single quotes
- 2-space indentation
- Trailing commas
- `as const` on string literal constants
- `export function` for the utility

## Verification

- `npm install`: **PASS** — 0 vulnerabilities, both packages in dependencies
- `npm run build` (`tsc -b && vite build`): **PASS** — zero errors, 79 modules transformed
- `DRAG_TYPE_GUEST` type is `'guest'` (string literal via `as const`)
- `DRAG_TYPE_SEAT` type is `'seat'` (string literal via `as const`)
- `screenToCanvas` compiles and returns `{ x, y }` correctly
