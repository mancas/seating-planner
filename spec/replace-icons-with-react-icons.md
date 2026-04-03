# Spec: Replace Inline SVG Icons with react-icons

## Metadata

- **Slug**: `replace-icons-with-react-icons`
- **Date**: 2026-04-03
- **Status**: Completed
- **Author**: User
- **Related specs**: `guest-list-screen`, `guest-crud-flow`

## Description

Replace every inline `<svg>` element across the application with equivalent icon components from the `react-icons` library. This eliminates verbose, hard-to-maintain SVG markup, provides a consistent icon API, and makes future icon changes trivial. The visual output (size, color, stroke style) must remain identical after the swap.

## User Stories

1. As a **developer**, I want all icons sourced from a single library so that the codebase is consistent and easy to maintain.
2. As a **developer**, I want to replace inline SVGs with named icon components so that icon intent is immediately readable in JSX.
3. As a **designer**, I want the visual appearance of icons to remain unchanged so that the UI is unaffected by this refactor.

## Acceptance Criteria

1. GIVEN the project has no icon library installed WHEN the feature is complete THEN `react-icons` is listed in `package.json` dependencies and `node_modules/react-icons` exists.
2. GIVEN any component that previously rendered an inline `<svg>` element WHEN the component renders after the refactor THEN it renders an equivalent `react-icons` component with the same visual size, color, and stroke appearance.
3. GIVEN the full source tree WHEN searching for inline `<svg` tags in component files THEN zero results are returned (all inline SVGs have been removed).
4. GIVEN the application is running WHEN navigating to every screen (guest list, empty state, detail panel, confirm dialog) THEN all icons render correctly with no visual regressions.
5. GIVEN the project WHEN running `npm run build` (or the configured build command) THEN the build succeeds with no TypeScript or lint errors.

## Scope

### In Scope

- Install `react-icons` as a project dependency
- Replace all inline `<svg>` elements in the following components with `react-icons` equivalents:

| #   | Component            | File Path                                       | Icon(s)                                                | Suggested react-icons replacement                               |
| --- | -------------------- | ----------------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------- |
| 1   | **GuestDetailPanel** | `src/components/organisms/GuestDetailPanel.tsx` | Close (X) icon — 2 instances (mobile + desktop header) | `RiCloseLine` (ri) or `IoCloseOutline` (io5)                    |
| 2   | **GuestDetailPanel** | `src/components/organisms/GuestDetailPanel.tsx` | Gift icon (gift box)                                   | `RiGiftLine` (ri) or `LuGift` (lu)                              |
| 3   | **GuestDetailPanel** | `src/components/organisms/GuestDetailPanel.tsx` | Shuttle/bus icon (transport)                           | `RiBusLine` (ri) or `LuBus` (lu)                                |
| 4   | **GuestDetailPanel** | `src/components/organisms/GuestDetailPanel.tsx` | Lodging/hotel icon (building)                          | `RiHotelLine` (ri) or `LuHotel` (lu)                            |
| 5   | **ConfirmDialog**    | `src/components/molecules/ConfirmDialog.tsx`    | Warning triangle icon                                  | `RiAlertLine` (ri) or `IoWarningOutline` (io5)                  |
| 6   | **LeftSidebar**      | `src/components/organisms/LeftSidebar.tsx`      | Add-guest icon (person + plus)                         | `RiUserAddLine` (ri) or `IoPersonAddOutline` (io5)              |
| 7   | **EmptyState**       | `src/components/organisms/EmptyState.tsx`       | Diamond/placeholder illustration icon                  | `RiShapeLine` (ri) or `LuDiamond` (lu)                          |
| 8   | **EmptyState**       | `src/components/organisms/EmptyState.tsx`       | Plus icon (in "NEW_ENTRY" button)                      | `RiAddLine` (ri) or `IoAddOutline` (io5)                        |
| 9   | **BottomTabBar**     | `src/components/organisms/BottomTabBar.tsx`     | Canvas tab — edit/pen icon                             | `RiEditLine` (ri) or `LuPenSquare` (lu)                         |
| 10  | **BottomTabBar**     | `src/components/organisms/BottomTabBar.tsx`     | Guests tab — person icon                               | `RiUserLine` (ri) or `IoPersonOutline` (io5)                    |
| 11  | **BottomTabBar**     | `src/components/organisms/BottomTabBar.tsx`     | Tools tab — wrench icon                                | `RiToolsLine` (ri) or `LuWrench` (lu)                           |
| 12  | **BottomTabBar**     | `src/components/organisms/BottomTabBar.tsx`     | More tab — three-dots/ellipsis icon                    | `RiMoreFill` (ri) or `IoEllipsisHorizontal` (io5)               |
| 13  | **GuestRow**         | `src/components/molecules/GuestRow.tsx`         | Actions — three-dots/ellipsis icon                     | `RiMoreFill` (ri) or `IoEllipsisHorizontal` (io5)               |
| 14  | **TopNav**           | `src/components/organisms/TopNav.tsx`           | Settings/gear icon                                     | `RiSettings3Line` (ri) or `IoSettingsOutline` (io5)             |
| 15  | **FAB**              | `src/components/atoms/FAB.tsx`                  | Add user icon (person + plus)                          | `RiUserAddLine` (ri) or `IoPersonAddOutline` (io5)              |
| 16  | **SearchInput**      | `src/components/atoms/SearchInput.tsx`          | Search/magnifying glass icon                           | `RiSearchLine` (ri) or `IoSearchOutline` (io5)                  |
| 17  | **StatusIcon**       | `src/components/atoms/StatusIcon.tsx`           | Confirmed — checkmark in circle                        | `RiCheckboxCircleLine` (ri) or `IoCheckmarkCircleOutline` (io5) |
| 18  | **StatusIcon**       | `src/components/atoms/StatusIcon.tsx`           | Pending — three-dots/ellipsis                          | `RiMoreFill` (ri) or `IoEllipsisHorizontal` (io5)               |

