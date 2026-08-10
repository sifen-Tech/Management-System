import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <nav>
        <h2>Management System</h2>

        <div>
          <p>{user?.fullName}</p>
          <p>{user?.role}</p>
        </div>

        <div>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/members">Members</Link>

          {(user?.role === "admin" || user?.role === "supervisor") && (
            <Link to="/attendance">Attendance</Link>
          )}

          {user?.role === "admin" && <Link to="/settings">Settings</Link>}

          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
