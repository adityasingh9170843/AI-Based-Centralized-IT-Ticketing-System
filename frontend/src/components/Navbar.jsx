import { Search, Bell, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Navbar() {
  return (
    <nav className="h-16 bg-card border-b border-border px-8 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search tickets or team..." className="pl-10 bg-muted border-border" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors group">
          
          
        </button>
        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors group">
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">Support Admin</div>
            <div className="text-xs text-muted-foreground">Online</div>
          </div>
          <Avatar className="w-9 h-9">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Support" />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  )
}
