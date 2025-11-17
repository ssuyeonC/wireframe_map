"use client"

import { useEffect, useState } from "react"
import { TravelHeader } from "@/components/travel-header"
import { CategoryFilters } from "@/components/category-filters"
import { MapView } from "@/components/map-view"
import { SpotSubId, SpotSub2Id, type CategoryId } from "@/lib/types"
import { SpotSubFilters } from "@/components/spot-subfilters"
import { SpotSubSubFilters } from "@/components/spot-subsub-filters"

export default function TravelActivitiesPage() {
  const [selected, setSelected] = useState<CategoryId>("all")
  const [spotSub, setSpotSub] = useState<SpotSubId | null>(null)
  const [spotSub2, setSpotSub2] = useState<SpotSub2Id | null>(null)
  const [availableCategories, setAvailableCategories] = useState<CategoryId[] | undefined>(undefined)

  useEffect(() => {
    if (selected !== "spot" && spotSub !== null) setSpotSub(null)
  }, [selected, spotSub])

  useEffect(() => {
    // Reset third level when leaving Spot or changing second level
    if (selected !== "spot") {
      if (spotSub2 !== null) setSpotSub2(null)
      return
    }
    // If no second level, clear third level
    if (spotSub === null && spotSub2 !== null) setSpotSub2(null)
  }, [selected, spotSub, spotSub2])

  return (
    <div className="min-h-screen bg-background">
      <TravelHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-3">
          <CategoryFilters
            selected={selected}
            onChange={(id) => setSelected(id)}
            availableCategories={availableCategories}
          />
        </div>

        <div className="mb-3">
          <SpotSubFilters primary={selected} selected={spotSub} sub2Selected={spotSub2} onChange={setSpotSub} />
        </div>

        <div className="mb-6">
          <SpotSubSubFilters parent={spotSub} selected={spotSub2} onChange={setSpotSub2} />
        </div>

        <div className="h-[calc(100vh-200px)]">
          <MapView
            activeFilter={selected}
            spotSubFilter={spotSub}
            spotSub2Filter={spotSub2}
            onVisibleTypesChange={(types) => setAvailableCategories(types)}
          />
        </div>
      </main>
    </div>
  )
}
