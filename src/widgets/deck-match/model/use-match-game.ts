"use client"

import { useMemo, useState } from "react"
import type { Card as CardType } from "@prisma/client"
import { buildMatchTiles, type MatchTile } from "@/entities/study-session"
import { shuffle } from "@/shared/client/lib/chunk-text"
import { useCountdown } from "@/shared/client/hooks/use-countdown"
import { useGameSession } from "@/entities/study-session/lib/use-game-session"
import { LIVES, TIME_LIMIT_SEC, TARGET_PAIRS } from "@/shared/config/study"
import type { FinishStats } from "@/shared/client/types"

type UseMatchGameArgs = {
  deckId: string
  cards: CardType[]
  onFinish: (stats: FinishStats) => void
}

export function useMatchGame({ deckId, cards, onFinish }: UseMatchGameArgs) {
  const board = useMemo(() => shuffle(cards).slice(0, TARGET_PAIRS), [cards])
  const tiles = useMemo(() => buildMatchTiles(board), [board])

  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<MatchTile | null>(null)
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null)
  const [lives, setLives] = useState(LIVES)
  const [combo, setCombo] = useState(0)

  const allMatched = board.length > 0 && matched.size === board.length * 2
  const outOfLives = lives <= 0
  const isFinishedBase = board.length > 0 && (allMatched || outOfLives)

  const timeLeft = useCountdown(TIME_LIMIT_SEC, !isFinishedBase)
  const isFinished = isFinishedBase || timeLeft <= 0

  const correctPairs = matched.size / 2
  const { shaking, registerCorrect, registerWrong } = useGameSession({
    deckId,
    isFinished,
    timeLeft,
    correct: correctPairs,
    total: board.length,
    onFinish,
  })

  const handleTap = (tile: MatchTile) => {
    if (matched.has(tile.id) || wrongPair || isFinished) return

    if (!selected) {
      setSelected(tile)
      return
    }

    if (selected.id === tile.id) {
      setSelected(null)
      return
    }

    if (selected.cardId === tile.cardId && selected.side !== tile.side) {
      setMatched((prev) => new Set(prev).add(selected.id).add(tile.id))
      setSelected(null)
      setCombo((c) => {
        const next = c + 1
        registerCorrect(next)
        return next
      })
      return
    }

    setLives((l) => l - 1)
    setCombo(0)
    registerWrong()
    setWrongPair([selected.id, tile.id])
    setTimeout(() => {
      setWrongPair(null)
      setSelected(null)
    }, 400)
  }

  return {
    tiles,
    matched,
    selected,
    wrongPair,
    lives,
    combo,
    timeLeft,
    isFinished,
    shaking,
    handleTap,
  }
}
