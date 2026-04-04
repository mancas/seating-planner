# Spec: Fix Mobile Seat Assignment

## Metadata

- **Slug**: `fix-mobile-seat-assignment`
- **Date**: 2026-04-03
- **Status**: Completed
- **Author**: User
- **Related specs**: [spec/mobile-canvas.md](./mobile-canvas.md), [spec/seating-canvas.md](./seating-canvas.md)

## Description

Two bugs/improvements in the mobile seat assignment flow:

1. **Event propagation bug**: When a user taps a seat indicator on mobile, the table's touch handler fires first (via `useLongPress` → `onTap` → `onSelect`), which selects the table and opens the `MobilePropertiesSheet`. The seat's `onClick` event (synthesized by the browser after `touchend`) fires after, but by then the properties sheet is already open, obscuring the seat assignment UI. The seat tap should take priority over the table tap — tapping a seat should open the seat assignment UI without triggering table selection.

2. **Bottom sheet for guest selection**: The current `SeatAssignmentPopover` (a small floating popover positioned near the seat) is not mobile-friendly — it's difficult to tap items in the small 224px-wide popover, and it can be obscured by the `MobilePropertiesSheet`. On mobile, seat assignment should use a bottom sheet (consistent with the existing `MobilePropertiesSheet` and `MobileGuestsSheet` patterns using `vaul` Drawer) that shows the full list of available guests with comfortable tap targets. This bottom sheet should also support reassignment — if a guest is already assigned to a different seat, selecting them moves them to the new seat.

### Root Cause Analysis

**Bug 1**: In `CanvasTable.tsx:238-265`, each seat wrapper `<div>` has `onTouchStart={(e) => e.stopPropagation()}` at line 252, which correctly prevents the table's `onTouchStart` from firing when a seat is touched. However, the seat uses `onClick` (via `SeatIndicator.tsx:39`) for its action, not `onTouchStart`. The table uses `onTouchStart` → `useLongPress` → `onTap` (on `touchEnd`) to fire `onSelect()`. The execution order on mobile is:

1. Seat `onTouchStart` fires → calls `e.stopPropagation()` → table `onTouchStart` does NOT fire ✓
2. But `longPressHandlers.onTouchStart()` was already registered on the table container — wait, the seat's stopPropagation prevents this.

Investigating further: the actual issue is that when the table is already NOT selected and the user taps a seat, the seat's `onTouchStart` at line 252 stops propagation, but the table's `onTouchStart` at line 188 checks `if (isMobile && activeTool === 'select')` — this shouldn't fire if stopPropagation works correctly. The more likely scenario is that the table's `onClick` at line 187 (`(e) => e.stopPropagation()`) doesn't call `onSelect`, so that's fine.

The real issue: On further inspection, the seat's `onClick` calls `handleSeatClick` which calls `setActiveSeat` in `SeatingCanvas.tsx:163`. Meanwhile the table's `onSelect` (called via `handleTap` in the `useLongPress` chain) calls `onSelectTable` which sets `selectedCanvasTableId` in `App.tsx`. When `selectedCanvasTableId` is set, `MobilePropertiesSheet` renders (App.tsx:224-231). Even though the seat's stopPropagation on `touchStart` works, there's a nuance: if the user taps anywhere on the table body (not on a seat), the table's longpress-tap fires correctly. But when tapping a seat, the seat's `onTouchStart` stops propagation, so the table's `onTouchStart` should NOT fire. However, the `onClick` on the seat (`SeatIndicator`) bubbles up to the table's root div `onClick` at line 187 which does `e.stopPropagation()` only — it does NOT call `onSelect()`. So in theory, the seat click should work independently. The bug may actually be that on mobile, when the table is already selected (and `MobilePropertiesSheet` is open), tapping a seat opens the popover BEHIND the properties sheet (z-index conflict), or the properties sheet's overlay intercepts the touch. This needs to be investigated during implementation.

Regardless of the exact cause, the fix approach is clear: on mobile, seat taps must reliably open the seat assignment UI (the new bottom sheet) without interference from the table selection/properties sheet flow.

## User Stories

1. As a **wedding planner on mobile**, I want to tap a seat to assign a guest without the table properties sheet opening, so that I can quickly manage individual seat assignments.

2. As a **wedding planner on mobile**, I want to see available guests in a mobile-friendly bottom sheet when I tap a seat, so that I can easily select a guest with comfortable tap targets.

3. As a **wedding planner on mobile**, I want to reassign a guest who is already seated elsewhere by selecting them from the seat assignment sheet, so that I can move guests between seats without manually unassigning first.

## Acceptance Criteria

### Bug Fix: Seat Tap Priority Over Table Selection

1. GIVEN a table is rendered on the mobile canvas and is NOT selected WHEN the user taps on a seat indicator THEN the seat assignment bottom sheet opens AND the table does NOT become selected AND the `MobilePropertiesSheet` does NOT open.

2. GIVEN a table is rendered on the mobile canvas and IS selected (properties sheet is open) WHEN the user taps on a seat indicator THEN the seat assignment bottom sheet opens AND the properties sheet closes (or remains behind, not blocking the seat sheet).

