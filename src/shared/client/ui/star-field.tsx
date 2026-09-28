import type { CSSProperties } from "react"
import { createStarField } from "@/shared/client/lib/star-field"

interface StarFieldProps {
  count?: number
  seed?: number
}

function StarShape({ type, size }: { type: number; size: string }) {
  const sizeNum = parseFloat(size)
  
  switch (type) {
    case 0:
      return (
        <svg width={sizeNum} height={sizeNum} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      )
    
    case 1:
      return (
        <svg width={sizeNum} height={sizeNum} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L15 8L24 9L17 15L19 24L12 19L5 24L7 15L0 9L9 8L12 0Z" />
        </svg>
      )
    
    case 2:
      return (
        <svg width={sizeNum} height={sizeNum} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L13.5 7L20 4L17 10.5L24 12L17 13.5L20 20L13.5 17L12 24L10.5 17L4 20L7 13.5L0 12L7 10.5L4 4L10.5 7L12 0Z" />
        </svg>
      )
    
    case 3:
      return (
        <div
          className="rounded-full"
          style={{
            width: size,
            height: size,
            background: 'radial-gradient(circle, currentColor 0%, transparent 70%)',
            boxShadow: `0 0 ${sizeNum * 2}px currentColor`,
          }}
        />
      )
    
    case 4:
      return (
        <svg width={sizeNum} height={sizeNum} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      )
    
    case 5:
      return (
        <svg width={sizeNum} height={sizeNum} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L24 12L12 24L0 12L12 0ZM12 4L4 12L12 20L20 12L12 4Z" />
        </svg>
      )
    
    case 6:
      return (
        <svg width={sizeNum} height={sizeNum} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L12.5 10L24 12L12.5 14L12 24L11.5 14L0 12L11.5 10L12 0Z" />
        </svg>
      )
    
    default:
      return (
        <div
          className="rounded-full"
          style={{
            width: size,
            height: size,
            background: 'radial-gradient(circle, currentColor 0%, transparent 60%)',
            boxShadow: `0 0 ${sizeNum * 3}px currentColor, 0 0 ${sizeNum}px rgba(255, 255, 255, 0.5)`,
          }}
        />
      )
  }
}
export function StarField({ count = 60, seed = 1 }: StarFieldProps) {
  const stars = createStarField(count, seed)
  
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {stars.map((star, i) => {
        const starType = i % 4
        const hue = 40 + (i % 20) * 2 
        const color = `hsl(${hue}, 80%, 85%)`
        
        return (
          <span
            key={i}
            className="absolute animate-star-twinkle text-foreground"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              color: color,
              opacity: star.opacity,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
              filter: 'drop-shadow(0 0 4px currentColor)',
            } as CSSProperties}
          >
            <StarShape type={starType} size={String(star.size)} />
          </span>
        )
      })}
    </div>
  )
}