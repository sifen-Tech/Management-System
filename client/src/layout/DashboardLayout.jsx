import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/members");
      setMembers(response.data.members || []);
    } catch (error) {
      console.error("Failed to load dashboard members:", error);
    } finally {
      setLoadingMembers(false);
    }

    if (user?.role === "admin" || user?.role === "supervisor") {
      setLoadingAttendance(true);

      try {
        const response = await api.get("/attendance");
        setAttendance(response.data.attendance || []);
      } catch (error) {
        console.error("Failed to load dashboard attendance:", error);
        setAttendanceError("Unable to load attendance data.");
      } finally {
        setLoadingAttendance(false);
      }
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Calculations
  const totalMembers = members.length;
  const presentCount = attendance.filter(
    (record) => record.status === "present",
  ).length;
  const totalAttendance = attendance.length;
  const attendanceRate =
    totalAttendance > 0
      ? Math.round((presentCount / totalAttendance) * 100)
      : 0;

  return (
    <div className="p-8 w-full">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Hello {user?.fullName || "Test Admin"} 👋
          </h1>
          <p className="text-sm text-slate-400">Good Morning</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-full text-sm focus:outline-none w-64 dark:text-white"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">
              🔍
            </span>
          </div>

          <button className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-300">
            🔔
          </button>

          <div className="flex items-center gap-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 font-bold text-xs">
              {user?.fullName?.charAt(0) || "A"}
            </div>
            <div className="text-xs text-left">
              <p className="font-semibold text-slate-800 dark:text-white">
                {user?.fullName || "Test Admin"}
              </p>
              <p className="text-slate-400 capitalize">
                {user?.role || "Admin"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Grid Content */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Banner */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white flex justify-between items-center shadow-sm">
            <div className="max-w-md space-y-3">
              <span className="text-xs uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                Upcoming Event
              </span>
              <h2 className="text-xl font-bold">
                Cross-division knowledge-sharing
              </h2>
              <p className="text-sm text-blue-100">
                Connect with members from different divisions and share
                knowledge.
              </p>
              <button className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition mt-2">
                Add to calendar
              </button>
            </div>
            <div className="hidden sm:block">
              <div className="w-28 h-28 bg-white/10 rounded-2xl flex items-center justify-center text-4xl">
                📊
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B22] shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-slate-400">
                  Total Members
                </span>
                <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full">
                  ↑ 12%
                </span>
              </div>
              {loadingMembers ? (
                <p className="text-sm text-slate-400">Loading...</p>
              ) : (
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {totalMembers}
                </h3>
              )}
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#161B22] shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-slate-400">
                  Attendance Rate
                </span>
              </div>
              {loadingAttendance ? (
                <p className="text-sm text-slate-400">Loading...</p>
              ) : attendanceError ? (
                <p className="text-xs text-red-500">{attendanceError}</p>
              ) : (
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {attendanceRate}%
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
