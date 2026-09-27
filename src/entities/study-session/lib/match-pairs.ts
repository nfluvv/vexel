import type { Card as CardType } from "@prisma/client"
import { shuffle } from "@/shared/client/lib/chunk-text"

export type MatchTile = {
  id: string
  cardId: string
  text: string
  side: "term" | "definition"
}

export function buildMatchTiles(cards: CardType[]): MatchTile[] {
  const tiles: MatchTile[] = cards.flatMap((c) => [
    { id: `${c.id}-term`, cardId: c.id, text: c.term, side: "term" as const },
    {
      id: `${c.id}-def`,
      cardId: c.id,
      text: c.definition,
      side: "definition" as const,
    },
  ])
  return shuffle(tiles)
}

export function pickBatch(cards: CardType[], size: number): CardType[] {
  return cards.slice(0, size)
}
