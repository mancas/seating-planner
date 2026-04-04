import { LuTriangleAlert } from 'react-icons/lu'

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
          <LuTriangleAlert size={24} className="text-red-400 shrink-0" />
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
          <button type="button" className="btn-destructive" onClick={onConfirm}>
            {confirmLabel ?? 'CONFIRM_DEL'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
