import { getTranslations } from "next-intl/server"
import { searchPublicDecks } from "@/entities/deck/api/queries"
import { Container } from "@/shared/client/ui"
import { DeckSearchResults } from "@/widgets/deck-search-results"

type SearchDeckPageProps = {
  searchParams: Promise<{ q?: string }>
}

const RESULTS_LIMIT = 15

export async function SearchDeckPage({ searchParams }: SearchDeckPageProps) {
  const { q } = await searchParams
  const query = q?.trim() ?? ""
  const t = await getTranslations("search")

  const decks = query ? await searchPublicDecks(query, RESULTS_LIMIT) : []

  return (
    <main>
      <Container className="py-2 sm:py-4">
        <h2 className="mb-4 text-3xl font-bold">
          {query ? t("resultsFor", { query }) : t("emptyQuery")}
        </h2>
        <DeckSearchResults decks={decks} query={query} />
      </Container>
    </main>
  )
}
