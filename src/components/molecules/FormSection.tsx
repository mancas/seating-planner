import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
}

function FormSection({ title, children }: Props) {
  return (
    <div className="border-t border-border pt-4 mt-6">
      <h3 className="text-label text-foreground-muted uppercase tracking-wider">
        {title}
      </h3>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </div>
  )
}

export default FormSection
