"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Creatrip Community</h1>
          <Button
            onClick={() => router.push("/write")}
            className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 text-lg"
          >
            WRITE
          </Button>
        </div>
      </div>
    </main>
  )
}
