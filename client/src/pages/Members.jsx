import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import {
  Search,
  Plus,
  Filter,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

const getUiMemberData = (index) => {
  const attendanceStatuses = [
    "Active",
    "Active",
    "Needs Attention",
    "Active",
    "Needs Attention",
    "Active",
    "Inactive",
    "Inactive",
    "Needs Attention",
    "Active",
  ];

  const campusStatuses = [
    "On Campus",
    "Off Campus",
    "On Campus",
    "On Campus",
    "Off Campus",
    "On Campus",
    "Off Campus",
    "On Campus",
    "On Campus",
    "Off Campus",
  ];

  return {
    memberId: `UGR/${25603 + index}/14`,
    attendance:
      attendanceStatuses[index % attendanceStatuses.length] || "Active",
    status: campusStatuses[index % campusStatuses.length] || "On Campus",
    avatar: `https://i.pravatar.cc/150?img=${(index % 20) + 1}`,
  };
};

const formatYear = (year) => {
  if (year === undefined || year === null || year === "") {
    return "-";
  }

  const number = Number(String(year).replace(/\D/g, ""));

  if (!number) {
    return "-";
  }

  if (number === 1) return "1st";
  if (number === 2) return "2nd";
  if (number === 3) return "3rd";

  return `${number}th`;
};

const Members = () => {
  const [members, setMembers] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);

  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    division: "",
    year: "",
  });

  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error("Could not read logged-in user:", err);
    }
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/members");

      const backendMembers = response.data?.members || [];

      setMembers(backendMembers);
    } catch (err) {
      console.error("Failed to fetch members:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load members. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return members.filter((member) => {
      const fullName = member.fullName?.toLowerCase() || "";
      const email = member.email?.toLowerCase() || "";
      const division = member.division?.toLowerCase() || "";
      const phone = member.phone?.toLowerCase() || "";

      const matchesSearch =
        !searchValue ||
        fullName.includes(searchValue) ||
        email.includes(searchValue) ||
        division.includes(searchValue) ||
        phone.includes(searchValue);

      const matchesDivision =
        divisionFilter === "All" || division === divisionFilter.toLowerCase();

      return matchesSearch && matchesDivision;
    });
  }, [members, search, divisionFilter]);

  const divisions = useMemo(() => {
    const uniqueDivisions = [
      ...new Set(
        members
          .map((member) => member.division)
          .filter(Boolean)
          .map((division) => division.trim()),
      ),
    ];

    return uniqueDivisions;
  }, [members]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMembers.length / recordsPerPage),
  );

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * recordsPerPage;

  const paginatedMembers = filteredMembers.slice(
    startIndex,
    startIndex + recordsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, divisionFilter, recordsPerPage]);

  const handleAddMember = () => {
    setEditingMember(null);

    setFormData({
      fullName: "",
      email: "",
      phone: "",
      division: "",
      year: "",
    });

    setFormError("");
    setShowModal(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);

    setFormData({
      fullName: member.fullName || "",
      email: member.email || "",
      phone: member.phone || "",
      division: member.division || "",
      year: member.year || "",
    });

    setFormError("");
    setShowModal(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.division.trim() ||
      !String(formData.year).trim()
    ) {
      setFormError("Please fill in all fields.");
      return;
    }

    try {
      setSaving(true);

      if (editingMember) {
        await api.put(`/members/${editingMember._id}`, {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          division: formData.division,
          year: Number(formData.year),
        });
      } else {
        await api.post("/members", {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          division: formData.division,
          year: Number(formData.year),
        });
      }

      setShowModal(false);

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        division: "",
        year: "",
      });

      await fetchMembers();
    } catch (err) {
      console.error("Save member error:", err);

      setFormError(
        err.response?.data?.message ||
          "Something went wrong while saving the member.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMember = async (member) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.fullName}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/members/${member._id}`);

      await fetchMembers();
    } catch (err) {
      console.error("Delete member error:", err);

      alert(err.response?.data?.message || "Unable to delete this member.");
    }
  };

  const getAttendanceBadge = (status) => {
    if (status === "Active") {
      return (
        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          Active
        </span>
      );
    }

    if (status === "Needs Attention") {
      return (
        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
          Needs Attention
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-500 dark:bg-rose-950/40 dark:text-rose-400">
        Inactive
      </span>
    );
  };

  const getStatusBadge = (status) => {
    if (status === "Off Campus") {
      return (
        <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-500 dark:bg-rose-950/30 dark:text-rose-400">
          Off Campus
        </span>
      );
    }

    return (
      <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
        On Campus
      </span>
    );
  };

  const userName =
    currentUser?.fullName ||
    currentUser?.name ||
    currentUser?.username ||
    "Admin User";

  const userRole = currentUser?.role || "admin";

  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            All Members
          </h1>

          <p className="mt-0.5 text-xs text-slate-400">
            All Members Information
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-3 py-1.5 shadow-sm dark:border-slate-800 dark:bg-[#11161D]">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-xs font-bold text-white">
            {userInitials || "U"}
          </div>

          <div className="pr-1 text-left">
            <p className="text-xs font-semibold leading-tight text-slate-900 dark:text-slate-100">
              {userName}
            </p>

            <p className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
              {userRole}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-[#11161D]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs font-medium text-slate-700 outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-200"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddMember}
              className="flex items-center gap-1.5 rounded-xl bg-[#0052CC] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Member
            </button>

            <div className="relative">
              <select
                value={divisionFilter}
                onChange={(event) => setDivisionFilter(event.target.value)}
                className="cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-xs font-medium text-slate-600 outline-none transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              >
                <option value="All">Filter</option>

                {divisions.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>

              <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-semibold text-slate-400 dark:border-slate-800">
                <th className="pb-3 pl-1 font-medium">Member Name</th>

                <th className="pb-3 font-medium">Member ID</th>

                <th className="pb-3 font-medium">Division</th>

                <th className="pb-3 font-medium">Attendance</th>

                <th className="pb-3 font-medium">Year</th>

                <th className="pb-3 font-medium">Status</th>

                <th className="pb-3 pr-2 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-[11px] dark:divide-slate-800/60">
              {/* LOADING */}

              {loading && (
                <tr>
                  <td
                    colSpan="7"
                    className="py-12 text-center text-xs text-slate-400"
                  >
                    Loading members...
                  </td>
                </tr>
              )}

              {!loading && paginatedMembers.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="py-12 text-center text-xs text-slate-400"
                  >
                    {search || divisionFilter !== "All"
                      ? "No members match your search."
                      : "No members found."}
                  </td>
                </tr>
              )}

              {!loading &&
                paginatedMembers.map((member, index) => {
                  const globalIndex = startIndex + index;

                  const uiData = getUiMemberData(globalIndex);

                  return (
                    <tr
                      key={member._id}
                      className="transition hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                    >
                      <td className="py-3 pl-1">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={uiData.avatar}
                            alt={member.fullName}
                            className="h-7 w-7 rounded-full object-cover"
                          />

                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">
                              {member.fullName}
                            </p>

                            <p className="mt-0.5 text-[9px] text-slate-400">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 font-medium text-slate-500 dark:text-slate-400">
                        {uiData.memberId}
                      </td>

                      <td className="py-3 font-medium text-slate-700 dark:text-slate-300">
                        {member.division || "-"}
                      </td>

                      <td className="py-3">
                        {getAttendanceBadge(uiData.attendance)}
                      </td>

                      <td className="py-3 font-medium text-slate-600 dark:text-slate-400">
                        {formatYear(member.year)}
                      </td>

                      <td className="py-3">{getStatusBadge(uiData.status)}</td>

                      <td className="py-3 pr-2">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleEditMember(member)}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                            title="Edit member"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteMember(member)}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                            title="Delete member"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 text-[10px] text-slate-400 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span>Showing</span>

            <select
              value={recordsPerPage}
              onChange={(event) =>
                setRecordsPerPage(Number(event.target.value))
              }
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-700 outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>

            <span>
              Showing {filteredMembers.length === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(startIndex + recordsPerPage, filteredMembers.length)}{" "}
              out of {filteredMembers.length} records
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={safeCurrentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .slice(0, 5)
              .map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-[10px] font-medium transition ${
                    safeCurrentPage === page
                      ? "bg-[#0052CC] font-bold text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {page}
                </button>
              ))}

            <button
              type="button"
              disabled={safeCurrentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-800"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-[#11161D]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingMember ? "Edit Member" : "Add Member"}
                </h2>

                <p className="mt-1 text-[11px] text-slate-400">
                  {editingMember
                    ? "Update member information"
                    : "Add a new member to the system"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-[11px] text-red-600 dark:bg-red-950/20 dark:text-red-400">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="example@gmail.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  placeholder="Phone number"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Division
                </label>

                <input
                  type="text"
                  name="division"
                  value={formData.division}
                  onChange={handleFormChange}
                  placeholder="Development"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Year
                </label>

                <input
                  type="number"
                  name="year"
                  min="1"
                  value={formData.year}
                  onChange={handleFormChange}
                  placeholder="4"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs outline-none transition focus:border-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#0052CC] px-5 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingMember
                      ? "Update Member"
                      : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
