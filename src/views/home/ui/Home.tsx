import { getTranslations } from "next-intl/server"

import { Container } from "@/shared/client/ui"
import { HeroSection } from "@/widgets/hero-section"
import { StarField } from "@/shared/client/ui"

import Link from "next/link"

export async function HomePage() {
  const t = await getTranslations("home")

  const features = [
    {
      title: t("features.items.spacedRepetition.title"),
      badge: t("features.items.spacedRepetition.badge"),
      description: t("features.items.spacedRepetition.description"),
    },
    {
      title: t("features.items.openSource.title"),
      badge: t("features.items.openSource.badge"),
      description: t("features.items.openSource.description"),
    },
    {
      title: t("features.items.modes.title"),
      badge: t("features.items.modes.badge"),
      description: t("features.items.modes.description"),
    },
  ] as const

  const comparison = [
    {
      feature: t("comparison.rows.spacedRepetition.feature"),
      quizlet: t("comparison.rows.spacedRepetition.quizlet"),
      vexel: t("comparison.rows.spacedRepetition.vexel"),
    },
    {
      feature: t("comparison.rows.decks.feature"),
      quizlet: t("comparison.rows.decks.quizlet"),
      vexel: t("comparison.rows.decks.vexel"),
    },
    {
      feature: t("comparison.rows.ads.feature"),
      quizlet: t("comparison.rows.ads.quizlet"),
      vexel: t("comparison.rows.ads.vexel"),
    },
    {
      feature: t("comparison.rows.sourceCode.feature"),
      quizlet: t("comparison.rows.sourceCode.quizlet"),
      vexel: t("comparison.rows.sourceCode.vexel"),
    },
  ] as const

  return (
    <main className="bg-background text-foreground">
      <Container className="flex min-h-[calc(100vh-8.5rem)] flex-col justify-center gap-12 pb-20">
        <StarField count={1000} seed={1100} />

        <HeroSection />

        <section
          aria-labelledby="core-features-title"
          className="space-y-6 pt-12 "
        >
          <div className="max-w-2xl space-y-2">
            <h2
              id="core-features-title"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {t("features.title")}
            </h2>
            <p className="text-muted-foreground">{t("features.description")}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature, i) => (
              <article
                key={feature.title}
                className="group relative flex min-h-62.5 flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-foreground/20"
              >
                <div className="flex items-start justify-between">
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-full border-2 border-border/70"
                  />
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-6 h-px w-full bg-border/60" />

                <div className="mt-auto space-y-3 pt-8">
                  <p className="text-xs font-medium text-muted-foreground">
                    {feature.badge}
                  </p>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="comparison-title" className="space-y-6 pt-12 border-t">
          <div className="max-w-2xl space-y-2">
            <h2
              id="comparison-title"
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
            >
              {t("comparison.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("comparison.description")}
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-card text-sm">
              <div className="border-b border-border px-4 py-4 font-medium text-muted-foreground sm:px-6">
                {t("comparison.feature")}
              </div>
              <div className="border-b border-l border-border px-4 py-4 font-mono text-xs text-muted-foreground sm:px-6">
                Quizlet
              </div>
              <div className="border-b border-l border-border px-4 py-4 font-mono text-xs text-foreground sm:px-6">
                Vexel
              </div>

              {comparison.map((row) => (
                <div key={row.feature} className="contents">
                  <div className="border-b border-border px-4 py-4 font-medium sm:px-6">
                    {row.feature}
                  </div>
                  <div className="border-b border-l border-border px-4 py-4 text-muted-foreground sm:px-6">
                    {row.quizlet}
                  </div>
                  <div className="border-b border-l border-border border-l-[#E3A62F] px-4 py-4 font-medium text-foreground sm:px-6">
                    {row.vexel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pt-12">
          <div className="px-6 py-12 text-center sm:px-12">
            <div className="mx-auto max-w-2xl space-y-6">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {t("cta.title")}
              </h2>
              <p className="text-muted-foreground">{t("cta.description")}</p>
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                {t("cta.button")}
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </main>
  )
}
