import { useEffect, useState } from "react"
import { CheckCircle, Clock, Users, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import API_URL from "@/config/api"

export default function Dashboard() {
  const [tickets, setTickets] = useState([])
  const [engineers, setEngineers] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [ticketsRes, engineersRes, departmentsRes] = await Promise.all([
        axios.get(`${API_URL}/api/tickets/`, { withCredentials: true }),
        axios.get(`${API_URL}/api/engineers/`, { withCredentials: true }),
        axios.get(`${API_URL}/api/departments/`, { withCredentials: true }),
      ])
      setTickets(ticketsRes.data)
      setEngineers(engineersRes.data)
      setDepartments(departmentsRes.data)
    } catch (error) {
      console.error("Failed to fetch dashboard data", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const openTickets = tickets.filter((t) => t.status === "Open").length
  const inProgressTickets = tickets.filter((t) => t.status === "In Progress").length
  const resolvedToday = tickets.filter((t) => {
    if (t.status !== "Resolved" && t.status !== "Closed") return false
    const ticketDate = new Date(t.updatedAt || t.createdAt)
    const today = new Date()
    return ticketDate.toDateString() === today.toDateString()
  }).length

  // Get recent tickets for activity feed
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 4)

  // Calculate engineer performance (tickets resolved)
  const engineerPerformance = engineers.map((eng) => {
    const engineerTickets = tickets.filter((t) => t.assignedEngineer?._id === eng._id)
    const resolvedTickets = engineerTickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length
    const totalTickets = engineerTickets.length
    const percentage = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0
    return { name: eng.name, percentage, resolved: resolvedTickets, total: totalTickets }
  }).sort((a, b) => b.percentage - a.percentage).slice(0, 3)

  const stats = [
    {
      title: "Open Tickets",
      value: loading ? "..." : openTickets.toString(),
      icon: AlertCircle,
      tone: "text-amber-300",
      chip: "from-amber-400/20 via-amber-400/10 to-transparent",
      delta: `${openTickets} pending`,
    },
    {
      title: "In Progress",
      value: loading ? "..." : inProgressTickets.toString(),
      icon: Clock,
      tone: "text-cyan-300",
      chip: "from-cyan-400/25 via-cyan-400/10 to-transparent",
      delta: `${inProgressTickets} active`,
    },
    {
      title: "Resolved Today",
      value: loading ? "..." : resolvedToday.toString(),
      icon: CheckCircle,
      tone: "text-emerald-300",
      chip: "from-emerald-400/25 via-emerald-400/10 to-transparent",
      delta: `${resolvedToday} completed`,
    },
    {
      title: "Support Team",
      value: loading ? "..." : engineers.length.toString(),
      icon: Users,
      tone: "text-blue-300",
      chip: "from-blue-400/25 via-blue-400/12 to-transparent",
      delta: `${departments.length} departments`,
    },
  ]

  const getTimeAgo = (date) => {
    const now = new Date()
    const ticketDate = new Date(date)
    const diffMs = now - ticketDate
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  }

  return (
    <div className="p-8 relative z-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Support Dashboard</h1>
        <p className="text-muted-foreground">Monitor your support ticket system in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className="relative overflow-hidden border border-border/60 bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 shadow-sm"
            >
              <span className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/4 via-transparent to-transparent opacity-70" />
              <CardHeader className="pb-3 relative">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground/90 tracking-wide">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg border border-border/50 bg-linear-to-br ${stat.chip}`}>
                    <Icon className={`w-5 h-5 ${stat.tone}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-semibold text-foreground tracking-tight">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-2">{stat.delta} vs last 24h</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/80 border border-border/60 backdrop-blur hover:border-primary/30 transition-colors">
          <CardHeader className="border-b border-border/40">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground/80">
              Recent Support Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading activity...</div>
              ) : recentTickets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No recent activity</div>
              ) : (
                recentTickets.map((ticket) => (
                  <div key={ticket._id} className="flex items-start gap-4 pb-4 border-b border-border/40 last:border-0">
                    <div className="w-2 h-2 bg-primary/60 rounded-full mt-2 shrink-0 shadow-[0_0_8px_var(--color-primary)/40]" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {ticket.title}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {ticket.status} • Assigned to {ticket.assignedEngineer?.name || "Unassigned"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getTimeAgo(ticket.updatedAt || ticket.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 border border-border/60 backdrop-blur hover:border-primary/30 transition-colors">
          <CardHeader className="border-b border-border/40">
            <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground/80">Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : engineerPerformance.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No engineers yet</div>
              ) : (
                engineerPerformance.map((engineer, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm font-medium text-foreground/90 truncate">{engineer.name}</p>
                      <p className="text-sm text-muted-foreground">{engineer.percentage}%</p>
                    </div>
                    <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/70 transition-all duration-500"
                        style={{ width: `${engineer.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {engineer.resolved} of {engineer.total} tickets resolved
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
