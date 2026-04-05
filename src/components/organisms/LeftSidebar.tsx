import {
  LuUserPlus,
  LuPlus,
  LuGripVertical,
  LuUpload,
  LuDownload,
} from 'react-icons/lu'
import { useDraggable } from '@dnd-kit/react'
import { useLocation, useNavigate } from 'react-router'
import SidebarNavItem from '../molecules/SidebarNavItem'
import ConfirmDialog from '../molecules/ConfirmDialog'
import type { Guest } from '../../data/guest-types'
import type { FloorTable } from '../../data/table-types'
import { getUnassignedGuests } from '../../data/guest-utils'
import { DRAG_TYPE_GUEST } from '../../data/dnd-types'
import { downloadProjectExport } from '../../utils/project-export'
import { useProjectImport } from '../../hooks/useProjectImport'

interface Props {
  onAddGuest: () => void
  onImportGuests?: () => void
  onAddTable?: () => void
  guests?: Guest[]
  tables?: FloorTable[]
}

function DraggableGuestItem({ guest }: { guest: Guest }) {
  const { ref, isDragging } = useDraggable({
    id: `guest-${guest.id}`,
    data: { type: DRAG_TYPE_GUEST, guestId: guest.id },
  })

  return (
    <li
      ref={ref}
      className={`flex items-center gap-2 text-body-sm text-foreground cursor-grab px-1 py-1 rounded hover:bg-surface-elevated ${isDragging ? 'opacity-40' : ''}`}
    >
      <LuGripVertical
        size={14}
        className="text-foreground-muted flex-shrink-0"
      />
      <span className="truncate">
        {guest.firstName} {guest.lastName}
      </span>
    </li>
  )
}

function LeftSidebar({
  onAddGuest,
  onImportGuests,
  onAddTable,
  guests = [],
  tables = [],
}: Props) {
  const location = useLocation()
  const navigate = useNavigate()
  const isCanvasView = location.pathname === '/seating-plan'

  const unassignedGuests = getUnassignedGuests(guests, tables)

  const {
    fileInputRef,
    importError,
    pendingImport,
    openFilePicker,
    handleFileSelected,
    confirmImport,
    cancelImport,
  } = useProjectImport()

  return (
    <aside className="hidden md:flex flex-col min-w-55 bg-surface border-r border-border">
      {/* Session info */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-label text-primary tracking-wider">SEATING_01</p>
        <p className="text-caption text-foreground-muted">ACTIVE SESSION</p>
      </div>

      {/* Nav items */}
      <div className="flex-1 py-2">
        <SidebarNavItem
          label="Listado de invitados"
          isActive={!isCanvasView}
          onClick={() => navigate('/')}
        />
        <SidebarNavItem
          label="Canvas"
          isActive={isCanvasView}
          onClick={() => navigate('/seating-plan')}
        />
      </div>

      {/* Bottom actions */}
      <div className="mt-auto px-4 py-4 border-t border-border">
        {isCanvasView ? (
          <>
            <button
              className="btn-primary w-full flex items-center justify-center gap-2"
              onClick={onAddTable}
            >
              <LuPlus size={16} />
              ADD TABLE
            </button>
            {unassignedGuests.length > 0 && (
              <div className="mt-3">
                <p className="text-caption text-foreground-muted mb-2">
                  UNASSIGNED ({unassignedGuests.length})
                </p>
                <ul className="space-y-1 max-h-50 overflow-y-auto">
                  {unassignedGuests.map((g) => (
                    <DraggableGuestItem key={g.id} guest={g} />
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <>
            <button
              className="btn-primary w-full flex items-center justify-center gap-2"
              onClick={onAddGuest}
            >
              <LuUserPlus size={16} />
              ADD GUEST
            </button>
            {onImportGuests && (
              <button
                className="btn-secondary w-full flex items-center justify-center gap-2 mt-2"
                onClick={onImportGuests}
              >
                <LuUpload size={16} />
                IMPORT_CSV
              </button>
            )}
          </>
        )}

        {/* Project actions separator */}
        <div className="border-t border-border my-3" />

        <button
          className="btn-secondary w-full flex items-center justify-center gap-2"
          onClick={downloadProjectExport}
        >
          <LuDownload size={16} />
          EXPORT_PROJECT
        </button>
        <button
          className="btn-secondary w-full flex items-center justify-center gap-2 mt-2"
          onClick={openFilePicker}
        >
          <LuUpload size={16} />
          IMPORT_PROJECT
        </button>
        {importError && (
          <p className="text-caption text-red-400 mt-1">{importError}</p>
        )}
      </div>

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

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileSelected}
      />
    </aside>
  )
}

export default LeftSidebar
