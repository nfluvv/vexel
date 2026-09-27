"use client"

import type { Card as CardType, Deck } from "@prisma/client"
import { useTranslations } from "next-intl"
import { cn } from "@/shared/client/lib/utils"
import { GameHeader } from "@/entities/study-session"
import { EmptyDeckState } from "@/shared/client/ui"
import { useMatchGame } from "../model/use-match-game"
import type { FinishStats } from "@/shared/client/types"

type DeckMatchProps = {
  deck: Deck & { cards: CardType[] }
  onFinish: (stats: FinishStats) => void
}

export function DeckMatch({ deck, onFinish }: DeckMatchProps) {
  const t = useTranslations("study")

  const {
    tiles,
    matched,
    selected,
    wrongPair,
    lives,
    combo,
    timeLeft,
    isFinished,
    shaking,
    handleTap,
  } = useMatchGame({ deckId: deck.id, cards: deck.cards, onFinish })

  if (deck.cards.length === 0) {
    return <EmptyDeckState message={t("emptyDeck")} />
  }

  if (isFinished) return null

  return (
    <div className={cn(shaking && "animate-shake")}>
      <GameHeader lives={lives} combo={combo} timeLeft={timeLeft} />

      <div className="grid grid-cols-2 gap-2">
        {tiles.map((tile) => {
          const isMatched = matched.has(tile.id)
          const isSelected = selected?.id === tile.id
          const isWrong = wrongPair?.includes(tile.id)

          return (
            <button
              key={tile.id}
              onClick={() => handleTap(tile)}
              disabled={isMatched}
              className={cn(
                "rounded-lg border px-3 py-3 text-sm font-medium transition-colors",
                isMatched && "invisible",
                isSelected && "border-primary bg-primary/10",
                isWrong && "border-destructive bg-destructive/10",
                !isSelected &&
                  !isWrong &&
                  "border-border/60 bg-background hover:bg-muted"
              )}
            >
              {tile.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}