- Preserve all existing `className`, sizing (`width`/`height`), and color (`text-*`) classes via the icon component's `className` and `size` props
- Remove all dead inline SVG code after replacement

### Out of Scope

- Changing icon visual designs or switching to different icon metaphors
- Adding new icons that don't already exist in the codebase
- Modifying component layout, spacing, or non-icon markup
- Creating a centralized icon mapping/wrapper component (nice-to-have for a future spec)
- Changing the app's design system tokens or Tailwind configuration

## Edge Cases

1. **Duplicate SVG instances** — GuestDetailPanel renders the close (X) icon twice (mobile and desktop). Both must be replaced with the same `react-icons` component.
2. **Fill vs. stroke icons** — Some SVGs use `stroke="currentColor"` (outline style) while others use `fill="currentColor"` (solid). The chosen `react-icons` variant must match the original rendering mode (e.g., use `Ri*Line` for outline, `Ri*Fill` for solid).
3. **Custom viewBox dimensions** — Inline SVGs use non-standard viewBoxes (16x16, 20x20, 24x24, 40x40). The `size` prop on `react-icons` must be set to match the original rendered dimensions.
4. **Conditional icon rendering** — `StatusIcon.tsx` renders different icons based on the `status` prop. The conditional logic must be preserved; only the SVG elements change.
5. **Icons inside buttons/links** — Several icons are nested inside `<button>` or `IconButton` components. The replacement must not break parent click handlers, accessibility labels, or flex layout.
6. **The EmptyState diamond icon** — This is a decorative/illustrative shape (diamond/rhombus), not a standard UI icon. The closest `react-icons` match (e.g., `LuDiamond`) may not be pixel-identical. Accept the closest visual match.

## Design Decisions

- **Icon family consistency**: Prefer a single icon family within `react-icons` for visual consistency. Recommended: `ri` (Remix Icon) for its comprehensive outline+fill set, or `lu` (Lucide) for its clean stroke style that matches the current SVG aesthetic. The implementer should pick ONE family and use it throughout.
- **Sizing approach**: Use the `size` prop on each icon component to match the original SVG's `width`/`height` value. Do not rely on CSS to resize icons unless the original SVG was sized via CSS classes.
- **Color approach**: Use `className="text-*"` on the icon component (same as the original SVG) so that Tailwind's `currentColor` inheritance continues to work.

## UI/UX Details

