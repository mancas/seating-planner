interface Props {
  isEmpty: boolean
  initials?: string
  isSelected?: boolean
  isDropTarget?: boolean
  isSwapTarget?: boolean
  onClick?: (e: React.MouseEvent) => void
  onMobileTap?: (e: React.TouchEvent) => void
}

function SeatIndicator({
  isEmpty,
  initials,
  isSelected = false,
  isDropTarget = false,
  isSwapTarget = false,
  onClick,
  onMobileTap,
}: Props) {
  const base =
    'w-7 h-7 rounded-full cursor-pointer hover:ring-2 hover:ring-primary/50 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2'

  const variant = isEmpty
    ? 'bg-gray-700 border border-gray-600'
    : 'bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center'

  const selected = isSelected
    ? 'ring-2 ring-primary ring-offset-1 ring-offset-surface-elevated'
    : ''

  const dropTarget = isDropTarget
    ? 'ring-2 ring-primary ring-offset-1 ring-offset-surface-elevated scale-110 transition-transform'
    : ''

  const swapTarget = isSwapTarget
    ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-surface-elevated'
    : ''

  return (
    <button
      onClick={onClick}
      onTouchEnd={(e) => {
        if (onMobileTap) {
          e.preventDefault()
          onMobileTap(e)
        }
      }}
      aria-label={isEmpty ? 'Empty seat' : `Seat: ${initials}`}
      className={`${base} ${variant} ${selected} ${dropTarget} ${swapTarget}`}
    >
      {!isEmpty && initials}
    </button>
  )
}

export default SeatIndicator
