"use client"

import { useCallback, useMemo, useState } from "react"
import type { Card as CardType } from "@prisma/client"
import { toChunks, buildBank, shuffle } from "@/shared/client/lib/chunk-text"
import { useRecordStudySession } from "@/entities/study-session/lib/use-record-study-session"
import { useResumableQueue } from "@/entities/study-session/lib/use-resumable-queue"
import type { FinishStats } from "@/shared/client/types"

type Chunk = { id: string; text: string }

type UsePuzzleFlowArgs = {
  deckId: string
  cards: CardType[]
  onFinish: (stats: FinishStats) => void
}

export function usePuzzleFlow({ deckId, cards, onFinish }: UsePuzzleFlowArgs) {
  const {
    queue,
    setQueue,
    correctCount,
    setCorrectCount,
    totalAnswered,
    setTotalAnswered,
    clearProgress,
  } = useResumableQueue(deckId, "puzzle", cards)

  const [wrongFlash, setWrongFlash] = useState(false)
  const [bank, setBank] = useState<Chunk[]>([])
  const [answer, setAnswer] = useState<Chunk[]>([])
  const [prevCardId, setPrevCardId] = useState<string | undefined>(undefined)

  const current = queue[0]
  const isFinished = cards.length > 0 && queue.length === 0

  const { reset: resetRecording } = useRecordStudySession(deckId, isFinished)

  const correctChunks = useMemo(
    () => (current ? toChunks(current.definition) : []),
    [current]
  )

  if (current && current.id !== prevCardId) {
    setPrevCardId(current.id)
    const others = cards.filter((c) => c.id !== current.id).map((c) => c.definition)
    const bankTexts = buildBank(toChunks(current.definition), others)
    setBank(bankTexts.map((txt, i) => ({ id: `${i}-${txt}`, text: txt })))
    setAnswer([])
  }

  const progress = cards.length > 0 ? (correctCount / cards.length) * 100 : 0

  const moveToAnswer = useCallback((chunk: Chunk) => {
    setBank((b) => b.filter((c) => c.id !== chunk.id))
    setAnswer((a) => [...a, chunk])
  }, [])

  const moveToBank = useCallback((chunk: Chunk) => {
    setAnswer((a) => a.filter((c) => c.id !== chunk.id))
    setBank((b) => [...b, chunk])
  }, [])

  const separator = current && current.definition.includes(" ") ? " " : ""

  const finishCard = useCallback(
    (isCorrect: boolean) => {
      if (!current) return
      setTotalAnswered((n) => n + 1)
      if (isCorrect) setCorrectCount((n) => n + 1)

      if (!isCorrect) {
        setWrongFlash(true)
        setTimeout(() => setWrongFlash(false), 400)
        setBank((b) => shuffle([...b, ...answer]))
      }

      setQueue((prev) => {
        const [, ...rest] = prev
        return isCorrect ? rest : [...rest, current]
      })
      setAnswer([])
    },
    [current, answer, setTotalAnswered, setCorrectCount, setQueue]
  )

  const check = useCallback(() => {
    if (!current) return
    const assembled = answer.map((c) => c.text).join(separator)
    finishCard(assembled === current.definition.trim())
  }, [current, answer, separator, finishCard])

  if (isFinished) {
    resetRecording()
    clearProgress()
    onFinish({ correct: correctCount, total: totalAnswered })
  }

  return {
    current,
    queueLength: queue.length,
    isFinished,
    progress,
    bank,
    answer,
    wrongFlash,
    isReady: answer.length === correctChunks.length,
    moveToAnswer,
    moveToBank,
    check,
  }
}