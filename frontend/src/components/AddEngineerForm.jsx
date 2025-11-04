import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import axios from "axios"

export default function AddEngineerModal({ onClose}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [department, setDepartment] = useState("")
  const[departmentId, setDepartmentId] = useState("")
  const [selectedSkills, setSelectedSkills] = useState([])
  const [skillInput, setSkillInput] = useState("")
  const [departments, setDepartments] = useState([])

  const availableSkills = [
    "AWS",
    "Azure",
    "Kubernetes",
    "Docker",
    "Node.js",
    "Python",
    "React",
    "TypeScript",
    "Database",
    "API Design",
  ]

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

  useEffect(() => {
    getDepartments();
  },[])

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(departmentId)
    console.log({ name, email, departmentId, selectedSkills })
    onClose()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">Add New Engineer</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the details to add a new team member
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">Name</label>
              <Input
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-muted border-border"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-2">Email</label>
              <Input
                type="email"
                placeholder="engineer@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted border-border"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground block mb-2">Department</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}

              className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground"
              required
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept}>
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
                      ? "bg-blue-500 text-white"
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
                    className="bg-blue-500/20 text-blue-400 border-blue-500/30 border"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600">
              Add Engineer
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-border bg-muted hover:bg-muted/80"
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
