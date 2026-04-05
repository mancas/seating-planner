# Validation Report — overlay-sidebar

| Field   | Value                 |
| ------- | --------------------- |
| Spec    | `overlay-sidebar`     |
| Date    | 2026-04-04            |
| Verdict | **CHANGES_REQUESTED** |

---

## Step 1: Completeness Check

| AC   | Description                               | Status | Notes                                                                                                                             |
| ---- | ----------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------- |
| AC-1 | GuestDetailPanel overlays on desktop      | PASS   | Fixed positioning with `z-40`, `w-[320px]`, `top-[var(--nc-topnav-height)]`. Main content does not shift.                         |
| AC-2 | CanvasPropertiesPanel overlays on desktop | PASS   | Fixed positioning with `z-40`, `w-[320px]`, `top-[var(--nc-topnav-height)]`. Canvas does not resize.                              |
| AC-3 | Slide-in animation                        | PASS   | `animate-slide-in-right` (200ms ease-out) and `animate-slide-out-right` (150ms ease-in forwards) applied via `md:` prefix.        |
| AC-4 | Semi-transparent backdrop (GDP only)      | PASS   | Backdrop `div` with `bg-black/20`, `z-30`, `animate-backdrop-in/out`, click-to-close, `hidden md:block`.                          |
| AC-5 | No backdrop for CanvasPropertiesPanel     | PASS   | No backdrop element. `shadow-xl` on panel for left-edge visual separation.                                                        |
| AC-6 | Mobile behavior unchanged                 | PASS   | GuestDetailPanel mobile classes unchanged (`fixed inset-0 z-50 bg-background`). CanvasPropertiesPanel `hidden md:flex` preserved. |
| AC-7 | Panel width unchanged (320px)             | PASS   | Both panels use `w-[320px]`.                                                                                                      |
| AC-8 | Escape key closes panel                   | PASS   | `useOverlayPanel` hook attaches `keydown` listener for Escape when `visible === true`.                                            |

**Result**: All 8 acceptance criteria are met at the spec level.

---

## Step 2: Convention Compliance

| Check                  | Status   | Notes                                                                                                           |
| ---------------------- | -------- | --------------------------------------------------------------------------------------------------------------- |
| Naming conventions     | PASS     | Hook file `useOverlayPanel.ts` follows `use*` camelCase convention. Components remain PascalCase.               |
| Import style           | PASS     | Relative imports, `import type` for type-only imports (`FloorTable`), named exports for hook.                   |
| Export style           | PASS     | Hook uses named export. Components use default export.                                                          |
| File organization      | PASS     | Hook in `src/hooks/`, components in `src/components/organisms/`, pages in `src/pages/`.                         |
| CSS variable namespace | PASS     | `--nc-topnav-height` follows `--nc-*` namespace (G-3). Animation tokens in `@theme` (G-2).                      |
| Prettier formatting    | PASS     | All changed files pass `prettier --check`.                                                                      |
| ESLint                 | **FAIL** | 8 errors in `GuestListView.tsx` and `SeatingPlanView.tsx` — `react-hooks/refs` rule violations. See CRITICAL-1. |

---

## Step 3: Best Practices Research

### React "adjusting state when a prop changes" pattern

- The `useOverlayPanel` hook correctly uses the React-recommended pattern for state adjustment during render (tracking `prevIsOpen` in state, comparing in render body). This avoids `useEffect` for state synchronization per G-16. **Correct.**

### CSS `animation-fill-mode: forwards`

- The exit animations (`slideOutRight`, `backdropFadeOut`) correctly use `forwards` fill mode so the element retains `translateX(100%)` / `opacity: 0` at animation end, keeping it visually hidden until React unmounts it. **Correct.**

### React `onAnimationEnd` event handling

- The `onAnimationEnd` handlers correctly filter by `e.animationName === 'slideOutRight'` to avoid reacting to unrelated animations (the enter animation, or child element animations). React's `onAnimationEnd` provides `animationName` on the synthetic event per the `AnimationEvent` interface. **Correct.**
- The handlers correctly guard with `isClosing` (GuestDetailPanel) or check `onAnimationEnd` existence (CanvasPropertiesPanel) before calling the callback. **Correct.**

### useRef during render (React 19 + React Compiler)

- **The `useRef` pattern for preserving displayed entity during exit animation violates `react-hooks/refs` ESLint rule.** React Compiler (which this project uses based on the ESLint rule presence) forbids reading/writing `ref.current` during render. This is a **CRITICAL** finding — it blocks the pre-commit hook. See CRITICAL-1.

---

## Step 4: Framework Best Practices

### Unnecessary re-renders

