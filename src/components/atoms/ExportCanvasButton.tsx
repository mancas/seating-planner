import { useEffect, useState } from 'react'
import { LuDownload, LuLoader } from 'react-icons/lu'
import {
  isCanvasExporterAvailable,
  subscribeCanvasExporter,
  triggerCanvasExport,
} from '../../lib/canvas-export'

function ExportCanvasButton() {
  const [available, setAvailable] = useState(isCanvasExporterAvailable)
  const [busy, setBusy] = useState(false)

  useEffect(() => subscribeCanvasExporter(setAvailable), [])

  if (!available) return null

  async function handleClick() {
    if (busy) return
    setBusy(true)
    try {
      await triggerCanvasExport()
    } catch (err) {
      console.error('Canvas export failed', err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label="Download seating plan as image"
      title="Download seating plan as image"
      className="p-2 rounded hover:bg-surface-elevated text-foreground-muted hover:text-foreground transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60"
    >
      {busy ? (
        <LuLoader size={16} className="animate-spin" />
      ) : (
        <LuDownload size={16} />
      )}
    </button>
  )
}

export default ExportCanvasButton