3. GIVEN the user taps on the table body (not on a seat) on mobile WHEN the tap completes THEN the table becomes selected AND the `MobilePropertiesSheet` opens (existing behavior, unchanged).

4. GIVEN the user taps on empty canvas space on mobile WHEN a table was selected THEN the table is deselected AND any open bottom sheet closes (existing behavior, unchanged).

### Mobile Seat Assignment Bottom Sheet

5. GIVEN the user taps an **empty** seat on mobile WHEN the seat assignment bottom sheet opens THEN it displays:
   - A header showing the seat reference (e.g., "ASSIGN_GUEST // TABLE ALPHA // SEAT_01")
   - A scrollable list of all unassigned guests, each showing Avatar + full name
   - A close button (X) and drag handle
   - Uses the `vaul` Drawer pattern consistent with `MobilePropertiesSheet` and `MobileGuestsSheet`

6. GIVEN the seat assignment bottom sheet is open for an empty seat WHEN the user taps a guest from the list THEN the guest is assigned to that seat, the seat shows the guest's initials on the canvas, and the bottom sheet closes.

7. GIVEN the user taps an **occupied** seat on mobile WHEN the seat assignment bottom sheet opens THEN it displays:
   - The currently assigned guest (Avatar + name) at the top
   - An "UNASSIGN" button to remove the guest from the seat
   - The bottom sheet closes after unassigning

8. GIVEN the seat assignment bottom sheet is open WHEN the user taps the close button, swipes down, or taps the overlay backdrop THEN the bottom sheet closes without any changes.

9. GIVEN all guests are assigned to seats WHEN the user taps an empty seat on mobile THEN the bottom sheet shows the "NO_UNASSIGNED_GUESTS // ALL_ALLOCATED" message (same as the current popover behavior).

### Reassignment Support

10. GIVEN Guest A is assigned to Table 1 / Seat 3 WHEN the user taps an empty seat on Table 2 and selects Guest A from the assignment list THEN Guest A is removed from Table 1 / Seat 3 AND assigned to the new seat on Table 2 AND both tables update their guest counts on the canvas.

11. GIVEN the seat assignment bottom sheet is open for an empty seat WHEN the guest list is displayed THEN it shows ALL guests (both unassigned and already-assigned-elsewhere), with already-assigned guests showing a subtitle indicating their current assignment (e.g., "Currently at TABLE ALPHA / SEAT_03") so the user can make an informed reassignment decision.

### Desktop Behavior Unchanged

12. GIVEN the app is viewed on desktop (≥768px) WHEN the user clicks a seat THEN the existing `SeatAssignmentPopover` opens (no bottom sheet on desktop). Desktop behavior is completely unchanged.

## Scope

### In Scope

- Fix mobile seat tap event propagation so seats take priority over table selection
- New `MobileSeatAssignmentSheet` component using `vaul` Drawer (consistent with existing sheets)
- Conditional rendering: bottom sheet on mobile, popover on desktop
- Reassignment support: selecting an already-assigned guest in the sheet moves them to the new seat
- Show assigned guests in the list with their current seat info, so users can reassign
- Close properties sheet when seat sheet opens (or manage z-index layering)

### Out of Scope

- Changing the desktop `SeatAssignmentPopover` behavior
- Seat swapping via drag on mobile (existing out-of-scope from mobile-canvas spec)
- Search/filter within the guest assignment sheet (can be added later)
- Multi-seat assignment (assigning one guest to multiple seats)
- Changes to the `MobilePropertiesSheet` or `MobileGuestsSheet` components

## Edge Cases

1. **Seat tap on unselected table**: The table should NOT become selected when a seat is tapped. The seat assignment sheet opens directly. If the user then closes the sheet and taps the table body, the table becomes selected as usual.

2. **Properties sheet already open when seat tapped**: If the `MobilePropertiesSheet` is open and the user taps a seat, the properties sheet should close and the seat assignment sheet should open. Only one sheet should be visible at a time.

3. **Reassigning guest who is at the same table**: If Guest A is at Table 1 / Seat 1 and the user taps Table 1 / Seat 5, the list should show Guest A with "Currently at TABLE_NAME / SEAT_01". Selecting them moves them from Seat 1 to Seat 5 within the same table.

4. **Rapid seat tapping**: If the user taps Seat A, then quickly taps Seat B before the first sheet fully animates, the sheet should update to show Seat B's context (or close and reopen for Seat B).

5. **Guest list longer than sheet height**: The guest list inside the bottom sheet scrolls internally within the `max-h-[60vh]` constraint. The `data-vaul-no-drag` attribute prevents swipe-to-dismiss while scrolling the list.

6. **Seat on rotated table**: The seat's touch area is a 28px circle (`w-7 h-7` in `SeatIndicator`). On rotated tables, the hit area still works because the seat `<div>` is positioned absolutely within the rotated container and the browser handles touch hit-testing on transformed elements.

## Design Decisions

### DD-F1: Bottom Sheet Over Popover for Mobile

**Decision**: On mobile, replace `SeatAssignmentPopover` with a new `MobileSeatAssignmentSheet` using the `vaul` Drawer component — same pattern as `MobilePropertiesSheet` and `MobileGuestsSheet`.

