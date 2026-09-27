"use client"

import { cn } from "@/shared/client/lib/utils"
import { EmptyDeckState } from "@/shared/client/ui"
import { GameHeader } from "@/entities/study-session"
import { useBlastGame } from "../model/use-blast-game"
import { RoundTypeView } from "./RoundTypeView"
import { RoundChoiceView } from "./RoundChoiceView"
import { RoundAssembleView } from "./RoundAssembleView"
import type { FinishStats } from "@/shared/client/types"
import type { Card as CardType, Deck } from "@prisma/client"
import { useTranslations } from "next-intl"

type DeckBlastProps = {
  deck: Deck & { cards: CardType[] }
  onFinish: (stats: FinishStats) => void
}

export function DeckBlast({ deck, onFinish }: DeckBlastProps) {
  const t = useTranslations("study")

  const {
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
  } = useBlastGame({ deckId: deck.id, cards: deck.cards, onFinish })

  if (deck.cards.length === 0) {
    return <EmptyDeckState message={t("emptyDeck")} />
  }

  if (!current || isFinished) return null

  const distractorPool =
    current.kind === "assemble"
      ? deck.cards
          .filter((c) => c.id !== current.card.id)
          .map((c) => c.definition)
      : []

  return (
    <div className={cn(shaking && "animate-shake")}>
      <GameHeader lives={lives} combo={combo} timeLeft={timeLeft} />

      <div
        className={cn(
          "space-y-4 rounded-2xl border p-6 transition-colors",
          feedback === "correct" && "border-primary/60 bg-primary/5",
          feedback === "wrong" && "border-destructive/60 bg-destructive/5",
          !feedback && "border-border/60 bg-card"
        )}
      >
        <p className="text-center text-lg font-medium">{current.card.term}</p>

        {current.kind === "type" && (
          <RoundTypeView
            locked={locked}
            onCheck={(ans) => checkType(ans, () => {})}
          />
        )}

        {current.kind === "choice" && (
          <RoundChoiceView
            options={current.options}
            locked={locked}
            onChoose={(opt) => checkChoice(opt, () => {})}
          />
        )}

        {current.kind === "assemble" && (
          <RoundAssembleView
            cardId={current.card.id}
            correctText={current.card.definition}
            distractorPool={distractorPool}
            locked={locked}
            onComplete={(assembled) => checkAssemble(assembled, () => {})}
          />
        )}
      </div>
    </div>
  )
}
