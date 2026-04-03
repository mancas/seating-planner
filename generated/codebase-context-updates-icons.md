# Codebase Context Updates — Replace Icons with react-icons

Updates to `generated/codebase-context.md` based on the validated icon replacement implementation.

---

## New Guardrails Added (G-20 through G-22)

### G-20: Use a Single Icon Family for Consistency

**Rule**: All icons must come from a single `react-icons` sub-package (currently `react-icons/lu` — Lucide). Do not mix icon families.
**Source**: Design decision in `spec/replace-icons-with-react-icons.md`. Lucide chosen for consistent stroke-based style matching Nought Cobalt aesthetic.

### G-21: Verify Icon Export Names Against the Actual Package

**Rule**: Before specifying an icon component name in a spec, verify the export exists in the target `react-icons` sub-package.
**Source**: Spec listed `LuPenSquare` which does not exist; the correct export is `LuSquarePen`.

### G-22: Use `size` Prop for Icon Dimensions, Not CSS Width/Height

**Rule**: Set icon dimensions via the `size` prop on `react-icons` components, not via CSS `w-*`/`h-*` classes.
**Source**: Established pattern across all 10 modified files. Canonical `react-icons` API.

---

## Sections to Update in `generated/codebase-context.md`

### 1. Update Key Dependencies table

Add:

| Library     | Version | Purpose                                              |
| ----------- | ------- | ---------------------------------------------------- |
| react-icons | ^5.6.0  | Icon components (Lucide family via `react-icons/lu`) |

### 2. Replace "Icons" section in Architectural Patterns

Replace:

```
### Icons

- Components currently use **inline `<svg>` elements** for all icons (18 total across 10 components)
- `public/icons.svg` exists as a sprite file but is not referenced by any component
- A confirmed spec (`replace-icons-with-react-icons`) plans to replace all inline SVGs with `react-icons` library components
```

With:

```
### Icons

- All icons use **`react-icons`** library components from the **Lucide** family (`react-icons/lu`)
- 18 icon instances across 10 component files, using 12 unique Lucide icons:
  - `LuX` (close), `LuGift`, `LuBus`, `LuHotel`, `LuTriangleAlert` (warning), `LuUserPlus` (add guest), `LuDiamond`, `LuPlus`, `LuSquarePen` (edit/canvas), `LuUser`, `LuWrench`, `LuEllipsis` (more/actions), `LuSettings`, `LuSearch`, `LuCircleCheck` (confirmed status)
- Sizing via `size` prop (not CSS classes): 14px, 16px, 20px, 24px, 40px
- Color via `className` with Tailwind's `text-*` utilities (inherits via `currentColor`)
- `public/icons.svg` sprite file exists but is not referenced by any component (candidate for deletion)
```

### 3. Update "Prior Spec Decisions" — Replace Icons status

Replace:

```
### Spec: Replace Icons with react-icons — Status: Confirmed (2026-04-03)

Planned changes (not yet implemented):

1. Install `react-icons` as dependency.
2. Replace all 18 inline `<svg>` elements across 10 components with `react-icons` equivalents.
3. Target icon sets: Remix Icon (`ri`), Ionicons 5 (`io5`), Lucide (`lu`).
4. Affected components: GuestDetailPanel (4 icons), ConfirmDialog (1), LeftSidebar (1), EmptyState (2), BottomTabBar (4), GuestRow (1), TopNav (2), FAB (1), SearchInput (1), GuestForm (1).
```

With:

```
### Spec: Replace Icons with react-icons — Status: Completed (2026-04-03)

Key decisions:

1. **DD-1: Lucide icon family** — All icons sourced from `react-icons/lu` (Lucide). Single family for consistent stroke width and visual weight.
2. **DD-2: `size` prop for dimensions** — Icon size set via `size` prop, not CSS width/height classes.
3. **DD-3: Color via className** — Tailwind `text-*` classes on icon components for color inheritance via `currentColor`.
4. **DD-4: `LuSquarePen` for edit icon** — Spec originally listed `LuPenSquare` which does not exist; `LuSquarePen` is the correct Lucide export.
5. 18 inline SVGs replaced across 10 files. Zero `<svg` tags remain in component files. Build passes with zero errors.
```

### 4. Update "Guardrails and Lessons Learned" summary

Add reference to G-20 through G-22 from the icon replacement spec.
