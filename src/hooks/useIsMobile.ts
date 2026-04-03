import { useState, useEffect } from 'react'

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 767px)').matches,
  )

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    function handleChange(e: MediaQueryListEvent) {
      setIsMobile(e.matches)
    }
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  return isMobile
}
