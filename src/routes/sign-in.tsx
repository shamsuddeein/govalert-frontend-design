import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Nav, Footer } from "../components/layout";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";

export const Route = createFileRoute("/sign-in")({
  component: SignInPage,
});

function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    const res = await api.login(email, password);
    setLoading(false);

    if (res.tokens) {
      toast.success("Successfully signed in!");
      navigate({ to: "/dashboard" });
    } else {
      setAuthError(res.error || "Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-secondary/25 font-sans">
      <Nav />
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-12 md:py-16">
        <div className="w-full max-w-[400px] flex flex-col items-center">
          {/* Logo - Plain text, no shield, no pin */}
          <div className="flex items-center gap-2 mb-6 focus:outline-none select-none">
            <span className="text-xl font-extrabold tracking-tight text-[#0a5c38] dark:text-[#3fb68e]">
              RecruitmentAlert
            </span>
          </div>

          <div className="text-center w-full mb-8">
            <h1 className="text-[22px] font-semibold text-foreground">Sign in to RecruitmentAlert</h1>
            <p className="mt-1 text-[14px] text-muted-foreground">
              Save jobs and receive personalised alerts.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-foreground">Email</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[48px] rounded-[8px] border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[#0a5c38] dark:focus:ring-[#3fb68e] focus:border-transparent transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-medium text-foreground">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[13px] text-[#0a5c38] dark:text-[#3fb68e] hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[48px] rounded-[8px] border border-border bg-background pl-4 pr-12 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[#0a5c38] dark:focus:ring-[#3fb68e] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] inline-flex items-center justify-center rounded-[8px] bg-[#0a5c38] dark:bg-[#3fb68e] text-[14px] font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? "Verifying..." : "Sign in"}
            </button>

            {authError && (
              <div className="rounded-[6px] border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 px-4 py-3 text-[13px] text-red-700 dark:text-red-400 text-center">
                {authError}
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="relative w-full flex items-center justify-center my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-background px-3 text-xs text-muted-foreground uppercase font-mono tracking-wider">
              or
            </span>
          </div>

          {/* Continue with Google */}
          <button
            onClick={() => toast.info("Google authentication is currently simulated.")}
            className="w-full h-[48px] inline-flex items-center justify-center gap-2.5 rounded-[8px] border border-border bg-card text-[14px] font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <svg className="size-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.03-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-8 text-center text-[13px] text-muted-foreground">
            No account?{" "}
            <Link to="/register" className="font-semibold text-[#0a5c38] dark:text-[#3fb68e] hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
