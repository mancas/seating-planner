import { useState } from 'react'
import { LuBus, LuGift, LuHotel, LuX } from 'react-icons/lu'
import type { Guest } from '../../data/guest-types'
import IconButton from '../atoms/IconButton'
import StatusBadge from '../atoms/StatusBadge'
import ConfirmDialog from '../molecules/ConfirmDialog'
import GuestDetailSection from '../molecules/GuestDetailSection'

interface Props {
  guest: Guest
  onClose: () => void
  onUpdate: () => void
  onDelete: () => void
}

function GuestDetailPanel({ guest, onClose, onUpdate, onDelete }: Props) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  return (
    <>
      <aside className="fixed inset-0 z-50 flex flex-col bg-background overflow-y-auto md:static md:inset-auto md:z-auto md:w-[320px] md:min-w-[320px] md:bg-surface md:border-l md:border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <span className="text-label text-foreground-muted tracking-wider uppercase">
            GUEST_DETAILS
          </span>
          <IconButton onClick={onClose} label="Close details">
            <LuX size={20} />
          </IconButton>
        </div>

        {renderContent(guest)}

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

function renderContent(guest: Guest) {
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
                ACCESS LEVEL
              </dt>
              <dd className="text-body-sm text-foreground">
                {guest.accessLevel}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="text-caption text-foreground-muted">
                ASSIGNED TABLE
              </dt>
              <dd className="text-body-sm text-foreground">
                {guest.tableAssignment ?? '- - -'}
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

      {/* Logistics */}
      <div className="px-4">
        <GuestDetailSection title="LOGISTICS">
          <div className="flex items-center gap-2 py-2">
            <LuBus size={16} className="text-foreground-muted shrink-0" />
            <div>
              <p className="text-body-sm text-foreground">
                {guest.logistics.shuttleRequired
                  ? 'SHUTTLE REQUIRED'
                  : 'NO SHUTTLE'}
              </p>
              <p className="text-caption text-foreground-muted">
                {guest.logistics.shuttleRequired
                  ? `From: ${guest.logistics.shuttleFrom}`
                  : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 py-2">
            <LuHotel size={16} className="text-foreground-muted shrink-0" />
            <div>
              <p className="text-body-sm text-foreground">LODGING BOOKED</p>
              <p className="text-caption text-foreground-muted">
                {guest.logistics.lodgingBooked
                  ? `Venue: ${guest.logistics.lodgingVenue}`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </GuestDetailSection>
      </div>
    </>
  )
}

export default GuestDetailPanel
