import { getTranslations } from "next-intl/server"
import { buildModes, pickFeatured } from "../model/modes"
import { FeaturedMode } from "./FeaturedMode"
import { ModeRow } from "./ModeRow"

type Props = {
  deckId: string
  featuredKey?: string
  t: Awaited<ReturnType<typeof getTranslations>>
}

export function StudyModes({ deckId, featuredKey = "browse", t }: Props) {
  const modes = buildModes(deckId)
  const featured = pickFeatured(modes, featuredKey)
  const rest = modes.filter((m) => m.key !== featured.key)

  return (
    <section className="pt-6 sm:pt-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">
          {t("studyModes")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("studyModesDescription")}
        </p>
      </div>

      <FeaturedMode mode={featured} t={t} />

      <div className="mt-3 divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/60 bg-card">
        {rest.map((mode) => (
          <ModeRow key={mode.key} mode={mode} t={t} />
        ))}
      </div>
    </section>
  )
}
