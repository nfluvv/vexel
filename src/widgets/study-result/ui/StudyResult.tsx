"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { Container } from "@/shared/client/ui"
import { getTier } from "@/entities/study-session/lib/tier"
import { TierBadge } from "./tier-badge"
import { useCountUp } from "@/shared/client/hooks/use-count-up"
import { useConfetti } from "@/shared/client/hooks/use-confetti"
import { useHaptics } from "@/shared/client/hooks/use-haptics"

export type FinishStats = { correct: number; total: number }

type StudyResultProps = {
  title: string
  description: string
  badge?: ReactNode
  children: ReactNode
  correct: number
  total: number
}

export function StudyResult({
  title,
  description,
  badge,
  children,
  correct,
  total,
}: StudyResultProps) {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0
  const tier = getTier(correct, total)
  const animatedPct = useCountUp(percentage)

  const celebrate = tier === "S" || tier === "A"
  useConfetti(celebrate)

  const { vibrate } = useHaptics()
  useEffect(() => {
    vibrate(celebrate ? "success" : "light")
  }, [celebrate, vibrate])

  return (
    <main className="mx-auto max-w-xl py-10 sm:py-16">
      <Container>
        <div className="flex flex-col items-center text-center">
          <TierBadge tier={tier} />

          <div className="mt-6 space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {title}
            </h2>
            <p className="mx-auto max-w-sm text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>

          <p className="mt-4 text-5xl font-black tabular-nums">
            {animatedPct}
            <span className="text-2xl text-muted-foreground">%</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {correct} / {total}
          </p>

          {badge && <div className="mt-7">{badge}</div>}

          <div className="mt-8 w-full max-w-sm">{children}</div>
        </div>
      </Container>
    </main>
  )
}