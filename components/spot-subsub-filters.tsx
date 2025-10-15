"use client"

import { Button } from "@/components/ui/button"
import { SPOT_SUB2_OPTIONS, SPOT_SUB2_LABELS, type SpotSub2Id, type SpotSubId } from "@/lib/types"

export function SpotSubSubFilters({
  parent,
  selected,
  onChange,
}: {
  parent: SpotSubId | null
  selected: SpotSub2Id | null
  onChange: (id: SpotSub2Id) => void
}) {
  if (!parent) return null
  const items = SPOT_SUB2_OPTIONS[parent]
  if (!items || items.length === 0) return null
  return (
    <div className="flex items-center space-x-1 overflow-x-auto">
      {items.map((id) => (
        <Button
          key={id}
          variant={selected === id ? "default" : "ghost"}
          size="sm"
          className="whitespace-nowrap"
          onClick={() => onChange(id)}
        >
          {SPOT_SUB2_LABELS[id]}
        </Button>
      ))}
    </div>
  )
}

export default SpotSubSubFilters

