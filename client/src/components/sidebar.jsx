import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Sidebar = ({ menuItems, onLogout }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[250px] flex-col border-r border-[#E8EAED] bg-white px-5 py-6 dark:border-[#252B33] dark:bg-[#11161D] lg:flex">
      {/* Logo */}
      <div className="mb-9 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B57D0] text-lg font-bold text-white">
          L
        </div>

        <div>
          <h1 className="text-[15px] font-bold text-[#17191C] dark:text-white">
            Logoipsum
          </h1>

          <p className="mt-0.5 text-[10px] text-[#9AA0A8]">Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="mb-3 px-3">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#A0A5AC]">
          Menu
        </p>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                "group flex h-11 items-center gap-3 rounded-xl px-4",
                "text-[13px] font-medium transition-all duration-200",
                isActive
                  ? "bg-[#EAF1FF] text-[#0B57D0] dark:bg-[#0B57D0]/20 dark:text-blue-400"
                  : "text-[#737981] hover:bg-[#F5F6F8] hover:text-[#20242A] dark:text-[#9AA0A8] dark:hover:bg-[#1B222C] dark:hover:text-white",
              ].join(" ")
            }
          >
            <span className="flex w-5 items-center justify-center text-[16px]">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto space-y-5">
        {/* Theme */}
        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-[#A0A5AC]">
            Appearance
          </p>

          <div className="flex rounded-xl bg-[#F3F4F6] p-1 dark:bg-[#1B222C]">
            <button
              type="button"
              onClick={() => toggleTheme("light")}
              className={`flex h-9 flex-1 items-center justify-center gap-1 rounded-lg text-[11px] font-semibold transition ${
                theme === "light"
                  ? "bg-white text-[#0B57D0] shadow-sm dark:bg-[#252D38]"
                  : "text-[#8B9199]"
              }`}
            >
              ☀️ Light
            </button>

            <button
              type="button"
              onClick={() => toggleTheme("dark")}
              className={`flex h-9 flex-1 items-center justify-center gap-1 rounded-lg text-[11px] font-semibold transition ${
                theme === "dark"
                  ? "bg-[#0B57D0] text-white shadow-sm"
                  : "text-[#8B9199]"
              }`}
            >
              🌙 Dark
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={onLogout}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl text-[12px] font-semibold text-[#E34D59] transition hover:bg-[#FFF1F2]"
        >
          <span>↪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
