import { useState } from 'react'
import { Drawer } from 'vaul'
import { LuX } from 'react-icons/lu'
import type { FloorTable, TableShape } from '../../data/table-types'
import IconButton from '../atoms/IconButton'
import ShapeToggle from '../atoms/ShapeToggle'

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
  const [label, setLabel] = useState(table.label)
  const [prevTableId, setPrevTableId] = useState(table.id)
  if (table.id !== prevTableId) {
    setPrevTableId(table.id)
    setLabel(table.label)
  }

  function handleLabelChange(value: string) {
    setLabel(value)
    onUpdate({ label: value })
  }

  function handleShapeChange(shape: TableShape) {
    onUpdate({ shape })
  }

  function handleSeatCountChange(seatCount: number) {
    onUpdate({ seatCount })
  }

  function handleRotationChange(rotation: number) {
    onUpdate({ rotation })
  }

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
            {/* INFORMATION section */}
            <div className="px-4 pt-4 pb-2">
              <p className="text-label text-foreground-muted tracking-wider mb-3">
                INFORMATION
              </p>
              <label className="block mb-3">
                <span className="text-caption text-foreground-muted block mb-1">
                  LABEL
                </span>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  className="input w-full"
                />
              </label>
              <div className="flex items-center justify-between mb-1">
                <span className="text-caption text-foreground-muted">
                  REFERENCE_ID
                </span>
                <span className="badge">{table.badgeId}</span>
              </div>
            </div>

            {/* CONFIGURATION section */}
            <div className="px-4 pt-4 pb-2">
              <p className="text-label text-foreground-muted tracking-wider mb-3">
                CONFIGURATION
              </p>

              {/* Shape */}
              <div className="mb-4">
                <span className="text-caption text-foreground-muted block mb-1">
                  SHAPE
                </span>
                <ShapeToggle value={table.shape} onChange={handleShapeChange} />
              </div>

              {/* Seat count */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-caption text-foreground-muted">
                    SEAT_COUNT
                  </span>
                  <span className="text-body-sm text-foreground font-semibold">
                    {table.seatCount}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={table.seatCount}
                  onChange={(e) =>
                    handleSeatCountChange(Number(e.target.value))
                  }
                  className="w-full accent-[var(--nc-primary)]"
                />
              </div>

              {/* Rotation */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-caption text-foreground-muted">
                    ROTATION
                  </span>
                  <span className="text-body-sm text-foreground font-semibold">
                    {table.rotation}°
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={359}
                  value={table.rotation}
                  onChange={(e) => handleRotationChange(Number(e.target.value))}
                  className="w-full accent-[var(--nc-primary)]"
                />
                <div className="flex gap-2 mt-2">
                  {[0, 90, 180, 270].map((angle) => (
                    <button
                      key={angle}
                      onClick={() => handleRotationChange(angle)}
                      className={`flex-1 px-2 py-1 text-caption rounded border cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 ${
                        table.rotation === angle
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-surface-elevated text-foreground-muted hover:text-foreground'
                      }`}
                    >
                      {angle}°
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-4 py-4 border-t border-border">
              <button
                className="btn-ghost w-full text-foreground-muted"
                onClick={onDelete}
              >
                DELETE ENTITY
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default MobilePropertiesSheet
