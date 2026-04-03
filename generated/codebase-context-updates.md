# Codebase Context Updates

Updates to `generated/codebase-context.md` based on the validated Nought Cobalt Design System implementation.

---

## Sections to Update

### 1. Update "Current CSS Architecture" section

Replace the existing "Current CSS Architecture (Important)" section with:

```markdown
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
- Lines 98–195: Base element styles — `html`, `body`, `h1`–`h6`, `p`, `code`, `#root`
- Lines 197–280: Typography `@utility` classes — 12 utilities: `text-display`, `text-heading-1` through `text-heading-5`, `text-body-lg`, `text-body`, `text-body-sm`, `text-caption`, `text-label`, `text-code`
- Lines 282–402: `@layer components` — 6 component base styles: `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.card`, `.input`, `.badge`

**`src/App.css`** (190 lines):

- Component styles using `--nc-*` design tokens exclusively
- Styles for: `.counter`, `.hero`, `#center`, `#next-steps`, `#docs`, `#spacer`, `.ticks`
- Uses native CSS nesting extensively
- Responsive breakpoints at `max-width: 1024px`
- Dark mode icon filter applied unconditionally for `#social .button-icon`
```

### 2. Update "TailwindCSS v4 Configuration" section

Replace with:

```markdown
### TailwindCSS v4 Configuration

- Uses `@tailwindcss/vite` plugin (CSS-first configuration)
- **No `tailwind.config.js` file** — configuration is done via `@theme` directive in `src/index.css`
- `@theme` defines custom gray scale (overrides Tailwind defaults), cobalt accent scale, semantic aliases, font families, and border radii
- Custom typography utilities defined via `@utility` directive
- Component base styles defined in `@layer components`
- Vite config: `plugins: [react(), tailwindcss()]`
```

### 3. Update "Styling approach" in Architectural Patterns

Replace:

```
- **Styling approach**: CSS files imported into components. `src/index.css` provides global styles and CSS custom properties. `src/App.css` provides component-specific styles. CSS uses native nesting (`&` syntax). No Tailwind utility classes are used in components yet.
```

With:

```
- **Styling approach**: Nought Cobalt design system. `src/index.css` provides design tokens via `@theme` (Tailwind utilities) and `:root` (`--nc-*` CSS custom properties), base element styles, typography utilities, and component base styles. `src/App.css` provides component-specific styles using `--nc-*` tokens. CSS uses native nesting (`&` syntax). Tailwind utility classes are available via the `@theme` configuration.
```

### 4. Add to "Prior Spec Decisions"

Update the status line:

```
### Spec: Nought Cobalt Design System (`spec/nought-cobalt-design-system.md`) — Status: Implemented ✓
```

### 5. Update "Guardrails and Lessons Learned"

Replace:

```
No `generated/guardrails.md` file exists.
```

With:

```
See `generated/guardrails.md` for 10 guardrails established from the Nought Cobalt design system implementation, covering Tailwind v4 configuration patterns, CSS variable namespacing, dark mode policy, and migration safety practices.
```

### 6. Add to Key Dependencies table

```
| Space Grotesk (Google Fonts) | CDN | Primary typeface — loaded via `<link>` in `index.html` |
```
