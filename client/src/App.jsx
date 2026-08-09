import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AccessDenied from "./pages/AccessDenied";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route element={<RoleRoute allowedRoles={["admin", "supervisor"]} />}>
            <Route path="/attendance" element={<div>Attendance Page</div>} />
          </Route>

          <Route element={<RoleRoute allowedRoles={["admin"]} />}>
            <Route path="/settings" element={<div>Settings Page</div>} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