- No visual changes. Every icon must look the same (or as close as possible) to the current inline SVG rendering.
- Icon sizes to preserve per component:
  - GuestDetailPanel close icon: 20x20
  - GuestDetailPanel gift/shuttle/lodging icons: 16x16
  - ConfirmDialog warning: 24x24 (via `w-6 h-6` class)
  - LeftSidebar add-guest: 16x16
  - EmptyState diamond: 40x40
  - EmptyState plus: 14x14
  - BottomTabBar all tabs: 16x16
  - GuestRow ellipsis: 16x16
  - TopNav settings: 20x20
  - FAB add-user: 24x24
  - SearchInput search: 16x16
  - StatusIcon confirmed/pending: 24x24

## Data Requirements

- None. This is a pure UI refactor with no data model changes.

## Technical Plan

### Impact Analysis

#### Affected Areas

| Area                       | Files                                           | Type of Change |
| -------------------------- | ----------------------------------------------- | -------------- |
| Dependencies               | `package.json`, `package-lock.json`             | modify         |
| Organism: GuestDetailPanel | `src/components/organisms/GuestDetailPanel.tsx` | modify         |
| Molecule: ConfirmDialog    | `src/components/molecules/ConfirmDialog.tsx`    | modify         |
| Organism: LeftSidebar      | `src/components/organisms/LeftSidebar.tsx`      | modify         |
| Organism: EmptyState       | `src/components/organisms/EmptyState.tsx`       | modify         |
| Organism: BottomTabBar     | `src/components/organisms/BottomTabBar.tsx`     | modify         |
| Molecule: GuestRow         | `src/components/molecules/GuestRow.tsx`         | modify         |
| Organism: TopNav           | `src/components/organisms/TopNav.tsx`           | modify         |
| Atom: FAB                  | `src/components/atoms/FAB.tsx`                  | modify         |
| Atom: SearchInput          | `src/components/atoms/SearchInput.tsx`          | modify         |
| Atom: StatusIcon           | `src/components/atoms/StatusIcon.tsx`           | modify         |

#### Integration Points

- `TabBarItem` (`src/components/atoms/TabBarItem.tsx`) accepts `icon: ReactNode` — no changes needed, `react-icons` components are valid `ReactNode`
- `IconButton` (`src/components/atoms/IconButton.tsx`) accepts `children: ReactNode` — no changes needed, `react-icons` components are valid `ReactNode`
- Icons inherit `color` from parent via `currentColor` — `react-icons` components use `currentColor` by default, so Tailwind `text-*` color classes continue to work

#### Risk Areas

- **Visual fidelity**: Custom SVG paths (gift box, shuttle/bus, lodging/hotel, diamond) may not have pixel-identical `react-icons` equivalents. Closest matches must be verified visually.
- **Icon sizing**: Some SVGs use non-24 viewBoxes (16×16, 20×20, 40×40, 14×14). The `size` prop on `react-icons` must explicitly match the original dimensions.
- **Fill vs stroke mismatch**: The BottomTabBar "MORE" icon and GuestRow ellipsis icon use `fill="currentColor"` (solid). The StatusIcon pending state also uses `fill`. These must use `*Fill` icon variants, not `*Line` variants.

### Design Decision: Icon Family

Use **Lucide** (`lu` prefix from `react-icons/lu`) as the single icon family. Rationale:

- Lucide icons are stroke-based (matching the current SVG aesthetic of `stroke="currentColor"` with `strokeWidth` of 1.5–2)
- Comprehensive coverage for all 18 icons needed
- Clean, minimal style consistent with the Nought Cobalt design system
- For the few solid/fill icons (ellipsis dots), use `fill="currentColor"` via the icon's inherent style or wrap with a Lucide outline equivalent

**Icon mapping (final)**:

