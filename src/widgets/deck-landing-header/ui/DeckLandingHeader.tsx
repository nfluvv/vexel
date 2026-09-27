import { SaveDeckButton } from "@/features/save-deck-to-library"
import { EditDeckButton } from "@/features/edit-deck"
import type { DeckWithAuthor } from "@/entities/deck/model/types"
import Link from "next/link"

type Props = {
  deck: DeckWithAuthor
  isOwner: boolean
  cardCount: number
  t: (key: string) => string
}

export function DeckLandingHeader({ deck, isOwner, cardCount, t }: Props) {
  const { username, name } = deck.author
  const authorLabel = username ? `${username}` : (name ?? t("unknownAuthor"))

  return (
    <section className="border-b border-border/60 pt-2 pb-6 sm:pt-4 sm:pb-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl min-w-0">
          <h1 className="text-4xl font-semibold tracking-[-0.045em] wrap-break-word sm:text-5xl lg:text-[54px] lg:leading-[1.05]">
            {deck.title}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
            {t("deckDescription")}
          </p>

          <div className="mt-4 flex gap-3 text-[12px] font-medium tracking-[0.14em] text-muted-foreground/50">
            <p>
              {cardCount} {t("cards")}
            </p>

            <p>•</p>

            {username ? (
              <Link
                href={`/users/${username}`}
                className="transition-colors hover:text-foreground"
              >
                {authorLabel}
              </Link>
            ) : (
              <span>{authorLabel}</span>
            )}
          </div>
        </div>

        {isOwner ? (
          <EditDeckButton deckId={deck.id} />
        ) : (
          <SaveDeckButton deckId={deck.id} initialSaved={deck.isSaved} />
        )}
      </div>
    </section>
  )
}
