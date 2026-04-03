interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function SearchInput({
  value,
  onChange,
  placeholder = 'SEARCH_DATABASE',
}: Props) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded bg-surface-elevated border border-border">
      <svg
        className="text-foreground-muted"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        className="input border-none bg-transparent p-0 w-full"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

export default SearchInput
