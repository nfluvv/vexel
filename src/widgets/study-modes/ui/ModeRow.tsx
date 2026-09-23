import type { StudyModeConfig } from "../model/types"
import Link from "next/link"
import { Lock } from "lucide-react"

export function ModeRow({
  mode,
  t,
}: {
  mode: StudyModeConfig
  t: (key: string) => string
}) {
  const Icon = mode.icon
  const rowClass =
    "group flex items-center gap-4 px-5 py-4 transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-foreground/40"

  const content = (
    <>
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-(--accent)/10 text-(--accent)"
        style={{ ["--accent" as string]: mode.accent }}
      >
        {mode.locked ? (
          <Lock className="size-4" strokeWidth={2} />
        ) : (
          <Icon className="size-4.5" strokeWidth={2} />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{t(mode.titleKey)}</div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {mode.locked ? t("lockedUntilLearn") : t(mode.descKey)}
        </p>
      </div>

      {typeof mode.progress === "number" && !mode.locked && (
        <div className="hidden w-20 shrink-0 sm:block">
          <div className="h-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-(--accent)"
              style={{
                width: `${mode.progress}%`,
                ["--accent" as string]: mode.accent,
              }}
            />
          </div>
        </div>
      )}

      <span className="shrink-0 text-muted-foreground/60 transition-transform duration-200 group-hover:translate-x-0.5">
        →
      </span>
    </>
  )

  if (mode.locked) {
    return (
      <div
        className={`${rowClass} cursor-not-allowed opacity-60`}
        aria-disabled="true"
      >
        {content}
      </div>
    )
  }

  return (
    <Link href={mode.href} className={`${rowClass} hover:bg-muted/40`}>
      {content}
    </Link>
  )
}
