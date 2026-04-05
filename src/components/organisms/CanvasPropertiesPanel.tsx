import { LuX } from 'react-icons/lu'
import type { FloorTable, TableShape } from '../../data/table-types'
import IconButton from '../atoms/IconButton'
import TablePropertiesForm from './TablePropertiesForm'

interface Props {
  table: FloorTable
  onUpdate: (data: {
    label?: string
    shape?: TableShape
    seatCount?: number
    rotation?: number
  }) => void
  onDelete: () => void
  onClose: () => void
  isClosing?: boolean
  onAnimationEnd?: () => void
}

function CanvasPropertiesPanel({
  table,
  onUpdate,
  onDelete,
  onClose,
  isClosing,
  onAnimationEnd,
}: Props) {
  return (
    <aside
      className={`hidden md:flex flex-col fixed top-[var(--nc-topnav-height)] right-0 bottom-0 z-40 w-[320px] bg-surface border-l border-border overflow-y-auto shadow-xl ${isClosing ? 'md:animate-slide-out-right' : 'md:animate-slide-in-right'}`}
      onAnimationEnd={(e) => {
        if (e.animationName === 'slideOutRight' && onAnimationEnd) {
          onAnimationEnd()
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-label text-foreground-muted tracking-wider uppercase">
          PROPERTIES
        </span>
        <IconButton onClick={onClose} label="Close properties">
          <LuX size={20} />
        </IconButton>
      </div>

      <TablePropertiesForm
        key={table.id}
        table={table}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </aside>
  )
}

export default CanvasPropertiesPanel
