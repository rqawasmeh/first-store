import { useCallback, useEffect, useState } from 'react'
import type { CartItem, Listing } from '../types'

const CART_KEY = '1upthrift_cart'

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

function writeCart(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('cart-updated'))
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => readCart())

  useEffect(() => {
    const sync = () => setItems(readCart())
    window.addEventListener('cart-updated', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('cart-updated', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const addItem = useCallback((listing: Listing) => {
    const cart = readCart()
    if (cart.some((item) => item.id === listing.id)) return
    const next = [
      ...cart,
      {
        id: listing.id,
        name: listing.name,
        price: listing.price,
        image_url: listing.image_url,
      },
    ]
    writeCart(next)
    setItems(next)
  }, [])

  const removeItem = useCallback((id: string) => {
    const next = readCart().filter((item) => item.id !== id)
    writeCart(next)
    setItems(next)
  }, [])

  const clearCart = useCallback(() => {
    writeCart([])
    setItems([])
  }, [])

  const total = items.reduce((sum, item) => sum + item.price, 0)

  return { items, addItem, removeItem, clearCart, total, count: items.length }
}
