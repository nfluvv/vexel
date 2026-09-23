"use client"

import { cn } from "@/shared/client/lib/utils"

type FlipCardProps = {
  front: string
  back: string
  flipped: boolean
  onToggle: () => void
  onFlipEnd?: () => void
  disabled?: boolean
  onTouchStart?: (e: React.TouchEvent) => void
  onTouchEnd?: (e: React.TouchEvent) => void
}

export function FlipCard({
  front,
  back,
  flipped,
  onToggle,
  onFlipEnd,
  disabled,
  onTouchStart,
  onTouchEnd,
}: FlipCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      onClick={() => !disabled && onToggle()}
      onKeyDown={(e) => {
        if (disabled) return
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onToggle()
        }
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={cn(
        "h-64 select-none perspective-distant",
        disabled ? "pointer-events-none cursor-default" : "cursor-pointer"
      )}
    >
      <div
        className={cn(
          "relative h-full w-full transition-transform duration-300 ease-in-out transform-3d",
          flipped && "transform-[rotateY(180deg)]"
        )}
        onTransitionEnd={(e) => {
          if (e.propertyName === "transform") onFlipEnd?.()
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl border border-border/60 bg-card p-6 text-center text-lg font-medium backface-hidden">
          {front}
        </div>
        <div className="absolute inset-0 flex transform-[rotateY(180deg)] items-center justify-center rounded-2xl border border-primary/40 bg-card p-6 text-center text-lg font-medium backface-hidden">
          {back}
        </div>
      </div>
    </div>
  )
}
