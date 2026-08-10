import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  const [attendanceError, setAttendanceError] = useState("");

  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  const fetchDashboardData = async () => {
    try {
      setLoadingMembers(true);

      const response = await api.get("/members");

      setMembers(response.data.members || []);
    } catch (error) {
      console.error("Failed to load members:", error);
    } finally {
      setLoadingMembers(false);
    }

    if (user?.role === "admin" || user?.role === "supervisor") {
      try {
        setLoadingAttendance(true);
        setAttendanceError("");

        const response = await api.get("/attendance");

        setAttendance(response.data.attendance || []);
      } catch (error) {
        console.error("Failed to load attendance:", error);

        setAttendanceError(
          error.response?.data?.message || "Unable to load attendance data.",
        );
      } finally {
        setLoadingAttendance(false);
      }
    } else {
      setLoadingAttendance(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // =========================
  // CALCULATIONS
  // =========================

  const totalMembers = members.length;

  const presentCount = attendance.filter(
    (record) => record.status === "present",
  ).length;

  const totalAttendance = attendance.length;

  const attendanceRate =
    totalAttendance > 0
      ? Math.round((presentCount / totalAttendance) * 100)
      : 0;

  const absentCount = attendance.filter(
    (record) => record.status === "absent",
  ).length;

  // =========================
  // UI
  // =========================

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      {/* Header */}
      <header className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-[#17191C] dark:text-white">
            Dashboard
          </h1>

          <p className="mt-1 text-[13px] text-[#9298A1]">
            Overview of your management system
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#9AA0A8]">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search"
              className="h-11 w-[230px] rounded-xl border border-[#E2E5E9] bg-white pl-10 pr-4 text-xs text-[#20242A] outline-none placeholder:text-[#A0A5AC] focus:border-[#0B57D0] dark:border-[#303640] dark:bg-[#161B22] dark:text-white"
            />
          </div>

          {/* Notification */}
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E5E9] bg-white text-sm dark:border-[#303640] dark:bg-[#161B22]"
          >
            🔔
          </button>

          {/* User */}
          <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E2E5E9] bg-white px-2.5 dark:border-[#303640] dark:bg-[#161B22]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E7EEF9] text-xs font-bold text-[#0B57D0]">
              {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <div className="hidden sm:block">
              <p className="max-w-[110px] truncate text-[11px] font-semibold text-[#30343A] dark:text-white">
                {user?.fullName || "Admin"}
              </p>

              <p className="text-[9px] uppercase text-[#9298A1]">
                {user?.role || "admin"}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-[18px] font-bold text-[#20242A] dark:text-white">
          Hello {user?.fullName || "Admin"} 👋
        </h2>

        <p className="mt-1 text-xs text-[#9298A1]">
          Good morning! Here's what's happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Members */}
        <div className="rounded-2xl border border-[#E5E8EC] bg-white p-5 shadow-[0_2px_8px_rgba(20,30,50,0.03)] dark:border-[#252B33] dark:bg-[#161B22]">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF1FF] text-[#0B57D0]">
              👥
            </div>

            <span className="rounded-full bg-[#EAF8F0] px-2 py-1 text-[9px] font-semibold text-[#2DB66D]">
              +12%
            </span>
          </div>

          <p className="text-xs text-[#9298A1]">Total Members</p>

          <h3 className="mt-1 text-[25px] font-bold text-[#17191C] dark:text-white">
            {loadingMembers ? "..." : totalMembers}
          </h3>
        </div>

        {/* Attendance */}
        <div className="rounded-2xl border border-[#E5E8EC] bg-white p-5 shadow-[0_2px_8px_rgba(20,30,50,0.03)] dark:border-[#252B33] dark:bg-[#161B22]">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF0FF] text-[#6673C8]">
              ✓
            </div>
          </div>

          <p className="text-xs text-[#9298A1]">Attendance Rate</p>

          {loadingAttendance ? (
            <h3 className="mt-1 text-[25px] font-bold text-[#17191C] dark:text-white">
              ...
            </h3>
          ) : attendanceError ? (
            <p className="mt-2 text-[10px] text-red-500">{attendanceError}</p>
          ) : (
            <h3 className="mt-1 text-[25px] font-bold text-[#17191C] dark:text-white">
              {attendanceRate}%
            </h3>
          )}
        </div>

        {/* Present */}
        <div className="rounded-2xl border border-[#E5E8EC] bg-white p-5 shadow-[0_2px_8px_rgba(20,30,50,0.03)] dark:border-[#252B33] dark:bg-[#161B22]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF8F0] text-[#2DB66D]">
            ✓
          </div>

          <p className="text-xs text-[#9298A1]">Present Today</p>

          <h3 className="mt-1 text-[25px] font-bold text-[#17191C] dark:text-white">
            {loadingAttendance ? "..." : presentCount}
          </h3>
        </div>

        {/* Absent */}
        <div className="rounded-2xl border border-[#E5E8EC] bg-white p-5 shadow-[0_2px_8px_rgba(20,30,50,0.03)] dark:border-[#252B33] dark:bg-[#161B22]">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF1F2] text-[#E34D59]">
            !
          </div>

          <p className="text-xs text-[#9298A1]">Absent</p>

          <h3 className="mt-1 text-[25px] font-bold text-[#17191C] dark:text-white">
            {loadingAttendance ? "..." : absentCount}
          </h3>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Event */}
        <div className="xl:col-span-2">
          <div className="relative overflow-hidden rounded-2xl bg-[#0B57D0] p-7 text-white">
            <div className="relative z-10 max-w-[560px]">
              <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[9px] font-semibold uppercase tracking-wider">
                Upcoming Event
              </span>

              <h2 className="mt-4 text-[20px] font-bold">
                Cross-division knowledge-sharing
              </h2>

              <p className="mt-2 max-w-[480px] text-xs leading-6 text-blue-100">
                Connect with members from different divisions and share
                knowledge, ideas and experiences.
              </p>

              <button
                type="button"
                className="mt-5 rounded-xl bg-white px-4 py-2.5 text-[11px] font-semibold text-[#0B57D0] transition hover:bg-blue-50"
              >
                Add to calendar
              </button>
            </div>

            <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block">
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white/10 text-5xl">
                📊
              </div>
            </div>
          </div>
        </div>

        {/* Quick summary */}
        <div className="rounded-2xl border border-[#E5E8EC] bg-white p-6 dark:border-[#252B33] dark:bg-[#161B22]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#20242A] dark:text-white">
                Attendance Summary
              </h3>

              <p className="mt-1 text-[10px] text-[#9298A1]">Current records</p>
            </div>

            <span className="text-xl">📈</span>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-2 flex justify-between text-[11px]">
                <span className="text-[#777D85]">Present</span>
                <span className="font-semibold text-[#2DB66D]">
                  {presentCount}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#EEF0F2]">
                <div
                  className="h-full rounded-full bg-[#2DB66D]"
                  style={{
                    width:
                      totalAttendance > 0
                        ? `${(presentCount / totalAttendance) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex justify-between text-[11px]">
                <span className="text-[#777D85]">Absent</span>
                <span className="font-semibold text-[#E34D59]">
                  {absentCount}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[#EEF0F2]">
                <div
                  className="h-full rounded-full bg-[#E34D59]"
                  style={{
                    width:
                      totalAttendance > 0
                        ? `${(absentCount / totalAttendance) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
