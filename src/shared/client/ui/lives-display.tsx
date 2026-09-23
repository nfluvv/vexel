"use client"

import { Heart } from "lucide-react"
import { cn } from "@/shared/client/lib/utils"

type LivesDisplayProps = {
  lives: number
  maxLives: number
}

export function LivesDisplay({ lives, maxLives }: LivesDisplayProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxLives }).map((_, i) => {
        const filled = i < lives
        return (
          <Heart
            key={`${i}-${filled}`}
            className={cn(
              "size-5 transition-transform",
              filled
                ? "fill-destructive text-destructive animate-heart-pop"
                : "fill-none text-muted-foreground/25"
            )}
          />
        )
      })}
    </div>
  )
}