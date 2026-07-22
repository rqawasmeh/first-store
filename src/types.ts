export interface Listing {
  id: string
  name: string
  price: number
  image_url: string
  images?: string[]
  available: boolean
  created_at: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  image_url: string
}

export type DevAction =
  | 'verify_dev'
  | 'create_listing'
  | 'update_listing'
  | 'toggle_availability'
  | 'delete_listing'
  | 'upload_image'

export interface DevActionPayload {
  password: string
  action: DevAction
  payload?: Record<string, unknown>
}
