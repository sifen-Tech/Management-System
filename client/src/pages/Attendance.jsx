import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Attendance = () => {
  const { user } = useAuth();

  // =====================================================
  // STATE
  // =====================================================

  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [loadingMembers, setLoadingMembers] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("All");

  const [selectedDate, setSelectedDate] = useState(() => {
    const date = new Date();

    return date.toISOString().split("T")[0];
  });

  const [savingId, setSavingId] = useState(null);

  const [editingAttendanceId, setEditingAttendanceId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // =====================================================
  // PERMISSION
  // =====================================================

  const canManageAttendance =
    user?.role === "admin" || user?.role === "supervisor";

  // =====================================================
  // GET MEMBERS
  // =====================================================

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);

      const response = await api.get("/members");

      setMembers(response.data.members || []);
    } catch (error) {
      console.error("Failed to load members:", error);

      setError(error.response?.data?.message || "Failed to load members.");
    } finally {
      setLoadingMembers(false);
    }
  };

  // =====================================================
  // GET ATTENDANCE
  // =====================================================

  const fetchAttendance = async () => {
    try {
      setLoadingAttendance(true);

      const response = await api.get("/attendance");

      setAttendance(response.data.attendance || []);
    } catch (error) {
      console.error("Failed to load attendance:", error);

      setError(
        error.response?.data?.message || "Failed to load attendance records.",
      );
    } finally {
      setLoadingAttendance(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchMembers();
    fetchAttendance();
  }, []);

  // =====================================================
  // CLEAR MESSAGES
  // =====================================================

  useEffect(() => {
    if (!success && !error) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccess("");
      setError("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [success, error]);

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // =====================================================
  // NORMALIZE DATE
  // =====================================================

  const normalizeDate = (date) => {
    if (!date) {
      return "";
    }

    const parsedDate = new Date(date);

    return parsedDate.toISOString().split("T")[0];
  };

  // =====================================================
  // FIND ATTENDANCE FOR MEMBER + DATE
  // =====================================================

  const getAttendanceForMember = (memberId) => {
    return attendance.find((record) => {
      const recordMemberId = record.member?._id || record.member;

      return (
        recordMemberId === memberId &&
        normalizeDate(record.date) === selectedDate
      );
    });
  };

  // =====================================================
  // MARK ATTENDANCE
  // =====================================================

  const handleMarkAttendance = async (member, status) => {
    if (!canManageAttendance) {
      return;
    }

    try {
      setSavingId(member._id);
      setError("");
      setSuccess("");

      const existingAttendance = getAttendanceForMember(member._id);

      // =================================================
      // UPDATE EXISTING ATTENDANCE
      // =================================================

      if (existingAttendance) {
        await api.put(`/attendance/${existingAttendance._id}`, {
          status,
          date: selectedDate,
        });

        setSuccess(`${member.fullName}'s attendance was updated successfully.`);
      }

      // =================================================
      // CREATE NEW ATTENDANCE
      // =================================================
      else {
        await api.post("/attendance", {
          member: member._id,
          date: selectedDate,
          status,
        });

        setSuccess(`${member.fullName}'s attendance was marked ${status}.`);
      }

      await fetchAttendance();

      setEditingAttendanceId(null);
    } catch (error) {
      console.error("Attendance error:", error);

      setError(error.response?.data?.message || "Failed to save attendance.");
    } finally {
      setSavingId(null);
    }
  };

  // =====================================================
  // EDIT ATTENDANCE
  // =====================================================

  const handleEditAttendance = (record) => {
    setEditingAttendanceId(record._id);
  };

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  const handleCancelEdit = () => {
    setEditingAttendanceId(null);
  };

  // =====================================================
  // DIVISIONS
  // =====================================================

  const divisions = useMemo(() => {
    return [
      ...new Set(members.map((member) => member.division).filter(Boolean)),
    ].sort();
  }, [members]);

  // =====================================================
  // FILTER MEMBERS
  // =====================================================

  const filteredMembers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !searchValue ||
        member.fullName?.toLowerCase().includes(searchValue) ||
        member.email?.toLowerCase().includes(searchValue) ||
        member.phone?.toLowerCase().includes(searchValue);

      const matchesDivision =
        divisionFilter === "All" || member.division === divisionFilter;

      return matchesSearch && matchesDivision;
    });
  }, [members, search, divisionFilter]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMembers.length / itemsPerPage),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  const displayedMembers = filteredMembers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, divisionFilter, itemsPerPage]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const todayAttendance = members.map((member) => ({
    member,
    record: getAttendanceForMember(member._id),
  }));

  const presentCount = todayAttendance.filter(
    ({ record }) => record?.status === "present",
  ).length;

  const absentCount = todayAttendance.filter(
    ({ record }) => record?.status === "absent",
  ).length;

  const lateCount = todayAttendance.filter(
    ({ record }) => record?.status === "late",
  ).length;

  const notMarkedCount =
    members.length - presentCount - absentCount - lateCount;

  const attendanceRate =
    members.length > 0
      ? Math.round(((presentCount + lateCount) / members.length) * 100)
      : 0;

  // =====================================================
  // STATUS STYLES
  // =====================================================

  const getStatusStyle = (status) => {
    if (status === "present") {
      return "bg-[#EAF8F0] text-[#20A85A]";
    }

    if (status === "absent") {
      return "bg-[#FFF0F0] text-[#E34D59]";
    }

    if (status === "late") {
      return "bg-[#FFF7E6] text-[#D98A00]";
    }

    return "bg-[#F1F3F5] text-[#858B93]";
  };

  // =====================================================
  // STATUS LABEL
  // =====================================================

  const getStatusLabel = (status) => {
    if (status === "present") {
      return "Present";
    }

    if (status === "absent") {
      return "Absent";
    }

    if (status === "late") {
      return "Late";
    }

    return "Not Marked";
  };

  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = (name) => {
    if (!name) {
      return "M";
    }

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // =====================================================
  // LOADING
  // =====================================================

  const loading = loadingMembers || loadingAttendance;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      {/* =================================================
          PAGE HEADER
      ================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#17191C]">Attendance</h1>

          <p className="mt-1 text-[13px] text-[#8A9099]">
            Track and manage member attendance
          </p>
        </div>

        {/* User */}
        <div className="flex items-center">
          <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E3E6EA] bg-white px-3 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B57D0] text-xs font-bold text-white">
              {getInitials(user?.fullName)}
            </div>

            <div className="leading-tight">
              <p className="max-w-[120px] truncate text-xs font-semibold text-[#20242A]">
                {user?.fullName}
              </p>

              <p className="text-[10px] uppercase text-[#9298A1]">
                {user?.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          ALERTS
      ================================================== */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
          {success}
        </div>
      )}

      {/* =================================================
          STATISTICS
      ================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Present */}

        <div className="rounded-2xl border border-[#E4E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(20,30,50,0.03)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#9298A1]">Present</p>

              <h2 className="mt-2 text-2xl font-bold text-[#20242A]">
                {presentCount}
              </h2>

              <p className="mt-1 text-[11px] text-[#A0A5AC]">Members present</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF8F0] text-[#20A85A]">
              ✓
            </div>
          </div>
        </div>

        {/* Absent */}

        <div className="rounded-2xl border border-[#E4E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(20,30,50,0.03)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#9298A1]">Absent</p>

              <h2 className="mt-2 text-2xl font-bold text-[#20242A]">
                {absentCount}
              </h2>

              <p className="mt-1 text-[11px] text-[#A0A5AC]">Members absent</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F0] text-[#E34D59]">
              ×
            </div>
          </div>
        </div>

        {/* Late */}

        <div className="rounded-2xl border border-[#E4E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(20,30,50,0.03)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#9298A1]">Late</p>

              <h2 className="mt-2 text-2xl font-bold text-[#20242A]">
                {lateCount}
              </h2>

              <p className="mt-1 text-[11px] text-[#A0A5AC]">Members late</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF7E6] text-[#D98A00]">
              !
            </div>
          </div>
        </div>

        {/* Rate */}

        <div className="rounded-2xl border border-[#E4E7EB] bg-white p-5 shadow-[0_2px_8px_rgba(20,30,50,0.03)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-[#9298A1]">
                Attendance Rate
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#20242A]">
                {attendanceRate}%
              </h2>

              <p className="mt-1 text-[11px] text-[#A0A5AC]">
                {notMarkedCount} not marked
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF3FF] text-[#0B57D0]">
              %
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          MAIN CARD
      ================================================== */}

      <div className="rounded-2xl border border-[#E4E7EB] bg-white shadow-[0_2px_8px_rgba(20,30,50,0.03)]">
        {/* =================================================
            TOOLBAR
        ================================================== */}

        <div className="flex flex-col gap-4 border-b border-[#ECEEF1] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Date */}

          <div>
            <label className="mb-2 block text-[11px] font-semibold text-[#777D85]">
              Attendance Date
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-11 rounded-xl border border-[#E2E5E9] bg-white px-4 text-xs text-[#343940] outline-none focus:border-[#0B57D0] focus:ring-2 focus:ring-[#0B57D0]/10"
            />
          </div>

          {/* Search / Filter */}

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search */}

            <div className="relative w-full sm:w-[240px]">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#747A83]">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search member..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-xl border border-[#E2E5E9] bg-white pl-10 pr-4 text-xs text-[#20242A] outline-none placeholder:text-[#A0A5AC] focus:border-[#0B57D0] focus:ring-2 focus:ring-[#0B57D0]/10"
              />
            </div>

            {/* Division */}

            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="h-11 rounded-xl border border-[#E2E5E9] bg-white px-4 text-xs font-medium text-[#343940] outline-none focus:border-[#0B57D0]"
            >
              <option value="All">All Divisions</option>

              {divisions.map((division) => (
                <option key={division} value={division}>
                  {division}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* =================================================
            PERMISSION MESSAGE
        ================================================== */}

        {!canManageAttendance && (
          <div className="border-b border-[#ECEEF1] bg-[#FFF8E8] px-5 py-3 text-xs text-[#9A6B00] sm:px-6">
            You have view-only access to attendance.
          </div>
        )}

        {/* =================================================
            TABLE
        ================================================== */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse">
            <thead>
              <tr className="border-b border-[#ECEEF1] text-left">
                <th className="px-6 py-4 text-[11px] font-semibold text-[#969BA3]">
                  Member
                </th>

                <th className="px-4 py-4 text-[11px] font-semibold text-[#969BA3]">
                  Division
                </th>

                <th className="px-4 py-4 text-[11px] font-semibold text-[#969BA3]">
                  Year
                </th>

                <th className="px-4 py-4 text-[11px] font-semibold text-[#969BA3]">
                  Status
                </th>

                <th className="px-4 py-4 text-[11px] font-semibold text-[#969BA3]">
                  Marked By
                </th>

                <th className="px-6 py-4 text-right text-[11px] font-semibold text-[#969BA3]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {/* Loading */}

              {loading && (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-[#DCE1E7] border-t-[#0B57D0]" />

                    <p className="text-xs font-medium text-[#8C929A]">
                      Loading attendance...
                    </p>
                  </td>
                </tr>
              )}

              {/* Empty */}

              {!loading && displayedMembers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F0F2F5] text-xl">
                      👤
                    </div>

                    <p className="text-sm font-semibold text-[#343940]">
                      No members found
                    </p>

                    <p className="mt-1 text-xs text-[#9298A1]">
                      Try changing your search or division filter.
                    </p>
                  </td>
                </tr>
              )}

              {/* Members */}

              {!loading &&
                displayedMembers.map((member) => {
                  const record = getAttendanceForMember(member._id);

                  const isEditing = editingAttendanceId === record?._id;

                  return (
                    <tr
                      key={member._id}
                      className="border-b border-[#F0F1F3] transition hover:bg-[#FAFBFC]"
                    >
                      {/* Member */}

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E7EEF9] text-[10px] font-bold text-[#0B57D0]">
                            {member.avatar ? (
                              <img
                                src={member.avatar}
                                alt={member.fullName}
                                className="h-full w-full rounded-full object-cover"
                              />
                            ) : (
                              getInitials(member.fullName)
                            )}
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-[#30343A]">
                              {member.fullName}
                            </p>

                            <p className="mt-0.5 text-[10px] text-[#A0A5AC]">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Division */}

                      <td className="px-4 py-4 text-xs text-[#555B64]">
                        {member.division || "-"}
                      </td>

                      {/* Year */}

                      <td className="px-4 py-4 text-xs text-[#555B64]">
                        {member.year
                          ? `${member.year}${
                              member.year === 1
                                ? "st"
                                : member.year === 2
                                  ? "nd"
                                  : member.year === 3
                                    ? "rd"
                                    : "th"
                            }`
                          : "-"}
                      </td>

                      {/* Status */}

                      <td className="px-4 py-4">
                        {record ? (
                          <span
                            className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-semibold ${getStatusStyle(
                              record.status,
                            )}`}
                          >
                            {getStatusLabel(record.status)}
                          </span>
                        ) : (
                          <span className="inline-flex rounded-md bg-[#F1F3F5] px-2.5 py-1 text-[10px] font-semibold text-[#858B93]">
                            Not Marked
                          </span>
                        )}
                      </td>

                      {/* Marked By */}

                      <td className="px-4 py-4 text-xs text-[#555B64]">
                        {record?.markedBy?.fullName || "-"}
                      </td>

                      {/* Action */}

                      <td className="px-6 py-4 text-right">
                        {!canManageAttendance ? (
                          <span className="text-[10px] text-[#A0A5AC]">
                            View only
                          </span>
                        ) : (
                          <div className="flex justify-end gap-2">
                            {(!record || isEditing) && (
                              <>
                                {/* Present */}

                                <button
                                  type="button"
                                  disabled={savingId === member._id}
                                  onClick={() =>
                                    handleMarkAttendance(member, "present")
                                  }
                                  className="rounded-lg bg-[#EAF8F0] px-3 py-2 text-[10px] font-semibold text-[#20A85A] transition hover:bg-[#D8F3E4] disabled:opacity-50"
                                >
                                  Present
                                </button>

                                {/* Late */}

                                <button
                                  type="button"
                                  disabled={savingId === member._id}
                                  onClick={() =>
                                    handleMarkAttendance(member, "late")
                                  }
                                  className="rounded-lg bg-[#FFF7E6] px-3 py-2 text-[10px] font-semibold text-[#D98A00] transition hover:bg-[#FFEFCF] disabled:opacity-50"
                                >
                                  Late
                                </button>

                                {/* Absent */}

                                <button
                                  type="button"
                                  disabled={savingId === member._id}
                                  onClick={() =>
                                    handleMarkAttendance(member, "absent")
                                  }
                                  className="rounded-lg bg-[#FFF0F0] px-3 py-2 text-[10px] font-semibold text-[#E34D59] transition hover:bg-[#FFE0E0] disabled:opacity-50"
                                >
                                  Absent
                                </button>

                                {isEditing && (
                                  <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="rounded-lg border border-[#E1E4E8] px-3 py-2 text-[10px] font-semibold text-[#777D85]"
                                  >
                                    Cancel
                                  </button>
                                )}
                              </>
                            )}

                            {record && !isEditing && (
                              <button
                                type="button"
                                onClick={() => handleEditAttendance(record)}
                                className="rounded-lg border border-[#DDE1E6] bg-white px-3 py-2 text-[10px] font-semibold text-[#555B64] transition hover:border-[#0B57D0] hover:text-[#0B57D0]"
                              >
                                Change
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* =================================================
            PAGINATION
        ================================================== */}

        <div className="flex flex-col gap-4 border-t border-[#ECEEF1] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[11px] text-[#8D939B]">
            <span>Show</span>

            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="rounded-md border border-[#E1E4E8] bg-white px-2 py-1 text-[11px] text-[#555B64] outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            <span>
              {filteredMembers.length === 0 ? "0" : startIndex + 1} -{" "}
              {Math.min(startIndex + itemsPerPage, filteredMembers.length)} of{" "}
              {filteredMembers.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Previous */}

            <button
              type="button"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs text-[#777D85] transition hover:bg-[#F1F3F5] disabled:cursor-not-allowed disabled:opacity-30"
            >
              ‹
            </button>

            {/* Pages */}

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .slice(0, 5)
              .map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-semibold transition ${
                    safeCurrentPage === page
                      ? "bg-[#0B57D0] text-white shadow-sm"
                      : "text-[#777D85] hover:bg-[#F1F3F5]"
                  }`}
                >
                  {page}
                </button>
              ))}

            {/* Next */}

            <button
              type="button"
              disabled={safeCurrentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs text-[#777D85] transition hover:bg-[#F1F3F5] disabled:cursor-not-allowed disabled:opacity-30"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
