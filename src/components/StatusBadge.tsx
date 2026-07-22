import { motion } from 'framer-motion'

interface StatusBadgeProps {
  available: boolean
}

export function StatusBadge({ available }: StatusBadgeProps) {
  return (
    <motion.span
      key={available ? 'available' : 'purchased'}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25 }}
      className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] font-medium border ${
        available
          ? 'border-paper/40 text-paper bg-paper/5'
          : 'border-muted text-muted bg-muted/10'
      }`}
    >
      {available ? 'Available' : 'Purchased'}
    </motion.span>
  )
}
