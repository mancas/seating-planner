# Codebase Context

## Tech Stack

- **Language(s)**: TypeScript ~5.9.3 (strict mode, ES2023 target)
- **Framework**: React ^19.2.4
- **Runtime**: Node.js v22.14.0 (ESM, `"type": "module"`)
- **Build Tool**: Vite ^8.0.1
- **CSS Framework**: TailwindCSS ^4.2.2 (CSS-first config via `@tailwindcss/vite` plugin, no `tailwind.config.js`)
- **Routing**: React Router ^7.14.0 (BrowserRouter, nested routes + `useSearchParams` for tab switching)
- **Design System**: Nought Cobalt — dark-mode-only, monochrome + cobalt blue (#0057FF), Space Grotesk typeface

## Key Dependencies

| Library                      | Version  | Purpose                                                             |
| ---------------------------- | -------- | ------------------------------------------------------------------- |
| react                        | ^19.2.4  | UI framework                                                        |
| react-dom                    | ^19.2.4  | React DOM rendering                                                 |
| react-router                 | ^7.14.0  | Client-side routing (BrowserRouter, nested routes, useSearchParams) |
| react-hook-form              | ^7.72.1  | Form state management and validation for guest CRUD                 |
| uuid                         | ^13.0.0  | UUID v4 generation for guest IDs                                    |
| tailwindcss                  | ^4.2.2   | Utility-first CSS framework (v4 CSS-first config)                   |
| @tailwindcss/vite            | ^4.2.2   | Vite plugin for TailwindCSS v4                                      |
| @vitejs/plugin-react         | ^6.0.1   | React support for Vite (Oxc-based)                                  |
| typescript                   | ~5.9.3   | Type checking                                                       |
| eslint                       | ^9.39.4  | Linting (flat config)                                               |
| eslint-config-prettier       | ^10.1.8  | Disables ESLint rules that conflict with Prettier                   |
| eslint-plugin-react-hooks    | ^7.0.1   | React hooks linting                                                 |
| eslint-plugin-react-refresh  | ^0.5.2   | React refresh linting                                               |
| typescript-eslint            | ^8.57.0  | TypeScript ESLint integration                                       |
| prettier                     | ^3.8.1   | Code formatter                                                      |
| husky                        | ^9.1.7   | Git hooks                                                           |
| @types/uuid                  | ^10.0.0  | TypeScript types for uuid                                           |
| @types/node                  | ^24.12.0 | TypeScript types for Node.js                                        |
| Space Grotesk (Google Fonts) | CDN      | Primary typeface — loaded via `<link>` in `index.html`              |

## Code Conventions

- **Naming**: camelCase for variables/functions, PascalCase for components/types/interfaces
- **File organization**: Atomic design structure: `src/components/atoms/` (11 components), `src/components/molecules/` (7 components), `src/components/organisms/` (9 components). Pages in `src/pages/`. Data layer in `src/data/`. No barrel `index.ts` files.
- **Import style**: Relative imports (`../../data/mock-guests`, `../atoms/Avatar`); no path aliases configured
- **Type imports**: `import type { X }` required by `verbatimModuleSyntax`
- **Component style**: Function declarations (`function App()`) with default exports
- **Semicolons**: None (Prettier `semi: false`)
- **Quotes**: Single quotes (Prettier `singleQuote: true`)
- **Trailing commas**: All (Prettier `trailingComma: "all"`)
- **Print width**: 80 characters
- **Tab width**: 2 spaces
- **Prop interfaces**: Named `Props` (local to file), defined above the component function

### Linter/Formatter

- **ESLint**: Flat config (`eslint.config.js`) with `@eslint/js` recommended, `typescript-eslint` recommended, `react-hooks` recommended, `react-refresh` vite config, and `eslint-config-prettier`. Targets `**/*.{ts,tsx}` files. Ignores `dist/`.
- **Prettier**: Configured via `.prettierrc`; ignores `dist`, `node_modules`, `package-lock.json` (`.prettierignore`)
- **Pre-commit hook** (Husky): Runs `npx prettier --check .` and `npm run lint` before every commit

### TypeScript Configuration

- **Target**: ES2023
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx
- **Strict mode**: Enabled (`strict: true`)
- **Additional checks**: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`
- **verbatimModuleSyntax**: Enabled (requires explicit `type` keyword for type-only imports: `import type { X }`)
- **Project references**: Split config — `tsconfig.app.json` (includes `src/`) and `tsconfig.node.json` (includes `vite.config.ts`)

## Architectural Patterns

- **Structure**: Single-page application (SPA) with React + BrowserRouter. App shell with nested route layout: `<App>` is a layout route rendering `<Outlet>` for child routes (`/guests/new`, `/guests/:id/edit`). Query-param tab switching at root `/` (`/?tab=guests`, `/?tab=canvas`, `/?tab=tools`, `/?tab=more`). Three-panel desktop layout (TopNav, LeftSidebar, main content + optional GuestDetailPanel). Mobile layout with bottom tab bar, FAB, and table-grouped guest list. Responsive breakpoint at 768px (`md:` Tailwind prefix).
- **State management**: Local component state via `useState` in `App.tsx`. No global state library. `App` owns `guests` (read from localStorage on mount), `selectedGuestId`, `searchQuery`, and `activeTab` (via `useSearchParams`). Data and callbacks passed down as props. Child routes receive data via `useOutletContext`.
- **Data layer**: `src/data/guest-store.ts` — localStorage-backed CRUD module. Reads/writes `Guest[]` under key `"seating-plan:guests"`. Exports `getGuests`, `getGuestById`, `addGuest`, `updateGuest`, `deleteGuest`, and stat helper functions. Uses `uuid` v4 for ID generation. Has in-memory fallback if localStorage is unavailable. `src/data/mock-guests.ts` retains the `Guest` interface, `GuestStatus` type, and mock data array (used as reference data, not consumed at runtime).
- **Data fetching**: None — client-only with localStorage persistence.
- **Error handling**: Minimal. localStorage read/write wrapped in try/catch with silent fallback. No global error boundary. No error reporting.
- **Styling approach**: Nought Cobalt design system. Tailwind utility classes in JSX for all component styling. `src/index.css` provides design tokens via `@theme` (Tailwind utilities) and `:root` (`--nc-*` CSS custom properties), base element styles, typography `@utility` classes, and component base styles in `@layer components`. `src/App.css` is empty.

### Current File Structure

```
src/
├── App.css                    (empty)
├── App.tsx                    (app shell, layout route, tab routing, state management)
├── index.css                  (design system: tokens, theme, base styles, utilities, components)
├── main.tsx                   (entry point: StrictMode + BrowserRouter + Routes + App)
├── assets/
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── data/
│   ├── guest-store.ts         (localStorage CRUD: getGuests, addGuest, updateGuest, deleteGuest, stats)
│   └── mock-guests.ts         (Guest/GuestStatus types, mock data array, stat helpers)
├── pages/
│   ├── AddGuestPage.tsx       (renders GuestForm for new guest, uses useOutletContext)
│   └── EditGuestPage.tsx      (renders GuestForm pre-populated, uses useOutletContext + useParams)
└── components/
    ├── atoms/
    │   ├── Avatar.tsx          (circular initials, sm/md/lg sizes)
    │   ├── FAB.tsx             (floating action button, mobile-only)
    │   ├── FormError.tsx       (form validation error message)
    │   ├── IconButton.tsx      (icon-only button with a11y)
    │   ├── NavLink.tsx         (top nav link with active underline)
    │   ├── SearchInput.tsx     (search input with icon)
    │   ├── StatCard.tsx        (label + value card, optional mobile border)
    │   ├── StatusBadge.tsx     (CONFIRMED/PENDING/DECLINED text badge)
    │   ├── StatusIcon.tsx      (checkmark/ellipsis icon, mobile-only)
    │   ├── TabBarItem.tsx      (bottom tab bar item with icon + label)
    │   └── Toggle.tsx          (toggle switch for boolean form fields)
    ├── molecules/
    │   ├── ConfirmDialog.tsx   (delete confirmation modal with dark overlay)
    │   ├── FormField.tsx       (label + input wrapper for forms)
    │   ├── FormSection.tsx     (section heading + children for form grouping)
    │   ├── GuestDetailSection.tsx (labeled section in detail panel)
    │   ├── GuestRow.tsx        (dual-layout: desktop table row / mobile compact row)
    │   ├── SidebarNavItem.tsx  (sidebar nav item with active highlight)
    │   └── TableGroupHeader.tsx (location + table name + seats, mobile-only)
    └── organisms/
        ├── BottomTabBar.tsx    (4-tab mobile nav bar, fixed bottom)
        ├── EmptyState.tsx      (empty guest list with CTA to add)
        ├── GuestDetailPanel.tsx (right detail panel, desktop + mobile overlay)
        ├── GuestForm.tsx       (add/edit form with react-hook-form, all guest fields)
        ├── GuestListFooterStats.tsx (3 stat cards, desktop-only)
        ├── GuestListHeader.tsx (title + summary stats, responsive)
        ├── GuestTable.tsx      (flat table desktop / grouped mobile)
        ├── LeftSidebar.tsx     (nav items + ADD GUEST button, desktop-only)
        └── TopNav.tsx          (brand + nav links + search + settings + avatar)
```

### Routing Architecture

- `main.tsx` wraps `<App />` in `<BrowserRouter>` with `<Routes>`
- `<App>` is a layout route (`<Route element={<App />}>`) with child routes:
  - `<Route index element={null} />` — default (guest list rendered by App itself)
  - `<Route path="guests/new" element={<AddGuestPage />} />`
  - `<Route path="guests/:id/edit" element={<EditGuestPage />} />`
- `App.tsx` renders `<Outlet>` for child routes in the main content area when `isChildRoute` is true
- Outlet context passes `{ guests, onAdd, onUpdate, onDelete, onCancel }` to child pages
- Tab switching uses `useSearchParams` at root `/` — tabs: `guests` (default), `canvas`, `tools`, `more`
- Invalid tab values fall back to `guests`

### CSS Architecture

**`src/index.css`** (398 lines):

- Line 1: `@import 'tailwindcss'` — top-level Tailwind v4 import
- Lines 3–55: `@theme` block — gray scale (12 steps), cobalt accent scale (8 steps), semantic color aliases, font families, border radii
- Lines 57–96: `:root` block — `--nc-*` namespaced CSS custom properties + `color-scheme: dark`
- Lines 98–191: Base element styles — `html`, `body`, `h1`–`h5`, `p`, `code`, `#root`
- Lines 193–276: Typography `@utility` classes — 12 utilities (`text-display` through `text-code`)
- Lines 278–398: `@layer components` — 6 component base styles (`.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.card`, `.input`, `.badge`)

### Icons

- Components currently use **inline `<svg>` elements** for all icons (18 total across 10 components)
- `public/icons.svg` exists as a sprite file but is not referenced by any component
- A confirmed spec (`replace-icons-with-react-icons`) plans to replace all inline SVGs with `react-icons` library components

## Test Conventions

- **Framework**: None installed (no Jest, Vitest, or other test framework in dependencies)
- **Location**: N/A
- **Naming**: N/A

## Project-Specific Practices

- **Build command**: `tsc -b && vite build` (TypeScript checks before Vite build)
- **Dev server**: `vite` (port not customized)
- **Pre-commit enforcement**: Prettier format check + ESLint run via Husky pre-commit hook
- **No test suite**: No tests exist or are required by the pre-commit hook
- **Entry point**: `index.html` → `src/main.tsx` → `App.tsx`
- **Static assets**: SVG icons sprite at `public/icons.svg` (unused), favicon at `public/favicon.svg`
- **Font loading**: Google Fonts preconnect + stylesheet links in `index.html` `<head>` for Space Grotesk (400, 500, 600, 700)
- **Cyberpunk aesthetic**: All UI labels use uppercase, underscores, and technical-sounding codes (e.g., `REGISTRY.SYSTEM_V4`, `SEATING_01`, `PLANNER_V1.0`, `IDENTITY_MATRIX`, `STATUS_CLASSIFICATION`)
- **Responsive pattern**: Single components adapt via Tailwind responsive utilities (`hidden md:block`, `md:hidden`, `md:flex`, etc.) — no separate mobile/desktop component files
- **Form patterns**: `react-hook-form` with `register` + built-in validation (required, no schema library). `aria-invalid` on validated inputs. `role="alert"` on error messages.
- **Data persistence**: localStorage under `"seating-plan:guests"` key. Empty list on fresh install (no mock data seeding).
- **ID generation**: UUID v4 via `uuid` package for all guest records.

## Prior Spec Decisions

### Spec: Nought Cobalt Design System — Status: Completed (2026-04-03)

Key architectural decisions:

1. **DD-1: `--nc-*` CSS namespace** — All design tokens use the `--nc-` prefix.
2. **DD-2: Monochrome gray scale** — 12-step pure grayscale from `gray-950` (#0A0A0A) to `gray-50` (#F0F0F0).
3. **DD-3: Cobalt blue accent scale** — 8-step scale centered on `#0057FF` (cobalt-600).
4. **DD-4: Semantic color aliases** — `background`, `surface`, `surface-elevated`, `foreground`, `foreground-muted`, `foreground-heading`, `border`, `primary`, `primary-hover`, `primary-foreground`, `ring`.
5. **DD-5: Typography scale** — Space Grotesk, 12-level type scale from Display (56px) to Caption/Label (12px).
6. **DD-6: Google Fonts import** for Space Grotesk with preconnect in `index.html`.
7. **DD-7: CSS-first TailwindCSS v4 config** — `@theme` directive in `src/index.css`.
8. **DD-8: Default border radius** — 4px globally.
9. **DD-9: Component base styles** — `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.card`, `.input`, `.badge` in `@layer components`.
10. **DD-10: Dark mode only** — `color-scheme: dark`, no light mode.

### Spec: Guest List Screen — Status: Completed (2026-04-03)

Key architectural decisions:

1. **DD-1: Three-panel layout** — TopNav (full width, 56px), LeftSidebar (220px fixed, desktop-only), main content (flexible), GuestDetailPanel (320px fixed, conditional).
2. **DD-2: Atomic design component organization** — `atoms/`, `molecules/`, `organisms/`. No barrel files.
3. **DD-3: Mock data module** — `src/data/mock-guests.ts` with typed guest array and stat helpers.
4. **DD-4: Guest data model** — `Guest` interface with `GuestStatus` union type, nullable fields, nested `dietary` and `logistics` objects.
5. **DD-5: Query-param tab switching** — `useSearchParams` at root `/`.
6. **DD-6: Local state for detail panel** — `useState` for `selectedGuestId` in `App`.
7. **DD-7: Client-side search** — Case-insensitive substring match on `firstName + lastName`.
8. **DD-8: Cyberpunk aesthetic naming** — Uppercase, underscores, technical codes.
9. **DD-9: Status badge variants** — CONFIRMED (cobalt filled), PENDING (cobalt outlined), DECLINED (muted red outlined).
10. **DD-10: Selected row indicator** — `border-l-2 border-l-primary bg-surface-elevated`.
11. **DD-11: Responsive breakpoint at 768px** — `md:` prefix.
12. **DD-12: Bottom tab bar** — 4 tabs with query-param navigation on mobile.
13. **DD-13: Mobile guest list grouped by table** — UNASSIGNED group with `totalSeats={0}`.
14. **DD-14: FAB on mobile** — Replaces sidebar "ADD GUEST" button.

### Spec: Guest CRUD Flow — Status: Completed (2026-04-03)

Key architectural decisions:

1. **DD-1: Form as dedicated route** — `/guests/new` and `/guests/:id/edit` as nested React Router routes within `<App>` layout.
2. **DD-2: react-hook-form** — `useForm` with built-in `register` + `required` validation. No schema library.
3. **DD-3: localStorage data layer** — `src/data/guest-store.ts` with CRUD operations.
4. **DD-4: localStorage key** — `"seating-plan:guests"`. JSON-serialized `Guest[]`.
5. **DD-5: UUID v4 guest IDs** — Via `uuid` package.
6. **DD-6: React state + localStorage sync** — App reads from store, CRUD updates both.
7. **DD-7: Custom delete confirmation dialog** — Dark overlay modal. Red confirm button (exception to cobalt-only accent).
8. **DD-8: Form field sections** — Cyberpunk section headings (IDENTITY_MATRIX, STATUS_CLASSIFICATION, etc.).
9. **DD-9: Navigation after submission** — Add: `navigate('/?tab=guests', { replace: true })`. Edit: `navigate('/?tab=guests', { state: { selectedGuestId: id } })`.
10. **DD-10: Empty state** — "NO_RECORDS // INITIALIZE_DATABASE" with CTA to `/guests/new`.
11. **DD-11: Outlet context** — `App` passes `{ guests, onAdd, onUpdate, onDelete, onCancel }` via `<Outlet context>`.
12. **DD-12: Single GuestForm** — Handles add (no `guest` prop) and edit (with `guest` prop, shows delete) modes.

### Spec: Replace Icons with react-icons — Status: Confirmed (2026-04-03)

Planned changes (not yet implemented):

1. Install `react-icons` as dependency.
2. Replace all 18 inline `<svg>` elements across 10 components with `react-icons` equivalents.
3. Target icon sets: Remix Icon (`ri`), Ionicons 5 (`io5`), Lucide (`lu`).
4. Affected components: GuestDetailPanel (4 icons), ConfirmDialog (1), LeftSidebar (1), EmptyState (2), BottomTabBar (4), GuestRow (1), TopNav (2), FAB (1), SearchInput (1), GuestForm (1).

## Guardrails and Lessons Learned

### From: Nought Cobalt Design System (2026-04-03)

**G-1: Tailwind v4 `@import` Must Be Top-Level**
`@import 'tailwindcss'` must always be the very first line of `src/index.css`, at the top level. Never nest it inside a media query, selector, or any other at-rule.

**G-2: Use `@theme` for Tailwind Utility Generation, `:root` for Direct CSS Variables**
Design tokens that should generate Tailwind utility classes go in the `@theme` block (using `--color-*`, `--font-*`, `--radius-*` namespaces). Tokens intended for direct CSS consumption go in `:root` with the `--nc-*` prefix.

**G-3: All Design Tokens Use `--nc-*` Namespace**
When referencing design tokens in custom CSS (outside Tailwind utilities), always use `var(--nc-*)` variables, never raw hex values or Tailwind's generated `var(--color-*)` variables.

**G-4: No Light Mode — Dark Only**
Never add `prefers-color-scheme` media queries or `color-scheme: light dark`. The application is dark-mode only with `color-scheme: dark` on `:root`.

**G-5: Default Border Radius is 4px**
Use `4px` (or the `rounded` Tailwind utility) as the default border radius. Only deviate with explicit design justification.

**G-6: Use `@utility` for Multi-Property Utility Classes**
When defining custom Tailwind utilities that set multiple CSS properties, use the `@utility` directive, not `@layer utilities`.

**G-7: Use `@layer components` for Component Base Styles**
Component base styles go in `@layer components` to ensure proper specificity ordering.

**G-8: `focus-visible` for Buttons, `focus` for Inputs**
Interactive elements primarily clicked (buttons) use `:focus-visible`. Form inputs use `:focus`.

**G-9: Google Fonts Must Include Preconnect**
Always include both preconnect links (`fonts.googleapis.com` and `fonts.gstatic.com` with `crossorigin`) before the stylesheet link.

**G-10: Variable Migration Completeness**
When renaming CSS custom properties, grep the entire `src/` directory for old variable names. CSS custom properties silently fall back to `initial` when undefined.

### From: Guest List Screen (2026-04-03)

**G-11: All Interactive Elements Must Be Keyboard Accessible**
Every clickable element must be keyboard accessible. Buttons need `cursor-pointer`. `<div onClick>` needs `role="button"`, `tabIndex={0}`, `onKeyDown` — or refactor to `<button>`. All buttons need `focus-visible` outline.

**G-12: Always Review Ternary Branches for Copy-Paste Errors**
Verify that ternary true/false branches produce different outputs. Identical branches are always a bug.

**G-13: Use Design System Typography Classes Consistently**
All text elements must use the appropriate typography utility class. Never rely on inherited font sizing.

**G-14: Mobile-Specific Groups Need Contextual Data**
Group metadata should be derived from the group's context, not hardcoded.

### From: Guest CRUD Flow (2026-04-03)

**G-15: Form Inputs with Validation Must Include `aria-invalid`**
Any form input with validation must include `aria-invalid={errors.fieldName ? 'true' : 'false'}`. Error messages use `role="alert"`.

**G-16: Avoid `setState` Inside `useEffect` — Use Synchronous State Adjustment**
Prefer the "adjusting state during render" pattern over `useEffect` with `setState`. Check React's "You Might Not Need an Effect" guide.

**G-17: Single Source of Truth for Data Transformations**
Data filtering, sorting, and transformation should happen in exactly one place.

**G-18: Delete Unused Component Files**
If a component is created but never imported anywhere, delete it.

**G-19: Custom Modal Dialogs Need Keyboard and ARIA Support**
Modals must include: `role="alertdialog"` or `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, Escape key handler, and ideally focus trapping.
