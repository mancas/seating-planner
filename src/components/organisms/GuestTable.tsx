import { useMemo } from 'react'
import type { Guest } from '../../data/guest-types'
import type { FloorTable } from '../../data/table-types'
import GuestRowMobile from '../molecules/GuestRow'
import TableGroupHeader from '../molecules/TableGroupHeader'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import StatusBadge from '../atoms/StatusBadge'
import IconButton from '../atoms/IconButton'
import { LuEllipsis } from 'react-icons/lu'

const columnHelper = createColumnHelper<Guest>()

interface Props {
  guests: Guest[]
  tables: FloorTable[]
  selectedGuestId: string | null
  onGuestClick: (guestId: string) => void
}

function GuestTable({
  guests,
  tables: floorTables,
  selectedGuestId,
  onGuestClick,
}: Props) {
  // Build a lookup from guestId → table location
  const guestLocationMap = useMemo(() => {
    const map = new Map<
      string,
      { tableId: string; tableLabel: string; seatIndex: number }
    >()
    for (const table of floorTables) {
      for (const seat of table.seats) {
        map.set(seat.guestId, {
          tableId: table.id,
          tableLabel: table.label,
          seatIndex: seat.seatIndex,
        })
      }
    }
    return map
  }, [floorTables])

  // Dynamic columns that use floorTables for table lookup
  const columns = useMemo(
    () => [
      columnHelper.accessor('firstName', {
        header: 'NAME / IDENTIFIER',
        cell: (info) => {
          const guest = info.row.original
          return (
            <div>
              <p className="text-body-sm font-semibold text-foreground-heading uppercase">
                {guest.firstName} {guest.lastName}
              </p>
              <p className="text-caption text-foreground-muted">
                ID: {guest.id}
              </p>
            </div>
          )
        },
      }),
      columnHelper.accessor('status', {
        header: 'STATUS',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.display({
        id: 'table',
        header: 'TABLE',
        cell: (info) => {
          const loc = guestLocationMap.get(info.row.original.id)
          return (
            <span className="text-body-sm text-foreground-muted">
              {loc ? loc.tableLabel : '- - -'}
            </span>
          )
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: 'ACTIONS',
        cell: () => (
          <IconButton label="Actions">
            <LuEllipsis size={16} />
          </IconButton>
        ),
      }),
    ],
    [guestLocationMap],
  )

  // Group guests by table for mobile view
  const { groupMap, sortedKeys } = useMemo(() => {
    const gMap = new Map<
      string,
      { table: FloorTable | null; guests: Guest[] }
    >()

    for (const guest of guests) {
      const loc = guestLocationMap.get(guest.id)
      const key = loc ? loc.tableId : 'UNASSIGNED'
      const existing = gMap.get(key)
      if (existing) {
        existing.guests.push(guest)
      } else {
        const ft = loc
          ? (floorTables.find((t) => t.id === loc.tableId) ?? null)
          : null
        gMap.set(key, { table: ft, guests: [guest] })
      }
    }

    const keys = Array.from(gMap.keys()).sort((a, b) => {
      if (a === 'UNASSIGNED') return 1
      if (b === 'UNASSIGNED') return -1
      const labelA = gMap.get(a)!.table?.label ?? ''
      const labelB = gMap.get(b)!.table?.label ?? ''
      return labelA.localeCompare(labelB)
    })

    return { groupMap: gMap, sortedKeys: keys }
  }, [guests, floorTables, guestLocationMap])

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table API is not memoizable by design; component is not compiled
  const table = useReactTable({
    data: guests,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
      {/* Desktop layout */}
      <table className="hidden md:table w-full border-separate border-spacing-0 table-auto">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    key={header.id}
                    scope="col"
                    className={`px-4 py-3 text-left font-normal border-b border-border text-label text-foreground-muted uppercase tracking-wider`}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.original.id}
              onClick={() => onGuestClick(row.original.id)}
              className={`cursor-pointer hover:bg-gray-800/50 ${
                row.original.id === selectedGuestId
                  ? 'border-l-2 border-l-primary bg-surface-elevated'
                  : 'border-l-2 border-l-transparent'
              }`}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile layout */}
      <div className="md:hidden">
        {sortedKeys.map((tableKey) => {
          const group = groupMap.get(tableKey)!
          const ft = group.table
          const tableName = ft ? ft.label : 'NO TABLE'
          const badgeId = ft ? ft.badgeId : 'UNASSIGNED'
          return (
            <div key={tableKey}>
              <TableGroupHeader
                location={badgeId}
                tableName={tableName}
                seatCount={group.guests.length}
                totalSeats={ft ? ft.seatCount : 0}
              />
              {group.guests.map((guest) => (
                <GuestRowMobile
                  key={guest.id}
                  guest={guest}
                  seatIndex={guestLocationMap.get(guest.id)?.seatIndex ?? null}
                  isSelected={guest.id === selectedGuestId}
                  onClick={() => onGuestClick(guest.id)}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GuestTable
