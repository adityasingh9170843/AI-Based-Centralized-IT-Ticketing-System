import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import axios from "axios"

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/departments/", { withCredentials: true })
      setDepartments(res.data || [])
    } catch (err) {
      console.error("Failed to load departments", err)
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setErrorMessage("")
    if (!name.trim()) return setErrorMessage("Name is required")
    setSaving(true)
    try {
      const res = await axios.post(
        "http://localhost:5000/api/departments/",
        { name: name.trim(), description: description.trim() },
        { withCredentials: true }
      )
      // successful creation
      setIsOpen(false)
      setName("")
      setDescription("")
      // refresh list
      fetchDepartments()
    } catch (err) {
      console.error(err)
      const msg = err?.response?.data?.error || err?.response?.data?.message || err.message
      setErrorMessage(msg || "Failed to create department")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Departments</h1>
          <p className="text-muted-foreground">Manage organizational departments and their members</p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="bg-primary hover:bg-primary/90">
          Create Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card key={dept._id} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{dept.name}</CardTitle>
                  {dept.description && (
                    <p className="text-sm text-muted-foreground mt-1">{dept.description}</p>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{(dept.engineers || []).length} members</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {(dept.engineers || []).slice(0, 6).map((eng) => (
                  <Badge key={eng._id} className="bg-muted text-muted-foreground">
                    {eng.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
          <DialogContent className="bg-card border-border max-w-xl">
            <DialogHeader>
              <DialogTitle>Create Department</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Add a new department so engineers can be assigned to it.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. IT Support"
                  className="bg-muted border-border"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground"
                  rows={4}
                />
              </div>

              {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button type="submit" className="flex-1 bg-primary" disabled={saving}>
                  {saving ? "Creating..." : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-border bg-muted"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}