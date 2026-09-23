"use client"

type ComboBadgeProps = { combo: number }

export function ComboBadge({ combo }: ComboBadgeProps) {
  if (combo < 2) return null

  return (
    <span
      key={combo}
      className="animate-combo-pop rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-bold text-amber-500"
    >
      ×{combo} COMBO
    </span>
  )
}