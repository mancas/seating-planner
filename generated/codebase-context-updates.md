# Codebase Context Updates

Updates to `generated/codebase-context.md` based on the validated Guest List Screen implementation.

---

## Guardrail Updates

Four new guardrails were added to `generated/guardrails.md`:

### G-11: All Interactive Elements Must Be Keyboard Accessible

**Rule**: Every clickable element must be keyboard accessible. If using a `<button>`, ensure `cursor-pointer` is set (Tailwind preflight resets it to `default`). If using a `<div onClick>`, add `role="button"`, `tabIndex={0}`, and an `onKeyDown` handler — or refactor to a real `<button>`. All buttons must include `focus-visible` outline per G-8.
**Source**: IconButton missing focus-visible, NavLink missing cursor-pointer, GuestRow/SidebarNavItem using div onClick without keyboard support.

### G-12: Always Review Ternary Branches for Copy-Paste Errors

**Rule**: When writing conditional expressions (ternaries), verify that true and false branches produce different outputs. A ternary where both branches return the same value is always a bug.
**Source**: GuestDetailPanel shuttle label ternary had identical branches — `shuttleRequired ? 'SHUTTLE REQUIRED' : 'SHUTTLE REQUIRED'`.

### G-13: Use Design System Typography Classes Consistently

**Rule**: All text elements must use the appropriate typography utility class from the design system. Never rely on inherited font sizing when a typography class is specified in the spec.
**Source**: NavLink was missing the `text-label` class, relying on inherited sizing instead.

### G-14: Mobile-Specific Groups Need Contextual Data

**Rule**: When rendering grouped data with different semantics, ensure group metadata reflects the group's actual context. Don't hardcode values that only apply to some groups.
**Source**: Mobile guest table hardcoded `totalSeats={8}` for UNASSIGNED group.

---

## Sections to Update in `generated/codebase-context.md`

### 1. Update "Prior Spec Decisions" — Guest List Screen status

Change:

```
### Spec: Guest List Screen (`spec/guest-list-screen.md`) — Status: Draft
```

To:

```
### Spec: Guest List Screen (`spec/guest-list-screen.md`) — Status: Implemented (pass with issues)
```

### 2. Update "Guardrails and Lessons Learned"

Replace:

```
See `generated/guardrails.md` for 10 guardrails established from the Nought Cobalt design system implementation, covering Tailwind v4 configuration patterns, CSS variable namespacing, dark mode policy, and migration safety practices.
```

With:

```
See `generated/guardrails.md` for 14 guardrails established from the Nought Cobalt design system and Guest List Screen implementations, covering Tailwind v4 configuration patterns, CSS variable namespacing, dark mode policy, migration safety practices, accessibility requirements, and component development patterns.

Key guardrails:

- **G-1**: `@import 'tailwindcss'` must be the very first line of `src/index.css`, top-level, never nested.
- **G-2**: `@theme` for Tailwind utility generation, `:root` `--nc-*` for direct CSS variables.
- **G-3**: Always use `var(--nc-*)` in custom CSS, never raw hex or Tailwind's `var(--color-*)`.
- **G-4**: No light mode — dark only. No `prefers-color-scheme` media queries.
- **G-5**: Default border radius is 4px.
- **G-6**: Use `@utility` for multi-property utility classes, not `@layer utilities`.
- **G-7**: Use `@layer components` for component base styles.
- **G-8**: `focus-visible` for buttons, `focus` for inputs.
- **G-9**: Google Fonts must include preconnect links.
- **G-10**: Grep entire `src/` for old variable names when renaming CSS custom properties.
- **G-11**: All interactive elements must be keyboard accessible with `cursor-pointer` and `focus-visible`.
- **G-12**: Review ternary branches for copy-paste errors (identical branches = bug).
- **G-13**: Use design system typography classes consistently — never rely on inherited sizing.
- **G-14**: Mobile-specific groups need contextual data, don't hardcode values.
```

### 3. Update "File organization" in Code Conventions

Replace:

```
- **File organization**: Flat `src/` directory currently; planned atomic design structure (`src/components/atoms/`, `molecules/`, `organisms/`) per guest-list-screen spec. No barrel `index.ts` files.
```

With:

```
- **File organization**: Atomic design structure: `src/components/atoms/` (9 components), `src/components/molecules/` (4 components), `src/components/organisms/` (7 components). Mock data in `src/data/`. No barrel `index.ts` files.
```

### 4. Update "Structure" in Architectural Patterns

Replace:

```
- **Structure**: Single-page application (SPA) with React + BrowserRouter. Currently a minimal Vite scaffold — one component (`App.tsx`) with no route definitions. Routing planned via query params (`/?tab=guests`, `/?tab=canvas`) at root `/`.
```

With:

```
- **Structure**: Single-page application (SPA) with React + BrowserRouter. App shell with query-param tab routing (`/?tab=guests`, `/?tab=canvas`) at root `/`. Three-panel desktop layout (TopNav, LeftSidebar, main content + optional GuestDetailPanel). Mobile layout with bottom tab bar, FAB, and table-grouped guest list.
```

### 5. Update "Current CSS Architecture" — App.css

Replace:

```
**`src/App.css`** (190 lines):

- Component styles using `--nc-*` design tokens exclusively
- Styles for: `.counter`, `.hero`, `#center`, `#next-steps`, `#docs`, `#spacer`, `.ticks`
- Uses native CSS nesting extensively
- Responsive breakpoints at `max-width: 1024px`
- Dark mode icon filter applied unconditionally for `#social .button-icon`

**Note**: `#root` currently has `width: 1126px` and `text-align: center` — this will need adjustment for full-viewport layouts.
```

With:

```
**`src/App.css`** (0 lines):

- Emptied — all Vite template styles removed. Component styling is done via Tailwind utility classes in JSX.

**`#root`** (line 185): `width: 100%`, `min-height: 100svh`, `display: flex`, `flex-direction: column` — full-viewport layout for the app shell.
```

### 6. Update "Data fetching" in Architectural Patterns

Replace:

```
- **Data fetching**: None currently implemented. Mock data planned in `src/data/mock-guests.ts`.
```

With:

```
- **Data fetching**: None (mock data). `src/data/mock-guests.ts` exports typed `Guest` interface, `GuestStatus` type, 6 mock guests, and stat helper functions (`getConfirmedCount`, `getPendingCount`, `getConfirmationRate`, `getDietaryFlagCount`, `getTotalGuests`, `getWaitlistCount`, `getGuestsByTable`).
```
