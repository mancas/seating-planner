# Task Report — TASK-M01: Utility Hooks

## Status: DONE

## Summary

Created two utility hooks in `src/hooks/`:

### `useIsMobile.ts`

- Returns `boolean` based on `(max-width: 767px)` media query
- Uses `useState` with lazy initializer reading `window.matchMedia` on mount
- Subscribes to `change` event on the `MediaQueryList` for live viewport updates
- Cleans up event listener on unmount

### `useLongPress.ts`

- Accepts `{ threshold?, onLongPress, onTap? }` options
- Returns `{ onTouchStart, onTouchEnd, onTouchMove }` handlers
- `onTouchStart` starts a timer; if held past `threshold` (default 300ms), fires `onLongPress`
- `onTouchEnd` clears timer and fires `onTap` if long-press was not triggered
- `onTouchMove` cancels the long-press timer if finger moves before threshold

## Files Created

| File                        | Action      |
| --------------------------- | ----------- |
| `src/hooks/useIsMobile.ts`  | **created** |
| `src/hooks/useLongPress.ts` | **created** |

## Acceptance Criteria Verification

- [x] Both files compile with `tsc -b` — zero errors
- [x] `useIsMobile()` returns `true` when viewport < 768px, `false` otherwise, updates on resize crossing the boundary
- [x] `useLongPress` calls `onLongPress` after 300ms hold, `onTap` on quick release, cancels on touch move
- [x] No lint errors from `npm run lint` — zero errors (2 pre-existing warnings in unrelated files)

## Conventions Followed

- Named exports (`export function useIsMobile`, `export function useLongPress`)
- No semicolons, single quotes, trailing commas
- TypeScript strict mode compatible
- `useCallback`/`useRef` patterns consistent with existing `useTableState.ts`
