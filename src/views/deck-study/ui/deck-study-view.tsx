"use client"

import { useCallback, useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/shared/i18n/navigation"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import type { Card as CardType, Deck } from "@prisma/client"

import { DeckBrowse } from "@/widgets/deck-browse"
import { DeckLearn } from "@/widgets/deck-learn"

import {
  StudyModeTabs,
  type StudyMode,
  buildModes,
  MODES,
} from "@/widgets/study-modes"
import { StudyResult } from "@/widgets/study-result"
import { Container, Button } from "@/shared/client/ui"
import type { FinishStats } from "@/shared/client/types"
import Link from "next/link"

const DeckPuzzle = dynamic(
  () => import("@/widgets/deck-puzzle").then((m) => m.DeckPuzzle),
  { ssr: false }
)
const DeckBlast = dynamic(
  () => import("@/widgets/deck-blast").then((m) => m.DeckBlast),
  { ssr: false }
)
const DeckMatch = dynamic(
  () => import("@/widgets/deck-match").then((m) => m.DeckMatch),
  { ssr: false }
)

function isMode(value: string | null | undefined): value is StudyMode {
  return !!value && (MODES as readonly string[]).includes(value)
}

type DeckStudyViewProps = {
  deck: Deck & { cards: CardType[] }
  initialMode?: string
}

export function DeckStudyView({ deck, initialMode }: DeckStudyViewProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("study")

  const [finished, setFinished] = useState<FinishStats | null>(null)

  const rawMode = searchParams.get("mode") ?? initialMode
  const mode: StudyMode = isMode(rawMode) ? rawMode : "browse"

  const options = buildModes(deck.id).map((m) => ({
    key: m.key as StudyMode,
    icon: m.icon,
    accent: m.accent,
    label: t(m.titleKey),
  }))

  const setMode = useCallback(
    (next: StudyMode) => {
      setFinished(null)
      router.replace(`/decks/${deck.id}/study?mode=${next}`, { scroll: false })
    },
    [router, deck.id]
  )

  const handleBrowseFinish = useCallback(() => {
    setMode("blast")
  }, [setMode])

  const handleRestart = useCallback(() => {
    setFinished(null)
  }, [])

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 py-8">
      <Container>
        {!finished && mode === "browse" && (
          <StudyModeTabs
            current={mode}
            onChange={setMode}
            options={options}
            className="mb-4"
          />
        )}

        {finished ? (
          <StudyResult
            title={t("finishedTitle")}
            total={finished.total}
            correct={finished.correct}
            description={t("finishedDescription", {
              correct: finished.correct,
              total: finished.total,
            })}
          >
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleRestart} className="rounded-full">
                {t("restart")}
              </Button>
              <Link href={`/decks/${deck.id}`}>
                <Button className="w-full rounded-full" variant="outline">
                  {t("goBack")}
                </Button>
              </Link>
            </div>
          </StudyResult>
        ) : (
          <>
            {mode === "browse" && (
              <DeckBrowse
                key="browse"
                deck={deck}
                onFinish={handleBrowseFinish}
              />
            )}
            {mode === "learn" && (
              <DeckLearn key="learn" deck={deck} onFinish={setFinished} />
            )}
            {mode === "puzzle" && (
              <DeckPuzzle key="puzzle" deck={deck} onFinish={setFinished} />
            )}
            {mode === "blast" && (
              <DeckBlast key="blast" deck={deck} onFinish={setFinished} />
            )}
            {mode === "match" && (
              <DeckMatch key="match" deck={deck} onFinish={setFinished} />
            )}
          </>
        )}
      </Container>
    </main>
  )
}
