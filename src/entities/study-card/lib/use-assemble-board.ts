"use client"

import { useCallback, useState } from "react"
import { toChunks, buildBank } from "@/shared/client/lib/chunk-text"

type Chunk = { id: string; text: string }

export function useAssembleBoard(
  correctText: string | undefined,
  distractorPool: string[],
  onComplete: (assembled: string) => void
) {
  const [bank, setBank] = useState<Chunk[]>([])
  const [answer, setAnswer] = useState<Chunk[]>([])

  const load = useCallback(() => {
    if (!correctText) return
    const texts = buildBank(toChunks(correctText), distractorPool)
    setBank(texts.map((text, i) => ({ id: `${i}-${text}`, text })))
    setAnswer([])
  }, [correctText, distractorPool])

  const returnToBank = useCallback((chunks: Chunk[]) => {
    setBank((b) => [...b, ...chunks])
  }, [])

  const moveToAnswer = useCallback(
    (chunk: Chunk) => {
      setBank((b) => b.filter((c) => c.id !== chunk.id))
      setAnswer((a) => {
        const next = [...a, chunk]
        if (correctText) {
          const target = toChunks(correctText)
          if (next.length === target.length) {
            const sep = correctText.includes(" ") ? " " : ""
            onComplete(next.map((c) => c.text).join(sep))
          }
        }
        return next
      })
    },
    [correctText, onComplete]
  )

  const moveToBank = useCallback((chunk: Chunk) => {
    setAnswer((a) => a.filter((c) => c.id !== chunk.id))
    setBank((b) => [...b, chunk])
  }, [])

  const reset = useCallback(() => setAnswer([]), [])

  return { bank, answer, load, moveToAnswer, moveToBank, returnToBank, reset }
}
