import { motion } from 'framer-motion'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ListingForm } from '../components/ListingForm'
import { useDevAuth } from '../hooks/useDevAuth'
import { useListings } from '../hooks/useListings'
import {
  deleteListing,
  getStoredDevPassword,
  updateListing,
  uploadListingImage,
} from '../lib/devApi'

export function EditListing() {
  const { id } = useParams<{ id: string }>()
  const { isDev } = useDevAuth()
  const { listings, loading } = useListings()
  const navigate = useNavigate()

  if (!isDev) return <Navigate to="/" replace />

  const listing = listings.find((l) => l.id === id)

  if (loading) {
    return <p className="px-5 py-16 text-center text-muted">Loading…</p>
  }

  if (!listing) {
    return (
      <div className="px-5 py-16 text-center">
        <p className="text-muted">Listing not found.</p>
        <Link to="/" className="mt-4 inline-block text-sm text-paper underline">
          Go home
        </Link>
      </div>
    )
  }

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
      <h1 className="font-display text-3xl text-paper">Edit Listing</h1>
      <p className="mt-2 text-sm text-muted">Update details or mark as purchased.</p>

      <div className="mt-8">
        <ListingForm
          initial={listing}
          submitLabel="Save Changes"
          onSubmit={async (data) => {
            const password = getStoredDevPassword()
            if (!password) throw new Error('Dev session expired')

            let imageUrl = data.image_url
            if (data.imageFile) {
              imageUrl = await uploadListingImage(password, data.imageFile)
            }

            await updateListing(password, listing.id, {
              name: data.name,
              price: data.price,
              image_url: imageUrl,
              available: data.available,
            })

            navigate('/')
          }}
          onDelete={async () => {
            const password = getStoredDevPassword()
            if (!password) throw new Error('Dev session expired')
            await deleteListing(password, listing.id)
            navigate('/')
          }}
        />
      </div>
    </motion.section>
  )
}
