import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { resolveImageUrl } from '../lib/supabase'

export function CartPage() {
  const { items, removeItem, total } = useCart()

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-2xl px-5 py-12 md:px-8 md:py-16"
    >
      <Link
        to="/"
        className="mb-8 inline-block text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-paper"
      >
        ← Continue shopping
      </Link>

      <h1 className="font-display text-3xl text-paper">Cart</h1>

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Nothing in your cart yet.</p>
      ) : (
        <>
          <ul className="mt-8 space-y-4">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex gap-4 border border-border/70 p-4"
              >
                <img
                  src={resolveImageUrl(item.image_url)}
                  alt={item.name}
                  className="h-24 w-20 object-cover"
                />
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="text-paper">{item.name}</p>
                    <p className="text-sm text-muted">{item.price} JOD</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="self-start text-[10px] uppercase tracking-[0.15em] text-muted hover:text-paper"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-border pt-6">
            <div className="mb-5 flex justify-between text-sm">
              <span className="uppercase tracking-[0.15em] text-muted">Total</span>
              <span className="font-display text-xl text-paper">{total} JOD</span>
            </div>
            <button
              type="button"
              className="w-full border border-paper bg-paper py-4 text-xs uppercase tracking-[0.22em] text-ink"
            >
              Claim on WhatsApp
            </button>
          </div>
        </>
      )}
    </motion.section>
  )
}
