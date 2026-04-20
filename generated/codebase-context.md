# Codebase Context

> Generated: 2026-04-12
> Purpose: Comprehensive context for technical planning and development agents.

## Tech Stack

- **Language(s)**: TypeScript ~5.9.3 (strict mode, ES2023 target)
- **Framework**: React ^19.2.4 (with react-dom ^19.2.4)
- **Runtime**: Node.js 22 (per Dockerfile `node:22-alpine`)
- **Build Tool**: Vite ^8.0.1 (with `@vitejs/plugin-react` ^6.0.1)
- **CSS Framework**: TailwindCSS ^4.2.2 (v4 CSS-first config, `@tailwindcss/vite` plugin)
- **Module System**: ESM (`"type": "module"` in package.json)
- **Routing**: react-router ^7.14.0 (BrowserRouter, declarative Routes)
- **Deployment**: Docker (multi-stage: Node build + Nginx serve), GitHub Container Registry (GHCR)
- **PWA**: Service worker registration (`public/sw.js`), web manifest, apple-touch-icon

## Key Dependencies

| Library               | Version | Purpose                                                    |
| --------------------- | ------- | ---------------------------------------------------------- |
| react                 | ^19.2.4 | UI framework                                               |
| react-dom             | ^19.2.4 | DOM renderer                                               |
| react-router          | ^7.14.0 | Client-side routing (BrowserRouter, Routes, Route, Outlet) |
| react-hook-form       | ^7.72.1 | Form state management and validation                       |
| @tanstack/react-table | ^8.21.3 | Headless data table (guest list)                           |
| @dnd-kit/react        | ^0.3.2  | Drag-and-drop (guest-to-seat assignment, seat swapping)    |
| react-zoom-pan-pinch  | ^3.7.0  | Canvas pan/zoom for seating floor plan                     |
| react-icons           | ^5.6.0  | Icon library (Lucide subset: `react-icons/lu`)             |
| vaul                  | ^1.1.2  | Mobile drawer/bottom sheet component                       |
| uuid                  | ^13.0.0 | UUID v4 generation for entity IDs                          |
| tailwindcss           | ^4.2.2  | Utility-first CSS framework (v4, CSS-first config)         |
| typescript            | ~5.9.3  | Type checking                                              |
| eslint                | ^9.39.4 | Linting (flat config)                                      |
| prettier              | ^3.8.1  | Code formatting                                            |
| husky                 | ^9.1.7  | Git hooks (pre-commit)                                     |

## Code Conventions

### Naming

- **Variables/functions**: camelCase
- **Types/interfaces**: PascalCase (e.g., `Guest`, `FloorTable`, `GuestStatus`)
- **Constants**: UPPER_SNAKE_CASE for string literals/enums (e.g., `DRAG_TYPE_GUEST`, `NATO_LABELS`), camelCase for numeric constants (e.g., `SEAT_SPACING`, `TABLE_PADDING`)
- **Components**: PascalCase function names, PascalCase filenames (e.g., `GuestListView.tsx`, `IconButton.tsx`)
- **Files**: PascalCase for components, kebab-case for data/utils/hooks (e.g., `guest-store.ts`, `canvas-utils.ts`, `useGuestStats.ts`)

### File Organization

- **Atomic Design**: Components organized as `atoms/`, `molecules/`, `organisms/` under `src/components/`
- **Pages**: Route-level view components in `src/pages/` (e.g., `GuestListView.tsx`, `SeatingPlanView.tsx`, `SettingsView.tsx`)
- **Data Layer**: Types, stores, and utilities in `src/data/` (e.g., `guest-types.ts`, `guest-store.ts`, `guest-utils.ts`)
- **Hooks**: Custom hooks in `src/hooks/` (e.g., `useGuestStats.ts`, `useIsMobile.ts`, `useOverlayPanel.ts`)
- **Utils**: General utilities in `src/utils/` (e.g., `project-export.ts`, `csv-import.ts`)
- **Specs**: Feature specifications in `spec/`
- **Generated artifacts**: Reports and context docs in `generated/`

### Import Style

- **Relative imports** throughout (e.g., `'../data/guest-store'`, `'./atoms/IconButton'`)
- **No path aliases** configured in tsconfig
- **Type-only imports** via `import type { ... }` (enforced by `verbatimModuleSyntax: true`)

### Linter/Formatter

