import type { Guest } from './guest-types'
import { v4 as uuidv4 } from 'uuid'
import { createStorage } from './storage-utils'

const STORAGE_KEY = 'seating-plan:guests'
const storage = createStorage<Guest[]>(STORAGE_KEY, [])

function normalize(guest: Guest): Guest {
  const withAllergies = guest.allergies ? guest : { ...guest, allergies: [] }
  return typeof withAllergies.secretMission === 'boolean'
    ? withAllergies
    : { ...withAllergies, secretMission: false }
}

export function getGuests(): Guest[] {
  return storage.read().map(normalize)
}

export function getGuestById(id: string): Guest | undefined {
  const found = storage.read().find((g) => g.id === id)
  return found ? normalize(found) : undefined
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
