import { Search, Bell, MessageSquare } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Navbar() {
  return (
    <nav className="h-16 border-b border-border/50 bg-card/70 backdrop-blur supports-backdrop-filter:bg-card/60 px-6 lg:px-8 flex items-center justify-between">
      <div className="flex-1 max-w-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets, engineers, or departments..."
            className="pl-10 bg-muted/40 border border-border/50 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 lg:gap-5">
        <button className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-border/50 bg-muted/30 hover:border-primary/40 transition-all">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 inline-flex h-2.5 w-2.5 rounded-full bg-primary animate-[pulse_2s_ease-in-out_infinite]" />
        </button>
        <button className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-border/50 bg-muted/30 hover:border-primary/40 transition-all">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="hidden md:flex items-center gap-3 pl-4 border-l border-border/50">
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">Support Admin</div>
            <div className="text-xs text-muted-foreground">Shift 09:00 - 17:00</div>
          </div>
          <Avatar className="w-9 h-9 border border-border/60 shadow-sm">
            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Support" />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  )
}
