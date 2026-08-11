import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ menuItems, onLogout }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 dark:bg-[#0B0F15] dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar fixed on the left */}
      <Sidebar menuItems={menuItems} onLogout={onLogout} />

      {/* Main Content Area shifted right by 240px */}
      <main className="pl-[240px] min-h-screen w-full">
        <div className="p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
