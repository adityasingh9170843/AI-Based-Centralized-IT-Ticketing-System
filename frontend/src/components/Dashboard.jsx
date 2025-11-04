import { CheckCircle, Clock, Users, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const stats = [
    {
      title: "Open Tickets",
      value: "24",
      icon: AlertCircle,
      tone: "text-amber-300",
      chip: "from-amber-400/20 via-amber-400/10 to-transparent",
      delta: "↑ 4.1%",
    },
    {
      title: "In Progress",
      value: "42",
      icon: Clock,
      tone: "text-cyan-300",
      chip: "from-cyan-400/25 via-cyan-400/10 to-transparent",
      delta: "↔ stable",
    },
    {
      title: "Resolved Today",
      value: "18",
      icon: CheckCircle,
      tone: "text-emerald-300",
      chip: "from-emerald-400/25 via-emerald-400/10 to-transparent",
      delta: "↑ 12%",
    },
    {
      title: "Support Team",
      value: "12",
      icon: Users,
      tone: "text-blue-300",
      chip: "from-blue-400/25 via-blue-400/12 to-transparent",
      delta: "+2 hires",
    },
  ]

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
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-start gap-4 pb-4 border-b border-border/40 last:border-0">
                  <div className="w-2 h-2 bg-primary/60 rounded-full mt-2 shrink-0 shadow-[0_0_8px_var(--color-primary)/40]" />
                  <div>
                    <p className="font-medium text-foreground">Ticket #TK-{1000 + item} updated</p>
                    <p className="text-sm text-muted-foreground">Support team responded to customer inquiry</p>
                    <p className="text-xs text-muted-foreground mt-1">{item} hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 border border-border/60 backdrop-blur hover:border-primary/30 transition-colors">
          <CardHeader className="border-b border-border/40">
            <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground/80">Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["John Doe", "Jane Smith", "Mike Johnson"].map((engineer, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-foreground/90">{engineer}</p>
                    <p className="text-sm text-muted-foreground">{95 - idx * 5}%</p>
                  </div>
                  <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/70"
                      style={{ width: `${95 - idx * 5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
