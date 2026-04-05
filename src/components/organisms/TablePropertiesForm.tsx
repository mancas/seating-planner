import { useState } from 'react'
import type { FloorTable, TableShape } from '../../data/table-types'
import ShapeToggle from '../atoms/ShapeToggle'

interface Props {
  table: FloorTable
  onUpdate: (
    data: Partial<
      Pick<FloorTable, 'label' | 'shape' | 'seatCount' | 'rotation'>
    >,
  ) => void
  onDelete: () => void
}

function TablePropertiesForm({ table, onUpdate, onDelete }: Props) {
  // Local state for interactive inputs (so dragging sliders doesn't lag).
  // Parent passes key={table.id} so this component remounts when the
  // selected table changes, which resets local state automatically.
  const [label, setLabel] = useState(table.label)
  const [seatCount, setSeatCount] = useState(table.seatCount)
  const [rotation, setRotation] = useState(table.rotation)

  function handleLabelChange(value: string) {
    setLabel(value)
    onUpdate({ label: value })
  }

  function handleShapeChange(shape: TableShape) {
    onUpdate({ shape })
  }

  function handleSeatCountCommit(value: number) {
    onUpdate({ seatCount: value })
  }

  function handleRotationCommit(value: number) {
    onUpdate({ rotation: value })
  }

  return (
    <>
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
              {seatCount}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            value={seatCount}
            onChange={(e) => setSeatCount(Number(e.target.value))}
            onPointerUp={() => handleSeatCountCommit(seatCount)}
            className="w-full accent-(--nc-primary)"
          />
        </div>

        {/* Rotation */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-caption text-foreground-muted">ROTATION</span>
            <span className="text-body-sm text-foreground font-semibold">
              {rotation}°
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={359}
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            onPointerUp={() => handleRotationCommit(rotation)}
            className="w-full accent-(--nc-primary)"
          />
          <div className="flex gap-2 mt-2">
            {[0, 90, 180, 270].map((angle) => (
              <button
                key={angle}
                onClick={() => {
                  setRotation(angle)
                  handleRotationCommit(angle)
                }}
                className={`flex-1 px-2 py-1 text-caption rounded border cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 ${
                  rotation === angle
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

      {/* Actions — mt-auto pushes to bottom when inside a flex-col container */}
      <div className="px-4 py-4 mt-auto border-t border-border">
        <button
          className="btn-ghost w-full text-foreground-muted"
          onClick={onDelete}
        >
          DELETE ENTITY
        </button>
      </div>
    </>
  )
}

export default TablePropertiesForm
