# Codebase Context Updates — Replace Dietary Flags with Total Gifts

Updates to project context based on the `update-dietary-flags-metrics` spec implementation (validation iteration 1).

---

## useGuestStats Hook — Updated Return Shape

The `useGuestStats` hook return type changed:

**Before**: `{ confirmedCount, pendingCount, totalGuests, confirmationRate, dietaryFlagCount, waitlistCount }`

**After**: `{ confirmedCount, pendingCount, totalGuests, confirmationRate, totalGifts, giftCount, waitlistCount }`

- `dietaryFlagCount` removed (no consumers)
- `totalGifts` added: `guests.reduce((sum, g) => sum + (g.gift ?? 0), 0)` — sum of non-null gift values
- `giftCount` added: `guests.filter((g) => g.gift !== null).length` — count of guests with gifts

## GuestListFooterStats Props — Updated

**Before**: `{ confirmationRate: number, dietaryFlagCount: number }`

**After**: `{ confirmationRate: number, totalGifts: number, giftCount: number }`

## Footer Stats Cards — Updated

The 3-card desktop footer stats panel now shows:

1. **CONFIRMATION RATE** — progress bar + percentage (unchanged)
2. **TOTAL GIFTS** — euro-formatted sum + "X GIFTS RECEIVED" sub-text (replaces DIETARY FLAGS)
3. **RSVP DEADLINE** — hardcoded T-08D + URGENT badge (unchanged)

## Validation Status

**CHANGES_REQUESTED** — 1 CRITICAL finding pending resolution:

1. CRITICAL-1: Currency formatting uses `Intl.NumberFormat` `style: 'currency'` which produces `1.250 €` (euro suffix, de-DE locale). Spec requires `€1.250` (euro prefix). Fix: use manual `€` prefix with plain number formatter.
