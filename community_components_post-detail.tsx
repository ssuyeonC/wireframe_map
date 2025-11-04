"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Heart, MessageCircle, Share2, MoreHorizontal, ChevronLeft, Pencil, Trash2 } from "lucide-react"
import { TravelItinerary } from "./travel-itinerary"

interface PostDetailProps {
  onBack: () => void
}

export function PostDetail({ onBack }: PostDetailProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(7)
  const [comment, setComment] = useState("")

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const comments = [
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
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-gray-900">Community Post</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Post Content */}
        <Card className="bg-white p-6 mb-6">
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-teal-100 text-teal-700">GU</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">Guest User</span>
                  <Badge variant="secondary" className="text-xs bg-gray-100">
                    Anonymous
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">2025.01.09</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">My Travel Plan</Badge>
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

          {/* Post Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">Perfect 4-Day Seoul Beauty & Culture Trip Itinerary</h2>

          {/* Post Content */}
          <div className="text-gray-700 mb-6 leading-relaxed">
            <p className="mb-4">
              Just finished an amazing 4-day trip to Seoul focusing on beauty experiences and cultural sites! Sharing my
              detailed itinerary for anyone planning a similar trip. Each day was perfectly balanced between beauty
              treatments, photo sessions, and sightseeing.
            </p>
            <p className="mb-4">
              The photo studios in Hongdae were absolutely incredible - highly recommend booking in advance! The beauty
              treatments were also top-notch. Feel free to ask any questions about specific places.
            </p>
          </div>

          {/* Attached Itinerary */}
          <div className="mb-6">
            <TravelItinerary />
          </div>

          {/* Post Actions */}
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

        {/* Comments Section */}
        <Card className="bg-white p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Comments ({comments.length})</h3>

          {/* Comment Input */}
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

          {/* Comments List */}
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
