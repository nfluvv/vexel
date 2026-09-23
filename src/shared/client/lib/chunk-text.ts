function splitWord(word: string): string[] {
  const size = word.length <= 4 ? 1 : word.length <= 8 ? 2 : 3
  const chunks: string[] = []
  for (let i = 0; i < word.length; i += size) {
    chunks.push(word.slice(i, i + size))
  }
  return chunks
}

export function toChunks(text: string): string[] {
  const trimmed = text.trim()
  if (trimmed.includes(" ")) {
    return trimmed.split(/\s+/)
  }
  return splitWord(trimmed)
}

export function buildBank(
  correctChunks: string[],
  otherDefinitions: string[],
  extraCount = 3
): string[] {
  const pool = otherDefinitions
    .flatMap((def) => toChunks(def))
    .filter((chunk) => !correctChunks.includes(chunk))

  const distractors: string[] = []
  const used = new Set<string>()
  for (const chunk of shuffle(pool)) {
    if (distractors.length >= extraCount) break
    if (used.has(chunk)) continue
    used.add(chunk)
    distractors.push(chunk)
  }

  return shuffle([...correctChunks, ...distractors])
}

export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}