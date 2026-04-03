# Task Report: TASK-002

## Task

Rewrite `src/index.css` — Tailwind import, design tokens, theme config, base styles, and component styles

## Status: COMPLETED

## Changes Made

### File: `src/index.css`

- **Completely rewrote** the file from 113 lines (old light/dark theme with legacy variables) to the new Nought Cobalt design system

### Structure (in order):

1. **Line 1**: `@import 'tailwindcss'` — top-level Tailwind v4 import
2. **Lines 3–55**: `@theme` block — Tailwind v4 CSS-first config with gray scale (12 steps), cobalt accent scale (8 steps), semantic color aliases, font families (`Space Grotesk` sans, monospace stack), and border radius tokens
3. **Lines 57–96**: `:root` block — NC design tokens (`--nc-*` prefixed) mirroring the theme values for use in component CSS, plus `color-scheme: dark`
4. **Lines 98–196**: Base element styles — `html` (font, color, background, rendering), `body`, headings (`h1`–`h6`), `p`, `code`, and `#root` container
5. **Lines 197–280**: Typography `@utility` classes — `text-display`, `text-heading-1` through `text-heading-5`, `text-body-lg`, `text-body`, `text-body-sm`, `text-caption`, `text-label`, `text-code`
6. **Lines 282–401**: `@layer components` — `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.card`, `.input`, `.badge`

## Acceptance Criteria Verification

| Criterion                                                                  | Status                      |
| -------------------------------------------------------------------------- | --------------------------- |
| `@import 'tailwindcss'` on line 1, top-level                               | PASS                        |
| No `@media (prefers-color-scheme: dark)` blocks                            | PASS                        |
| No old CSS variable names (`--text`, `--bg`, `--border`, `--accent`, etc.) | PASS                        |
| `:root` contains all `--nc-*` custom properties                            | PASS (20 raw + 11 semantic) |
| `:root` has `color-scheme: dark`                                           | PASS                        |
| `@theme` block defines all colors, fonts, and radii                        | PASS                        |
| Typography utilities defined via `@utility`                                | PASS (12 utilities)         |
| Component classes defined in `@layer components`                           | PASS (6 components)         |
| Base element styles present                                                | PASS                        |

## What Was Removed

- Old light theme variables (`--text`, `--bg`, `--border`, `--code-bg`, `--accent`, `--accent-bg`, `--accent-border`, `--social-bg`, `--shadow`)
- Old font variables (`--sans`, `--heading`, `--mono`)
- `@media (prefers-color-scheme: dark)` block (which incorrectly contained `@import 'tailwindcss'`)
- `#social .button-icon` dark mode filter rule
- `.counter` styles
