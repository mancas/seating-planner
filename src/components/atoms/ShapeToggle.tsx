import type { TableShape } from '../../data/table-types'

interface Props {
  value: TableShape
  onChange: (shape: TableShape) => void
}

const shapes: TableShape[] = ['rectangular', 'circular']

function ShapeToggle({ value, onChange }: Props) {
  return (
    <div className="flex rounded overflow-hidden border border-border">
      {shapes.map((shape) => (
        <button
          key={shape}
          onClick={() => onChange(shape)}
          className={`flex-1 px-3 py-2 text-label tracking-wider cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 ${
            shape === value
              ? 'bg-primary text-primary-foreground'
              : 'bg-surface-elevated text-foreground-muted hover:text-foreground'
          }`}
        >
          {shape.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default ShapeToggle
