"use client"

import { cn } from "@/shared/client/lib/utils"
import { TIER_STYLES, type Tier } from "@/entities/study-session/lib/tier"

type TierBadgeProps = { tier: Tier }

export function TierBadge({ tier }: TierBadgeProps) {
  const style = TIER_STYLES[tier]

  return (
    <div
      className={cn(
        "flex size-20 animate-tier-pop items-center justify-center rounded-2xl text-4xl font-black text-white shadow-lg",
        style.bg,
        style.glow && `shadow-xl ${style.glow}`
      )}
    >
      {tier}
    </div>
  )
}