"use client"

import { cn } from "@/shared/client/lib/utils"

type TimerRingProps = {
  timeLeft: number
  totalTime: number
  panicThreshold?: number
}

const RADIUS = 16
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function TimerRing({ timeLeft, totalTime, panicThreshold = 10 }: TimerRingProps) {
  const pct = totalTime > 0 ? Math.max(timeLeft / totalTime, 0) : 0
  const offset = CIRCUMFERENCE * (1 - pct)
  const isPanic = timeLeft <= panicThreshold && timeLeft > 0

  return (
    <div
      className={cn(
        "relative flex size-11 items-center justify-center",
        isPanic && "animate-panic-blink"
      )}
    >
      <svg viewBox="0 0 40 40" className="size-11 -rotate-90">
        <circle
          cx="20"
          cy="20"
          r={RADIUS}
          fill="none"
          strokeWidth="3"
          className="stroke-border/40"
        />
        <circle
          cx="20"
          cy="20"
          r={RADIUS}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          className={cn(
            isPanic
              ? "stroke-destructive transition-[stroke-dashoffset] duration-300 ease-linear"
              : "stroke-primary transition-[stroke-dashoffset] duration-1000 ease-linear"
          )}
        />
      </svg>
      <span
        className={cn(
          "absolute text-xs font-bold tabular-nums",
          isPanic ? "text-destructive" : "text-foreground"
        )}
      >
        {timeLeft}
      </span>
    </div>
  )
}