- **ESLint**: Flat config (`eslint.config.js`), extends `js.configs.recommended`, `tseslint.configs.recommended`, `reactHooks.configs.flat.recommended`, `reactRefresh.configs.vite`, plus `eslintConfigPrettier` to disable format-conflicting rules
- **Prettier**: No semicolons, single quotes, trailing commas (all), 80 char print width, 2-space tabs
- **Pre-commit hook**: Husky runs `prettier --check .` and `npm run lint` before every commit

### Component Patterns

- **Function declarations** for components and handlers (not arrow expressions) — per G-45
- **Default exports** for all components
- **Props interfaces** named `Props` (locally scoped, not exported)
- **`useCallback`** for handlers passed as props or used as effect dependencies
- **`useState(() => initializer)` pattern** for lazy initialization from localStorage

## Architectural Patterns

### Structure

- **Layout Route pattern**: `App.tsx` is a thin 17-line layout shell (TopNav + Outlet + BottomTabBar) — per G-40
- **Nested routes**: `GuestListView` is a layout route that provides `OutletContext` to child routes (`AddGuestPage`, `EditGuestPage`) — per G-38
- **Route-level state**: Each view component (`GuestListView`, `SeatingPlanView`, `SettingsView`) owns its own state, no global state management

### State Management

- **No global state library** (no Redux, Zustand, etc.)
- **localStorage persistence**: Data stored via `createStorage<T>()` utility (`src/data/storage-utils.ts`) which provides typed `read()`/`write()` with memory fallback
- **Storage keys**: `seating-plan:guests`, `seating-plan:tables`, `seating-plan:table-counter`
- **Component state**: `useState` for local UI state, `useReducer` for complex state machines (e.g., mobile sheet state)
- **Derived state**: `useMemo` for computed values (e.g., `useGuestStats`), inline for simple derivations
- **Adjusting state during render**: Used instead of `useEffect` + `setState` for syncing state with prop/location changes — per G-16, G-25

### Data Fetching

- **No server/API** — entirely client-side, localStorage-backed
- **Store functions** (e.g., `getGuests()`, `addGuest()`) are plain functions that read/write localStorage synchronously
- **Store functions are NOT hooks** — they perform I/O (JSON deserialization) and should be wrapped in `useState(() => fn())` or `useMemo` — per G-39

### Error Handling

- **Form validation**: react-hook-form with `aria-invalid` and `role="alert"` error messages — per G-15
- **File I/O**: `.catch()` handlers on Promise-based File API, `onerror` on FileReader — per G-42, G-46
- **localStorage**: `createStorage` wraps in try/catch with memory fallback
- **Import validation**: `validateProjectImport()` returns `null` for invalid data (no exceptions)

### Drag and Drop

- **@dnd-kit/react** `DragDropProvider` wraps the seating plan view
- **Type-safe drag data**: Discriminated unions (`DragGuestData`, `DragSeatData`) with runtime type guards (`isDragGuestData`, `isDragSeatData`)
- **Custom hook**: `useDragEndHandler` centralizes DnD logic

### Overlay Panels

- **`useOverlayPanel` hook**: Manages open/closing/closed phase state machine with Escape key support
- **"Adjusting state during render" pattern**: Used to preserve stale data during exit animations (instead of ref.current reads) — per G-48
- **Slide animations**: `animate-slide-in-right` / `animate-slide-out-right` defined in `@theme`

### Responsive Design

- **Mobile breakpoint**: 767px (`useIsMobile` hook via `matchMedia`)
- **CSS-based visibility**: `md:hidden` / `hidden md:block` for layout elements
- **JS-based rendering**: `isMobile &&` for behavior-dependent components (mobile sheets)
- **Vaul drawers**: Used for mobile bottom sheets (`MobilePropertiesSheet`, `MobileGuestsSheet`, `MobileSeatAssignmentSheet`)

## Test Conventions

- **No test framework** configured (no Jest, Vitest, or other test runner in dependencies)
- **No test files** present in the codebase
- **Quality assurance**: Pre-commit hook (prettier + eslint), TypeScript strict mode, spec-driven validation reports in `generated/`

## Project-Specific Practices

### Design System: Nought Cobalt

- **Dark mode only** — no light mode, `color-scheme: dark` on `:root` — per G-4
- **Token namespace**: `--nc-*` CSS custom properties for direct CSS usage, `@theme` block for Tailwind utility generation — per G-2, G-3
- **Typography**: Space Grotesk (Google Fonts with preconnect), custom `@utility` classes (`text-heading-1` through `text-heading-5`, `text-body`, `text-body-sm`, `text-caption`, `text-label`, `text-code`)
- **Component base styles**: `@layer components` for `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-destructive`, `.card`, `.input`, `.badge` — per G-7
- **Default border radius**: 4px (`--radius: 4px`) — per G-5
- **Icons**: Lucide family only (`react-icons/lu`), use `size` prop for dimensions — per G-20, G-22
- **Focus styles**: `focus-visible` for buttons, `focus` for inputs — per G-8

