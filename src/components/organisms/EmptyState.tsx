import { LuDiamond, LuPlus } from 'react-icons/lu'

interface Props {
  onAddGuest: () => void
}

function EmptyState({ onAddGuest }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
      <LuDiamond size={40} className="text-foreground-muted mb-4" />
      <h3 className="text-heading-4 text-foreground-heading">
        NO_RECORDS // INITIALIZE_DB
      </h3>
      <p className="text-body-sm text-foreground-muted mt-2 text-center">
        Begin population sequence to activate guest matrix
      </p>
      <button
        className="btn-primary mt-6 flex items-center gap-2"
        onClick={onAddGuest}
      >
        <LuPlus size={14} />
        NEW_ENTRY
      </button>
    </div>
  )
}

export default EmptyState
