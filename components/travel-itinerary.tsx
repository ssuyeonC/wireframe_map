"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, Sparkles, Building2, ChevronDown } from "lucide-react"
import { useState } from "react"

const travelData = [
  {
    day: 1,
    title: "Day 1",
    locations: [
      { name: "Beauty Play Hongdae", type: "beauty", korean: "뷰티플레이 홍대점" },
      { name: "Nemamdaero Hongdae Branch", type: "shopping", korean: "내맘대로폰케이스 홍대점" },
      { name: "Mapodaegyo Bridge", type: "landmark", korean: "마포대교 야경" },
      { name: "King Sejong Statue", type: "landmark", korean: "세종대왕 동상" },
      { name: "Time On Me Studio | Hongdae Photo Studio", type: "photo" },
      { name: "Parfum 9 | Perfume Studio in Hongdae", type: "beauty" },
      { name: "The Day's Hair | English-friendly Hair Salon in Hongdae", type: "beauty" },
      { name: "SOONSIKI Hair Hongdae | Flagship Hair Salon", type: "beauty" },
      { name: "Because Friends Photo Studio | Hongdae Branch", type: "photo" },
    ],
  },
  {
    day: 2,
    title: "Day 2",
    locations: [
      { name: "Yeonnam-dong", type: "area", korean: "연남동" },
      { name: "Real Escape Challenge", type: "entertainment", korean: "리얼 이스케이프 챌린지" },
      { name: "Yeonsero (Yonsei University Street)", type: "area", korean: "연세로" },
      { name: "Supsok Hanbang Land", type: "wellness", korean: "숲속한방랜드" },
      { name: "S: Re Born Clinic", type: "beauty" },
      { name: "Color Gasanda | Body Type Analysis", type: "beauty" },
      { name: "[Special Reopening Event] Woori Dongnae Photo Studio Hongdae", type: "photo" },
    ],
  },
  {
    day: 3,
    title: "Day 3",
    locations: [
      { name: "Danggogae Catholic Martyrs' Shrine", type: "landmark", korean: "당고개순교성지" },
      { name: "Rail Cruise Haerang", type: "transportation", korean: "레일크루즈 해랑열차" },
      { name: "Culture Station Seoul 284", type: "culture", korean: "문화역 서울 284" },
      { name: "Roa Makeup", type: "beauty" },
      { name: "Haewadal Hanbok | Photography Session+Makeup Services", type: "photo" },
      {
        name: "K-Pop Photocard Shop POCA SPOT Myeongdong Branch | Mystery Packs & Up to 10,000 KRW Off",
        type: "shopping",
      },
    ],
  },
  {
    day: 4,
    title: "Day 4",
    locations: [
      { name: "N Seoul Tower", type: "landmark", korean: "남산서울타워" },
      { name: "Chungdong First Methodist Church", type: "landmark", korean: "서울 정동교회" },
      { name: "Jungmyeongjeon Hall", type: "culture", korean: "중명전" },
      { name: "Art de la Peau Massage Shop | Myeongdong", type: "wellness" },
      { name: "Popular Hair Salon in MyeongdongㅣLEEKAJA HAIR", type: "beauty" },
      { name: "Hana Mud Massage Sauna | Myeongdong", type: "wellness" },
    ],
  },
]

const getLocationIcon = (type: string) => {
  switch (type) {
    case "beauty":
      return <Sparkles className="h-4 w-4" />
    case "photo":
      return <Camera className="h-4 w-4" />
    case "landmark":
      return <Building2 className="h-4 w-4" />
    case "area":
    case "shopping":
    case "culture":
    case "wellness":
    case "entertainment":
    case "transportation":
    default:
      return <MapPin className="h-4 w-4" />
  }
}

const getLocationBadgeColor = (type: string) => {
  switch (type) {
    case "beauty":
      return "bg-primary/10 text-primary hover:bg-primary/20"
    case "photo":
      return "bg-secondary/10 text-secondary hover:bg-secondary/20"
    case "landmark":
      return "bg-accent/10 text-accent hover:bg-accent/20"
    default:
      return "bg-muted text-muted-foreground hover:bg-muted/80"
  }
}

export function TravelItinerary() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="w-full space-y-3">
      <div className="text-center space-y-1">
        <h2 className="text-lg font-semibold text-balance">Seoul Travel Itinerary</h2>
        <p className="text-xs text-muted-foreground">4 Days • Beauty, Culture & Adventure</p>
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-3 border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {travelData.map((day) => (
                <div
                  key={day.day}
                  className="w-6 h-6 bg-primary rounded-full border-2 border-background flex items-center justify-center text-xs font-medium text-primary-foreground"
                >
                  {day.day}
                </div>
              ))}
            </div>
            <span className="text-sm font-medium">4 Days</span>
            <Badge variant="secondary" className="text-xs">
              {travelData.reduce((total, day) => total + day.locations.length, 0)} Places
            </Badge>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? "Show Less" : "Show Details"}
            <ChevronDown className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {travelData.map((day) => (
            <Card key={day.day} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b py-2 px-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs font-medium text-primary-foreground">
                    {day.day}
                  </div>
                  Day {day.day}
                  <Badge variant="outline" className="text-xs ml-auto">
                    {day.locations.length} places
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="grid grid-cols-1 gap-2">
                  {day.locations.slice(0, 3).map((location, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div className="w-4 h-4 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                        {getLocationIcon(location.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium truncate block">
                          {location.name.length > 30 ? location.name.substring(0, 30) + "..." : location.name}
                        </span>
                        {location.korean && <span className="text-muted-foreground block">{location.korean}</span>}
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-xs flex-shrink-0 ${getLocationBadgeColor(location.type)}`}
                      >
                        {location.type}
                      </Badge>
                    </div>
                  ))}
                  {day.locations.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center py-1">
                      +{day.locations.length - 3} more places
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-center pt-2">
        <p className="text-xs text-muted-foreground">Ready to share your Seoul adventure! ✈️</p>
      </div>
    </div>
  )
}

export default TravelItinerary

