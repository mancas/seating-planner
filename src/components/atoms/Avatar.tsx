interface Props {
  firstName: string
  lastName: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses: Record<string, string> = {
  sm: 'w-8 h-8 text-caption',
  md: 'w-10 h-10 text-body-sm',
  lg: 'w-16 h-16 text-heading-4',
}

function Avatar({ firstName, lastName, size = 'md' }: Props) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`

  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold bg-surface-elevated text-foreground-heading ${sizeClasses[size]}`}
    >
      {initials}
    </div>
  )
}

export default Avatar
