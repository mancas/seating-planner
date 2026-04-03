# Task Report — TASK-007: Replace SVG in GuestRow

## Status: COMPLETE

## Files Modified

- `src/components/molecules/GuestRow.tsx`

## Implementation Details

### `src/components/molecules/GuestRow.tsx`

- **Added import**: `import { LuEllipsis } from 'react-icons/lu'` (line 1)
- **Replaced** inline SVG ellipsis icon (6-line `<svg>` block with three `<circle>` elements) with `<LuEllipsis size={16} />` (line 47)
- The `IconButton` wrapper with `label="Actions"` was preserved unchanged

## Conventions Followed

- No semicolons, single quotes, 2-space indent, trailing commas
- Third-party imports placed before local imports
- Consistent `size` prop usage matching the original SVG dimensions (16x16)
