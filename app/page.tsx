import Link from "next/link"

export default function IndexPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">인덱스</h1>
        <Link
          href="/map"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90 transition"
        >
          지도 와이어프레임
        </Link>
      </div>
    </main>
  )
}

