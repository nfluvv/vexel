"use client"

import { useTranslations } from "next-intl"
import type { DeckWithCount } from "@/entities/deck"
import { DeckCard } from "@/entities/deck"

type DeckSearchResultsProps = {
  decks: DeckWithCount[]
  query: string
}

export function DeckSearchResults({ decks, query }: DeckSearchResultsProps) {
  const t = useTranslations("search")

  if (!query) return null

  if (decks.length === 0) {
    return (
      <p className="mt-2 text-sm text-muted-foreground">{t("noResults")}</p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {decks.map((deck) => (
        <DeckCard deck={deck} variant={"public"} key={deck.id} />
      ))}
    </div>
  )
}
