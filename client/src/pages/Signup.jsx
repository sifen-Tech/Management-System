import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Eye, EyeOff } from "lucide-react";
import logoipsum from "../logoipsum.png";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [division, setDivision] = useState("");
  const [year, setYear] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await api.post("/auth/signup", {
        fullName,
        email,
        password,
        division,
        year,
      });

      navigate("/login");
    } catch (err) {
      const backendErrors = err.response?.data?.errors;

      if (backendErrors) {
        const firstError = Object.values(backendErrors)[0];
        setError(firstError);
      } else {
        setError(
          err.response?.data?.message ||
            "Registration failed. Please check your details and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] p-4 dark:bg-slate-950">
      <div className="w-full max-w-[440px] rounded-3xl bg-white p-10 shadow-sm dark:border dark:border-slate-800 dark:bg-[#11161D]">
        <div className="mb-8 flex items-center justify-center">
          <img
            src={logoipsum}
            alt="Logoipsum"
            className="h-auto w-[125px] object-contain"
          />
        </div>

        <div className="mb-6 text-left">
          <h1 className="flex items-center gap-1.5 text-2xl font-bold text-slate-900 dark:text-white">
            Create Account
            <span className="text-xl">✨</span>
          </h1>

          <p className="mt-1 text-xs text-slate-400">Sign up to get started</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-50 p-3 text-left text-xs text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label
              htmlFor="fullName"
              className="absolute -top-2.5 left-3.5 bg-white px-1 text-[11px] font-medium text-slate-400 dark:bg-[#11161D]"
            >
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Robert Allen"
              required
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-xs text-slate-800 placeholder-slate-300 outline-none transition-all focus:border-[#0052CC] dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-600"
            />
          </div>

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

          <div className="relative">
            <label
              htmlFor="division"
              className="absolute -top-2.5 left-3.5 bg-white px-1 text-[11px] font-medium text-slate-400 dark:bg-[#11161D]"
            >
              Division
            </label>

            <input
              id="division"
              type="text"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              placeholder="Computer Science"
              required
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-xs text-slate-800 placeholder-slate-300 outline-none transition-all focus:border-[#0052CC] dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-600"
            />
          </div>

          <div className="relative">
            <label
              htmlFor="year"
              className="absolute -top-2.5 left-3.5 bg-white px-1 text-[11px] font-medium text-slate-400 dark:bg-[#11161D]"
            >
              Year
            </label>

            <input
              id="year"
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="3rd Year"
              required
              className="w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 text-xs text-slate-800 placeholder-slate-300 outline-none transition-all focus:border-[#0052CC] dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-2xl bg-[#0052CC] py-3.5 text-xs font-semibold text-white transition-all hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-left text-xs text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="cursor-pointer font-semibold text-[#0052CC] hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
