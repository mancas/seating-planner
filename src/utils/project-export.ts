import type { Guest } from '../data/guest-types'
import type { FloorTable } from '../data/table-types'

export interface ProjectExport {
  version: number
  exportedAt: string
  data: {
    guests: Guest[]
    tables: FloorTable[]
    tableCounter: number
  }
}

export function generateProjectExport(): string {
  const guestsRaw = localStorage.getItem('seating-plan:guests')
  const tablesRaw = localStorage.getItem('seating-plan:tables')
  const counterRaw = localStorage.getItem('seating-plan:table-counter')

  const guests: Guest[] = guestsRaw ? JSON.parse(guestsRaw) : []
  const tables: FloorTable[] = tablesRaw ? JSON.parse(tablesRaw) : []
  const tableCounter: number = counterRaw ? JSON.parse(counterRaw) : 0

  const exportData: ProjectExport = {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      guests,
      tables,
      tableCounter,
    },
  }

  return JSON.stringify(exportData, null, 2)
}

export function validateProjectImport(content: string): ProjectExport | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(content)
  } catch {
    return null
  }

  if (typeof parsed !== 'object' || parsed === null) return null

  const obj = parsed as Record<string, unknown>

  if (obj.version !== 1) return null

  if (typeof obj.data !== 'object' || obj.data === null) return null

  const data = obj.data as Record<string, unknown>

  if (!Array.isArray(data.guests)) return null
  if (!Array.isArray(data.tables)) return null
  if (typeof data.tableCounter !== 'number') return null

  return parsed as ProjectExport
}

export function applyProjectImport(data: ProjectExport): void {
  localStorage.setItem('seating-plan:guests', JSON.stringify(data.data.guests))
  localStorage.setItem('seating-plan:tables', JSON.stringify(data.data.tables))
  localStorage.setItem(
    'seating-plan:table-counter',
    JSON.stringify(data.data.tableCounter),
  )
}

export function downloadProjectExport(): void {
  const json = generateProjectExport()
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const filename = `seating-plan-${new Date().toISOString().slice(0, 10)}.json`

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
