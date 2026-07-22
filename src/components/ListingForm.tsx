import { FormEvent, useEffect, useState } from 'react'
import type { Listing } from '../types'
import { getStoredDevPassword } from '../lib/devApi'
import { resolveImageUrl } from '../lib/supabase'

interface ListingFormProps {
  initial?: Listing
  onSubmit: (data: {
    name: string
    price: number
    image_url: string
    available: boolean
    imageFile?: File
  }) => Promise<void>
  onDelete?: () => Promise<void>
  submitLabel?: string
}

export function ListingForm({
  initial,
  onSubmit,
  onDelete,
  submitLabel = 'Save Listing',
}: ListingFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [price, setPrice] = useState(initial?.price?.toString() ?? '')
  const [available, setAvailable] = useState(initial?.available ?? true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState(initial?.image_url ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initial) {
      setName(initial.name)
      setPrice(initial.price.toString())
      setAvailable(initial.available)
      setPreview(initial.image_url)
    }
  }, [initial])

  const handleFileChange = (file: File | null) => {
    setImageFile(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !price || (!preview && !imageFile)) {
      setError('Name, price, and image are required.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await onSubmit({
        name: name.trim(),
        price: Number(price),
        image_url: preview,
        available,
        imageFile: imageFile ?? undefined,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (!getStoredDevPassword()) {
    return (
      <p className="text-sm text-muted">Dev session expired. Click dev and log in again.</p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted">
          Image
        </label>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          {preview && (
            <img
              src={imageFile ? preview : resolveImageUrl(preview)}
              alt="Preview"
              className="h-40 w-32 object-cover border border-border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-muted file:mr-4 file:border file:border-border file:bg-transparent file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.12em] file:text-paper"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted">
          Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-border bg-transparent px-4 py-3 text-sm text-paper outline-none focus:border-paper/50"
          placeholder="Vintage Tee"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.15em] text-muted">
          Price (JOD)
        </label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-border bg-transparent px-4 py-3 text-sm text-paper outline-none focus:border-paper/50"
        />
      </div>

      <div className="flex items-center justify-between border border-border px-4 py-3">
        <span className="text-sm text-paper">
          Status: {available ? 'Available' : 'Purchased'}
        </span>
        <button
          type="button"
          onClick={() => setAvailable((v) => !v)}
          className="border border-paper px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-paper transition-colors hover:bg-paper hover:text-ink"
        >
          Toggle
        </button>
      </div>

      {error && <p className="text-xs uppercase tracking-[0.12em] text-red-400">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="border border-paper bg-paper px-6 py-3 text-xs uppercase tracking-[0.18em] text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Saving…' : submitLabel}
        </button>

        {onDelete && (
          <button
            type="button"
            disabled={loading}
            onClick={async () => {
              if (!confirm('Delete this listing?')) return
              setLoading(true)
              try {
                await onDelete()
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Delete failed.')
                setLoading(false)
              }
            }}
            className="border border-red-900/60 px-6 py-3 text-xs uppercase tracking-[0.18em] text-red-400 transition-colors hover:border-red-400"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  )
}
