import { useState, useRef, useCallback } from 'react'
import type { DragEvent, ChangeEvent } from 'react'
import { LuUpload } from 'react-icons/lu'

interface Props {
  onFileSelect: (file: File) => void
  accept: string
  selectedFileName?: string
  hasError?: boolean
  onReset?: () => void
}

function FileDropZone({
  onFileSelect,
  accept,
  selectedFileName,
  hasError,
  onReset,
}: Props) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file) {
        onFileSelect(file)
      }
    },
    [onFileSelect],
  )

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        onFileSelect(file)
      }
      e.target.value = ''
    },
    [onFileSelect],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        inputRef.current?.click()
      }
    },
    [],
  )

  return (
    <div
      role="button"
      tabIndex={0}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={handleKeyDown}
      className={`border-2 border-dashed rounded p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 ${
        isDragOver
          ? 'border-primary bg-primary/5'
          : hasError
            ? 'border-red-500/30 bg-red-500/5'
            : selectedFileName
              ? 'border-border bg-surface'
              : 'border-border hover:border-foreground-muted'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
      {selectedFileName ? (
        <>
          <p className="text-body-sm text-foreground">{selectedFileName}</p>
          {onReset && (
            <button
              type="button"
              className="btn-secondary"
              onClick={(e) => {
                e.stopPropagation()
                onReset()
              }}
            >
              SELECT_NEW_FILE
            </button>
          )}
        </>
      ) : (
        <>
          <LuUpload size={24} className="text-foreground-muted" />
          <p className="text-body-sm text-foreground-muted">
            DROP CSV FILE HERE
          </p>
          <p className="text-caption text-foreground-muted">
            or click to select
          </p>
          <button
            type="button"
            className="btn-secondary"
            onClick={(e) => {
              e.stopPropagation()
              inputRef.current?.click()
            }}
          >
            SELECT_FILE
          </button>
        </>
      )}
    </div>
  )
}

export default FileDropZone
