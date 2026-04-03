# Task Report: TASK-001

## Task

Create the table type definitions, sizing geometry functions, and localStorage-backed data layer for canvas tables.

## Status: Complete

## Changes Made

### `src/data/table-types.ts` (new)

- Defined `TableShape` type (`'rectangular' | 'circular'`)
- Defined `SeatAssignment` interface (`seatIndex`, `guestId`)
- Defined `FloorTable` interface (`id`, `badgeId`, `label`, `shape`, `seatCount`, `x`, `y`, `rotation`, `seats`)
- Exported sizing constants: `SEAT_SPACING`, `TABLE_PADDING`, `SEAT_RADIUS`, `MIN_RECT_WIDTH`, `MIN_RECT_HEIGHT`, `MIN_CIRCLE_DIAMETER`
- Exported `NATO_LABELS` array (26 NATO phonetic alphabet words)
- Implemented `getRectTableSize(seatCount)` — computes width/height based on long-side seat count
- Implemented `getCircleTableDiameter(seatCount)` — computes diameter scaling with seat count
- Implemented `getSeatPositions(shape, seatCount, width, height)` — returns x/y positions for each seat around the table perimeter

### `src/data/table-store.ts` (new)

- Follows the same localStorage + memory-fallback pattern as `guest-store.ts`
- Uses `STORAGE_KEY = 'seating-plan:tables'` and `COUNTER_KEY = 'seating-plan:table-counter'`
- `getTables()` / `getTableById(id)` — read operations
- `addTable(data)` — auto-generates `id` via uuid, `badgeId` as zero-padded counter (T001, T002, ...), `label` as `TABLE <NATO>` cycling through NATO alphabet
- `updateTable(id, data)` — handles seat-count reduction (auto-unassigns seats beyond new count), rotation clamping via `((rotation % 360) + 360) % 360`
- `deleteTable(id)` — removes table from storage
- `assignGuestToSeat(tableId, seatIndex, guestId)` / `unassignSeat(tableId, seatIndex)` — individual seat management
- `swapSeats(sourceTableId, sourceSeatIndex, targetTableId, targetSeatIndex)` — handles move-to-empty, swap-occupied, cross-table, and same-seat no-op
- `clearGuestAssignments(guestId)` — removes a guest from all table seat assignments
- Re-exports `FloorTable`, `TableShape`, `SeatAssignment` types

## Acceptance Criteria Verification

| Criteria                                                                 | Status |
| ------------------------------------------------------------------------ | ------ |
| Both files compile (no TS errors)                                        | Pass   |
| addTable auto-generates badgeId (T001) and label (TABLE ALFA) correctly  | Pass   |
| updateTable with reduced seatCount auto-unassigns seats beyond new count | Pass   |
| updateTable clamps rotation (-90 → 270, 720 → 0)                         | Pass   |
| swapSeats: move to empty seat                                            | Pass   |
| swapSeats: swap two occupied seats                                       | Pass   |
| swapSeats: cross-table swap                                              | Pass   |
| swapSeats: same-seat no-op                                               | Pass   |
| swapSeats: empty source no-op                                            | Pass   |
| clearGuestAssignments removes guest from all tables                      | Pass   |
| getRectTableSize(8).width > getRectTableSize(4).width                    | Pass   |
| getCircleTableDiameter(8) > getCircleTableDiameter(4)                    | Pass   |
| getSeatPositions returns correct number of positions                     | Pass   |

## Files Created

- `src/data/table-types.ts`
- `src/data/table-store.ts`
