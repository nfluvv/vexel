import { useCallback } from "react"

type HapticPattern = "light" | "success" | "error"

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 15,
  success: [20, 40, 20],
  error: [40, 30, 40, 30, 60],
}

export function useHaptics() {
  const vibrate = useCallback((pattern: HapticPattern) => {
    if (typeof navigator === "undefined" || !navigator.vibrate) return
    navigator.vibrate(PATTERNS[pattern])
  }, [])

  return { vibrate }
}
