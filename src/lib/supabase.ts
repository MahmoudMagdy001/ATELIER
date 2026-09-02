import { createClient } from '@supabase/supabase-js'
import type { AuthUser } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key'

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) &&
  !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

function getStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem('atelier_' + key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem('atelier_' + key, JSON.stringify(val))
  } catch {
    // ignore
  }
}

export const demoStore = {
  getPosts: <T = unknown[]>() => getStorage<T>('posts', [] as unknown as T),
  savePosts: <T>(data: T) => setStorage('posts', data),

  getServices: <T = unknown[]>() => getStorage<T>('services', [] as unknown as T),
  saveServices: <T>(data: T) => setStorage('services', data),

  getOffers: <T = unknown[]>() => getStorage<T>('offers', [] as unknown as T),
  saveOffers: <T>(data: T) => setStorage('offers', data),

  getCategories: <T = unknown[]>() => getStorage<T>('categories', [] as unknown as T),
  saveCategories: <T>(data: T) => setStorage('categories', data),

  getMedia: <T = unknown[]>() => getStorage<T>('media', [] as unknown as T),
  saveMedia: <T>(data: T) => setStorage('media', data),

  getRedirects: <T = unknown[]>() => getStorage<T>('redirects', [] as unknown as T),
  saveRedirects: <T>(data: T) => setStorage('redirects', data),

  getSettings: <T = unknown>() => getStorage<T | null>('settings', null),
  saveSettings: <T>(data: T) => setStorage('settings', data),

  getAuthUser: (): AuthUser | null => {
    try {
      const u = localStorage.getItem('atelier_user')
      return u ? (JSON.parse(u) as AuthUser) : null
    } catch {
      return null
    }
  },
  signIn: (email?: string, _password?: string) => {
    const user: AuthUser = { email: email || 'admin@atelier-luxury.com', name: 'Atelier Director' }
    localStorage.setItem('atelier_user', JSON.stringify(user))
    return { data: { user }, error: null }
  },
  signOut: () => {
    localStorage.removeItem('atelier_user')
    return { error: null }
  }
}