- **`onClose` callback stability**: In `GuestListView.tsx:104`, `useOverlayPanel` receives `() => setSelectedGuestId(null)` as `onClose`. This creates a new function reference on every render, causing the `useEffect` in the hook (which depends on `[visible, onClose]`) to re-register the Escape key listener on every render when the panel is visible. See MAJOR-1.
- **Same issue in `SeatingPlanView.tsx:92`**: `() => handleSelectTable(null)` is a new reference each render. See MAJOR-1.
- **`onAnimationEnd` useCallback dependency**: The `onAnimationEnd` callback in the hook depends on `[isClosing]`, which means it gets a new reference whenever `isClosing` changes. This is mostly fine since it only changes twice per open/close cycle, but the component's `onAnimationEnd` handler on `<aside>` already checks `isClosing` internally, creating redundant double-gating. See MINOR-1.

### Memory leaks

- The Escape key listener is properly cleaned up when `visible` becomes `false` or on unmount. **No memory leak.**

### Correct React hook usage

- `useOverlayPanel` uses `useState` for state, `useEffect` for the Escape listener (correct — it's a DOM side effect), and `useCallback` for the animation end handler. **Correct pattern.**
- The state adjustment during render pattern (`if (isOpen !== prevIsOpen)`) is the React-recommended approach. **Correct.**

### TypeScript typing

- All new props (`isClosing?: boolean`, `onAnimationEnd?: () => void`) are optional, which is correct since existing consumers shouldn't need to pass them.
- The `useOverlayPanel` return type is explicitly annotated. **Good.**
- `FloorTable` type import in `SeatingPlanView.tsx` uses `import type`. **Correct per `verbatimModuleSyntax`.**

---

## Step 5: Code Quality

### Readability

- The `useOverlayPanel` hook is clean, well-commented, and easy to follow. The state machine is clear.
- The animation class ternaries in component classNames are long single-line strings. While this follows existing codebase patterns (Tailwind className strings), they are quite long. **Acceptable per convention.**

### DRY

- The `displayedRef` pattern is duplicated identically in both `GuestListView.tsx` and `SeatingPlanView.tsx`. This could be extracted into the `useOverlayPanel` hook itself (accepting a generic entity and returning the displayed entity). See MINOR-2.

### Simplicity

- The overall approach is sound — the three-state machine (closed/open/closing) is the simplest correct solution for CSS exit animations in React.
- The `forwards` fill mode + `onAnimationEnd` pattern is the established best practice for this use case.

---

## Step 6: Issue Classification

### CRITICAL-1: ESLint `react-hooks/refs` violations block pre-commit hook

**Severity**: CRITICAL
**Files**: `src/pages/GuestListView.tsx:106-110`, `src/pages/SeatingPlanView.tsx:94-98`
**Description**: Both view components read and write `useRef.current` during the render phase to preserve the displayed entity during exit animation. The `react-hooks/refs` ESLint rule flags this as an error (8 total errors across both files). The pre-commit hook runs `npm run lint`, which will **reject all commits**.

**Evidence**:

```
src/pages/GuestListView.tsx:107:22  error  Cannot update ref during render  react-hooks/refs
src/pages/GuestListView.tsx:109:25  error  Cannot access ref value during render  react-hooks/refs
src/pages/SeatingPlanView.tsx:95:28  error  Cannot update ref during render  react-hooks/refs
src/pages/SeatingPlanView.tsx:97:31  error  Cannot access ref value during render  react-hooks/refs
```

**Fix**: Replace the `useRef` pattern with a `useState`-based approach that tracks the "last known entity" using the same "adjusting state during render" pattern used by `useOverlayPanel`. For example:

```ts
const [displayedGuest, setDisplayedGuest] = useState<Guest | null>(null)
if (selectedGuest && selectedGuest !== displayedGuest) {
  setDisplayedGuest(selectedGuest)
}
const panelGuest = panelVisible ? (selectedGuest ?? displayedGuest) : null
```

Or, integrate the "stale entity preservation" into the `useOverlayPanel` hook as a generic parameter, so the hook itself manages the last-known value via state.

---

### MAJOR-1: Unstable `onClose` callback causes Escape listener re-registration on every render

**Severity**: MAJOR
**Files**: `src/pages/GuestListView.tsx:104`, `src/pages/SeatingPlanView.tsx:92`, `src/hooks/useOverlayPanel.ts:46`
**Description**: The `onClose` callbacks passed to `useOverlayPanel` are inline arrow functions (`() => setSelectedGuestId(null)` and `() => handleSelectTable(null)`). These create new function references on every render. The hook's `useEffect` depends on `[visible, onClose]`, so when the panel is visible, the Escape key event listener is removed and re-added on **every render** — causing unnecessary DOM operations and potential missed key events during the transition.

**Fix (option A — preferred)**: Wrap the `onClose` callbacks in `useCallback` in the parent:

```ts
const handleClosePanel = useCallback(() => setSelectedGuestId(null), [])
// ...
useOverlayPanel(isPanelOpen, handleClosePanel)
```

**Fix (option B)**: Use a ref inside the hook to store `onClose`, avoiding it as a dependency:

```ts
const onCloseRef = useRef(onClose)
onCloseRef.current = onClose

useEffect(() => {
  if (!visible) return
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') onCloseRef.current()
  }
  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [visible])
```

Option B makes the hook more resilient to consumer mistakes but may trigger the same `react-hooks/refs` lint rule. Option A is cleaner.

---

### MINOR-1: Redundant `isClosing` guard in `onAnimationEnd` callback

**Severity**: MINOR
**Files**: `src/hooks/useOverlayPanel.ts:28-33`
**Description**: The `onAnimationEnd` callback checks `if (isClosing)` before setting state, AND it depends on `[isClosing]` in its `useCallback` deps. This means the callback reference changes every time `isClosing` toggles. However, the component-level handlers (e.g., `GuestDetailPanel.tsx:37`) also check `isClosing` before calling the callback. The double-gating is redundant but not harmful.

**Suggestion**: Remove the `isClosing` check from the `useCallback` (always set state, since the only caller already gates on `isClosing`), and use `[]` deps for a stable reference. Or, keep as-is — the double-gating is a defensive pattern.

---

### MINOR-2: Duplicated `displayedRef` pattern across views

**Severity**: MINOR
**Files**: `src/pages/GuestListView.tsx:106-110`, `src/pages/SeatingPlanView.tsx:94-98`
**Description**: The "preserve last entity during exit animation" pattern is copy-pasted between both view components. This could be generalized into the `useOverlayPanel` hook or a companion hook.

**Suggestion**: After fixing CRITICAL-1 (switching to `useState`-based approach), consider making the hook generic:

```ts
function useOverlayPanel<T>(
  isOpen: boolean,
  onClose: () => void,
  entity: T | null,
)
```

Not blocking — the current duplication is minimal (5 lines each).

---

### MINOR-3: `relative` class added to `<main>` in GuestListView may be unnecessary

**Severity**: MINOR
**Files**: `src/pages/GuestListView.tsx:136`
**Description**: `relative` was added to `<main>` as noted in task-report-005 "to establish a positioning context for backdrop/overlay elements." However, the backdrop in `GuestDetailPanel` uses `fixed` positioning (not `absolute`), so `relative` on `<main>` has no effect on the backdrop's position. It's harmless but potentially misleading — suggesting the backdrop is absolutely positioned when it's actually fixed.

**Suggestion**: Remove `relative` from `<main>` if not needed, or add a comment explaining its purpose if kept for future use.

---

## Step 7: Verdict

### **CHANGES_REQUESTED**

**Reason**: 1 CRITICAL issue (ESLint errors block pre-commit hook) and 1 MAJOR issue (unstable callback causes listener re-registration) must be resolved.

### Required fixes before approval:

1. **CRITICAL-1**: Replace `useRef` pattern with `useState`-based pattern in both `GuestListView.tsx` and `SeatingPlanView.tsx` to satisfy `react-hooks/refs` rule.
2. **MAJOR-1**: Stabilize the `onClose` callbacks passed to `useOverlayPanel` using `useCallback`, or use a ref-based pattern inside the hook to avoid the dependency.

### Optional improvements:

3. **MINOR-1**: Consider simplifying `onAnimationEnd` useCallback deps.
4. **MINOR-2**: Consider extracting duplicated displayed-entity pattern.
5. **MINOR-3**: Consider removing unnecessary `relative` from `<main>`.

---

## Appendix: Files Reviewed

| File                                                 | Lines | Status                  |
| ---------------------------------------------------- | ----- | ----------------------- |
| `src/index.css`                                      | 478   | Clean — no issues       |
| `src/hooks/useOverlayPanel.ts`                       | 49    | MAJOR-1 (consumer-side) |
| `src/components/organisms/GuestDetailPanel.tsx`      | 160   | Clean — no issues       |
| `src/components/organisms/CanvasPropertiesPanel.tsx` | 57    | Clean — no issues       |
| `src/pages/GuestListView.tsx`                        | 189   | CRITICAL-1, MAJOR-1     |
| `src/pages/SeatingPlanView.tsx`                      | 185   | CRITICAL-1, MAJOR-1     |
