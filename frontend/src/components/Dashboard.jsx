import { CheckCircle, Clock, Users, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dashboard() {
  const stats = [
    {
      title: "Open Tickets",
      value: "24",
      icon: AlertCircle,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "In Progress",
      value: "42",
      icon: Clock,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
    },
    {
      title: "Resolved Today",
      value: "18",
      icon: CheckCircle,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Support Team",
      value: "12",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
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
            <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-emerald-400 mt-2">↓ 8% from yesterday</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader>
            <CardTitle>Recent Support Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
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

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Team Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["John Doe", "Jane Smith", "Mike Johnson"].map((engineer, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-foreground">{engineer}</p>
                    <p className="text-sm text-cyan-400">{95 - idx * 5}%</p>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
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
