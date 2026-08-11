import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import api from "../services/api";

const AccessDenied = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }

        const userRes = await api.get("/auth/me");
        if (userRes.data?.user || userRes.data) {
          setCurrentUser(userRes.data.user || userRes.data);
        }
      } catch (err) {
        console.warn("Could not fetch user profile:", err);
      }
    };

    fetchCurrentUser();
  }, []);

  const userName = currentUser?.name || currentUser?.username || "Admin User";
  const userRole = currentUser?.role || "GUEST";
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Access Denied
          </h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Error &gt; Restricted Area
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-3 py-1.5 shadow-xs dark:border-slate-800 dark:bg-[#11161D]">
          {currentUser?.avatar ? (
            <img
              src={currentUser.avatar}
              alt={userName}
              className="h-8 w-8 rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white">
              {userInitials || "U"}
            </div>
          )}
          <div className="pr-1 text-left">
            <p className="text-xs font-semibold leading-tight text-slate-900 dark:text-slate-100">
              {userName}
            </p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              {userRole}
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-xs transition-colors duration-200 dark:border-slate-800 dark:bg-[#11161D]">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-400">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Access Denied
        </h2>
        <p className="mt-2 max-w-md text-xs font-medium leading-relaxed text-slate-400">
          You do not have permission to access this page. Please contact your
          system administrator if you believe this is a mistake.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Go Back</span>
          </button>

          <Link
            to="/dashboard"
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#0052CC] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-700"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