**Reasoning**: The existing popover is 224px wide with small tap targets. On mobile screens (320-414px wide), this leaves very little margin. A bottom sheet provides full-width content, larger tap targets, and is consistent with the existing mobile sheet pattern. The `vaul` library is already a project dependency and handles swipe-to-dismiss, backdrop overlay, and animations.

### DD-F2: Show All Guests (Not Just Unassigned) for Reassignment

**Decision**: The seat assignment bottom sheet shows ALL guests, not just unassigned ones. Unassigned guests appear first (plain list). Already-assigned guests appear below, with a subtitle showing their current table/seat. Selecting an already-assigned guest moves them (unassigns from old seat, assigns to new seat).

**Reasoning**: The user's request explicitly requires reassignment support ("if a guest is already seated at another table, selecting them should move them to the new seat"). Showing only unassigned guests would require the user to first navigate to the old seat, unassign, then navigate to the new seat and assign — a multi-step process that's frustrating on mobile. Showing all guests with current assignment info enables single-tap reassignment.

### DD-F3: Close Properties Sheet When Seat Sheet Opens

**Decision**: When the seat assignment bottom sheet opens on mobile, the `MobilePropertiesSheet` closes (table is deselected). Only one bottom sheet is visible at a time.

**Reasoning**: Stacking two `vaul` Drawers creates z-index and interaction complexity. The `vaul` library supports nested drawers but the UX is confusing. Closing the properties sheet keeps the interaction model simple: the user is either editing table properties OR assigning a seat, not both simultaneously.

### DD-F4: Seat Touch Handler Uses Direct Callback (Not onClick)

**Decision**: On mobile, the `SeatIndicator`'s seat tap action is triggered via `onTouchEnd` (after verifying no drag occurred) rather than relying on the browser-synthesized `onClick` event. This ensures the seat tap fires before any parent touch handlers resolve.

**Reasoning**: The root cause of the event propagation bug is the timing mismatch between touch events (which fire immediately) and synthesized click events (which fire ~300ms later on some browsers, or after touchend). By handling the seat action on `onTouchEnd`, we bypass the ordering issue entirely. The `onClick` handler remains for desktop mouse clicks.

## UI/UX Details

### Mobile Seat Assignment Bottom Sheet (Empty Seat)

```
+----------------------------------+
|   (canvas visible above)         |
+----------------------------------+
|          --- drag handle ---     |
|  ASSIGN_GUEST                [X] |
|  TABLE ALPHA // SEAT_01          |
|  ____________________________    |
|                                  |
|  UNASSIGNED                      |
|  ER  Elara Rivera            [>] |
|  AV  Alexander Vance         [>] |
|  MC  Marcus Chen             [>] |
|                                  |
|  ASSIGNED_ELSEWHERE              |
|  SN  Sophia Nakamura             |
|      Currently at BETA / S02     |
|  KW  Kai Westbrook               |
|      Currently at GAMMA / S04    |
|                                  |
+----------------------------------+
| CANVAS  GUESTS  TOOLS  MORE     |
+----------------------------------+
```

### Mobile Seat Assignment Bottom Sheet (Occupied Seat)

```
+----------------------------------+
|   (canvas visible above)         |
+----------------------------------+
|          --- drag handle ---     |
|  ASSIGNED_GUEST              [X] |
|  TABLE ALPHA // SEAT_01          |
|  ____________________________    |
|                                  |
|  ER  Elara Rivera                |
|                                  |
|  [ UNASSIGN ]                    |
|                                  |
+----------------------------------+
| CANVAS  GUESTS  TOOLS  MORE     |
+----------------------------------+
```

### Visual Specifications

- **Sheet**: Same styling as `MobilePropertiesSheet` — `fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl border-t border-border max-h-[60vh] flex flex-col`
- **Overlay**: `fixed inset-0 z-40 bg-black/40`
- **Drag handle**: `bg-gray-600 my-3` (vaul default handle)
- **Guest rows (unassigned)**: `flex items-center gap-2 px-2 py-2.5 rounded cursor-pointer active:bg-surface-elevated` — larger vertical padding than popover for touch targets
- **Guest rows (assigned elsewhere)**: Same as unassigned but with a second line: `text-caption text-foreground-muted` showing current assignment
- **Section headers**: `text-label text-foreground-muted tracking-wider uppercase` — "UNASSIGNED" and "ASSIGNED_ELSEWHERE"
- **UNASSIGN button**: `btn-ghost w-full text-red-400` — same as current popover

## Data Requirements

No new data models. Uses existing `FloorTable`, `SeatAssignment`, `Guest` types. The `onAssignGuest` handler in `App.tsx` already handles reassignment — calling `handleAssignGuest(tableId, seatIndex, guestId)` with a guest who is already seated elsewhere will assign them to the new seat (the store handles removing the old assignment).

### Reassignment Logic Verification

The existing `handleAssignGuest` in `useTableState.ts` needs to be verified: does it automatically unassign the guest from their previous seat when assigning to a new one? If not, the `MobileSeatAssignmentSheet` must call `onUnassignSeat` on the old seat before `onAssignGuest` on the new seat. This is an implementation detail to verify during development.

