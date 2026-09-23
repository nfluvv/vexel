"use client"

import { useEffect } from "react"
import { useRecordStudySession } from "@/entities/study-session/lib/use-record-study-session"
import { useShake } from "@/shared/client/hooks/use-shake"
import { useHaptics } from "@/shared/client/hooks/use-haptics"
import type { FinishStats } from '@/shared/client/types'

type UseGameSessionParams = {
  deckId: string
  isFinished: boolean
  timeLeft: number
  correct: number
  total: number
  onFinish: (stats: FinishStats) => void
}

export function useGameSession({
  deckId,
  isFinished,
  timeLeft,
  correct,
  total,
  onFinish,
}: UseGameSessionParams) {
  const { shaking, trigger: triggerShake } = useShake()
  const { vibrate } = useHaptics()
  const { reset: resetRecording } = useRecordStudySession(deckId, isFinished)

  useEffect(() => {
    if (timeLeft === 0) triggerShake()
  }, [timeLeft, triggerShake])

  useEffect(() => {
    if (!isFinished) return
    resetRecording()
    onFinish({ correct, total })
  }, [isFinished, correct, total, onFinish, resetRecording])

  const registerCorrect = (combo: number) => {
    vibrate(combo >= 3 && combo % 3 === 0 ? "success" : "light")
  }

  const registerWrong = () => {
    triggerShake()
    vibrate("error")
  }

  return { shaking, registerCorrect, registerWrong }
}