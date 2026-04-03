# Codebase Context

## Tech Stack

- **Language(s)**: TypeScript ~5.9.3 (strict mode, ES2023 target)
- **Framework**: React ^19.2.4
- **Runtime**: Node.js v22.14.0, npm 10.9.2
- **Build Tool**: Vite ^8.0.1
- **CSS Framework**: TailwindCSS ^4.2.2 (CSS-first config via `@tailwindcss/vite` plugin, no `tailwind.config.js`)
- **Module System**: ESM (`"type": "module"`)

## Key Dependencies

| Library                     | Version | Purpose                                           |
| --------------------------- | ------- | ------------------------------------------------- |
| react                       | ^19.2.4 | UI framework                                      |
| react-dom                   | ^19.2.4 | React DOM rendering                               |
| react-router                | ^7.14.0 | Client-side routing (BrowserRouter in use)        |
| tailwindcss                 | ^4.2.2  | Utility-first CSS framework                       |
| @tailwindcss/vite           | ^4.2.2  | Vite plugin for TailwindCSS v4                    |
| @vitejs/plugin-react        | ^6.0.1  | React support for Vite (Oxc-based)                |
| typescript                  | ~5.9.3  | Type checking                                     |
| eslint                      | ^9.39.4 | Linting (flat config)                             |
| eslint-config-prettier      | ^10.1.8 | Disables ESLint rules that conflict with Prettier |
| eslint-plugin-react-hooks   | ^7.0.1  | React hooks linting                               |
| eslint-plugin-react-refresh | ^0.5.2  | React refresh linting                             |
| typescript-eslint           | ^8.57.0 | TypeScript ESLint integration                     |
| prettier                    | ^3.8.1  | Code formatter                                    |
| husky                       | ^9.1.7  | Git hooks                                         |

## Code Conventions

- **Naming**: camelCase for variables/functions, PascalCase for components
- **File organization**: Flat `src/` directory (no nested feature folders yet); assets in `src/assets/`, public static files in `public/`
- **Import style**: Relative imports (`./App.tsx`, `./assets/react.svg`); no path aliases configured
- **Component style**: Function declarations (`function App()`) with default exports
- **Semicolons**: None (Prettier `semi: false`)
- **Quotes**: Single quotes (Prettier `singleQuote: true`)
- **Trailing commas**: All (Prettier `trailingComma: "all"`)
- **Print width**: 80 characters
- **Tab width**: 2 spaces

### Linter/Formatter

- **ESLint**: Flat config (`eslint.config.js`) with `@eslint/js` recommended, `typescript-eslint` recommended, `react-hooks` recommended, `react-refresh` vite config, and `eslint-config-prettier`
- **Prettier**: Configured via `.prettierrc`; ignores `dist`, `node_modules`, `package-lock.json`
- **Pre-commit hook** (Husky): Runs `prettier --check .` and `npm run lint` before every commit

### TypeScript Configuration

- **Target**: ES2023
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx
- **Strict mode**: Enabled (`strict: true`)
- **Additional checks**: `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`
- **verbatimModuleSyntax**: Enabled (requires explicit `type` keyword for type imports)
- **Project references**: Split config — `tsconfig.app.json` (src) and `tsconfig.node.json` (vite.config.ts)

## Architectural Patterns

- **Structure**: Single-page application (SPA) with React + BrowserRouter. Currently a minimal Vite scaffold — one component (`App.tsx`) with no route definitions.
- **State management**: Local component state via `useState`. No global state library.
- **Data fetching**: None currently implemented.
- **Error handling**: None currently implemented.
- **Styling approach**: CSS files imported into components. `src/index.css` provides global styles and CSS custom properties. `src/App.css` provides component-specific styles. CSS uses native nesting (`&` syntax). No Tailwind utility classes are used in components yet.

### Current CSS Architecture (Important)

**`src/index.css`** (113 lines):

