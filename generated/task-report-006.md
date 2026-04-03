# Task Report — TASK-006: Organism — GuestListHeader

## Status: COMPLETE

## File Created

- `src/components/organisms/GuestListHeader.tsx`

## Implementation Summary

Created the `GuestListHeader` organism component with responsive desktop/mobile layouts.

### Props

| Prop             | Type     | Description                 |
| ---------------- | -------- | --------------------------- |
| `confirmedCount` | `number` | Number of confirmed guests  |
| `pendingCount`   | `number` | Number of pending guests    |
| `totalGuests`    | `number` | Total guest count           |
| `waitlistCount`  | `number` | Number of waitlisted guests |

### Desktop Layout (`hidden md:block`)

- Label: `REGISTRY.SYSTEM_V4` with `text-label text-primary tracking-wider`
- Title: `GUEST_LIST` with `text-heading-1 text-foreground-heading mt-1`
- Two `StatCard` components in `flex gap-4 mt-4`:
  - "TOTAL CONFIRMED" / `confirmedCount`
  - "PENDING" / `pendingCount`

### Mobile Layout (`md:hidden`)

- Label: `SYSTEM_LOG` with `text-label text-primary tracking-wider`
- Title: `GUEST LIST` with `text-heading-1 text-foreground-heading mt-1`
- Subtitle: `STATUS: {confirmedCount} / {totalGuests} CONFIRMED` with `text-caption text-foreground-muted mt-1`
- Two `StatCard` components in `grid grid-cols-2 gap-3 mt-4` with `mobileBorder` prop:
  - "TOTAL GUESTS" / `totalGuests`
  - "WAITLIST" / `waitlistCount`

### Wrapper

- `<div className="px-4 md:px-6 py-4 md:py-6">`

## Conventions Followed

- No semicolons
- Single quotes
- 2-space indentation
- Function declaration (`function GuestListHeader`)
- Default export (`export default GuestListHeader`)
- No barrel files
- Relative imports (`../atoms/StatCard`)

## Verification

- TypeScript type-check (`tsc --noEmit`): **PASS** — zero errors
