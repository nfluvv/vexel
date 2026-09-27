import { useCallback, useState } from "react"

export function useShake(durationMs = 400) {
  const [shaking, setShaking] = useState(false)

  const trigger = useCallback(() => {
    setShaking(true)
    setTimeout(() => setShaking(false), durationMs)
  }, [durationMs])

  return { shaking, trigger }
}
