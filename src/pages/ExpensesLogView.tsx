import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { LuPencil, LuTrash2, LuPlus } from 'react-icons/lu'
import {
  getExpenses,
  updateExpense,
  deleteExpense,
} from '../data/expense-store'
import { getGuests } from '../data/guest-store'
import { getTables } from '../data/table-store'
import type { Expense, ExpenseFormValues } from '../data/expense-types'
import LeftSidebar from '../components/organisms/LeftSidebar'
import StatCard from '../components/atoms/StatCard'
import ConfirmDialog from '../components/molecules/ConfirmDialog'
import IconButton from '../components/atoms/IconButton'
import FormField from '../components/molecules/FormField'
import FAB from '../components/atoms/FAB'

function formatTotal(n: number): string {
  return (
    '€' + new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n)
  )
}

function formatAmount(n: number): string {
  return (
    '€' + new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 }).format(n)
  )
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(new Date(iso))
}

function ExpensesLogView() {
  const [expenses, setExpenses] = useState<Expense[]>(() => getExpenses())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null)

  // Derived values
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const expenseCount = expenses.length

  // Sidebar props
  const guests = getGuests()
  const tables = getTables()
  const navigate = useNavigate()
  const handleNavigateToAdd = useCallback(
    () => navigate('/guests/new'),
    [navigate],
  )
  const handleSidebarAddTable = useCallback(
    () => navigate('/seating-plan'),
    [navigate],
  )

  // Edit form
  const editForm = useForm<ExpenseFormValues>()

  // Adjusting state during render pattern for resetting edit form
  const [prevEditingId, setPrevEditingId] = useState<string | null>(null)
  if (editingId !== prevEditingId) {
    setPrevEditingId(editingId)
    if (editingId) {
      const expense = expenses.find((e) => e.id === editingId)
      if (expense) {
        editForm.reset({
          description: expense.description,
          amount: expense.amount.toString(),
        })
      }
    }
  }

  function handleEditSubmit(values: ExpenseFormValues) {
    updateExpense(editingId!, {
      description: values.description,
      amount: parseFloat(values.amount),
    })
    setExpenses(getExpenses())
    setEditingId(null)
  }

  function handleStartEdit(expense: Expense) {
    setEditingId(expense.id)
  }

  function handleCancelEdit() {
    setEditingId(null)
  }

  // Delete flow
  function handleDeleteClick(expense: Expense) {
    setDeleteTarget(expense)
  }

  function handleDeleteConfirm() {
    deleteExpense(deleteTarget!.id)
    setExpenses(getExpenses())
    if (editingId === deleteTarget!.id) {
      setEditingId(null)
    }
    setDeleteTarget(null)
  }

  function handleDeleteCancel() {
    setDeleteTarget(null)
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
        {/* Header */}
        <div className="px-4 md:px-6 py-4 md:py-6">
          <div className="hidden md:block">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-label text-primary tracking-wider">
                  FINANCE.TRACKER_V1
                </p>
                <h1 className="text-heading-1 text-foreground-heading mt-1">
                  EXPENSE_LOG
                </h1>
              </div>
              <button
                className="btn-primary flex items-center gap-2"
                onClick={() => navigate('/expenses/new')}
              >
                <LuPlus size={16} />
                ADD_EXPENSE
              </button>
            </div>
            <div className="flex gap-4 mt-4">
              <StatCard
                label="TOTAL EXPENSES"
                value={formatTotal(totalExpenses)}
              />
              <StatCard label="ENTRIES" value={expenseCount} />
            </div>
          </div>
          <div className="md:hidden">
            <p className="text-label text-primary tracking-wider">
              EXPENSE_LOG
            </p>
            <h1 className="text-heading-1 text-foreground-heading mt-1">
              EXPENSES
            </h1>
            <p className="text-caption text-foreground-muted mt-1">
              TOTAL: {formatTotal(totalExpenses)} / {expenseCount} ENTRIES
            </p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <StatCard
                label="TOTAL"
                value={formatTotal(totalExpenses)}
                mobileBorder
              />
              <StatCard label="ENTRIES" value={expenseCount} mobileBorder />
            </div>
          </div>
        </div>

        {/* Expense table */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
          {expenses.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-heading-5 text-foreground-heading">
                NO_ENTRIES // INITIALIZE_EXPENSE_LOG
              </p>
              <p className="text-body-sm text-foreground-muted mt-2">
                Register your first expense to begin tracking costs.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <table className="hidden md:table w-full border-separate border-spacing-0 table-auto">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left font-normal border-b border-border text-label text-foreground-muted uppercase tracking-wider">
                      DATE
                    </th>
                    <th className="px-4 py-3 text-left font-normal border-b border-border text-label text-foreground-muted uppercase tracking-wider">
                      DESCRIPTION
                    </th>
                    <th className="px-4 py-3 text-right font-normal border-b border-border text-label text-foreground-muted uppercase tracking-wider">
                      AMOUNT
                    </th>
                    <th className="px-4 py-3 text-right font-normal border-b border-border text-label text-foreground-muted uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-l-2 border-l-transparent hover:bg-gray-800/50"
                    >
                      {editingId === expense.id ? (
                        <td colSpan={4} className="px-4 py-3">
                          <form
                            onSubmit={editForm.handleSubmit(handleEditSubmit)}
                            noValidate
                          >
                            <div className="flex flex-col gap-3">
                              <FormField
                                label="DESCRIPTION"
                                htmlFor={`edit-description-${expense.id}`}
                                required
                                error={
                                  editForm.formState.errors.description
                                    ? 'REQUIRED_FIELD // DESCRIPTION_CANNOT_BE_EMPTY'
                                    : undefined
                                }
                              >
                                <input
                                  id={`edit-description-${expense.id}`}
                                  className={`input w-full ${editForm.formState.errors.description ? 'border-red-500/50' : ''}`}
                                  placeholder="E.G. VENUE RENTAL..."
                                  aria-invalid={
                                    !!editForm.formState.errors.description
                                  }
                                  {...editForm.register('description', {
                                    required: true,
                                  })}
                                />
                              </FormField>
                              <FormField
                                label="AMOUNT"
                                htmlFor={`edit-amount-${expense.id}`}
                                required
                                error={
                                  editForm.formState.errors.amount
                                    ? 'REQUIRED_FIELD // AMOUNT_MUST_BE_POSITIVE'
                                    : undefined
                                }
                              >
                                <input
                                  id={`edit-amount-${expense.id}`}
                                  type="number"
                                  step="0.01"
                                  min="0.01"
                                  className={`input w-full ${editForm.formState.errors.amount ? 'border-red-500/50' : ''}`}
                                  placeholder="E.G. 2500..."
                                  aria-invalid={
                                    !!editForm.formState.errors.amount
                                  }
                                  {...editForm.register('amount', {
                                    required: true,
                                    validate: (v) => parseFloat(v) > 0,
                                  })}
                                />
                              </FormField>
                              <div className="flex gap-2">
                                <button type="submit" className="btn-primary">
                                  SAVE_EXPENSE
                                </button>
                                <button
                                  type="button"
                                  className="btn-secondary"
                                  onClick={handleCancelEdit}
                                >
                                  CANCEL
                                </button>
                              </div>
                            </div>
                          </form>
                        </td>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-body-sm text-foreground-muted whitespace-nowrap">
                            {formatDate(expense.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-body-sm font-semibold text-foreground-heading uppercase">
                              {expense.description}
                            </p>
                            <p className="text-caption text-foreground-muted">
                              ID: {expense.id}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-body-sm text-foreground-heading font-semibold text-right whitespace-nowrap">
                            {formatAmount(expense.amount)}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            <div className="inline-flex gap-1">
                              <IconButton
                                label="Edit expense"
                                onClick={() => handleStartEdit(expense)}
                              >
                                <LuPencil size={14} />
                              </IconButton>
                              <IconButton
                                label="Delete expense"
                                onClick={() => handleDeleteClick(expense)}
                              >
                                <LuTrash2 size={14} />
                              </IconButton>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile list */}
              <div className="md:hidden">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="border-b border-border px-4 py-3"
                  >
                    {editingId === expense.id ? (
                      <form
                        onSubmit={editForm.handleSubmit(handleEditSubmit)}
                        noValidate
                      >
                        <div className="flex flex-col gap-3">
                          <FormField
                            label="DESCRIPTION"
                            htmlFor={`edit-description-m-${expense.id}`}
                            required
                            error={
                              editForm.formState.errors.description
                                ? 'REQUIRED_FIELD // DESCRIPTION_CANNOT_BE_EMPTY'
                                : undefined
                            }
                          >
                            <input
                              id={`edit-description-m-${expense.id}`}
                              className={`input w-full ${editForm.formState.errors.description ? 'border-red-500/50' : ''}`}
                              placeholder="E.G. VENUE RENTAL..."
                              aria-invalid={
                                !!editForm.formState.errors.description
                              }
                              {...editForm.register('description', {
                                required: true,
                              })}
                            />
                          </FormField>
                          <FormField
                            label="AMOUNT"
                            htmlFor={`edit-amount-m-${expense.id}`}
                            required
                            error={
                              editForm.formState.errors.amount
                                ? 'REQUIRED_FIELD // AMOUNT_MUST_BE_POSITIVE'
                                : undefined
                            }
                          >
                            <input
                              id={`edit-amount-m-${expense.id}`}
                              type="number"
                              step="0.01"
                              min="0.01"
                              className={`input w-full ${editForm.formState.errors.amount ? 'border-red-500/50' : ''}`}
                              placeholder="E.G. 2500..."
                              aria-invalid={!!editForm.formState.errors.amount}
                              {...editForm.register('amount', {
                                required: true,
                                validate: (v) => parseFloat(v) > 0,
                              })}
                            />
                          </FormField>
                          <div className="flex gap-2">
                            <button type="submit" className="btn-primary">
                              SAVE_EXPENSE
                            </button>
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={handleCancelEdit}
                            >
                              CANCEL
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-body-sm font-semibold text-foreground-heading uppercase truncate">
                            {expense.description}
                          </p>
                          <p className="text-caption text-foreground-muted">
                            {formatDate(expense.createdAt)}
                          </p>
                        </div>
                        <span className="text-body-sm text-foreground-heading font-semibold whitespace-nowrap">
                          {formatAmount(expense.amount)}
                        </span>
                        <IconButton
                          label="Edit expense"
                          onClick={() => handleStartEdit(expense)}
                        >
                          <LuPencil size={14} />
                        </IconButton>
                        <IconButton
                          label="Delete expense"
                          onClick={() => handleDeleteClick(expense)}
                        >
                          <LuTrash2 size={14} />
                        </IconButton>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer stats - desktop only */}
        <div className="hidden md:grid grid-cols-3 gap-4 px-6 py-4 mt-auto border-t border-border">
          <StatCard label="TOTAL EXPENSES" value={formatTotal(totalExpenses)} />
          <StatCard label="ENTRIES" value={expenseCount} />
          <StatCard
            label="AVG PER ENTRY"
            value={
              expenseCount > 0
                ? formatAmount(totalExpenses / expenseCount)
                : '€0'
            }
          />
        </div>
      </main>

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <ConfirmDialog
          title="DELETE_EXPENSE"
          targetName={deleteTarget.description}
          message="This expense entry will be permanently removed. This action cannot be undone."
          confirmLabel="CONFIRM_DELETE"
          cancelLabel="CANCEL"
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
      <FAB
        onClick={() => navigate('/expenses/new')}
        label="Add expense"
        icon={<LuPlus size={24} />}
      />
    </>
  )
}

export default ExpensesLogView
