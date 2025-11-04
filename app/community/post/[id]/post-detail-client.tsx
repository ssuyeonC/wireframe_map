"use client"

import { useRouter } from "next/navigation"
import { PostDetail } from "@/components/post-detail"

export default function PostDetailClient({ post, comments }: { post: any; comments: any }) {
  const router = useRouter()
  return <PostDetail onBack={() => router.push("/community")} post={post} comments={comments} />
}

