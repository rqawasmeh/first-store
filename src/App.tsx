import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { CartDrawer } from './components/CartDrawer'
import { DevLoginModal } from './components/DevLoginModal'
import { Header } from './components/Header'
import { AddListing } from './pages/AddListing'
import { CartPage } from './pages/CartPage'
import { EditListing } from './pages/EditListing'
import { Home } from './pages/Home'

function App() {
  const [devOpen, setDevOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-ink text-paper">
      <Header
        onDevClick={() => setDevOpen(true)}
        onCartClick={() => setCartOpen(true)}
      />

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/dev/add" element={<AddListing />} />
            <Route path="/dev/edit/:id" element={<EditListing />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      <footer className="border-t border-border/60 py-8 text-center text-xs uppercase tracking-[0.2em] text-muted">
        1upthrift.jo — Amman, Jordan
      </footer>

      <DevLoginModal open={devOpen} onClose={() => setDevOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}

export default App
