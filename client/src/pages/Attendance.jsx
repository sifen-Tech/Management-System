import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Bell,
  ChevronDown,
} from "lucide-react";

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatYear = (year) => {
  if (year === undefined || year === null || year === "") {
    return "-";
  }

  const number = parseInt(String(year).replace(/\D/g, ""), 10);

  if (!number) {
    return "-";
  }

  if (number === 1) return "1st";
  if (number === 2) return "2nd";
  if (number === 3) return "3rd";

  return `${number}th`;
};

const getMemberId = (member) => {
  return member?._id || member?.id;
};

const getAvatar = (index) => {
  return `https://i.pravatar.cc/150?img=${(index % 20) + 1}`;
};

const Attendance = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const [members, setMembers] = useState([]);

  const [attendance, setAttendance] = useState({});

  const [search, setSearch] = useState("");

  const [divisionFilter, setDivisionFilter] = useState("All");

  const [showFilter, setShowFilter] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const today = getToday();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Invalid user data:", err);
      }
    }
  }, []);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError("");

      const membersResponse = await api.get("/members");

      const membersData = membersResponse.data?.members || [];

      setMembers(membersData);

      const attendanceResponse = await api.get("/attendance");

      const attendanceData = attendanceResponse.data?.attendance || [];

      const todayAttendance = {};

      attendanceData.forEach((record) => {
        if (!record?.member) {
          return;
        }

        const memberId =
          typeof record.member === "object" ? record.member._id : record.member;

        if (!memberId) {
          return;
        }

        const recordDate = new Date(record.date);

        const recordDateString = [
          recordDate.getFullYear(),
          String(recordDate.getMonth() + 1).padStart(2, "0"),
          String(recordDate.getDate()).padStart(2, "0"),
        ].join("-");

        if (recordDateString === today) {
          todayAttendance[memberId] = {
            id: record._id,
            status: record.status,
          };
        }
      });

      setAttendance(todayAttendance);
    } catch (err) {
      console.error("Attendance loading error:", err);

      const message =
        err.response?.data?.message || "Could not load attendance information.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const divisions = useMemo(() => {
    const values = members.map((member) => member.division).filter(Boolean);

    return ["All", ...new Set(values)];
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        !searchValue ||
        member.fullName?.toLowerCase().includes(searchValue) ||
        member.email?.toLowerCase().includes(searchValue) ||
        member.division?.toLowerCase().includes(searchValue);

      const matchesDivision =
        divisionFilter === "All" ||
        member.division?.toLowerCase() === divisionFilter.toLowerCase();

      return matchesSearch && matchesDivision;
    });
  }, [members, search, divisionFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMembers.length / itemsPerPage),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  const endIndex = startIndex + itemsPerPage;

  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  const handleAttendanceChange = (memberId, status) => {
    setAttendance((previous) => ({
      ...previous,
      [memberId]: {
        ...previous[memberId],
        status,
      },
    }));

    setSuccess("");
    setError("");
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const recordsToSave = Object.entries(attendance).filter(
        ([, record]) => record?.status,
      );

      if (recordsToSave.length === 0) {
        setError("Please select Present or Absent for at least one member.");

        setSaving(false);
        return;
      }

      const requests = recordsToSave.map(async ([memberId, record]) => {
        if (record.id) {
          return api.put(`/attendance/${record.id}`, {
            status: record.status,
            date: today,
          });
        }

        return api.post("/attendance", {
          member: memberId,
          date: today,
          status: record.status,
        });
      });

      await Promise.all(requests);

      setSuccess("Attendance saved successfully.");

      await fetchAttendanceData();
    } catch (err) {
      console.error("Save attendance error:", err);

      const message =
        err.response?.data?.message || "Could not save attendance.";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleHeadsUp = (member) => {
    alert(
      `Heads Up selected for ${member.fullName}. Your backend currently supports only Present and Absent attendance statuses.`,
    );
  };

  const userName =
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.username ||
    "Admin User";

  const userRole = currentUser?.role || "user";

  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Attendance
          </h1>

          <p className="mt-0.5 text-xs text-slate-400">
            All Attendance
            <span className="px-1">&gt;</span>
            Attendance
            <span className="px-1">&gt;</span>
            Group 1
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 w-36 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-[#11161D] dark:text-slate-200"
            />
          </div>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-[#11161D] dark:text-slate-300"
          >
            <Bell className="h-4 w-4" />
          </button>

          {/* User */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 dark:border-slate-700 dark:bg-[#11161D]">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-[11px] font-bold text-slate-700 dark:bg-slate-700 dark:text-white">
              {userInitials || "U"}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-[11px] font-semibold leading-tight text-slate-800 dark:text-slate-100">
                {userName}
              </p>

              <p className="mt-0.5 text-[9px] font-medium uppercase tracking-wide text-slate-400">
                {userRole}
              </p>
            </div>

            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-[#11161D]">
        <div className="mb-4 flex items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[11px] text-slate-700 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Save */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="h-9 min-w-[70px] rounded-lg bg-[#0052CC] px-4 text-[11px] font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilter((previous) => !previous)}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                <Filter className="h-3.5 w-3.5" />
                Filter
              </button>

              {showFilter && (
                <div className="absolute right-0 top-11 z-20 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-[#11161D]">
                  <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Division
                  </p>

                  {divisions.map((division) => (
                    <button
                      key={division}
                      type="button"
                      onClick={() => {
                        setDivisionFilter(division);
                        setCurrentPage(1);
                        setShowFilter(false);
                      }}
                      className={`w-full rounded-lg px-2 py-1.5 text-left text-[11px] transition ${
                        divisionFilter === division
                          ? "bg-blue-50 font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                          : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      {division}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {success && (
          <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] font-medium text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] border-collapse text-left">
            {/* Table header */}
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="px-3 pb-3 text-[10px] font-medium text-slate-400">
                  Member Name
                </th>

                <th className="px-3 pb-3 text-[10px] font-medium text-slate-400">
                  Attendance
                </th>

                <th className="px-3 pb-3 text-[10px] font-medium text-slate-400">
                  Excused
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan="3"
                    className="py-12 text-center text-xs text-slate-400"
                  >
                    Loading attendance...
                  </td>
                </tr>
              )}

              {!loading && paginatedMembers.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="py-12 text-center text-xs text-slate-400"
                  >
                    No members found.
                  </td>
                </tr>
              )}

              {!loading &&
                paginatedMembers.map((member, index) => {
                  const memberId = getMemberId(member);

                  const currentStatus = attendance[memberId]?.status || "";

                  return (
                    <tr
                      key={memberId}
                      className="border-b border-slate-100 transition hover:bg-slate-50/60 dark:border-slate-800/60 dark:hover:bg-slate-800/30"
                    >
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={getAvatar(startIndex + index)}
                            alt={member.fullName}
                            className="h-7 w-7 rounded-full object-cover"
                          />

                          <div>
                            <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">
                              {member.fullName}
                            </p>

                            <p className="text-[9px] text-slate-400">
                              {member.division || "No division"}
                              {" · "}
                              {formatYear(member.year)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          {/* Present */}
                          <button
                            type="button"
                            onClick={() =>
                              handleAttendanceChange(memberId, "present")
                            }
                            className={`rounded-full border px-2.5 py-1 text-[9px] font-medium transition ${
                              currentStatus === "present"
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-slate-200 bg-white text-slate-500 hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                            }`}
                          >
                            Present
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleAttendanceChange(memberId, "absent")
                            }
                            className={`rounded-full border px-2.5 py-1 text-[9px] font-medium transition ${
                              currentStatus === "absent"
                                ? "border-red-500 bg-red-500 text-white"
                                : "border-slate-200 bg-white text-slate-500 hover:border-red-300 hover:text-red-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400"
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>

                      <td className="px-3 py-2">
                        <button
                          type="button"
                          onClick={() => handleHeadsUp(member)}
                          className="rounded-md bg-[#0052CC] px-3 py-1.5 text-[9px] font-semibold text-white transition hover:bg-blue-700"
                        >
                          Heads Up
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          {/* Showing */}
          <div className="flex items-center gap-2 text-[9px] text-slate-400">
            <span>Showing</span>

            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[9px] font-medium text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            <span>
              Showing {filteredMembers.length === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(endIndex, filteredMembers.length)} out of{" "}
              {filteredMembers.length} records
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goToPage(safeCurrentPage - 1)}
              disabled={safeCurrentPage === 1}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] font-medium transition ${
                  page === safeCurrentPage
                    ? "border border-blue-600 bg-white text-blue-600 dark:bg-slate-900"
                    : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => goToPage(safeCurrentPage + 1)}
              disabled={safeCurrentPage === totalPages}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
