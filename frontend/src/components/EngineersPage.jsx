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
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Support Team</h1>
          <p className="text-muted-foreground">Manage your support engineers and their specializations</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-primary hover:bg-primary/90 gap-2">
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Engineer.map((engineer) => (
          <Card
            key={engineer._id}
            className="bg-card border-border hover:shadow-lg transition-shadow cursor-pointer group hover:border-primary/50"
            onClick={() => setSelectedEngineer(engineer)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-foreground">{engineer.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />
                    {engineer.department?.name}
                  </p>
                </div>
                <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center group-hover:shadow-lg transition-shadow">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {engineer.expertise.map((skill, idx) => (
                    <Badge key={idx} className="bg-primary/20 text-primary border-primary/30 border text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Contact</p>
                <a
                  href={`mailto:${engineer.email}`}
                  className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                >
                  <Mail className="w-3 h-3" />
                  {engineer.email}
                </a>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-sm font-medium text-foreground">{engineer.tickets.length} Active Tickets</p>
                <Button
                  variant="outline"
                  className="w-full mt-3 border-border bg-muted hover:bg-muted/80"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  View Performance
                </Button>
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
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">{selectedEngineer.name}</DialogTitle>
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
                    <Badge key={idx} className="bg-primary/20 text-primary border-primary/30 border">
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