### Release Process

- **Versioning**: semver via `scripts/release.sh` (patch/minor/major)
- **Current version**: 1.2.1
- **CI/CD**: GitHub Actions workflow builds Docker image on push to `main` or tags, pushes to GHCR

### Spec-Driven Development

- **Specs are authoritative** — literal values, file lists, and patterns in specs are the contract — per G-24
- **Spec index**: `spec/INDEX.md` catalogs all specs with status (Draft → Confirmed → Completed)
- **Validation reports**: Generated after implementation in `generated/`
- **Out-of-scope changes prohibited** in feature commits — per G-47

## Prior Spec Decisions

### Completed Specs (16)

1. **Nought Cobalt Design System** — Established the entire CSS architecture: `@theme` + `:root` tokens, `@utility` typography, `@layer components` base styles, dark-mode-only
2. **Guest List Screen** — Atomic design component hierarchy (atoms/molecules/organisms), responsive three-panel desktop layout, mobile single-column
3. **Guest CRUD Flow** — react-hook-form for all forms, localStorage persistence via store functions, uuid IDs, `OutletContext` pattern for form routes
4. **Replace Icons with react-icons** — Standardized on `react-icons/lu` (Lucide), `size` prop for dimensions
5. **Seating Canvas** — @dnd-kit/react for drag-and-drop, react-zoom-pan-pinch for pan/zoom, table geometry helpers in `table-types.ts`, NATO phonetic labels
6. **Semantic Table Refactor** — @tanstack/react-table with module-scope column definitions, `border-separate border-spacing-0` pattern
7. **Sidebar Navigation** — Route-based navigation (`/` and `/seating-plan`), `LeftSidebar` with `SidebarNavItem`, `BottomTabBar` with `TabBarItem`
8. **Mobile Canvas** — `useLongPress`, `useTableTouchDrag` hooks, Vaul drawers for mobile sheets, `useIsMobile` hook
9. **Fix Mobile Seat Assignment** — Mobile seat assignment via bottom sheet (not popover), event propagation fix
10. **Refactor Codebase** — Thin `App.tsx` layout shell (G-40), route-level state ownership, `useTableState` hook, `useGuestStats` hook, dedicated utility files (`guest-utils.ts`, `canvas-utils.ts`)
11. **Import Guests** — CSV import with all-or-nothing validation at `/guests/import`
12. **Update Dietary Flags Metrics** — Replaced dietary stats with gift total stats
13. **Export & Import Project** — Versioned JSON export/import, `ProjectExport` interface, `project-export.ts` utilities
14. **Sticky Guest Form Actions** — Sticky action bar in `GuestForm`
15. **Overlay Sidebar** — `useOverlayPanel` hook, slide animations, backdrop, "adjusting state during render" for stale data
16. **Settings Screen** — `/settings` route, consolidated export/import/delete actions, `useProjectImport` hook

### In-Progress Specs

- **Import Guests** (Confirmed) — CSV template download + bulk import at `/guests/import`
- **Wedding Expenses** (Draft) — New `/expenses` route with expense CRUD, `seating-plan:expenses` localStorage key, new sidebar/tab bar nav items; must update `LeftSidebar`, `BottomTabBar`, `main.tsx` routing, and `project-export.ts` for export/import integration

### Key Architectural Decisions from Specs

- **Route ownership**: Each top-level route owns its state and passes it down. No prop drilling through `App.tsx` — per refactor spec
- **Layout routes for related pages**: `GuestListView` is a layout route for guest CRUD child routes, providing `OutletContext`
- **Active state audit required**: When adding new routes, audit ALL nav items' `isActive` logic — per G-50
- **Co-dependent changes are atomic**: Navigation + component prop changes must be in the same commit — per G-51

## Guardrails and Lessons Learned

### From: Nought Cobalt Design System (2026-04-03)

**G-1: Tailwind v4 `@import` Must Be Top-Level**
`@import 'tailwindcss'` must always be the very first line of `src/index.css`, at the top level. Never nest it inside a media query, selector, or any other at-rule.

**G-2: Use `@theme` for Tailwind Utility Generation, `:root` for Direct CSS Variables**
Design tokens that should generate Tailwind utility classes go in the `@theme` block (using `--color-*`, `--font-*`, `--radius-*` namespaces). Tokens intended for direct CSS consumption go in `:root` with the `--nc-*` prefix.

