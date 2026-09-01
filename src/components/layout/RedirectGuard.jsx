import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function RedirectGuard({ children }) {
  const location = useLocation()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function checkRedirects() {
      const currentPath = location.pathname
      const decodedPath = decodeURIComponent(currentPath)

      try {
        const { data, error } = await supabase
          .from('redirects')
          .select('*')
          .or(`source_path.eq.${currentPath},source_path.eq.${decodedPath}`)
          .maybeSingle()

        if (!error && data?.target_path) {
          window.location.replace(data.target_path)
          return
        }
      } catch (err) {
        // quiet fallback
      } finally {
        setChecking(false)
      }
    }

    checkRedirects()
  }, [location])

  if (checking) return null

  return children
}
