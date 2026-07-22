import { useState } from 'react'
import { resolveImageUrl } from '../lib/supabase'

interface ImageZoomProps {
  src: string
  alt: string
  className?: string
}

export function ImageZoom({ src, alt, className = '' }: ImageZoomProps) {
  const [zooming, setZooming] = useState(false)
  const [origin, setOrigin] = useState({ x: 50, y: 50 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setOrigin({ x, y })
  }

  return (
    <div
      className={`relative overflow-hidden bg-paper/5 ${className}`}
      onMouseEnter={() => setZooming(true)}
      onMouseLeave={() => {
        setZooming(false)
        setOrigin({ x: 50, y: 50 })
      }}
      onMouseMove={handleMove}
    >
      <img
        src={resolveImageUrl(src)}
        alt={alt}
        draggable={false}
        className="h-full w-full object-cover transition-transform duration-300 ease-out"
        style={{
          transform: zooming ? 'scale(2.2)' : 'scale(1)',
          transformOrigin: `${origin.x}% ${origin.y}%`,
        }}
      />
    </div>
  )
}
