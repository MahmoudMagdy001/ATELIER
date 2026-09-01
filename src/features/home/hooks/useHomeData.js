import { useState, useEffect } from 'react'
import { homeService } from '../services/homeService'

export function useHomeData() {
  const [data, setData] = useState({
    products: [],
    offers: [],
    posts: [],
    categories: [],
    settings: {},
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function load() {
      try {
        const res = await homeService.fetchHomeData()
        if (isMounted) {
          setData(res)
        }
      } catch (err) {
        if (isMounted) setError(err)
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
