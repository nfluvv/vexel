import { useCallback, useRef, useState } from "react"

export function useFlipTransition<T>(onDone: (action: T) => void) {
  const [isAnimating, setIsAnimating] = useState(false)
  const pendingRef = useRef<T | null>(null)

  const run = useCallback((action: T) => {
    pendingRef.current = action
    setIsAnimating(true)
  }, [])

  const handleFlipEnd = useCallback(() => {
    const action = pendingRef.current
    pendingRef.current = null
    setIsAnimating(false)
    if (action !== null) onDone(action)
  }, [onDone])

  const cancel = useCallback(() => {
    pendingRef.current = null
    setIsAnimating(false)
  }, [])

  return { isAnimating, run, handleFlipEnd, cancel }
}
