export type ExtraFilterId = "hanbokA" | "hanbokB" | "studio"

// Mapping between extra filter ids and post ids to which they are connected
export const EXTRA_FILTER_TO_POST_IDS: Record<ExtraFilterId, number[]> = {
  hanbokA: [1, 2, 3, 4, 5],
  hanbokB: [2, 3],
  studio: [1],
}

export type ConnectedProduct = {
  id: ExtraFilterId
  label: string
  location: string
  title: string
  priceUSD?: number
  rating?: number
  reviewSnippet?: string
  imageUrl?: string
  href?: string
}

// Sample product metadata shown in the post detail page
export const CONNECTED_PRODUCTS: Record<ExtraFilterId, ConnectedProduct> = {
  hanbokA: {
    id: "hanbokA",
    label: "한복A",
    location: "Seoul Gyeongbokgung",
    title: "Premium Hanbok Rental A | Gyeongbokgung Experience",
    priceUSD: 20.82,
    rating: 4.0,
    reviewSnippet:
      "Friendly staff and beautiful outfits. Perfect for palace photos and a great first-time experience.",
    imageUrl:
      "https://images.unsplash.com/photo-1590559899731-a382839e5549?q=80&w=640&auto=format&fit=crop",
    href: "/map",
  },
  hanbokB: {
    id: "hanbokB",
    label: "한복B",
    location: "Seoul Bukchon",
    title: "Classic Hanbok Rental B | Bukchon Hanok Village",
    priceUSD: 18.5,
    rating: 4.2,
    reviewSnippet:
      "Good selection and quick fitting. Nice walk through the village with traditional vibes.",
    imageUrl:
      "https://images.unsplash.com/photo-1548781162-72db52a62e49?q=80&w=640&auto=format&fit=crop",
    href: "/map",
  },
  studio: {
    id: "studio",
    label: "사진관A",
    location: "Seoul Hongdae",
    title: "Hongdae Photo Studio A | ID & Concept Photos",
    priceUSD: 25.0,
    rating: 4.0,
    reviewSnippet:
      "Cozy studio with attentive photographers. The printed results came out great!",
    imageUrl:
      "https://images.unsplash.com/photo-1519183071298-a2962be96f83?q=80&w=640&auto=format&fit=crop",
    href: "/map",
  },
}

export function getRelatedProductsForPostId(postId: number): ConnectedProduct[] {
  const results: ConnectedProduct[] = []
  for (const key of Object.keys(EXTRA_FILTER_TO_POST_IDS) as ExtraFilterId[]) {
    if (EXTRA_FILTER_TO_POST_IDS[key].includes(postId)) {
      results.push(CONNECTED_PRODUCTS[key])
    }
  }
  return results
}

