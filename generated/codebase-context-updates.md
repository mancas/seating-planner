# Codebase Context Updates

Updates to `generated/codebase-context.md` based on validated implementations.

---

## From: Guest CRUD Flow (2026-04-03) — APPROVED

### New Guardrails Added (G-15 through G-19)

- **G-15**: Form inputs with validation must include `aria-invalid`. Error messages use `role="alert"`.
- **G-16**: Avoid `setState` inside `useEffect` — use synchronous state adjustment during render.
- **G-17**: Single source of truth for data transformations.
- **G-18**: Delete unused component files.
- **G-19**: Custom modal dialogs need keyboard and ARIA support.

---

## From: Replace Icons with react-icons (2026-04-03) — APPROVED

### New Guardrails Added (G-20 through G-22)

- **G-20**: Use a single icon family (Lucide `react-icons/lu`).
- **G-21**: Verify icon export names against actual package.
- **G-22**: Use `size` prop for icon dimensions.

---

## From: Seating Canvas (2026-04-03) — CHANGES_REQUESTED (Iteration 1)

### New Guardrails Added (G-23 through G-26)

- **G-23**: Data store function signatures must match their intended contract. Use `Partial<Pick<T, ...>>` to be explicit.
- **G-24**: Spec is the authoritative reference for literal values. Do not substitute alternatives.
- **G-25**: G-16 applies even when `useEffect` seems justified — the ESLint rule blocks regardless.
- **G-26**: Collapse identical conditional branches, even if functionally correct due to aliasing.

### Key Dependencies to Add

| Library              | Version | Purpose                                                                |
| -------------------- | ------- | ---------------------------------------------------------------------- |
| @dnd-kit/react       | ^0.3.2  | Drag-and-drop for guest assignment, seat swapping, table repositioning |
| react-zoom-pan-pinch | ^3.7.0  | Canvas pan and zoom with TransformWrapper/TransformComponent           |

### New Files Added

```
src/
├── data/
│   ├── table-types.ts          (NEW: FloorTable, SeatAssignment, TableShape, sizing functions, NATO labels)
│   ├── table-store.ts          (NEW: localStorage CRUD for tables, assignment, swap, clear)
│   └── dnd-types.ts            (NEW: drag/drop type discriminators, coordinate conversion utility)
├── hooks/
│   └── useTableState.ts        (NEW: custom hook extracting table state management from App)
└── components/
    ├── atoms/
    │   ├── SeatIndicator.tsx    (NEW: seat dot — empty/occupied/selected/drop-target/swap-target)
    │   ├── ShapeToggle.tsx      (NEW: RECTANGULAR/CIRCULAR toggle button group)
    │   └── CanvasStatusBar.tsx  (NEW: static ZOOM/LAYER display)
    ├── molecules/
    │   ├── CanvasToolbar.tsx    (NEW: floating 4-tool toolbar with select/pan/add-circle/add-rect)
    │   ├── CanvasTable.tsx      (NEW: table rendering — shape, badge, label, guest count, seats, rotation)
    │   └── SeatAssignmentPopover.tsx (NEW: assign/unassign guest popover anchored to seat)
    └── organisms/
        ├── SeatingCanvas.tsx    (NEW: main canvas with TransformWrapper, DnD context, tool state)
        └── CanvasPropertiesPanel.tsx (NEW: right sidebar for table properties — label, shape, seats, rotation)
```

### Modified Files

- `src/App.tsx` — Added table state via `useTableState` hook, SeatingCanvas rendering for canvas tab, CanvasPropertiesPanel, guest deletion cascade to table assignments, sidebar context props
- `src/components/organisms/LeftSidebar.tsx` — Added `activeTab` prop, conditional LAYOUT/OBJECTS active state, ADD TABLE button, unassigned guests list

### Update "Prior Spec Decisions" — Seating Canvas Status

Change status from "Draft" to "In Progress":

```
### Spec: Seating Canvas — Status: In Progress (2026-04-03)
```

### Architectural Patterns — New Patterns

- **Custom hooks**: `useTableState` extracts table CRUD logic from `App.tsx` to reduce component complexity. Returns state + wrapped callbacks.
- **Table data layer**: `table-store.ts` follows the `guest-store.ts` pattern (G-17 compliant). Separate localStorage keys: `seating-plan:tables` and `seating-plan:table-counter`.
- **Coordinate conversion**: `dnd-types.ts` provides `screenToCanvas()` to translate viewport coordinates to canvas coordinates accounting for pan/zoom transform.
- **Canvas interaction model**: Tool-based state machine (`select`/`pan`/`add-circle`/`add-rectangle`). DnD and table interaction gated on `select` tool. Auto-revert to `select` after table placement.
