import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-3xl font-semibold">Access denied</h1>
        <p className="text-muted-foreground">
          You don’t have permission to view this page. Try signing in with a different account.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button asChild variant="outline">
            <Link to="/login">Back to login</Link>
          </Button>
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}