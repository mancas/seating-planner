# Spec: Replace Dietary Flags Card with Gifts Total

## Metadata

- **Slug**: `update-dietary-flags-metrics`
- **Date**: 2026-04-04
- **Status**: Completed
- **Author**: User
- **Related specs**: [spec/guest-list-screen.md](./guest-list-screen.md), [spec/guest-crud-flow.md](./guest-crud-flow.md)

## Description

Replace the **DIETARY FLAGS** stat card in `GuestListFooterStats` with a **GIFTS** stat card that displays the **sum of all `gift` values** across all guests. The `gift` field on the `Guest` model is `number | null` — a monetary value representing the gift amount from each guest.

### Current Behavior

The second stat card in the footer stats panel shows:

- Label: "DIETARY FLAGS"
- Value: count of guests with `dietary.type !== null`
- Sub-text: static "Requires Action"

### Desired Behavior

The second stat card shows:

- Label: "TOTAL GIFTS"
- Value: sum of all non-null `gift` values, formatted as currency (e.g., "€1,250")
- Sub-text: "X GIFTS RECEIVED" where X is the count of guests with non-null gifts

## User Stories

1. As a **wedding planner**, I want to see the total gifts received at a glance so that I can track gift income without checking each guest individually.

## Acceptance Criteria

1. GIVEN guests exist with `gift` values WHEN viewing the footer stats panel THEN the second card shows label "TOTAL GIFTS", the sum of all non-null `gift` values formatted as currency, and "X GIFTS RECEIVED" sub-text.

2. GIVEN no guests have gifts (all `gift` are null) WHEN viewing the footer stats panel THEN the card shows "TOTAL GIFTS", value "€0", and "NO_GIFTS_RECEIVED" sub-text.

3. GIVEN guests are added, edited, or deleted WHEN the guest list updates THEN the TOTAL GIFTS card recalculates.

4. GIVEN the viewport is below 768px (mobile) WHEN viewing the guest list THEN the footer stats panel remains hidden (desktop-only behavior unchanged).

## Scope

### In Scope

- Replace DIETARY FLAGS card with TOTAL GIFTS card
- Add `totalGifts` and `giftCount` computations to `useGuestStats`
- Remove `dietaryFlagCount` from `useGuestStats` (no longer used)
- Update `GuestListFooterStats` props and rendering
- Update `GuestListView` to pass new stats

### Out of Scope

- Mobile display of footer stats
- Changes to the guest form or gift input
- Dietary flags display elsewhere
- Currency selection (hardcoded to €)

## Edge Cases

1. **No guests**: `totalGifts` = 0, `giftCount` = 0, sub-text shows "NO_GIFTS_RECEIVED".
2. **All guests have null gifts**: Same as no guests — €0, "NO_GIFTS_RECEIVED".
3. **Large sums**: Format with locale thousands separator (e.g., "€12,500").
4. **Decimal values**: Round to nearest integer for display.

## Design Decisions

### DD-1: Currency Format

**Decision**: Use `€` prefix with `Intl.NumberFormat('de-DE')` for thousands separator, no decimals.
**Reasoning**: The app uses a cyberpunk aesthetic with concise values. Euro symbol is consistent with the locale context. `Intl.NumberFormat` handles locale-aware formatting.

### DD-2: Remove dietaryFlagCount

**Decision**: Remove `dietaryFlagCount` from `useGuestStats` since the DIETARY FLAGS card is being replaced entirely.
**Reasoning**: Dead code should be removed. If dietary stats are needed later, they can be re-added.

### DD-3: Sub-text Format

**Decision**: Show "X GIFTS RECEIVED" (e.g., "3 GIFTS RECEIVED") or "NO_GIFTS_RECEIVED" when zero.
**Reasoning**: Follows the cyberpunk uppercase aesthetic of the existing cards (e.g., "SYSTEM TARGET", "PENDING", "URGENT").

## UI/UX Details

### Updated Card

```
┌─────────────────────┐
│ TOTAL GIFTS          │
│ €1,250               │
│ 3 GIFTS RECEIVED     │
└─────────────────────┘
```

### Zero State

```
┌─────────────────────┐
│ TOTAL GIFTS          │
│ €0                   │
│ NO_GIFTS_RECEIVED    │
└─────────────────────┘
```

## Data Requirements

### Changes to `useGuestStats`

Remove:

```typescript
dietaryFlagCount: number
```

Add:

```typescript
totalGifts: number // sum of all non-null gift values
giftCount: number // count of guests with non-null gift
```

### Changes to `GuestListFooterStats` Props

```typescript
interface Props {
  confirmationRate: number
  totalGifts: number // replaces dietaryFlagCount
  giftCount: number // NEW
}
```

## Technical Plan

### Execution Phases

- **Phase 1**: TASK-001 (defines new interface — must complete first)
- **Phase 2**: TASK-002 + TASK-003 (consume new interface — can run in parallel)

---

### TASK-001: Update `useGuestStats` hook — add gift aggregation, remove dietary count

**File**: `src/hooks/useGuestStats.ts`
**Phase**: 1 (blocking — TASK-002 and TASK-003 depend on this interface)

**Changes**:

