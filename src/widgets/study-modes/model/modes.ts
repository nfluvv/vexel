import { BookOpen, PenLine, Shuffle, Puzzle, Zap } from "lucide-react"
import { StudyModeConfig } from "./types"

export const MODES = ["browse", "learn", "puzzle", "blast", "match"]

export function buildModes(deckId: string): StudyModeConfig[] {
  return [
    {
      key: "browse",
      href: `/decks/${deckId}/study?mode=browse`,
      icon: BookOpen,
      accent: "#6D5EF8",
      titleKey: "browse",
      descKey: "browseDesc",
    },
    {
      key: "learn",
      href: `/decks/${deckId}/study?mode=learn`,
      icon: PenLine,
      accent: "#12A594",
      titleKey: "learn",
      descKey: "learnDesc",
    },
    {
      key: "puzzle",
      href: `/decks/${deckId}/study?mode=puzzle`,
      icon: Puzzle,
      accent: "#FF6F59",
      titleKey: "puzzle",
      descKey: "puzzleDesc",
    },
    {
      key: "blast",
      href: `/decks/${deckId}/study?mode=blast`,
      icon: Zap,
      accent: "#2F9BFF",
      titleKey: "blast",
      descKey: "blastDesc",
      badgeKey: "popular",
    },
    {
      key: "match",
      href: `/decks/${deckId}/study?mode=match`,
      icon: Shuffle,
      accent: "#E85C8A",
      titleKey: "match",
      descKey: "matchDesc",
    },
  ]
}

export function pickFeatured(modes: StudyModeConfig[], key: string): StudyModeConfig {
  return modes.find((m) => m.key === key) ?? modes[0]
}
