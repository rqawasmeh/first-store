import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import { resolveImageUrl } from '../lib/supabase'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, total } = useCart()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-ink shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-xl text-paper">Your Cart</h2>
              <button
                type="button"
                onClick={onClose}
                className="text-sm uppercase tracking-[0.15em] text-muted transition-colors hover:text-paper"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted">Your cart is empty.</p>
              ) : (
                <ul className="space-y-4">
                  {items.map((item, index) => (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex gap-4 border border-border/60 p-3"
                    >
                      <img
                        src={resolveImageUrl(item.image_url)}
                        alt={item.name}
                        className="h-20 w-16 object-cover"
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="text-sm text-paper">{item.name}</p>
                          <p className="text-xs text-muted">{item.price} JOD</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="self-start text-[10px] uppercase tracking-[0.15em] text-muted transition-colors hover:text-paper"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-border px-5 py-5">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="uppercase tracking-[0.15em] text-muted">Total</span>
                  <span className="font-display text-lg text-paper">{total} JOD</span>
                </div>
                <button
                  type="button"
                  className="w-full border border-paper bg-paper py-3.5 text-xs uppercase tracking-[0.22em] text-ink transition-opacity hover:opacity-90"
                >
                  Claim on WhatsApp
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
