import type { Allergy, GuestStatus } from '../data/guest-types'
import { ALLERGIES } from '../data/guest-types'

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
  status: GuestStatus
  dietary: {
    type: string | null
    notes: string | null
  }
  allergies: Allergy[]
  gift: number | null
  secretMission: boolean
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
  status: 'status',
  dietarytype: 'dietaryType',
  dietarynotes: 'dietaryNotes',
  allergies: 'allergies',
  gift: 'gift',
  secretmission: 'secretMission',
}

const TRUTHY_VALUES: readonly string[] = ['true', '1', 'yes', 'y']
const FALSY_VALUES: readonly string[] = ['false', '0', 'no', 'n', '']

export function generateTemplate(): string {
  return 'firstName,lastName,status,dietaryType,dietaryNotes,allergies,gift,secretMission\nJane,Doe,CONFIRMED,VEGAN,Severe nut allergy,LACTOSE|SOY,250,true\n'
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
    const dietaryType = (row['dietaryType'] ?? '').trim()
    const dietaryNotes = (row['dietaryNotes'] ?? '').trim()
    const allergiesRaw = (row['allergies'] ?? '').trim()
    const secretMissionRaw = (row['secretMission'] ?? '').trim().toLowerCase()

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

    const allergies: Allergy[] = []
    if (allergiesRaw !== '') {
      const tokens = allergiesRaw
        .split('|')
        .map((t) => t.trim().toUpperCase())
        .filter((t) => t !== '')
      const invalid: string[] = []
      for (const token of tokens) {
        if ((ALLERGIES as readonly string[]).includes(token)) {
          if (!allergies.includes(token as Allergy)) {
            allergies.push(token as Allergy)
          }
        } else {
          invalid.push(token)
        }
      }
      if (invalid.length > 0) {
        errors.push({
          row: rowNum,
          field: 'allergies',
          message: `INVALID_VALUE // ALLERGIES must be pipe-separated from: ${ALLERGIES.join(', ')}`,
        })
      }
    }

    let secretMission = false
    if (TRUTHY_VALUES.includes(secretMissionRaw)) {
      secretMission = true
    } else if (!FALSY_VALUES.includes(secretMissionRaw)) {
      errors.push({
        row: rowNum,
        field: 'secretMission',
        message:
          'INVALID_VALUE // SECRET_MISSION must be true/false (or yes/no, 1/0)',
      })
    }

    guests.push({
      firstName,
      lastName,
      status,
      dietary: {
        type: dietaryType === '' ? null : dietaryType,
        notes: dietaryNotes === '' ? null : dietaryNotes,
      },
      allergies,
      gift,
      secretMission,
    })
  }

  if (errors.length > 0) {
    return { valid: false, errors, guests: [] }
  }

  return { valid: true, errors: [], guests }
}
