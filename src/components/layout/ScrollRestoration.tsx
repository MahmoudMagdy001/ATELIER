import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Global ScrollRestoration component.
 * Automatically resets window scroll to top on route change across all routes,
 * or scrolls smoothly to anchor target if a hash is present in the URL.
 */
export default function ScrollRestoration() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Allow DOM to settle before scrolling to target element
      const targetElement = document.getElementById(hash.replace('#', ''))
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }

    // Default: Reset scroll position to top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    })
  }, [pathname, search, hash])

  return null
}
