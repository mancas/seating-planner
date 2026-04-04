import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { LuDownload, LuTriangleAlert, LuCircleCheck } from 'react-icons/lu'
import {
  generateTemplate,
  parseCSV,
  validateGuestRows,
} from '../../utils/csv-import'
import type { ImportError } from '../../utils/csv-import'
import { addGuest } from '../../data/guest-store'
import FileDropZone from '../molecules/FileDropZone'

interface Props {
  onImportComplete: () => void
}

type ImportState =
  | { phase: 'idle' }
  | {
      phase: 'error'
      fileName: string
      errors: ImportError[]
      fileError?: string
    }
  | { phase: 'success'; count: number }

function ImportGuestsPage({ onImportComplete }: Props) {
  const navigate = useNavigate()
  const [importState, setImportState] = useState<ImportState>({ phase: 'idle' })
  const [selectedFileName, setSelectedFileName] = useState<string | undefined>(
    undefined,
  )

  const handleDownloadTemplate = useCallback(() => {
    const csv = generateTemplate()
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'guest-template.csv'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  const handleFileSelect = useCallback(
    (file: File) => {
      setSelectedFileName(file.name)
      setImportState({ phase: 'idle' })

      if (file.size === 0) {
        setImportState({
          phase: 'error',
          fileName: file.name,
          errors: [],
          fileError: 'EMPTY_FILE // NO DATA DETECTED',
        })
        return
      }

      if (!file.name.toLowerCase().endsWith('.csv')) {
        setImportState({
          phase: 'error',
          fileName: file.name,
          errors: [],
          fileError: 'INVALID_FORMAT // ONLY .CSV FILES ACCEPTED',
        })
        return
      }

      file
        .text()
        .then((content) => {
          const { headers, rows } = parseCSV(content)
          const result = validateGuestRows(rows, headers)

          if (!result.valid) {
            setImportState({
              phase: 'error',
              fileName: file.name,
              errors: result.errors,
            })
            return
          }

          for (const guest of result.guests) {
            addGuest({
              firstName: guest.firstName,
              lastName: guest.lastName,
              status: guest.status,
              accessLevel: '',
              tableAssignment: null,
              seatNumber: null,
              gift: guest.gift,
              dietary: guest.dietary,
              logistics: {
                shuttleRequired: false,
                shuttleFrom: null,
                lodgingBooked: false,
                lodgingVenue: null,
              },
            })
          }

          onImportComplete()
          setImportState({ phase: 'success', count: result.guests.length })
        })
        .catch(() => {
          setImportState({
            phase: 'error',
            fileName: file.name,
            errors: [],
            fileError: 'READ_ERROR // FAILED TO READ FILE CONTENTS',
          })
        })
    },
    [onImportComplete],
  )

  const handleReset = useCallback(() => {
    setImportState({ phase: 'idle' })
    setSelectedFileName(undefined)
  }, [])

  return (
    <div className="px-4 md:px-6 py-4 md:py-6 max-w-2xl mx-auto">
      {/* Page header */}
      <p className="text-label text-primary tracking-wider">
        BATCH_IMPORT // GUEST_REGISTRY
      </p>
      <h1 className="text-heading-3 text-foreground-heading mt-1">
        IMPORT_GUEST_DATA
      </h1>
      <p className="text-body-sm text-foreground-muted mt-2">
        Upload a CSV file to batch-import guest records into the registry.
      </p>

      {importState.phase === 'success' ? (
        <div className="mt-8 bg-primary/5 border border-primary/30 rounded p-6 flex flex-col items-center gap-3">
          <LuCircleCheck size={32} className="text-primary" />
          <h2 className="text-heading-4 text-primary">IMPORT_COMPLETE</h2>
          <p className="text-heading-5 text-foreground-heading">
            {importState.count} GUESTS ADDED TO DATABASE
          </p>
          <button
            type="button"
            className="btn-primary mt-2"
            onClick={() => navigate('/', { replace: true })}
          >
            VIEW_GUEST_LIST
          </button>
        </div>
      ) : (
        <>
          {/* Step 1: Download Template */}
          <div className="mt-8 border border-border rounded p-4 md:p-6">
            <h2 className="text-heading-5 text-foreground-heading">
              STEP_01 // DOWNLOAD_TEMPLATE
            </h2>
            <p className="text-body-sm text-foreground-muted mt-2">
              Download the CSV template, fill in guest data, then upload.
            </p>
            <p className="text-caption text-foreground-muted mt-3">
              Columns: firstName, lastName, status, dietaryType, dietaryNotes,
              gift
            </p>
            <button
              type="button"
              className="btn-secondary mt-4 flex items-center gap-2"
              onClick={handleDownloadTemplate}
            >
              <LuDownload size={14} />
              DOWNLOAD_TEMPLATE
            </button>
          </div>

          {/* Step 2: Upload File */}
          <div className="mt-4 border border-border rounded p-4 md:p-6">
            <h2 className="text-heading-5 text-foreground-heading">
              STEP_02 // UPLOAD_GUEST_DATA
            </h2>
            <div className="mt-4">
              <FileDropZone
                onFileSelect={handleFileSelect}
                accept=".csv"
                selectedFileName={selectedFileName}
                hasError={importState.phase === 'error'}
                onReset={handleReset}
              />
            </div>
            <p className="text-caption text-foreground-muted mt-2">
              Accepted format: .csv
            </p>
          </div>

          {/* Error display */}
          {importState.phase === 'error' && importState.fileError && (
            <div className="mt-4 bg-red-500/5 border border-red-500/30 rounded p-4">
              <p className="text-body-sm text-red-400 font-semibold">
                {importState.fileError}
              </p>
            </div>
          )}

          {importState.phase === 'error' && importState.errors.length > 0 && (
            <div className="mt-4 bg-red-500/5 border border-red-500/30 rounded p-4">
              <div className="flex items-center gap-2">
                <LuTriangleAlert size={18} className="text-red-400 shrink-0" />
                <h3 className="text-body-sm text-red-400 font-semibold">
                  VALIDATION_FAILED
                </h3>
              </div>
              <p className="text-body-sm text-foreground-muted mb-3">
                {importState.errors.length} ERRORS DETECTED // IMPORT REJECTED
              </p>
              <ul className="space-y-1">
                {importState.errors
                  .filter((err) => err.row === 0)
                  .map((err, i) => (
                    <li key={`file-${i}`} className="text-body-sm">
                      <span className="text-red-400 font-semibold">
                        {err.message.split(' // ')[0]}
                      </span>
                      <span className="text-foreground-muted">
                        {' // '}
                        {err.message.split(' // ').slice(1).join(' // ')}
                      </span>
                    </li>
                  ))}
                {importState.errors
                  .filter((err) => err.row > 0)
                  .map((err, i) => (
                    <li key={i} className="text-body-sm">
                      <span className="text-red-400 font-semibold">
                        ROW {err.row}: {err.message.split(' // ')[0]}
                      </span>
                      <span className="text-foreground-muted">
                        {' // '}
                        {err.message.split(' // ').slice(1).join(' // ')}
                      </span>
                    </li>
                  ))}
              </ul>
              <p className="text-caption text-foreground-muted mt-3">
                Fix errors and re-upload.
              </p>
            </div>
          )}

          {/* Cancel button */}
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/')}
            >
              CANCEL
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ImportGuestsPage
