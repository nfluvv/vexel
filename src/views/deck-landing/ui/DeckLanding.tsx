import { getTranslations } from "next-intl/server"
import type { DeckWithAuthor } from "@/entities/deck/model/types"
import { StudyModes } from "@/widgets/study-modes"
import { DeckLandingHeader } from "@/widgets/deck-landing-header"
import { DeckReviewCta } from "@/widgets/deck-review-cta"
import { auth } from "@/auth"
import { Container, EmptyDeckState } from "@/shared/client/ui"

interface DeckLandingProps {
  dueCount: number
  cardCount: number
  deck: DeckWithAuthor
}

export const DeckLanding = async ({
  dueCount,
  cardCount,
  deck,
}: DeckLandingProps) => {
  const session = await auth()
  const isOwner = deck.userId === session?.user?.id

  const t = await getTranslations("study")

  if (cardCount === 0) return <EmptyDeckState message={t("emptyDeck")} />

  return (
    <main className="min-h-screen bg-background text-foreground antialiased">
      <Container className="mx-auto max-w-5xl py-8 sm:py-10">
        <DeckLandingHeader
          deck={deck}
          isOwner={isOwner}
          cardCount={cardCount}
          t={t}
        />

        <DeckReviewCta deckId={deck.id} dueCount={dueCount} t={t} />

        <StudyModes deckId={deck.id} featuredKey="blast" t={t} />
      </Container>
    </main>
  )
}
