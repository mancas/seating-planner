import type { Guest } from '../../data/mock-guests'
import Avatar from '../atoms/Avatar'
import StatusBadge from '../atoms/StatusBadge'
import IconButton from '../atoms/IconButton'
import GuestDetailSection from '../molecules/GuestDetailSection'

interface Props {
  guest: Guest
  onClose: () => void
}

function GuestDetailPanel({ guest, onClose }: Props) {
  return (
    <>
      {/* Mobile: full-screen overlay */}
      <div className="md:hidden fixed inset-0 z-50 flex flex-col bg-background overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <span className="text-label text-foreground-muted tracking-wider uppercase">
            GUEST_DETAILS
          </span>
          <IconButton onClick={onClose} label="Close details">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="5" x2="15" y2="15" />
              <line x1="15" y1="5" x2="5" y2="15" />
            </svg>
          </IconButton>
        </div>

        {renderContent(guest)}

        {/* Action buttons */}
        <div className="px-4 py-4 mt-auto border-t border-border flex gap-3 shrink-0">
          <button className="btn-secondary flex-1">CONTACT</button>
          <button className="btn-primary flex-1">UPDATE</button>
        </div>
      </div>

      {/* Desktop: inline side panel */}
      <aside className="hidden md:flex flex-col w-[320px] min-w-[320px] bg-surface border-l border-border overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-label text-foreground-muted tracking-wider uppercase">
            GUEST_DETAILS
          </span>
          <IconButton onClick={onClose} label="Close details">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="5" x2="15" y2="15" />
              <line x1="15" y1="5" x2="5" y2="15" />
            </svg>
          </IconButton>
        </div>

        {renderContent(guest)}

        {/* Action buttons */}
        <div className="px-4 py-4 mt-auto border-t border-border flex gap-3">
          <button className="btn-secondary flex-1">CONTACT</button>
          <button className="btn-primary flex-1">UPDATE</button>
        </div>
      </aside>
    </>
  )
}

function renderContent(guest: Guest) {
  return (
    <>
      {/* Guest identity */}
      <div className="py-6 px-4 flex flex-col items-center text-center">
        <Avatar
          size="lg"
          firstName={guest.firstName}
          lastName={guest.lastName}
        />
        <h2 className="text-heading-4 text-foreground-heading mt-3">
          {guest.firstName} {guest.lastName}
        </h2>
        <p className="text-body-sm text-foreground-muted mt-1">{guest.role}</p>
      </div>

      {/* Core Metadata */}
      <div className="px-4">
        <GuestDetailSection title="CORE METADATA">
          <div className="flex items-center justify-between py-2">
            <span className="text-caption text-foreground-muted">STATUS</span>
            <StatusBadge status={guest.status} alwaysVisible />
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-caption text-foreground-muted">
              ACCESS LEVEL
            </span>
            <span className="text-body-sm text-foreground">
              {guest.accessLevel}
            </span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-caption text-foreground-muted">
              ASSIGNED TABLE
            </span>
            <span className="text-body-sm text-foreground">
              {guest.tableAssignment ?? '- - -'}
            </span>
          </div>
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

      {/* Logistics */}
      <div className="px-4">
        <GuestDetailSection title="LOGISTICS">
          <div className="flex items-center gap-2 py-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground-muted shrink-0"
            >
              <rect x="1" y="4" width="14" height="8" rx="2" />
              <circle cx="4.5" cy="12" r="1.5" />
              <circle cx="11.5" cy="12" r="1.5" />
            </svg>
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-foreground-muted shrink-0"
            >
              <path d="M2 14V4l6-2 6 2v10" />
              <path d="M2 14h12" />
              <rect x="5" y="7" width="2" height="3" />
              <rect x="9" y="7" width="2" height="3" />
            </svg>
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
