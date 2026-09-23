import Link from "next/link"

type Props = {
  deckId: string
  dueCount: number
  t: (key: string, opts?: Record<string, string | number | Date>) => string
}

export function DeckReviewCta({ deckId, dueCount, t }: Props) {
  return (
    <section className="border-b border-border/60 py-7 sm:py-8">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {dueCount > 0 ? t("reviewDueTitle") : t("allReviewed")}
          </h2>

          <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            {dueCount > 0
              ? t("reviewDueDescription")
              : t("allReviewedDescription")}
          </p>
        </div>

        {dueCount > 0 && (
          <div className="shrink-0 lg:w-64">
            <Link
              href={`/decks/${deckId}/review`}
              className="group flex h-12 w-full items-center justify-between rounded-[14px] bg-primary px-4 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 active:scale-[0.99]"
            >
              <span>{t("reviewDue", { count: dueCount })}</span>
              <span className="text-lg transition-transform duration-200 group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
