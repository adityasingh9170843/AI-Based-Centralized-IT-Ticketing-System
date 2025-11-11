import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { UserContext } from "@/context/userContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Eye } from "lucide-react";
import API_URL from "@/config/api";

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "bg-red-500/15 text-red-300 border-red-500/30"
    case "Medium":
      return "bg-amber-500/15 text-amber-300 border-amber-500/25"
    case "Low":
      return "bg-emerald-500/15 text-emerald-300 border-emerald-500/25"
    default:
      return "bg-muted text-muted-foreground border-border"
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
      return "bg-muted text-muted-foreground border-border"
  }
}

export default function UserDashboard() {
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const canSubmit = useMemo(
    () => title.trim() && description.trim() && !submitting,
    [title, description, submitting]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const myRes = await axios.get(`${API_URL}/api/tickets/user/my`, { withCredentials: true });
        setTickets(Array.isArray(myRes.data) ? myRes.data : []);
      } catch (err) {
        console.log("Init load failed", err);
      }
    };
    load();
  }, []);

  const refreshTickets = async () => {
    try {
      setLoadingTickets(true);
      const myRes = await axios.get(`${API_URL}/api/tickets/user/my`, { withCredentials: true });
      setTickets(Array.isArray(myRes.data) ? myRes.data : []);
    } catch (err) {
      console.log("Refresh tickets failed", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await axios.post(
        `${API_URL}/api/tickets/create`,
        { title, description },
        { withCredentials: true }
      );
      setTitle("");
      setDescription("");
      await refreshTickets();
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || "Failed to create ticket";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {user?.name || "User"}</h1>
        <p className="text-muted-foreground">Create and track your IT support tickets</p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader className="space-y-1">
          <CardTitle>Create a ticket</CardTitle>
          <CardDescription>Describe your issue clearly to help us route it faster</CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 text-destructive px-3 py-2 text-sm">
              {error}
            </div>
          ) : null}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Laptop won’t connect to Wi‑Fi" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea
                id="description"
                className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input min-h-28 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Include steps, error messages, and when it happens"
                required
              />
            </div>
            
            <Button type="submit" disabled={!canSubmit}>
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                </span>
              ) : (
                "Submit ticket"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My tickets</CardTitle>
          <CardDescription>Your recent requests</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingTickets ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </div>
          ) : tickets.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tickets yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell className="max-w-[320px]">
                      <div className="truncate" title={t.title}>{t.title}</div>
                      {t.resolution && (
                        <div className="text-xs text-muted-foreground mt-1 truncate" title={t.resolution}>
                          Resolution: {t.resolution}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getPriorityColor(t.priority)} border capitalize`}>
                        {t.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(t.status)} border capitalize`}>
                        {t.status.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {t.assignedEngineer?.name || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTicket(t)}
                        className="h-8 gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Ticket Details Dialog */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-2xl border border-border/70 bg-card backdrop-blur">
            <DialogHeader>
              <DialogTitle className="text-2xl text-foreground/90">Ticket Details</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Ticket Info */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <p className="text-foreground mt-1">{selectedTicket.title}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-foreground mt-1 whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Priority</label>
                    <div className="mt-1">
                      <Badge className={`${getPriorityColor(selectedTicket.priority)} border`}>
                        {selectedTicket.priority}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="mt-1">
                      <Badge className={`${getStatusColor(selectedTicket.status)} border`}>
                        {selectedTicket.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Category</label>
                    <p className="text-foreground mt-1">{selectedTicket.category || "—"}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Assigned Engineer</label>
                    <p className="text-foreground mt-1">{selectedTicket.assignedEngineer?.name || "Not assigned yet"}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-foreground mt-1">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                </div>

                {selectedTicket.resolution && (
                  <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <label className="text-sm font-medium text-emerald-300 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Resolution
                    </label>
                    <p className="text-foreground mt-2 whitespace-pre-wrap">{selectedTicket.resolution}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTicket(null)}
                  className="border-border/60"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}