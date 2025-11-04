"use client"

import { PostDetail } from "@/components/post-detail"
import { useRouter } from "next/navigation"

export default function PostPage() {
  const router = useRouter()

  return <PostDetail onBack={() => router.push("/")} />
}
