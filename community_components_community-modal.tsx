"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TravelItinerary } from "@/components/travel-itinerary"

export function CommunityModal({
  isOpen,
  onClose,
  onSubmit,
}: { isOpen: boolean; onClose: () => void; onSubmit?: () => void }) {
  const [selectedCategory, setSelectedCategory] = useState("Information")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [postAnonymously, setPostAnonymously] = useState(false)
  const [hasItinerary, setHasItinerary] = useState(true) // 여행 일정이 이미 첨부된 상태로 시작

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">COMMUNITY</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Category */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Category</label>
            <div className="flex gap-2">
              {["Information", "Question", "Request"].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    selectedCategory === category
                      ? "bg-teal-500 text-white border-teal-500"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write the title"
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your content"
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Travel Itinerary - 첨부된 상태 */}
          {hasItinerary && (
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">첨부된 여행 일정</span>
                <button onClick={() => setHasItinerary(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
              <div className="bg-white rounded-md overflow-hidden">
                <TravelItinerary />
              </div>
            </div>
          )}

          {/* Add Itinerary Button */}
          {!hasItinerary && (
            <Button
              onClick={() => setHasItinerary(true)}
              variant="outline"
              className="w-full border-dashed border-2 border-gray-300 text-gray-600 hover:border-teal-500 hover:text-teal-600 py-6"
            >
              + 내 일정 추가하기
            </Button>
          )}

          {/* Post Anonymously */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={postAnonymously}
              onChange={(e) => setPostAnonymously(e.target.checked)}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-600">
              Post anonymously
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <Button onClick={handleSubmit} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
            CONFIRM
          </Button>
        </div>
      </div>
    </div>
  )
}
