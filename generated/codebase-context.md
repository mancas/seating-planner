# Codebase Context

## Tech Stack

- **Language(s)**: TypeScript ~5.9.3 (strict mode, ES2023 target)
- **Framework**: React ^19.2.4
- **Runtime**: Node.js (ESM, `"type": "module"`)
- **Build Tool**: Vite ^8.0.1
- **CSS Framework**: TailwindCSS ^4.2.2 (CSS-first config via `@tailwindcss/vite` plugin, no `tailwind.config.js`)
- **Routing**: React Router ^7.14.0 (BrowserRouter)
- **Design System**: Nought Cobalt — dark-mode-only, monochrome + cobalt blue (#0057FF), Space Grotesk typeface

## Key Dependencies

| Library                      | Version | Purpose                                                |
| ---------------------------- | ------- | ------------------------------------------------------ |
| react                        | ^19.2.4 | UI framework                                           |
| react-dom                    | ^19.2.4 | React DOM rendering                                    |
| react-router                 | ^7.14.0 | Client-side routing (BrowserRouter wrapping App)       |
| tailwindcss                  | ^4.2.2  | Utility-first CSS framework                            |
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

- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **File organization**: Flat `src/` directory currently; planned atomic design structure (`src/components/atoms/`, `molecules/`, `organisms/`) per guest-list-screen spec. No barrel `index.ts` files.
- **Import style**: Relative imports (`./App.tsx`, `./assets/react.svg`); no path aliases configured
- **Component style**: Function declarations (`function App()`) with default exports
- **Semicolons**: None (Prettier `semi: false`)
- **Quotes**: Single quotes (Prettier `singleQuote: true`)
- **Trailing commas**: All (Prettier `trailingComma: "all"`)
- **Print width**: 80 characters
- **Tab width**: 2 spaces

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
- **verbatimModuleSyntax**: Enabled (requires explicit `type` keyword for type-only imports)
- **Project references**: Split config — `tsconfig.app.json` (includes `src/`) and `tsconfig.node.json` (includes `vite.config.ts`)

## Architectural Patterns

- **Structure**: Single-page application (SPA) with React + BrowserRouter. Currently a minimal Vite scaffold — one component (`App.tsx`) with no route definitions. Routing planned via query params (`/?tab=guests`, `/?tab=canvas`) at root `/`.
- **State management**: Local component state via `useState`. No global state library.
- **Data fetching**: None currently implemented. Mock data planned in `src/data/mock-guests.ts`.
- **Error handling**: None currently implemented.
- **Styling approach**: Nought Cobalt design system. `src/index.css` provides design tokens via `@theme` (Tailwind utilities) and `:root` (`--nc-*` CSS custom properties), base element styles, typography utilities, and component base styles. `src/App.css` provides component-specific styles using `--nc-*` tokens. CSS uses native nesting (`&` syntax). Tailwind utility classes are available via the `@theme` configuration.

### Current CSS Architecture

**`src/index.css`** (402 lines):

- Line 1: `@import 'tailwindcss'` — top-level Tailwind v4 import
- Lines 3–55: `@theme` block — Tailwind v4 CSS-first config defining:
  - Gray scale: 12 steps (`gray-950` through `gray-50`)
  - Cobalt accent scale: 8 steps (`cobalt-950` through `cobalt-300`)
  - Semantic color aliases: `background`, `surface`, `surface-elevated`, `foreground`, `foreground-muted`, `foreground-heading`, `border`, `primary`, `primary-hover`, `primary-foreground`, `ring`
  - AC convenience aliases: `muted`, `default`
  - Font families: `--font-sans` (Space Grotesk), `--font-mono`
  - Border radii: `--radius` (4px default), `--radius-sm` through `--radius-xl`
- Lines 57–96: `:root` block — `--nc-*` namespaced CSS custom properties mirroring theme values + `color-scheme: dark`
- Lines 98–195: Base element styles — `html`, `body`, `h1`–`h5`, `p`, `code`, `#root`
- Lines 197–280: Typography `@utility` classes — 12 utilities: `text-display`, `text-heading-1` through `text-heading-5`, `text-body-lg`, `text-body`, `text-body-sm`, `text-caption`, `text-label`, `text-code`
- Lines 282–402: `@layer components` — 6 component base styles: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.card`, `.input`, `.badge`

**`src/App.css`** (190 lines):

- Component styles using `--nc-*` design tokens exclusively
- Styles for: `.counter`, `.hero`, `#center`, `#next-steps`, `#docs`, `#spacer`, `.ticks`
- Uses native CSS nesting extensively
- Responsive breakpoints at `max-width: 1024px`
- Dark mode icon filter applied unconditionally for `#social .button-icon`

**Note**: `#root` currently has `width: 1126px` and `text-align: center` — this will need adjustment for full-viewport layouts.

### TailwindCSS v4 Configuration

- Uses `@tailwindcss/vite` plugin (CSS-first configuration)
- **No `tailwind.config.js` file** — configuration is done via `@theme` directive in `src/index.css`
- `@theme` defines custom gray scale (overrides Tailwind defaults), cobalt accent scale, semantic aliases, font families, and border radii
- Custom typography utilities defined via `@utility` directive
- Component base styles defined in `@layer components`
- Vite config: `plugins: [react(), tailwindcss()]`

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
- **Routing**: BrowserRouter wraps App in `main.tsx`; no routes defined yet. Planned: query-param tab switching at root `/`.
- **Static assets**: SVG icons served from `public/icons.svg` (sprite), favicon at `public/favicon.svg`
- **Font loading**: Google Fonts preconnect + stylesheet links in `index.html` `<head>` for Space Grotesk (400, 500, 600, 700)

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

### Spec: Guest List Screen (`spec/guest-list-screen.md`) — Status: Draft

Key architectural decisions planned:

1. **DD-1: CSS Grid three-panel layout** — Top nav (full width), left sidebar (220px fixed), main content (flexible), right detail panel (320px fixed, conditional).
2. **DD-2: Atomic design component organization** — `src/components/atoms/`, `molecules/`, `organisms/`. No barrel `index.ts` files. Components are shared between desktop and mobile using Tailwind responsive utilities.
3. **DD-3: Mock data module** — `src/data/mock-guests.ts` with typed guest array and stat helper functions.
4. **DD-4: Guest data model** — `Guest` interface with `GuestStatus` union type (`'CONFIRMED' | 'PENDING' | 'DECLINED'`), nullable `tableAssignment`, nested `dietary` and `logistics` objects, `seatNumber` field.
5. **DD-5: React Router query params** — Tab switching via `useSearchParams` at root `/` (`/?tab=guests`, `/?tab=canvas`). No sub-routes.
6. **DD-6: Local state for detail panel** — `useState` for selected guest ID, toggle behavior on row click.
7. **DD-7: Client-side search** — Controlled input, case-insensitive substring match on name. Stats always reflect full dataset.
8. **DD-8: Cyberpunk aesthetic** — Uppercase, underscores, technical codes in all UI labels.
9. **DD-9: Status badge variants** — CONFIRMED (filled cobalt), PENDING (outlined cobalt), DECLINED (outlined muted red via raw Tailwind `red-500/50`, `red-400/70`).
10. **DD-11: Responsive breakpoint at 768px** — Mobile layout below, desktop three-panel above. Uses Tailwind `md:` prefix.
11. **DD-12: Bottom tab bar on mobile** — 4 tabs (CANVAS, GUESTS, TOOLS, MORE) replacing sidebar.
12. **DD-13: Mobile guest list grouped by table** — Single `GuestTable` component adapts rendering.
13. **DD-14: FAB on mobile** — Replaces sidebar "ADD GUEST" button.

## Guardrails and Lessons Learned

See `generated/guardrails.md` for 10 guardrails established from the Nought Cobalt design system implementation, covering Tailwind v4 configuration patterns, CSS variable namespacing, dark mode policy, and migration safety practices.

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
- **G-10**: Grep entire `src/` for old variable names when renaming CSS custom properties — CSS silently falls back to `initial`.
