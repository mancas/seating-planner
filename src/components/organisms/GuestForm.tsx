import { useForm, useWatch } from 'react-hook-form'
import { useState } from 'react'
import type { Guest, GuestStatus } from '../../data/guest-types'
import FormField from '../molecules/FormField'
import FormSection from '../molecules/FormSection'
import ConfirmDialog from '../molecules/ConfirmDialog'
import Toggle from '../atoms/Toggle'

interface GuestFormValues {
  firstName: string
  lastName: string
  status: GuestStatus
  accessLevel: string
  tableAssignment: string
  seatNumber: string
  dietaryType: string
  dietaryNotes: string
  gift: string
  shuttleRequired: boolean
  shuttleFrom: string
  lodgingBooked: boolean
  lodgingVenue: string
}

interface Props {
  guest?: Guest
  onSubmit: (data: Omit<Guest, 'id'>) => void
  onDelete?: (id: string) => void
  onCancel: () => void
}

function GuestForm({ guest, onSubmit, onDelete, onCancel }: Props) {
  const isEdit = !!guest

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<GuestFormValues>({
    defaultValues: isEdit
      ? {
          firstName: guest.firstName,
          lastName: guest.lastName,
          status: guest.status,
          accessLevel: guest.accessLevel,
          tableAssignment: guest.tableAssignment ?? '',
          seatNumber: guest.seatNumber?.toString() ?? '',
          dietaryType: guest.dietary.type ?? '',
          dietaryNotes: guest.dietary.notes ?? '',
          gift: guest.gift?.toString() ?? '',
          shuttleRequired: guest.logistics.shuttleRequired,
          shuttleFrom: guest.logistics.shuttleFrom ?? '',
          lodgingBooked: guest.logistics.lodgingBooked,
          lodgingVenue: guest.logistics.lodgingVenue ?? '',
        }
      : {
          firstName: '',
          lastName: '',
          status: 'PENDING' as GuestStatus,
          accessLevel: '',
          tableAssignment: '',
          seatNumber: '',
          dietaryType: '',
          dietaryNotes: '',
          gift: '',
          shuttleRequired: false,
          shuttleFrom: '',
          lodgingBooked: false,
          lodgingVenue: '',
        },
  })

  const shuttleRequired = useWatch({ control, name: 'shuttleRequired' })
  const lodgingBooked = useWatch({ control, name: 'lodgingBooked' })

  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  function handleFormSubmit(values: GuestFormValues) {
    const guestData: Omit<Guest, 'id'> = {
      firstName: values.firstName,
      lastName: values.lastName,
      status: values.status,
      accessLevel: values.accessLevel || '',
      tableAssignment: values.tableAssignment || null,
      seatNumber: values.seatNumber ? parseInt(values.seatNumber, 10) : null,
      gift: values.gift ? parseFloat(values.gift) : null,
      dietary: {
        type: values.dietaryType || null,
        notes: values.dietaryNotes || null,
      },
      logistics: {
        shuttleRequired: values.shuttleRequired,
        shuttleFrom: values.shuttleFrom || null,
        lodgingBooked: values.lodgingBooked,
        lodgingVenue: values.lodgingVenue || null,
      },
    }
    onSubmit(guestData)
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <div className="px-4 md:px-6 py-4 md:py-6">
          <p className="text-label text-primary tracking-wider">
            {isEdit
              ? 'EDIT_ENTRY // MODIFICATION'
              : 'NEW_GUEST_ENTRY // REGISTRATION'}
          </p>
          <h1 className="text-heading-3 text-foreground-heading mt-1">
            {isEdit ? 'MODIFY_RECORD' : 'NEW_ENTRY'}
          </h1>
        </div>

        <div className="px-4 md:px-6 pb-6">
          <FormSection title="IDENTITY_MATRIX">
            <FormField
              label="FIRST_NAME"
              htmlFor="firstName"
              required
              error={
                errors.firstName
                  ? 'REQUIRED_FIELD // FIRST_NAME CANNOT BE EMPTY'
                  : undefined
              }
            >
              <input
                id="firstName"
                className={`input w-full ${errors.firstName ? 'border-red-500/50' : ''}`}
                placeholder="ENTER_DESIGNATION..."
                aria-invalid={!!errors.firstName}
                aria-describedby={
                  errors.firstName ? 'firstName-error' : undefined
                }
                {...register('firstName', { required: true })}
              />
            </FormField>
            <FormField
              label="LAST_NAME"
              htmlFor="lastName"
              required
              error={
                errors.lastName
                  ? 'REQUIRED_FIELD // LAST_NAME CANNOT BE EMPTY'
                  : undefined
              }
            >
              <input
                id="lastName"
                className={`input w-full ${errors.lastName ? 'border-red-500/50' : ''}`}
                placeholder="ENTER_DESIGNATION..."
                aria-invalid={!!errors.lastName}
                aria-describedby={
                  errors.lastName ? 'lastName-error' : undefined
                }
                {...register('lastName', { required: true })}
              />
            </FormField>
          </FormSection>

          <FormSection title="STATUS_CLASSIFICATION">
            <FormField label="STATUS" htmlFor="status" required>
              <select
                id="status"
                className="input w-full appearance-none"
                {...register('status', { required: true })}
              >
                <option value="PENDING">PENDING</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="DECLINED">DECLINED</option>
              </select>
            </FormField>
            <FormField label="ACCESS_LEVEL" htmlFor="accessLevel">
              <input
                id="accessLevel"
                className="input w-full"
                placeholder="E.G. TIER_01..."
                {...register('accessLevel')}
              />
            </FormField>
          </FormSection>

          <FormSection title="SEATING_ALLOCATION">
            <FormField label="TABLE_ID" htmlFor="tableAssignment">
              <input
                id="tableAssignment"
                className="input w-full"
                placeholder="E.G. TABLE_04..."
                {...register('tableAssignment')}
              />
            </FormField>
            <FormField label="SEAT_POSITION" htmlFor="seatNumber">
              <input
                id="seatNumber"
                type="number"
                className="input w-full"
                placeholder="E.G. 01..."
                {...register('seatNumber')}
              />
            </FormField>
          </FormSection>

          <FormSection title="DIETARY_PROTOCOL">
            <FormField label="DIETARY_TYPE" htmlFor="dietaryType">
              <input
                id="dietaryType"
                className="input w-full"
                placeholder="E.G. VEGAN..."
                {...register('dietaryType')}
              />
            </FormField>
            <FormField label="DIETARY_NOTES" htmlFor="dietaryNotes">
              <textarea
                id="dietaryNotes"
                className="input w-full resize-none"
                rows={3}
                placeholder="ADDITIONAL_NOTES..."
                {...register('dietaryNotes')}
              />
            </FormField>
          </FormSection>

          <FormSection title="GIFT_REGISTRY">
            <FormField label="GIFT_VALUE" htmlFor="gift">
              <input
                id="gift"
                type="number"
                className="input w-full"
                placeholder="E.G. 250..."
                {...register('gift')}
              />
            </FormField>
          </FormSection>

          <FormSection title="LOGISTICS_CONFIG">
            <FormField label="SHUTTLE_REQUIRED">
              <Toggle
                checked={shuttleRequired}
                onChange={(val) => setValue('shuttleRequired', val)}
              />
            </FormField>
            {shuttleRequired && (
              <FormField label="SHUTTLE_ORIGIN" htmlFor="shuttleFrom">
                <input
                  id="shuttleFrom"
                  className="input w-full"
                  placeholder="ORIGIN_POINT..."
                  {...register('shuttleFrom')}
                />
              </FormField>
            )}
            <FormField label="LODGING_STATUS">
              <Toggle
                checked={lodgingBooked}
                onChange={(val) => setValue('lodgingBooked', val)}
              />
            </FormField>
            {lodgingBooked && (
              <FormField label="LODGING_VENUE" htmlFor="lodgingVenue">
                <input
                  id="lodgingVenue"
                  className="input w-full"
                  placeholder="VENUE_NAME..."
                  {...register('lodgingVenue')}
                />
              </FormField>
            )}
          </FormSection>
        </div>

        <div className="flex justify-end gap-3 mt-8 px-4 md:px-6 pb-6">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            CANCEL
          </button>
          {isEdit && (
            <button
              type="button"
              className="btn-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              DELETE
            </button>
          )}
          <button type="submit" className="btn-primary">
            SAVE_ENTRY
          </button>
        </div>
      </form>

      {showDeleteDialog && (
        <ConfirmDialog
          title="CONFIRM_DELETION"
          targetName={`${guest!.firstName} ${guest!.lastName}`}
          message="This action is irreversible. Guest record will be permanently removed from the database."
          onConfirm={() => onDelete?.(guest!.id)}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </>
  )
}

export default GuestForm
