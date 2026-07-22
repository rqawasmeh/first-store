import { motion } from 'framer-motion'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ListingForm } from '../components/ListingForm'
import { useDevAuth } from '../hooks/useDevAuth'
import {
  createListing,
  getStoredDevPassword,
  uploadListingImage,
} from '../lib/devApi'

export function AddListing() {
  const { isDev } = useDevAuth()
  const navigate = useNavigate()

  if (!isDev) return <Navigate to="/" replace />

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-xl px-5 py-12 md:px-8 md:py-16"
    >
      <Link
        to="/"
        className="mb-8 inline-block text-xs uppercase tracking-[0.15em] text-muted transition-colors hover:text-paper"
      >
        ← Back to shop
      </Link>
      <h1 className="font-display text-3xl text-paper">Add a Listing</h1>
      <p className="mt-2 text-sm text-muted">New items appear for everyone instantly.</p>

      <div className="mt-8">
        <ListingForm
          submitLabel="Add Listing"
          onSubmit={async (data) => {
            const password = getStoredDevPassword()
            if (!password) throw new Error('Dev session expired')

            let imageUrl = data.image_url
            if (data.imageFile) {
              imageUrl = await uploadListingImage(password, data.imageFile)
            }

            await createListing(password, {
              name: data.name,
              price: data.price,
              image_url: imageUrl,
              available: data.available,
            })

            navigate('/')
          }}
        />
      </div>
    </motion.section>
  )
}
