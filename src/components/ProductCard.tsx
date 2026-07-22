import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import type { Listing } from '../types'
import { resolveImageUrl } from '../lib/supabase'
import { StatusBadge } from './StatusBadge'

interface ProductCardProps {
  listing: Listing
  index: number
  isDev: boolean
  onAddToCart: (listing: Listing) => void
}

export function ProductCard({ listing, index, isDev, onAddToCart }: ProductCardProps) {
  const disabled = !listing.available

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden border border-border/70 bg-ink"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-paper/5">
        <motion.img
          src={resolveImageUrl(listing.image_url)}
          alt={listing.name}
          className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
            disabled ? 'opacity-40 grayscale' : ''
          }`}
          loading="lazy"
        />
        {disabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/50">
            <span className="font-display text-xl uppercase tracking-[0.2em] text-paper/70">
              Purchased
            </span>
          </div>
        )}
        {isDev && (
          <Link
            to={`/dev/edit/${listing.id}`}
            className="absolute right-3 top-3 border border-paper/30 bg-ink/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-paper opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
          >
            Edit
          </Link>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-lg text-paper md:text-xl">{listing.name}</h3>
            <p className="mt-1 text-sm text-muted">{listing.price} JOD</p>
          </div>
          <StatusBadge available={listing.available} />
        </div>

        <motion.button
          type="button"
          disabled={disabled}
          whileHover={disabled ? undefined : { scale: 1.01 }}
          whileTap={disabled ? undefined : { scale: 0.98 }}
          onClick={() => onAddToCart(listing)}
          className={`mt-auto w-full border py-3 text-xs uppercase tracking-[0.2em] transition-colors ${
            disabled
              ? 'cursor-not-allowed border-border text-muted'
              : 'border-paper text-paper hover:bg-paper hover:text-ink'
          }`}
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.article>
  )
}
