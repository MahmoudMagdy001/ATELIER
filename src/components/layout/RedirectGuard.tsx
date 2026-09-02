import { useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import type { RedirectRule } from '../../types/database'

export interface RedirectGuardProps {
  children: ReactNode
}

export default function RedirectGuard({ children }: RedirectGuardProps) {
  const location = useLocation()
  const [checking, setChecking] = useState<boolean>(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setChecking(false)
      return
    }

    let isMounted = true

    async function checkRedirects() {
      const currentPath = location.pathname
      const decodedPath = decodeURIComponent(currentPath)

      try {
        const { data, error } = await supabase
          .from('redirects')
          .select('*')
          .or(`source_path.eq.${currentPath},source_path.eq.${decodedPath}`)
          .maybeSingle()

        const typedData = data as RedirectRule | null
        if (!error && typedData?.target_path && isMounted) {
          window.location.replace(typedData.target_path)
          return
        }
      } catch {
        // quiet fallback
      } finally {
        if (isMounted) {
          setChecking(false)
        }
      }
    }

    checkRedirects()

    return () => {
      isMounted = false
    }
  }, [location])

  if (checking) return null

  return <>{children}</>
}
