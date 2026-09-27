"use client"

import { useCallback, useState } from "react"
import type { Card as CardType } from "@prisma/client"
import { isCloseEnough } from "@/shared/client/lib/levenshtein"
import { useRecordStudySession } from "@/entities/study-session/lib/use-record-study-session"
import { useResumableQueue } from "@/entities/study-session"
import type { FinishStats } from "@/shared/client/types"

type Result = "exact" | "typo" | "wrong" | null

type UseLearnFlowArgs = {
  deckId: string
  cards: CardType[]
  onFinish: (stats: FinishStats) => void
}

export function useLearnFlow({ deckId, cards, onFinish }: UseLearnFlowArgs) {
  const {
    queue,
    setQueue,
    correctCount,
    setCorrectCount,
    totalAnswered,
    setTotalAnswered,
    clearProgress,
  } = useResumableQueue(deckId, "learn", cards)

  const [answer, setAnswer] = useState("")
  const [result, setResult] = useState<Result>(null)

  const current = queue[0]
  const isFinished = cards.length > 0 && queue.length === 0
  const isPending = result === null

  const progress =
    cards.length > 0
      ? Math.round(((cards.length - queue.length) / cards.length) * 100)
      : 0

  const { reset: resetRecording } = useRecordStudySession(deckId, isFinished)

  const finish = useCallback(
    (correct: number, total: number) => {
      resetRecording()
      clearProgress()
      onFinish({ correct, total })
    },
    [onFinish, resetRecording, clearProgress]
  )

  const check = useCallback(() => {
    if (!current) return
    const verdict = isCloseEnough(answer, current.definition)
    setResult(verdict)
    setTotalAnswered((n) => n + 1)
    if (verdict !== "wrong") setCorrectCount((n) => n + 1)
  }, [current, answer, setTotalAnswered, setCorrectCount])

  const next = useCallback(() => {
    if (!current) return

    const nextQueue = queue.slice(1)

    if (result !== "wrong" && nextQueue.length === 0) {
      finish(correctCount + 1, totalAnswered + 1)
      return
    }

    setQueue((prev) => {
      const [, ...rest] = prev
      return result === "wrong" ? [...rest, current] : rest
    })

    setAnswer("")
    setResult(null)
  }, [current, queue, result, correctCount, totalAnswered, finish, setQueue])

  const submit = useCallback(() => {
    if (isPending) {
      check()
    } else {
      next()
    }
  }, [isPending, check, next])

  return {
    current,
    queueLength: queue.length,
    isFinished,
    isPending,
    progress,
    answer,
    setAnswer,
    result,
    submit,
  }
}
