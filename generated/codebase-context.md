# Codebase Context

## Tech Stack

- **Language(s)**: TypeScript ~5.9.3 (strict mode, ES2023 target)
- **Framework**: React ^19.2.4
- **Runtime**: Node.js (ESM, `"type": "module"`)
- **Build Tool**: Vite ^8.0.1
- **CSS Framework**: TailwindCSS ^4.2.2 (CSS-first config via `@tailwindcss/vite` plugin, no `tailwind.config.js`)
- **Routing**: React Router ^7.14.0 (BrowserRouter, `useSearchParams` for tab switching)
- **Design System**: Nought Cobalt — dark-mode-only, monochrome + cobalt blue (#0057FF), Space Grotesk typeface

## Key Dependencies

| Library                      | Version | Purpose                                                |
| ---------------------------- | ------- | ------------------------------------------------------ |
| react                        | ^19.2.4 | UI framework                                           |
| react-dom                    | ^19.2.4 | React DOM rendering                                    |
| react-router                 | ^7.14.0 | Client-side routing (BrowserRouter, useSearchParams)   |
| tailwindcss                  | ^4.2.2  | Utility-first CSS framework (v4 CSS-first config)      |
| @tailwindcss/vite            | ^4.2.2  | Vite plugin for TailwindCSS v4                         |
| @vitejs/plugin-react         | ^6.0.1  | React support for Vite (Oxc-based)                     |
| typescript                   | ~5.9.3  | Type checking                                          |
| eslint                       | ^9.39.4 | Linting (flat config)                                  |
| eslint-config-prettier       | ^10.1.8 | Disables ESLint rules that conflict with Prettier      |
| eslint-plugin-react-hooks    | ^7.0.1  | React hooks linting                                    |
| eslint-plugin-react-refresh  | ^0.5.2  | React refresh linting                                  |
| typescript-eslint            | ^8.57.0 | TypeScript ESLint integration                          |
| prettier                     | ^3.8.1  | Code formatter                                         |
| husky                        | ^9.1.7  | Git hooks                                              |
| Space Grotesk (Google Fonts) | CDN     | Primary typeface — loaded via `<link>` in `index.html` |

## Code Conventions

- **Naming**: camelCase for variables/functions, PascalCase for components/types/interfaces
- **File organization**: Atomic design structure: `src/components/atoms/` (9 components), `src/components/molecules/` (4 components), `src/components/organisms/` (7 components). Mock data in `src/data/`. No barrel `index.ts` files.
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

- **Structure**: Single-page application (SPA) with React + BrowserRouter. App shell with query-param tab routing (`/?tab=guests`, `/?tab=canvas`) at root `/`. Three-panel desktop layout (TopNav, LeftSidebar, main content + optional GuestDetailPanel). Mobile layout with bottom tab bar, FAB, and table-grouped guest list. Responsive breakpoint at 768px (`md:` Tailwind prefix).
- **State management**: Local component state via `useState` in `App.tsx`. No global state library. `App` owns `selectedGuestId`, `searchQuery`, and `activeTab` (via `useSearchParams`). Data and callbacks passed down as props.
- **Data fetching**: None (mock data). `src/data/mock-guests.ts` exports typed `Guest` interface, `GuestStatus` type, 6 mock guests, and stat helper functions (`getConfirmedCount`, `getPendingCount`, `getConfirmationRate`, `getDietaryFlagCount`, `getTotalGuests`, `getWaitlistCount`, `getGuestsByTable`).
- **Error handling**: None currently implemented.
- **Styling approach**: Nought Cobalt design system. Tailwind utility classes in JSX for all component styling. `src/index.css` provides design tokens via `@theme` (Tailwind utilities) and `:root` (`--nc-*` CSS custom properties), base element styles, typography `@utility` classes, and component base styles in `@layer components`. `src/App.css` is empty (all Vite template styles removed).

### Current File Structure

```
src/
├── App.css                    (empty)
├── App.tsx                    (app shell, tab routing, state management)
├── index.css                  (design system: tokens, theme, base styles, utilities, components)
├── main.tsx                   (entry point: StrictMode + BrowserRouter + App)
├── data/
│   └── mock-guests.ts         (Guest/GuestStatus types, mock data array, stat helpers)
└── components/
    ├── atoms/
    │   ├── Avatar.tsx          (circular initials, sm/md/lg sizes)
    │   ├── FAB.tsx             (floating action button, mobile-only)
    │   ├── IconButton.tsx      (icon-only button with a11y)
    │   ├── NavLink.tsx         (top nav link with active underline)
    │   ├── SearchInput.tsx     (search input with icon)
    │   ├── StatCard.tsx        (label + value card, optional mobile border)
    │   ├── StatusBadge.tsx     (CONFIRMED/PENDING/DECLINED text badge)
    │   ├── StatusIcon.tsx      (checkmark/ellipsis icon, mobile-only)
    │   └── TabBarItem.tsx      (bottom tab bar item with icon + label)
    ├── molecules/
    │   ├── GuestDetailSection.tsx (labeled section in detail panel)
    │   ├── GuestRow.tsx        (dual-layout: desktop table row / mobile compact row)
    │   ├── SidebarNavItem.tsx  (sidebar nav item with active highlight)
    │   └── TableGroupHeader.tsx (location + table name + seats, mobile-only)
    └── organisms/
        ├── BottomTabBar.tsx    (4-tab mobile nav bar, fixed bottom)
        ├── GuestDetailPanel.tsx (right detail panel, desktop + mobile overlay)
        ├── GuestListFooterStats.tsx (3 stat cards, desktop-only)
        ├── GuestListHeader.tsx (title + summary stats, responsive)
        ├── GuestTable.tsx      (flat table desktop / grouped mobile)
        ├── LeftSidebar.tsx     (nav items + ADD GUEST button, desktop-only)
        └── TopNav.tsx          (brand + nav links + search + settings + avatar)
```

### Current CSS Architecture

**`src/index.css`** (398 lines):

- Line 1: `@import 'tailwindcss'` — top-level Tailwind v4 import
- Lines 3–55: `@theme` block — Tailwind v4 CSS-first config defining:
  - Gray scale: 12 steps (`gray-950` through `gray-50`)
  - Cobalt accent scale: 8 steps (`cobalt-950` through `cobalt-300`)
  - Semantic color aliases: `background`, `surface`, `surface-elevated`, `foreground`, `foreground-muted`, `foreground-heading`, `border`, `primary`, `primary-hover`, `primary-foreground`, `ring`
  - AC convenience aliases: `muted`, `default`
  - Font families: `--font-sans` (Space Grotesk), `--font-mono`
  - Border radii: `--radius` (4px default), `--radius-sm` through `--radius-xl`
- Lines 57–96: `:root` block — `--nc-*` namespaced CSS custom properties mirroring theme values + `color-scheme: dark`
- Lines 98–191: Base element styles — `html`, `body`, `h1`–`h5`, `p`, `code`, `#root`
- Lines 193–276: Typography `@utility` classes — 12 utilities: `text-display`, `text-heading-1` through `text-heading-5`, `text-body-lg`, `text-body`, `text-body-sm`, `text-caption`, `text-label`, `text-code`
- Lines 278–398: `@layer components` — 6 component base styles: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.card`, `.input`, `.badge`

**`src/App.css`** (0 lines):

- Emptied — all Vite template styles removed. Component styling is done via Tailwind utility classes in JSX.

**`#root`** (index.css line 185): `width: 100%`, `min-height: 100svh`, `display: flex`, `flex-direction: column` — full-viewport layout for the app shell.

### TailwindCSS v4 Configuration

- Uses `@tailwindcss/vite` plugin (CSS-first configuration)
- **No `tailwind.config.js` file** — configuration is done via `@theme` directive in `src/index.css`
- `@theme` defines custom gray scale (overrides Tailwind defaults), cobalt accent scale, semantic aliases, font families, and border radii
- Custom typography utilities defined via `@utility` directive
- Component base styles defined in `@layer components`
- Vite config: `plugins: [react(), tailwindcss()]`

### Routing Architecture

- `main.tsx` wraps `<App />` in `<BrowserRouter>` from `react-router`
- `App.tsx` uses `useSearchParams` for tab switching at root `/`
- Supported tabs: `guests` (default), `canvas`, `tools`, `more`
- Invalid tab values fall back to `guests`
- No sub-route definitions currently exist — the entire app renders at `/`
- React Router's `useNavigate`, `useParams` hooks available for future route-based navigation

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
- **Routing**: BrowserRouter wraps App in `main.tsx`; query-param tab switching at root `/`
- **Static assets**: SVG icons served from `public/icons.svg` (sprite), favicon at `public/favicon.svg`
- **Font loading**: Google Fonts preconnect + stylesheet links in `index.html` `<head>` for Space Grotesk (400, 500, 600, 700)
- **Inline SVGs**: Components use inline `<svg>` elements for icons rather than referencing the sprite file
- **Cyberpunk aesthetic**: All UI labels use uppercase, underscores, and technical-sounding codes (e.g., `REGISTRY.SYSTEM_V4`, `SEATING_01`, `PLANNER_V1.0`)
- **Responsive pattern**: Single components adapt via Tailwind responsive utilities (`hidden md:block`, `md:hidden`, `md:flex`, etc.) — no separate mobile/desktop component files

## Prior Spec Decisions

### Spec: Nought Cobalt Design System (`spec/nought-cobalt-design-system.md`) — Status: Completed

Key architectural decisions established:

1. **DD-1: `--nc-*` CSS namespace** — All design tokens use the `--nc-` prefix. Prevents collisions with third-party CSS or Tailwind internals.
2. **DD-2: Monochrome gray scale** — 12-step pure grayscale from `gray-950` (#0A0A0A) to `gray-50` (#F0F0F0).
3. **DD-3: Cobalt blue accent scale** — 8-step scale centered on `#0057FF` (cobalt-600).
4. **DD-4: Semantic color aliases** — `background`, `surface`, `surface-elevated`, `foreground`, `foreground-muted`, `foreground-heading`, `border`, `primary`, `primary-hover`, `primary-foreground`, `ring`.
5. **DD-5: Typography scale** — Space Grotesk, 12-level type scale from Display (56px) to Caption/Label (12px).
6. **DD-6: Google Fonts import** for Space Grotesk with preconnect in `index.html`.
7. **DD-7: CSS-first TailwindCSS v4 config** — `@theme` directive in `src/index.css`.
8. **DD-8: Default border radius** — 4px globally.
9. **DD-9: Component base styles** — `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.card`, `.input`, `.badge` in `@layer components`.
10. **DD-10: Dark mode only** — `color-scheme: dark`, no light mode.

### Spec: Guest List Screen (`spec/guest-list-screen.md`) — Status: Completed

Key architectural decisions implemented:

1. **DD-1: Three-panel layout** — TopNav (full width, 56px), LeftSidebar (220px fixed, desktop-only), main content (flexible), GuestDetailPanel (320px fixed, conditional, desktop+mobile overlay).
2. **DD-2: Atomic design component organization** — `atoms/` (9), `molecules/` (4), `organisms/` (7). No barrel `index.ts` files. Single components adapt for mobile/desktop via Tailwind responsive utilities.
3. **DD-3: Mock data module** — `src/data/mock-guests.ts` with typed guest array and stat helper functions.
4. **DD-4: Guest data model** — `Guest` interface with `GuestStatus` union type (`'CONFIRMED' | 'PENDING' | 'DECLINED'`), nullable `tableAssignment`, `seatNumber`, nested `dietary` and `logistics` objects.
5. **DD-5: Query-param tab switching** — `useSearchParams` at root `/` (`/?tab=guests`, `/?tab=canvas`). Default tab is `guests`. No sub-routes.
6. **DD-6: Local state for detail panel** — `useState` for `selectedGuestId` in `App`, toggle behavior on row click.
7. **DD-7: Client-side search** — Case-insensitive substring match on `firstName + lastName`. Stats always reflect full dataset.
8. **DD-8: Cyberpunk aesthetic naming** — Uppercase, underscores, technical codes in all UI labels.
9. **DD-9: Status badge variants** — CONFIRMED (filled cobalt), PENDING (outlined cobalt), DECLINED (outlined muted red `red-500/50`, `red-400/70`).
10. **DD-10: Selected row indicator** — `border-l-2 border-l-primary bg-surface-elevated`.
11. **DD-11: Responsive breakpoint at 768px** — `md:` prefix for desktop. Mobile: single column, bottom tab bar, FAB, table-grouped list.
12. **DD-12: Bottom tab bar** — 4 tabs (CANVAS, GUESTS, TOOLS, MORE) with query-param navigation on mobile.
13. **DD-13: Mobile guest list grouped by table** — Single `GuestTable` adapts rendering. UNASSIGNED group at end with `totalSeats={0}`.
14. **DD-14: FAB on mobile** — Replaces sidebar "ADD GUEST" button. Currently wired to no-op `onClick`.

### Spec: Guest CRUD Flow (`spec/guest-crud-flow.md`) — Status: Draft (Confirmed, awaiting implementation)

Key architectural decisions planned:

1. **DD-1: Form as dedicated route** — `/guests/new` and `/guests/:id/edit` as React Router routes (not query-param tabs). Render within shared app shell layout (TopNav, LeftSidebar). Layout route wraps both tab-based home and form routes.
2. **DD-2: react-hook-form** — `useForm` hook for form state, validation, and submission. Built-in `register` with `{ required: true }` — no schema library (zod/yup).
3. **DD-3: localStorage data layer** — `src/data/guest-store.ts` encapsulates CRUD operations. Reads/writes `Guest[]` to localStorage. Replaces direct consumption of `mock-guests.ts`. Type definitions stay in `mock-guests.ts`.
4. **DD-4: localStorage key** — `"seating-plan:guests"`. JSON-serialized `Guest[]`. No versioning.
5. **DD-5: UUID v4 guest IDs** — Generated via `uuid` npm package. Standard UUID format. No collision checking.
6. **DD-6: React state + localStorage sync** — `App` reads guests from store on mount, CRUD operations update both localStorage and React state. No global state library.
7. **DD-7: Custom delete confirmation dialog** — Not `window.confirm()`. Design system styled modal with dark overlay. Red `bg-red-600` confirm button (exception to cobalt-only accent).
8. **DD-8: Form field sections** — IDENTITY_MATRIX, STATUS_CLASSIFICATION, SEATING_ALLOCATION, DIETARY_PROTOCOL, LOGISTICS_CONFIG. Cyberpunk section headings.
9. **DD-9: Navigation after submission** — Add: `navigate('/?tab=guests', { replace: true })`. Edit: `navigate('/?tab=guests', { state: { selectedGuestId: id } })`.
10. **DD-10: Empty state** — "NO_RECORDS // INITIALIZE_DATABASE" with "NEW_ENTRY" CTA button linking to `/guests/new`.
11. **DD-11: Callback props** — LeftSidebar gains `onAddGuest`, GuestDetailPanel gains `onUpdate` and `onDelete`, FAB wired to navigate.
12. **DD-12: Single GuestForm component** — Handles both add (no `guest` prop) and edit (with `guest` prop, shows delete button) modes.

**New dependencies planned**: `react-hook-form`, `uuid`, `@types/uuid`

**New components planned**:

- Atoms: `Toggle`, `SelectInput`, `TextareaInput`, `FormError`
- Molecules: `FormField`, `FormSection`, `ConfirmDialog`
- Organisms: `GuestForm`, `EmptyState`

**Modified components**: `LeftSidebar` (ADD GUEST callback), `GuestDetailPanel` (UPDATE/DELETE callbacks), `FAB` (navigate callback)

## Guardrails and Lessons Learned

See `generated/guardrails.md` for 14 guardrails established from the Nought Cobalt design system and Guest List Screen implementations, covering Tailwind v4 configuration patterns, CSS variable namespacing, dark mode policy, migration safety practices, accessibility requirements, and component development patterns.

### From: Nought Cobalt Design System

- **G-1**: `@import 'tailwindcss'` must be the very first line of `src/index.css`, top-level, never nested.
- **G-2**: `@theme` for Tailwind utility generation, `:root` `--nc-*` for direct CSS variables.
- **G-3**: Always use `var(--nc-*)` in custom CSS, never raw hex or Tailwind's `var(--color-*)`.
- **G-4**: No light mode — dark only. No `prefers-color-scheme` media queries.
- **G-5**: Default border radius is 4px.
- **G-6**: Use `@utility` for multi-property utility classes, not `@layer utilities`.
- **G-7**: Use `@layer components` for component base styles.
- **G-8**: `focus-visible` for buttons, `focus` for inputs.
- **G-9**: Google Fonts must include preconnect links.
- **G-10**: Grep entire `src/` for old variable names when renaming CSS custom properties — CSS silently falls back to `initial`.

### From: Guest List Screen

- **G-11**: All interactive elements must be keyboard accessible. Buttons need `cursor-pointer`. `<div onClick>` needs `role="button"`, `tabIndex={0}`, `onKeyDown` — or refactor to `<button>`. All buttons need `focus-visible` outline.
- **G-12**: Always review ternary branches for copy-paste errors. Identical branches in a ternary is always a bug.
- **G-13**: Use design system typography classes consistently. Never rely on inherited font sizing when a typography class is specified.
- **G-14**: Mobile-specific groups need contextual data. Don't hardcode values (like `totalSeats`) that only apply to some groups.
