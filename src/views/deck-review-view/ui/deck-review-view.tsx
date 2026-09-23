"use client"

import { useState, useCallback, useRef } from "react"
import { useRouter } from "@/shared/i18n/navigation"
import type { Card as CardType, Deck } from "@prisma/client"
import { useTranslations } from "next-intl"
import { Container } from "@/shared/client/ui"
import { FlipCard } from "@/entities/study-card"
import { reviewCardAction } from "@/entities/card-progress/api/actions"
import type { Quality } from "@/entities/card-progress/lib/sm2"
import { useTextToSpeech, SpeakButton } from "@/features/card-speech"
import { useRecordStudySession } from "@/entities/study-session/lib/use-record-study-session"
import { useKeyboardShortcuts } from "@/shared/client/hooks/use-keyboard-shortcuts"

type DeckReviewViewProps = {
  deck: Deck
  dueCards: CardType[]
}

const QUALITY_BUTTONS: {
  quality: Quality
  labelKey: string
}[] = [
  { quality: 0, labelKey: "again" },
  { quality: 1, labelKey: "hard" },
  { quality: 2, labelKey: "good" },
  { quality: 3, labelKey: "easy" },
]

type PendingAction = { remaining: CardType[] } | "finish" | null

export function DeckReviewView({ deck, dueCards }: DeckReviewViewProps) {
  const [queue, setQueue] = useState(dueCards)
  const [flipped, setFlipped] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const pendingRef = useRef<PendingAction>(null)

  const t = useTranslations("study")
  const router = useRouter()
  const { speak, isSpeaking, stop: stopSpeaking } = useTextToSpeech()

  const current = queue[0]
  useRecordStudySession(deck.id, queue.length === 0 && dueCards.length > 0)

  const handleGrade = useCallback(
    async (quality: Quality) => {
      if (!current || isPending || isAnimating) return
      setIsPending(true)
      stopSpeaking?.()

      try {
        await reviewCardAction(current.id, quality)

        const remaining = queue.slice(1)
        pendingRef.current = remaining.length === 0 ? "finish" : { remaining }

        setIsAnimating(true)
        setFlipped(false)
      } catch (error) {
        setIsPending(false)
        throw error
      }
    },
    [current, isPending, isAnimating, queue, stopSpeaking]
  )

  const handleFlipEnd = useCallback(() => {
    const action = pendingRef.current
    pendingRef.current = null
    setIsAnimating(false)
    setIsPending(false)

    if (action === "finish") {
      router.replace(`/decks/${deck.id}`)
      return
    }
    if (action) setQueue(action.remaining)
  }, [deck.id, router])

  const toggleFlip = useCallback(() => {
    if (isAnimating || isPending) return
    setFlipped((f) => !f)
  }, [isAnimating, isPending])

  useKeyboardShortcuts(
    {
      Space: (e) => {
        e.preventDefault()
        toggleFlip()
      },
      Digit1: () => flipped && handleGrade(0),
      Digit2: () => flipped && handleGrade(1),
      Digit3: () => flipped && handleGrade(2),
      Digit4: () => flipped && handleGrade(3),
      KeyS: () => current && speak(flipped ? current.definition : current.term),
    },
    !!current
  )

  return (
    <main className="mx-auto max-w-xl py-8">
      <Container>
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">{deck.title}</h1>
            <p className="text-sm text-muted-foreground">
              {t("dueCount", { count: queue.length })}
            </p>
          </div>
          <SpeakButton
            onSpeak={() => speak(flipped ? current.definition : current.term)}
            isSpeaking={isSpeaking}
          />
        </div>

        <FlipCard
          front={current.term}
          back={current.definition}
          flipped={flipped}
          onToggle={toggleFlip}
          onFlipEnd={handleFlipEnd}
          disabled={isAnimating || isPending}
        />

        <span className="sr-only" aria-live="polite">
          {flipped ? current.definition : current.term}
        </span>

        {!flipped ? (
          <button
            onClick={() => setFlipped(true)}
            disabled={isAnimating}
            className="mt-4 w-full rounded-full bg-primary py-2.5 font-medium text-primary-foreground disabled:opacity-40"
          >
            {t("showAnswer")}
          </button>
        ) : (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {QUALITY_BUTTONS.map(({ quality, labelKey }) => (
              <button
                key={quality}
                onClick={() => handleGrade(quality)}
                disabled={isPending || isAnimating}
                className="cursor-pointer rounded-full border border-border/70 bg-muted/40 py-2.5 text-sm font-medium text-foreground hover:border-foreground/20 hover:bg-muted disabled:cursor-default disabled:opacity-40"
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        )}
      </Container>
    </main>
  )
}
