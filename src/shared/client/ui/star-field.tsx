import type { CSSProperties } from "react"
import { createStarField } from "@/shared/client/lib/star-field"

interface StarFieldProps {
  count?: number
  seed?: number
}

export function StarField({ count = 60, seed = 1 }: StarFieldProps) {
  const stars = createStarField(count, seed)
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-foreground motion-safe:animate-star-twinkle"
          style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size, opacity: star.opacity, animationDuration: `${star.duration}s`, animationDelay: `${star.delay}s` } as CSSProperties}
        />
      ))}
    </div>
  )
}