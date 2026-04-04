# Spec: Sticky Guest Form Actions

## Metadata

- **Slug**: `sticky-guest-form-actions`
- **Date**: 2026-04-04
- **Status**: Completed
- **Author**: User
- **Related specs**: [spec/guest-crud-flow.md](./guest-crud-flow.md)

## Description

Make the action bar (CANCEL, DELETE, SAVE_ENTRY buttons) in the guest create and edit forms always visible at the bottom of the viewport, eliminating the need to scroll down to reach the save/cancel buttons.

Currently, the action bar in `GuestForm.tsx` (line 273) is rendered as a regular `<div>` at the end of the form content. On mobile devices or when the form content is taller than the viewport, users must scroll past all form fields to reach the action buttons. This is a UX friction point — the save button should always be accessible.

The fix involves making the action bar sticky at the bottom of its scroll container (`<main>` in `GuestListView.tsx`), so it remains visible regardless of scroll position. The form content area above the action bar becomes scrollable while the buttons stay pinned.

### Key Behaviors

- **Sticky positioning**: The action bar uses `position: sticky; bottom: 0` to pin itself at the bottom of the scrollable `<main>` container.
- **Visual separation**: The action bar has a background color and top border to visually separate it from the scrollable form content above, preventing content from "showing through" behind the buttons.
- **Mobile bottom bar clearance**: On mobile (<768px), the `BottomTabBar` is fixed at the bottom with `z-40`. The form's parent `<main>` already has `pb-16 md:pb-0` to account for this. The sticky action bar sits within the `<main>` scroll area above that padding, so no additional bottom offset is needed.
- **Desktop**: On desktop, no bottom tab bar exists — the sticky bar simply pins to the bottom of the `<main>` content area.
- **No layout changes outside GuestForm**: The fix is entirely contained within `GuestForm.tsx`. No changes to parent layout components, routing, or other pages.

## User Stories

1. As a **wedding planner** filling out a long guest form on mobile, I want the save and cancel buttons to always be visible at the bottom of the screen so that I can submit the form without scrolling.
2. As a **wedding planner** editing a guest on desktop, I want the action buttons to stay visible at the bottom so I can quickly save or cancel without scrolling past all form sections.

## Acceptance Criteria

1. GIVEN the add guest form (`/guests/new`) is displayed on a viewport where the form content exceeds the visible area WHEN the user views the form THEN the action bar (CANCEL, SAVE_ENTRY) is visible at the bottom of the viewport without scrolling.

2. GIVEN the edit guest form (`/guests/:id/edit`) is displayed on a viewport where the form content exceeds the visible area WHEN the user views the form THEN the action bar (CANCEL, DELETE, SAVE_ENTRY) is visible at the bottom of the viewport without scrolling.

3. GIVEN the form is displayed on a short viewport WHEN the user scrolls the form content THEN the action bar remains fixed at the bottom and the form content scrolls behind/underneath it.

