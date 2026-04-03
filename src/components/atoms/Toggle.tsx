interface Props {
  checked: boolean
  onChange: (checked: boolean) => void
  id?: string
}

function Toggle({ checked, onChange, id }: Props) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-[44px] h-[24px] rounded-full cursor-pointer transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 ${
        checked ? 'bg-primary' : 'bg-gray-700'
      }`}
    >
      <span
        className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white transition-transform duration-200 ${
          checked ? 'translate-x-[20px]' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export default Toggle
