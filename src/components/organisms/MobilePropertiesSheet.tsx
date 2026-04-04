import { Drawer } from 'vaul'
import { LuX } from 'react-icons/lu'
import type { FloorTable } from '../../data/table-types'
import IconButton from '../atoms/IconButton'
import TablePropertiesForm from './TablePropertiesForm'

interface Props {
  table: FloorTable
  onUpdate: (
    data: Partial<
      Pick<FloorTable, 'label' | 'shape' | 'seatCount' | 'rotation'>
    >,
  ) => void
  onDelete: () => void
  onClose: () => void
}

function MobilePropertiesSheet({ table, onUpdate, onDelete, onClose }: Props) {
  return (
    <Drawer.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl border-t border-border max-h-[60vh] flex flex-col outline-none">
          <Drawer.Handle className="bg-gray-600 my-3" />
          <Drawer.Title className="sr-only">Table Properties</Drawer.Title>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3 border-b border-border shrink-0">
            <span className="text-label text-foreground-muted tracking-wider uppercase">
              PROPERTIES
            </span>
            <IconButton onClick={onClose} label="Close properties">
              <LuX size={20} />
            </IconButton>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1" data-vaul-no-drag>
            <TablePropertiesForm
              key={table.id}
              table={table}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default MobilePropertiesSheet
