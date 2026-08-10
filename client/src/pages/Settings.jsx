import { useState } from "react";
import { ChevronDown, Moon, Sun } from "lucide-react";

const Settings = () => {
  const [theme, setTheme] = useState("Light");
  const [autoAddEvents, setAutoAddEvents] = useState(true);
  const [phonePublic, setPhonePublic] = useState(true);

  return (
    <div className="w-full max-w-4xl space-y-8 p-2">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Attendance</h1>
        <p className="text-xs text-slate-400 mt-0.5">All Attendance &gt;</p>
      </div>

      {/* Settings Section */}
      <div className="space-y-8">
        {/* 1. Appearance */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Appearance</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize how your theme looks on your device
            </p>
          </div>

          <div className="relative">
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 pr-9 text-xs font-medium text-slate-700 shadow-sm transition-all focus:border-emerald-500 focus:outline-none"
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
              <option value="System">System</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>

        {/* 2. Automatically Add Events to Calendar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Automatically Add Events to Calendar
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Save time by auto-adding events to your calendar, or manually
              enter them for more control.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAutoAddEvents(!autoAddEvents)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
              autoAddEvents ? "bg-emerald-500" : "bg-slate-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                autoAddEvents ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* 3. Make your Phone Public */}
        <div className="flex items-center justify-between pb-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Make your Phone Public
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Keep your phone private for safety, or share it for convenience.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPhonePublic(!phonePublic)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${
              phonePublic ? "bg-emerald-500" : "bg-slate-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                phonePublic ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
