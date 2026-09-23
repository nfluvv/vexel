"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"

type RoundTypeViewProps = {
  locked: boolean
  onCheck: (answer: string) => void
}

export function RoundTypeView({ locked, onCheck }: RoundTypeViewProps) {
  const [value, setValue] = useState("")
  const t = useTranslations("study")

  const submit = () => {
    if (!value.trim()) return
    onCheck(value)
    setValue("")
  }

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        disabled={locked}
        placeholder={t("answerPlaceholder")}
        autoFocus
        className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm disabled:opacity-70"
      />
      <button
        onClick={submit}
        disabled={locked || !value.trim()}
        className="w-full rounded-full bg-primary py-2.5 font-medium text-primary-foreground disabled:opacity-40"
      >
        {t("check")}
      </button>
    </>
  )
}