| #     | Current SVG             | Lucide Icon       | Import                                             |
| ----- | ----------------------- | ----------------- | -------------------------------------------------- |
| 1–2   | Close (X)               | `LuX`             | `import { LuX } from 'react-icons/lu'`             |
| 3     | Gift box                | `LuGift`          | `import { LuGift } from 'react-icons/lu'`          |
| 4     | Shuttle/bus             | `LuBus`           | `import { LuBus } from 'react-icons/lu'`           |
| 5     | Lodging/hotel           | `LuHotel`         | `import { LuHotel } from 'react-icons/lu'`         |
| 6     | Warning triangle        | `LuTriangleAlert` | `import { LuTriangleAlert } from 'react-icons/lu'` |
| 7     | Add guest (person+plus) | `LuUserPlus`      | `import { LuUserPlus } from 'react-icons/lu'`      |
| 8     | Diamond shape           | `LuDiamond`       | `import { LuDiamond } from 'react-icons/lu'`       |
| 9     | Plus                    | `LuPlus`          | `import { LuPlus } from 'react-icons/lu'`          |
| 10    | Edit/pen (canvas tab)   | `LuPenSquare`     | `import { LuPenSquare } from 'react-icons/lu'`     |
| 11    | Person (guests tab)     | `LuUser`          | `import { LuUser } from 'react-icons/lu'`          |
| 12    | Wrench (tools tab)      | `LuWrench`        | `import { LuWrench } from 'react-icons/lu'`        |
| 13–14 | Ellipsis (more/actions) | `LuEllipsis`      | `import { LuEllipsis } from 'react-icons/lu'`      |
| 15    | Settings/gear           | `LuSettings`      | `import { LuSettings } from 'react-icons/lu'`      |
| 16    | Person+plus (FAB)       | `LuUserPlus`      | `import { LuUserPlus } from 'react-icons/lu'`      |
| 17    | Search                  | `LuSearch`        | `import { LuSearch } from 'react-icons/lu'`        |
| 18    | Checkmark in circle     | `LuCircleCheck`   | `import { LuCircleCheck } from 'react-icons/lu'`   |

### Task Breakdown

#### TASK-001: Install react-icons dependency

- **Description**: Add `react-icons` to the project's production dependencies.
- **Files**: `package.json` (modified by npm)
- **Instructions**:
  1. Run `npm install react-icons`
  2. Verify `react-icons` appears in the `dependencies` section of `package.json`
  3. Verify `node_modules/react-icons` exists
- **Project context**:
  - Framework: React ^19.2.4 with Vite ^8.0.1
  - Package manager: npm (lockfile is `package-lock.json`)
  - ESM project: `"type": "module"` in `package.json`
- **Dependencies**: None
- **Acceptance criteria**: `react-icons` is listed in `package.json` `dependencies` and the package is installed in `node_modules`

---

#### TASK-002: Replace SVGs in GuestDetailPanel

- **Description**: Replace all 4 inline SVGs in `GuestDetailPanel.tsx` — 2 close (X) icons, 1 gift icon, 1 shuttle/bus icon, 1 lodging/hotel icon.
- **Files**: `src/components/organisms/GuestDetailPanel.tsx`
- **Instructions**:
  1. Add import at top of file: `import { LuX, LuGift, LuBus, LuHotel } from 'react-icons/lu'`
  2. **Close icon (mobile, lines 28–40)**: Replace the entire `<svg>...</svg>` block with `<LuX size={20} />`. This is inside an `<IconButton>` which provides color via `text-foreground-muted` class.
  3. **Close icon (desktop, lines 70–82)**: Replace the entire `<svg>...</svg>` block with `<LuX size={20} />`. Same context as mobile close icon.
  4. **Gift icon (lines 186–202)**: Replace the entire `<svg>...</svg>` block with `<LuGift size={16} className="text-foreground-muted shrink-0" />`. Preserve the `className` from the original SVG.
  5. **Shuttle/bus icon (lines 222–236)**: Replace the entire `<svg>...</svg>` block with `<LuBus size={16} className="text-foreground-muted shrink-0" />`. Preserve the `className`.
  6. **Lodging/hotel icon (lines 251–266)**: Replace the entire `<svg>...</svg>` block with `<LuHotel size={16} className="text-foreground-muted shrink-0" />`. Preserve the `className`.
  7. Remove any unused SVG-related code. No other changes to the file.
- **Project context**:
  - Framework: React 19, TypeScript strict mode with `verbatimModuleSyntax`
  - Conventions: No semicolons, single quotes, trailing commas, 2-space indent
  - Libraries: `react-icons` — each icon is a React component accepting `size` (number) and `className` (string) props. Import from `react-icons/lu` for Lucide icons.
  - The `IconButton` component wraps children and provides hover color transitions — the icon just needs to render, no extra wrapper needed
- **Dependencies**: TASK-001
- **Acceptance criteria**:
  - Zero `<svg` tags remain in `GuestDetailPanel.tsx`
  - File imports `LuX`, `LuGift`, `LuBus`, `LuHotel` from `react-icons/lu`
  - Both close icons render at 20×20, gift/bus/hotel at 16×16
  - `className="text-foreground-muted shrink-0"` preserved on gift, bus, and hotel icons
  - `npm run build` succeeds

