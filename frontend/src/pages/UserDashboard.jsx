import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { UserContext } from "@/context/userContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export default function UserDashboard() {
  const { user } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const canSubmit = useMemo(
    () => title.trim() && description.trim() && !submitting,
    [title, description, submitting]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const myRes = await axios.get("http://localhost:5000/api/tickets/user/my", { withCredentials: true });
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
      const myRes = await axios.get("http://localhost:5000/api/tickets/user/my", { withCredentials: true });
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
        "http://localhost:5000/api/tickets/create",
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
                  <TableHead>Resolution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell className="max-w-[320px] truncate" title={t.title}>{t.title}</TableCell>
                    <TableCell>{t.priority}</TableCell>
                    <TableCell>{t.status}</TableCell>
                    <TableCell>{t.assignedEngineer?.name || "—"}</TableCell>
                    <TableCell>{new Date(t.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{t.resolution || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}