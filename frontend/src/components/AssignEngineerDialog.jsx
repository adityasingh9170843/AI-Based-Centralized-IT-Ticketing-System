import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { UserCheck, Search } from "lucide-react"
import axios from "axios"

export default function AssignEngineerDialog({ ticket, isOpen, onClose, onAssignSuccess }) {
  const [engineers, setEngineers] = useState([])
  const [filteredEngineers, setFilteredEngineers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEngineer, setSelectedEngineer] = useState(null)
  const [isAssigning, setIsAssigning] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchEngineers()
    }
  }, [isOpen])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredEngineers(engineers)
    } else {
      const filtered = engineers.filter((eng) => {
        const searchLower = searchTerm.toLowerCase()
        return (
          eng.name.toLowerCase().includes(searchLower) ||
          eng.email.toLowerCase().includes(searchLower) ||
          eng.department?.name?.toLowerCase().includes(searchLower) ||
          eng.expertise.some((skill) => skill.toLowerCase().includes(searchLower))
        )
      })
      setFilteredEngineers(filtered)
    }
  }, [searchTerm, engineers])

  const fetchEngineers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/engineers/", {
        withCredentials: true,
      })
      setEngineers(response.data)
      setFilteredEngineers(response.data)
    } catch (error) {
      console.error("Failed to fetch engineers", error)
    }
  }

  const handleAssign = async () => {
    if (!selectedEngineer) return
    setIsAssigning(true)
    try {
      await axios.put(
        `http://localhost:5000/api/tickets/assign/${ticket._id}/${selectedEngineer._id}`,
        {},
        { withCredentials: true }
      )
      onAssignSuccess()
      onClose()
    } catch (error) {
      console.error("Failed to assign engineer", error)
      const msg = error?.response?.data?.error || error.message
      alert(`Failed to assign engineer: ${msg}`)
    } finally {
      setIsAssigning(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl border border-border/70 bg-card backdrop-blur max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground/90 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-primary" />
            Assign Engineer to Ticket
          </DialogTitle>
          <DialogDescription className="text-muted-foreground/80">
            Select an engineer to manually assign to ticket: <span className="font-mono text-primary">{ticket?._id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Ticket Info */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
            <h3 className="font-semibold text-foreground mb-1">{ticket?.title}</h3>
            <p className="text-sm text-muted-foreground">
              Category: <span className="text-foreground">{ticket?.category}</span> • Priority:{" "}
              <span className="text-foreground">{ticket?.priority}</span>
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, department, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-muted/30 border border-border/50"
            />
          </div>

          {/* Engineer List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {filteredEngineers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? "No engineers match your search" : "No engineers available"}
              </div>
            ) : (
              filteredEngineers.map((engineer) => (
                <button
                  key={engineer._id}
                  onClick={() => setSelectedEngineer(engineer)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    selectedEngineer?._id === engineer._id
                      ? "bg-primary/15 border-primary/60 ring-1 ring-primary/30"
                      : "bg-muted/20 border-border/50 hover:bg-muted/40 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground truncate">{engineer.name}</h4>
                        {selectedEngineer?._id === engineer._id && (
                          <Badge className="bg-primary/80 text-primary-foreground border-primary/50">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 truncate">{engineer.email}</p>
                      
                      {engineer.department && (
                        <div className="mb-2">
                          <Badge className="bg-muted/60 text-foreground/90 border-border/60">
                            {engineer.department.name}
                          </Badge>
                        </div>
                      )}
                      
                      {engineer.expertise && engineer.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {engineer.expertise.slice(0, 5).map((skill, idx) => (
                            <Badge
                              key={idx}
                              className="bg-primary/10 text-primary border-primary/30 text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {engineer.expertise.length > 5 && (
                            <Badge className="bg-muted/40 text-muted-foreground border-border/40 text-xs">
                              +{engineer.expertise.length - 5} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-border/60">
          <Button
            onClick={handleAssign}
            disabled={!selectedEngineer || isAssigning}
            className="flex-1 border border-primary/50 bg-primary/80 hover:bg-primary"
          >
            {isAssigning ? "Assigning..." : "Assign Engineer"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 border border-border/60 bg-muted hover:bg-muted/80"
            onClick={onClose}
            disabled={isAssigning}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
