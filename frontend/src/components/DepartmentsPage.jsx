import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import API_URL from "@/config/api"

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/departments/`, { withCredentials: true })
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
    if (!name.trim()) {
      setErrorMessage("Name is required")
      return
    }

    setSaving(true)
    try {
      await axios.post(
        `${API_URL}/api/departments/`,
        { name: name.trim(), description: description.trim() },
        { withCredentials: true }
      )
      setIsOpen(false)
      setName("")
      setDescription("")
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
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight mb-2">Departments</h1>
          <p className="text-muted-foreground/90 text-sm max-w-xl">
            Structure your support organization by capability and keep visibility into team membership.
          </p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-xl border border-primary/30 bg-linear-to-r from-primary/20 via-primary/10 to-transparent px-4 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50"
        >
          Create Department
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card
            key={dept._id}
            className="relative overflow-hidden border border-border/60 bg-card/80 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
          >
            <span className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/4 via-transparent to-transparent" />
            <CardHeader className="relative pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground/90 tracking-tight">{dept.name}</CardTitle>
                  {dept.description ? (
                    <p className="mt-2 text-sm text-muted-foreground/80 leading-relaxed">{dept.description}</p>
                  ) : (
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground/60">No description provided</p>
                  )}
                </div>
                <div className="shrink-0 rounded-xl border border-border/50 bg-muted/30 px-3 py-2 text-xs font-medium text-muted-foreground">
                  {(dept.engineers || []).length} members
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.18em] mb-3">Key Engineers</p>
              <div className="flex flex-wrap gap-2">
                {(dept.engineers || []).slice(0, 6).map((eng) => (
                  <Badge key={eng._id} className="bg-muted/40 text-muted-foreground border border-border/40 text-xs tracking-wide">
                    {eng.name}
                  </Badge>
                ))}
                {(dept.engineers || []).length > 6 ? (
                  <span className="text-xs text-muted-foreground/60">+{(dept.engineers || []).length - 6} more</span>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isOpen && (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
          <DialogContent className="bg-card/90 border border-border/60 backdrop-blur max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-foreground/90">Create Department</DialogTitle>
              <DialogDescription className="text-muted-foreground/80">
                Add a new department so engineers can be assigned to it.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-muted-foreground/80 block mb-2 uppercase tracking-[0.18em]">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. IT Support"
                  className="bg-muted/30 border border-border/50"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground/80 block mb-2 uppercase tracking-[0.18em]">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/30 border border-border/50 rounded-lg text-foreground"
                  rows={4}
                />
              </div>

              {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

              <div className="flex gap-3 pt-4 border-t border-border/40">
                <Button type="submit" className="flex-1 border border-primary/40 bg-primary/80" disabled={saving}>
                  {saving ? "Creating..." : "Create"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border border-border/50 bg-muted/30"
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