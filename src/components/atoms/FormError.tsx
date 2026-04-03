interface Props {
  message?: string
  id?: string
}

function FormError({ message, id }: Props) {
  if (!message) return null

  return (
    <p role="alert" id={id} className="text-caption text-red-400 mt-1">
      {message}
    </p>
  )
}

export default FormError