### Guest List Computation for the Sheet

The sheet needs two lists:

1. **Unassigned guests**: Already computed in `SeatingCanvas.tsx:80-85` as `unassignedGuests`
2. **Assigned guests with their current seat info**: Computed by mapping over all `tables[].seats[]` to build a lookup of `guestId → { tableLabel, seatIndex }`

This computation should be done inside the new `MobileSeatAssignmentSheet` component or passed as a prop.

## Technical Plan

### Impact Analysis

#### Root Cause Confirmation

The event propagation bug is confirmed at **`CanvasTable.tsx:202-205`**. When a user taps a seat on mobile:

1. The seat wrapper's `onTouchStart` (line 252) calls `e.stopPropagation()` → table's `onTouchStart` (line 188) does NOT fire → `longPressHandlers.onTouchStart()` is never called → `useLongPress` timer is never started.
2. **However**, the table's `onTouchEnd` (line 202) is unconditional — it always calls `longPressHandlers.onTouchEnd()`, even when `onTouchStart` never fired.
3. In `useLongPress.ts:25-32`, `onTouchEnd` checks `if (!isLongPress.current)` → since `isLongPress.current` was initialized as `false` and never changed (because `onTouchStart` never ran), the condition is true → `onTap()` fires.
4. `onTap()` calls `onSelect()` → sets `selectedCanvasTableId` in App.tsx → `MobilePropertiesSheet` renders and obscures the seat assignment UI.

**Fix**: Stop `touchend` propagation at the seat wrapper level (same as `touchstart`), so the table's `onTouchEnd` never fires when a seat is tapped. Additionally, on mobile, use `onTouchEnd` on the `SeatIndicator` instead of relying on browser-synthesized `onClick` to ensure the seat action fires immediately and reliably.

#### Affected Files

