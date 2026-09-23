export type Tier = "S" | "A" | "B" | "C" | "D" | "F"

const THRESHOLDS: { tier: Tier; min: number }[] = [
  { tier: "S", min: 100 },
  { tier: "A", min: 90 },
  { tier: "B", min: 75 },
  { tier: "C", min: 60 },
  { tier: "D", min: 40 },
  { tier: "F", min: 0 },
]

export function getTier(correct: number, total: number): Tier {
  const pct = total > 0 ? (correct / total) * 100 : 0
  return THRESHOLDS.find((t) => pct >= t.min)?.tier ?? "F"
}

export const TIER_STYLES: Record<Tier, { bg: string; glow: string }> = {
  S: { bg: "bg-gradient-to-br from-amber-300 to-yellow-500", glow: "shadow-amber-400/50" },
  A: { bg: "bg-gradient-to-br from-emerald-400 to-emerald-600", glow: "shadow-emerald-400/50" },
  B: { bg: "bg-gradient-to-br from-sky-400 to-blue-500", glow: "shadow-sky-400/40" },
  C: { bg: "bg-gradient-to-br from-violet-400 to-purple-500", glow: "shadow-violet-400/30" },
  D: { bg: "bg-gradient-to-br from-orange-400 to-orange-600", glow: "shadow-orange-400/30" },
  F: { bg: "bg-gradient-to-br from-zinc-400 to-zinc-500", glow: "" },
}