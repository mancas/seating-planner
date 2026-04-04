import { Navigate, useOutletContext, useParams } from 'react-router'
import GuestForm from '../components/organisms/GuestForm'
import type { OutletContext } from '../data/outlet-context'

function EditGuestPage() {
  const { id } = useParams<{ id: string }>()
  const { guests, onUpdate, onDelete, onCancel } =
    useOutletContext<OutletContext>()

  const guest = guests.find((g) => g.id === id)

  // Edge case: invalid/non-existent guest ID → silent redirect
  if (!guest) {
    return <Navigate to="/" replace />
  }

  return (
    <GuestForm
      guest={guest}
      onSubmit={(data) => onUpdate(id!, data)}
      onDelete={onDelete}
      onCancel={onCancel}
    />
  )
}

export default EditGuestPage
