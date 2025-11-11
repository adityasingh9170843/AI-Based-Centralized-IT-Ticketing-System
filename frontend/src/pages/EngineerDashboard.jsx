import { useEffect, useState, useContext } from "react"
import { UserContext } from "@/context/userContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Filter, 
  Search, 
  MoreHorizontal, 
  FileText,
  LogOut,
  User as UserIcon
} from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "bg-red-500/15 text-red-300 border-red-500/30"
    case "Medium":
      return "bg-amber-500/15 text-amber-300 border-amber-500/25"
    case "Low":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
    default:
      return ""
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "Open":
      return "bg-amber-500/15 text-amber-300 border-amber-500/25"
    case "In Progress":
      return "bg-cyan-500/15 text-cyan-300 border-cyan-500/25"
    case "Resolved":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
    case "Closed":
      return "bg-zinc-500/15 text-zinc-300 border-zinc-500/25"
    default:
      return ""
  }
}

function EngineerDashboard() {
  const { user, loading: userLoading, logout } = useContext(UserContext)
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [resolution, setResolution] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user?._id) {
      fetchTickets()
    }
  }, [user])

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const response = await axios.get(
        `http://localhost:5000/api/tickets/engineer/${user._id}`,
        { withCredentials: true }
      )
      setTickets(response.data)
    } catch (error) {
      console.error("Failed to fetch tickets", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddResolution = async () => {
    if (!resolution.trim()) {
      alert("Please enter a resolution")
      return
    }

    setIsSubmitting(true)
    try {
      await axios.put(
        `http://localhost:5000/api/tickets/resolve/${selectedTicket._id}`,
        { resolution },
        { withCredentials: true }
      )
      await fetchTickets()
      setSelectedTicket(null)
      setResolution("")
    } catch (error) {
      console.error("Failed to add resolution", error)
      const msg = error?.response?.data?.error || error.message
      alert(`Failed to add resolution: ${msg}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    const normalizedStatus = (ticket.status || "").toLowerCase().replace(/\s+/g, "-")
    const matchesStatus = filterStatus === "all" || normalizedStatus === filterStatus
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket._id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.category || "").toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Calculate stats
  const openTickets = tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length
  const resolvedTickets = tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length
  const totalTickets = tickets.length

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/70 backdrop-blur supports-backdrop-filter:bg-card/60">
        <div className="px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Engineer Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer">
                <UserIcon className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-red-400 focus:text-red-400"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="p-6 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card/80 border border-border/60 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground/90">Active Tickets</CardTitle>
                <div className="p-2 rounded-lg bg-amber-400/10 border border-amber-400/20">
                  <Clock className="w-5 h-5 text-amber-300" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">{openTickets}</div>
              <p className="text-xs text-muted-foreground mt-1">Open & In Progress</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border border-border/60 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground/90">Resolved</CardTitle>
                <div className="p-2 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                  <CheckCircle className="w-5 h-5 text-emerald-300" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">{resolvedTickets}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed tickets</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border border-border/60 backdrop-blur transition-all hover:-translate-y-1 hover:border-primary/40">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground/90">Total Assigned</CardTitle>
                <div className="p-2 rounded-lg bg-blue-400/10 border border-blue-400/20">
                  <AlertCircle className="w-5 h-5 text-blue-300" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold text-foreground">{totalTickets}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card/80 border border-border/60 backdrop-blur mb-6">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-[0.18em] block mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, ID, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-muted/30 border border-border/50"
                  />
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="border border-border/50 bg-muted/30 hover:border-primary/40 hover:bg-muted/40 w-full md:w-auto"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    {filterStatus === "all" ? "All" : filterStatus.replace("-", " ")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Statuses</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("open")}>Open</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("in-progress")}>In Progress</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("resolved")}>Resolved</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("closed")}>Closed</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
        </Card>

        {/* Tickets Table */}
        <Card className="bg-card/80 border border-border/60 backdrop-blur overflow-hidden">
          <CardHeader className="border-b border-border/40">
            <CardTitle className="text-lg">My Tickets</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/20">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground/80">Ticket ID</TableHead>
                  <TableHead className="text-muted-foreground/80">Title</TableHead>
                  <TableHead className="text-muted-foreground/80">Category</TableHead>
                  <TableHead className="text-muted-foreground/80">Priority</TableHead>
                  <TableHead className="text-muted-foreground/80">Status</TableHead>
                  <TableHead className="text-muted-foreground/80">Created</TableHead>
                  <TableHead className="text-muted-foreground/80 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Loading tickets...
                    </TableCell>
                  </TableRow>
                ) : filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchTerm || filterStatus !== "all" ? "No tickets match your filters" : "No tickets assigned yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow
                      key={ticket._id}
                      className="border-border/60 hover:bg-muted/20 transition-colors"
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground/80">
                        {ticket._id.slice(-8)}
                      </TableCell>
                      <TableCell className="font-medium text-foreground/90">{ticket.title}</TableCell>
                      <TableCell className="text-muted-foreground">{ticket.category}</TableCell>
                      <TableCell>
                        <Badge className={`${getPriorityColor(ticket.priority)} border capitalize`}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(ticket.status)} border capitalize`}>
                          {ticket.status.replace("-", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/40">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => setSelectedTicket(ticket)}
                              disabled={ticket.status === "Resolved" || ticket.status === "Closed"}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Add Resolution
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Add Resolution Dialog */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-2xl border border-border/70 bg-card backdrop-blur">
            <DialogHeader>
              <DialogTitle className="text-2xl text-foreground/90">Add Resolution</DialogTitle>
              <DialogDescription className="text-muted-foreground/80">
                Provide a detailed resolution for this ticket
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Ticket Info */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <h3 className="font-semibold text-foreground mb-2">{selectedTicket.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{selectedTicket.description}</p>
                <div className="flex gap-2">
                  <Badge className={`${getPriorityColor(selectedTicket.priority)} border`}>
                    {selectedTicket.priority}
                  </Badge>
                  <Badge className="bg-muted/60 text-foreground border-border/60">
                    {selectedTicket.category}
                  </Badge>
                </div>
              </div>

              {/* Resolution Input */}
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">
                  Resolution Details
                </label>
                <Textarea
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  placeholder="Describe how you resolved this ticket..."
                  className="min-h-[150px] bg-muted/30 border border-border/50"
                  disabled={isSubmitting}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddResolution}
                  disabled={isSubmitting || !resolution.trim()}
                  className="flex-1 bg-primary/80 hover:bg-primary"
                >
                  {isSubmitting ? "Submitting..." : "Submit Resolution"}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-border/60"
                  onClick={() => {
                    setSelectedTicket(null)
                    setResolution("")
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default EngineerDashboard