1. **Remove** the `dietaryFlagCount` computation (lines 11–13) and its return property (line 20). Per G-37 (remove dead exports) and the consumer analysis confirming no other consumers.

2. **Add** two new computations inside the `useMemo` callback, after the existing `confirmationRate` computation:

   ```typescript
   const totalGifts = guests.reduce(
     (sum, g) => (g.gift !== null ? sum + g.gift : sum),
     0,
   )
   const giftCount = guests.filter((g) => g.gift !== null).length
   ```

3. **Update** the return object to include `totalGifts` and `giftCount` instead of `dietaryFlagCount`:

   ```typescript
   return {
     confirmedCount,
     pendingCount,
     totalGuests,
     confirmationRate,
     totalGifts,
     giftCount,
     waitlistCount,
   }
   ```

**Verification**: The hook's return type changes from `{ confirmedCount, pendingCount, totalGuests, confirmationRate, dietaryFlagCount, waitlistCount }` to `{ confirmedCount, pendingCount, totalGuests, confirmationRate, totalGifts, giftCount, waitlistCount }`. TypeScript will flag any stale consumers at build time.

---

### TASK-002: Replace DIETARY FLAGS card with TOTAL GIFTS card in `GuestListFooterStats`

**File**: `src/components/organisms/GuestListFooterStats.tsx`
**Phase**: 2 (parallel — depends on TASK-001 interface)

**Changes**:

1. **Update the Props interface** (lines 3–6) — replace `dietaryFlagCount` with `totalGifts` and add `giftCount`:

   ```typescript
   interface Props {
     confirmationRate: number
     totalGifts: number
     giftCount: number
   }
   ```

2. **Update the destructured props** in the function signature (line 8):

   ```typescript
   function GuestListFooterStats({ confirmationRate, totalGifts, giftCount }: Props) {
   ```

3. **Replace the DIETARY FLAGS `StatCard`** (lines 28–32) with the TOTAL GIFTS card. Format the value using `Intl.NumberFormat` per DD-1 (euro, no decimals, `de-DE` locale for thousands separator). Compute the sub-text per DD-3 (uppercase cyberpunk aesthetic):

   ```tsx
   <StatCard
     label="TOTAL GIFTS"
     value={`€${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(totalGifts)}`}
   >
     <p className="text-caption text-foreground-muted mt-1">
       {giftCount > 0 ? `${giftCount} GIFTS RECEIVED` : 'NO_GIFTS_RECEIVED'}
     </p>
   </StatCard>
   ```

**Context**: The `StatCard` atom (`src/components/atoms/StatCard.tsx`) accepts `label: string`, `value: string | number`, and `children?: ReactNode`. The formatted euro string is passed as `value`. The sub-text goes in the `children` slot, using `text-caption text-foreground-muted` classes consistent with the existing cards (G-13).

**Edge cases handled**:

- Zero gifts: `€0` value, "NO_GIFTS_RECEIVED" sub-text (AC-2)
- Large sums: `Intl.NumberFormat('de-DE')` produces locale-aware thousands separator, e.g., `€12.500` (edge case 3)
- Decimals: `maximumFractionDigits: 0` rounds to nearest integer (edge case 4)

---

### TASK-003: Wire new stats from `useGuestStats` to `GuestListFooterStats` in `GuestListView`

**File**: `src/pages/GuestListView.tsx`
**Phase**: 2 (parallel — depends on TASK-001 interface)

**Changes**:

1. **Update the destructured stats** from `useGuestStats` (lines 97–104). Replace `dietaryFlagCount` with `totalGifts` and `giftCount`:

   ```typescript
   const {
     confirmedCount,
     pendingCount,
     totalGuests,
     confirmationRate,
     totalGifts,
     giftCount,
     waitlistCount,
   } = useGuestStats(guests)
   ```

2. **Update the `GuestListFooterStats` props** (lines 150–153). Pass `totalGifts` and `giftCount` instead of `dietaryFlagCount`:

   ```tsx
   <GuestListFooterStats
     confirmationRate={confirmationRate}
     totalGifts={totalGifts}
     giftCount={giftCount}
   />
   ```

**Verification**: After all three tasks, run `npm run build` (which includes `tsc -b`). TypeScript strict mode will catch any remaining references to `dietaryFlagCount` as compile errors. The pre-commit hook (`prettier --check . && npm run lint`) must also pass.

## Notes

- The `gift` field is `number | null` on the `Guest` type (`src/data/guest-types.ts:16`)
- `useGuestStats` is at `src/hooks/useGuestStats.ts`
- `GuestListFooterStats` is at `src/components/organisms/GuestListFooterStats.tsx`
- `GuestListView` passes stats at `src/pages/GuestListView.tsx:150-153`

## Changelog

- 2026-04-04: Initial draft — replace DIETARY FLAGS card with TOTAL GIFTS card showing sum of guest gifts.
- 2026-04-04: Technical plan added — 3 atomic tasks across 2 phases (TASK-001 → TASK-002 + TASK-003 parallel).
- 2026-04-04: Implementation completed. Validator found CRITICAL-1 (currency format suffix vs prefix), fixed in iteration 2. Build passes. Status → Completed.
