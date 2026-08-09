import { useEffect } from "react";
import api from "../services/api";

const Dashboard = () => {
  useEffect(() => {
    const testBackend = async () => {
      try {
        const response = await api.get("/");
        console.log("Backend response:", response.data);
      } catch (error) {
        console.error("Backend connection failed:", error);
      }
    };

    testBackend();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Role-Based Management System</p>
    </div>
  );
};

export default Dashboard;
