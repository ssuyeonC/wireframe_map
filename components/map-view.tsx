"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api"
import { MapPin, Home, Building2, ShoppingBag, Store, ShoppingCart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { CategoryId, SpotSubId, SpotSub2Id } from "@/lib/types"
import { SPOT_SUB2_OPTIONS } from "@/lib/types"

type PoiType = Exclude<CategoryId, "all">
type Poi = {
  id: string
  type: PoiType
  lat: number
  lng: number
  spotSub?: SpotSubId
  spotSub2?: SpotSub2Id
  name: string
  image: string
  price?: number
  rating?: number
  reviews?: number
}

const TYPE_COLORS: Record<PoiType, string> = {
  spot: "bg-red-500",
  stay: "bg-emerald-500",
  place: "bg-indigo-500",
  oliveyoung: "bg-pink-500",
  daiso: "bg-amber-500",
  lottemart: "bg-blue-500",
}

const TYPE_ICON: Record<PoiType, any> = {
  spot: MapPin,
  stay: Home,
  place: Building2,
  oliveyoung: ShoppingBag,
  daiso: Store,
  lottemart: ShoppingCart,
}

function titleFor(type: PoiType, i: number): string {
  const n = i + 1
  switch (type) {
    case "spot":
      return `서울 투어 ${n}`
    case "stay":
      return `서울 호텔 ${n}`
    case "place":
      return `서울 명소 ${n}`
    case "oliveyoung":
      return `올리브영 ${n}호점`
    case "daiso":
      return `다이소 ${n}호점`
    case "lottemart":
      return `롯데마트 ${n}점`
  }
}

// Random points inside current visible bounds
function randomLatLngInBounds(bounds: google.maps.LatLngBounds) {
  const sw = bounds.getSouthWest()
  const ne = bounds.getNorthEast()
  const lat = sw.lat() + Math.random() * (ne.lat() - sw.lat())
  const lng = sw.lng() + Math.random() * (ne.lng() - sw.lng())
  return { lat, lng }
}

function countFromZoom(z: number) {
  if (z >= 16) return 10
  if (z >= 15) return 14
  if (z >= 14) return 18
  if (z >= 13) return 24
  if (z >= 12) return 30
  return 36
}

function generatePoisInBounds(bounds: google.maps.LatLngBounds, zoom: number): Poi[] {
  const types: PoiType[] = ["spot", "stay", "place", "oliveyoung", "daiso", "lottemart"]
  const countPerType = countFromZoom(zoom)
  const pois: Poi[] = []
  let seq = 1
  for (const t of types) {
    for (let i = 0; i < countPerType; i++) {
      const pos = randomLatLngInBounds(bounds)
      const id = `${t}-${seq++}`
      const p: Poi = {
        id,
        type: t,
        lat: pos.lat,
        lng: pos.lng,
        name: titleFor(t, i),
        image: `https://picsum.photos/seed/${encodeURIComponent(id)}/320/200`,
      }
      if (t === "spot") {
        const subs: SpotSubId[] = ["activity", "hair", "photo", "spa"]
        const sub = subs[i % subs.length]
        p.spotSub = sub
        const sub2Options = SPOT_SUB2_OPTIONS[sub]
        if (sub2Options?.length) p.spotSub2 = sub2Options[i % sub2Options.length]
      }
      if (t === "spot" || t === "stay") {
        p.price = Math.floor(40000 + Math.random() * 200000)
        p.rating = Math.round((3 + Math.random() * 2) * 10) / 10
        p.reviews = Math.floor(10 + Math.random() * 900)
      }
      pois.push(p)
    }
  }
  return pois
}

export function MapView({ activeFilter = "all", spotSubFilter = null, spotSub2Filter = null }: { activeFilter?: CategoryId; spotSubFilter?: SpotSubId | null; spotSub2Filter?: SpotSub2Id | null }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "gmap-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })
  const [zoom, setZoom] = useState(13)
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 37.5665, lng: 126.978 })
  const [pois, setPois] = useState<Poi[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [mobileFocusedId, setMobileFocusedId] = useState<string | null>(null)

  // responsive: detect mobile (<= md)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const onChange = () => setIsMobile(mq.matches)
    onChange()
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const filtered = useMemo(() => {
    if (activeFilter === "all") return pois
    if (activeFilter === "spot") {
      let arr = pois.filter((p) => p.type === "spot")
      if (spotSubFilter) arr = arr.filter((p) => p.spotSub === spotSubFilter)
      if (spotSubFilter && spotSub2Filter) arr = arr.filter((p) => p.spotSub2 === spotSub2Filter)
      return arr
    }
    return pois.filter((p) => p.type === activeFilter)
  }, [activeFilter, spotSubFilter, spotSub2Filter, pois])

  useEffect(() => {
    if (selectedId && !filtered.some((p) => p.id === selectedId)) {
      setSelectedId(null)
    }
  }, [filtered, selectedId])

  useEffect(() => {
    if (detailId && !filtered.some((p) => p.id === detailId)) {
      setDetailId(null)
    }
  }, [filtered, detailId])

  const rerandomize = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    const b = map.getBounds()
    if (!b) return
    setPois(generatePoisInBounds(b, map.getZoom() ?? zoom))
    setSelectedId(null)
    setDetailId(null)
  }, [zoom])

  // Sidebar refs (desktop) and mobile list refs
  const sidebarRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const setCardRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    cardRefs.current[id] = el
  }, [])
  const mobileListRef = useRef<HTMLDivElement | null>(null)
  const mobileCardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const setMobileCardRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    mobileCardRefs.current[id] = el
  }, [])

  const getPoiById = useCallback((id: string) => filtered.find((p) => p.id === id), [filtered])

  const handleSelect = useCallback(
    (id: string) => {
      setSelectedId(id)
      const poi = getPoiById(id)
      const map = mapRef.current
      if (poi && map) map.panTo({ lat: poi.lat, lng: poi.lng })

      requestAnimationFrame(() => {
        if (isMobile) {
          const container = mobileListRef.current
          const el = mobileCardRefs.current[id]
          if (container && el) {
            const target = el.offsetLeft + el.offsetWidth / 2 - container.clientWidth / 2
            container.scrollTo({ left: target, behavior: "smooth" })
          }
        } else {
          const container = sidebarRef.current
          const el = cardRefs.current[id]
          if (container && el) {
            const containerRect = container.getBoundingClientRect()
            const elRect = el.getBoundingClientRect()
            const delta = elRect.top - containerRect.top
            container.scrollTo({ top: container.scrollTop + delta - 8, behavior: "smooth" })
          }
        }
      })
    },
    [getPoiById, isMobile]
  )

  const detailEligible = new Set<PoiType>(["oliveyoung", "daiso", "lottemart"])
  const openDetail = useCallback(
    (poi: Poi) => {
      handleSelect(poi.id)
      if (detailEligible.has(poi.type)) setDetailId(poi.id)
    },
    [handleSelect]
  )
  const closeDetail = useCallback(() => setDetailId(null), [])

  const detailPoi = useMemo(() => filtered.find((p) => p.id === detailId) ?? null, [filtered, detailId])

  // Visible items based on map bounds
  const [visibleFiltered, setVisibleFiltered] = useState<Poi[]>([])
  const updateVisible = useCallback(() => {
    const map = mapRef.current
    if (!map) return setVisibleFiltered([])
    const bounds = map.getBounds()
    if (!bounds) return setVisibleFiltered([])
    setVisibleFiltered(filtered.filter((p) => bounds.contains({ lat: p.lat, lng: p.lng })))
  }, [filtered])

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
  }, [])
  const lastRef = useRef<{ lat: number; lng: number; zoom: number }>({ lat: center.lat, lng: center.lng, zoom })
  const EPS = 1e-5

  const onMapIdle = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    const c = map.getCenter()
    const z = map.getZoom()
    let changed = false
    if (typeof z === "number" && z !== lastRef.current.zoom) {
      setZoom(z)
      lastRef.current.zoom = z
      changed = true
    }
    if (c) {
      const lat = c.lat()
      const lng = c.lng()
      if (Math.abs(lat - lastRef.current.lat) > EPS || Math.abs(lng - lastRef.current.lng) > EPS) {
        setCenter({ lat, lng })
        lastRef.current.lat = lat
        lastRef.current.lng = lng
        changed = true
      }
    }
    const b = map.getBounds()
    if (b) {
      // Only regenerate if view actually changed or on first load
      if (changed || pois.length === 0) {
        const effectiveZoom = typeof z === "number" ? z : lastRef.current.zoom
        setPois(generatePoisInBounds(b, effectiveZoom))
        setSelectedId(null)
        setDetailId(null)
      }
      // Always update visible list to reflect current filter
      updateVisible()
    }
  }, [pois.length, updateVisible])

  // Recompute visible cards when filter changes without moving the map
  useEffect(() => {
    updateVisible()
  }, [filtered, updateVisible])

  // Mobile: track centered card on horizontal scroll and sync to map center
  const updateMobileFocus = useCallback(() => {
    const container = mobileListRef.current
    if (!container) return
    const cx = container.getBoundingClientRect().left + container.clientWidth / 2
    let bestId: string | null = null
    let bestDist = Infinity
    for (const id in mobileCardRefs.current) {
      const el = mobileCardRefs.current[id]
      if (!el || !el.isConnected) continue
      const rect = el.getBoundingClientRect()
      const ex = rect.left + rect.width / 2
      const dist = Math.abs(ex - cx)
      if (dist < bestDist) {
        bestDist = dist
        bestId = id
      }
    }
    if (bestId && bestId !== mobileFocusedId) {
      setMobileFocusedId(bestId)
      setSelectedId(bestId)
      const poi = getPoiById(bestId)
      const map = mapRef.current
      if (poi && map) map.panTo({ lat: poi.lat, lng: poi.lng })
    }
  }, [getPoiById, mobileFocusedId])

  useEffect(() => {
    if (!isMobile) return
    updateMobileFocus()
  }, [visibleFiltered, isMobile, updateMobileFocus])

  const initialCenter = useMemo<google.maps.LatLngLiteral>(() => ({ lat: 37.5665, lng: 126.978 }), [])
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({ disableDefaultUI: true, clickableIcons: false, gestureHandling: "greedy", center: initialCenter, zoom: 13 }),
    [initialCenter]
  )

  return (
    <div className="relative bg-map-bg rounded-lg border overflow-hidden h-full">
      <div className="absolute inset-0">
        {!isLoaded ? (
          <div className="w-full h-full grid place-items-center text-sm text-muted-foreground">Google Maps를 불러오는 중...</div>
        ) : loadError || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
          <div className="w-full h-full grid place-items-center p-6 text-center text-sm text-muted-foreground">
            <div>
              <div className="mb-2 font-medium text-foreground">API Key가 필요합니다.</div>
              <div className="mb-1">환경변수 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY를 설정해 주세요.</div>
              <div className="opacity-70">예: .env.local에 NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_KEY</div>
            </div>
          </div>
        ) : (
          <GoogleMap onLoad={onMapLoad} onIdle={onMapIdle} mapContainerStyle={{ width: "100%", height: "100%" }} options={mapOptions}>
            {filtered.map((poi) => {
              const Icon = TYPE_ICON[poi.type]
              const selected = selectedId === poi.id
              return (
                <OverlayView key={poi.id} position={{ lat: poi.lat, lng: poi.lng }} mapPaneName="overlayMouseTarget">
                  <div
                    className={`-translate-x-1/2 -translate-y-1/2 cursor-pointer transform-gpu ${selected ? "scale-110" : "scale-100"}`}
                    onClick={() => handleSelect(poi.id)}
                  >
                    <div
                      className={`flex items-center justify-center rounded-full text-white shadow transition-all duration-150 ${
                        selected ? "h-8 w-8 ring-2 ring-white z-30" : "h-6 w-6 z-10"
                      } ${TYPE_COLORS[poi.type]}`}
                      aria-label={poi.type}
                    >
                      <Icon className={selected ? "h-4.5 w-4.5" : "h-3.5 w-3.5"} />
                    </div>
                  </div>
                </OverlayView>
              )
            })}
          </GoogleMap>
        )}
      </div>

      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <Button
          variant="ghost"
          className="bg-white hover:bg-gray-50 !text-black border shadow-sm font-medium"
          onClick={rerandomize}
        >
          현 위치에서 재검색
        </Button>
      </div>

      <div className="absolute bottom-4 right-4 mb-12">
        <Button variant="secondary" size="sm" className="bg-white hover:bg-gray-50 border shadow-sm">
          <MapPin className="w-4 h-4" />
          <span className="ml-1 text-xs">내 위치</span>
        </Button>
      </div>

      {/* Sidebar: filtered list (desktop only) */}
      <aside ref={sidebarRef} className="hidden md:block absolute left-0 top-0 bottom-0 w-80 bg-card/95 backdrop-blur border-r z-20 overflow-y-auto">
        {detailPoi ? (
          <div className="p-3 space-y-3">
            <Card className="overflow-hidden">
              <div className="aspect-[16/9] w-full bg-muted overflow-hidden">
                <img src={detailPoi.image} alt={detailPoi.name} className="h-full w-full object-cover" />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{detailPoi.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <Button className="w-full h-11 bg-teal-500 hover:bg-teal-600 text-white" onClick={() => {}}>
                  앱에서 보기
                </Button>
                <Button variant="outline" className="w-full h-10" onClick={closeDetail}>
                  목록으로
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {visibleFiltered.map((poi) => (
              <Card
                key={`card-${poi.id}`}
                ref={setCardRef(poi.id)}
                className={`overflow-hidden transition-shadow cursor-pointer ${selectedId === poi.id ? "ring-2 ring-primary" : "hover:shadow-sm"}`}
                role="button"
                tabIndex={0}
                onClick={() => handleSelect(poi.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleSelect(poi.id)
                }}
              >
                <div className="aspect-[16/9] w-full bg-muted overflow-hidden">
                  <img src={poi.image} alt={poi.name} className="h-full w-full object-cover" />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{poi.name}</CardTitle>
                  {(poi.type === "spot" || poi.type === "stay") && (
                    <CardDescription className="mt-1">
                      <div className="flex items-center gap-2 text-xs">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span className="text-foreground/90">{poi.rating?.toFixed(1)}</span>
                        <span className="text-muted-foreground">({poi.reviews})</span>
                      </div>
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  {(poi.type === "spot" || poi.type === "stay") && (
                    <div className="mb-2 text-sm font-semibold">₩{new Intl.NumberFormat("ko-KR").format(poi.price ?? 0)}</div>
                  )}
                  <button
                    className="hidden md:inline text-primary hover:underline text-sm font-medium"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (detailEligible.has(poi.type)) openDetail(poi)
                      else handleSelect(poi.id)
                    }}
                  >
                    자세히 보기
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </aside>

      {/* Mobile horizontal list */}
      <div className="md:hidden absolute left-0 right-0 bottom-0 z-20">
        <div
          ref={mobileListRef}
          onScroll={() => requestAnimationFrame(updateMobileFocus)}
          className="overflow-x-auto whitespace-nowrap px-3 py-3 flex gap-3 snap-x snap-mandatory bg-gradient-to-t from-background/95 to-background/60 backdrop-blur"
        >
          {visibleFiltered.map((poi) => (
            <div
              key={`mcard-${poi.id}`}
              ref={setMobileCardRef(poi.id)}
              data-poi-id={poi.id}
              className={`flex-shrink-0 w-72 snap-center ${selectedId === poi.id ? "ring-2 ring-primary rounded-lg" : ""}`}
            >
              <Card
                className="overflow-hidden cursor-pointer"
                onClick={() => {
                  if (mobileFocusedId === poi.id) {
                    if (detailEligible.has(poi.type)) setDetailId(poi.id)
                  } else {
                    handleSelect(poi.id)
                  }
                }}
              >
                <div className="aspect-[16/9] w-full bg-muted overflow-hidden">
                  <img src={poi.image} alt={poi.name} className="h-full w-full object-cover" />
                </div>
                <CardHeader className="p-3">
                  <CardTitle className="text-sm font-semibold truncate">{poi.name}</CardTitle>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile bottom sheet detail for eligible types */}
      {isMobile && detailPoi && (
        <div className="md:hidden fixed left-0 right-0 bottom-0 z-30">
          <div className="mx-auto w-full max-w-md rounded-t-2xl border bg-card shadow-lg">
            <div className="w-10 h-1.5 bg-muted-foreground/40 rounded-full mx-auto mt-2" />
            <div className="p-3 space-y-3">
              <div className="aspect-[16/9] w-full bg-muted overflow-hidden rounded-lg">
                <img src={detailPoi.image} alt={detailPoi.name} className="h-full w-full object-cover" />
              </div>
              <div className="px-1">
                <div className="text-base font-semibold">{detailPoi.name}</div>
              </div>
              <div className="px-1 pb-2">
                <Button className="w-full h-11 bg-teal-500 hover:bg-teal-600 text-white" onClick={() => {}}>
                  앱에서 보기
                </Button>
                <Button variant="outline" className="w-full h-10 mt-2" onClick={() => setDetailId(null)}>
                  닫기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zoom level indicator */}
      <div className="absolute bottom-4 right-4 bg-card border rounded px-2 py-1">
        <span className="text-xs text-muted-foreground">Zoom: {zoom}</span>
      </div>

      {/* Map attribution */}
      <div className="absolute bottom-4 left-4 bg-card border rounded px-2 py-1">
        <span className="text-xs text-muted-foreground">© TravelKorea Maps</span>
      </div>
    </div>
  )
}
