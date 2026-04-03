import { LuMousePointer2, LuHand, LuCircle, LuSquare } from 'react-icons/lu'

export type CanvasTool = 'select' | 'pan' | 'add-circle' | 'add-rectangle'

interface Props {
  activeTool: CanvasTool
  onToolChange: (tool: CanvasTool) => void
}

const tools: { id: CanvasTool; icon: React.ReactNode; label: string }[] = [
  { id: 'select', icon: <LuMousePointer2 size={16} />, label: 'Select' },
  { id: 'pan', icon: <LuHand size={16} />, label: 'Pan' },
  { id: 'add-circle', icon: <LuCircle size={16} />, label: 'Add circle table' },
  {
    id: 'add-rectangle',
    icon: <LuSquare size={16} />,
    label: 'Add rectangle table',
  },
]

function CanvasToolbar({ activeTool, onToolChange }: Props) {
  return (
    <div className="bg-surface border border-border rounded p-1 flex gap-1">
      {tools.map((tool) => {
        const isActive = activeTool === tool.id
        return (
          <button
            key={tool.id}
            title={tool.label}
            onClick={() => onToolChange(tool.id)}
            className={`p-2 rounded cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated'
            }`}
          >
            {tool.icon}
          </button>
        )
      })}
    </div>
  )
}

export default CanvasToolbar
