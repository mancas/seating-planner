import type { ReactNode } from 'react'

interface Props {
  icon: ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}

function TabBarItem({ icon, label, isActive, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center cursor-pointer gap-0.5"
    >
      <span
        className={
          isActive
            ? 'bg-primary text-primary-foreground rounded-lg px-3 py-1'
            : 'text-foreground-muted'
        }
      >
        {icon}
      </span>
      <span
        className={`text-caption mt-1 ${isActive ? 'text-primary' : 'text-foreground-muted'}`}
      >
        {label}
      </span>
    </button>
  )
}

export default TabBarItem
