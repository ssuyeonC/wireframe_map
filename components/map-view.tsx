"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { GoogleMap, OverlayView, Polygon, useJsApiLoader } from "@react-google-maps/api"
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

// 검색 반경 (미터 단위)
// 레퍼런스처럼 화면을 넓게 덮도록 약 1.5km로 설정
const SEARCH_RADIUS_M = 1500

function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

function distanceMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
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

export function MapView({
  activeFilter = "all",
  spotSubFilter = null,
  spotSub2Filter = null,
  onVisibleTypesChange,
}: {
  activeFilter?: CategoryId
  spotSubFilter?: SpotSubId | null
  spotSub2Filter?: SpotSub2Id | null
  onVisibleTypesChange?: (types: CategoryId[]) => void
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "gmap-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  })
  const [zoom, setZoom] = useState(13)
  // 검색 기준이 되는 원의 중심 좌표 (지도 이동과는 별개로 유지)
  const [searchCenter, setSearchCenter] = useState<google.maps.LatLngLiteral>({ lat: 37.5665, lng: 126.978 })
  const [pois, setPois] = useState<Poi[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [mobileFocusedId, setMobileFocusedId] = useState<string | null>(null)
  const [isRegionView, setIsRegionView] = useState(false)
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)
  const [sidebarMode, setSidebarMode] = useState<"region" | "product">("product")

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
    const c = map.getCenter()
    if (!b || !c) return
    const newCenter = { lat: c.lat(), lng: c.lng() }
    setSearchCenter(newCenter)
    const effectiveZoom = map.getZoom() ?? zoom
    setPois(generatePoisInBounds(b, effectiveZoom))
    setSelectedId(null)
    setDetailId(null)
  }, [zoom])

  // Sidebar refs (desktop) and mobile list refs
  const sidebarRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<google.maps.Map | null>(null)
  const searchCircleRef = useRef<google.maps.Circle | null>(null)
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
      // 모바일 환경에서는 카드/바텀시트 노출 시 지도의 위치를 유지하기 위해 중심 이동을 하지 않는다.
      if (!isMobile && poi && map) map.panTo({ lat: poi.lat, lng: poi.lng })

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

  const selectedForCard = useMemo(() => {
    if (!selectedId) return null
    const poi = filtered.find((p) => p.id === selectedId) ?? null
    if (!poi) return null
    if (detailEligible.has(poi.type)) return null
    return poi
  }, [filtered, selectedId])

  // Visible items based on map bounds + 원 반경
  const [visibleFiltered, setVisibleFiltered] = useState<Poi[]>([])
  const updateVisible = useCallback(() => {
    const map = mapRef.current
    if (!map) {
      setVisibleFiltered([])
      if (onVisibleTypesChange) onVisibleTypesChange([])
      return
    }
    const bounds = map.getBounds()
    if (!bounds) {
      setVisibleFiltered([])
      if (onVisibleTypesChange) onVisibleTypesChange([])
      return
    }
    const centerLat = searchCenter.lat
    const centerLng = searchCenter.lng
    const nextVisibleFiltered = filtered.filter((p) => {
      if (!bounds.contains({ lat: p.lat, lng: p.lng })) return false
      const d = distanceMeters(p.lat, p.lng, centerLat, centerLng)
      return d <= SEARCH_RADIUS_M
    })
    setVisibleFiltered(nextVisibleFiltered)

    if (onVisibleTypesChange) {
      const visibleAllTypes = pois.filter((p) => {
        if (!bounds.contains({ lat: p.lat, lng: p.lng })) return false
        const d = distanceMeters(p.lat, p.lng, centerLat, centerLng)
        return d <= SEARCH_RADIUS_M
      })
      const typeSet = new Set<CategoryId>()
      visibleAllTypes.forEach((p) => {
        typeSet.add(p.type)
      })
      onVisibleTypesChange(Array.from(typeSet))
    }
  }, [filtered, pois, searchCenter, onVisibleTypesChange])

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
    setMapInstance(map)
  }, [])

  // 최초 한 번만 자동으로 POI를 생성하기 위한 플래그
  const initializedRef = useRef(false)

  const onMapIdle = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    const z = map.getZoom()
    if (typeof z === "number") setZoom(z)
    const b = map.getBounds()
    if (!b) return

    // 첫 로드 시에만 현재 뷰 기준으로 POI 생성 + 원 중심을 지도 중앙으로 설정
    if (!initializedRef.current && pois.length === 0) {
      initializedRef.current = true
      const c = map.getCenter()
      if (c) {
        setSearchCenter({ lat: c.lat(), lng: c.lng() })
      }
      const effectiveZoom = typeof z === "number" ? z : zoom
      setPois(generatePoisInBounds(b, effectiveZoom))
      setSelectedId(null)
      setDetailId(null)
    }

    // 항상 현재 뷰와 검색 반경 기준으로 visibleFiltered 갱신
    updateVisible()
  }, [pois.length, updateVisible, zoom])

  // Recompute visible cards when filter changes without moving the map
  useEffect(() => {
    updateVisible()
  }, [filtered, updateVisible])

  // Maintain a single search radius circle on the map
  useEffect(() => {
    if (!mapInstance) return

    if (!searchCircleRef.current) {
      searchCircleRef.current = new google.maps.Circle({
        map: mapInstance,
        center: searchCenter,
        radius: SEARCH_RADIUS_M,
        fillColor: "#22c55e",
        fillOpacity: 0.25,
        strokeColor: "#16a34a",
        strokeOpacity: 1,
        strokeWeight: 2,
        clickable: false,
        zIndex: 1,
      })
    } else {
      searchCircleRef.current.setMap(mapInstance)
      searchCircleRef.current.setCenter(searchCenter)
      searchCircleRef.current.setRadius(SEARCH_RADIUS_M)
    }
  }, [mapInstance, searchCenter])

  // Cleanup circle when component unmounts
  useEffect(() => {
    return () => {
      if (searchCircleRef.current) {
        searchCircleRef.current.setMap(null)
        searchCircleRef.current = null
      }
    }
  }, [])

  // 선택된/상세 POI가 원 밖으로 나가면 해제
  useEffect(() => {
    if (selectedId && !visibleFiltered.some((p) => p.id === selectedId)) {
      setSelectedId(null)
    }
  }, [selectedId, visibleFiltered])

  useEffect(() => {
    if (detailId && !visibleFiltered.some((p) => p.id === detailId)) {
      setDetailId(null)
    }
  }, [detailId, visibleFiltered])

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

  // 행정구역(지역 뷰) 폴리곤 모양 - 검색 중심 기준으로 간단한 다각형 생성
  const regionPolygon = useMemo<google.maps.LatLngLiteral[]>(() => {
    const { lat, lng } = searchCenter
    const dLat = 0.025
    const dLng = 0.03
    return [
      { lat: lat + dLat, lng: lng - dLng * 0.6 },
      { lat: lat + dLat * 0.4, lng: lng + dLng },
      { lat: lat, lng: lng + dLng * 1.2 },
      { lat: lat - dLat * 0.6, lng: lng + dLng * 0.4 },
      { lat: lat - dLat, lng: lng - dLng * 0.8 },
      { lat: lat - dLat * 0.2, lng: lng - dLng * 1.1 },
    ]
  }, [searchCenter])

  const effectiveSidebarMode: "region" | "product" = !isRegionView ? "product" : sidebarMode

  return (
    <div className="relative bg-map-bg rounded-lg border overflow-hidden h-full">
      <div className="absolute inset-0">
        {!isLoaded ? (
          <div className="w-full h-full grid place-items-center text-sm text-muted-foreground">Google Maps를 불러오는 중...</div>
        ) : !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
          <div className="w-full h-full grid place-items-center p-6 text-center text-sm text-muted-foreground">
            <div>
              <div className="mb-2 font-medium text-foreground">API Key가 필요합니다.</div>
              <div className="mb-1">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY가 빌드 시점에 주입되지 않았습니다.</div>
              <div className="opacity-70">GitHub Actions Secrets/Variables에 키를 추가했는지 확인해 주세요.</div>
            </div>
          </div>
        ) : loadError ? (
          <div className="w-full h-full grid place-items-center p-6 text-center text-sm text-muted-foreground">
            <div>
              <div className="mb-2 font-medium text-foreground">지도를 불러오지 못했습니다.</div>
              <div className="mb-1">Maps JavaScript API 활성화 및 HTTP referrer 제한 도메인을 확인해 주세요.</div>
              <div className="opacity-70">예: https://{typeof window !== 'undefined' ? window.location.host : 'your-domain' }/*</div>
            </div>
          </div>
        ) : (
          <GoogleMap onLoad={onMapLoad} onIdle={onMapIdle} mapContainerStyle={{ width: "100%", height: "100%" }} options={mapOptions}>
            {isRegionView && (
              <Polygon
                paths={regionPolygon}
                options={{
                  fillColor: "#fb923c",
                  fillOpacity: 0.25,
                  strokeColor: "#f97316",
                  strokeOpacity: 1,
                  strokeWeight: 2,
                  clickable: false,
                  zIndex: 1,
                }}
              />
            )}
            {visibleFiltered.map((poi) => {
              const Icon = TYPE_ICON[poi.type]
              const selected = selectedId === poi.id
              return (
                <OverlayView key={poi.id} position={{ lat: poi.lat, lng: poi.lng }} mapPaneName="overlayMouseTarget">
                  <div
                    className={`-translate-x-1/2 -translate-y-1/2 cursor-pointer transform-gpu ${selected ? "scale-110" : "scale-100"}`}
                    onClick={() => {
                      if (isMobile && detailEligible.has(poi.type)) {
                        openDetail(poi)
                      } else {
                        handleSelect(poi.id)
                      }
                    }}
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

      <div className="absolute top-4 left-1/2 md:left-[calc(50%+10rem)] transform -translate-x-1/2">
        <Button
          variant="ghost"
          className="bg-white hover:bg-gray-50 !text-black border shadow-sm font-medium"
          onClick={rerandomize}
        >
          현 위치에서 재검색
        </Button>
      </div>

      <div className="absolute bottom-4 left-1/2 md:left-[calc(50%+10rem)] transform -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 border shadow-sm">
          <span className="text-xs font-medium text-black">지역 뷰 보기</span>
          <button
            type="button"
            role="switch"
            aria-checked={isRegionView}
            className={`relative inline-flex h-4 w-7 items-center rounded-full border transition-colors ${
              isRegionView ? "bg-teal-500 border-teal-600" : "bg-gray-200 border-gray-300"
            }`}
            onClick={() => setIsRegionView((prev) => !prev)}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${
                isRegionView ? "translate-x-3" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 mb-12">
        <Button variant="secondary" size="sm" className="bg-white hover:bg-gray-50 border shadow-sm">
          <MapPin className="w-4 h-4" />
          <span className="ml-1 text-xs">내 위치</span>
        </Button>
      </div>

      {/* Sidebar: filtered list (desktop only) */}
      <aside className="hidden md:flex absolute left-0 top-0 bottom-0 w-80 bg-card/95 backdrop-blur border-r z-20">
        {isRegionView && (
          <div className="flex flex-col w-20 border-r bg-card/95">
            <button
              type="button"
              className={`flex-1 px-2 py-3 text-[11px] font-medium text-left border-l-2 ${
                effectiveSidebarMode === "region"
                  ? "border-teal-500 bg-muted text-foreground"
                  : "border-transparent text-muted-foreground hover:bg-muted/50"
              }`}
              onClick={() => setSidebarMode("region")}
            >
              지역 정보
            </button>
            <button
              type="button"
              className={`flex-1 px-2 py-3 text-[11px] font-medium text-left border-l-2 ${
                effectiveSidebarMode === "product"
                  ? "border-teal-500 bg-muted text-foreground"
                  : "border-transparent text-muted-foreground hover:bg-muted/50"
              }`}
              onClick={() => setSidebarMode("product")}
            >
              상품 정보
            </button>
          </div>
        )}

        <div ref={sidebarRef} className="flex-1 overflow-y-auto">
          {effectiveSidebarMode === "region" && isRegionView ? (
            <div className="p-3 space-y-3">
              <Card className="overflow-hidden">
                <CardHeader className="p-4 pb-3">
                  <CardTitle className="text-base">지역 정보</CardTitle>
                  <CardDescription className="mt-1 text-xs">
                    현재 지도에서 보이는 영역 기준 요약 정보입니다.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-1 text-xs">
                  <div>현재 지역 내 총 {visibleFiltered.length}개 상품이 있습니다.</div>
                </CardContent>
              </Card>
            </div>
          ) : detailPoi ? (
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
                  className={`overflow-hidden transition-shadow cursor-pointer ${
                    selectedId === poi.id ? "ring-2 ring-primary" : "hover:shadow-sm"
                  }`}
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
                      <div className="mb-2 text-sm font-semibold">
                        ₩{new Intl.NumberFormat("ko-KR").format(poi.price ?? 0)}
                      </div>
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
        </div>
      </aside>

      {/* Mobile single selected card (spot/stay/place) */}
      {isMobile && selectedForCard && !detailPoi && (
        <div className="md:hidden fixed left-0 right-0 bottom-0 z-20">
          <div className="mx-auto w-full max-w-md rounded-t-2xl border bg-card shadow-lg">
            <div className="p-3 space-y-3">
              <div className="aspect-[16/9] w-full bg-muted overflow-hidden rounded-lg">
                <img src={selectedForCard.image} alt={selectedForCard.name} className="h-full w-full object-cover" />
              </div>
              <div className="px-1 pb-1">
                <div className="text-base font-semibold truncate">{selectedForCard.name}</div>
                {(selectedForCard.type === "spot" || selectedForCard.type === "stay") && (
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span className="text-foreground/90">{selectedForCard.rating?.toFixed(1)}</span>
                      <span className="text-muted-foreground">({selectedForCard.reviews})</span>
                    </div>
                    <div className="text-sm font-semibold">
                      ₩{new Intl.NumberFormat("ko-KR").format(selectedForCard.price ?? 0)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
