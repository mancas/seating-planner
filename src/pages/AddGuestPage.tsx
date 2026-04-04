import { useOutletContext } from 'react-router'
import type { OutletContext } from '../data/outlet-context'
import GuestForm from '../components/organisms/GuestForm'

function AddGuestPage() {
  const { onAdd, onCancel } = useOutletContext<OutletContext>()
  return <GuestForm onSubmit={onAdd} onCancel={onCancel} />
}

export default AddGuestPage
