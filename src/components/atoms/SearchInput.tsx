import { LuSearch } from 'react-icons/lu'

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
      <LuSearch size={16} className="text-foreground-muted" />
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
