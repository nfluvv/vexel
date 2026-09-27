"use client"

import type { Card as CardType, Deck } from "@prisma/client"
import { useTranslations } from "next-intl"
import { EmptyDeckState, ProgressBar } from "@/shared/client/ui"
import { useSwipe } from "@/shared/client/hooks/use-swipe"
import { useKeyboardShortcuts } from "@/shared/client/hooks/use-keyboard-shortcuts"
import { FlipCard } from "@/entities/study-card"
import { useTextToSpeech, SpeakButton } from "@/features/card-speech"
import { useBrowseNavigation } from "../model/use-browse-navigation"

type DeckBrowseViewProps = {
  deck: Deck & { cards: CardType[] }
  onFinish: () => void
}

export function DeckBrowse({ deck, onFinish }: DeckBrowseViewProps) {
  const t = useTranslations("study")
  const { speak, isSpeaking } = useTextToSpeech()

  const {
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
  } = useBrowseNavigation(deck.cards, onFinish)

  const swipeHandlers = useSwipe({ onSwipeLeft: goNext, onSwipeRight: goPrev })

  useKeyboardShortcuts(
    {
      Space: (e) => {
        e.preventDefault()
        toggleFlip()
      },
      Enter: (e) => {
        e.preventDefault()
        toggleFlip()
      },
      ArrowRight: goNext,
      ArrowLeft: goPrev,
      KeyS: () => card && speak(flipped ? card.definition : card.term),
    },
    deck.cards.length > 0
  )

  if (deck.cards.length === 0)
    return <EmptyDeckState message={t("emptyDeck")} />

  return (
    <div>
      <div className="mb-1 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">{deck.title}</h1>
          <p className="mb-2 text-sm text-muted-foreground">
            {index + 1} / {deck.cards.length}
          </p>
        </div>
        <SpeakButton
          onSpeak={() => speak(flipped ? card.definition : card.term)}
          isSpeaking={isSpeaking}
        />
      </div>

      <ProgressBar percent={progress} />

      <FlipCard
        front={card.term}
        back={card.definition}
        flipped={flipped}
        onToggle={toggleFlip}
        onFlipEnd={handleFlipEnd}
        disabled={isAnimating}
        {...swipeHandlers}
      />

      <p className="mt-2 hidden text-center text-[11px] text-muted-foreground/60 sm:block">
        {t("actionsText")}
      </p>

      <div className="mt-4 flex justify-between">
        <button
          onClick={goPrev}
          disabled={index === 0 || isAnimating}
          className="rounded-full border border-border/60 px-4 py-2 disabled:opacity-40"
        >
          {t("back")}
        </button>
        <button
          onClick={goNext}
          disabled={isAnimating}
          className="rounded-full border border-border/60 px-4 py-2 disabled:opacity-40"
        >
          {isLastCard ? t("finish") : t("next")}
        </button>
      </div>
    </div>
  )
}
