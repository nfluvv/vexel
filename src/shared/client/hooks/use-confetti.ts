"use client"

import { useEffect, useRef } from "react"

export function useConfetti(active: boolean) {
  const fired = useRef(false)

  useEffect(() => {
    if (!active || fired.current) return
    fired.current = true

    import("canvas-confetti").then(({ default: confetti }) => {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } })
    })
  }, [active])
}