import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
}

function GuestDetailSection({ title, children }: Props) {
  return (
    <div className="border-t border-border pt-4 mt-4">
      <h3 className="text-label text-foreground-muted uppercase tracking-wider">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </div>
  )
}

export default GuestDetailSection
