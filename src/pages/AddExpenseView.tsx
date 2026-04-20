import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { LuPlus, LuArrowLeft } from 'react-icons/lu'
import { addExpense } from '../data/expense-store'
import { getGuests } from '../data/guest-store'
import { getTables } from '../data/table-store'
import type { ExpenseFormValues } from '../data/expense-types'
import LeftSidebar from '../components/organisms/LeftSidebar'
import FormField from '../components/molecules/FormField'

function AddExpenseView() {
  const navigate = useNavigate()

  // Sidebar props
  const guests = getGuests()
  const tables = getTables()
  const handleNavigateToAdd = useCallback(
    () => navigate('/guests/new'),
    [navigate],
  )
  const handleSidebarAddTable = useCallback(
    () => navigate('/seating-plan'),
    [navigate],
  )

  const form = useForm<ExpenseFormValues>({
    defaultValues: { description: '', amount: '' },
  })

  function handleSubmit(values: ExpenseFormValues) {
    const amount = parseFloat(values.amount)
    addExpense({ description: values.description, amount })
    navigate('/expenses')
  }

  return (
    <>
      <LeftSidebar
        onAddGuest={handleNavigateToAdd}
        onAddTable={handleSidebarAddTable}
        guests={guests}
        tables={tables}
      />
      <main className="relative flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0">
        <div className="px-4 md:px-6 py-4 md:py-6">
          {/* Back link */}
          <button
            className="flex items-center gap-1 text-body-sm text-foreground-muted hover:text-foreground mb-4 cursor-pointer"
            onClick={() => navigate('/expenses')}
          >
            <LuArrowLeft size={14} />
            BACK_TO_LOG
          </button>

          <div className="hidden md:block">
            <p className="text-label text-primary tracking-wider">
              FINANCE.TRACKER_V1
            </p>
            <h1 className="text-heading-1 text-foreground-heading mt-1">
              ADD_EXPENSE
            </h1>
          </div>
          <div className="md:hidden">
            <p className="text-label text-primary tracking-wider">NEW_ENTRY</p>
            <h1 className="text-heading-1 text-foreground-heading mt-1">
              ADD EXPENSE
            </h1>
          </div>
        </div>

        <div className="flex-1 px-4 md:px-6">
          <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
            <div className="flex flex-col gap-4">
              <FormField
                label="DESCRIPTION"
                htmlFor="add-description"
                required
                error={
                  form.formState.errors.description
                    ? 'REQUIRED_FIELD // DESCRIPTION_CANNOT_BE_EMPTY'
                    : undefined
                }
              >
                <input
                  id="add-description"
                  className={`input w-full ${form.formState.errors.description ? 'border-red-500/50' : ''}`}
                  placeholder="E.G. VENUE RENTAL..."
                  aria-invalid={!!form.formState.errors.description}
                  aria-describedby={
                    form.formState.errors.description
                      ? 'add-description-error'
                      : undefined
                  }
                  {...form.register('description', { required: true })}
                />
              </FormField>
              <FormField
                label="AMOUNT"
                htmlFor="add-amount"
                required
                error={
                  form.formState.errors.amount
                    ? 'REQUIRED_FIELD // AMOUNT_MUST_BE_POSITIVE'
                    : undefined
                }
              >
                <input
                  id="add-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  className={`input w-full ${form.formState.errors.amount ? 'border-red-500/50' : ''}`}
                  placeholder="E.G. 2500..."
                  aria-invalid={!!form.formState.errors.amount}
                  aria-describedby={
                    form.formState.errors.amount
                      ? 'add-amount-error'
                      : undefined
                  }
                  {...form.register('amount', {
                    required: true,
                    validate: (v) => parseFloat(v) > 0,
                  })}
                />
              </FormField>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="btn-primary flex items-center justify-center gap-2 w-full md:w-auto"
                >
                  <LuPlus size={16} />
                  ADD_EXPENSE
                </button>
                <button
                  type="button"
                  className="btn-secondary w-full md:w-auto"
                  onClick={() => navigate('/expenses')}
                >
                  CANCEL
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}

export default AddExpenseView
