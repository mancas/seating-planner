import { LuMinus, LuPlus, LuRefreshCw } from 'react-icons/lu'

interface Props {
  zoom?: number // scale factor, e.g. 1.5 for 150%
  onZoomIn?: () => void
  onZoomOut?: () => void
  onZoomReset?: () => void
}

function CanvasStatusBar({ zoom, onZoomIn, onZoomOut, onZoomReset }: Props) {
  const showControls = Boolean(onZoomIn || onZoomOut || onZoomReset)

  return (
    <div className="text-label text-foreground-muted tracking-wider flex items-center gap-2">
      {showControls && (
        <div className="bg-surface border border-border rounded p-0.5 flex items-center gap-0.5">
          <button
            type="button"
            title="Zoom out"
            aria-label="Zoom out"
            onClick={onZoomOut}
            className="p-1 rounded cursor-pointer text-foreground-muted hover:text-foreground hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
          >
            <LuMinus size={14} />
          </button>
          <button
            type="button"
            title="Reset zoom"
            aria-label="Reset zoom"
            onClick={onZoomReset}
            className="p-1 rounded cursor-pointer text-foreground-muted hover:text-foreground hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
          >
            <LuRefreshCw size={14} />
          </button>
          <button
            type="button"
            title="Zoom in"
            aria-label="Zoom in"
            onClick={onZoomIn}
            className="p-1 rounded cursor-pointer text-foreground-muted hover:text-foreground hover:bg-surface-elevated focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
          >
            <LuPlus size={14} />
          </button>
        </div>
      )}
      <span>ZOOM: {Math.round((zoom ?? 1) * 100)}%</span>
      <span>|</span>
      <span>LAYER: FLOOR_PLAN_MAIN</span>
    </div>
  )
}

export default CanvasStatusBar