---

#### TASK-003: Replace SVG in ConfirmDialog

- **Description**: Replace the warning triangle inline SVG in `ConfirmDialog.tsx` with `LuTriangleAlert`.
- **Files**: `src/components/molecules/ConfirmDialog.tsx`
- **Instructions**:
  1. Add import at top of file: `import { LuTriangleAlert } from 'react-icons/lu'`
  2. **Warning icon (lines 30–42)**: Replace the entire `<svg>...</svg>` block with `<LuTriangleAlert className="w-6 h-6 text-red-400 shrink-0" />`. The original SVG uses `className="w-6 h-6 text-red-400 shrink-0"` for sizing via CSS (w-6 = 24px, h-6 = 24px) and color. Keep using `className` for sizing since the original used CSS classes, not explicit width/height attributes on the SVG. Alternatively, use `size={24}` and `className="text-red-400 shrink-0"`.
  3. No other changes to the file.
- **Project context**:
  - Framework: React 19, TypeScript strict mode with `verbatimModuleSyntax`
  - Conventions: No semicolons, single quotes, trailing commas, 2-space indent
  - Libraries: `react-icons` — `LuTriangleAlert` is Lucide's alert-triangle icon (stroke-based, matches the original's `stroke="currentColor"` + `strokeWidth="2"`)
- **Dependencies**: TASK-001
- **Acceptance criteria**:
  - Zero `<svg` tags remain in `ConfirmDialog.tsx`
  - File imports `LuTriangleAlert` from `react-icons/lu`
  - Icon renders at 24×24 with `text-red-400` color and `shrink-0`
  - `npm run build` succeeds

---

#### TASK-004: Replace SVG in LeftSidebar

- **Description**: Replace the add-guest (person + plus) inline SVG in `LeftSidebar.tsx` with `LuUserPlus`.
- **Files**: `src/components/organisms/LeftSidebar.tsx`
- **Instructions**:
  1. Add import at top of file: `import { LuUserPlus } from 'react-icons/lu'`
  2. **Add-guest icon (lines 30–43)**: Replace the entire `<svg>...</svg>` block with `<LuUserPlus size={16} />`. The icon is inside a `<button className="btn-primary ...">` which sets `text-primary-foreground` color — the icon inherits color via `currentColor`.
  3. No other changes to the file.
- **Project context**:
  - Framework: React 19, TypeScript strict mode with `verbatimModuleSyntax`
  - Conventions: No semicolons, single quotes, trailing commas, 2-space indent
  - Libraries: `react-icons/lu` — `LuUserPlus` is a stroke-based person-with-plus icon
- **Dependencies**: TASK-001
- **Acceptance criteria**:
  - Zero `<svg` tags remain in `LeftSidebar.tsx`
  - File imports `LuUserPlus` from `react-icons/lu`
  - Icon renders at 16×16
  - `npm run build` succeeds

---

#### TASK-005: Replace SVGs in EmptyState

- **Description**: Replace both inline SVGs in `EmptyState.tsx` — the diamond illustration and the plus icon in the button.
- **Files**: `src/components/organisms/EmptyState.tsx`
- **Instructions**:
  1. Add import at top of file: `import { LuDiamond, LuPlus } from 'react-icons/lu'`
  2. **Diamond icon (lines 8–21)**: Replace the entire `<svg>...</svg>` block with `<LuDiamond size={40} className="text-foreground-muted mb-4" />`. The original SVG has `className="text-foreground-muted mb-4"` and renders at 40×40.
  3. **Plus icon (lines 32–39)**: Replace the entire `<svg>...</svg>` block with `<LuPlus size={14} />`. The icon is inside a `<button className="btn-primary ...">` which provides color via `currentColor`.
  4. No other changes to the file.
