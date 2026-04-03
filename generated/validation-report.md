# Validation Report — `guest-list-screen`

**Date**: 2026-04-03
**Validator**: Validator Agent
**Build Status**: PASS (`tsc -b && vite build` succeeds)
**Verdict**: **PASS WITH ISSUES** — 1 critical bug, 4 major issues, 8 minor issues

---

## Summary

The implementation is comprehensive and well-structured. All 28 acceptance criteria are addressed, the atomic design organization is correct, conventions are largely followed, and responsive layouts are properly implemented. However, there is one critical logic bug in the detail panel, several spec compliance deviations, and a handful of accessibility/quality improvements needed.

---

## CRITICAL Issues

### C-1: Shuttle label shows "SHUTTLE REQUIRED" regardless of shuttle status

**File**: `src/components/organisms/GuestDetailPanel.tsx:119-121`
**Description**: The ternary for the shuttle label renders `'SHUTTLE REQUIRED'` in both the true and false branches:

```tsx
{
  guest.logistics.shuttleRequired ? 'SHUTTLE REQUIRED' : 'SHUTTLE REQUIRED'
}
```

Both branches produce the same string. When `shuttleRequired` is `false`, the label should display something like `'NO SHUTTLE'` or `'SHUTTLE: N/A'` to differentiate. The sub-label correctly shows `'N/A'` for the value, but the heading is misleading for guests who don't need a shuttle.

**Impact**: Incorrect information displayed to the user — a guest who does NOT require a shuttle is shown "SHUTTLE REQUIRED". This is a functional bug that could lead to planning errors.

**Spec reference**: AC-13 (detail panel shows logistics), Edge Case 5 (null logistics shows "N/A").

---

## MAJOR Issues

### M-1: `IconButton` missing `focus-visible` outline

**File**: `src/components/atoms/IconButton.tsx:14`
**Description**: The spec (TASK-002 instruction 7) requires `focus-visible:outline-2 focus-visible:outline-ring` on the IconButton. The current implementation only has hover and transition styles — no focus-visible outline. Guardrail G-8 mandates `focus-visible` for buttons.

```tsx
className =
  'p-2 rounded hover:bg-surface-elevated text-foreground-muted hover:text-foreground transition-colors cursor-pointer'
```

**Missing**: `focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2`

**Impact**: Keyboard users cannot see focus on icon buttons (close panel, settings, row actions). This is an accessibility violation per guardrail G-8.

### M-2: `NavLink` missing `text-label` typography class

**File**: `src/components/atoms/NavLink.tsx:11`
**Description**: The spec (TASK-002 instruction 8) requires "uppercase text-label typography" on NavLink. The component has `uppercase` but is missing the `text-label` class, so the text will render in whatever inherited font size rather than the design system's 12px/500 weight/0.8px tracking label style.

