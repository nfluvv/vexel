"use client"

import type { Card as CardType, Deck } from "@prisma/client"
import { useTranslations } from "next-intl"
import { EmptyDeckState, ProgressBar } from "@/shared/client/ui"
import { cn } from "@/shared/client/lib/utils"
import { useTextToSpeech, SpeakButton } from "@/features/card-speech"
import { usePuzzleFlow } from "../model/use-puzzle-flow"
import type { FinishStats } from "@/shared/client/types"

type DeckPuzzleProps = {
  deck: Deck & { cards: CardType[] }
  onFinish: (stats: FinishStats) => void
}

export function DeckPuzzle({ deck, onFinish }: DeckPuzzleProps) {
  const t = useTranslations("study")
  const { speak, isSpeaking } = useTextToSpeech()

  const {
    current,
    queueLength,
    isFinished,
    progress,
    bank,
    answer,
    wrongFlash,
    isReady,
    moveToAnswer,
    moveToBank,
    check,
  } = usePuzzleFlow({ deckId: deck.id, cards: deck.cards, onFinish })

  if (deck.cards.length === 0) {
    return <EmptyDeckState message={t("emptyDeck")} />
  }

  if (isFinished || !current) return null

  return (
    <div>
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{deck.title}</h1>
          <p className="text-sm text-muted-foreground">
            {t("cardsLeft", { count: queueLength })}
          </p>
        </div>
        <SpeakButton onSpeak={() => speak(current.term)} isSpeaking={isSpeaking} />
      </div>

      <ProgressBar percent={progress} />

      <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-6">
        <p className="text-center text-lg font-medium">{current.term}</p>

        <div
          className={cn(
            "flex min-h-14 flex-wrap items-center gap-2 rounded-lg border border-dashed border-border/60 p-3",
            wrongFlash && "border-destructive/60 bg-destructive/10"
          )}
        >
          {answer.length === 0 && (
            <span className="text-sm text-muted-foreground">{t("assemblePlaceholder")}</span>
          )}
          {answer.map((chunk) => (
            <button
              key={chunk.id}
              onClick={() => moveToBank(chunk)}
              className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-medium"
            >
              {chunk.text}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {bank.map((chunk) => (
            <button
              key={chunk.id}
              onClick={() => moveToAnswer(chunk)}
              className="rounded-lg border border-border/60 bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted"
            >
              {chunk.text}
            </button>
          ))}
        </div>

        <button
          onClick={check}
          disabled={!isReady}
          className="w-full rounded-full bg-primary py-2.5 font-medium text-primary-foreground disabled:opacity-40"
        >
          {t("check")}
        </button>
      </div>
    </div>
  )
}