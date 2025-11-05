import { useContext, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "@/context/userContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => name.trim() && email.trim() && password.trim() && role && !loading, [name, email, password, role, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!canSubmit) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        { name, email, password, role },
        { withCredentials: true }
      );
      const user = res?.data?.user || null;
      if (user) {
        updateUser(user);
        const target = user.role === "admin" ? "/admin" : user.role === "engineer" ? "/engineer" : "/user";
        navigate(target, { replace: true });
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
    <div className="min-h-screen w-full grid lg:grid-cols-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_0%,var(--color-primary)/12,transparent),radial-gradient(140%_120%_at_100%_0%,oklch(0.3_0.04_250_/0.18),transparent)]" />
      {/* Brand / value prop */}
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-border/40 relative backdrop-blur bg-card/60 supports-backdrop-filter:bg-card/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground grid place-items-center">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-semibold tracking-tight">Smart Support</span>
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold leading-tight">
            Create your support account
          </h1>
          <p className="text-muted-foreground max-w-md">
            Join the centralized helpdesk to manage tickets and collaborate with your team.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Smart Support. All rights reserved.</p>
      </div>

      {/* Sign up form */}
      <div className="flex items-center justify-center p-6 relative">
        <Card className="w-full max-w-md border border-border/60 bg-card/85 backdrop-blur shadow-[0_20px_60px_-30px_var(--color-primary)]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Choose your role to get started</CardDescription>
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
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">Role</label>
                <select
                  id="role"
                  className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="engineer">Engineer</option>
                </select>
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
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;