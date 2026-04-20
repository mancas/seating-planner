export interface Expense {
  id: string
  description: string
  amount: number
  createdAt: string
}

export interface ExpenseFormValues {
  description: string
  amount: string
}
