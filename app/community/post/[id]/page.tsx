import { useMemo } from "react"
import PostDetailClient from "./post-detail-client"
import { getRelatedProductsForPostId } from "@/lib/community-products"

export default function CommunityPostDetailPage({ params }: { params: { id: string } }) {
  const { id } = params

  const { post, comments } = useMemo(() => {
    const titles: Record<string, string> = {
      "1": "Gyeongbokgung Palace Night Tour",
      "2": "Businesses closed for the 2025 Mid-Autumn Festival",
      "3": "Charter transfer service",
      "4": "Exchange money",
      "5": "Scam album stores warning",
      "6": "Best Korean BBQ in Gangnam",
      "7": "Looking for Jeju travel buddy",
      "999": "My New Community Post",
    }
    const title = titles[id] ?? `Community Post #${id}`

    const post = {
      title,
      author: id === "1" ? "Jon Doe" : id === "2" ? "Guest User" : "Anonymous",
      date: "2025.09.05",
      category: id === "7" ? "MY TRAVEL PLAN" : id === "3" ? "TALK" : "QUESTION",
      isAnonymous: id === "2",
      likes: 5 + Number(id) % 7,
      content: [
        `Sample content for post ${id}. This is a placeholder paragraph describing details about "${title}" and useful information for travelers.`,
        "Feel free to replace this with real content later. Comments below are also sample data.",
      ],
    }

    const comments = [
      { id: 1, author: "TravelerA", content: `Great info on post ${id}!`, time: "2 hours ago", likes: 1 },
      { id: 2, author: "Anonymous", content: "Thanks for sharing!", time: "1 hour ago", likes: 0 },
    ]
    return { post, comments }
  }, [id])

  const relatedProducts = getRelatedProductsForPostId(Number(id))

  return <PostDetailClient post={post as any} comments={comments as any} relatedProducts={relatedProducts} />
}

export function generateStaticParams() {
  return ["1", "2", "3", "4", "5", "6", "7", "999"].map((id) => ({ id }))
}
