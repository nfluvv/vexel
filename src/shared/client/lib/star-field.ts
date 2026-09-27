interface Star {
  x: number
  y: number
  size: number
  opacity: number
  delay: number
  duration: number
}

export function createStarField(count: number, seed: number): Star[] {
  let t = seed
  const next = () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
  return Array.from({ length: count }, () => ({
    x: next() * 100,
    y: next() * 100,
    size: 1 + next() * 1.5,
    opacity: 0.15 + next() * 0.45,
    delay: next() * 6,
    duration: 3 + next() * 4,
  }))
}
