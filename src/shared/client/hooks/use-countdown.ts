import { useEffect, useState } from "react"

export function useCountdown(limitSec: number, running: boolean) {
  const [timeLeft, setTimeLeft] = useState(limitSec)

  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setTimeLeft((s) => Math.max(s - 1, 0)), 1000)
    return () => clearInterval(timer)
  }, [running])

  return timeLeft
}