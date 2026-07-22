import type { DevAction, Listing } from '../types'
import { isSupabaseConfigured, supabase } from './supabase'

const DEV_PASSWORD_KEY = '1upthrift_dev_password'
const LOCAL_LISTINGS_KEY = '1upthrift_local_listings'

export function getStoredDevPassword(): string | null {
  return sessionStorage.getItem(DEV_PASSWORD_KEY)
}

export function setStoredDevPassword(password: string) {
  sessionStorage.setItem(DEV_PASSWORD_KEY, password)
}

export function clearStoredDevPassword() {
  sessionStorage.removeItem(DEV_PASSWORD_KEY)
}

export function isDevAuthenticated(): boolean {
  return sessionStorage.getItem('devAuthenticated') === 'true'
}

export function setDevAuthenticated(value: boolean) {
  if (value) {
    sessionStorage.setItem('devAuthenticated', 'true')
  } else {
    sessionStorage.removeItem('devAuthenticated')
    clearStoredDevPassword()
  }
}

function getLocalListings(): Listing[] {
  const raw = localStorage.getItem(LOCAL_LISTINGS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Listing[]
  } catch {
    return []
  }
}

function setLocalListings(listings: Listing[]) {
  localStorage.setItem(LOCAL_LISTINGS_KEY, JSON.stringify(listings))
  window.dispatchEvent(new Event('listings-updated'))
}

function initLocalListingsFromSeed(seed: Listing[]) {
  if (!localStorage.getItem(LOCAL_LISTINGS_KEY)) {
    setLocalListings(seed)
  }
}

async function loadSeedListings(): Promise<Listing[]> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/listings.json`)
  return response.json()
}

async function callDevAction(
  password: string,
  action: DevAction,
  payload?: Record<string, unknown>
) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase is not configured')
  }

  const { data, error } = await supabase.functions.invoke('dev-action', {
    body: { password, action, payload },
  })

  if (error) throw error
  if (data?.error) throw new Error(data.error)
  return data
}

export async function verifyDevPassword(password: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const result = await callDevAction(password, 'verify_dev')
    if (result?.success) {
      setStoredDevPassword(password)
      setDevAuthenticated(true)
      return true
    }
    return false
  }

  if (password === '1052M1') {
    setStoredDevPassword(password)
    setDevAuthenticated(true)
    return true
  }
  return false
}

export async function createListing(
  password: string,
  listing: { name: string; price: number; image_url: string; available: boolean }
): Promise<Listing> {
  if (isSupabaseConfigured && supabase) {
    const result = await callDevAction(password, 'create_listing', listing)
    return result.listing as Listing
  }

  const seed = await loadSeedListings()
  initLocalListingsFromSeed(seed)
  const newListing: Listing = {
    id: crypto.randomUUID(),
    ...listing,
    created_at: new Date().toISOString(),
  }
  const updated = [newListing, ...getLocalListings()]
  setLocalListings(updated)
  return newListing
}

export async function updateListing(
  password: string,
  id: string,
  updates: Partial<Pick<Listing, 'name' | 'price' | 'image_url' | 'available'>>
): Promise<Listing> {
  if (isSupabaseConfigured && supabase) {
    const result = await callDevAction(password, 'update_listing', { id, ...updates })
    return result.listing as Listing
  }

  const listings = getLocalListings()
  const index = listings.findIndex((l) => l.id === id)
  if (index === -1) throw new Error('Listing not found')
  const updated = { ...listings[index], ...updates }
  listings[index] = updated
  setLocalListings(listings)
  return updated
}

export async function deleteListing(password: string, id: string) {
  if (isSupabaseConfigured && supabase) {
    await callDevAction(password, 'delete_listing', { id })
    return
  }

  setLocalListings(getLocalListings().filter((l) => l.id !== id))
}

export async function uploadListingImage(password: string, file: File): Promise<string> {
  if (isSupabaseConfigured && supabase) {
    const ext = file.name.split('.').pop() ?? 'jpg'
    const fileName = `${crypto.randomUUID()}.${ext}`
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(',')[1] ?? '')
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    const result = await callDevAction(password, 'upload_image', {
      fileName,
      contentType: file.type || 'image/jpeg',
      base64,
    })
    return result.url as string
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function getLocalListingsOverride(): Listing[] | null {
  if (isSupabaseConfigured) return null
  const local = getLocalListings()
  return local.length > 0 ? local : null
}

export async function ensureLocalListingsInitialized(): Promise<Listing[]> {
  const seed = await loadSeedListings()
  initLocalListingsFromSeed(seed)
  return getLocalListings()
}
