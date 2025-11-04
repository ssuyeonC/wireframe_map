"use client"

import type React from "react"

import { useState, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Heart, MessageCircle, MoreVertical } from "lucide-react"

type Category = "ALL" | "QUESTION" | "TALK" | "MY TRAVEL PLAN"
type SortOption = "latest" | "popular" | "comments"

interface Post {
  id: number
  category: Exclude<Category, "ALL">
  title: string
  author: string
  date: string
  likes: number
  comments: number
  isHighlight?: boolean
}

const mockPosts: Post[] = [
  {
    id: 1,
    category: "QUESTION",
    title: "Gyeongbokgung Palace Night Tour",
    author: "Jon Doe", // Changed from "Anonymous" to "Jon Doe"
    date: "2025.09.05",
    likes: 0,
    comments: 2,
    isHighlight: true,
  },
  {
    id: 2,
    category: "QUESTION",
    title: "Hello, the list of businesses closed for the 2025 Mid-Autumn Festival.",
    author: "Guest User",
    date: "2025.08.22",
    likes: 10,
    comments: 6,
    isHighlight: true,
  },
  {
    id: 3,
    category: "TALK",
    title: "Charter transfer service",
    author: "Anonymous",
    date: "2025.08.20",
    likes: 5,
    comments: 1,
  },
  {
    id: 4,
    category: "QUESTION",
    title: "Exchange money",
    author: "Anonymous",
    date: "2025.08.17",
    likes: 6,
    comments: 1,
  },
  {
    id: 5,
    category: "QUESTION",
    title: "Urgent!! There are a lot of scam album stores stealing photos",
    author: "Guest User",
    date: "2025.08.13",
    likes: 8,
    comments: 0,
    isHighlight: true,
  },
  {
    id: 6,
    category: "TALK",
    title: "Best Korean BBQ restaurants in Gangnam",
    author: "Travel Expert",
    date: "2025.08.10",
    likes: 15,
    comments: 8,
    isHighlight: true,
  },
  {
    id: 7,
    category: "MY TRAVEL PLAN",
    title: "Looking for travel buddy for Jeju Island",
    author: "Solo Traveler",
    date: "2025.08.08",
    likes: 3,
    comments: 12,
    isHighlight: true,
  },
]

const categoryDescriptions: Record<Category, string> = {
  ALL: "",
  QUESTION:
    "Share your questions about traveling in Korea! For inquiries about Creatrip products, please email help@creatrip.com.",
  TALK: "Share your free-spirited stories about traveling in Korea. You might even find a friend to travel with!",
  "MY TRAVEL PLAN": "Are you having trouble planning your trip to Korea? Share your plans and get advice!",
}

export default function ForumPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [actualSearchQuery, setActualSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("latest")
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showSearchHistory, setShowSearchHistory] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedHistory = localStorage.getItem("forum-search-history")
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory))
    }
  }, [])

  const saveSearchHistory = (query: string) => {
    if (query.trim() === "") return

    const newHistory = [query, ...searchHistory.filter((item) => item !== query)].slice(0, 10)
    setSearchHistory(newHistory)
    localStorage.setItem("forum-search-history", JSON.stringify(newHistory))
  }

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim()
    setActualSearchQuery(trimmedQuery)
    if (trimmedQuery) {
      saveSearchHistory(trimmedQuery)
    }
    setShowSearchHistory(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleHistoryClick = (historyItem: string) => {
    setSearchQuery(historyItem)
    setActualSearchQuery(historyItem)
    setShowSearchHistory(false)
  }

  const filteredAndSortedPosts = useMemo(() => {
    const filtered = mockPosts.filter((post) => {
      const categoryMatch = activeCategory === "ALL" || post.category === activeCategory
      const searchMatch = actualSearchQuery === "" || post.title.toLowerCase().includes(actualSearchQuery.toLowerCase())
      return categoryMatch && searchMatch
    })

    filtered.sort((a, b) => {
      switch (sortOption) {
        case "popular":
          return b.likes - a.likes
        case "comments":
          return b.comments - a.comments
        case "latest":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
    })

    return filtered
  }, [activeCategory, actualSearchQuery, sortOption])

  const highlightPosts = useMemo(() => {
    const categoryPosts =
      activeCategory === "ALL"
        ? mockPosts.filter((post) => post.isHighlight)
        : mockPosts.filter((post) => post.category === activeCategory && post.isHighlight)

    return categoryPosts.slice(0, 5)
  }, [activeCategory])

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "QUESTION":
        return "bg-teal-100 text-teal-700 hover:bg-teal-200"
      case "TALK":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200"
      case "MY TRAVEL PLAN":
        return "bg-purple-100 text-purple-700 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-6 relative">
          <div className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                ref={searchInputRef}
                placeholder="게시물 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setShowSearchHistory(true)}
                onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
                className="pl-10"
              />
              {showSearchHistory && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                  <div className="py-2">
                    <div className="px-3 py-1 text-xs text-gray-500 font-medium">최근 검색어</div>
                    {searchHistory.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleHistoryClick(item)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button onClick={handleSearch} className="bg-teal-500 hover:bg-teal-600 text-white">
              검색
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {(["ALL", "QUESTION", "TALK", "MY TRAVEL PLAN"] as Category[]).map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className={activeCategory === category ? "bg-gray-800 text-white" : ""}
              >
                # {category}
              </Button>
            ))}
          </div>
          <Button className="bg-teal-500 hover:bg-teal-600 text-white px-6">WRITE</Button>
        </div>

        {categoryDescriptions[activeCategory] && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">{categoryDescriptions[activeCategory]}</p>
          </div>
        )}

        {highlightPosts.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">🌟 하이라이트 게시물</h3>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {highlightPosts.map((post) => (
                <Card
                  key={`highlight-${post.id}`}
                  className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-yellow-400 flex-shrink-0 w-80"
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getCategoryBadgeColor(post.category)}>{post.category}</Badge>
                      </div>
                      <h4 className="font-medium text-gray-900 line-clamp-2">{post.title}</h4>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{post.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-600">
            총 <span className="font-medium text-gray-900">{filteredAndSortedPosts.length}</span>개의 게시물
          </div>
          <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신 순</SelectItem>
              <SelectItem value="popular">인기 순</SelectItem>
              <SelectItem value="comments">댓글 많은 순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredAndSortedPosts.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">검색 결과가 없습니다</p>
              </CardContent>
            </Card>
          ) : (
            filteredAndSortedPosts.map((post, index) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getCategoryBadgeColor(post.category)}>{post.category}</Badge>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">{post.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{post.author}</span>
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                      {index === 0 && (
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenMenuId(openMenuId === post.id ? null : post.id)
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {openMenuId === post.id && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  console.log("[v0] 수정하기 clicked for post:", post.id)
                                  setOpenMenuId(null)
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                              >
                                수정하기
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  console.log("[v0] 삭제하기 clicked for post:", post.id)
                                  setOpenMenuId(null)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                삭제하기
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
