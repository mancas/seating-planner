interface Props {
  zoom?: number // scale factor, e.g. 1.5 for 150%
}

function CanvasStatusBar({ zoom }: Props) {
  return (
    <div className="text-label text-foreground-muted tracking-wider flex items-center gap-2">
      <span>ZOOM: {Math.round((zoom ?? 1) * 100)}%</span>
      <span>|</span>
      <span>LAYER: FLOOR_PLAN_MAIN</span>
    </div>
  )
}

export default CanvasStatusBar