4. GIVEN the form is displayed on a tall viewport where all content fits without scrolling WHEN the user views the form THEN the action bar appears at its natural position at the end of the form (sticky has no visible effect since content doesn't overflow).

5. GIVEN the form is displayed on mobile (<768px) WHEN the action bar is sticky THEN it does not overlap with or be obscured by the `BottomTabBar` — the action bar sits above the `pb-16` padding area.

6. GIVEN the action bar is sticky WHEN the user views the form THEN the action bar has a solid background and top border so scrolling form content does not show through behind the buttons.

7. GIVEN the form is in edit mode WHEN the user views the action bar THEN all three buttons (CANCEL, DELETE, SAVE_ENTRY) are visible in the sticky bar.

8. GIVEN the form is in create mode WHEN the user views the action bar THEN the CANCEL and SAVE_ENTRY buttons are visible in the sticky bar (no DELETE button).

## Scope

### In Scope

- Making the action bar `<div>` in `GuestForm.tsx` sticky at the bottom of the scroll container
- Adding background color, top border, and appropriate padding to the sticky action bar for visual separation
- Ensuring no overlap with mobile `BottomTabBar`
- Both add and edit form modes

### Out of Scope

- Changing form field layout or order
- Changing button labels, styles, or behavior
- Changing the form's parent layout structure (`GuestListView`, `App`)
- Adding scroll shadows or scroll indicators
- Any animation/transition on the sticky bar appearance

## Edge Cases

1. **Very short form (all content visible)**: When the viewport is tall enough to display the entire form without scrolling, the sticky positioning has no visible effect — the action bar appears in its natural flow position. No visual artifacts.

2. **Keyboard open on mobile**: When a mobile keyboard is open (user is typing in a field), the viewport shrinks. The sticky action bar will remain at the bottom of the visible area, which may push it closer to the input field. This is acceptable — it's standard mobile behavior for sticky elements.

3. **Conditional fields expanding form**: When the user toggles Shuttle Required or Lodging Booked, the form grows taller. The sticky bar remains pinned regardless of form height changes.

4. **Delete confirmation dialog**: The `ConfirmDialog` overlay renders outside the form flow (fixed position, z-50). The sticky action bar does not interfere with the dialog.

## Design Decisions

### DD-1: Use `position: sticky` Rather Than Fixed Positioning

**Decision**: Use `sticky bottom-0` on the action bar `<div>` within the scrollable `<main>` rather than `fixed` positioning.
**Reasoning**: `position: sticky` keeps the element in the document flow and automatically pins it at the bottom of its scroll container. Unlike `fixed`, it doesn't require calculating offsets for the TopNav, LeftSidebar, or BottomTabBar. It also naturally falls into place when the form is short enough to fit without scrolling. The parent `<main>` in `GuestListView.tsx:121` has `overflow-y-auto`, which establishes the scroll container for sticky positioning.

### DD-2: Solid Background on Action Bar

**Decision**: Apply `bg-background` (or `bg-surface`) and `border-t border-border` to the sticky action bar.
**Reasoning**: Without an opaque background, scrolling form content would be visible behind the action bar buttons, creating visual noise. A solid background with a top border creates a clean separation between scrollable content and the persistent actions. Using `bg-background` matches the main content area background.

### DD-3: Padding Adjustments

**Decision**: Move `pb-6` from the action bar to a padding on the form content area, and apply `py-4` to the sticky action bar itself. Remove `mt-8` from the action bar (the border provides visual separation). Add `pb-20` or equivalent spacer to the form content so the last form section isn't hidden behind the sticky bar.
**Reasoning**: The sticky bar needs its own vertical padding for visual balance. The form content needs bottom padding to ensure the last section remains scrollable above the sticky bar.

## UI/UX Details

### Sticky Action Bar — Visual

```
┌──────────────────────────────────────────┐
│  (TopNav)                                │
├──────────┬───────────────────────────────┤
│          │  NEW_GUEST_ENTRY              │
│ SIDEBAR  │  ─────────────────────        │
│          │                               │
│          │  [form sections scroll here]  │
│          │  ...                          │
│          │  ...                          │
│          │───────────────────────────────│
│          │  [CANCEL]   [DELETE] [SAVE]   │  ← sticky, always visible
│          │                               │
└──────────┴───────────────────────────────┘
```

### Mobile Layout

```
┌──────────────────────────┐
│ (TopNav)                 │
├──────────────────────────┤
│                          │
│  [form sections scroll]  │
│  ...                     │
│  ...                     │
│──────────────────────────│
│  [CANCEL]   [SAVE_ENTRY] │  ← sticky action bar
├──────────────────────────┤
│ CANVAS   GUESTS          │  ← BottomTabBar (fixed, separate)
└──────────────────────────┘
```

## Technical Plan

### Impact Analysis

#### Affected Areas

| Area       | Files                                    | Type     |
| ---------- | ---------------------------------------- | -------- |
| Guest form | `src/components/organisms/GuestForm.tsx` | Modified |

#### Integration Points

1. **`GuestForm.tsx` ↔ `GuestListView.tsx`**: The form renders inside `<main className="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0">`. The `overflow-y-auto` on `<main>` is the scroll container that enables `position: sticky` to work correctly.

#### Risk Areas

- **Sticky context**: `position: sticky` requires the nearest scrolling ancestor to be the intended container. The `<main>` element in `GuestListView.tsx:121` has `overflow-y-auto`, which establishes it as the scroll container. The `<form>` element inside must **not** have `overflow` set, or it would create a nested scroll context that breaks sticky behavior.
- **DOM chain**: GuestForm returns a React fragment (`<> <form>... </form> <ConfirmDialog /> </>`). The fragment dissolves in the DOM, so `<form>` becomes a direct child of `<main>`. The sticky `<div>` inside `<form>` works correctly because `<form>` has no `overflow` property — verified in GuestForm.tsx (the `<form>` at line 105 has no `className` at all). Neither AddGuestPage nor EditGuestPage add any wrapper elements with overflow.

---

### Task Breakdown

#### TASK-001: Make Action Bar Sticky in GuestForm

**Description**: Modify the action bar `<div>` in `GuestForm.tsx` to use `sticky bottom-0` positioning with an opaque background and top border.

**Affected files**:

- `src/components/organisms/GuestForm.tsx` (modified)

**Implementation instructions**:

1. In `GuestForm.tsx`, locate the action bar div (currently line 273):

   ```tsx
   <div className="flex justify-end gap-3 mt-8 px-4 md:px-6 pb-6">
   ```

2. Replace with sticky positioning and visual treatment:

   ```tsx
   <div className="sticky bottom-0 flex justify-end gap-3 px-4 md:px-6 py-4 bg-background border-t border-border">
   ```

   Changes:
   - Add `sticky bottom-0` — pins to bottom of scroll container
   - Replace `mt-8 pb-6` with `py-4` — balanced vertical padding for the sticky bar
   - Add `bg-background` — opaque background prevents content showing through
   - Add `border-t border-border` — visual separator from scrollable content

3. Add bottom padding to the form content area (the `<div>` at line 117) to ensure the last form section has space and doesn't get hidden behind the sticky bar. Change:
   ```tsx
   <div className="px-4 md:px-6 pb-6">
   ```
   to:
   ```tsx
   <div className="px-4 md:px-6 pb-24">
   ```
   The `pb-24` (6rem = 96px) provides clearance for the sticky action bar height (`py-4` = 32px padding + ~40px button = ~72px) plus breathing room, ensuring the last form section scrolls fully above the sticky bar.

**Project context**:

- `GuestForm.tsx` is rendered inside `<main className="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0">` (GuestListView.tsx:121), which is the scroll container
- The `<form>` element in GuestForm does not have `overflow` set, so sticky will work against the `<main>` ancestor
- `bg-background` is a design system token defined in `index.css:29` as `--color-background: var(--color-gray-900)` — valid Tailwind v4 utility
- `border-border` is a design system token defined in `index.css:35` as `--color-border: var(--nc-border)` — valid Tailwind v4 utility
- BottomTabBar is `fixed bottom-0 z-40` and `<main>` already has `pb-16` on mobile — the sticky bar will be above this padding

**Dependencies**: None

**Acceptance criteria**:

- Action bar stays visible at the bottom of the viewport when scrolling the form
- Action bar has opaque background (no content bleeding through)
- Action bar has a top border for visual separation
- On mobile, action bar does not overlap with BottomTabBar
- On desktop, action bar pins at the bottom of the main content area
- When form content fits without scrolling, the action bar appears at its natural position
- All buttons (CANCEL, DELETE in edit mode, SAVE_ENTRY) remain functional
- TypeScript compiles without errors

---

### Execution Order

| Order | Task     | Reason                       |
| ----- | -------- | ---------------------------- |
| 1     | TASK-001 | Single task, no dependencies |

### Verification Checklist

After implementation, verify all of the following:

- [ ] `npm run build` completes without TypeScript errors
- [ ] `npm run lint` passes
- [ ] `npm run format:check` passes (or run `npm run format` first)
- [ ] On `/guests/new` (mobile viewport): action bar is visible without scrolling when form overflows
- [ ] On `/guests/:id/edit` (mobile viewport): action bar with CANCEL, DELETE, SAVE_ENTRY is visible without scrolling
- [ ] On desktop viewport: action bar pins at the bottom of `<main>` content area
- [ ] Scrolling the form: content scrolls behind the action bar, which remains pinned
- [ ] Action bar has opaque `bg-background` — no content visible behind buttons
- [ ] Action bar has `border-t border-border` top border visible
- [ ] On mobile: action bar does not overlap with BottomTabBar (sits above `pb-16` padding)
- [ ] On tall viewport (form fits without scrolling): action bar appears at natural position, no visual artifacts
- [ ] Last form section (LOGISTICS_CONFIG) is fully visible when scrolled to bottom (not hidden behind sticky bar)
- [ ] CANCEL button navigates back
- [ ] SAVE_ENTRY button submits the form
- [ ] DELETE button (edit mode) opens ConfirmDialog
- [ ] ConfirmDialog renders correctly above the sticky bar (z-50 fixed overlay)

---

## Changelog

- 2026-04-04: Spec created by PM (Confirmed status)
- 2026-04-04: Technical plan validated by TPM
- 2026-04-04: Verification by TPM — **PASS with caveat**

### Verification Summary

**Result: PASS (with out-of-scope change noted)**

All implementation requirements for TASK-001 were completed correctly in `GuestForm.tsx`:

- **Action bar sticky positioning**: `sticky bottom-0` applied at line 273 — correct.
- **Visual treatment**: `bg-background border-t border-border` applied — correct.
- **Padding swap on action bar**: `mt-8 pb-6` replaced with `py-4` — correct.
- **Form content padding**: `pb-6` replaced with `pb-24` at line 117 — correct.
- **Button markup/handlers**: Unchanged — CANCEL, DELETE (edit mode), SAVE_ENTRY all intact.
- **Build**: `tsc -b && vite build` passed per task report.

**Acceptance criteria**: All 8 acceptance criteria from the spec are met by the code changes.

**Additional scope (user-requested)**: During development, the user also requested removing the entire logistics section (shuttle/lodging) from the app. This was implemented as TASK-002 through TASK-006, modifying 6 files: `guest-types.ts`, `guest-store.ts`, `mock-guests.ts`, `GuestForm.tsx`, `GuestDetailPanel.tsx`, `ImportGuestsPage.tsx`. The orphaned `Toggle.tsx` atom was also deleted.

- 2026-04-04: Logistics removal implemented (TASK-002 through TASK-006)
- 2026-04-04: Validation APPROVED — all checks pass, zero CRITICAL/MAJOR findings
- 2026-04-04: Status set to Completed
