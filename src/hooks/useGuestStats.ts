import { useMemo } from 'react'
import type { Guest } from '../data/guest-types'

export function useGuestStats(guests: Guest[]) {
  return useMemo(() => {
    const confirmedCount = guests.filter((g) => g.status === 'CONFIRMED').length
    const pendingCount = guests.filter((g) => g.status === 'PENDING').length
    const totalGuests = guests.length
    const confirmationRate =
      totalGuests > 0 ? Math.round((confirmedCount / totalGuests) * 100) : 0
    const totalGifts = guests.reduce((sum, g) => sum + (g.gift ?? 0), 0)
    const giftCount = guests.filter((g) => g.gift !== null).length
    const waitlistCount = pendingCount
    return {
      confirmedCount,
      pendingCount,
      totalGuests,
      confirmationRate,
      totalGifts,
      giftCount,
      waitlistCount,
    }
  }, [guests])
}
