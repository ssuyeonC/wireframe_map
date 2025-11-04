"use client"

import { useRouter } from "next/navigation"
import { PostDetail } from "@/components/post-detail"

export default function CommunityPostPage() {
  const router = useRouter()
  return <PostDetail onBack={() => router.push("/community")} />
}

