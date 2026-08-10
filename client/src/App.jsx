import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AccessDenied from "./pages/AccessDenied";
import Members from "./pages/Members";
import Attendance from "./pages/Attendance";
import Settings from "./pages/Settings";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";
import DashboardLayout from "./layout/DashboardLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/members" element={<Members />} />

            <Route
              element={<RoleRoute allowedRoles={["admin", "supervisor"]} />}
            >
              <Route path="/attendance" element={<Attendance />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
