import { useEffect, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import type { RedirectRule } from '../../types/database'

export interface RedirectGuardProps {
  children: ReactNode
}

export default function RedirectGuard({ children }: RedirectGuardProps) {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isSupabaseConfigured) return

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
          const target = typedData.target_path.trim()
          if (target.startsWith('http://') || target.startsWith('https://')) {
            window.location.replace(target)
          } else {
            navigate(target, { replace: true })
          }
        }
      } catch {
        // quiet fallback
      }
    }

    checkRedirects()

    return () => {
      isMounted = false
    }
  }, [location.pathname, navigate])

  return <>{children}</>
}

