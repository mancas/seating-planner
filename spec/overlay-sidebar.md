# Overlay Sidebar

| Field  | Value             |
| ------ | ----------------- |
| Slug   | `overlay-sidebar` |
| Date   | 2026-04-04        |
| Status | Completed         |

## Description

Convert the two right-side panels — **GuestDetailPanel** (guest list view) and **CanvasPropertiesPanel** (seating canvas view) — from static flex children that push the layout to **overlay panels** that float on top of the main content. This eliminates the jarring 320px layout shift that occurs when a panel opens or closes, keeping the main content area stable.

Mobile behavior remains unchanged: GuestDetailPanel already uses `fixed inset-0 z-50` (fullscreen overlay), and CanvasPropertiesPanel is hidden on mobile (replaced by MobilePropertiesSheet bottom drawer).

## User Stories

1. **As a user**, I want the guest detail panel to appear on top of the guest list so the table layout doesn't shift when I select a guest.
2. **As a user**, I want the table properties panel to appear on top of the canvas so the canvas doesn't resize when I select a table.
3. **As a user**, I want to close the overlay panel by clicking a backdrop area or the close button.
4. **As a user**, I want the panel to slide in smoothly from the right so the interaction feels polished.

## Acceptance Criteria

### AC-1: GuestDetailPanel overlays content on desktop

- **GIVEN** I am on the guest list page at `md` breakpoint or wider
- **WHEN** I click a guest row
- **THEN** the GuestDetailPanel appears as a fixed/absolute overlay on the right side, positioned on top of the main content, with `z-index` above the main content
- **AND** the main content area does NOT shrink or shift horizontally

### AC-2: CanvasPropertiesPanel overlays content on desktop

- **GIVEN** I am on the seating plan page at `md` breakpoint or wider
- **WHEN** I click/select a table on the canvas
- **THEN** the CanvasPropertiesPanel appears as a fixed/absolute overlay on the right side, positioned on top of the main content
- **AND** the canvas does NOT resize or reflow

### AC-3: Slide-in animation

- **GIVEN** either overlay panel is about to appear
- **WHEN** it mounts into the DOM
- **THEN** it slides in from the right edge over ~200ms with an ease-out curve
- **AND** when closing, it slides out to the right over ~150ms

### AC-4: Semi-transparent backdrop (GuestDetailPanel only)

- **GIVEN** the GuestDetailPanel is open on desktop
- **WHEN** it is visible
- **THEN** a semi-transparent backdrop (`bg-black/20`) covers the main content area (not the left sidebar)
- **AND** clicking the backdrop closes the panel

### AC-5: CanvasPropertiesPanel — no backdrop

- **GIVEN** the CanvasPropertiesPanel is open on desktop
- **WHEN** it is visible
- **THEN** there is NO backdrop overlay (user needs to interact with the canvas while the panel is open)
- **AND** a drop shadow on the panel's left edge provides visual separation

### AC-6: Mobile behavior unchanged

- **GIVEN** I am on a mobile viewport (below `md` breakpoint)
- **WHEN** I interact with guests or tables
- **THEN** the existing mobile behavior is preserved exactly (GuestDetailPanel fullscreen overlay, CanvasPropertiesPanel hidden with MobilePropertiesSheet bottom drawer)

### AC-7: Panel width unchanged

- **GIVEN** either overlay panel is visible on desktop
- **WHEN** I observe its width
- **THEN** it remains `320px` wide, anchored to the right edge of the viewport (or the right edge of the main content area)

### AC-8: Escape key closes panel

- **GIVEN** either overlay panel is open
- **WHEN** I press the `Escape` key
- **THEN** the panel closes

## Scope

### In scope

- Change desktop positioning of GuestDetailPanel from static flex child to fixed/absolute overlay
- Change desktop positioning of CanvasPropertiesPanel from static flex child to fixed/absolute overlay
- Add slide-in/slide-out CSS animation (Tailwind `@keyframes` + utility class)
- Add semi-transparent backdrop for GuestDetailPanel on desktop
- Add drop shadow to CanvasPropertiesPanel left edge
- Add Escape key handler to close panels
- Add backdrop click-to-close for GuestDetailPanel

