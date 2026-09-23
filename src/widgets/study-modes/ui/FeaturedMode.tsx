import type { StudyModeConfig } from "../model/types"
import Link from "next/link"

export function FeaturedMode({
  mode,
  t,
}: {
  mode: StudyModeConfig
  t: (key: string) => string
}) {
  const Icon = mode.icon

  return (
    <Link
      href={mode.href}
      className="group relative flex min-h-40 flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card p-6 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/40"
      style={{ ["--accent" as string]: mode.accent }}
    >
      <div className="flex items-start justify-between">
        <span className="flex size-11 items-center justify-center rounded-xl bg-(--accent)/10 text-(--accent)">
          <Icon className="size-5" strokeWidth={2} />
        </span>

        <span className="flex size-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors duration-200 group-hover:border-foreground/20 group-hover:bg-foreground group-hover:text-background">
          <span className="text-base">→</span>
        </span>
      </div>

      <div>
        <div className="mt-6 flex items-center gap-3">
          <h3 className="text-2xl font-semibold tracking-tight">
            {t(mode.titleKey)}
          </h3>

          {mode.badgeKey && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-(--accent)/20 bg-(--accent)/8 px-2.5 py-1 text-[11px] font-medium text-(--accent)">
              <span>✦</span>
              {t(mode.badgeKey)}
            </div>
          )}
        </div>

        <p className="mt-1.5 max-w-sm text-sm leading-6 text-muted-foreground">
          {t(mode.descKey)}
        </p>
      </div>
    </Link>
  )
}
