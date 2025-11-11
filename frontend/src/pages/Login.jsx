import { useContext, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "@/context/userContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, User } from "lucide-react";

const Login = () => {
	const navigate = useNavigate();
	const { updateUser } = useContext(UserContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
  const [accountType, setAccountType] = useState("user"); // user | engineer

	const canSubmit = useMemo(() => email.trim() && password.trim() && !loading, [email, password, loading]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		if (!canSubmit) return;
		setLoading(true);
		try {
			const url = accountType === "engineer" ? "http://localhost:5000/api/engineer/login" : "http://localhost:5000/api/auth/login";
			const res = await axios.post(url, { email, password }, { withCredentials: true });
			const user = res?.data?.user || res?.data?.engineer || null;
			if (user) {
				updateUser(user);
				const target = user.role === "admin" ? "/admin" : user.role === "engineer" ? "/engineer" : "/user";
				navigate(target, { replace: true });
			} else {
				setError("Unexpected response. Please try again.");
			}
		} catch (err) {
			const msg = err?.response?.data?.error || err?.response?.data?.message || "Invalid email or password";
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
						AI-powered, centralized IT ticketing
					</h1>
					<p className="text-muted-foreground max-w-md">
						Resolve faster with intelligent triage and a streamlined engineer workflow.
					</p>
				
				</div>
				<p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Smart Support. All rights reserved.</p>
			</div>

			{/* Login form */}
			<div className="flex items-center justify-center p-6 relative">
				<Card className="w-full max-w-md border border-border/60 bg-card/85 backdrop-blur shadow-[0_20px_60px_-30px_var(--color-primary)]">
					<CardHeader className="space-y-3">
						<CardTitle className="text-2xl">Sign in to your account</CardTitle>
						<CardDescription>Access your support dashboard</CardDescription>
						<div className="flex items-center gap-2 text-sm">
							<label className="flex items-center gap-2">
								<input type="radio" name="acct" value="user" checked={accountType === "user"} onChange={() => setAccountType("user")} />
								User/Admin
							</label>
							<label className="flex items-center gap-2">
								<input type="radio" name="acct" value="engineer" checked={accountType === "engineer"} onChange={() => setAccountType("engineer")} />
								Engineer
							</label>
						</div>
					</CardHeader>
					<CardContent>
						{error ? (
							<div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 text-destructive px-3 py-2 text-sm">
								{error}
							</div>
						) : null}
						<form className="space-y-4" onSubmit={handleSubmit}>
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
									autoComplete="current-password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>
							<div className="flex items-center justify-between">
								<label className="flex items-center gap-2 text-sm text-muted-foreground">
									<input
										type="checkbox"
										className="size-4 rounded border-input bg-background"
										checked={remember}
										onChange={(e) => setRemember(e.target.checked)}
									/>
									Remember me
								</label>
								<Link to="#" className="text-sm text-primary hover:underline">Forgot password?</Link>
							</div>
							<Button type="submit" className="w-full" disabled={!canSubmit}>
								{loading ? (
									<span className="inline-flex items-center gap-2">
										<Loader2 className="h-4 w-4 animate-spin" /> Signing in…
									</span>
								) : (
									"Sign in"
								)}
							</Button>
						</form>

						<p className="mt-6 text-center text-sm text-muted-foreground">
							Don’t have an account?{" "}
							<Link to="/signup" className="text-primary hover:underline">Create user account</Link>
							{` `}|{` `}
							<Link to="/engineer-signup" className="text-primary hover:underline">Create engineer account</Link>
						</p>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default Login;
