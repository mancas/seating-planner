import type { Guest } from '../../data/mock-guests'
import GuestRow from '../molecules/GuestRow'
import TableGroupHeader from '../molecules/TableGroupHeader'

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
  const query = searchQuery.toLowerCase().trim()
  const filtered = query
    ? guests.filter((g) => {
        const fullName = `${g.firstName} ${g.lastName}`.toLowerCase()
        return fullName.includes(query)
      })
    : guests

  // Group filtered guests by table assignment for mobile view
  const groupMap = new Map<string, Guest[]>()
  for (const guest of filtered) {
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

  const isEmpty = filtered.length === 0

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Desktop layout */}
      <div className="hidden md:block">
        <div className="hidden md:grid grid-cols-[1fr_120px_100px_60px] gap-4 px-6 py-3 border-b border-border text-label text-foreground-muted uppercase tracking-wider">
          <span>NAME / IDENTIFIER</span>
          <span>STATUS</span>
          <span>TABLE</span>
          <span>ACTIONS</span>
        </div>
        {isEmpty ? (
          <div className="hidden md:flex items-center justify-center py-16 text-foreground-muted text-label tracking-wider">
            NO_RESULTS // QUERY_MISMATCH
          </div>
        ) : (
          filtered.map((guest) => (
            <GuestRow
              key={guest.id}
              guest={guest}
              isSelected={guest.id === selectedGuestId}
              onClick={() => onGuestClick(guest.id)}
            />
          ))
        )}
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        {isEmpty ? (
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
                  <GuestRow
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
