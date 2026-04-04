import { useParams, useOutletContext, useNavigate } from 'react-router'
import { useEffect } from 'react'
import type { OutletContext } from '../data/outlet-context'
import GuestForm from '../components/organisms/GuestForm'

function EditGuestPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { guests, onUpdate, onDelete, onCancel } =
    useOutletContext<OutletContext>()

  const guest = guests.find((g) => g.id === id)

  // Edge case: invalid/non-existent guest ID → silent redirect
  useEffect(() => {
    if (!guest) {
      navigate('/', { replace: true })
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
