import { useOutletContext } from 'react-router'
import type { Guest } from '../data/mock-guests'
import GuestForm from '../components/organisms/GuestForm'

interface OutletContext {
  guests: Guest[]
  onAdd: (data: Omit<Guest, 'id'>) => void
  onUpdate: (id: string, data: Omit<Guest, 'id'>) => void
  onDelete: (id: string) => void
  onCancel: () => void
}

function AddGuestPage() {
  const { onAdd, onCancel } = useOutletContext<OutletContext>()
  return <GuestForm onSubmit={onAdd} onCancel={onCancel} />
}

export default AddGuestPage
