import { useParams, useOutletContext, useNavigate } from 'react-router'
import { useEffect } from 'react'
import type { Guest } from '../data/mock-guests'
import GuestForm from '../components/organisms/GuestForm'

interface OutletContext {
  guests: Guest[]
  onAdd: (data: Omit<Guest, 'id'>) => void
  onUpdate: (id: string, data: Omit<Guest, 'id'>) => void
  onDelete: (id: string) => void
  onCancel: () => void
}

function EditGuestPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { guests, onUpdate, onDelete, onCancel } =
    useOutletContext<OutletContext>()

  const guest = guests.find((g) => g.id === id)

  // Edge case: invalid/non-existent guest ID → silent redirect
  useEffect(() => {
    if (!guest) {
      navigate('/?tab=guests', { replace: true })
    }
  }, [guest, navigate])

  if (!guest) return null

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
