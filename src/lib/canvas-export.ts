import { toPng } from 'html-to-image'
import type { FloorTable } from '../data/table-types'
import {
  SEAT_RADIUS,
  getCircleTableDiameter,
  getRectTableSize,
} from '../data/table-types'

type Exporter = () => Promise<void>

let registered: Exporter | null = null
const listeners = new Set<(available: boolean) => void>()

function emit() {
  const available = registered !== null
  for (const fn of listeners) fn(available)
}

export function registerCanvasExporter(exporter: Exporter): () => void {
  registered = exporter
  emit()
  return () => {
    if (registered === exporter) {
      registered = null
      emit()
    }
  }
}

export function isCanvasExporterAvailable(): boolean {
  return registered !== null
}

export function subscribeCanvasExporter(
  listener: (available: boolean) => void,
): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export async function triggerCanvasExport(): Promise<void> {
  if (!registered) return
  await registered()
}

const CROP_PADDING = 56
// Seat circles (28px) overflow the table container, and guest name labels
// sit above the seat. Extend the per-table bbox so neither gets clipped.
const SEAT_OVERFLOW = 18
const LABEL_OVERFLOW = 20

interface BBox {
  x: number
  y: number
  w: number
  h: number
}

function getTableBBox(table: FloorTable): BBox {
  const inner =
    table.shape === 'circular'
      ? (() => {
          const d = getCircleTableDiameter(table.seatCount)
          return { width: d, height: d }
        })()
      : getRectTableSize(table.seatCount)

  const containerW = inner.width + SEAT_RADIUS * 2
  const containerH = inner.height + SEAT_RADIUS * 2

  const w = containerW + (SEAT_OVERFLOW + LABEL_OVERFLOW) * 2
  const h = containerH + (SEAT_OVERFLOW + LABEL_OVERFLOW) * 2
  const cx = table.x + containerW / 2
  const cy = table.y + containerH / 2

  const rad = (table.rotation * Math.PI) / 180
  const cos = Math.abs(Math.cos(rad))
  const sin = Math.abs(Math.sin(rad))
  const rotW = w * cos + h * sin
  const rotH = w * sin + h * cos

  return {
    x: cx - rotW / 2,
    y: cy - rotH / 2,
    w: rotW,
    h: rotH,
  }
}

function unionBBox(boxes: BBox[]): BBox {
  const minX = Math.min(...boxes.map((b) => b.x))
  const minY = Math.min(...boxes.map((b) => b.y))
  const maxX = Math.max(...boxes.map((b) => b.x + b.w))
  const maxY = Math.max(...boxes.map((b) => b.y + b.h))
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY }
}

function resolveBackgroundColor(): string {
  const styles = getComputedStyle(document.documentElement)
  const bg = styles.getPropertyValue('--color-background').trim()
  return bg || '#0e0e0e'
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function buildFilename(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`
  return `seating-plan-${stamp}.png`
}

export async function exportSeatingCanvas(
  node: HTMLElement,
  tables: FloorTable[],
): Promise<void> {
  if (tables.length === 0) return

  const boxes = tables.map(getTableBBox)
  const bbox = unionBBox(boxes)

  // Don't clamp to >= 0: tables may sit at negative canvas coordinates, and
  // the translate below shifts them into view. Clamping would crop them out.
  const cropX = Math.floor(bbox.x - CROP_PADDING)
  const cropY = Math.floor(bbox.y - CROP_PADDING)
  const cropW = Math.ceil(bbox.w + CROP_PADDING * 2)
  const cropH = Math.ceil(bbox.h + CROP_PADDING * 2)

  const dataUrl = await toPng(node, {
    width: cropW,
    height: cropH,
    backgroundColor: resolveBackgroundColor(),
    pixelRatio: 2,
    cacheBust: true,
    style: {
      transform: `translate(${-cropX}px, ${-cropY}px)`,
      transformOrigin: 'top left',
    },
  })

  downloadDataUrl(dataUrl, buildFilename())
}