### Out of scope

- Changing mobile behavior (already overlay or bottom drawer)
- Changing panel content or layout
- Adding resize/drag handles to panels
- Changing panel width from 320px
- Adding new functionality to panels

## Edge Cases

1. **Browser resize across breakpoint**: If the user resizes the browser from desktop to mobile while a panel is open, the panel should transition to its mobile behavior (fullscreen or hidden) without glitches.
2. **Scroll position**: Opening/closing the overlay must not affect the scroll position of the main content area.
3. **Multiple rapid toggles**: Rapidly clicking guest rows or tables should not cause animation glitches; if the panel is already animating in, clicking another guest should swap content without replaying the enter animation.
4. **Canvas interaction with panel open**: On the seating plan, the user must still be able to pan/zoom/interact with the canvas while the CanvasPropertiesPanel overlay is open (no blocking backdrop).
5. **GuestDetailPanel + child routes**: When navigating to a child route (e.g., `/guests/:id/edit`), the detail panel is already hidden — this should remain unchanged.

## Design Decisions

1. **Fixed positioning relative to viewport**: Use `fixed` positioning (not `absolute`) so the panels are anchored to the right edge of the viewport regardless of scroll state. On desktop: `fixed top-[TopNav height] right-0 bottom-0 w-[320px]`.
2. **Z-index layering**: Panels get `z-40` (below the mobile `z-50` overlay but above normal content). Backdrop gets `z-30`.
3. **Animation approach**: Use Tailwind CSS `@keyframes` for `slideInRight` and `slideOutRight` animations, applied via utility classes. Use a state-based approach (open/closing/closed) to handle exit animation before unmount.
4. **Backdrop scope**: The GuestDetailPanel backdrop covers only the area to the right of the left sidebar (the main content area). This avoids obscuring navigation.
5. **No backdrop for CanvasPropertiesPanel**: The canvas requires continuous interaction (dragging tables, panning). A left-edge `shadow-xl` on the panel provides enough visual separation.
6. **TopNav offset**: The panels should start below the TopNav. Use `top-[var(--topnav-height)]` or a calculated value matching the TopNav height to avoid overlap.

## UI/UX Details

### GuestDetailPanel (desktop overlay)

```
┌──────────────────────────────────────────────────┐
│ TopNav                                           │
├────┬───────────────────────────┬─────────────────┤
│ L  │     Main Content          │ ████████████████│ ← overlay panel (320px)
│ e  │     (does not shift)      │ █ GUEST_DETAILS █│
│ f  │                           │ █              █│
│ t  │     [backdrop bg-black/20]│ █  Name, etc.  █│
│    │                           │ █              █│
│ S  │     click backdrop        │ █  DELETE  UPD █│
│ b  │     → closes panel        │ ████████████████│
├────┴───────────────────────────┴─────────────────┤
```

### CanvasPropertiesPanel (desktop overlay)

```
┌──────────────────────────────────────────────────┐
│ TopNav                                           │
├────┬───────────────────────────┬─────────────────┤
│ L  │     Canvas                │▌█ PROPERTIES ██│ ← overlay panel (320px)
│ e  │     (does not resize)     │▌█             █│   with left shadow
│ f  │     still interactive     │▌█  Form...    █│
│ t  │                           │▌█             █│
│    │                           │▌█  DELETE     █│
│ S  │                           │▌████████████████│
│ b  │                           │                 │
├────┴───────────────────────────┴─────────────────┤
```

### Animation

- **Enter**: `transform: translateX(100%) → translateX(0)` over 200ms ease-out
- **Exit**: `transform: translateX(0) → translateX(100%)` over 150ms ease-in
- Backdrop fades in/out with `opacity: 0 → 0.2` over 200ms

## Technical Plan

### Impact Analysis

#### Affected Files

