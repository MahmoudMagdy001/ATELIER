import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key'

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) &&
  !import.meta.env.VITE_SUPABASE_URL.includes('placeholder')
)

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

function getStorage(key, fallback = []) {
  try {
    const item = localStorage.getItem('atelier_' + key)
    return item ? JSON.parse(item) : fallback
  } catch (e) {
    return fallback
  }
}

function setStorage(key, val) {
  try {
    localStorage.setItem('atelier_' + key, JSON.stringify(val))
  } catch (e) {}
}

export const demoStore = {
  getPosts: () => getStorage('posts', []),
  savePosts: (data) => setStorage('posts', data),

  getServices: () => getStorage('services', []),
  saveServices: (data) => setStorage('services', data),

  getOffers: () => getStorage('offers', []),
  saveOffers: (data) => setStorage('offers', data),

  getCategories: () => getStorage('categories', []),
  saveCategories: (data) => setStorage('categories', data),

  getMedia: () => getStorage('media', []),
  saveMedia: (data) => setStorage('media', data),

  getRedirects: () => getStorage('redirects', []),
  saveRedirects: (data) => setStorage('redirects', data),

  getSettings: () => getStorage('settings', null),
  saveSettings: (data) => setStorage('settings', data),

  getAuthUser: () => {
    try {
      const u = localStorage.getItem('atelier_user')
      return u ? JSON.parse(u) : null
    } catch {
      return null
    }
  },
  signIn: (email, password) => {
    const user = { email: email || 'admin@atelier-luxury.com', name: 'Atelier Director' }
    localStorage.setItem('atelier_user', JSON.stringify(user))
    return { data: { user }, error: null }
  },
  signOut: () => {
    localStorage.removeItem('atelier_user')
    return { error: null }
  }
}

