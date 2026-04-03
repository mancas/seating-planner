import type { Guest } from '../../data/mock-guests'
import { GuestRowMobile } from '../molecules/GuestRow'
import TableGroupHeader from '../molecules/TableGroupHeader'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table'
import Avatar from '../atoms/Avatar'
import StatusBadge from '../atoms/StatusBadge'
import IconButton from '../atoms/IconButton'
import { LuEllipsis } from 'react-icons/lu'

const columnHelper = createColumnHelper<Guest>()

const columns = [
  columnHelper.accessor('firstName', {
    header: 'NAME / IDENTIFIER',
    cell: (info) => {
      const guest = info.row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar
            firstName={guest.firstName}
            lastName={guest.lastName}
            size="sm"
          />
          <div>
            <p className="text-body-sm font-semibold text-foreground-heading uppercase">
              {guest.firstName} {guest.lastName}
            </p>
            <p className="text-caption text-foreground-muted">ID: {guest.id}</p>
          </div>
        </div>
      )
    },
  }),
  columnHelper.accessor('status', {
    header: 'STATUS',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor('tableAssignment', {
    header: 'TABLE',
    cell: (info) => (
      <span className="text-body-sm text-foreground-muted">
        {info.getValue() ?? '- - -'}
      </span>
    ),
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
]

interface Props {
  guests: Guest[]
  selectedGuestId: string | null
  onGuestClick: (guestId: string) => void
  searchQuery: string
}

function getLocationLabel(table: string): string {
  if (table === 'UNASSIGNED') return 'UNASSIGNED'
  const tableNum = table.replace(/\D/g, '')
  const letter = String.fromCharCode(64 + parseInt(tableNum, 10))
  return `LOCATION_${letter}`
}

function GuestTable({
  guests,
  selectedGuestId,
  onGuestClick,
  searchQuery,
}: Props) {
  // Group guests by table assignment for mobile view
  // Filtering is handled by the parent (App.tsx) — guests prop is already filtered
  const groupMap = new Map<string, Guest[]>()
  for (const guest of guests) {
    const key = guest.tableAssignment ?? 'UNASSIGNED'
    const group = groupMap.get(key)
    if (group) {
      group.push(guest)
    } else {
      groupMap.set(key, [guest])
    }
  }

  // Sort: named tables first (alphabetically), UNASSIGNED last
  const sortedKeys = Array.from(groupMap.keys()).sort((a, b) => {
    if (a === 'UNASSIGNED') return 1
    if (b === 'UNASSIGNED') return -1
    return a.localeCompare(b)
  })

  const isEmpty = guests.length === 0
  const hasActiveSearch = searchQuery.trim().length > 0

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
          {isEmpty && hasActiveSearch ? (
            <tr>
              <td
                colSpan={table.getAllColumns().length}
                className="py-16 text-center text-foreground-muted text-label tracking-wider"
              >
                NO_RESULTS // QUERY_MISMATCH
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
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
            ))
          )}
        </tbody>
      </table>

      {/* Mobile layout */}
      <div className="md:hidden">
        {isEmpty && hasActiveSearch ? (
          <div className="md:hidden flex items-center justify-center py-16 text-foreground-muted text-label tracking-wider">
            NO_RESULTS // QUERY_MISMATCH
          </div>
        ) : (
          sortedKeys.map((tableKey) => {
            const groupGuests = groupMap.get(tableKey)!
            const tableName =
              tableKey === 'UNASSIGNED'
                ? 'NO TABLE'
                : tableKey.replace('_', ' ')
            return (
              <div key={tableKey}>
                <TableGroupHeader
                  location={getLocationLabel(tableKey)}
                  tableName={tableName}
                  seatCount={groupGuests.length}
                  totalSeats={tableKey === 'UNASSIGNED' ? 0 : 8}
                />
                {groupGuests.map((guest) => (
                  <GuestRowMobile
                    key={guest.id}
                    guest={guest}
                    isSelected={guest.id === selectedGuestId}
                    onClick={() => onGuestClick(guest.id)}
                  />
                ))}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default GuestTable
