import { ReactNode } from "react"
import { Container, ProgressBar } from "@/shared/client/ui"
import { SpeakButton } from "@/features/card-speech"

type StudyShellProps = {
  title: string
  subtitle: string
  progress?: number
  onSpeak?: () => void
  isSpeaking?: boolean
  children: ReactNode
}

export function StudyShell({
  title,
  subtitle,
  progress,
  onSpeak,
  isSpeaking,
  children,
}: StudyShellProps) {
  return (
    <main className="mx-auto max-w-xl py-8">
      <Container>
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {onSpeak && (
            <SpeakButton onSpeak={onSpeak} isSpeaking={isSpeaking || false} />
          )}
        </div>
        {progress !== undefined && <ProgressBar percent={progress} />}
        {children}
      </Container>
    </main>
  )
}
