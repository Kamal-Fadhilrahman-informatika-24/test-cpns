import { useState, useEffect } from 'react'

/**
 * useDarkMode — toggle & persist dark mode via localStorage + Tailwind 'class' strategy
 */
export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    // Read saved preference; default to system preference
    const saved = localStorage.getItem('cpns_theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('cpns_theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggleDark = () => setDark(prev => !prev)

  return [dark, toggleDark]
}
