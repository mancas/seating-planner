interface Props {
  label: string
  isActive: boolean
  onClick: () => void
}

function NavLink({ label, isActive, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`text-label tracking-wider uppercase cursor-pointer ${
        isActive
          ? 'text-foreground-heading border-b-2 border-b-primary pb-1'
          : 'text-foreground-muted hover:text-foreground pb-1 border-b-2 border-b-transparent'
      }`}
    >
      {label}
    </button>
  )
}

export default NavLink
