import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "@/context/userContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import API_URL from "@/config/api";

export default function EngineerSignUp() {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [expertise, setExpertise] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(
    () => name.trim() && email.trim() && password.trim() && !loading,
    [name, email, password, loading]
  );

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/departments`, { withCredentials: true });
        const list = Array.isArray(res.data) ? res.data : [];
        setDepartments(list);
        if (list.length && !departmentId) setDepartmentId(list[0]._id);
      } catch (err) {
        console.log("Failed to load departments", err);
      }
    };
    loadDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!canSubmit) return;
    setLoading(true);
    try {
      const expertiseArray = Array.isArray(expertise)
        ? expertise
        : typeof expertise === "string"
        ? expertise.split(/[\n,]/).map((s) => s.trim()).filter(Boolean)
        : [];
      const res = await axios.post(
        `${API_URL}/api/engineer/register`,
        { name, email, password, departmentId, expertise: expertiseArray },
        { withCredentials: true }
      );
      const engineer = res?.data?.engineer;
      if (engineer) {
        updateUser(engineer); 
        navigate("/engineer", { replace: true });
      } else {
        setError("Unexpected response. Please try again.");
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-[radial-gradient(1200px_600px_at_-10%_-10%,--theme(--color-accent/40),transparent),radial-gradient(1000px_500px_at_110%_110%,--theme(--color-primary/10),transparent)]">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-card/40 border-r">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-semibold tracking-tight">Smart Support</span>
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold leading-tight">Engineer sign up</h1>
          <p className="text-muted-foreground max-w-md">Provide your details to access the engineer workspace.</p>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Smart Support. All rights reserved.</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create engineer account</CardTitle>
            <CardDescription>Fill in the required details</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 text-destructive px-3 py-2 text-sm">
                {error}
              </div>
            ) : null}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Full name</label>
                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="department" className="text-sm font-medium">Department</label>
                <select
                  id="department"
                  className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                >
                  {departments.map((d) => (
                    <option key={d._id} value={d._id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="expertise" className="text-sm font-medium">Expertise</label>
                <Input id="expertise" type="text" value={expertise} onChange={(e) => setExpertise(e.target.value)} placeholder="e.g., Networking, DevOps, Security" />
                <p className="text-xs text-muted-foreground">Separate multiple items with commas or new lines.</p>
              </div>

              <Button type="submit" className="w-full" disabled={!canSubmit}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
                  </span>
                ) : (
                  "Create account"
                )}
              </Button>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Already have an engineer account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
