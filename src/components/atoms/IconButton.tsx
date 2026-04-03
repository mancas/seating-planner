import type { ReactNode } from 'react'

interface Props {
  onClick?: () => void
  label: string
  children: ReactNode
}

function IconButton({ onClick, label, children }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="p-2 rounded hover:bg-surface-elevated text-foreground-muted hover:text-foreground transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
    >
      {children}
    </button>
  )
}

export default IconButton