- **Project context**:
  - Framework: React 19, TypeScript strict mode with `verbatimModuleSyntax`
  - Conventions: No semicolons, single quotes, trailing commas, 2-space indent
  - Libraries: `react-icons/lu` — `LuDiamond` is a diamond/rhombus outline shape. Note: it may not be pixel-identical to the custom diamond path (`M20 2L38 20L20 38L2 20L20 2Z`) but is the closest standard icon match (per spec Edge Case #6).
- **Dependencies**: TASK-001
- **Acceptance criteria**:
  - Zero `<svg` tags remain in `EmptyState.tsx`
  - File imports `LuDiamond`, `LuPlus` from `react-icons/lu`
  - Diamond renders at 40×40 with `text-foreground-muted mb-4` classes
  - Plus renders at 14×14
  - `npm run build` succeeds

---

#### TASK-006: Replace SVGs in BottomTabBar

- **Description**: Replace all 4 inline SVGs in `BottomTabBar.tsx` — canvas (edit/pen), guests (person), tools (wrench), and more (ellipsis) tab icons.
- **Files**: `src/components/organisms/BottomTabBar.tsx`
- **Instructions**:
  1. Add import at top of file: `import { LuPenSquare, LuUser, LuWrench, LuEllipsis } from 'react-icons/lu'`
  2. **Canvas tab icon (lines 14–26)**: Replace the entire `<svg>...</svg>` block with `<LuPenSquare size={16} />`. The icon is passed as the `icon` prop to `<TabBarItem>`, which wraps it in a `<span>` that applies color classes.
  3. **Guests tab icon (lines 34–46)**: Replace the entire `<svg>...</svg>` block with `<LuUser size={16} />`.
  4. **Tools tab icon (lines 54–65)**: Replace the entire `<svg>...</svg>` block with `<LuWrench size={16} />`.
  5. **More tab icon (lines 73–77)**: Replace the entire `<svg>...</svg>` block with `<LuEllipsis size={16} />`. Note: the original uses `fill="currentColor"` (solid dots). `LuEllipsis` renders three dots in a horizontal line which is visually equivalent. Lucide's ellipsis icon uses `fill` internally for the dots.
  6. No other changes to the file.
- **Project context**:
  - Framework: React 19, TypeScript strict mode with `verbatimModuleSyntax`
  - Conventions: No semicolons, single quotes, trailing commas, 2-space indent
  - Libraries: `react-icons/lu` — icons are passed as `ReactNode` to `TabBarItem`'s `icon` prop. `TabBarItem` applies active/inactive color via `className` on a wrapping `<span>`.
  - Note: Original SVGs use `viewBox="0 0 24 24"` but `width="16" height="16"` — so the rendered size is 16×16, not 24×24. The `size={16}` prop correctly matches this.
- **Dependencies**: TASK-001
- **Acceptance criteria**:
  - Zero `<svg` tags remain in `BottomTabBar.tsx`
  - File imports `LuPenSquare`, `LuUser`, `LuWrench`, `LuEllipsis` from `react-icons/lu`
  - All 4 icons render at 16×16
  - `npm run build` succeeds

---

#### TASK-007: Replace SVG in GuestRow

- **Description**: Replace the actions ellipsis inline SVG in `GuestRow.tsx` with `LuEllipsis`.
- **Files**: `src/components/molecules/GuestRow.tsx`
- **Instructions**:
  1. Add import at top of file: `import { LuEllipsis } from 'react-icons/lu'`
  2. **Ellipsis icon (lines 46–50)**: Replace the entire `<svg>...</svg>` block with `<LuEllipsis size={16} />`. The icon is inside an `<IconButton>` which provides hover color transitions. The original uses `fill="currentColor"` for solid dots — `LuEllipsis` renders equivalent solid dots.
  3. No other changes to the file.
- **Project context**:
  - Framework: React 19, TypeScript strict mode with `verbatimModuleSyntax`
  - Conventions: No semicolons, single quotes, trailing commas, 2-space indent
  - Libraries: `react-icons/lu` — icon is a child of `IconButton` (`children: ReactNode`)
- **Dependencies**: TASK-001
- **Acceptance criteria**:
  - Zero `<svg` tags remain in `GuestRow.tsx`
  - File imports `LuEllipsis` from `react-icons/lu`
  - Icon renders at 16×16
  - `npm run build` succeeds

---

#### TASK-008: Replace SVG in TopNav

- **Description**: Replace the settings/gear inline SVG in `TopNav.tsx` with `LuSettings`.
- **Files**: `src/components/organisms/TopNav.tsx`
- **Instructions**:
  1. Add import at top of file: `import { LuSettings } from 'react-icons/lu'`
  2. **Settings icon (lines 49–61)**: Replace the entire `<svg>...</svg>` block with `<LuSettings size={20} />`. The icon is inside an `<IconButton>` which provides color via `text-foreground-muted` and hover transitions.
  3. No other changes to the file.
- **Project context**:
  - Framework: React 19, TypeScript strict mode with `verbatimModuleSyntax`
  - Conventions: No semicolons, single quotes, trailing commas, 2-space indent
  - Libraries: `react-icons/lu` — `LuSettings` is a gear/cog outline icon (stroke-based, matching the original's `stroke="currentColor"` + `strokeWidth="1.5"`)
- **Dependencies**: TASK-001
- **Acceptance criteria**:
  - Zero `<svg` tags remain in `TopNav.tsx`
  - File imports `LuSettings` from `react-icons/lu`
  - Icon renders at 20×20
  - `npm run build` succeeds

---

#### TASK-009: Replace SVG in FAB

- **Description**: Replace the add-user (person + plus) inline SVG in `FAB.tsx` with `LuUserPlus`.
- **Files**: `src/components/atoms/FAB.tsx`
- **Instructions**:
  1. Add import at top of file: `import { LuUserPlus } from 'react-icons/lu'`
  2. **Add-user icon (lines 13–27)**: Replace the entire `<svg>...</svg>` block with `<LuUserPlus size={24} />`. The icon is inside a `<button>` with `text-primary-foreground` — color inherits via `currentColor`.
  3. No other changes to the file.
- **Project context**:
  - Framework: React 19, TypeScript strict mode with `verbatimModuleSyntax`
  - Conventions: No semicolons, single quotes, trailing commas, 2-space indent
  - Libraries: `react-icons/lu` — `LuUserPlus` is identical to the one used in TASK-004 (LeftSidebar) but rendered at 24×24 here instead of 16×16
- **Dependencies**: TASK-001
- **Acceptance criteria**:
  - Zero `<svg` tags remain in `FAB.tsx`
  - File imports `LuUserPlus` from `react-icons/lu`
  - Icon renders at 24×24
  - `npm run build` succeeds

---

#### TASK-010: Replace SVG in SearchInput

- **Description**: Replace the search/magnifying glass inline SVG in `SearchInput.tsx` with `LuSearch`.
- **Files**: `src/components/atoms/SearchInput.tsx`
- **Instructions**:
  1. Add import at top of file: `import { LuSearch } from 'react-icons/lu'`
  2. **Search icon (lines 14–27)**: Replace the entire `<svg>...</svg>` block with `<LuSearch size={16} className="text-foreground-muted" />`. Preserve the `className` from the original SVG. The original SVG uses `viewBox="0 0 24 24"` but `width="16" height="16"`, so rendered size is 16×16.
  3. No other changes to the file.
- **Project context**:
  - Framework: React 19, TypeScript strict mode with `verbatimModuleSyntax`
  - Conventions: No semicolons, single quotes, trailing commas, 2-space indent
  - Libraries: `react-icons/lu` — `LuSearch` is a magnifying glass outline icon
- **Dependencies**: TASK-001
- **Acceptance criteria**:
  - Zero `<svg` tags remain in `SearchInput.tsx`
  - File imports `LuSearch` from `react-icons/lu`
  - Icon renders at 16×16 with `text-foreground-muted` class
  - `npm run build` succeeds

---

#### TASK-011: Replace SVGs in StatusIcon

- **Description**: Replace both conditional inline SVGs in `StatusIcon.tsx` — the confirmed checkmark-in-circle and the pending ellipsis.
- **Files**: `src/components/atoms/StatusIcon.tsx`
- **Instructions**:
  1. Add import at top of file: `import { LuCircleCheck, LuEllipsis } from 'react-icons/lu'`
  2. **Confirmed icon (lines 10–23)**: Replace the entire `<svg>...</svg>` block with `<LuCircleCheck size={24} className="md:hidden text-primary" />`. Preserve the `className` from the original SVG. The original is a stroke-based circle with checkmark.
  3. **Pending icon (lines 28–38)**: Replace the entire `<svg>...</svg>` block with `<LuEllipsis size={24} className="md:hidden text-foreground-muted" />`. Preserve the `className` from the original SVG. The original uses `fill="currentColor"` for solid dots.
  4. Preserve the conditional `if (status === 'CONFIRMED')` logic — only the SVG elements change, not the branching.
  5. No other changes to the file.
- **Project context**:
  - Framework: React 19, TypeScript strict mode with `verbatimModuleSyntax`
  - Conventions: No semicolons, single quotes, trailing commas, 2-space indent
  - The `GuestStatus` type import must remain: `import type { GuestStatus } from '../../data/mock-guests'` (required by `verbatimModuleSyntax`)
  - Libraries: `react-icons/lu` — `LuCircleCheck` is a circle with checkmark (stroke-based), `LuEllipsis` renders three horizontal dots
- **Dependencies**: TASK-001
- **Acceptance criteria**:
  - Zero `<svg` tags remain in `StatusIcon.tsx`
  - File imports `LuCircleCheck`, `LuEllipsis` from `react-icons/lu`
  - Conditional logic for `CONFIRMED` vs other statuses is preserved
  - Both icons render at 24×24
  - `md:hidden` class preserved on both icons
  - `npm run build` succeeds

### Execution Order

#### Phase 1 (no dependencies)

- **TASK-001**: Install react-icons dependency

#### Phase 2 (all depend on TASK-001, can run in parallel)

- **TASK-002**: Replace SVGs in GuestDetailPanel (4 SVGs → 4 icons)
- **TASK-003**: Replace SVG in ConfirmDialog (1 SVG → 1 icon)
- **TASK-004**: Replace SVG in LeftSidebar (1 SVG → 1 icon)
- **TASK-005**: Replace SVGs in EmptyState (2 SVGs → 2 icons)
- **TASK-006**: Replace SVGs in BottomTabBar (4 SVGs → 4 icons)
- **TASK-007**: Replace SVG in GuestRow (1 SVG → 1 icon)
- **TASK-008**: Replace SVG in TopNav (1 SVG → 1 icon)
- **TASK-009**: Replace SVG in FAB (1 SVG → 1 icon)
- **TASK-010**: Replace SVG in SearchInput (1 SVG → 1 icon)
- **TASK-011**: Replace SVGs in StatusIcon (2 SVGs → 2 icons)

### Verification Checklist

- [x] All requirements from the spec are covered (18 SVGs across 10 files mapped to 11 tasks)
- [x] No task modifies files outside its scope (each task targets exactly one file)
- [x] Dependencies are correctly mapped (all file tasks depend only on TASK-001)
- [x] Each task has clear acceptance criteria
- [x] Icon family is consistent (all Lucide — `react-icons/lu`)
- [x] Fill vs stroke distinction addressed (solid ellipsis dots handled via LuEllipsis)
- [x] All icon sizes match original SVG dimensions
- [x] All className attributes preserved where needed

## Notes

- `react-icons` supports tree-shaking, so only the icons actually imported will be included in the production bundle.
- Total inline SVGs to replace: **18** instances across **10** component files.
- After this refactor, any future icon additions should use `react-icons` imports rather than inline SVGs.

### Verification Summary

All 11 tasks (TASK-001 through TASK-011) have been verified as complete. Key findings:

- **Zero `<svg` tags** remain across all 10 component files.
- **All imports** use the `react-icons/lu` (Lucide) family exclusively — consistent across the entire codebase.
- **Icon sizes** match the spec exactly for all 18 icon instances (20px, 16px, 24px, 40px, 14px as required).
- **classNames** are preserved on every icon that originally carried styling classes (`text-foreground-muted`, `shrink-0`, `text-red-400`, `text-primary`, `md:hidden`, `mb-4`).
- **Conditional logic** in `StatusIcon.tsx` preserved correctly — `CONFIRMED` vs other statuses still branch as before.
- **One acceptable deviation**: TASK-006 used `LuSquarePen` instead of the planned `LuPenSquare` because `LuPenSquare` does not exist as an export in `react-icons/lu`. `LuSquarePen` renders the same pen-in-square (edit) icon.
- **Build passes** (`npm run build`) with zero TypeScript or lint errors.
- **Total line reduction**: ~180+ lines of inline SVG markup replaced by concise icon component calls across 10 files.

**Result: ALL ACCEPTANCE CRITERIA MET. Verification PASSED.**

## Changelog

- 2026-04-03: Initial draft — confirmed immediately (straightforward refactor, no ambiguities)
- 2026-04-03: Technical plan added by TPM
- 2026-04-03: All 11 tasks completed and verified — zero inline SVGs remain, build passes, all acceptance criteria met
- 2026-04-03: Validation APPROVED (0 CRITICAL, 0 MAJOR, 1 MINOR). Spec status set to Completed.
