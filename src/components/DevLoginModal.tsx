import { AnimatePresence, motion } from 'framer-motion'
import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDevAuth } from '../hooks/useDevAuth'

interface DevLoginModalProps {
  open: boolean
  onClose: () => void
}

export function DevLoginModal({ open, onClose }: DevLoginModalProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isDev } = useDevAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const ok = await login(password)
    setLoading(false)

    if (ok) {
      setPassword('')
      onClose()
      navigate('/')
      return
    }

    setError('Wrong password. Access denied.')
  }

  useEffect(() => {
    if (isDev && open) onClose()
  }, [isDev, open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={error ? { x: [0, -8, 8, -6, 6, 0], opacity: 1, scale: 1, y: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.3 }}
            className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-sm -translate-x-1/2 -translate-y-1/2 border border-border bg-ink p-6 shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl text-paper">Dev Access</h2>
            <p className="mt-2 text-sm text-muted">Enter the dev password to manage listings.</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="Password"
                autoFocus
                className="w-full border border-border bg-transparent px-4 py-3 text-sm text-paper outline-none transition-colors focus:border-paper/50"
              />

              {error && (
                <p className="text-xs uppercase tracking-[0.12em] text-red-400">{error}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-border py-3 text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-paper"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !password}
                  className="flex-1 border border-paper bg-paper py-3 text-xs uppercase tracking-[0.15em] text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Checking…' : 'Enter'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
