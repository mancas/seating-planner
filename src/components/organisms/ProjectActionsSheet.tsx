import { useState, useRef } from 'react'
import { Drawer } from 'vaul'
import { LuX, LuDownload, LuUpload } from 'react-icons/lu'
import IconButton from '../atoms/IconButton'
import ConfirmDialog from '../molecules/ConfirmDialog'
import {
  downloadProjectExport,
  validateProjectImport,
  applyProjectImport,
} from '../../utils/project-export'
import type { ProjectExport } from '../../utils/project-export'

interface Props {
  onClose: () => void
}

function ProjectActionsSheet({ onClose }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [importError, setImportError] = useState<string | null>(null)
  const [pendingImport, setPendingImport] = useState<ProjectExport | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    downloadProjectExport()
    setDrawerOpen(false)
    onClose()
  }

  function handleImportClick() {
    fileInputRef.current?.click()
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const content = reader.result as string
      const result = validateProjectImport(content)
      if (result) {
        setPendingImport(result)
      } else {
        setImportError(
          'INVALID_FILE // THE SELECTED FILE IS NOT A VALID PROJECT EXPORT',
        )
      }
      setDrawerOpen(false)
    }
    reader.onerror = () => {
      setImportError(
        'INVALID_FILE // THE SELECTED FILE IS NOT A VALID PROJECT EXPORT',
      )
      setDrawerOpen(false)
    }
    reader.readAsText(file)

    // Reset so the same file can be re-selected
    e.target.value = ''
  }

  function handleConfirmImport() {
    if (pendingImport) {
      applyProjectImport(pendingImport)
      window.location.reload()
    }
  }

  function handleCancelImport() {
    setPendingImport(null)
    onClose()
  }

  return (
    <>
      <Drawer.Root
        open={drawerOpen}
        onOpenChange={(open) => {
          if (!open) {
            if (!pendingImport && !importError) {
              onClose()
            } else {
              setDrawerOpen(false)
            }
          }
        }}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl border-t border-border flex flex-col outline-none">
            <Drawer.Handle className="bg-gray-600 my-3" />
            <Drawer.Title className="sr-only">Project Actions</Drawer.Title>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-border shrink-0">
              <span className="text-label text-foreground-muted tracking-wider uppercase">
                PROJECT
              </span>
              <IconButton onClick={onClose} label="Close project menu">
                <LuX size={20} />
              </IconButton>
            </div>

            {/* Body */}
            <div className="px-4 py-4">
              <button
                className="btn-secondary w-full flex items-center justify-center gap-2"
                onClick={handleExport}
              >
                <LuDownload size={16} />
                EXPORT_PROJECT
              </button>
              <button
                className="btn-secondary w-full flex items-center justify-center gap-2 mt-2"
                onClick={handleImportClick}
              >
                <LuUpload size={16} />
                IMPORT_PROJECT
              </button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileSelected}
      />

      {pendingImport && (
        <ConfirmDialog
          title="IMPORT_PROJECT"
          targetName="PROJECT_DATA"
          message="This will replace all current data including guests, tables, and seating assignments. This action cannot be undone."
          confirmLabel="CONFIRM_IMPORT"
          cancelLabel="CANCEL"
          onConfirm={handleConfirmImport}
          onCancel={handleCancelImport}
        />
      )}

      {importError && (
        <ConfirmDialog
          title="INVALID_FILE"
          targetName=""
          message="THE SELECTED FILE IS NOT A VALID PROJECT EXPORT"
          confirmLabel="CLOSE"
          onConfirm={() => {
            setImportError(null)
            onClose()
          }}
          onCancel={() => {
            setImportError(null)
            onClose()
          }}
        />
      )}
    </>
  )
}

export default ProjectActionsSheet
