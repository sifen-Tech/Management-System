import { useEffect, useState } from "react";
import { ChevronDown, Search, Bell, Sun, Moon } from "lucide-react";

const Settings = () => {
  // =========================
  // Current logged-in user
  // =========================
  const [currentUser, setCurrentUser] = useState(null);

  // =========================
  // Theme
  // =========================
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  // =========================
  // Settings preferences
  // =========================
  const [autoAddEvents, setAutoAddEvents] = useState(() => {
    const saved = localStorage.getItem("autoAddEvents");

    return saved !== null ? JSON.parse(saved) : true;
  });

  const [makePhonePublic, setMakePhonePublic] = useState(() => {
    const saved = localStorage.getItem("makePhonePublic");

    return saved !== null ? JSON.parse(saved) : true;
  });

  // =========================
  // Load logged-in user
  // =========================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
        setCurrentUser(null);
      }
    }
  }, []);

  // =========================
  // Apply theme
  // =========================
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // =========================
  // Save Auto Add Events
  // =========================
  useEffect(() => {
    localStorage.setItem("autoAddEvents", JSON.stringify(autoAddEvents));
  }, [autoAddEvents]);

  // =========================
  // Save Phone Visibility
  // =========================
  useEffect(() => {
    localStorage.setItem("makePhonePublic", JSON.stringify(makePhonePublic));
  }, [makePhonePublic]);

  // =========================
  // Change theme
  // =========================
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  // =========================
  // User information
  // =========================

  // Your backend uses fullName, not name
  const userName =
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.username ||
    "Admin User";

  const userRole = currentUser?.role || "user";

  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* =========================================
          HEADER
      ========================================== */}
      <div className="flex items-center justify-between">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Settings
          </h1>

          <p className="mt-0.5 text-xs text-slate-400">
            All Settings <span className="px-1">&gt;</span>
          </p>
        </div>

        {/* Header right side */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search"
              className="h-9 w-36 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-[#11161D] dark:text-slate-200"
            />
          </div>

          {/* Notification */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-[#11161D] dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <Bell className="h-4 w-4" />
          </button>

          {/* User */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 dark:border-slate-700 dark:bg-[#11161D]">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={userName}
                className="h-8 w-8 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-[11px] font-bold text-slate-700 dark:bg-slate-700 dark:text-white">
                {userInitials || "U"}
              </div>
            )}

            <div className="hidden text-left sm:block">
              <p className="text-[11px] font-semibold leading-tight text-slate-800 dark:text-slate-100">
                {userName}
              </p>

              <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-400">
                {userRole}
              </p>
            </div>

            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* =========================================
          SETTINGS CARD
      ========================================== */}
      <div className="min-h-[370px] rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-[#11161D]">
        {/* =====================================
            APPEARANCE
        ====================================== */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-6 dark:border-slate-800/80">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Appearance
            </h2>

            <p className="mt-0.5 text-xs text-slate-400">
              Customize how your theme looks on your device
            </p>
          </div>

          {/* Appearance dropdown */}
          <div className="relative">
            <select
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="h-9 appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-9 text-xs font-medium text-slate-700 outline-none transition hover:bg-slate-100 focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* =====================================
            AUTO ADD EVENTS
        ====================================== */}
        <div className="flex items-center justify-between border-b border-slate-100 py-6 dark:border-slate-800/80">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Automatically Add Events to Calendar
            </h2>

            <p className="mt-0.5 max-w-2xl text-xs text-slate-400">
              Save time by auto-adding events to your calendar, or manually
              enter them for more control.
            </p>
          </div>

          {/* Toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={autoAddEvents}
            aria-label="Automatically Add Events to Calendar"
            onClick={() => setAutoAddEvents((previous) => !previous)}
            className={`relative ml-6 inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
              autoAddEvents
                ? "bg-emerald-500"
                : "bg-slate-200 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                autoAddEvents ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* =====================================
            PHONE PUBLIC
        ====================================== */}
        <div className="flex items-center justify-between py-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Make your Phone Public
            </h2>

            <p className="mt-0.5 max-w-2xl text-xs text-slate-400">
              Keep your phone private for safety, or share it for convenience.
            </p>
          </div>

          {/* Toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={makePhonePublic}
            aria-label="Make your Phone Public"
            onClick={() => setMakePhonePublic((previous) => !previous)}
            className={`relative ml-6 inline-flex h-5 w-10 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ${
              makePhonePublic
                ? "bg-emerald-500"
                : "bg-slate-200 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                makePhonePublic ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
