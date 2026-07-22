import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ImageZoom } from '../components/ImageZoom'
import { StatusBadge } from '../components/StatusBadge'
import { useCart } from '../hooks/useCart'
import { useListings } from '../hooks/useListings'
import { getListingImages } from '../lib/listingUtils'
import { resolveImageUrl } from '../lib/supabase'

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { listings, loading } = useListings()
  const { addItem, items } = useCart()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [added, setAdded] = useState(false)

  const listing = listings.find((l) => l.id === id)

  if (loading) {
    return <p className="px-5 py-16 text-center text-muted">Loading…</p>
  }

  if (!listing) {
    return <Navigate to="/" replace />
  }

  const images = getListingImages(listing)
  const activeImage = images[selectedIndex] ?? images[0]
  const disabled = !listing.available
  const inCart = items.some((item) => item.id === listing.id)

  const handleAddToCart = () => {
    if (disabled) return
    addItem(listing)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14"
    >
      <Link
        to="/"
        className="mb-8 inline-block text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-paper"
      >
        ← Back to shop
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <ImageZoom
            src={activeImage}
            alt={listing.name}
            className="aspect-[4/5] w-full border border-border/70"
          />

          {images.length > 1 && (
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {images.map((img, index) => (
                <button
                  key={img + index}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  className={`relative h-20 w-16 shrink-0 overflow-hidden border transition-all ${
                    selectedIndex === index
                      ? 'border-paper opacity-100'
                      : 'border-border opacity-60 hover:opacity-90'
                  }`}
                >
                  <img
                    src={resolveImageUrl(img)}
                    alt={`${listing.name} view ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-3xl text-paper md:text-4xl">{listing.name}</h1>
            <StatusBadge available={listing.available} />
          </div>

          <p className="mt-4 font-display text-2xl text-paper">{listing.price} JOD</p>

          <p className="mt-6 text-sm leading-relaxed text-muted">
            One-of-a-kind vintage piece from 1upthrift.jo. Each item is unique — once it&apos;s gone,
            it&apos;s gone.
          </p>

          {images.length > 1 && (
            <p className="mt-4 text-xs uppercase tracking-[0.15em] text-muted">
              {images.length} photos — hover main image to zoom
            </p>
          )}

          <motion.button
            type="button"
            disabled={disabled}
            whileHover={disabled ? undefined : { scale: 1.01 }}
            whileTap={disabled ? undefined : { scale: 0.98 }}
            onClick={handleAddToCart}
            className={`mt-10 w-full border py-4 text-xs uppercase tracking-[0.22em] transition-colors ${
              disabled
                ? 'cursor-not-allowed border-border text-muted'
                : inCart || added
                  ? 'border-paper/50 bg-paper/10 text-paper'
                  : 'border-paper bg-paper text-ink hover:opacity-90'
            }`}
          >
            {disabled ? 'Purchased' : added || inCart ? 'Added to Cart' : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
    </motion.section>
  )
}
