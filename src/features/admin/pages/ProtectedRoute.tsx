import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isAdminUser, supabase } from '../../../lib/supabase'
import { PageLoading } from '../../../components/ui/Loading'

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setIsAuthenticated(isAdminUser(session?.user))
        setLoading(false)
      })
      .catch(() => {
        setIsAuthenticated(false)
        setLoading(false)
      })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(isAdminUser(session?.user))
      setLoading(false)
    })

    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe()
      }
    }
  }, [])

  if (loading) return <PageLoading text="جار التحقق من الصلاحيات..." />

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
