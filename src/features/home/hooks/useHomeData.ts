import { useState, useEffect } from 'react'
import { homeService, type HomeData } from '../services/homeService'

export interface UseHomeDataReturn extends HomeData {
  loading: boolean
  error: Error | null
}

export function useHomeData(): UseHomeDataReturn {
  const [data, setData] = useState<HomeData>({
    products: [],
    portfolio: [],
    categories: [],
    settings: null,
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const res = await homeService.fetchHomeData()
        if (isMounted) {
          setData(res)
        }
      } catch (err: unknown) {
        if (isMounted) setError(err as Error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [])

  return {
    ...data,
    loading,
    error,
  }
}

export default useHomeData
