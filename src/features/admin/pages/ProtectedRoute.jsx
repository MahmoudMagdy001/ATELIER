import { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import { PageLoading } from '../../../components/ui/Loading'

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } = { data: {} } }) => {
        const localUser = localStorage.getItem('atelier_user')
        if (session || localUser) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
        }
        setLoading(false)
      })
      .catch(() => {
        const localUser = localStorage.getItem('atelier_user')
        setIsAuthenticated(Boolean(localUser))
        setLoading(false)
      })

    const { data: { subscription } = { data: {} } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session || localStorage.getItem('atelier_user')) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
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
