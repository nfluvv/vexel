"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { useAssembleBoard } from "@/entities/study-card"

type RoundAssembleViewProps = {
  cardId: string
  correctText: string
  distractorPool: string[]
  locked: boolean
  onComplete: (assembled: string) => void
}

export function RoundAssembleView({
  cardId,
  correctText,
  distractorPool,
  locked,
  onComplete,
}: RoundAssembleViewProps) {
  const t = useTranslations("study")
  const { bank, answer, load, moveToAnswer, moveToBank } = useAssembleBoard(
    correctText,
    distractorPool,
    onComplete
  )

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardId])

  return (
    <>
      <div className="flex min-h-14 flex-wrap items-center gap-2 rounded-lg border border-dashed border-border/60 p-3">
        {answer.length === 0 && (
          <span className="text-sm text-muted-foreground">
            {t("assemblePlaceholder")}
          </span>
        )}
        {answer.map((chunk) => (
          <button
            key={chunk.id}
            onClick={() => moveToBank(chunk)}
            disabled={locked}
            className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-sm font-medium"
          >
            {chunk.text}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {bank.map((chunk) => (
          <button
            key={chunk.id}
            onClick={() => moveToAnswer(chunk)}
            disabled={locked}
            className="rounded-lg border border-border/60 bg-background px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            {chunk.text}
          </button>
        ))}
      </div>
    </>
  )
}