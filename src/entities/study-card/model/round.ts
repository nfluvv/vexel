import type { Card as CardType } from "@prisma/client"
import { shuffle } from "@/shared/client/lib/chunk-text"

export type Round =
  | { kind: "type"; card: CardType }
  | { kind: "assemble"; card: CardType }
  | { kind: "choice"; card: CardType; options: string[] }

function pickDistractors(
  card: CardType,
  pool: CardType[],
  count = 3
): string[] {
  const others = pool.filter((c) => c.id !== card.id).map((c) => c.definition)
  return shuffle(others).slice(0, count)
}

export function buildRounds(cards: CardType[], maxCards = 100): Round[] {
  const kinds: Round["kind"][] =
    cards.length >= 2 ? ["type", "assemble", "choice"] : ["type", "assemble"]

  const picked = shuffle(cards).slice(0, maxCards)

  return picked.map((card, i) => {
    const kind = kinds[i % kinds.length]

    if (kind === "choice") {
      const distractors = pickDistractors(card, cards)
      const options = shuffle([card.definition, ...distractors])
      return { kind, card, options }
    }

    return { kind, card }
  })
}
