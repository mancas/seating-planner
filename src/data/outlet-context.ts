import type { Guest } from './guest-types'

export interface OutletContext {
  guests: Guest[]
  onAdd: (data: Omit<Guest, 'id'>) => void
  onUpdate: (id: string, data: Omit<Guest, 'id'>) => void
  onDelete: (id: string) => void
  onCancel: () => void
}
