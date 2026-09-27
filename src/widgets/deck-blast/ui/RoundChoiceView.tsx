"use client"

type RoundChoiceViewProps = {
  options: string[]
  locked: boolean
  onChoose: (option: string) => void
}

export function RoundChoiceView({
  options,
  locked,
  onChoose,
}: RoundChoiceViewProps) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChoose(option)}
          disabled={locked}
          className="rounded-lg border border-border/60 bg-background px-3 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-60"
        >
          {option}
        </button>
      ))}
    </div>
  )
}
