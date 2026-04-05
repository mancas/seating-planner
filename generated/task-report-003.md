# Task Report: TASK-003 — Convert GuestDetailPanel to overlay on desktop

## Status: COMPLETE

## Summary

Updated `GuestDetailPanel` to render as a fixed overlay on desktop (md+) instead of a static sidebar, with a semi-transparent backdrop, slide animations, and click-to-close behavior.

## Changes Made

### `src/components/organisms/GuestDetailPanel.tsx`

1. **Added new props** to the `Props` interface:
   - `isClosing?: boolean` — signals the panel is in exit-animation state
   - `onAnimationEnd?: () => void` — callback to unmount after exit animation completes

2. **Updated `<aside>` className** for desktop overlay positioning:
   - Removed: `md:static md:inset-auto md:z-auto md:w-[320px] md:min-w-[320px] md:bg-surface md:border-l md:border-border`
   - Added: `md:top-[var(--nc-topnav-height)] md:inset-auto md:right-0 md:bottom-0 md:z-40 md:w-[320px] md:bg-surface md:border-l md:border-border`
   - Conditionally applies `md:animate-slide-in-right` or `md:animate-slide-out-right` based on `isClosing` prop

3. **Added `onAnimationEnd` handler** on the `<aside>`:
   - Only triggers `props.onAnimationEnd` when `isClosing` is true AND the animation is specifically `slideOutRight`
   - Prevents unrelated animations (e.g., enter animation) from triggering unmount

4. **Added backdrop `<div>`** before the `<aside>`:
   - Hidden on mobile (`hidden md:block`)
   - Fixed position below TopNav using `top-[var(--nc-topnav-height)]`
   - `z-30` ensures it's behind the panel (`z-40`) and behind ConfirmDialog (`z-50`)
   - Semi-transparent `bg-black/20`
   - Animate in/out with `animate-backdrop-in` / `animate-backdrop-out`
   - Clicking calls `onClose`

5. **Mobile behavior preserved**: The base classes `fixed inset-0 z-50 bg-background` remain unchanged, only `md:` prefixed classes apply at desktop breakpoint.

## Acceptance Criteria Verification

| Criterion                                                           | Status                            |
| ------------------------------------------------------------------- | --------------------------------- |
| Desktop: panel appears as fixed overlay at right edge, below TopNav | PASS                              |
| Panel is 320px wide, anchored top-right                             | PASS                              |
| Semi-transparent backdrop covers viewport below TopNav              | PASS                              |
| Clicking backdrop calls `onClose`                                   | PASS                              |
| Panel slides in from right on mount                                 | PASS (md:animate-slide-in-right)  |
| Panel slides out on close                                           | PASS (md:animate-slide-out-right) |
| Mobile behavior unchanged (fullscreen overlay, no backdrop)         | PASS                              |
| ConfirmDialog still above panel (z-50 > z-40)                       | PASS                              |

## Verification

- `npx tsc --noEmit` passes with zero errors
