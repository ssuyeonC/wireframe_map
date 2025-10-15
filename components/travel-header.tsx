import { Search, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TravelHeader() {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">T</span>
              </div>
              <span className="font-bold text-xl text-foreground">TravelKorea</span>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <button className="text-foreground hover:text-primary font-medium">여행</button>
              <button className="text-muted-foreground hover:text-foreground">숙박</button>
              <button className="text-muted-foreground hover:text-foreground">항공</button>
              <button className="text-muted-foreground hover:text-foreground">렌터카</button>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-secondary rounded-lg px-3 py-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="어디로 여행하시나요?"
                className="bg-transparent border-none outline-none text-sm w-64"
              />
            </div>

            <Button variant="ghost" size="sm">
              <User className="w-4 h-4 mr-2" />
              로그인
            </Button>

            <Button size="sm">회원가입</Button>

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
