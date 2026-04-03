interface Props {
  title: string
  targetName: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({
  title,
  targetName,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="bg-surface border border-border rounded max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-6 text-red-400 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <h2 className="text-heading-5 text-foreground-heading">{title}</h2>
        </div>
        <p className="text-body-sm text-foreground mt-2">
          TARGET: {targetName}
        </p>
        <p className="text-body-sm text-foreground-muted mt-3">{message}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            {cancelLabel ?? 'CANCEL'}
          </button>
          <button
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded font-semibold text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
            onClick={onConfirm}
          >
            {confirmLabel ?? 'CONFIRM_DEL'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
