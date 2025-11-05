"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, MessageCircle, Share2, MoreHorizontal, ChevronLeft, Pencil, Trash2, Star, ChevronRight } from "lucide-react"
import type { ConnectedProduct } from "@/lib/community-products"
import { TravelItinerary } from "@/components/travel-itinerary"

type PostData = {
  title: string
  author: string
  date: string
  category: string
  isAnonymous?: boolean
  likes?: number
  content: string[]
}

type PostComment = { id: number; author: string; content: string; time: string; likes: number }

interface PostDetailProps {
  onBack: () => void
  post?: PostData
  comments?: PostComment[]
  relatedProducts?: ConnectedProduct[]
}

export function PostDetail({ onBack, post, comments: commentsProp, relatedProducts }: PostDetailProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post?.likes ?? 7)
  const [comment, setComment] = useState("")

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const comments = commentsProp ?? [
    {
      id: 1,
      author: "TravelLover",
      content: "Wow, this looks like an amazing itinerary! How was the photo studio experience?",
      time: "2 hours ago",
      likes: 3,
    },
    {
      id: 2,
      author: "Anonymous",
      content: "Thanks for sharing! I'm planning a similar trip next month. Did you book everything in advance?",
      time: "1 hour ago",
      likes: 1,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-gray-900">Community Post</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="bg-white p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-teal-100 text-teal-700">GU</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{post?.author ?? "Guest User"}</span>
                  <Badge variant="secondary" className="text-xs bg-gray-100">{post?.isAnonymous ? "Anonymous" : "Member"}</Badge>
                </div>
                <p className="text-sm text-gray-500">{post?.date ?? "2025.01.09"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">{post?.category ?? "My Travel Plan"}</Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem className="cursor-pointer">
                    <Pencil className="w-4 h-4 mr-2" />
                    수정하기
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제하기
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4">{post?.title ?? "Perfect 4-Day Seoul Beauty & Culture Trip Itinerary"}</h2>

          <div className="text-gray-700 mb-6 leading-relaxed">
            {(post?.content ?? [
              "Just finished an amazing 4-day trip to Seoul focusing on beauty experiences and cultural sites! Sharing my detailed itinerary for anyone planning a similar trip.",
              "The photo studios in Hongdae were absolutely incredible - highly recommend booking in advance! Feel free to ask any questions about specific places.",
            ]).map((p, i) => (
              <p key={i} className="mb-4">{p}</p>
            ))}
          </div>

          <div className="mb-6">
            <TravelItinerary />
          </div>

          {relatedProducts && relatedProducts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">이 글과 관련있는 상품</h3>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {relatedProducts.map((p) => (
                  <div key={p.id} className="rounded-xl border border-gray-200 p-4 flex-shrink-0 w-[360px]">
                    <div className="flex items-start gap-4">
                      <img
                        src={p.imageUrl || "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=640&auto=format&fit=crop"}
                        alt={p.title}
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500">{p.location}</div>
                        <div className="font-semibold text-gray-900 line-clamp-2">{p.title || p.label}</div>
                        {p.priceUSD !== undefined && (
                          <div className="mt-1 font-semibold text-gray-900">{p.priceUSD.toFixed(2)} USD</div>
                        )}
                      </div>
                      <button aria-label="wishlist" className="text-pink-300">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-3 bg-gray-50 border rounded-md p-3 text-sm text-gray-600 flex items-start gap-2">
                      <Star className="w-4 h-4 text-teal-500 mt-0.5" />
                      <div className="line-clamp-2">
                        <span className="font-medium text-gray-800 mr-1">{p.rating?.toFixed(1) ?? "4.0"}</span>
                        {p.reviewSnippet ?? "Customers found this place cozy with great service and photos."}
                      </div>
                    </div>
                    <div className="mt-2">
                      <a href={p.href || "/map"} className="inline-flex items-center gap-1 text-sm text-gray-600 underline">
                        MORE <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-6">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 transition-colors ${
                  isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-sm font-medium">{likeCount}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-teal-600 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{comments.length}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-500 hover:text-teal-600 transition-colors">
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>
        </Card>

        <Card className="bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Comments ({comments.length})</h3>

          <div className="mb-6">
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">ME</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" className="bg-teal-500 hover:bg-teal-600 text-white" disabled={!comment.trim()}>
                    Post Comment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-teal-100 text-teal-700 text-sm">
                    {comment.author === "Anonymous" ? "AN" : comment.author.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">{comment.author}</span>
                      <span className="text-xs text-gray-500">{comment.time}</span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-2 ml-3">
                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="w-3 h-3" />
                      <span>{comment.likes}</span>
                    </button>
                    <button className="text-xs text-gray-500 hover:text-teal-600 transition-colors">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default PostDetail
