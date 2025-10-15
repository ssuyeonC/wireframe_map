"use client"

import { Button } from "@/components/ui/button"
import { CATEGORY_LABELS, SPOT_SUB_LABELS, SPOT_SUB2_LABELS, type SpotSubId, type CategoryId, type SpotSub2Id } from "@/lib/types"
import { ChevronRight } from "lucide-react"

const ORDERED_SPOT_SUBS: SpotSubId[] = ["activity", "hair", "photo", "spa"]

export function SpotSubFilters({
  primary,
  selected,
  sub2Selected,
  onChange,
}: {
  primary: CategoryId
  selected: SpotSubId | null
  sub2Selected?: SpotSub2Id | null
  onChange: (id: SpotSubId) => void
}) {
  if (primary !== "spot") return null
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-1 overflow-x-auto">
        {ORDERED_SPOT_SUBS.map((id) => (
          <Button
            key={id}
            variant={selected === id ? "default" : "ghost"}
            size="sm"
            className="whitespace-nowrap"
            onClick={() => onChange(id)}
          >
            {SPOT_SUB_LABELS[id]}
          </Button>
        ))}
      </div>

      {selected && (
        <div className="flex items-center ml-4 text-sm text-muted-foreground whitespace-nowrap">
          <span className="font-medium text-foreground">{CATEGORY_LABELS["spot"]}</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="font-medium text-foreground">{SPOT_SUB_LABELS[selected]}</span>
          {sub2Selected && (
            <>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span>{SPOT_SUB2_LABELS[sub2Selected]}</span>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default SpotSubFilters