- Defines CSS custom properties for light mode on `:root` (lines 1-31): `--text`, `--text-h`, `--bg`, `--border`, `--code-bg`, `--accent`, `--accent-bg`, `--accent-border`, `--social-bg`, `--shadow`, `--sans`, `--heading`, `--mono`
- **Problematic structure**: `@import 'tailwindcss'` is nested INSIDE `@media (prefers-color-scheme: dark)` block (line 34) — this is incorrect and must be restructured
- Dark mode overrides via `@media (prefers-color-scheme: dark)` (lines 33-53)
- Global styles for `#root`, `body`, `h1`, `h2`, `p`, `code`, `.counter`
- Uses `color-scheme: light dark` (line 20)

**`src/App.css`** (184 lines):

- Component styles referencing old CSS custom properties (`--accent`, `--text-h`, `--border`, `--social-bg`, `--shadow`)
- Styles for: `.counter`, `.hero`, `#center`, `#next-steps`, `#docs`, `#spacer`, `.ticks`
- Uses native CSS nesting extensively
- Responsive breakpoints at `max-width: 1024px`

### TailwindCSS v4 Configuration

- Uses `@tailwindcss/vite` plugin (CSS-first configuration)
- **No `tailwind.config.js` file** — configuration is done via `@theme` directives in CSS
- **No `@theme` directives currently defined** — Tailwind is imported but not configured with custom tokens
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
- **Entry point**: `index.html` -> `src/main.tsx` -> `App.tsx`
- **Routing**: BrowserRouter wraps App but no routes are defined yet
- **Static assets**: SVG icons served from `public/icons.svg` (sprite), favicon at `public/favicon.svg`

## Prior Spec Decisions

### Spec: Nought Cobalt Design System (`spec/nought-cobalt-design-system.md`) — Status: Confirmed

Key architectural decisions that affect new development:

1. **DD-1: `--nc-*` CSS namespace** — All design tokens use the `--nc-` prefix (Nought Cobalt) to prevent collisions with third-party CSS or Tailwind internals.

2. **DD-2: Monochrome gray scale** — 12-step pure grayscale (saturation: 0) from `gray-950` (#0A0A0A) to `gray-50` (#F0F0F0). Anchored on `#0E0E0E` (background) and `#131313` (surface).

3. **DD-3: Cobalt blue accent scale** — 8-step scale centered on `#0057FF` (cobalt-600), from `cobalt-950` (#001433) to `cobalt-300` (#99BBFF).

4. **DD-4: Semantic color aliases** — `background`, `surface`, `surface-elevated`, `foreground`, `foreground-muted`, `foreground-heading`, `border`, `primary`, `primary-hover`, `primary-foreground`, `ring` mapped to gray/cobalt scales.

5. **DD-5: Typography scale** — Space Grotesk font, 12-level type scale from Display (56px) to Caption/Label (12px). Headings use bold/semibold, body uses regular weight.

6. **DD-6: Google Fonts import** for Space Grotesk (weights 400, 500, 600, 700) with preconnect in `index.html`.

7. **DD-7: CSS-first TailwindCSS v4 config** — `@theme` directive in `src/index.css`, no `tailwind.config.js`.

8. **DD-8: Default border radius** — Override to 4px globally.

9. **DD-9: Component base styles** — `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.card`, `.input`, `.badge` defined in `@layer components` using `@apply`.

10. **DD-10: Dark mode only** — Remove `color-scheme: light dark`, set `color-scheme: dark`. Remove all `prefers-color-scheme` media queries.

**Critical migration notes from the spec:**

- The `@import 'tailwindcss'` must be moved to the top level of `index.css` (currently incorrectly nested inside a dark mode media query)
- All existing CSS custom properties (`--text`, `--bg`, `--accent`, etc.) in `index.css` and `App.css` must be migrated to `--nc-*` tokens
- Light mode CSS must be fully removed, not layered on top

## Guardrails and Lessons Learned

No `generated/guardrails.md` file exists.
