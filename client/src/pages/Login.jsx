import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { user, token } = response.data;
      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your email and password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] p-4 dark:bg-slate-950">
      {/* Centered Card */}
      <div className="w-full max-w-[440px] rounded-3xl bg-white p-10 shadow-sm dark:border dark:border-slate-800 dark:bg-[#11161D]">
        {/* Brand Logo Header */}
        <div className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0052CC] text-sm font-bold text-white">
            S
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            Logoipsum
          </span>
        </div>

        {/* Welcome Section */}
        <div className="mb-6 text-left">
          <h1 className="flex items-center gap-1.5 text-2xl font-bold text-slate-900 dark:text-white">
            Welcome <span className="text-xl">👋</span>
          </h1>
          <p className="mt-1 text-xs text-slate-400">Please login here</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 p-3 text-left text-xs text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            {error}
          </div>
        )}

        {/* Form Controls */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Box with Inset Border Label */}
          <div className="relative">
            <label
              htmlFor="email"
              className="absolute -top-2.5 left-3.5 bg-white px-1 text-[11px] font-medium text-slate-400 dark:bg-[#11161D]"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="robertallen@example.com"
              required
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-xs text-slate-800 placeholder-slate-300 outline-none transition-all focus:border-[#0052CC] dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-600"
            />
          </div>

          {/* Password Box with Inset Border Label & Visibility Toggle Icon */}
          <div className="relative">
            <label
              htmlFor="password"
              className="absolute -top-2.5 left-3.5 bg-white px-1 text-[11px] font-medium text-slate-400 dark:bg-[#11161D]"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full rounded-2xl border border-slate-200 bg-transparent py-3 pl-4 pr-10 text-xs text-slate-800 placeholder-slate-300 outline-none transition-all focus:border-[#0052CC] dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 cursor-pointer text-slate-400 hover:text-slate-600 focus:outline-none dark:hover:text-slate-200"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center gap-2 pt-0.5">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#0052CC] focus:ring-[#0052CC]"
            />
            <label
              htmlFor="remember"
              className="cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-400"
            >
              Remember Me
            </label>
          </div>

          {/* Login Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-2xl bg-[#0052CC] py-3.5 text-xs font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Sign Up Redirect Link */}
        <p className="mt-6 text-left text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="cursor-pointer font-semibold text-[#0052CC] hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
