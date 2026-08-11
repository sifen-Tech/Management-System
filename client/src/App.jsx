import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "./Layouts/DashboardLayout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AccessDenied from "./pages/AccessDenied";
import Members from "./pages/Members";
import Attendance from "./pages/Attendance";
import Settings from "./pages/Settings";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import { useAuth } from "./context/AuthContext";

const AppRoutes = () => {
  const { logout } = useAuth();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: "▦",
    },
    {
      label: "All Members",
      path: "/members",
      icon: "👥",
    },
    {
      label: "Attendance",
      path: "/attendance",
      icon: "✓",
    },
    {
      label: "Settings",
      path: "/settings",
      icon: "⚙",
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/access-denied" element={<AccessDenied />} />

      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <DashboardLayout menuItems={menuItems} onLogout={handleLogout} />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/members"
            element={
              <RoleRoute allowedRoles={["admin", "supervisor", "user"]}>
                <Members />
              </RoleRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <RoleRoute allowedRoles={["admin", "supervisor"]}>
                <Attendance />
              </RoleRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <Settings />
              </RoleRoute>
            }
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
