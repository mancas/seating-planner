# Task Report — TASK-003: Molecule Components

## Status: COMPLETE

## Files Created

- `src/components/molecules/GuestRow.tsx`
- `src/components/molecules/SidebarNavItem.tsx`
- `src/components/molecules/GuestDetailSection.tsx`
- `src/components/molecules/TableGroupHeader.tsx`

## Implementation Details

### GuestRow.tsx

- **Props**: `{ guest: Guest, isSelected: boolean, onClick: () => void }`
- **Desktop layout** (`hidden md:grid`): 4-column grid with Avatar + name/ID, StatusBadge, table assignment (or "- - -" when null), and IconButton with ellipsis dots
- **Mobile layout** (`md:hidden flex`): seat number (zero-padded 2-digit), name as `FIRST_LAST` uppercase bold, role below in muted caption, StatusIcon on right
- **Selected state**: `border-l-2 border-l-primary bg-surface-elevated` on both layouts
- **Not selected**: `border-l-2 border-l-transparent`
- **Hover**: `hover:bg-gray-800/50`, cursor pointer, full row clickable via wrapper div
- Uses atoms: Avatar (sm), StatusBadge, StatusIcon, IconButton

### SidebarNavItem.tsx

- **Props**: `{ label: string, isActive: boolean, onClick?: () => void }`
- **Active**: `text-primary bg-primary/10 border-l-2 border-l-primary`
- **Inactive**: `text-foreground-muted hover:text-foreground hover:bg-surface-elevated border-l-2 border-l-transparent`
- Base: `py-3 px-4 cursor-pointer transition-colors text-body-sm`

### GuestDetailSection.tsx

- **Props**: `{ title: string, children: ReactNode }`
- Title: `text-label text-foreground-muted uppercase tracking-wider`
- Content wrapper: `border-t border-border pt-4 mt-4` with `mt-3` for children spacing

### TableGroupHeader.tsx

- **Props**: `{ location: string, tableName: string, seatCount: number, totalSeats: number }`
- Mobile only (`md:hidden`)
- Location: `text-label text-primary tracking-wider uppercase`
- Row: table name in `text-heading-4 text-foreground-heading` left, seats `text-caption text-foreground-muted` right
- Bottom separator: `border-b border-border mt-2 mb-2`

## Conventions Followed

- No semicolons
- Single quotes for imports
- 2-space indentation
- `import type { Guest } from '../../data/mock-guests'` (relative paths)
- Function declarations (not arrow functions)
- Default exports
- No barrel/index files

## Verification

- TypeScript compilation: zero errors
- No LSP diagnostics on any molecule file
