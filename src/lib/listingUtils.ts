import type { Listing } from '../types'

export function getListingImages(listing: Listing): string[] {
  if (listing.images && listing.images.length > 0) {
    return listing.images
  }
  if (listing.image_url) {
    return [listing.image_url]
  }
  return []
}

export function normalizeListing(listing: Listing): Listing {
  const images = getListingImages(listing)
  return {
    ...listing,
    images,
    image_url: images[0] ?? listing.image_url,
  }
}

export function normalizeListings(listings: Listing[]): Listing[] {
  return listings.map(normalizeListing)
}
