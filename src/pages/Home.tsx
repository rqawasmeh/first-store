import { motion } from 'framer-motion'
import { Hero } from '../components/Hero'
import { ProductCard } from '../components/ProductCard'
import { useCart } from '../hooks/useCart'
import { useDevAuth } from '../hooks/useDevAuth'
import { useListings } from '../hooks/useListings'
import type { Listing } from '../types'

export function Home() {
  const { listings, loading, error } = useListings()
  const { addItem } = useCart()
  const { isDev } = useDevAuth()

  const handleAddToCart = (listing: Listing) => {
    if (!listing.available) return
    addItem(listing)
  }

  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10 flex items-end justify-between border-b border-border/60 pb-4"
        >
          <h2 className="font-display text-2xl text-paper md:text-3xl">Current Drops</h2>
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            {listings.length} pieces
          </p>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse border border-border bg-paper/5" />
            ))}
          </div>
        )}

        {error && (
          <p className="border border-red-900/50 px-4 py-3 text-sm text-red-300">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing, index) => (
              <ProductCard
                key={listing.id}
                listing={listing}
                index={index}
                isDev={isDev}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
