# Codebase Context Updates — overlay-sidebar

## New Hook

| Hook              | File                           | Purpose                                                                                                           |
| ----------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `useOverlayPanel` | `src/hooks/useOverlayPanel.ts` | Manages overlay panel lifecycle (open/closing/closed state machine), Escape key listener, animation-end callback. |

## Modified Components

### GuestDetailPanel (`src/components/organisms/GuestDetailPanel.tsx`)

- Now accepts optional `isClosing` and `onAnimationEnd` props for exit animation lifecycle.
- Desktop positioning changed from static flex child (`md:static md:inset-auto md:z-auto`) to fixed overlay (`md:top-[var(--nc-topnav-height)] md:right-0 md:bottom-0 md:z-40`).
- New backdrop `<div>` element rendered before `<aside>`, visible only on desktop (`hidden md:block`), with `z-30`, `bg-black/20`, and click-to-close.
- Slide animations applied conditionally: `md:animate-slide-in-right` / `md:animate-slide-out-right`.
- Mobile behavior unchanged.

### CanvasPropertiesPanel (`src/components/organisms/CanvasPropertiesPanel.tsx`)

- Now accepts optional `isClosing` and `onAnimationEnd` props for exit animation lifecycle.
- Desktop positioning changed from flow-based (`w-[320px] min-w-[320px] h-full`) to fixed overlay (`fixed top-[var(--nc-topnav-height)] right-0 bottom-0 z-40 w-[320px]`).
- `shadow-xl` added for left-edge visual separation (no backdrop).
- Slide animations applied conditionally.
- Mobile behavior unchanged (`hidden md:flex` preserved).

### GuestListView (`src/pages/GuestListView.tsx`)

- Imports `useOverlayPanel` hook and `useRef`.
- Computes `isPanelOpen`, calls `useOverlayPanel`, tracks displayed guest for exit animation.
- GuestDetailPanel rendering condition changed to use `panelVisible && displayedGuest`.
- `relative` added to `<main>` className.

### SeatingPlanView (`src/pages/SeatingPlanView.tsx`)

- Imports `useOverlayPanel` hook, `useRef`, and `FloorTable` type.
- Computes `isPanelOpen`, calls `useOverlayPanel`, tracks displayed table for exit animation.
- CanvasPropertiesPanel rendering condition changed to use `panelVisible && !isMobile && displayedTable`.
- `!isMobile` guard prevents desktop panel from rendering on mobile during exit animation window.

## CSS Changes (`src/index.css`)

### New tokens in `@theme`

- `--animate-slide-in-right` — `slideInRight 200ms ease-out`
- `--animate-slide-out-right` — `slideOutRight 150ms ease-in forwards`
- `--animate-backdrop-in` — `backdropFadeIn 200ms ease-out`
- `--animate-backdrop-out` — `backdropFadeOut 150ms ease-in forwards`

### New variable in `:root`

- `--nc-topnav-height: 56px` — matches TopNav `h-14`.

### New `@keyframes`

- `slideInRight` — `translateX(100%) → translateX(0)`
- `slideOutRight` — `translateX(0) → translateX(100%)`
- `backdropFadeIn` — `opacity 0 → 1`
- `backdropFadeOut` — `opacity 1 → 0`

## Z-Index Layering (updated)

| Layer           | Z-Index | Components                                        |
| --------------- | ------- | ------------------------------------------------- |
| Normal content  | auto    | Main content, canvas, tables                      |
| Backdrop        | 30      | GuestDetailPanel backdrop (desktop only)          |
| Overlay panels  | 40      | GuestDetailPanel (desktop), CanvasPropertiesPanel |
| Mobile overlays | 50      | GuestDetailPanel (mobile), ConfirmDialog          |

## Architectural Pattern

The overlay sidebar feature introduces a **three-state animation lifecycle pattern**:

1. `closed` — component not in DOM (`visible: false, isClosing: false`)
2. `open` — component mounted with enter animation (`visible: true, isClosing: false`)
3. `closing` — component mounted with exit animation (`visible: true, isClosing: true`)

The `useOverlayPanel` hook encapsulates this state machine and is reusable for any future overlay panels that need animated mount/unmount.
