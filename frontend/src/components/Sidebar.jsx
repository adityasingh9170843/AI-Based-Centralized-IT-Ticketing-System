import { LayoutDashboard, Users, Ticket, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Sidebar({ currentPage, onPageChange }) {
  const menuItems = [
  { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "tickets", label: "Support Tickets", icon: Ticket },
    { id: "engineers", label: "Support Team", icon: Users },
    { id: "departments", label: "Departments", icon: Users },
  ]

  return (
    <aside className="relative w-64 border-r border-border/60 bg-sidebar/90 backdrop-blur supports-backdrop-filter:bg-sidebar/75 flex flex-col overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(80%_60%_at_20%_-20%,var(--color-primary)/18,transparent)]" />
      <div className="p-6 border-b border-border/50 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-primary/30 via-primary/20 to-transparent border border-primary/30 rounded-xl flex items-center justify-center shadow-sm">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-sidebar-foreground tracking-tight">Aegis Support</h1>
              <p className="text-xs text-muted-foreground/80">Command Center</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2 relative z-10">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={cn(
                "group w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border text-sm relative overflow-visible",
                isActive
                  ? "bg-linear-to-r from-primary/25 via-primary/10 to-transparent text-foreground shadow-md border-primary/60 ring-1 ring-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:border-border/40 hover:bg-muted/40 hover:border-primary/30 hover:bg-primary/5"
              )}
            >
              {/* subtle animated left edge indicator */}
              <span
                aria-hidden
                className={cn(
                  "absolute left-0 top-2 bottom-2 w-1 rounded-r-md transition-transform duration-300 origin-top",
                  isActive ? "bg-primary scale-y-100" : "bg-primary/30 scale-y-0 group-hover:scale-y-100"
                )}
              />
              <Icon className={cn("w-5 h-5 transition-transform duration-200", isActive ? "scale-105 text-primary" : "text-muted-foreground group-hover:text-foreground")}
              />
              <span className={cn("ml-1 font-medium tracking-wide transition-colors", isActive ? "text-primary" : "group-hover:text-foreground")}>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border/50 text-xs text-muted-foreground relative z-10">
        <div className="flex flex-col gap-1">
          <span>Support v1.0.0</span>
          <span className="text-muted-foreground/70">Status: Operational</span>
        </div>
      </div>
    </aside>
  )
}
