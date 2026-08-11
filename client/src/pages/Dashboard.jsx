import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Header from "../components/Header";

import {
  Users,
  Layers3,
  CalendarDays,
  TrendingUp,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
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

  const [calendarDate, setCalendarDate] = useState(new Date());

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Members is available for admin, supervisor and user.
        const membersResponse = await api.get("/members");

        setMembers(membersResponse.data.members || []);

        try {
          const attendanceResponse = await api.get("/attendance");

          setAttendance(attendanceResponse.data.attendance || []);
        } catch (attendanceError) {
          console.log(
            "Attendance is not available for this user:",
            attendanceError?.response?.data?.message || attendanceError.message,
          );

          setAttendance([]);
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalMembers = members.length;

  const totalDivisions = useMemo(() => {
    return new Set(
      members.map((member) => member.division).filter((division) => division),
    ).size;
  }, [members]);

  const attendanceRate = useMemo(() => {
    if (!attendance.length) {
      return 0;
    }

    const present = attendance.filter(
      (item) => item.status === "present",
    ).length;

    return Math.round((present / attendance.length) * 100);
  }, [attendance]);

  const chartData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const currentYear = new Date().getFullYear();

    return months.map((month, index) => {
      const currentMonthRecords = attendance.filter((record) => {
        const date = new Date(record.date);

        return date.getFullYear() === currentYear && date.getMonth() === index;
      });

      const present = currentMonthRecords.filter(
        (record) => record.status === "present",
      ).length;

      const currentRate =
        currentMonthRecords.length > 0
          ? Math.round((present / currentMonthRecords.length) * 100)
          : 0;

      const previousYearValue = [
        30, 38, 42, 40, 48, 52, 50, 55, 48, 58, 62, 65,
      ][index];

      return {
        name: month,
        Attendance: currentRate,
        Previous: previousYearValue,
      };
    });
  }, [attendance]);

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const monthName = calendarDate.toLocaleString("default", {
    month: "long",
  });

  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const previousMonthDays = new Date(year, month, 0).getDate();

  const calendarCells = [];

  // Previous month's dates
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarCells.push({
      day: previousMonthDays - i,
      currentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push({
      day,
      currentMonth: true,
    });
  }

  let nextDay = 1;

  while (calendarCells.length < 42) {
    calendarCells.push({
      day: nextDay,
      currentMonth: false,
    });

    nextDay++;
  }

  const today = new Date();

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const previousMonth = () => {
    setCalendarDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCalendarDate(new Date(year, month + 1, 1));
  };

  const sessions = [
    {
      date: "Wednesday",
      day: "12",
      month: monthName,
      time: "09:30",
      division: "CPD",
      title: "Contest in CPD Division",
    },
    {
      date: "Wednesday",
      day: "12",
      month: monthName,
      time: "12:00",
      division: "Development",
      title: "Development Weekly Sessions",
    },
    {
      date: "Wednesday",
      day: "12",
      month: monthName,
      time: "01:30",
      division: "Cyber",
      title: "Cyber Weekly Sessions",
    },
    {
      date: "Thursday",
      day: "13",
      month: monthName,
      time: "09:30",
      division: "Data Science",
      title: "Data Science Weekly Sessions",
    },
    {
      date: "Thursday",
      day: "13",
      month: monthName,
      time: "11:00",
      division: "CPD",
      title: "Content Analysis in CPD Division",
    },
  ];

  return (
    <div className="min-h-full bg-[#f8f9fb] dark:bg-[#0b0f14]">
      <div className="space-y-5">
        <Header subtitle="Good Morning" />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_300px]">
          <div className="space-y-5">
            <div className="relative min-h-[175px] overflow-hidden rounded-xl bg-[#5795ee] px-6 py-5 text-white">
              <div className="relative z-10 max-w-[330px]">
                <div className="mb-3">
                  <span className="inline-flex rounded-full bg-[#ff6f85] px-3 py-1 text-[9px] font-semibold">
                    Members
                  </span>
                </div>

                <h2 className="text-[18px] font-bold leading-6">
                  Upcoming Event
                </h2>

                <p className="mt-2 max-w-[250px] text-[12px] leading-5 text-white/90">
                  Cross-division knowledge-sharing
                </p>

                <button
                  type="button"
                  className="mt-4 rounded-lg bg-[#073b91] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#062f73]"
                >
                  Add to calendar
                </button>
              </div>

              <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 sm:block">
                <div className="relative h-[105px] w-[125px]">
                  <div className="absolute right-0 top-4 h-[65px] w-[92px] rounded-lg border border-white/50 bg-white/20 shadow-lg backdrop-blur-sm">
                    <div className="border-b border-white/30 px-2 py-1">
                      <div className="h-1.5 w-12 rounded bg-white/70" />
                    </div>

                    <div className="grid grid-cols-3 gap-1 p-2">
                      {[1, 2, 3, 4, 5, 6].map((item) => (
                        <span key={item} className="h-2 rounded bg-white/50" />
                      ))}
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-1 h-12 w-10 rounded-t-full bg-white/30" />

                  <div className="absolute bottom-0 right-6 h-16 w-7 rounded-t-full bg-white/40" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#11161d]">
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>

                  <span className="flex items-center rounded bg-emerald-50 px-1.5 py-1 text-[9px] font-semibold text-emerald-500 dark:bg-emerald-950/30">
                    +12%
                    <ArrowUpRight className="ml-0.5 h-3 w-3" />
                  </span>
                </div>

                <p className="mt-3 text-[22px] font-bold text-slate-900 dark:text-white">
                  {loading ? "—" : totalMembers}
                </p>

                <p className="mt-1 text-[10px] text-slate-400">Total Members</p>

                <p className="mt-2 text-[9px] text-slate-400">Updated today</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#11161d]">
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <Layers3 className="h-4 w-4 text-blue-600" />
                  </div>

                  <span className="flex items-center rounded bg-emerald-50 px-1.5 py-1 text-[9px] font-semibold text-emerald-500 dark:bg-emerald-950/30">
                    +5%
                    <ArrowUpRight className="ml-0.5 h-3 w-3" />
                  </span>
                </div>

                <p className="mt-3 text-[22px] font-bold text-slate-900 dark:text-white">
                  {loading ? "—" : totalDivisions}
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  Total Divisions
                </p>

                <p className="mt-2 text-[9px] text-slate-400">
                  From member records
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#11161d]">
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>

                  <span className="rounded bg-red-50 px-1.5 py-1 text-[9px] font-semibold text-red-500 dark:bg-red-950/30">
                    -2%
                  </span>
                </div>

                <p className="mt-3 text-[22px] font-bold text-slate-900 dark:text-white">
                  {loading ? "—" : `${attendanceRate}%`}
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  Attendance Rate
                </p>

                <p className="mt-2 text-[9px] text-slate-400">
                  Based on attendance records
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#11161d]">
                <div className="flex items-center justify-between">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                  </div>

                  <span className="flex items-center rounded bg-emerald-50 px-1.5 py-1 text-[9px] font-semibold text-emerald-500 dark:bg-emerald-950/30">
                    +12%
                    <ArrowUpRight className="ml-0.5 h-3 w-3" />
                  </span>
                </div>

                {/* UI-only because backend has no session model */}
                <p className="mt-3 text-[22px] font-bold text-slate-900 dark:text-white">
                  12
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  Upcoming Sessions
                </p>

                <p className="mt-2 text-[9px] text-slate-400">
                  Scheduled sessions
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#11161d]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-[13px] font-bold text-slate-900 dark:text-white">
                    Attendance Overview
                  </h3>

                  <p className="mt-1 text-[9px] text-slate-400">
                    Monthly attendance performance
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[9px]">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <span className="h-2 w-2 rounded-full bg-blue-600" />
                    This year
                  </span>

                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                    Last year
                  </span>
                </div>
              </div>

              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -25,
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
                          offset="0%"
                          stopColor="#2563eb"
                          stopOpacity={0.2}
                        />

                        <stop
                          offset="100%"
                          stopColor="#2563eb"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="name"
                      stroke="#94a3b8"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      domain={[0, 100]}
                      ticks={[0, 20, 40, 60, 80, 100]}
                      stroke="#94a3b8"
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
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
                      dataKey="Attendance"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fill="url(#attendanceGradient)"
                      fillOpacity={1}
                    />

                    <Area
                      type="monotone"
                      dataKey="Previous"
                      stroke="#cbd5e1"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fill="transparent"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#11161d]">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[13px] font-bold text-slate-900 dark:text-white">
                Session
              </h3>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <CalendarDays className="h-4 w-4 text-blue-600" />
              </div>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={previousMonth}
                  className="flex h-6 w-6 items-center justify-center rounded-md bg-[#073b91] text-white transition hover:bg-[#052e70]"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                <p className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                  {monthName}, {year}
                </p>

                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex h-6 w-6 items-center justify-center rounded-md bg-[#073b91] text-white transition hover:bg-[#052e70]"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="mb-2 grid grid-cols-7 text-center">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <span
                    key={day}
                    className="text-[9px] font-semibold text-slate-400"
                  >
                    {day}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-1">
                {calendarCells.map((item, index) => (
                  <div
                    key={`${item.day}-${index}`}
                    className="flex h-7 items-center justify-center"
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] transition ${
                        !item.currentMonth
                          ? "text-slate-300 dark:text-slate-700"
                          : isToday(item.day)
                            ? "bg-[#073b91] font-bold text-white"
                            : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="my-5 border-t border-slate-100 dark:border-slate-800" />

            <div className="space-y-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    Wednesday, {sessions[0].day} {monthName} {year}
                  </p>

                  <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                </div>

                <div className="space-y-3">
                  {sessions.slice(0, 3).map((session) => (
                    <SessionItem
                      key={`${session.time}-${session.title}`}
                      session={session}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                    Thursday, {sessions[3].day} {monthName} {year}
                  </p>

                  <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                </div>

                <div className="space-y-3">
                  {sessions.slice(3).map((session) => (
                    <SessionItem
                      key={`${session.time}-${session.title}`}
                      session={session}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 py-2.5 text-[10px] font-semibold text-slate-500 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SessionItem = ({ session }) => {
  return (
    <div className="flex gap-3">
      {/* Time */}

      <div className="w-[35px] shrink-0 pt-2">
        <span className="text-[9px] font-medium text-slate-400">
          {session.time}
        </span>
      </div>

      <div className="min-w-0 flex-1 rounded-lg border border-slate-100 bg-slate-50 p-2.5 dark:border-slate-800 dark:bg-slate-800/30">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[8px] font-medium text-slate-400">
              {session.division}
            </p>

            <p className="mt-0.5 text-[9px] font-semibold leading-4 text-slate-800 dark:text-slate-200">
              {session.title}
            </p>
          </div>

          <MoreVertical className="mt-0.5 h-3 w-3 shrink-0 text-slate-400" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
