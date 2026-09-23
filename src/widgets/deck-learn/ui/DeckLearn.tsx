"use client"

import type { Card as CardType, Deck } from "@prisma/client"
import { useTranslations } from "next-intl"
import { EmptyDeckState, ProgressBar } from "@/shared/client/ui"
import { cn } from "@/shared/client/lib/utils"
import { useTextToSpeech, SpeakButton } from "@/features/card-speech"
import { useLearnFlow } from "../model/use-learn-flow"
import type { FinishStats } from "@/shared/client/types"

type DeckLearnViewProps = {
  deck: Deck & { cards: CardType[] }
  onFinish: (stats: FinishStats) => void
}

export function DeckLearn({ deck, onFinish }: DeckLearnViewProps) {
  const t = useTranslations("study")
  const { speak, isSpeaking } = useTextToSpeech()

  const {
    current,
    queueLength,
    isFinished,
    isPending,
    progress,
    answer,
    setAnswer,
    result,
    submit,
  } = useLearnFlow({ deckId: deck.id, cards: deck.cards, onFinish })

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

        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          disabled={!isPending}
          placeholder={t("answerPlaceholder")}
          autoFocus
          className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm disabled:opacity-70"
        />

        {result && (
          <div
            className={cn("rounded-lg border px-3 py-2 text-sm", {
              "border-primary/20 bg-primary/10 text-primary": result === "exact",
              "border-amber-500/20 bg-amber-500/10 text-amber-600": result === "typo",
              "border-destructive/20 bg-destructive/10 text-destructive": result === "wrong",
            })}
          >
            {result === "exact" && t("correct")}
            {result === "typo" && t("typoCorrect", { answer: current.definition })}
            {result === "wrong" && t("incorrect", { answer: current.definition })}
          </div>
        )}

        <button
          onClick={submit}
          disabled={isPending && !answer.trim()}
          className={cn("w-full rounded-full py-2.5 font-medium transition-all", {
            "bg-primary text-primary-foreground disabled:opacity-40": isPending,
            "border border-border/60": !isPending,
          })}
        >
          {isPending ? t("check") : t("next")}
        </button>
      </div>
    </div>
  )
}