| File                                                     | Change Type  | Description                                                                                                                                                            |
| -------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/molecules/CanvasTable.tsx`               | Modify       | Add `onTouchEnd` stopPropagation on seat wrapper; pass `isMobile` + `onMobileSeatTap` to SeatIndicator                                                                 |
| `src/components/atoms/SeatIndicator.tsx`                 | Modify       | Add `onTouchEnd` handler for mobile; fire seat action on touch, not click, on mobile                                                                                   |
| `src/components/organisms/MobileSeatAssignmentSheet.tsx` | **New file** | vaul Drawer for mobile seat assignment (replaces popover on mobile)                                                                                                    |
| `src/components/organisms/SeatingCanvas.tsx`             | Modify       | Conditionally render MobileSeatAssignmentSheet (mobile) vs SeatAssignmentPopover (desktop); pass `onMobileSeatTap` callback; deselect table when seat tapped on mobile |
| `src/hooks/useTableState.ts`                             | Modify       | Add `handleReassignGuest` that clears old assignment then assigns to new seat                                                                                          |
| `src/App.tsx`                                            | Modify       | Pass `handleReassignGuest` to SeatingCanvas; wire up the new reassignment handler                                                                                      |

#### Integration Points

1. **SeatingCanvas ↔ App.tsx**: New `onReassignGuest` prop for reassignment (clear old + assign new in one call)
2. **SeatingCanvas ↔ CanvasTable**: `onSeatClick` already exists; no new prop needed, but mobile seat taps must also close the properties sheet by calling `onSelectTable(null)` before opening the seat sheet
3. **SeatingCanvas ↔ MobileSeatAssignmentSheet**: New component renders conditionally when `isMobile && activeSeat` is set
4. **CanvasTable ↔ SeatIndicator**: SeatIndicator needs `onTouchEnd` prop for mobile-first touch handling

#### Risk Areas

1. **vaul Drawer stacking**: Opening seat sheet while properties sheet is open requires closing the properties sheet first. The close happens synchronously via `onSelectTable(null)` which unmounts `MobilePropertiesSheet` before `MobileSeatAssignmentSheet` renders, so no stacking conflict.
2. **Touch event timing**: Using `onTouchEnd` on SeatIndicator must not conflict with dnd-kit's touch handlers on the seat wrapper. Since `useDraggable` is disabled on mobile (`isEmpty || !!isMobile`), there's no conflict.
3. **Rapid seat tapping**: Setting `activeSeat` state updates synchronously trigger re-render with new seat context. If user taps Seat A then Seat B quickly, the sheet will show Seat B's data after the second tap re-renders.

---

### Task Breakdown

#### Task 1: Fix event propagation — seat taps must not trigger table selection on mobile

**ID**: `TASK-1-EVENT-PROPAGATION`

**Description**: Fix the touch event propagation bug where tapping a seat on mobile triggers table selection via `onTouchEnd` bubbling. Also add `onTouchEnd`-based seat action for mobile (DD-F4).

**Files to modify**:

- `src/components/molecules/CanvasTable.tsx`
- `src/components/atoms/SeatIndicator.tsx`

**Dependencies**: None (independent task)

**Implementation Instructions**:

**Step 1 — SeatIndicator.tsx**: Add mobile touch handling

1. Add new optional props to the `Props` interface:
   - `onMobileTap?: (e: React.TouchEvent) => void` — fired on `touchend` for mobile seat action

2. Add `onTouchEnd` handler to the `<button>` element:

   ```tsx
   onTouchEnd={(e) => {
     if (onMobileTap) {
       e.preventDefault() // Prevent browser-synthesized onClick
       onMobileTap(e)
     }
   }}
   ```

3. The existing `onClick` prop remains for desktop mouse clicks. Both handlers coexist — `onMobileTap` fires on touch devices, `onClick` fires on mouse devices.

**Step 2 — CanvasTable.tsx**: Fix seat wrapper event propagation and wire mobile tap

1. In the seat wrapper `<div>` at the `seatPositions.map` block (current line 244-264), add `onTouchEnd` with `stopPropagation` alongside the existing `onTouchStart` stopPropagation:

   ```tsx
   onTouchStart={(e) => e.stopPropagation()}
   onTouchEnd={(e) => e.stopPropagation()}
   onMouseDown={(e) => e.stopPropagation()}
   ```

2. In the `SeatSlot` sub-component, pass `onMobileTap` to `SeatIndicator`. The `SeatSlot` needs to accept `isMobile` (already does) and use it:
   ```tsx
   <SeatIndicator
     // ...existing props...
     onMobileTap={
       isMobile
         ? (e) => {
             e.stopPropagation()
             const rect = (
               e.currentTarget as HTMLElement
             ).getBoundingClientRect()
             onSeatClick(seatIndex, rect)
           }
         : undefined
     }
   />
   ```

**Context**:

- `useLongPress.ts:25-32`: `onTouchEnd` fires `onTap()` when `isLongPress.current` is false. Since the seat wrapper stops `onTouchStart` propagation but NOT `onTouchEnd`, the table's `onTouchEnd` still calls `longPressHandlers.onTouchEnd()` → `onTap()` → `onSelect()`. Adding `onTouchEnd` stopPropagation on the seat wrapper prevents this entirely.
- `SeatIndicator.tsx:39`: Currently a `<button>` with only `onClick`. Adding `onTouchEnd` fires the action immediately on touch devices without waiting for browser click synthesis.
- `useDraggable` on seats is disabled when `isMobile` (CanvasTable.tsx:64), so no touch event conflict with dnd-kit.

**Acceptance Criteria**:

- AC-1: Tapping a seat on mobile does NOT select the table
- AC-2: Tapping a seat on mobile does NOT open `MobilePropertiesSheet`
- AC-3: Tapping the table body (not on a seat) still selects the table (existing behavior)
- AC-4: Desktop seat click behavior is completely unchanged

---

#### Task 2: Create MobileSeatAssignmentSheet component

**ID**: `TASK-2-MOBILE-SHEET`

**Description**: Create a new `MobileSeatAssignmentSheet` component using the `vaul` Drawer pattern. Shows unassigned guests for empty seats (with assigned-elsewhere guests below for reassignment), or the assigned guest with unassign button for occupied seats.

**Files to create**:

- `src/components/organisms/MobileSeatAssignmentSheet.tsx`

**Dependencies**: None (independent task — the component is self-contained, wired in Task 4)

**Implementation Instructions**:

**Step 1** — Create `src/components/organisms/MobileSeatAssignmentSheet.tsx`

Follow the canonical bottom sheet pattern from `MobilePropertiesSheet.tsx` and `MobileGuestsSheet.tsx`.

**Props interface**:

```tsx
import type { FloorTable } from '../../data/table-types'
import type { Guest } from '../../data/mock-guests'

interface Props {
  seatIndex: number
  tableLabel: string
  assignedGuest: Guest | null
  unassignedGuests: Guest[]
  tables: FloorTable[]
  guests: Guest[]
  onAssign: (guestId: string) => void
  onUnassign: () => void
  onClose: () => void
}
```

**Step 2** — Compute assigned-elsewhere guests

Inside the component, compute the list of guests assigned to other seats (for reassignment):

```tsx
import { useMemo } from 'react'

// Build lookup: guestId → { tableLabel, seatIndex }
const assignedElsewhere = useMemo(() => {
  const result: { guest: Guest; tableLabel: string; seatIndex: number }[] = []
  for (const table of tables) {
    for (const seat of table.seats) {
      // Skip the current seat being assigned
      if (table.label === tableLabel && seat.seatIndex === seatIndex) continue
      const guest = guests.find((g) => g.id === seat.guestId)
      if (guest) {
        result.push({
          guest,
          tableLabel: table.label,
          seatIndex: seat.seatIndex,
        })
      }
    }
  }
  return result
}, [tables, guests, tableLabel, seatIndex])
```

**Step 3** — Component structure (follow canonical vaul pattern)

```tsx
<Drawer.Root
  open
  onOpenChange={(open) => {
    if (!open) onClose()
  }}
