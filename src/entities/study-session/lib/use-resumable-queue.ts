"use client"

import { useEffect, useState } from "react"
import type { Card as CardType } from "@prisma/client"

type SavedProgress = {
  remainingIds: string[]
  correctCount: number
  totalAnswered: number
}

function storageKey(deckId: string, mode: string) {
  return `study-progress:${deckId}:${mode}`
}

export function useResumableQueue(
  deckId: string,
  mode: string,
  allCards: CardType[]
) {
  const [queue, setQueue] = useState<CardType[]>(() => [...allCards])
  const [correctCount, setCorrectCount] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)

  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(deckId, mode))
      if (raw) {
        const saved: SavedProgress = JSON.parse(raw)

        const byId = new Map(allCards.map((c) => [c.id, c]))
        const restoredQueue = saved.remainingIds
          .map((id) => byId.get(id))
          .filter((c): c is CardType => !!c)

        if (restoredQueue.length > 0) {
          setTimeout(() => {
            setQueue(restoredQueue)
            setCorrectCount(saved.correctCount)
            setTotalAnswered(saved.totalAnswered)
            setIsHydrated(true)
          }, 0)
          return
        }
      }
    } catch {}

    setTimeout(() => setIsHydrated(true), 0)
  }, [deckId, mode, allCards])

  useEffect(() => {
    if (!isHydrated || queue.length === 0) return

    const payload: SavedProgress = {
      remainingIds: queue.map((c) => c.id),
      correctCount,
      totalAnswered,
    }
    try {
      localStorage.setItem(storageKey(deckId, mode), JSON.stringify(payload))
    } catch {}
  }, [deckId, mode, queue, correctCount, totalAnswered, isHydrated])

  const clearProgress = () => {
    try {
      localStorage.removeItem(storageKey(deckId, mode))
    } catch {}
  }

  return {
    queue,
    setQueue,
    correctCount,
    setCorrectCount,
    totalAnswered,
    setTotalAnswered,
    clearProgress,
    isHydrated,
  }
}
