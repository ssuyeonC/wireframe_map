import { ChevronRight } from "lucide-react"

export function TravelNavigation() {
  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center space-x-2 text-sm">
          <button className="text-muted-foreground hover:text-foreground">Travel</button>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">Activities</span>
        </div>
      </div>
    </div>
  )
}
