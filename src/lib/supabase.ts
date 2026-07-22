import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Listing } from '../types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

export function resolveImageUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

export async function fetchListings(): Promise<Listing[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data ?? []
  }

  const response = await fetch(`${import.meta.env.BASE_URL}data/listings.json`)
  if (!response.ok) throw new Error('Failed to load listings')
  return response.json()
}

export function subscribeToListings(onUpdate: (listings: Listing[]) => void) {
  if (!supabase) return () => undefined

  const channel = supabase
    .channel('listings-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'listings' },
      async () => {
        const listings = await fetchListings()
        onUpdate(listings)
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
