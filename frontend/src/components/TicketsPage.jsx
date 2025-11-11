import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Eye, CheckCircle, Trash2, Filter } from "lucide-react"
import TicketModal from "./TicketForm"
import AssignEngineerDialog from "./AssignEngineerDialog"
import { useEffect } from "react"
import axios from "axios"


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

export default function TicketsPage() {
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const[tickets,setTickets] = useState([]);
  const [ticketToAssign, setTicketToAssign] = useState(null)
 

 const getTickets = async () => {
    try{
      const response = await axios.get("http://localhost:5000/api/tickets/", {withCredentials: true})
      setTickets(response.data)
      console.log(response)
    }
    catch(error){
      console.log(error)
    }
  };

  const closeTicket = async (ticketId) => {
    const ok = window.confirm("Are you sure you want to close this ticket?")
    if (!ok) return
    try {
      await axios.put(
        `http://localhost:5000/api/tickets/close/${ticketId}`,
        {},
        { withCredentials: true }
      )
      // refresh list
      getTickets()
    } catch (err) {
      console.error("Failed to close ticket", err)
      const msg = err?.response?.data?.error || err.message
      alert(`Failed to close ticket: ${msg}`)
    }
  }


  useEffect(()=>{
    getTickets()
  },[])



  const filteredTickets = tickets.filter((ticket) => {
    const normalizedStatus = (ticket.status || "").toLowerCase().replace(/\s+/g, "-")
    const matchesStatus = filterStatus === "all" || normalizedStatus === filterStatus
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket._id || "").toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight mb-2">Support Tickets</h1>
        <p className="text-muted-foreground/90 text-sm">Track escalations, assignments, and SLA performance in one view.</p>
      </div>

      <Card className="bg-card/80 border border-border/60 backdrop-blur mb-6 hover:border-primary/30 transition-colors">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-[0.18em] block mb-2">Search</label>
              <Input
                placeholder="Search by title or ticket ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-muted/30 border border-border/50"
              />
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
              <DropdownMenuContent className="bg-card/95 border border-border/60 backdrop-blur">
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

      <Card className="bg-card/80 border border-border/60 backdrop-blur overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground/80">Ticket ID</TableHead>
                <TableHead className="text-muted-foreground/80">Title</TableHead>
                <TableHead className="text-muted-foreground/80">Category</TableHead>
                <TableHead className="text-muted-foreground/80">Priority</TableHead>
                <TableHead className="text-muted-foreground/80">Assigned To</TableHead>
                <TableHead className="text-muted-foreground/80">Status</TableHead>
                <TableHead className="text-muted-foreground/80">Created</TableHead>
                <TableHead className="text-muted-foreground/80 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket._id} className="border-border/60 hover:bg-muted/20 transition-colors">
                  <TableCell className="font-mono text-muted-foreground/80">{ticket._id}</TableCell>
                  <TableCell className="font-medium text-foreground/90">{ticket.title}</TableCell>
                  <TableCell className="text-muted-foreground">{ticket.category}</TableCell>
                  <TableCell>
                    <Badge className={`${getPriorityColor(ticket.priority)} border capitalize`}>
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{ticket.assignedEngineer.name}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(ticket.status)} border capitalize`}>
                      {ticket.status.replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{ticket.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted/40">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card/95 border border-border/60 backdrop-blur">
                        <DropdownMenuItem onClick={() => setSelectedTicket(ticket)} className="cursor-pointer">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer"
                          onClick={() => setTicketToAssign(ticket)}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Assign Support
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-red-400"
                          onClick={() => closeTicket(ticket._id)}
                        >
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
        <TicketModal ticket={selectedTicket} isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)}  />
      )}

      {ticketToAssign && (
        <AssignEngineerDialog
          ticket={ticketToAssign}
          isOpen={!!ticketToAssign}
          onClose={() => setTicketToAssign(null)}
          onAssignSuccess={() => {
            getTickets()
            setTicketToAssign(null)
          }}
        />
      )}
    </div>
  )
}
