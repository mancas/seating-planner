import type { ReactNode } from 'react'
import { LuUserPlus } from 'react-icons/lu'

interface Props {
  onClick?: () => void
  label: string
  icon?: ReactNode
}

function FAB({ onClick, label, icon }: Props) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="fixed bottom-20 right-4 z-50 md:hidden w-14 h-14 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground shadow-lg flex items-center justify-center cursor-pointer"
    >
      {icon ?? <LuUserPlus size={24} />}
    </button>
  )
}

export default FAB