**G-3: All Design Tokens Use `--nc-*` Namespace**
When referencing design tokens in custom CSS (outside Tailwind utilities), always use `var(--nc-*)` variables, never raw hex values or Tailwind's generated `var(--color-*)` variables.

**G-4: No Light Mode — Dark Only**
Never add `prefers-color-scheme` media queries or `color-scheme: light dark` to any CSS file. The application is dark-mode only with `color-scheme: dark` on `:root`.

**G-5: Default Border Radius is 4px**
Use `4px` (or the `rounded` Tailwind utility) as the default border radius for all new components. Only deviate with explicit design justification.

**G-6: Use `@utility` for Multi-Property Utility Classes**
When defining custom Tailwind utilities that set multiple CSS properties, use the `@utility` directive, not `@layer utilities`.

**G-7: Use `@layer components` for Component Base Styles**
Component base styles (`.btn-*`, `.card`, `.input`, `.badge`, etc.) go in `@layer components` to ensure proper specificity ordering.

**G-8: `focus-visible` for Buttons, `focus` for Inputs**
Interactive elements that are primarily clicked (buttons) should use `:focus-visible` for focus styling. Form inputs should use `:focus`.

**G-9: Google Fonts Must Include Preconnect**
When loading fonts from Google Fonts, always include both preconnect links before the stylesheet link in `<head>`.

**G-10: Variable Migration Completeness**
When renaming CSS custom properties, grep the entire `src/` directory for the old variable names to ensure zero references remain.

### From: Guest List Screen (2026-04-03)

**G-11: All Interactive Elements Must Be Keyboard Accessible**
Every clickable element must be keyboard accessible with `cursor-pointer`, `focus-visible` outline, and proper ARIA attributes.

**G-12: Always Review Ternary Branches for Copy-Paste Errors**
Verify that the true and false branches produce different outputs.

**G-13: Use Design System Typography Classes Consistently**
All text elements must use the appropriate typography utility class from the design system.

**G-14: Mobile-Specific Groups Need Contextual Data**
When rendering grouped data, ensure group metadata reflects the group's actual context.

### From: Guest CRUD Flow (2026-04-03)

**G-15: Form Inputs with Validation Must Include `aria-invalid`**
Any form input that has validation must include `aria-invalid={errors.fieldName ? 'true' : 'false'}`. Error message elements must use `role="alert"`.

**G-16: Avoid `setState` Inside `useEffect` — Use Synchronous State Adjustment**
Prefer the "adjusting state during render" pattern over `useEffect` with `setState`.

**G-17: Single Source of Truth for Data Transformations**
Data filtering, sorting, and transformation should happen in exactly one place.

**G-18: Delete Unused Component Files**
If a component is created but never imported anywhere, delete it.