| File                                                 | Action | Description                                                                                                                                                                  |
| ---------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/index.css`                                      | Modify | Add `--nc-topnav-height` CSS variable, `@keyframes slideInRight`/`slideOutRight`/`backdropFadeIn`/`backdropFadeOut`, and Tailwind `@theme` animation tokens                  |
| `src/hooks/useOverlayPanel.ts`                       | Create | New hook encapsulating overlay open/closing/closed state machine, Escape key handler, and `onAnimationEnd` callback for exit animation unmount                               |
| `src/components/organisms/GuestDetailPanel.tsx`      | Modify | Replace desktop static flex positioning with fixed overlay; add backdrop element; consume `useOverlayPanel` for animation state and Escape key                               |
| `src/components/organisms/CanvasPropertiesPanel.tsx` | Modify | Replace desktop `hidden md:flex` with fixed overlay; add `shadow-xl` left edge; consume `useOverlayPanel` for animation state and Escape key                                 |
| `src/pages/GuestListView.tsx`                        | Modify | Move `<GuestDetailPanel>` rendering inside `<main>` or into a portal-like position so it no longer participates in flex layout as a sibling; wire up overlay close lifecycle |
| `src/pages/SeatingPlanView.tsx`                      | Modify | Same treatment for `<CanvasPropertiesPanel>` — remove from flex sibling position; wire up overlay close lifecycle                                                            |

#### Integration Points

- **TopNav height**: TopNav uses `h-14` (56px). Both panels need `top-14` (or `top-[var(--nc-topnav-height)]`) on desktop to sit below the nav. A CSS variable `--nc-topnav-height: 56px` added to `:root` ensures single source of truth.
- **LeftSidebar**: The GuestDetailPanel backdrop must NOT cover the LeftSidebar. Since LeftSidebar is a flex sibling rendered before `<main>`, and the backdrop is scoped inside or relative to `<main>`, this is handled by making the backdrop `fixed` but starting after the sidebar width. However, since the sidebar width varies and is `hidden` on mobile, the simpler approach is to render the backdrop as a `fixed` element with `top-14 left-0 right-0 bottom-0 z-30` and accept it covers the sidebar on desktop — OR render it inside the `<main>` as an `absolute inset-0` element with `z-30`. The spec says "covers the main content area (not the left sidebar)" — so use `absolute inset-0` inside `<main>` (which requires `relative` on `<main>`).
- **ConfirmDialog**: GuestDetailPanel renders a `<ConfirmDialog>` which uses `fixed inset-0 z-50`. This must remain above the overlay panel (`z-40`). Current `z-50` on ConfirmDialog is sufficient — no change needed.
- **Mobile sheets**: CanvasPropertiesPanel is `hidden` on mobile and replaced by MobilePropertiesSheet (vaul Drawer). The overlay changes only apply at `md:` breakpoint — mobile behavior is untouched.

#### Shared Dependencies (modify with care)

- `src/index.css` — shared by entire app. Changes are additive (new keyframes, new variable) so no risk of breaking existing styles.
- `src/hooks/useIsMobile.ts` — consumed by several components. Not modified, only imported by the new hook.
- `src/components/atoms/IconButton.tsx` — used in both panels. Not modified.

### Task Decomposition

---

#### TASK-001: Add CSS animations and TopNav height variable

**Description**: Add the slide-in/slide-out `@keyframes`, backdrop fade `@keyframes`, the `--nc-topnav-height` CSS custom property, and Tailwind `@theme` animation tokens to `index.css`.

**Affected files**:

- `src/index.css`

**Implementation instructions**:

1. In the `:root` block, add `--nc-topnav-height: 56px;` (matching TopNav's `h-14`).
2. In the `@theme` block, add animation tokens:
   ```
   --animate-slide-in-right: slideInRight 200ms ease-out;
   --animate-slide-out-right: slideOutRight 150ms ease-in forwards;
   --animate-backdrop-in: backdropFadeIn 200ms ease-out;
   --animate-backdrop-out: backdropFadeOut 150ms ease-in forwards;
   ```
3. After the existing `@keyframes fadeSlideUp` block, add:
   ```css
   @keyframes slideInRight {
     from {
       transform: translateX(100%);
     }
     to {
       transform: translateX(0);
     }
   }
   @keyframes slideOutRight {
     from {
       transform: translateX(0);
     }
     to {
       transform: translateX(100%);
     }
   }
   @keyframes backdropFadeIn {
     from {
       opacity: 0;
     }
     to {
       opacity: 1;
     }
   }
   @keyframes backdropFadeOut {
     from {
       opacity: 1;
     }
     to {
       opacity: 0;
     }
   }
   ```

**Project context**: Tailwind CSS v4 uses `@theme` for utility generation. The `--animate-*` tokens create `animate-slide-in-right` etc. utility classes automatically. The `forwards` fill mode on exit animations keeps the element at its end state (translateX(100%) / opacity 0) until unmount. Follow naming convention from existing `fadeSlideUp`.

**Dependencies**: None

**Acceptance criteria**:

- `animate-slide-in-right`, `animate-slide-out-right`, `animate-backdrop-in`, `animate-backdrop-out` utility classes are available in Tailwind.
- `var(--nc-topnav-height)` resolves to `56px`.
- Existing styles and animations remain unchanged.

---

#### TASK-002: Create `useOverlayPanel` hook

**Description**: Create a reusable hook that manages overlay panel lifecycle: open → closing → closed states, Escape key listener, and animation-end callback for clean unmount after exit animation.

**Affected files**:

- `src/hooks/useOverlayPanel.ts` (create)

**Implementation instructions**:

1. Create `src/hooks/useOverlayPanel.ts` with the following API:
   ```ts
   export function useOverlayPanel(
     isOpen: boolean,
     onClose: () => void,
   ): {
     visible: boolean // true when panel should be in DOM (open OR closing)
     isClosing: boolean // true during exit animation
     onAnimationEnd: () => void // call when exit animation finishes to unmount
   }
   ```
2. Internal state machine:
   - When `isOpen` transitions from `false → true`: set `visible = true`, `isClosing = false`.
   - When `isOpen` transitions from `true → false`: set `isClosing = true` (keep `visible = true` so the component stays mounted during exit animation).
   - When `onAnimationEnd` is called while `isClosing === true`: set `visible = false`, `isClosing = false`.
3. Use the React-recommended "adjusting state when a prop changes" pattern (track previous `isOpen` value, adjust in render) per G-16. Do NOT use `useEffect` for this state transition.
4. Add a `useEffect` for the Escape key listener:
   - Only attach when `visible` is `true`.
   - On `keydown` event with `key === 'Escape'`, call `onClose`.
   - Clean up the listener on unmount or when `visible` becomes `false`.
5. Use `useCallback` for `onAnimationEnd` to provide a stable reference.

**Project context**: React 19 + TypeScript strict mode. Follow hook file naming convention (`useOverlayPanel.ts`). Use `import { useState, useEffect, useCallback } from 'react'`. Export as named export per convention for hooks. Follow G-16 (no setState inside useEffect for state sync) and G-45 (function declarations for handlers).

**Dependencies**: None

**Acceptance criteria**:

- Hook returns `visible: false` when `isOpen` is `false` and no exit animation is pending.
- Hook returns `visible: true, isClosing: false` when `isOpen` is `true`.
- Hook returns `visible: true, isClosing: true` when `isOpen` transitions to `false` (exit animation in progress).
- Calling `onAnimationEnd` during closing sets `visible: false`.
- Pressing Escape calls `onClose` when panel is visible.
- Escape listener is cleaned up when panel is not visible.

---

#### TASK-003: Convert GuestDetailPanel to overlay on desktop

**Description**: Update GuestDetailPanel CSS classes to use fixed overlay positioning on desktop (md+), add a semi-transparent backdrop with click-to-close, and apply slide animation classes. Consume `useOverlayPanel` for animation state.

**Affected files**:

- `src/components/organisms/GuestDetailPanel.tsx`

**Implementation instructions**:

1. Add new props to the `Props` interface:
   ```ts
   isClosing?: boolean
   onAnimationEnd?: () => void
   ```
2. Update the outer `<aside>` className to replace the desktop-specific classes:
   - **Before**: `fixed inset-0 z-50 flex flex-col bg-background overflow-y-auto md:static md:inset-auto md:z-auto md:w-[320px] md:min-w-[320px] md:bg-surface md:border-l md:border-border`
   - **After**: `fixed inset-0 z-50 flex flex-col bg-background overflow-y-auto md:top-[var(--nc-topnav-height)] md:inset-auto md:right-0 md:bottom-0 md:z-40 md:w-[320px] md:bg-surface md:border-l md:border-border`
   - Add animation class conditionally: `md:animate-slide-in-right` when not closing, `md:animate-slide-out-right` when closing.
   - Add `onAnimationEnd` handler on the `<aside>` element that calls `props.onAnimationEnd` when closing.
3. Add a backdrop `<div>` before the `<aside>`, visible only on desktop:
   ```tsx
   <div
     className={`hidden md:block fixed top-[var(--nc-topnav-height)] left-0 right-0 bottom-0 z-30 bg-black/20 ${isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}
     onClick={onClose}
     aria-hidden="true"
   />
   ```
4. Ensure the `onAnimationEnd` on the `<aside>` only triggers unmount when the animation is the exit animation (check `isClosing`). Filter by `animationName` to avoid reacting to unrelated animations.
5. Mobile behavior: The mobile classes (`fixed inset-0 z-50 bg-background`) remain unchanged. The `md:` prefixed classes only apply at desktop breakpoint.

**Project context**: Tailwind v4, React 19, TypeScript. Use `import { useIsMobile } from '../../hooks/useIsMobile'` if needed to conditionally render backdrop (it should be `hidden md:block` so CSS handles it). Follow G-19 (keyboard + ARIA for modals) — Escape is handled by the hook in the parent. Follow G-44 (don't unmount components with pending dialog state) — the ConfirmDialog is rendered in a `<>` fragment sibling, and will unmount with the panel which is acceptable since delete confirmation resets on close.

**Dependencies**: TASK-001 (CSS animations), TASK-002 (useOverlayPanel hook — props come from parent)

**Acceptance criteria**:

- On desktop (md+), the panel appears as a fixed overlay at right edge, below TopNav.
- Panel is 320px wide, anchored top-right.
- Semi-transparent backdrop covers the viewport area below TopNav.
- Clicking backdrop calls `onClose`.
- Panel slides in from right on mount, slides out on close.
- Mobile behavior unchanged (fullscreen overlay, no backdrop).
- ConfirmDialog still appears above the panel (z-50 > z-40).

---

#### TASK-004: Convert CanvasPropertiesPanel to overlay on desktop

**Description**: Update CanvasPropertiesPanel CSS classes to use fixed overlay positioning on desktop (md+), add left-edge drop shadow, and apply slide animation classes. Consume `useOverlayPanel` for animation state.

**Affected files**:

- `src/components/organisms/CanvasPropertiesPanel.tsx`

**Implementation instructions**:

1. Add new props to the `Props` interface:
   ```ts
   isClosing?: boolean
   onAnimationEnd?: () => void
   ```
2. Update the `<aside>` className:
   - **Before**: `hidden md:flex flex-col w-[320px] min-w-[320px] bg-surface border-l border-border h-full overflow-y-auto`
   - **After**: `hidden md:flex flex-col fixed top-[var(--nc-topnav-height)] right-0 bottom-0 z-40 w-[320px] bg-surface border-l border-border overflow-y-auto shadow-xl`
   - Add animation class conditionally: `md:animate-slide-in-right` when not closing, `md:animate-slide-out-right` when closing.
   - Remove `min-w-[320px]` (not needed for fixed positioning) and `h-full` (replaced by `top/bottom-0`).
3. Add `onAnimationEnd` handler on `<aside>` that calls `props.onAnimationEnd` when closing. Filter by `animationName`.
4. No backdrop element — per AC-5, only a `shadow-xl` on the left edge for visual separation.
5. The `hidden md:flex` pattern is preserved: on mobile the panel remains hidden (mobile uses MobilePropertiesSheet).

**Project context**: Tailwind v4, React 19, TypeScript. `shadow-xl` provides `box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` which gives left-edge separation since the panel is flush-right. Follow atomic design — this stays in `organisms/`.

**Dependencies**: TASK-001 (CSS animations), TASK-002 (useOverlayPanel hook — props come from parent)

**Acceptance criteria**:

- On desktop (md+), the panel appears as a fixed overlay at right edge, below TopNav.
- Panel is 320px wide with `shadow-xl` on the left edge.
- No backdrop — canvas remains fully interactive.
- Panel slides in from right on mount, slides out on close.
- Mobile behavior unchanged (panel hidden, MobilePropertiesSheet used instead).

---

#### TASK-005: Wire up overlay lifecycle in GuestListView

**Description**: Update GuestListView to use `useOverlayPanel` hook and pass animation state to GuestDetailPanel. Remove the panel from flex layout participation. Add `relative` to `<main>` for backdrop positioning.

**Affected files**:

- `src/pages/GuestListView.tsx`

**Implementation instructions**:

1. Import `useOverlayPanel` from `../hooks/useOverlayPanel`.
2. Compute `isPanelOpen` as `selectedGuest !== null && !isChildRoute`.
3. Call the hook:
   ```ts
   const {
     visible: panelVisible,
     isClosing: panelClosing,
     onAnimationEnd: panelAnimationEnd,
   } = useOverlayPanel(isPanelOpen, () => setSelectedGuestId(null))
   ```
4. Replace the current rendering condition:
   - **Before**: `{selectedGuest && !isChildRoute && (<GuestDetailPanel ... onClose={() => setSelectedGuestId(null)} ... />)}`
   - **After**: `{panelVisible && selectedGuest && (<GuestDetailPanel ... onClose={() => setSelectedGuestId(null)} isClosing={panelClosing} onAnimationEnd={panelAnimationEnd} />)}`
   - Note: `selectedGuest` may be null if `selectedGuestId` was cleared. To keep the panel content stable during exit animation, capture the guest reference: use a `useRef` to store the last selected guest when panel opens, and use that during closing.
5. Add a ref to track the displayed guest during exit animation:
   ```ts
   const displayedGuestRef = useRef<Guest | null>(null)
   if (selectedGuest) displayedGuestRef.current = selectedGuest
   const displayedGuest = panelVisible
     ? (selectedGuest ?? displayedGuestRef.current)
     : null
   ```
6. Use `displayedGuest` instead of `selectedGuest` when rendering GuestDetailPanel.
7. The GuestDetailPanel element stays outside `<main>` — its `fixed` positioning means it doesn't participate in flex layout regardless of DOM position. But the backdrop inside GuestDetailPanel is also `fixed`, so DOM position doesn't matter.

**Project context**: React 19, TypeScript strict. Follow G-16 (state adjustment pattern, no useEffect for sync). The hook handles Escape key — remove any existing Escape handling if present (there is none currently). Follow G-35 — the GuestDetailPanel already doesn't use `key` for reset since content is purely prop-driven.

**Dependencies**: TASK-002 (useOverlayPanel hook), TASK-003 (GuestDetailPanel updated props)

**Acceptance criteria**:

- Selecting a guest opens the overlay panel with slide-in animation.
- Clicking backdrop or pressing Escape triggers close with slide-out animation.
- Panel unmounts after exit animation completes.
- Switching guests while panel is open swaps content without replaying enter animation.
- Rapidly toggling does not cause animation glitches.
- The main content area does not shift or resize.
- Child routes (`/guests/new`, `/guests/:id/edit`) hide the panel as before.

---

#### TASK-006: Wire up overlay lifecycle in SeatingPlanView

**Description**: Update SeatingPlanView to use `useOverlayPanel` hook and pass animation state to CanvasPropertiesPanel. Remove the panel from flex layout participation.

**Affected files**:

- `src/pages/SeatingPlanView.tsx`

**Implementation instructions**:

1. Import `useOverlayPanel` from `../hooks/useOverlayPanel`.
2. Compute `isPanelOpen` as `selectedCanvasTable !== null`.
3. Call the hook:
   ```ts
   const {
     visible: panelVisible,
     isClosing: panelClosing,
     onAnimationEnd: panelAnimationEnd,
   } = useOverlayPanel(isPanelOpen, () => handleSelectTable(null))
   ```
4. Replace the current rendering condition:
   - **Before**: `{selectedCanvasTable && (<CanvasPropertiesPanel ... onClose={() => handleSelectTable(null)} ... />)}`
   - **After**: `{panelVisible && !isMobile && (<CanvasPropertiesPanel ... table={displayedTable} onClose={() => handleSelectTable(null)} isClosing={panelClosing} onAnimationEnd={panelAnimationEnd} />)}`
   - Add `!isMobile` guard because the hook keeps `visible: true` during exit animation, and we don't want the desktop panel rendering on mobile during that window.
5. Add a ref to track the displayed table during exit animation (same pattern as TASK-005):
   ```ts
   const displayedTableRef = useRef<FloorTable | null>(null)
   if (selectedCanvasTable) displayedTableRef.current = selectedCanvasTable
   const displayedTable = panelVisible
     ? (selectedCanvasTable ?? displayedTableRef.current)
     : null
   ```
6. Use `displayedTable` for rendering CanvasPropertiesPanel and for the `onUpdate`/`onDelete` callbacks (guard with `displayedTable?.id`).
7. Ensure the mobile FABs and sheets still use `selectedCanvasTable` (not `displayedTable`) so mobile behavior is unaffected.

**Project context**: React 19, TypeScript strict. The `isMobile` hook is already imported. Follow existing patterns — the mobile UI state machine (`useReducer`) is not affected. Follow G-40 — no business logic leaks to App.tsx.

**Dependencies**: TASK-002 (useOverlayPanel hook), TASK-004 (CanvasPropertiesPanel updated props)

**Acceptance criteria**:

- Selecting a table opens the properties overlay with slide-in animation.
- Deselecting (clicking canvas background) or pressing Escape triggers close with slide-out animation.
- Panel unmounts after exit animation completes.
- Canvas remains interactive (no backdrop blocking pointer events).
- Switching tables while panel is open swaps content without replaying enter animation.
- Mobile behavior unchanged (MobilePropertiesSheet, FABs work as before).

---

### Parallelism

```
TASK-001 (CSS) ─────────────────┐
                                 ├─→ TASK-003 (GuestDetailPanel) ──┐
TASK-002 (useOverlayPanel) ─────┤                                   ├─→ TASK-005 (GuestListView)
                                 │                                   │
                                 ├─→ TASK-004 (CanvasPropsPanel) ──┼─→ TASK-006 (SeatingPlanView)
                                 │                                   │
                                 └───────────────────────────────────┘
```

| Phase | Tasks              | Can run in parallel?                                                              |
| ----- | ------------------ | --------------------------------------------------------------------------------- |
| 1     | TASK-001, TASK-002 | Yes — no file overlap, no dependency between them                                 |
| 2     | TASK-003, TASK-004 | Yes — different files, both depend on Phase 1                                     |
| 3     | TASK-005, TASK-006 | Yes — different files, TASK-005 depends on TASK-003, TASK-006 depends on TASK-004 |

### Risk Notes

1. **`onAnimationEnd` event bubbling**: Child elements inside the panel may trigger `animationend` events that bubble up. The handler must check `event.target === event.currentTarget` or filter by `animationName` to avoid premature unmount.
2. **ConfirmDialog z-index**: The delete ConfirmDialog in GuestDetailPanel uses `fixed inset-0 z-50`. Since the overlay panel is `z-40`, the dialog remains above it — no conflict.
3. **Stale closure in exit callbacks**: The `onUpdate`/`onDelete` callbacks in both views reference the selected entity. During exit animation the entity may be deselected. The `displayedRef` pattern ensures the correct entity is available during the animation window.
4. **Tailwind v4 `@theme` animation syntax**: Verify that `--animate-*` tokens inside `@theme` generate the expected utility classes. The Tailwind v4 convention is `--animate-<name>: <animation-shorthand>`.

## Changelog

| Date       | Change                                                                                                                                                                                              |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-04 | Initial draft                                                                                                                                                                                       |
| 2026-04-04 | Technical plan added by TPM                                                                                                                                                                         |
| 2026-04-04 | Implementation completed — 6 tasks implemented, validator approved after 1 fix iteration (replaced useRef render-phase access with useState pattern, stabilized onClose callbacks with useCallback) |
