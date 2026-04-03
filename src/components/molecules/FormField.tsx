import type { ReactNode } from 'react'
import FormError from '../atoms/FormError'

interface Props {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  children: ReactNode
}

function FormField({ label, htmlFor, required, error, children }: Props) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={htmlFor}
        className="text-label text-foreground-muted uppercase tracking-wider"
      >
        {label}
        {required && <span className="text-red-400"> *</span>}
      </label>
      {children}
      <FormError message={error} id={errorId} />
    </div>
  )
}

export default FormField
