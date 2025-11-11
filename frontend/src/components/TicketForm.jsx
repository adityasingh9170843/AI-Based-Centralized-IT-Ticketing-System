"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function TicketModal({ ticket, isOpen, onClose }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return ""
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "in-progress":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "resolved":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "closed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return ""
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">{ticket.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{ticket.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-muted/50 border-border">
            <CardContent className="pt-6">
              <p className="text-foreground leading-relaxed">{ticket.description}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">Category</label>
              <p className="text-foreground">{ticket.category}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">Priority</label>
              <Badge className={`${getPriorityColor(ticket.priority)} border capitalize`}>
                {ticket.priority}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">Assigned To</label>
              <p className="text-foreground">{ticket.assignedEngineer.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">Status</label>
              <Badge className={`${getStatusColor(ticket.status)} border capitalize`}>
                {ticket.status.replace("-", " ")}
              </Badge>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-2">Resolution Notes</label>
            <Card className="bg-muted/50 border-border">
              <CardContent className="pt-6">
                <p className="text-muted-foreground italic">
                  {ticket.status === "Resolved"
                    ? "Issue has been resolved successfully."
                    : "No resolution notes yet."}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
           
            <Button
              variant="outline"
              className="flex-1 border-border bg-muted hover:bg-muted/80"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
