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
}

function CanvasPropertiesPanel({ table, onUpdate, onDelete, onClose }: Props) {
  return (
    <aside className="hidden md:flex flex-col w-[320px] min-w-[320px] bg-surface border-l border-border h-full overflow-y-auto">
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
