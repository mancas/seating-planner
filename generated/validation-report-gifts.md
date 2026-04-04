# Validation Report — Replace Dietary Flags with Total Gifts

## Metadata

- **Spec**: `spec/update-dietary-flags-metrics.md`
- **Iteration**: 1 of 2
- **Date**: 2026-04-04
- **Verdict**: CHANGES_REQUESTED

## Files Reviewed

| File                                                | Lines | Status   |
| --------------------------------------------------- | ----- | -------- |
| `src/hooks/useGuestStats.ts`                        | 24    | MODIFIED |
| `src/components/organisms/GuestListFooterStats.tsx` | 53    | MODIFIED |
| `src/pages/GuestListView.tsx`                       | 172   | MODIFIED |

## Automated Checks

| Check                      | Result             |
| -------------------------- | ------------------ |
| `tsc -b && vite build`     | PASS (zero errors) |
| `dietaryFlagCount` removed | PASS (zero refs)   |

---

## Findings

### CRITICAL-1: Currency formatting deviates from spec — euro suffix instead of prefix

**Severity**: CRITICAL
**File**: `src/components/organisms/GuestListFooterStats.tsx`, lines 35-39
**Spec reference**: DD-1, TASK-002 code block, AC-1 examples, AC-2 zero state

**Expected** (spec TASK-002 explicit code):

```tsx
value={`€${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(totalGifts)}`}
```

Output: `€1.250`, `€0`, `€12.500`

**Actual** (implementation):

```tsx
value={new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
}).format(totalGifts)}
```

Output: `1.250 €`, `0 €`, `12.500 €`

**Impact**: The `style: 'currency'` option delegates symbol placement to locale rules. In `de-DE`, the euro symbol is placed after the number with a non-breaking space. This contradicts:

- DD-1: "Use `€` prefix with `Intl.NumberFormat('de-DE')`"
- AC-1: "formatted as currency (e.g., `€1,250`)"
- AC-2: 'value "€0"'
- UI mockup: `€1,250` and `€0`

The spec explicitly chose a manual `€` prefix with a plain number formatter to avoid locale-dependent symbol placement. Per G-24 (spec is authoritative for literal values), the spec's exact pattern must be used.

**Fix**: In `GuestListFooterStats.tsx`, replace lines 35-39 with:

```tsx
value={`€${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(totalGifts)}`}
```

---

### No MAJOR findings.

### No MINOR findings.

---

## Acceptance Criteria Verification

| AC  | Description                                                          | Status  | Notes                                                                         |
| --- | -------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------- |
| 1   | Card shows "TOTAL GIFTS", formatted currency sum, "X GIFTS RECEIVED" | PARTIAL | Label and sub-text correct; currency format has euro suffix instead of prefix |
| 2   | Zero state shows "TOTAL GIFTS", "€0", "NO_GIFTS_RECEIVED"            | FAIL    | Will show `0 €` instead of `€0`                                               |
| 3   | Recalculates on guest add/edit/delete                                | PASS    | `useMemo([guests])` recomputes; view re-reads store after mutations           |
| 4   | Footer stats remain hidden below 768px                               | PASS    | `hidden md:grid` class unchanged                                              |

## Convention Compliance

| Convention                           | Status | Notes                                                               |
| ------------------------------------ | ------ | ------------------------------------------------------------------- |
| G-29: Clean up vestigial props       | PASS   | `dietaryFlagCount` fully removed from all 3 files                   |
| G-37: Remove dead exports            | PASS   | No remaining references to `dietaryFlagCount` in `src/`             |
| G-17: Single source of truth         | PASS   | Gift aggregation computed in `useGuestStats`, not inline            |
| G-13: Design system typography       | PASS   | `text-caption text-foreground-muted` consistent with existing cards |
| G-24: Spec literal values            | FAIL   | Currency format deviates from spec's explicit code (CRITICAL-1)     |
| Prettier (no semi, single quotes)    | PASS   | Build passed                                                        |
| `interface Props` at top of file     | PASS   | Correctly defined with new fields                                   |
| Default export at bottom             | PASS   | All 3 files maintain convention                                     |
| `import type` for type-only imports  | PASS   | `useGuestStats.ts` uses `import type { Guest }`                     |
| UPPERCASE text / cyberpunk aesthetic | PASS   | "TOTAL GIFTS", "GIFTS RECEIVED", "NO_GIFTS_RECEIVED" all uppercase  |

## Code Quality Assessment

### useGuestStats.ts — GOOD

- Clean `useMemo` with correct dependency `[guests]`
- `g.gift ?? 0` is idiomatic and functionally equivalent to spec's explicit null check
- `giftCount` filter is clear and correct
- No unnecessary complexity

### GuestListFooterStats.tsx — GOOD (except CRITICAL-1)

- Props interface is clean and minimal
- Sub-text conditional logic correct (`giftCount > 0`)
- Typography classes match existing card patterns
- `Intl.NumberFormat` approach is reasonable (but wrong variant chosen)

### GuestListView.tsx — GOOD

- Destructuring updated cleanly
- Props passed through correctly
- No unused variables or dead code

---

## Required Changes

1. **CRITICAL-1**: Fix currency formatting in `GuestListFooterStats.tsx:35-39` — replace `style: 'currency', currency: 'EUR'` with manual `€` prefix and plain `Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 })`.

## Delegation

- **TASK-002 developer**: Fix CRITICAL-1 in `src/components/organisms/GuestListFooterStats.tsx`
