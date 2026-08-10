import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Eye, EyeOff, Lock, Mail, User, Shield } from "lucide-react";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        fullName,
        email,
        password,
        role,
      });

      // Redirect to login after successful registration
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please check your details and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 p-4">
      {/* Main Container Card */}
      <div className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl">
        {/* Left Side - Signup Form */}
        <div className="flex w-full flex-col justify-center px-8 py-10 md:w-1/2 md:px-12">
          {/* Logo */}
          <div className="mb-4 flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 font-bold text-lg text-white">
              S
            </div>
            <span className="text-xl font-bold text-blue-950">Logoipsum</span>
          </div>

          {/* Heading */}
          <div className="mb-5 text-center">
            <h1 className="text-2xl font-bold text-slate-800">
              Create Account
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Sign up to get started
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-3 text-center text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-1 block text-xs font-medium text-slate-600"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Robert Allen"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-3 pr-9 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none"
                />
                <User className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-xs font-medium text-slate-600"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="robertallen@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-3 pr-9 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none"
                />
                <Mail className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-xs font-medium text-slate-600"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-3 pr-9 text-xs text-slate-800 placeholder-slate-400 transition-all focus:border-blue-600 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="mb-1 block text-xs font-medium text-slate-600"
              >
                Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-3 pr-9 text-xs text-slate-800 transition-all focus:border-blue-600 focus:bg-white focus:outline-none"
                >
                  <option value="member">Member</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Admin</option>
                </select>
                <Shield className="pointer-events-none absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0b2b70] py-3 text-xs font-semibold text-white shadow-md transition-all hover:bg-[#082054] active:scale-[0.99] disabled:opacity-50 mt-2"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-5 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-blue-900 hover:underline"
            >
              Login
            </button>
          </p>
        </div>

        {/* Right Side - Figma Hero Graphic */}
        <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-8 md:flex">
          <img
            src="/schedule-illustration.png"
            alt="Schedule Illustration"
            className="max-h-80 w-auto object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
