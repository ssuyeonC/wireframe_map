"use client"

import { useRouter } from "next/navigation"
import { PostDetail } from "@/components/post-detail"
import type { ConnectedProduct } from "@/lib/community-products"

export default function PostDetailClient({
  post,
  comments,
  relatedProducts,
}: {
  post: any
  comments: any
  relatedProducts?: ConnectedProduct[]
}) {
  const router = useRouter()
  return (
    <PostDetail
      onBack={() => router.push("/community")}
      post={post}
      comments={comments}
      relatedProducts={relatedProducts}
    />
  )
}
