# Task Report — TASK-003: Replace SVG in ConfirmDialog

## Status: COMPLETE

## Files Modified

- `src/components/molecules/ConfirmDialog.tsx`

## Changes Made

1. **Added import**: `import { LuTriangleAlert } from 'react-icons/lu'` at top of file
2. **Replaced inline SVG** (13-line `<svg>` block with `<path>` and `<line>` elements) with:
   ```tsx
   <LuTriangleAlert size={24} className="text-red-400 shrink-0" />
   ```

## Visual Parity

- `size={24}` matches the original `w-6 h-6` (24px)
- `text-red-400` color preserved exactly
- `shrink-0` flex behavior preserved exactly
- `LuTriangleAlert` renders the same warning triangle icon (Lucide icon set)

## Conventions Followed

- No semicolons
- Single quotes for imports
- 2-space indentation
- No trailing semicolons

## Net Impact

- Removed 13 lines of inline SVG markup
- Added 1 import line and 1 component line
- File reduced from 66 lines to 56 lines
