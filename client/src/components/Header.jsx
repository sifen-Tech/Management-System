import { Search, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Header = ({
  title = "Dashboard",
  subtitle = "Overview & Statistics",
}) => {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          Hello {user?.fullName || "User"} 👋
        </h1>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-56 bg-white dark:bg-[#11161D] text-xs text-slate-800 dark:text-slate-200 pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <button className="p-2 bg-white dark:bg-[#11161D] border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 bg-white dark:bg-[#11161D] border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl">
          <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
            {getInitials(user?.fullName)}
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
              {user?.fullName}
            </p>
            <p className="text-[10px] uppercase text-slate-400">
              {user?.role || "Member"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
