import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Eye, CheckCircle, Trash2, Filter } from "lucide-react"
import TicketModal from "./TicketForm"
const mockTickets = [
  {
    id: "TK-001",
    title: "Database Migration Issue",
    category: "Database",
    priority: "high",
    assignedTo: "John Doe",
    status: "in-progress",
    createdAt: "2025-01-15",
    description: "Migration from PostgreSQL to Neon is failing on production",
  },
  {
    id: "TK-002",
    title: "Email Configuration",
    category: "Email",
    priority: "medium",
    assignedTo: "Jane Smith",
    status: "open",
    createdAt: "2025-01-14",
    description: "SMTP server configuration needs to be updated",
  },
  {
    id: "TK-003",
    title: "API Rate Limiting",
    category: "API",
    priority: "low",
    assignedTo: "Mike Johnson",
    status: "resolved",
    createdAt: "2025-01-13",
    description: "Implement rate limiting on REST endpoints",
  },
  {
    id: "TK-004",
    title: "SSL Certificate Renewal",
    category: "Security",
    priority: "high",
    assignedTo: "Sarah Lee",
    status: "in-progress",
    createdAt: "2025-01-12",
    description: "Renew SSL certificate for main domain",
  },
]

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-500/20 text-red-400 border-red-500/30"
    case "medium":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    case "low":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    default:
      return ""
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "open":
      return "bg-orange-500/20 text-orange-400 border-orange-500/30"
    case "in-progress":
      return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
    case "resolved":
      return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
    case "closed":
      return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    default:
      return ""
  }
}

export default function TicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Support Tickets</h1>
        <p className="text-muted-foreground">Track and manage all customer support requests</p>
      </div>

      <Card className="bg-card border-border mb-6">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground block mb-2">Search</label>
              <Input
                placeholder="Search by title or ticket ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-muted border-border"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-border bg-muted hover:bg-muted/80 w-full md:w-auto">
                  <Filter className="w-4 h-4 mr-2" />
                  {filterStatus === "all" ? "All" : filterStatus.replace("-", " ")}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border">
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

      <Card className="bg-card border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Ticket ID</TableHead>
                <TableHead className="text-muted-foreground">Title</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Priority</TableHead>
                <TableHead className="text-muted-foreground">Assigned To</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Created</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id} className="border-border hover:bg-muted/20 transition-colors">
                  <TableCell className="font-mono text-cyan-400">{ticket.id}</TableCell>
                  <TableCell className="font-medium text-foreground">{ticket.title}</TableCell>
                  <TableCell className="text-muted-foreground">{ticket.category}</TableCell>
                  <TableCell>
                    <Badge className={`${getPriorityColor(ticket.priority)} border capitalize`}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{ticket.assignedTo}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(ticket.status)} border capitalize`}>
                      {ticket.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{ticket.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem onClick={() => setSelectedTicket(ticket)} className="cursor-pointer">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Assign Support
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer text-red-400">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Close Ticket
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedTicket && (
        <TicketModal ticket={selectedTicket} isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
    </div>
  )
}
