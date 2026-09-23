"use client"

import { useCallback, useState } from "react"
import type { Card as CardType } from "@prisma/client"
import { useFlipTransition } from "@/shared/client/hooks/use-flip-transition"

type PendingAction = "next" | "prev" | "finish"

export function useBrowseNavigation(cards: CardType[], onFinish: () => void) {
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const card = cards[index]
  const isLastCard = index === cards.length - 1
  const progress = cards.length > 0 ? ((index + 1) / cards.length) * 100 : 0

  const { isAnimating, run, handleFlipEnd } = useFlipTransition<PendingAction>((action) => {
    if (action === "finish") return onFinish()
    if (action === "next") return setIndex((i) => i + 1)
    if (action === "prev") return setIndex((i) => Math.max(i - 1, 0))
  })

  const goNext = useCallback(() => {
    if (isAnimating) return
    if (flipped) {
      run(isLastCard ? "finish" : "next")
      setFlipped(false)
      return
    }
    if (isLastCard) return onFinish()
    setIndex((i) => i + 1)
  }, [flipped, isAnimating, isLastCard, run, onFinish])

  const goPrev = useCallback(() => {
    if (isAnimating || index === 0) return
    if (flipped) {
      run("prev")
      setFlipped(false)
      return
    }
    setIndex((i) => Math.max(i - 1, 0))
  }, [flipped, isAnimating, index, run])

  const toggleFlip = useCallback(() => {
    if (isAnimating) return
    setFlipped((f) => !f)
  }, [isAnimating])

  return {
    card,
    index,
    isLastCard,
    progress,
    flipped,
    isAnimating,
    handleFlipEnd,
    goNext,
    goPrev,
    toggleFlip,
  }
}