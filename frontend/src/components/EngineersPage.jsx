import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mail, Briefcase, Plus, Award } from "lucide-react"
import AddEngineerModal from "./AddEngineerForm"
import axios from "axios"
import { useEffect } from "react"


export default function EngineersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedEngineer, setSelectedEngineer] = useState(null)
  const [Engineer, setEngineer] = useState([])
  const [Departments, setDepartments] = useState([])

  const getEngineers = async () => {
    try{
      const response = await axios.get("http://localhost:5000/api/engineers/", {withCredentials: true})
      setEngineer(response.data)
      console.log(response)
    }
    catch(error){
      console.log(error)
    }
  };

  const getDepartments = async () => {
    try{
      const response = await axios.get("http://localhost:5000/api/departments/", {withCredentials: true})
      setDepartments(response.data)
      console.log(response)
    }
    catch(error){
      console.log(error)
    }
  };


  useEffect(()=>{
    getEngineers()
    getDepartments()
  },[])

  return (
    <div className="p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground mb-2 tracking-tight">Support Team</h1>
          <p className="text-muted-foreground/90 text-sm">Manage engineers, track domain expertise, and keep assignments flowing.</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-linear-to-r from-primary/20 via-primary/10 to-transparent px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Engineer.map((engineer) => (
          <Card
            key={engineer._id}
            className="relative cursor-pointer overflow-hidden border border-border/60 bg-card/80 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
            onClick={() => setSelectedEngineer(engineer)}
          >
            <span className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/3 via-transparent to-transparent" />
            <CardHeader className="relative pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground/90 tracking-tight">{engineer.name}</CardTitle>
                  <p className="text-xs font-medium text-muted-foreground/80 uppercase mt-2 flex items-center gap-2">
                    <Briefcase className="w-3 h-3" />
                    {engineer.department?.name || "Unassigned"}
                  </p>
                </div>
                <div className="w-11 h-11 rounded-xl border border-border/50 bg-muted/40 flex items-center justify-center shadow-sm">
                  <Award className="w-5 h-5 text-primary/80" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.16em]">Expertise</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {engineer.expertise.map((skill, idx) => (
                    <Badge key={idx} className="bg-muted/40 text-muted-foreground border border-border/40 text-xs tracking-wide">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.16em]">Contact</p>
                <a
                  href={`mailto:${engineer.email}`}
                  className="mt-2 inline-flex items-center gap-2 text-sm text-foreground/80 transition-colors hover:text-primary"
                >
                  <Mail className="w-4 h-4" />
                  {engineer.email}
                </a>
              </div>

              <div className="pt-4 border-t border-border/40">
                <p className="text-sm font-medium text-foreground/90">{engineer.tickets.length} Active Tickets</p>
                
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAddModalOpen && (
        <AddEngineerModal
          departments={Departments}
          onClose={(refresh) => {
            setIsAddModalOpen(false)
            if (refresh) getEngineers()
          }}
        />
      )}

      {selectedEngineer && (
        <Dialog open={!!selectedEngineer} onOpenChange={() => setSelectedEngineer(null)}>
          <DialogContent className="bg-card/90 border border-border/60 backdrop-blur max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground/90">{selectedEngineer.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Department</p>
                <p className="text-foreground">{selectedEngineer.department.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {selectedEngineer.expertise.map((skill, idx) => (
                    <Badge key={idx} className="bg-muted/40 text-muted-foreground border border-border/40">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Email</p>
                <p className="text-primary">{selectedEngineer.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Active Tickets</p>
                <p className="text-foreground">{selectedEngineer.tickets.length}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
