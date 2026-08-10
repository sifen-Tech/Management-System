import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const Layout = ({ menuItems, onLogout }) => {
  return (
    // Ensure "flex" is applied to the root container
    <div className="flex min-h-screen w-full bg-[#F7F8FA] dark:bg-[#0D1117]">
      {/* 1. Fixed width sidebar */}
      <Sidebar menuItems={menuItems} onLogout={onLogout} />

      {/* 2. Main content area filling remaining space */}
      <main className="flex-1 min-w-0 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
