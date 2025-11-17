"use client"

import { Button } from "@/components/ui/button"
import { CATEGORY_LABELS, type CategoryId } from "@/lib/types"

const ORDERED_CATEGORIES: CategoryId[] = [
  "all",
  "spot",
  "stay",
  "place",
  "oliveyoung",
  "daiso",
  "lottemart",
]

export function CategoryFilters({
  selected,
  onChange,
  availableCategories,
}: {
  selected: CategoryId
  onChange: (id: CategoryId) => void
  availableCategories?: CategoryId[]
}) {
  const hasAvailabilityInfo = availableCategories !== undefined
  const availableSet = new Set<CategoryId>(availableCategories ?? [])

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-1 overflow-x-auto">
        {ORDERED_CATEGORIES.map((id) => {
          const isDisabled = hasAvailabilityInfo && id !== "all" && !availableSet.has(id)
          return (
            <Button
              key={id}
              variant={selected === id ? "default" : "ghost"}
              size="sm"
              className="whitespace-nowrap"
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) onChange(id)
              }}
            >
              {CATEGORY_LABELS[id]}
            </Button>
          )
        })}
      </div>

      <div className="flex items-center ml-4">
        <span className="text-sm text-muted-foreground whitespace-nowrap">Total 359</span>
      </div>
    </div>
  )
}
