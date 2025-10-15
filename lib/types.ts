export type CategoryId =
  | "all"
  | "spot"
  | "stay"
  | "place"
  | "oliveyoung"
  | "daiso"
  | "lottemart"

export const CATEGORY_LABELS: Record<CategoryId, string> = {
  all: "All",
  spot: "Spot",
  stay: "Stay",
  place: "Place",
  oliveyoung: "Oliveyoung",
  daiso: "Daiso",
  lottemart: "LotteMart",
}

export type SpotSubId = "activity" | "hair" | "photo" | "spa"

export const SPOT_SUB_LABELS: Record<SpotSubId, string> = {
  activity: "Activity",
  hair: "Hair",
  photo: "Photo",
  spa: "Spa",
}

// Third-level filters for Spot
export type SpotSub2Id =
  | "kpop"
  | "class"
  | "learn"
  | "color"
  | "perm"
  | "cut"
  | "hanbok"
  | "id"
  | "wedding"
  | "luxury"
  | "wellness"

export const SPOT_SUB2_LABELS: Record<SpotSub2Id, string> = {
  kpop: "KPop",
  class: "Class",
  learn: "Learn",
  color: "Color",
  perm: "Perm",
  cut: "Cut",
  hanbok: "Hanbok",
  id: "ID",
  wedding: "Wedding",
  luxury: "Luxury",
  wellness: "Wellness",
}

export const SPOT_SUB2_OPTIONS: Record<SpotSubId, SpotSub2Id[]> = {
  activity: ["kpop", "class", "learn"],
  hair: ["color", "perm", "cut"],
  photo: ["hanbok", "id", "wedding"],
  spa: ["luxury", "wellness"],
}