```tsx
className={`uppercase ${isActive ? ...`}
```

**Should include**: `text-label tracking-wider` (the `text-label` custom utility sets font-size, weight, line-height, and letter-spacing per the design system).

**Impact**: NavLink text may not match the design system typography scale. This is a convention/design-system compliance issue.

### M-3: `NavLink` missing `cursor-pointer`

**File**: `src/components/atoms/NavLink.tsx:9-18`
**Description**: The `NavLink` `<button>` element does not have `cursor-pointer`. Tailwind's preflight resets `cursor` to `default` on buttons, so without `cursor-pointer`, hovering over nav links won't show a pointer cursor — unlike all other clickable elements in the codebase (`SidebarNavItem`, `GuestRow`, `FAB`, `IconButton`, etc.), which all explicitly include `cursor-pointer`.

**Impact**: UX inconsistency — hovering over top nav links won't show pointer cursor.

### M-4: `GuestTable` hardcodes `totalSeats: 8` for UNASSIGNED group on mobile

**File**: `src/components/organisms/GuestTable.tsx:99`
**Description**: The spec (TASK-007 instruction 4) explicitly states: "UNASSIGNED group: location = 'UNASSIGNED', tableName = 'NO TABLE', seatCount = count, **totalSeats = 0**." The code passes `totalSeats={8}` for all groups, including UNASSIGNED, which displays as e.g., "2 / 8 seats" instead of an appropriate representation for unassigned guests.

```tsx
<TableGroupHeader
  location={getLocationLabel(tableKey)}
  tableName={tableName}
  seatCount={groupGuests.length}
  totalSeats={8} // Should be 0 for UNASSIGNED
/>
```

**Impact**: Incorrect seat capacity display for the UNASSIGNED group on mobile. Misleading to the user.

---

## MINOR Issues

### m-1: `StatCard` value uses `text-heading-3` — spec says `text-heading-4`

**File**: `src/components/atoms/StatCard.tsx:18`
**Description**: The spec (TASK-002 instruction 5) says the value should use `text-heading-4 text-foreground-heading`, but the implementation uses `text-heading-3` (24px vs 20px). This makes stat card values larger than specified.

### m-2: `GuestListHeader` titles use `text-heading-1` — spec says `text-heading-3`

**File**: `src/components/organisms/GuestListHeader.tsx:23,35`
**Description**: The spec (TASK-006 instruction 2-3) specifies `text-heading-3` for the "GUEST_LIST" / "GUEST LIST" title. The implementation uses `text-heading-1` which is significantly larger (32px vs 24px). Semantically using `h1` is fine, but the visual size deviates from the tech plan.

### m-3: `TableGroupHeader` seat display format not zero-padded and lowercase

**File**: `src/components/molecules/TableGroupHeader.tsx:24`
**Description**: The spec mobile layout example shows "08/08 SEATS" (zero-padded, no spaces around slash, uppercase "SEATS"). The implementation shows `{seatCount} / {totalSeats} seats` (not padded, spaces around slash, lowercase "seats").

**Current**: `2 / 8 seats`
**Expected**: `02/08 SEATS`

### m-4: `TableGroupHeader` table name uses `text-heading-4` — spec says `text-body font-semibold`

**File**: `src/components/molecules/TableGroupHeader.tsx:20`
**Description**: TASK-003 instruction 5 specifies `text-body font-semibold text-foreground-heading` for the table name. The implementation uses `text-heading-4` which is 20px/600 vs the expected 16px/600.

### m-5: Mock data names and IDs deviate from spec

**File**: `src/data/mock-guests.ts`
**Description**: The spec (TASK-001 instructions 6-7) specifies: ALEXANDER VANCE, ELARA SANTOS, MARCUS CHEN, SOPHIA LOWE, JULIAN DRAKE, NOVA REYES with IDs "4492-AX", "3371-BK", "5580-CR", "2218-DL", "6643-EM", "7789-FN". The implementation uses different names (ELARA RIVERA, MARCUS STERLING, SARA MORGAN, JULIAN KANE) and different IDs. Naming is cosmetic, so this is minor.

### m-6: DECLINED guest has `tableAssignment: null` — spec says `TABLE_01`

**File**: `src/data/mock-guests.ts:113`
**Description**: The spec (TASK-001 instruction 5) puts the DECLINED guest at `TABLE_01` with `seatNumber: 1`. The implementation has this guest with `tableAssignment: null`, `seatNumber: null`. This means there are 2 unassigned guests instead of 1, and TABLE_01 doesn't exist in the data. All required data variations are still covered, but the distribution differs.

### m-7: Missing keyboard accessibility on clickable div elements

**Files**: `src/components/molecules/GuestRow.tsx:22`, `src/components/molecules/SidebarNavItem.tsx:14`
**Description**: `GuestRow` and `SidebarNavItem` use `<div onClick={...}>` without `role="button"`, `tabIndex={0}`, or `onKeyDown` handlers. These are interactive elements that are only accessible via mouse/touch. For proper a11y, clickable non-button elements should include keyboard support or use `<button>` elements.

### m-8: Implicit `StatusBadge` visibility coupling in `GuestDetailPanel`

**File**: `src/components/organisms/GuestDetailPanel.tsx:55`
**Description**: `StatusBadge` uses `hidden md:inline-flex` (hidden on mobile, visible on desktop). Since `GuestDetailPanel` is also `hidden md:flex`, the badge is correctly visible in context. However, if the panel were ever made visible on mobile (future spec), the status badge inside would be hidden. This is an architectural coupling note, not a current bug.

---

## Acceptance Criteria Verification

| AC  | Description                                                   | Status  | Notes                                   |
| --- | ------------------------------------------------------------- | ------- | --------------------------------------- |
| 1   | App loads at `/` with guest list                              | PASS    | Default tab is `guests`                 |
| 2   | Three-panel layout visible                                    | PASS    | TopNav + LeftSidebar + main content     |
| 3   | Top nav: brand, nav links, search, settings, avatar           | PASS    | NavLink missing `text-label` (M-2)      |
| 4   | Left sidebar: session info, nav items, ADD GUEST, HISTORY     | PASS    | Objects highlighted, ADD GUEST present  |
| 5   | Header: REGISTRY.SYSTEM_V4, GUEST_LIST, stat cards            | PASS    | Typography size differs from spec (m-2) |
| 6   | Data table columns: NAME/ID, STATUS, TABLE, ACTIONS           | PASS    |                                         |
| 7   | Guest row: avatar, name, ID code, status, table               | PASS    |                                         |
| 8   | CONFIRMED badge: filled cobalt                                | PASS    |                                         |
| 9   | PENDING badge: outlined cobalt                                | PASS    |                                         |
| 10  | DECLINED badge: outlined muted red                            | PASS    |                                         |
| 11  | Bottom stat cards: rate, dietary, RSVP                        | PASS    | Progress bar, URGENT badge present      |
| 12  | Click row opens detail panel                                  | PASS    |                                         |
| 13  | Detail panel contents                                         | PARTIAL | Shuttle label bug (C-1)                 |
| 14  | Close button closes panel                                     | PASS    |                                         |
| 15  | Search filters by name                                        | PASS    | Case-insensitive substring match        |
| 16  | ADD GUEST visual feedback                                     | PASS    | Button styled, onClick is no-op         |
| 17  | `/?tab=canvas` shows canvas placeholder                       | PASS    | Shows "{TAB} // MODULE_OFFLINE"         |
| 18  | Unrecognized tab defaults to guests                           | PASS    | Validates against allowed list          |
| 19  | Atomic design, no barrel files                                | PASS    | atoms/molecules/organisms, no index.ts  |
| 20  | Mobile: single-column, no sidebar, no detail panel            | PASS    |                                         |
| 21  | Mobile: simplified top bar                                    | PASS    | Brand + cobalt dot + settings + avatar  |
| 22  | Mobile: header with SYSTEM_LOG, stat cards with cobalt border | PASS    |                                         |
| 23  | Mobile: guests grouped by table                               | PASS    | UNASSIGNED group totalSeats wrong (M-4) |
| 24  | Mobile: guest rows with seat, name, role, icon                | PASS    |                                         |
| 25  | Mobile: bottom tab bar with 4 tabs                            | PASS    |                                         |
| 26  | Mobile: FAB visible                                           | PASS    | Person-add icon, cobalt, circular       |
| 27  | Mobile: guest tap highlights, no detail panel                 | PASS    |                                         |
| 28  | Mobile: tab bar changes query param                           | PASS    |                                         |

## Edge Case Verification

| EC  | Description                                    | Status  | Notes                                          |
| --- | ---------------------------------------------- | ------- | ---------------------------------------------- |
| 1   | No guest selected on load — panel hidden       | PASS    | `selectedGuestId` starts null                  |
| 2   | Search no results — empty state                | PASS    | "NO_RESULTS // QUERY_MISMATCH"                 |
| 3   | No table assignment — shows "- - -"            | PASS    | Nullish coalescing in GuestRow and DetailPanel |
| 4   | No dietary — shows NO_RESTRICTIONS             | PASS    | Conditional in GuestDetailPanel                |
| 5   | No logistics — shows N/A                       | PARTIAL | Value shows N/A but label is wrong (C-1)       |
| 6   | Click different guest — panel switches         | PASS    | Toggle logic in `onGuestClick`                 |
| 7   | Click same guest — panel closes                | PASS    | Toggle logic in `onGuestClick`                 |
| 8   | Search cleared — full list restored            | PASS    | Empty query returns all guests                 |
| 9   | Unassigned guests in UNASSIGNED group (mobile) | PASS    | Map key "UNASSIGNED", sorted last              |
| 10  | Resize across breakpoint — layout switches     | PASS    | Tailwind responsive classes, no JS media query |

---

## Convention Compliance

| Convention                             | Status | Notes                                               |
| -------------------------------------- | ------ | --------------------------------------------------- |
| No semicolons                          | PASS   | All files checked                                   |
| Single quotes                          | PASS   | All files checked                                   |
| 2-space indent                         | PASS   | All files checked                                   |
| `verbatimModuleSyntax` (`import type`) | PASS   | All type-only imports use `import type`             |
| PascalCase components                  | PASS   | All component files                                 |
| Function declarations                  | PASS   | All components use `function Foo()`                 |
| Default exports                        | PASS   | All components use `export default`                 |
| No barrel files                        | PASS   | No `index.ts` or `index.tsx` files in any directory |
| Trailing commas                        | PASS   | Prettier enforced                                   |

---

## Best Practices Assessment

### React 19 + TypeScript

| Practice                               | Status | Notes                                                           |
| -------------------------------------- | ------ | --------------------------------------------------------------- |
| Proper key usage in lists              | PASS   | All `.map()` use stable `key={guest.id}`                        |
| No unnecessary re-renders              | PASS   | State is minimal and local; acceptable for mock data scale      |
| `import type` for type-only imports    | PASS   | All 9 type imports use `import type { ... }`                    |
| No `forwardRef` (React 19 ref-as-prop) | N/A    | No refs used                                                    |
| Controlled inputs                      | PASS   | SearchInput is controlled                                       |
| Proper event handler patterns          | PASS   | Arrow functions in callbacks, no inline object creation in deps |

### TailwindCSS v4

| Practice                               | Status | Notes                                                              |
| -------------------------------------- | ------ | ------------------------------------------------------------------ |
| `@theme` for token definitions         | PASS   | Pre-existing, correctly used                                       |
| Semantic color classes used            | PASS   | `bg-primary`, `text-foreground-muted`, `bg-surface-elevated`, etc. |
| Responsive with `md:` prefix           | PASS   | Consistent 768px breakpoint usage                                  |
| No arbitrary values where tokens exist | PASS   | Uses design system tokens throughout                               |
| `.card`, `.btn-primary`, etc. reused   | PASS   | Existing component classes leveraged                               |

### Accessibility

| Practice                     | Status  | Notes                                                                              |
| ---------------------------- | ------- | ---------------------------------------------------------------------------------- |
| `aria-label` on icon buttons | PARTIAL | `IconButton` and `FAB` have labels; `NavLink` and `TabBarItem` use visible text    |
| `focus-visible` on buttons   | FAIL    | Missing on `IconButton` (M-1)                                                      |
| Semantic HTML                | PARTIAL | Uses `<nav>`, `<aside>`, `<main>`, `<header>`; but clickable divs lack roles (m-7) |
| Keyboard navigation          | PARTIAL | Buttons are keyboard-accessible; clickable divs are not (m-7)                      |

---

## Code Quality Assessment

### Strengths

1. **Clean component boundaries** — Each atom/molecule/organism has a clear, single responsibility
2. **Correct responsive approach** — Single components with Tailwind responsive utilities, no duplicate mobile/desktop components
3. **Proper type safety** — `import type` used correctly throughout, `GuestStatus` union type enforced
4. **Good data layer** — Mock data module with helper functions is clean and easily replaceable
5. **Correct toggle behavior** — Guest selection with toggle-on-same-click logic is implemented correctly
6. **Good state management** — Local state with `useState` for selected guest and search, `useSearchParams` for tab routing
7. **Proper list rendering** — All `.map()` calls use stable `key={guest.id}` props
8. **Tab validation** — Unrecognized tab values properly default to `guests`
9. **Search does not affect header stats** — Stats always reflect full dataset (per spec DD-7)

### Observations (not issues)

1. **Stat functions called on every render** — `getConfirmedCount()`, `getPendingCount()`, etc. filter the full array each time. Fine for 6 guests; would benefit from `useMemo` at scale.
2. **Filtering + grouping computed on every render** in `GuestTable`. Acceptable for mock data.
3. **`getLocationLabel` uses fragile parseInt** — Maps table number to letter via `String.fromCharCode(64 + parseInt(...))`. Works for current data but would fail for non-numeric table names.

---

## Files Reviewed

| File                                                | Lines | Status     |
| --------------------------------------------------- | ----- | ---------- |
| `src/data/mock-guests.ts`                           | 184   | OK         |
| `src/components/atoms/StatusBadge.tsx`              | 23    | OK         |
| `src/components/atoms/StatusIcon.tsx`               | 42    | OK         |
| `src/components/atoms/Avatar.tsx`                   | 25    | OK         |
| `src/components/atoms/StatCard.tsx`                 | 24    | m-1        |
| `src/components/atoms/SearchInput.tsx`              | 39    | OK         |
| `src/components/atoms/IconButton.tsx`               | 21    | M-1        |
| `src/components/atoms/NavLink.tsx`                  | 22    | M-2, M-3   |
| `src/components/atoms/FAB.tsx`                      | 32    | OK         |
| `src/components/atoms/TabBarItem.tsx`               | 34    | OK         |
| `src/components/molecules/GuestRow.tsx`             | 71    | m-7        |
| `src/components/molecules/SidebarNavItem.tsx`       | 22    | m-7        |
| `src/components/molecules/GuestDetailSection.tsx`   | 19    | OK         |
| `src/components/molecules/TableGroupHeader.tsx`     | 32    | m-3, m-4   |
| `src/components/organisms/TopNav.tsx`               | 69    | OK         |
| `src/components/organisms/LeftSidebar.tsx`          | 50    | OK         |
| `src/components/organisms/GuestTable.tsx`           | 118   | M-4        |
| `src/components/organisms/GuestDetailPanel.tsx`     | 168   | C-1, m-8   |
| `src/components/organisms/GuestListHeader.tsx`      | 50    | m-2        |
| `src/components/organisms/GuestListFooterStats.tsx` | 41    | OK         |
| `src/components/organisms/BottomTabBar.tsx`         | 88    | OK         |
| `src/App.tsx`                                       | 90    | OK         |
| `src/App.css`                                       | 0     | OK (empty) |
| `src/index.css` (`#root` rule)                      | 6     | OK         |

**Total**: 24 files reviewed, ~1,254 lines of new/modified code

---

## Verdict

**PASS WITH ISSUES** — The feature is substantially complete and the build passes. 27/28 acceptance criteria fully pass, 1 partial (AC-13). 9/10 edge cases fully pass, 1 partial (EC-5). The single critical bug (C-1) is a copy-paste error with a trivial fix.

### Required fixes before merge:

1. **C-1**: Fix shuttle label ternary in `GuestDetailPanel.tsx:119-121` — both branches show "SHUTTLE REQUIRED"

### Strongly recommended fixes:

2. **M-1**: Add `focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2` to `IconButton` (accessibility, guardrail G-8)
3. **M-2**: Add `text-label tracking-wider` to `NavLink` (design system compliance)
4. **M-3**: Add `cursor-pointer` to `NavLink` button (UX consistency)
5. **M-4**: Pass `totalSeats={tableKey === 'UNASSIGNED' ? 0 : 8}` in `GuestTable` mobile view
