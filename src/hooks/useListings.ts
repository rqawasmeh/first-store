import { useCallback, useEffect, useState } from 'react'
import type { Listing } from '../types'
import { fetchListings, isSupabaseConfigured, subscribeToListings } from '../lib/supabase'
import { ensureLocalListingsInitialized, getLocalListingsOverride } from '../lib/devApi'

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setError(null)
      if (!isSupabaseConfigured) {
        const local = getLocalListingsOverride()
        if (local) {
          setListings(local)
        } else {
          const seeded = await ensureLocalListingsInitialized()
          setListings(seeded)
        }
      } else {
        const data = await fetchListings()
        setListings(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load listings')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      const onUpdate = () => load()
      window.addEventListener('listings-updated', onUpdate)
      window.addEventListener('storage', onUpdate)
      return () => {
        window.removeEventListener('listings-updated', onUpdate)
        window.removeEventListener('storage', onUpdate)
      }
    }

    return subscribeToListings(setListings)
  }, [load])

  return { listings, loading, error, refresh: load }
}
