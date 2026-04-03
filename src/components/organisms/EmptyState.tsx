interface Props {
  onAddGuest: () => void
}

function EmptyState({ onAddGuest }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-4">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        className="text-foreground-muted mb-4"
      >
        <path
          d="M20 2L38 20L20 38L2 20L20 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
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
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 1V13M1 7H13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        NEW_ENTRY
      </button>
    </div>
  )
}

export default EmptyState
