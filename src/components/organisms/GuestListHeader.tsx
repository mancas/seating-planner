import { LuSearch, LuX } from 'react-icons/lu'

interface Props {
  totalGuests: number
  filteredCount: number
  searchQuery: string
  onSearchChange: (value: string) => void
}

function GuestListHeader({
  totalGuests,
  filteredCount,
  searchQuery,
  onSearchChange,
}: Props) {
  const isFiltering = searchQuery.trim().length > 0

  return (
    <div className="px-4 md:px-6 py-4 md:py-6">
      {/* Desktop layout */}
      <div className="hidden md:block">
        <p className="text-label text-primary tracking-wider">
          REGISTRY.SYSTEM_V4
        </p>
        <div className="flex items-end justify-between gap-4 mt-1">
          <h1 className="text-heading-1 text-foreground-heading">GUEST_LIST</h1>
          <p className="text-caption text-foreground-muted pb-1">
            {isFiltering
              ? `${filteredCount} / ${totalGuests} MATCH`
              : `${totalGuests} ENTRIES`}
          </p>
        </div>
        <div className="mt-4 max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="SEARCH GUESTS..."
          />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        <p className="text-label text-primary tracking-wider">SYSTEM_LOG</p>
        <h1 className="text-heading-1 text-foreground-heading mt-1">
          GUEST LIST
        </h1>
        <p className="text-caption text-foreground-muted mt-1">
          {isFiltering
            ? `${filteredCount} / ${totalGuests} MATCH`
            : `${totalGuests} ENTRIES`}
        </p>
        <div className="mt-4">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="SEARCH GUESTS..."
          />
        </div>
      </div>
    </div>
  )
}

function SearchInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <div className="relative">
      <LuSearch
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none"
        aria-hidden
      />
      <input
        type="search"
        className="input w-full pl-9 pr-9"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search guests"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-foreground-muted hover:text-foreground"
          aria-label="Clear search"
        >
          <LuX size={14} />
        </button>
      )}
    </div>
  )
}

export default GuestListHeader
