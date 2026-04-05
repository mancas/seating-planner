import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { LuDownload, LuUpload, LuTrash2 } from 'react-icons/lu'
import { getGuests } from '../data/guest-store'
import { getTables } from '../data/table-store'
import LeftSidebar from '../components/organisms/LeftSidebar'
import ConfirmDialog from '../components/molecules/ConfirmDialog'
import { downloadProjectExport, deleteProject } from '../utils/project-export'
import { useProjectImport } from '../hooks/useProjectImport'

function SettingsView() {
  const navigate = useNavigate()
  const guests = getGuests()
  const tables = getTables()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const {
    fileInputRef,
    importError,
    pendingImport,
    openFilePicker,
    handleFileSelected,
    confirmImport,
    cancelImport,
  } = useProjectImport()

  const handleNavigateToAdd = useCallback(() => {
    navigate('/guests/new')
  }, [navigate])

  const handleSidebarAddTable = useCallback(() => {
    navigate('/seating-plan')
  }, [navigate])

  function handleExport() {
    downloadProjectExport()
  }

  function handleDeleteConfirm() {
    deleteProject()
    window.location.href = '/'
  }

  function handleDeleteCancel() {
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <LeftSidebar
        onAddGuest={handleNavigateToAdd}
        onAddTable={handleSidebarAddTable}
        guests={guests}
        tables={tables}
      />
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <div className="max-w-xl mx-auto px-4 md:px-6 py-6 md:py-10">
          <h1 className="text-heading-4 text-foreground-heading tracking-wider mb-8">
            SETTINGS
          </h1>

          {/* Section: Project Data */}
          <div>
            <h2 className="text-label text-foreground-muted tracking-wider uppercase border-b border-border pb-2 mb-6">
              PROJECT DATA
            </h2>

            {/* Export */}
            <div className="flex flex-col gap-3">
              <p className="text-body-sm text-foreground-muted">
                Export your project data to a JSON file for backup or transfer.
              </p>
              <button
                className="btn-secondary self-start flex items-center justify-center gap-2 w-full md:w-auto"
                onClick={handleExport}
              >
                <LuDownload size={16} />
                EXPORT_PROJECT
              </button>
            </div>

            <div className="border-t border-border my-6" />

            {/* Import */}
            <div className="flex flex-col gap-3">
              <p className="text-body-sm text-foreground-muted">
                Import a previously exported project file. This replaces all
                current data.
              </p>
              <button
                className="btn-secondary self-start flex items-center justify-center gap-2 w-full md:w-auto"
                onClick={openFilePicker}
              >
                <LuUpload size={16} />
                IMPORT_PROJECT
              </button>
              {importError && (
                <p className="text-caption text-red-400">{importError}</p>
              )}
            </div>

            <div className="border-t border-border my-6" />

            {/* Delete */}
            <div className="flex flex-col gap-3">
              <p className="text-body-sm text-foreground-muted">
                Permanently delete all project data including guests, tables,
                and seating assignments.
              </p>
              <button
                className="btn-destructive self-start flex items-center justify-center gap-2 w-full md:w-auto"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <LuTrash2 size={16} />
                DELETE_PROJECT
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Hidden file input for import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* Import confirmation dialog */}
      {pendingImport && (
        <ConfirmDialog
          title="IMPORT_PROJECT"
          targetName="PROJECT_DATA"
          message="This will replace all current data including guests, tables, and seating assignments. This action cannot be undone."
          confirmLabel="CONFIRM_IMPORT"
          cancelLabel="CANCEL"
          onConfirm={confirmImport}
          onCancel={cancelImport}
        />
      )}

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <ConfirmDialog
          title="DELETE_PROJECT"
          targetName="ALL_PROJECT_DATA"
          message="This will permanently delete all guests, tables, and seating assignments. This action cannot be undone."
          confirmLabel="CONFIRM_DELETE"
          cancelLabel="CANCEL"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </>
  )
}

export default SettingsView
