"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { TravelItinerary } from "@/components/travel-itinerary"
import { X, Plus } from "lucide-react"

export default function CommunityWritePage() {
  const router = useRouter()
  const [category, setCategory] = useState<"Question" | "My Travel Plan" | "Talk">("Question")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [hasItinerary, setHasItinerary] = useState(false)

  const handleSubmit = () => {
    // 임시로 새 글 ID를 999로 이동
    router.push("/community/post/999")
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <button onClick={() => router.push("/community")} className="text-gray-600 hover:text-gray-900">
            <X className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">COMMUNITY</h1>
          <div className="w-6" />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Category</label>
            <div className="flex gap-2">
              {(["Question", "My Travel Plan", "Talk"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    category === cat ? "bg-teal-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Write the title" className="w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your review" className="w-full min-h-[200px] resize-none" />
          </div>

          {hasItinerary && (
            <div className="border border-gray-200 rounded-lg p-4 relative">
              <button onClick={() => setHasItinerary(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
              <TravelItinerary />
            </div>
          )}

          {!hasItinerary && (
            <Button onClick={() => setHasItinerary(true)} variant="outline" className="w-full border-dashed border-2 border-gray-300 text-gray-600 hover:border-teal-500 hover:text-teal-500">
              <Plus className="w-5 h-5 mr-2" />내 일정 추가하기
            </Button>
          )}

          <div className="flex items-center gap-2">
            <input id="anonymous" type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
            <label htmlFor="anonymous" className="text-sm text-gray-600">Post anonymously</label>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} className="bg-teal-500 hover:bg-teal-600 text-white px-6">SUBMIT</Button>
          </div>
        </div>
      </div>
    </main>
  )
}
