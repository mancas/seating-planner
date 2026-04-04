import type { GuestStatus } from '../data/guest-types'

export interface ParsedRow {
  [key: string]: string
}

export interface ImportError {
  row: number
  field: string
  message: string
}

export interface GuestImportData {
  firstName: string
  lastName: string
  role: string
  status: GuestStatus
  dietary: {
    type: string | null
    notes: string | null
  }
  gift: number | null
}

export interface ValidationResult {
  valid: boolean
  errors: ImportError[]
  guests: GuestImportData[]
}

const VALID_STATUSES: readonly string[] = ['CONFIRMED', 'PENDING', 'DECLINED']

const EXPECTED_HEADERS: Record<string, string> = {
  firstname: 'firstName',
  lastname: 'lastName',
  role: 'role',
  status: 'status',
  dietarytype: 'dietaryType',
  dietarynotes: 'dietaryNotes',
  gift: 'gift',
}

export function generateTemplate(): string {
  return 'firstName,lastName,role,status,dietaryType,dietaryNotes,gift\nJane,Doe,PRIORITY VIP,CONFIRMED,VEGAN,Severe nut allergy,250\n'
}

function splitCSVLine(line: string): string[] {
  const fields: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        fields.push(current)
        current = ''
      } else {
        current += char
      }
    }
  }

  fields.push(current)
  return fields
}

export function parseCSV(content: string): {
  headers: string[]
  rows: ParsedRow[]
} {
  const normalized = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalized.split('\n')

  // Remove trailing empty line
  if (lines.length > 0 && lines[lines.length - 1] === '') {
    lines.pop()
  }

  if (lines.length === 0) {
    return { headers: [], rows: [] }
  }

  const rawHeaders = splitCSVLine(lines[0]).map((h) => h.trim())

  // Normalize headers to expected names (case-insensitive)
  const headers = rawHeaders.map((h) => {
    const lower = h.toLowerCase()
    return EXPECTED_HEADERS[lower] ?? h
  })

  const rows: ParsedRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = splitCSVLine(lines[i])
    const row: ParsedRow = {}

    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = (values[j] ?? '').trim()
    }

    rows.push(row)
  }

  return { headers, rows }
}

export function validateGuestRows(
  rows: ParsedRow[],
  headers: string[],
): ValidationResult {
  const errors: ImportError[] = []

  // Check required headers
  const lowerHeaders = headers.map((h) => h.toLowerCase())
  const hasFirstName = lowerHeaders.includes('firstname')
  const hasLastName = lowerHeaders.includes('lastname')

  if (!hasFirstName || !hasLastName) {
    return {
      valid: false,
      errors: [
        {
          row: 0,
          field: 'headers',
          message:
            'INVALID_HEADERS // REQUIRED COLUMNS MISSING: firstName, lastName',
        },
      ],
      guests: [],
    }
  }

  // Check empty dataset
  if (rows.length === 0) {
    return {
      valid: false,
      errors: [
        {
          row: 0,
          field: 'dataset',
          message: 'EMPTY_DATASET // CSV CONTAINS NO GUEST RECORDS',
        },
      ],
      guests: [],
    }
  }

  const guests: GuestImportData[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const rowNum = i + 1

    const firstName = (row['firstName'] ?? '').trim()
    const lastName = (row['lastName'] ?? '').trim()
    const statusRaw = (row['status'] ?? '').trim()
    const giftRaw = (row['gift'] ?? '').trim()
    const role = (row['role'] ?? '').trim()
    const dietaryType = (row['dietaryType'] ?? '').trim()
    const dietaryNotes = (row['dietaryNotes'] ?? '').trim()

    if (firstName === '') {
      errors.push({
        row: rowNum,
        field: 'firstName',
        message: 'REQUIRED_FIELD // firstName CANNOT BE EMPTY',
      })
    }

    if (lastName === '') {
      errors.push({
        row: rowNum,
        field: 'lastName',
        message: 'REQUIRED_FIELD // lastName CANNOT BE EMPTY',
      })
    }

    let status: GuestStatus = 'PENDING'
    if (statusRaw !== '') {
      const statusUpper = statusRaw.toUpperCase()
      if (VALID_STATUSES.includes(statusUpper)) {
        status = statusUpper as GuestStatus
      } else {
        errors.push({
          row: rowNum,
          field: 'status',
          message:
            'INVALID_VALUE // STATUS must be CONFIRMED, PENDING, or DECLINED',
        })
      }
    }

    let gift: number | null = null
    if (giftRaw !== '') {
      const parsed = Number(giftRaw)
      if (isNaN(parsed)) {
        errors.push({
          row: rowNum,
          field: 'gift',
          message: 'INVALID_VALUE // GIFT must be a numeric value',
        })
      } else {
        gift = parsed
      }
    }

    guests.push({
      firstName,
      lastName,
      role,
      status,
      dietary: {
        type: dietaryType === '' ? null : dietaryType,
        notes: dietaryNotes === '' ? null : dietaryNotes,
      },
      gift,
    })
  }

  if (errors.length > 0) {
    return { valid: false, errors, guests: [] }
  }

  return { valid: true, errors: [], guests }
}
