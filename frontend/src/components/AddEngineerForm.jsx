import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import API_URL from "@/config/api"

export default function AddEngineerModal({ onClose}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("12345") 
  
  const[departmentId, setDepartmentId] = useState("")
  const [selectedSkills, setSelectedSkills] = useState([])
  const [skillInput, setSkillInput] = useState("")
  const [departments, setDepartments] = useState([])

  const availableSkills = [
    "AWS","Azure","Kubernetes","Docker",
    "Node.js","Python","React","TypeScript",
    "Database","API Design","Gmail password reset",
    "Slack password reset","Outlook password reset",
  ]

  const getDepartments = async () => {
    try{
      const response = await axios.get(`${API_URL}/api/departments/`, {withCredentials: true})
      setDepartments(response.data)
    }
    catch(error){
      console.log(error)
    }
  };

  useEffect(() => {
    getDepartments();
  },[])

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    )
  }

  const handleSubmit = async(e) => {
    e.preventDefault()

    try{
      const response = await axios.post(
        `${API_URL}/api/engineer/register`,
        { name, email, password, departmentId, expertise: selectedSkills },  
        {withCredentials: true}
      )

      console.log(response)
    }
    catch(error){
      console.log(error)
    }
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
  <DialogContent className="max-w-2xl border border-border/70 bg-card backdrop-blur">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground/90">Add New Engineer</DialogTitle>
          <DialogDescription className="text-muted-foreground/80">
            Fill in the details to add a new team member
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">

           
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">Name</label>
              <Input value={name} onChange={(e)=>setName(e.target.value)} className="bg-muted border border-border/60" required />
            </div>

           
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">Email</label>
              <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="bg-muted border border-border/60" required />
            </div>

           
            <div className="col-span-2">
              <label className="text-sm font-medium text-muted-foreground block mb-2">Temporary Password</label>
              <Input
                type="text"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                placeholder="Default: 12345"
                className="bg-muted border border-border/60"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                This password will be changed later by the engineer.
              </p>
            </div>

          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-2">Department</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}

              className="w-full px-3 py-2 rounded-lg border border-border/60 bg-black text-foreground"
              required
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-3">Expertise</label>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {availableSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedSkills.includes(skill)
                      ? "bg-primary/80 text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            {selectedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <Badge
                    key={skill}
                    className="bg-primary/15 text-primary border border-primary/40"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-border/60">
            <Button type="submit" className="flex-1 border border-primary/50 bg-primary/80 hover:bg-primary">
              Add Engineer
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border border-border/60 bg-muted hover:bg-muted/80"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
