import { LuMoon, LuSun } from 'react-icons/lu'
import { useTheme } from '../../hooks/useTheme'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="p-2 rounded hover:bg-surface-elevated text-foreground-muted hover:text-foreground transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
    >
      {isDark ? <LuSun size={16} /> : <LuMoon size={16} />}
    </button>
  )
}

export default ThemeToggle
