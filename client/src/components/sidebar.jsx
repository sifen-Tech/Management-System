import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Settings,
  Sun,
  Moon,
} from "lucide-react";

const Sidebar = ({ menuItems = [] }) => {
  const { theme, toggleTheme } = useTheme();

  const getIcon = (label) => {
    const lower = label?.toLowerCase() || "";
    if (lower.includes("dashboard"))
      return <LayoutDashboard className="w-4 h-4" />;
    if (lower.includes("member")) return <Users className="w-4 h-4" />;
    if (lower.includes("attendance"))
      return <CalendarCheck className="w-4 h-4" />;
    if (lower.includes("setting")) return <Settings className="w-4 h-4" />;
    return null;
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col border-r border-slate-200/80 bg-white px-4 py-6 dark:border-slate-800 dark:bg-[#0E131A]">
      {/* Brand Header */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-sm">
          L
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-900 dark:text-white">
            Logoipsum
          </h1>
          <p className="text-[10px] text-slate-400">Management System</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex h-10 items-center gap-3 rounded-xl px-3.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-600/10 dark:text-blue-400 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
              }`
            }
          >
            {getIcon(item.label)}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto">
        <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800/60">
          <button
            type="button"
            onClick={() => toggleTheme("light")}
            className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg text-[11px] font-medium transition cursor-pointer ${
              theme === "light"
                ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => toggleTheme("dark")}
            className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg text-[11px] font-medium transition cursor-pointer ${
              theme === "dark"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Dark</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
