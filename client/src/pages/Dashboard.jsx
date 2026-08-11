import { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import {
  Users,
  Grid,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  MoreVertical,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMembers, resAttendance] = await Promise.all([
          api.get("/members"),
          api.get("/attendance"),
        ]);
        setMembers(resMembers.data.members || []);
        setAttendance(resAttendance.data.attendance || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const totalMembers = members.length;
  const totalDivisions =
    new Set(members.map((m) => m.division).filter(Boolean)).size || 5;
  const presentCount = attendance.filter((a) => a.status === "present").length;
  const attendanceRate =
    attendance.length > 0
      ? Math.round((presentCount / attendance.length) * 100)
      : 68;

  const chartData = [
    { name: "Jan", Attendance: 40, Previous: 24 },
    { name: "Feb", Attendance: 55, Previous: 38 },
    { name: "Mar", Attendance: 70, Previous: 50 },
    { name: "Apr", Attendance: 65, Previous: 48 },
    { name: "May", Attendance: 85, Previous: 60 },
    { name: "Jun", Attendance: 78, Previous: 55 },
    { name: "Jul", Attendance: attendanceRate, Previous: 65 },
  ];

  return (
    <div className="space-y-6">
      <Header subtitle="Good Morning" />

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-blue-600 p-6 text-white shadow-sm flex justify-between items-center">
            <div className="space-y-3 z-10 max-w-sm">
              <span className="inline-block px-3 py-1 text-[10px] font-semibold bg-white/20 rounded-full">
                Upcoming Event
              </span>
              <h2 className="text-lg font-bold leading-snug">
                Cross-division knowledge-sharing
              </h2>
              <button className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-xl hover:bg-slate-800 transition">
                Add to calendar
              </button>
            </div>
            <div className="hidden sm:block opacity-80">
              <Calendar className="w-28 h-28 stroke-1 text-white/40" />
            </div>
          </div>

          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Total Members */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#11161D] border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <Users className="w-4 h-4" />
                <span className="flex items-center text-[10px] text-emerald-500 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                  +12% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                {totalMembers || 162}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Total members</p>
            </div>

            {/* Total Divisions */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#11161D] border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <Grid className="w-4 h-4" />
                <span className="flex items-center text-[10px] text-emerald-500 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                  +5% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                {totalDivisions}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Total Divisions</p>
            </div>

            {/* Attendance Rate */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#11161D] border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <TrendingUp className="w-4 h-4" />
                <span className="flex items-center text-[10px] text-red-500 font-semibold bg-red-50 dark:bg-red-950/40 px-1.5 py-0.5 rounded">
                  -2%
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                {attendanceRate}%
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Attendance Rate</p>
            </div>

            {/* Upcoming Sessions */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#11161D] border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400">
                <Calendar className="w-4 h-4" />
                <span className="flex items-center text-[10px] text-emerald-500 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
                  +15% <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
                12
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Upcoming Sessions
              </p>
            </div>
          </div>

          {/* Area Chart */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#11161D] border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Attendance Overview
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  This year
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                  Last year
                </span>
              </div>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="Attendance"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={0.1}
                    fill="#2563eb"
                  />
                  <Area
                    type="monotone"
                    dataKey="Previous"
                    stroke="#cbd5e1"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Session Column */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#11161D] border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Session
            </h3>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>

          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Wednesday, 26 July 2026
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-[11px] font-medium text-slate-400 w-10 pt-2">
                09:30
              </span>
              <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Content in CPD Division
                </p>
                <MoreVertical className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[11px] font-medium text-slate-400 w-10 pt-2">
                12:00
              </span>
              <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Development Division Weekly Sessions
                </p>
                <MoreVertical className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-[11px] font-medium text-slate-400 w-10 pt-2">
                01:30
              </span>
              <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Cyber Weekly Sessions
                </p>
                <MoreVertical className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
