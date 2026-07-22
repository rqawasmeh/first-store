import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useDevAuth } from '../hooks/useDevAuth'

interface HeaderProps {
  onDevClick: () => void
  onCartClick: () => void
}

export function Header({ onDevClick, onCartClick }: HeaderProps) {
  const { count } = useCart()
  const { isDev } = useDevAuth()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 border-b border-border/80 bg-ink/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}logo/logo.png`}
            alt="1upthrift"
            className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-display text-lg tracking-wide text-paper md:text-xl">
            1upthrift<span className="text-muted">.jo</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 md:gap-6">
          <button
            type="button"
            onClick={onCartClick}
            className="relative text-sm uppercase tracking-[0.15em] text-paper/80 transition-colors hover:text-paper"
          >
            Cart
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -right-3 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-paper px-1 text-[10px] font-semibold text-ink"
              >
                {count}
              </motion.span>
            )}
          </button>

          {isDev && (
            <Link
              to="/dev/add"
              className="text-sm uppercase tracking-[0.15em] text-paper/80 transition-colors hover:text-paper"
            >
              Add a listing
            </Link>
          )}

          <button
            type="button"
            onClick={onDevClick}
            className="text-sm uppercase tracking-[0.15em] text-muted transition-colors hover:text-paper"
          >
            dev{isDev ? ' ✓' : ''}
          </button>
        </nav>
      </div>
    </motion.header>
  )
}
