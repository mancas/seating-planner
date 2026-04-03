interface Props {
  label: string
  isActive: boolean
  onClick?: () => void
}

function SidebarNavItem({ label, isActive, onClick }: Props) {
  const activeClasses = isActive
    ? 'text-primary bg-primary/10 border-l-2 border-l-primary'
    : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated border-l-2 border-l-transparent'

  return (
    <div
      onClick={onClick}
      className={`py-3 px-4 cursor-pointer transition-colors text-body-sm ${activeClasses}`}
    >
      {label}
    </div>
  )
}

export default SidebarNavItem