**G-19: Custom Modal Dialogs Need Keyboard and ARIA Support**
Custom modal/dialog components must include `role="alertdialog"` or `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, Escape key handler.

### From: Replace Icons with react-icons (2026-04-03)

**G-20: Use a Single Icon Family for Consistency**
All icons must come from `react-icons/lu` (Lucide). Do not mix icon families.

**G-21: Verify Icon Export Names Against the Actual Package**
Before specifying an icon component name, verify the export exists in the target `react-icons` sub-package.

**G-22: Use `size` Prop for Icon Dimensions, Not CSS Width/Height**
Set icon dimensions via the `size` prop on `react-icons` components.

### From: Seating Canvas (2026-04-03)

**G-23: Data Store Function Signatures Must Match Their Intended Contract**
TypeScript type signature must accurately reflect which fields are accepted. Prefer `Partial<Pick<T, ...>>` to be explicit.

**G-24: Spec Is the Authoritative Reference for Literal Values**
When the spec defines specific literal values, use those exact values.

**G-25: G-16 Applies Even When `useEffect` Seems Justified**
The `react-hooks/set-state-in-effect` ESLint rule will block the pre-commit hook for ANY synchronous `setState` inside `useEffect`.

**G-26: Collapse Identical Conditional Branches**
When an if/else or ternary has identical branches, collapse them into a single unconditional block.

### From: Semantic Table Refactor (2026-04-03)

**G-27: Define @tanstack/react-table Column Definitions at Module Scope**
Define the `columns` array at module scope (outside the component function) for stable references.

**G-28: Use `border-separate` + `border-spacing-0` for Styled `<table>` Elements**
Use `border-collapse: separate` with `border-spacing: 0` when applying per-row or per-cell borders.

### From: Sidebar Navigation (2026-04-03)

**G-29: Clean Up Vestigial Props After Interface Changes**
When a feature removes functionality, audit all components that consumed the removed data.

**G-30: Verify Component Import Graph After Removing Consumers**
When removing imports of a component from its only consumer, check whether any other file still imports the component.

### From: Mobile Canvas (2026-04-03)

**G-31: Clean Up Timer Refs on Component Unmount**
When a custom hook uses `setTimeout`/`setInterval` stored in a `useRef`, always add a cleanup `useEffect`.

**G-32: Choose One Responsive Visibility Strategy Per Element**
Use either CSS-based visibility or JS-based conditional rendering, not both.

**G-33: Align Equivalent Type Definitions Across Components**
When two components accept the same logical data shape for a prop, use the same TypeScript type expression.

**G-34: Touch Event Listeners Must Accompany Mouse Listeners for Mobile Support**
When adding `document.addEventListener('mousedown', ...)`, always also add `touchstart` listener.

### From: Refactor Codebase (2026-04-04)

**G-35: Use `key` Prop to Reset Component State Instead of `prevId` Tracking**
Use `key={entity.id}` on the component to force React to remount it, resetting all local state automatically.

**G-36: Extract Shared Logic into Dedicated Utility Files, Not Co-locate with Data**
Utility functions should live in dedicated files. Type files should only export types; data files should only export data.

**G-37: Remove Dead Exports After Creating Replacements**
Grep the codebase for all original implementations and delete any that become orphaned.

**G-38: Layout Routes Own Their Outlet Context**
The layout route component (not the root `App`) should own the state and provide the `OutletContext` for its child routes.

**G-39: Store Functions Are Not Hooks — Don't Call Them in Render Without Memoization**
Store read functions that access `localStorage` should not be called directly in the component body on every render. Wrap in `useState(() => fn())` or `useMemo`.

**G-40: Thin Layout Shell App.tsx — No Business Logic**
`App.tsx` should be a thin layout shell. All state management, CRUD operations, computed values, and view-specific rendering should live in route-level view components.

**G-41: G-16 Exception — Side Effects Justify useEffect with setState**
When the effect must also perform a browser side effect (like `window.history.replaceState`), `useEffect` is correct. Add an eslint-disable comment.

### From: Import Guests (2026-04-04)

**G-42: Handle Promise Rejections from File API Reads**
When using `file.text()` or similar File API methods, always attach a `.catch()` handler.

**G-43: Interactive `<div>` Elements Must Have Full Keyboard Support**
When a `<div>` has `onClick` and `cursor-pointer`, it must also have `tabIndex={0}`, `role="button"`, `onKeyDown` handler, and `focus-visible` styling.

### From: Export & Import Project (2026-04-04)

**G-44: Do Not Unmount Components That Own Pending Dialog State**
If a component manages state for dialogs that must render after an async operation, the parent must not unmount the component before those dialogs have been shown and dismissed.

**G-45: Consistent Function Declaration Style for Component Handlers**
Inside React component functions, use function declarations (`function handleClick() { ... }`) for event handlers and callbacks, not arrow function expressions.

**G-46: Always Set `reader.onerror` When Using FileReader**
When using `FileReader.readAsText()`, always set both `reader.onload` and `reader.onerror`.

### From: Sticky Guest Form Actions (2026-04-04)

**G-47: Do Not Include Out-of-Scope Changes in Feature Commits**
A feature commit must only modify the files listed in the spec's "Affected files" section.

### From: Overlay Sidebar (2026-04-04)

**G-48: Do Not Read or Write `useRef.current` During Render — Use `useState` Instead**
Never read or write `ref.current` in the component's render body. The `react-hooks/refs` ESLint rule flags this as an error.

**G-49: Stabilize Callback Props Passed to Hooks with `useCallback`**
When passing a callback function to a custom hook that uses it as a `useEffect` dependency, wrap the callback in `useCallback`.

### From: Settings Screen (2026-04-05)

**G-50: Fix Active States When Adding Routes to Navigation Components**
When adding a new route to navigation components, audit ALL existing nav items' `isActive` logic. Replace catch-all patterns with explicit exclusions or positive matching.

**G-51: Co-dependent File Changes Must Be Atomic**
When two files have mutual dependencies that must be updated together, both changes must be in the same commit/task.

**G-52: Verify Deletion Completeness with Grep After Removing Components**
After deleting a component file, run `grep -r 'ComponentName' src/` to verify zero remaining imports or references.
