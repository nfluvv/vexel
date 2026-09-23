"use client"

import { useCallback, useEffect, useState } from "react"
import type { Card as CardType } from "@prisma/client"
import { isCloseEnough } from "@/shared/client/lib/levenshtein"
import { buildRounds, type Round } from "@/entities/study-card"
import { useGameSession } from "@/entities/study-session/lib/use-game-session"
import { LIVES, TIME_LIMIT_SEC, FEEDBACK_MS } from "@/shared/config/study"
import type { FinishStats } from "@/shared/client/types"

type Feedback = "correct" | "wrong" | null

type UseBlastGameArgs = {
  deckId: string
  cards: CardType[]
  onFinish: (stats: FinishStats) => void
}

export function useBlastGame({ deckId, cards, onFinish }: UseBlastGameArgs) {
  const [rounds] = useState<Round[]>(() => buildRounds(cards))
  const [index, setIndex] = useState(0)
  const [lives, setLives] = useState(LIVES)
  const [combo, setCombo] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [totalAnswered, setTotalAnswered] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SEC)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [locked, setLocked] = useState(false)

  const current = rounds[index]

  const isFinished =
    cards.length > 0 &&
    rounds.length > 0 &&
    (index >= rounds.length || lives <= 0 || timeLeft <= 0)

  const { shaking, registerCorrect, registerWrong } = useGameSession({
    deckId,
    isFinished,
    timeLeft,
    correct: correctCount,
    total: totalAnswered,
    onFinish,
  })

  useEffect(() => {
    if (isFinished || rounds.length === 0) return
    const timer = setInterval(() => setTimeLeft((s) => Math.max(s - 1, 0)), 1000)
    return () => clearInterval(timer)
  }, [isFinished, rounds.length])

  const [advancing, setAdvancing] = useState(false)

  const advance = useCallback(
    (isCorrect: boolean, onSettled: () => void) => {
      if (advancing) return
      setAdvancing(true)
      setLocked(true)
      setTotalAnswered((n) => n + 1)
      setFeedback(isCorrect ? "correct" : "wrong")

      if (isCorrect) {
        setCorrectCount((n) => n + 1)
        setCombo((c) => {
          const next = c + 1
          registerCorrect(next)
          return next
        })
      } else {
        setCombo(0)
        setLives((l) => l - 1)
        registerWrong()
      }

      setTimeout(() => {
        setFeedback(null)
        setLocked(false)
        setIndex((i) => i + 1)
        setAdvancing(false)
        onSettled()
      }, FEEDBACK_MS)
    },
    [advancing, registerCorrect, registerWrong]
  )

  const checkType = useCallback(
    (typeAnswer: string, onSettled: () => void) => {
      if (!current || current.kind !== "type" || locked) return
      const verdict = isCloseEnough(typeAnswer, current.card.definition)
      advance(verdict !== "wrong", onSettled)
    },
    [current, locked, advance]
  )

  const checkChoice = useCallback(
    (option: string, onSettled: () => void) => {
      if (!current || current.kind !== "choice" || locked) return
      advance(option === current.card.definition, onSettled)
    },
    [current, locked, advance]
  )

  const checkAssemble = useCallback(
    (assembled: string, onSettled: () => void) => {
      if (!current || current.kind !== "assemble" || locked) return
      advance(assembled === current.card.definition.trim(), onSettled)
    },
    [current, locked, advance]
  )

  return {
    current,
    isFinished,
    shaking,
    lives,
    combo,
    timeLeft,
    feedback,
    locked,
    checkType,
    checkChoice,
    checkAssemble,
  }
}