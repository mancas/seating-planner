import type { Expense } from './expense-types'
import { v4 as uuidv4 } from 'uuid'
import { createStorage } from './storage-utils'

const storage = createStorage<Expense[]>('seating-plan:expenses', [])

export function getExpenses(): Expense[] {
  return storage.read().slice().reverse()
}

export function getExpenseById(id: string): Expense | undefined {
  return storage.read().find((e) => e.id === id)
}

export function addExpense(data: Omit<Expense, 'id' | 'createdAt'>): Expense {
  const expenses = storage.read()
  const newExpense: Expense = {
    id: uuidv4(),
    ...data,
    createdAt: new Date().toISOString(),
  }
  expenses.push(newExpense)
  storage.write(expenses)
  return newExpense
}

export function updateExpense(
  id: string,
  data: Partial<Omit<Expense, 'id' | 'createdAt'>>,
): Expense | undefined {
  const expenses = storage.read()
  const index = expenses.findIndex((e) => e.id === id)
  if (index === -1) return undefined

  const existing = expenses[index]
  const updated: Expense = {
    ...existing,
    ...data,
  }
  expenses[index] = updated
  storage.write(expenses)
  return updated
}

export function deleteExpense(id: string): boolean {
  const expenses = storage.read()
  const filtered = expenses.filter((e) => e.id !== id)
  if (filtered.length === expenses.length) return false
  storage.write(filtered)
  return true
}

export function getTotalExpenses(): number {
  return storage.read().reduce((sum, e) => sum + e.amount, 0)
}

export function getExpenseCount(): number {
  return storage.read().length
}
