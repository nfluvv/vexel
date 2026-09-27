import type { DeckWithCount } from "@/entities/deck"
import type { FinishStats } from "@/shared/client/types"

export type StudyModeWidgetProps = {
  deck: DeckWithCount
  onFinish: (stats: FinishStats) => void
}