>
  <Drawer.Portal>
    <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
    <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl border-t border-border max-h-[60vh] flex flex-col outline-none">
      <Drawer.Handle className="bg-gray-600 my-3" />
      <Drawer.Title className="sr-only">Seat Assignment</Drawer.Title>

      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-3 border-b border-border shrink-0">
        <div>
          <span className="text-label text-foreground-muted tracking-wider uppercase block">
            {assignedGuest ? 'ASSIGNED_GUEST' : 'ASSIGN_GUEST'}
          </span>
          <span className="text-caption text-foreground-muted">
            {tableLabel} // SEAT_{String(seatIndex + 1).padStart(2, '0')}
          </span>
        </div>
        <IconButton onClick={onClose} label="Close seat assignment">
          <LuX size={20} />
        </IconButton>
      </div>

      {/* Scrollable body */}
      <div className="overflow-y-auto flex-1 px-4 py-3" data-vaul-no-drag>
        {assignedGuest ? (
          /* Occupied seat view */
          <>
            <div className="flex items-center gap-2 py-2">
              <Avatar
                firstName={assignedGuest.firstName}
                lastName={assignedGuest.lastName}
                size="sm"
              />
              <span className="text-body-sm text-foreground-heading font-semibold">
                {assignedGuest.firstName} {assignedGuest.lastName}
              </span>
            </div>
            <button
              onClick={onUnassign}
              className="btn-ghost w-full mt-3 text-red-400 hover:text-red-300"
            >
              UNASSIGN
            </button>
          </>
        ) : (
          /* Empty seat view */
          <>
            {unassignedGuests.length === 0 && assignedElsewhere.length === 0 ? (
              <p className="text-caption text-foreground-muted text-center py-4">
                NO_UNASSIGNED_GUESTS // ALL_ALLOCATED
              </p>
            ) : (
              <>
                {/* Unassigned section */}
                {unassignedGuests.length > 0 && (
                  <>
                    <p className="text-label text-foreground-muted tracking-wider uppercase mb-2">
                      UNASSIGNED
                    </p>
                    {unassignedGuests.map((guest) => (
                      <button
                        key={guest.id}
                        onClick={() => onAssign(guest.id)}
                        className="w-full flex items-center gap-2 px-2 py-2.5 rounded cursor-pointer active:bg-surface-elevated text-left"
                      >
                        <Avatar
                          firstName={guest.firstName}
                          lastName={guest.lastName}
                          size="sm"
                        />
                        <span className="text-body-sm text-foreground-heading">
                          {guest.firstName} {guest.lastName}
                        </span>
                      </button>
                    ))}
                  </>
                )}

                {/* Assigned elsewhere section */}
                {assignedElsewhere.length > 0 && (
                  <>
                    <p className="text-label text-foreground-muted tracking-wider uppercase mb-2 mt-4">
                      ASSIGNED_ELSEWHERE
                    </p>
                    {assignedElsewhere.map(
                      ({ guest, tableLabel: tLabel, seatIndex: sIdx }) => (
                        <button
                          key={guest.id}
                          onClick={() => onAssign(guest.id)}
                          className="w-full flex items-start gap-2 px-2 py-2.5 rounded cursor-pointer active:bg-surface-elevated text-left"
                        >
                          <Avatar
                            firstName={guest.firstName}
                            lastName={guest.lastName}
                            size="sm"
                          />
                          <div>
                            <span className="text-body-sm text-foreground-heading block">
                              {guest.firstName} {guest.lastName}
                            </span>
                            <span className="text-caption text-foreground-muted">
                              Currently at {tLabel} / SEAT_
                              {String(sIdx + 1).padStart(2, '0')}
                            </span>
                          </div>
                        </button>
                      ),
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
```

**Imports**:

```tsx
import { useMemo } from 'react'
import { Drawer } from 'vaul'
import { LuX } from 'react-icons/lu'
import type { FloorTable } from '../../data/table-types'
import type { Guest } from '../../data/mock-guests'
import Avatar from '../atoms/Avatar'
import IconButton from '../atoms/IconButton'
```

**Styling details** (from spec Visual Specifications):

- Guest rows: `py-2.5` (larger than popover's `py-1.5` for comfortable mobile tap targets)
- `active:bg-surface-elevated` instead of `hover:bg-surface-elevated` (touch feedback)
- Section headers: `text-label text-foreground-muted tracking-wider uppercase`
- Unassign button: `btn-ghost w-full text-red-400 hover:text-red-300`
- `data-vaul-no-drag` on scrollable body to prevent swipe-to-dismiss during scroll

**Acceptance Criteria**:

- AC-5: Empty seat shows header with seat reference, unassigned guests list, and assigned-elsewhere guests with current location
- AC-6: Tapping an unassigned guest calls `onAssign(guestId)`
- AC-7: Tapping an assigned-elsewhere guest calls `onAssign(guestId)` (reassignment handled by caller)
- AC-8: Occupied seat shows assigned guest + UNASSIGN button
- AC-9: Close button, swipe-down, and overlay tap all call `onClose`
- AC-10: When no unassigned guests AND no assigned-elsewhere guests exist, shows "NO_UNASSIGNED_GUESTS // ALL_ALLOCATED"
- AC-11: Guest list scrolls internally with `data-vaul-no-drag`

---

#### Task 3: Add reassignment support to useTableState

**ID**: `TASK-3-REASSIGNMENT`

**Description**: Add a `handleReassignGuest` function to `useTableState` that clears a guest's existing assignment(s) before assigning to a new seat. The existing `assignGuestToSeat` in `table-store.ts` does NOT clear old assignments — it only replaces the target seat's assignment. A reassignment requires calling `clearGuestAssignments(guestId)` first, then `assignGuestToSeat(tableId, seatIndex, guestId)`.

**Files to modify**:

- `src/hooks/useTableState.ts`

**Dependencies**: None (independent task)

**Implementation Instructions**:

**Step 1** — Add `handleReassignGuest` to `useTableState.ts`

After the existing `handleAssignGuest` callback (line 53-59), add:

```tsx
const handleReassignGuest = useCallback(
  (tableId: string, seatIndex: number, guestId: string) => {
    storeClearGuestAssignments(guestId)
    storeAssignGuestToSeat(tableId, seatIndex, guestId)
    refreshTables()
  },
  [refreshTables],
)
```

**Step 2** — Include `handleReassignGuest` in the return object (after line 98):

```tsx
return {
  // ...existing properties...
  handleReassignGuest,
}
```

**Context**:

- `table-store.ts:133-150`: `assignGuestToSeat` removes any existing assignment at the TARGET seat index, but does NOT remove the guest from other seats/tables.
- `table-store.ts:228-243`: `clearGuestAssignments(guestId)` removes the guest from ALL tables' seats arrays. Calling this before `assignGuestToSeat` ensures the guest moves cleanly from old seat to new seat.
- Both store operations read/write localStorage independently, so calling them sequentially is safe.
- The existing `handleAssignGuest` remains for the desktop popover flow (which only shows unassigned guests, so no reassignment needed there).

**Acceptance Criteria**:

- AC-12: `handleReassignGuest("table2", 3, "guestA")` removes guestA from any previous seat and assigns to Table 2 / Seat 3
- AC-13: Both tables update their guest counts on the canvas after reassignment
- AC-14: Existing `handleAssignGuest` behavior is unchanged

---

#### Task 4: Wire MobileSeatAssignmentSheet into SeatingCanvas and App.tsx

**ID**: `TASK-4-WIRING`

**Description**: Conditionally render `MobileSeatAssignmentSheet` on mobile (instead of `SeatAssignmentPopover`). When a seat is tapped on mobile, deselect the table (closing `MobilePropertiesSheet`) and open the seat assignment sheet. Pass the reassignment handler. Desktop behavior unchanged.

**Files to modify**:

- `src/components/organisms/SeatingCanvas.tsx`
- `src/App.tsx`

**Dependencies**: Task 1 (event propagation fix), Task 2 (MobileSeatAssignmentSheet component), Task 3 (handleReassignGuest)

**Implementation Instructions**:

**Step 1 — App.tsx**: Pass `handleReassignGuest` and `tables` to SeatingCanvas

1. Destructure `handleReassignGuest` from `useTableState()` (line 55-66):

   ```tsx
   const {
     // ...existing...
     handleReassignGuest,
   } = useTableState()
   ```

2. Add `onReassignGuest` prop to `<SeatingCanvas>` (line 201-212):
   ```tsx
   <SeatingCanvas
     // ...existing props...
     onReassignGuest={handleReassignGuest}
   />
   ```

**Step 2 — SeatingCanvas.tsx**: Add conditional rendering

1. Add `onReassignGuest` to the `Props` interface:

   ```tsx
   onReassignGuest: (tableId: string, seatIndex: number, guestId: string) => void
   ```

2. Import `MobileSeatAssignmentSheet`:

   ```tsx
   import MobileSeatAssignmentSheet from './MobileSeatAssignmentSheet'
   ```

3. Update `handleSeatClick` (line 158-164) to deselect the table on mobile when a seat is tapped:

   ```tsx
   function handleSeatClick(
     tableId: string,
     seatIndex: number,
     anchorRect: DOMRect,
   ) {
     if (isMobile) {
       onSelectTable(null) // Close MobilePropertiesSheet (DD-F3)
     }
     setActiveSeat({ tableId, seatIndex, anchorRect })
   }
   ```

4. Replace the seat assignment popover rendering block (line 283-301) with conditional logic:

   ```tsx
   {
     /* Seat assignment: popover on desktop, bottom sheet on mobile */
   }
   {
     activeSeat && activeSeatTable && !isMobile && (
       <SeatAssignmentPopover
         seatIndex={activeSeat.seatIndex}
         tableLabel={activeSeatTable.label}
         assignedGuest={activeSeatGuest}
         unassignedGuests={unassignedGuests}
         onAssign={(guestId) => {
           onAssignGuest(activeSeat.tableId, activeSeat.seatIndex, guestId)
           setActiveSeat(null)
         }}
         onUnassign={() => {
           onUnassignSeat(activeSeat.tableId, activeSeat.seatIndex)
           setActiveSeat(null)
         }}
         onClose={() => setActiveSeat(null)}
         anchorRect={activeSeat.anchorRect}
       />
     )
   }
   {
     activeSeat && activeSeatTable && isMobile && (
       <MobileSeatAssignmentSheet
         seatIndex={activeSeat.seatIndex}
         tableLabel={activeSeatTable.label}
         assignedGuest={activeSeatGuest}
         unassignedGuests={unassignedGuests}
         tables={tables}
         guests={guests}
         onAssign={(guestId) => {
           onReassignGuest(activeSeat.tableId, activeSeat.seatIndex, guestId)
           setActiveSeat(null)
         }}
         onUnassign={() => {
           onUnassignSeat(activeSeat.tableId, activeSeat.seatIndex)
           setActiveSeat(null)
         }}
         onClose={() => setActiveSeat(null)}
       />
     )
   }
   ```

   **Note**: On mobile, the `onAssign` callback uses `onReassignGuest` (which clears old assignments first), enabling reassignment. On desktop, the popover still uses `onAssignGuest` (which only assigns to the target seat) since the desktop popover only shows unassigned guests.

**Context**:

- `App.tsx:224-231`: `MobilePropertiesSheet` renders when `isMobile && selectedCanvasTable`. By calling `onSelectTable(null)` in `handleSeatClick` on mobile, `selectedCanvasTableId` becomes null, `selectedCanvasTable` becomes null, and `MobilePropertiesSheet` unmounts before the seat sheet renders. This satisfies DD-F3 (only one sheet at a time).
- `SeatingCanvas.tsx:69`: `activeSeat` is independent of `selectedTableId`, so setting `selectedTableId` to null doesn't affect the seat sheet state.
- The mobile sheet receives `tables` and `guests` props so it can compute the assigned-elsewhere list internally.

**Acceptance Criteria**:

- AC-15: On mobile, tapping a seat opens `MobileSeatAssignmentSheet` (not `SeatAssignmentPopover`)
- AC-16: On mobile, tapping a seat when properties sheet is open closes the properties sheet first
- AC-17: On mobile, selecting an assigned-elsewhere guest moves them to the new seat (old seat cleared, new seat assigned, both tables update counts)
- AC-18: On desktop, clicking a seat still opens `SeatAssignmentPopover` (unchanged)
- AC-19: On mobile, closing the seat sheet (X, swipe, overlay) does not leave stale state
- AC-20: On mobile, tapping table body (not a seat) still opens `MobilePropertiesSheet` (existing behavior)

---

### Execution Order

```
┌──────────────────────────────────────────────────┐
│  PARALLEL GROUP 1 (no dependencies)              │
│                                                  │
│  ┌─────────────────────┐  ┌──────────────────┐   │
│  │ TASK-1              │  │ TASK-2           │   │
│  │ Event propagation   │  │ MobileSeatAssign │   │
│  │ fix                 │  │ mentSheet        │   │
│  └─────────────────────┘  └──────────────────┘   │
│                                                  │
│  ┌─────────────────────┐                         │
│  │ TASK-3              │                         │
│  │ Reassignment in     │                         │
│  │ useTableState       │                         │
│  └─────────────────────┘                         │
└──────────────────────────────────────────────────┘
                    │
                    ▼
┌──────────────────────────────────────────────────┐
│  SEQUENTIAL GROUP 2 (depends on Tasks 1, 2, 3)  │
│                                                  │
│  ┌─────────────────────┐                         │
│  │ TASK-4              │                         │
│  │ Wire everything     │                         │
│  │ in SeatingCanvas +  │                         │
│  │ App.tsx             │                         │
│  └─────────────────────┘                         │
└──────────────────────────────────────────────────┘
```

Tasks 1, 2, and 3 can be developed in parallel (no file overlap). Task 4 depends on all three.

---

### Verification Checklist

After all tasks are complete, verify with `tsc -b && vite build`:

- [ ] TypeScript compiles with no errors
- [ ] Vite build succeeds
- [ ] **Mobile — seat tap on unselected table**: Seat sheet opens, table does NOT become selected, no properties sheet
- [ ] **Mobile — seat tap on selected table**: Properties sheet closes, seat sheet opens
- [ ] **Mobile — table body tap**: Table becomes selected, properties sheet opens (unchanged)
- [ ] **Mobile — empty canvas tap**: Table deselects, sheets close (unchanged)
- [ ] **Mobile — empty seat → tap unassigned guest**: Guest assigned, seat shows initials, sheet closes
- [ ] **Mobile — empty seat → tap assigned-elsewhere guest**: Guest moves from old seat to new seat, both tables update counts
- [ ] **Mobile — occupied seat → tap UNASSIGN**: Guest removed from seat, sheet closes
- [ ] **Mobile — seat sheet close (X / swipe / overlay)**: Sheet closes, no stale state
- [ ] **Mobile — all guests assigned**: Sheet shows "NO_UNASSIGNED_GUESTS // ALL_ALLOCATED"
- [ ] **Desktop — seat click**: `SeatAssignmentPopover` opens as before (unchanged)
- [ ] **Desktop — seat popover behavior**: All existing desktop behavior unchanged
- [ ] **Pre-commit hooks pass**: `npx prettier --check .` and `npm run lint` pass

---

### Changelog

| Date       | Author    | Change                                                                                                                                                                   |
| ---------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 2026-04-03 | TPM Agent | Added Technical Plan: impact analysis, 4 tasks (event propagation fix, MobileSeatAssignmentSheet, reassignment support, wiring), execution order, verification checklist |
