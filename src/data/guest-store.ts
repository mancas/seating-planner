import type { Guest } from './guest-types'
import { v4 as uuidv4 } from 'uuid'
import { createStorage } from './storage-utils'

const STORAGE_KEY = 'seating-plan:guests'
const storage = createStorage<Guest[]>(STORAGE_KEY, [])

export function getGuests(): Guest[] {
  return storage.read()
}

export function getGuestById(id: string): Guest | undefined {
  return storage.read().find((g) => g.id === id)
}

export function addGuest(data: Omit<Guest, 'id'>): Guest {
  const guests = storage.read()
  const newGuest: Guest = { id: uuidv4(), ...data }
  guests.push(newGuest)
  storage.write(guests)
  return newGuest
}

export function updateGuest(
  id: string,
  data: Partial<Omit<Guest, 'id'>>,
): Guest | undefined {
  const guests = storage.read()
  const index = guests.findIndex((g) => g.id === id)
  if (index === -1) return undefined

  const existing = guests[index]
  const updated: Guest = {
    ...existing,
    ...data,
    dietary: { ...existing.dietary, ...data.dietary },
    logistics: { ...existing.logistics, ...data.logistics },
  }
  guests[index] = updated
  storage.write(guests)
  return updated
}

export function deleteGuest(id: string): boolean {
  const guests = storage.read()
  const filtered = guests.filter((g) => g.id !== id)
  if (filtered.length === guests.length) return false
  storage.write(filtered)
  return true
}
