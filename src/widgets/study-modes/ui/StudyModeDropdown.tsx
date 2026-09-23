"use client"

import type { LucideIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/client/ui"


import type { StudyMode } from "../model/types"

type StudyModeOption = {
  key: StudyMode
  icon: LucideIcon
  accent: string
  label: string
}

type StudyModeTabsProps = {
  current: StudyMode
  onChange: (mode: StudyMode) => void
  options: StudyModeOption[]
  className: string
}

export function StudyModeTabs({
  current,
  onChange,
  options,
  className
}: StudyModeTabsProps) {
  const active = options.find((o) => o.key === current)

  return (
    <Select value={current} onValueChange={(v) => onChange(v as StudyMode)}>
      <SelectTrigger className={`${className} w-full`}>
        <SelectValue>
          {active && (
            <span className="flex items-center gap-2">
              <active.icon
                className="size-4"
                style={{ color: active.accent }}
              />
              {active.label}
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.key} value={o.key}>
            <span className="flex items-center gap-2">
              <o.icon className="size-4" style={{ color: o.accent }} />
              {o.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
