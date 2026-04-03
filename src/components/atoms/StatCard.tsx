import type { ReactNode } from 'react'

interface Props {
  label: string
  value: string | number
  mobileBorder?: boolean
  children?: ReactNode
}

function StatCard({ label, value, mobileBorder, children }: Props) {
  return (
    <div
      className={`card ${mobileBorder ? 'border-l-2 border-l-primary' : ''}`}
    >
      <p className="text-label text-foreground-muted uppercase tracking-wider">
        {label}
      </p>
      <p className="text-heading-3 text-foreground-heading mt-1">{value}</p>
      {children}
    </div>
  )
}

export default StatCard
