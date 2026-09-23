import { notFound } from "next/navigation"
import { getDeckById } from "@/entities/deck/api/queries"
import { DeckStudyView } from "@/views/deck-study"

type StudyPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ mode?: string }>
}

export default async function StudyPage({
  params,
  searchParams,
}: StudyPageProps) {
  const { id } = await params
  const { mode } = await searchParams

  const deck = await getDeckById(id)
  if (!deck) notFound()

  return <DeckStudyView deck={deck} initialMode={mode} />
}
