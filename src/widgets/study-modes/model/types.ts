import type { LucideIcon } from "lucide-react"

export type StudyMode = "browse" | "learn" | "puzzle" | "blast" | "match"

export type StudyModeConfig = {
  key: StudyMode;
  href: string;
  icon: LucideIcon;
  accent: string;
  titleKey: string;
  descKey: string;
  badgeKey?: string;
  progress?: number;
  locked?: boolean;
};