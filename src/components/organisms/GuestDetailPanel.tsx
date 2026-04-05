import { useState } from 'react'
import { LuGift, LuX } from 'react-icons/lu'
import type { Guest } from '../../data/guest-types'
import type { FloorTable } from '../../data/table-types'
import { getGuestSeatLocation } from '../../data/guest-utils'
import IconButton from '../atoms/IconButton'
import StatusBadge from '../atoms/StatusBadge'
import ConfirmDialog from '../molecules/ConfirmDialog'
import GuestDetailSection from '../molecules/GuestDetailSection'

interface Props {
  guest: Guest
  tables: FloorTable[]
  onClose: () => void
  onUpdate: () => void
  onDelete: () => void
  isClosing?: boolean
  onAnimationEnd?: () => void
}

function GuestDetailPanel({
  guest,
  tables,
  onClose,
  onUpdate,
  onDelete,
  isClosing,
  onAnimationEnd,
}: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  return (
    <>
      <div
        className={`hidden md:block fixed top-[var(--nc-topnav-height)] left-0 right-0 bottom-0 z-30 bg-black/20 ${isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-0 z-50 flex flex-col bg-background overflow-y-auto md:top-[var(--nc-topnav-height)] md:inset-auto md:right-0 md:bottom-0 md:z-40 md:w-[320px] md:bg-surface md:border-l md:border-border ${isClosing ? 'md:animate-slide-out-right' : 'md:animate-slide-in-right'}`}
        onAnimationEnd={(e) => {
          if (isClosing && e.animationName === 'slideOutRight') {
            onAnimationEnd?.()
          }
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <span className="text-label text-foreground-muted tracking-wider uppercase">
            GUEST_DETAILS
          </span>
          <IconButton onClick={onClose} label="Close details">
            <LuX size={20} />
          </IconButton>
        </div>

        {renderContent(guest, tables)}

        {/* Action buttons */}
        <div className="px-4 py-4 mt-auto border-t border-border flex gap-3 shrink-0">
          <button
            type="button"
            className="btn-destructive flex-1"
            onClick={() => setShowDeleteDialog(true)}
          >
            DELETE
          </button>
          <button className="btn-primary flex-1" onClick={onUpdate}>
            UPDATE
          </button>
        </div>
      </aside>

      {showDeleteDialog && (
        <ConfirmDialog
          title="CONFIRM_DELETION"
          targetName={`${guest.firstName} ${guest.lastName}`}
          message="This action is irreversible. Guest record will be permanently removed from the database."
          onConfirm={onDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </>
  )
}

function renderContent(guest: Guest, tables: FloorTable[]) {
  const location = getGuestSeatLocation(guest.id, tables)
  return (
    <>
      {/* Guest identity */}
      <div className="py-6 px-4 flex flex-col items-center text-center">
        <h2 className="text-heading-4 text-foreground-heading">
          {guest.firstName} {guest.lastName}
        </h2>
      </div>

      {/* Core Metadata */}
      <div className="px-4">
        <GuestDetailSection title="CORE METADATA">
          <dl>
            <div className="flex items-center justify-between py-2">
              <dt className="text-caption text-foreground-muted">STATUS</dt>
              <dd>
                <StatusBadge status={guest.status} alwaysVisible />
              </dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="text-caption text-foreground-muted">
                ASSIGNED TABLE
              </dt>
              <dd className="text-body-sm text-foreground">
                {location ? location.tableLabel : '- - -'}
              </dd>
            </div>
          </dl>
        </GuestDetailSection>
      </div>

      {/* Preferences */}
      <div className="px-4">
        <GuestDetailSection title="PREFERENCES">
          {guest.dietary.type ? (
            <>
              <p className="text-body-sm text-foreground">
                DIETARY: <span className="font-bold">{guest.dietary.type}</span>
              </p>
              {guest.dietary.notes && (
                <div className="bg-surface-elevated rounded p-3 mt-2 text-caption text-foreground-muted italic">
                  &ldquo;{guest.dietary.notes}&rdquo;
                </div>
              )}
            </>
          ) : (
            <p className="text-body-sm text-foreground-muted">
              NO_RESTRICTIONS
            </p>
          )}
        </GuestDetailSection>
      </div>

      {/* Gift */}
      <div className="px-4">
        <GuestDetailSection title="GIFT_REGISTRY">
          {guest.gift !== null ? (
            <div className="flex items-center gap-2 py-2">
              <LuGift size={16} className="text-foreground-muted shrink-0" />
              <div>
                <p className="text-body-sm text-foreground">
                  GIFT_VALUE:{' '}
                  <span className="font-bold">
                    ${guest.gift.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-body-sm text-foreground-muted">NO_GIFT_LOGGED</p>
          )}
        </GuestDetailSection>
      </div>
    </>
  )
}

export default GuestDetailPanel
