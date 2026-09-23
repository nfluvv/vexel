"use client"

import { LivesDisplay, ComboBadge, TimerRing } from "@/shared/client/ui"
import { LIVES, TIME_LIMIT_SEC } from "@/shared/config/study"

type GameHeaderProps = {
  lives: number
  combo: number
  timeLeft: number
}

export function GameHeader({ lives, combo, timeLeft }: GameHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <LivesDisplay lives={lives} maxLives={LIVES} />
      <ComboBadge combo={combo} />
      <TimerRing timeLeft={timeLeft} totalTime={TIME_LIMIT_SEC} />
    </div>
  )
}