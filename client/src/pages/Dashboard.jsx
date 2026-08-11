import { useEffect, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";
import {
  Users,
  Layers3,
  TrendingUp,
  CalendarDays,
  ArrowUpRight,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import amico from "../amico.png";

const Dashboard = () => {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersResponse, attendanceResponse] = await Promise.all([
          api.get("/members"),
          api.get("/attendance"),
        ]);

        setMembers(membersResponse.data?.members || []);
        setAttendance(attendanceResponse.data?.attendance || []);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalMembers = members.length;

  const divisions = members
    .map((member) => member.division)
    .filter((division) => division && division.trim() !== "");

  const totalDivisions = new Set(divisions).size;

  const presentCount = attendance.filter(
    (item) => item.status?.toLowerCase() === "present",
  ).length;

  const attendanceRate =
    attendance.length > 0
      ? Math.round((presentCount / attendance.length) * 100)
      : 0;

  const chartData = [
    { name: "Jan", Attendance: 45, Previous: 30 },
    { name: "Feb", Attendance: 52, Previous: 38 },
    { name: "Mar", Attendance: 60, Previous: 42 },
    { name: "Apr", Attendance: 58, Previous: 40 },
    { name: "May", Attendance: 72, Previous: 48 },
    { name: "Jun", Attendance: 80, Previous: 52 },
    {
      name: "Jul",
      Attendance: attendanceRate,
      Previous: 50,
    },
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("en-US", {
    month: "long",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  const changeMonth = (amount) => {
    const newDate = new Date(year, month + amount, 1);

    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const handleDateClick = (day) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
  };

  const formattedSelectedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const selectedMonthName = selectedDate.toLocaleString("en-US", {
    month: "long",
  });

  const selectedDay = selectedDate.getDate();

  const scheduleData = [
    {
      date: 6,
      time: "09:30",
      division: "CPD",
      title: "Contest in CPD Division",
    },
    {
      date: 6,
      time: "12:00",
      division: "Development Division",
      title: "Development Weekly Sessions",
    },
    {
      date: 6,
      time: "01:30",
      division: "Cyber",
      title: "Cyber Weekly Sessions",
    },
    {
      date: 7,
      time: "09:30",
      division: "Data Science",
      title: "Data Science Weekly Sessions",
    },
    {
      date: 7,
      time: "11:00",
      division: "CPD",
      title: "Contest Analysis in CPD Division",
    },
  ];

  const selectedSessions = scheduleData.filter(
    (session) =>
      session.date === selectedDay &&
      selectedDate.getMonth() === 6 &&
      selectedDate.getFullYear() === 2025,
  );

  return (
    <div className="space-y-5">
      <Header subtitle="Good Morning" />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
        <div className="space-y-5">
          <div className="relative h-[210px] overflow-hidden rounded-xl bg-[#5B9AF5] px-5 py-5 text-white">
            <div className="relative z-10 max-w-[270px]">
              <span className="inline-flex rounded-full bg-[#F65F73] px-3 py-1 text-[9px] font-semibold">
                Upcoming Event
              </span>

              <h2 className="mt-3 text-[15px] font-bold leading-5">
                Cross-division knowledge-sharing
              </h2>

              <p className="mt-2 max-w-[210px] text-[10px] leading-4 text-white/90">
                Connect with members from different divisions and share
                knowledge.
              </p>

              <button className="mt-4 rounded-lg bg-[#0647A8] px-4 py-2 text-[10px] font-medium text-white transition hover:bg-[#053B8C]">
                Add to calendar
              </button>
            </div>

            <img
              src={amico}
              alt="Calendar illustration"
              className="absolute bottom-4 right-7 h-[145px] w-[145px] object-contain"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="h-[108px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#11161D]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>

                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    Total Members
                  </span>
                </div>

                <span className="flex items-center rounded bg-emerald-50 px-1.5 py-1 text-[8px] font-semibold text-emerald-500 dark:bg-emerald-950/40">
                  12%
                  <ArrowUpRight className="ml-0.5 h-2.5 w-2.5" />
                </span>
              </div>

              <div className="mt-3">
                <p className="text-[22px] font-bold leading-none text-slate-900 dark:text-white">
                  {loading ? "..." : totalMembers}
                </p>

                <p className="mt-2 text-[8px] text-slate-400">
                  Update: July 16, 2025
                </p>
              </div>
            </div>

            <div className="h-[108px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#11161D]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
                    <Layers3 className="h-4 w-4 text-blue-600" />
                  </div>

                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    Total Divisions
                  </span>
                </div>

                <span className="flex items-center rounded bg-emerald-50 px-1.5 py-1 text-[8px] font-semibold text-emerald-500 dark:bg-emerald-950/40">
                  5%
                  <ArrowUpRight className="ml-0.5 h-2.5 w-2.5" />
                </span>
              </div>

              <div className="mt-3">
                <p className="text-[22px] font-bold leading-none text-slate-900 dark:text-white">
                  {loading ? "..." : totalDivisions}
                </p>

                <p className="mt-2 text-[8px] text-slate-400">
                  Update: July 14, 2025
                </p>
              </div>
            </div>

            <div className="h-[108px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#11161D]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>

                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    Attendance Rate
                  </span>
                </div>

                <span className="flex items-center rounded bg-red-50 px-1.5 py-1 text-[8px] font-semibold text-red-500 dark:bg-red-950/40">
                  8%
                </span>
              </div>

              <div className="mt-3">
                <p className="text-[22px] font-bold leading-none text-slate-900 dark:text-white">
                  {loading ? "..." : `${attendanceRate}%`}
                </p>

                <p className="mt-2 text-[8px] text-slate-400">
                  Update: July 14, 2025
                </p>
              </div>
            </div>

            <div className="h-[108px] rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#11161D]">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                  </div>

                  <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    Upcoming Sessions
                  </span>
                </div>

                <span className="flex items-center rounded bg-emerald-50 px-1.5 py-1 text-[8px] font-semibold text-emerald-500 dark:bg-emerald-950/40">
                  12%
                  <ArrowUpRight className="ml-0.5 h-2.5 w-2.5" />
                </span>
              </div>

              <div className="mt-3">
                <p className="text-[22px] font-bold leading-none text-slate-900 dark:text-white">
                  12
                </p>

                <p className="mt-2 text-[8px] text-slate-400">
                  Update: July 10, 2025
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#11161D]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <h3 className="border-b-2 border-blue-600 pb-2 text-[10px] font-bold text-blue-600">
                  Attendance Overview
                </h3>

                <span className="text-[9px] text-slate-400">Total Members</span>

                <span className="text-[9px] text-slate-400">Total Event</span>
              </div>

              <div className="flex items-center gap-3 text-[8px]">
                <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                  This year
                </span>

                <span className="flex items-center gap-1 text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  Last year
                </span>
              </div>
            </div>

            <div className="h-[190px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="attendanceGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#2563EB"
                        stopOpacity={0.15}
                      />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#94a3b8"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff",
                      fontSize: "10px",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="Previous"
                    stroke="#cbd5e1"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="transparent"
                  />

                  <Area
                    type="monotone"
                    dataKey="Attendance"
                    stroke="#2563EB"
                    strokeWidth={2}
                    fill="url(#attendanceGradient)"
                    fillOpacity={1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#11161D]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="text-[12px] font-bold text-slate-900 dark:text-white">
              Session
            </h3>

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <CalendarDays className="h-4 w-4 text-purple-500" />
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white transition hover:bg-blue-700"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>

              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                {monthName}, {year}
              </span>

              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-white transition hover:bg-blue-700"
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-y-2 text-center">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <span
                  key={day}
                  className="flex h-6 items-center justify-center text-[8px] font-semibold text-slate-400"
                >
                  {day}
                </span>
              ))}

              {Array.from({ length: firstDay }).map((_, index) => (
                <div key={`empty-${index}`} className="h-6" />
              ))}

              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDateClick(day)}
                    className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full text-[9px] transition ${
                      isSelected(day)
                        ? "bg-blue-600 font-bold text-white"
                        : isToday(day)
                          ? "border border-blue-600 font-bold text-blue-600"
                          : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="my-5 border-t border-slate-100 dark:border-slate-800" />

          <div className="space-y-5">
            {selectedSessions.length > 0 ? (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    {formattedSelectedDate}
                  </p>

                  <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                </div>

                <div className="space-y-3">
                  {selectedSessions.map((session, index) => (
                    <div
                      key={`${session.time}-${index}`}
                      className="flex gap-3"
                    >
                      <span className="w-8 pt-1 text-[9px] font-semibold text-slate-700 dark:text-slate-300">
                        {session.time}
                      </span>

                      <div className="flex-1 border-l-2 border-blue-600 pl-3">
                        <p className="text-[8px] text-slate-400">
                          {session.division}
                        </p>

                        <p className="text-[9px] font-semibold text-slate-800 dark:text-slate-200">
                          {session.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center">
                <CalendarDays className="mx-auto mb-2 h-7 w-7 text-slate-300 dark:text-slate-600" />

                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  No sessions
                </p>

                <p className="mt-1 text-[8px] text-slate-400">
                  No scheduled sessions for {formattedSelectedDate}.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
