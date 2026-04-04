import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { getGuests } from '../data/guest-store'
import type { Guest } from '../data/guest-types'
import { getTables } from '../data/table-store'
import LeftSidebar from '../components/organisms/LeftSidebar'
import ImportGuestsPage from '../components/organisms/ImportGuestsPage'

function ImportGuestsView() {
  const navigate = useNavigate()

  const [guests, setGuests] = useState<Guest[]>(() => getGuests())
  const tables = getTables()

  const handleNavigateToAdd = useCallback(() => {
    navigate('/guests/new')
  }, [navigate])

  const handleSidebarAddTable = useCallback(() => {
    navigate('/seating-plan')
  }, [navigate])

  const handleImportComplete = useCallback(() => {
    setGuests(getGuests())
  }, [])

  return (
    <>
      <LeftSidebar
        onAddGuest={handleNavigateToAdd}
        onAddTable={handleSidebarAddTable}
        guests={guests}
        tables={tables}
      />
      <main className="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0">
        <ImportGuestsPage onImportComplete={handleImportComplete} />
      </main>
    </>
  )
}

export default ImportGuestsView
