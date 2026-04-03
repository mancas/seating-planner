import type { Guest, GuestStatus } from './mock-guests'
import { v4 as uuidv4 } from 'uuid'

export type { Guest, GuestStatus }

const STORAGE_KEY = 'seating-plan:guests'

let memoryFallback: Guest[] | null = null

function readFromStorage(): Guest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Guest[]
    return []
  } catch {
    if (memoryFallback !== null) return memoryFallback
    return []
  }
}

function writeToStorage(guests: Guest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests))
  } catch {
    memoryFallback = guests
  }
}

export function getGuests(): Guest[] {
  return readFromStorage()
}

export function getGuestById(id: string): Guest | undefined {
  return readFromStorage().find((g) => g.id === id)
}

export function addGuest(data: Omit<Guest, 'id'>): Guest {
  const guests = readFromStorage()
  const newGuest: Guest = { id: uuidv4(), ...data }
  guests.push(newGuest)
  writeToStorage(guests)
  return newGuest
}

export function updateGuest(
  id: string,
  data: Partial<Omit<Guest, 'id'>>,
): Guest | undefined {
  const guests = readFromStorage()
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
  writeToStorage(guests)
  return updated
}

export function deleteGuest(id: string): boolean {
  const guests = readFromStorage()
  const filtered = guests.filter((g) => g.id !== id)
  if (filtered.length === guests.length) return false
  writeToStorage(filtered)
  return true
}

export function getConfirmedCount(): number {
  return readFromStorage().filter((g) => g.status === 'CONFIRMED').length
}

export function getPendingCount(): number {
  return readFromStorage().filter((g) => g.status === 'PENDING').length
}

export function getConfirmationRate(): number {
  const guests = readFromStorage()
  if (guests.length === 0) return 0
  return Math.round(
    (guests.filter((g) => g.status === 'CONFIRMED').length / guests.length) *
      100,
  )
}

export function getDietaryFlagCount(): number {
  return readFromStorage().filter((g) => g.dietary.type !== null).length
}

export function getTotalGuests(): number {
  return readFromStorage().length
}

export function getWaitlistCount(): number {
  return getPendingCount()
}

export function getGuestsByTable(): Map<string, Guest[]> {
  const map = new Map<string, Guest[]>()
  for (const guest of readFromStorage()) {
    const key = guest.tableAssignment ?? 'UNASSIGNED'
    const group = map.get(key)
    if (group) {
      group.push(guest)
    } else {
      map.set(key, [guest])
    }
  }
  return map
}
