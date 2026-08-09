import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const testProtectedRoute = async () => {
      try {
        const response = await api.get("/members");

        console.log("Protected API response:", response.data);
      } catch (error) {
        console.error(
          "Protected API failed:",
          error.response?.data || error.message,
        );
      }
    };

    testProtectedRoute();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      console.log("Backend logout successful");
    } catch (error) {
      console.error(
        "Backend logout failed:",
        error.response?.data || error.message,
      );
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <p>Welcome, {user?.fullName}</p>
      <p>Role: {user?.role}</p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
