import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Members = () => {
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    division: "",
    year: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const canManageMembers =
    user?.role === "admin" || user?.role === "supervisor";

  // =========================
  // GET MEMBERS
  // =========================
  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/members");

      setMembers(response.data.members || []);
    } catch (error) {
      console.error("Failed to load members:", error);

      setError(
        error.response?.data?.message || "Failed to load members records.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // =========================
  // FORM INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      division: "",
      year: "",
    });

    setEditingMemberId(null);
    setShowForm(false);
  };

  // =========================
  // ADD MEMBER
  // =========================
  const handleAddMember = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      division: "",
      year: "",
    });

    setEditingMemberId(null);
    setShowForm(true);
    setError("");
  };

  // =========================
  // EDIT MEMBER
  // =========================
  const handleEdit = (member) => {
    setEditingMemberId(member._id);

    setFormData({
      fullName: member.fullName || "",
      email: member.email || "",
      phone: member.phone || "",
      division: member.division || "",
      year: member.year ?? "",
    });

    setShowForm(true);
    setError("");
  };

  // =========================
  // CREATE / UPDATE MEMBER
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const data = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        division: formData.division.trim(),
        year: Number(formData.year),
      };

      if (editingMemberId) {
        await api.put(`/members/${editingMemberId}`, data);
      } else {
        await api.post("/members", data);
      }

      await fetchMembers();

      resetForm();
    } catch (error) {
      console.error("Failed to save member:", error);

      setError(error.response?.data?.message || "Failed to save member.");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // DELETE MEMBER
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this member?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      await api.delete(`/members/${id}`);

      await fetchMembers();
    } catch (error) {
      console.error("Failed to delete member:", error);

      setError(error.response?.data?.message || "Failed to delete member.");
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // DIVISIONS
  // =========================
  const divisions = useMemo(() => {
    const uniqueDivisions = [
      ...new Set(members.map((member) => member.division).filter(Boolean)),
    ];

    return uniqueDivisions.sort();
  }, [members]);

  // =========================
  // SEARCH + FILTER
  // =========================
  const filteredMembers = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !searchValue ||
        member.fullName?.toLowerCase().includes(searchValue) ||
        member.email?.toLowerCase().includes(searchValue) ||
        member.phone?.toLowerCase().includes(searchValue) ||
        member.division?.toLowerCase().includes(searchValue);

      const matchesDivision =
        divisionFilter === "All" || member.division === divisionFilter;

      return matchesSearch && matchesDivision;
    });
  }, [members, search, divisionFilter]);

  // =========================
  // PAGINATION
  // =========================
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

  // =========================
  // INITIALS
  // =========================
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

  // =========================
  // MEMBER ID
  // =========================
  const getMemberId = (member, index) => {
    if (member.studentId) {
      return member.studentId;
    }

    if (member._id) {
      return `MEM-${member._id.slice(-6).toUpperCase()}`;
    }

    return `MEM-${index + 1}`;
  };

  // =========================
  // YEAR FORMAT
  // =========================
  const formatYear = (year) => {
    if (!year) {
      return "-";
    }

    if (year === 1) {
      return "1st";
    }

    if (year === 2) {
      return "2nd";
    }

    if (year === 3) {
      return "3rd";
    }

    return `${year}th`;
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] p-4 sm:p-6 lg:p-8">
      {/* ======================================
          PAGE HEADER
      ====================================== */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#17191C]">All Members</h1>

          <p className="mt-1 text-[13px] text-[#8A9099]">
            All Members Information
          </p>
        </div>

        {/* User information */}
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

      {/* ======================================
          MAIN CARD
      ====================================== */}
      <div className="rounded-2xl border border-[#E4E7EB] bg-white shadow-[0_2px_8px_rgba(20,30,50,0.03)]">
        {/* ======================================
            SEARCH / ACTION BAR
        ====================================== */}
        <div className="flex flex-col gap-4 border-b border-[#ECEEF1] px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:w-[260px]">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#747A83]">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#E2E5E9] bg-white pl-10 pr-4 text-xs text-[#20242A] outline-none placeholder:text-[#A0A5AC] focus:border-[#0B57D0] focus:ring-2 focus:ring-[#0B57D0]/10"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {canManageMembers && (
              <button
                type="button"
                onClick={handleAddMember}
                className="flex h-11 items-center gap-2 rounded-xl bg-[#0B57D0] px-5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#0849B5] active:scale-[0.98]"
              >
                <span className="text-base leading-none">+</span>
                Add Member
              </button>
            )}

            {/* Filter */}
            <div className="relative">
              <select
                value={divisionFilter}
                onChange={(e) => setDivisionFilter(e.target.value)}
                className="h-11 appearance-none rounded-xl border border-[#E2E5E9] bg-white py-0 pl-10 pr-9 text-xs font-medium text-[#343940] outline-none transition hover:bg-[#F8F9FA] focus:border-[#0B57D0]"
              >
                <option value="All">All Divisions</option>

                {divisions.map((division) => (
                  <option key={division} value={division}>
                    {division}
                  </option>
                ))}
              </select>

              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#747A83]">
                ◇
              </span>

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#747A83]">
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* ======================================
            ERROR
        ====================================== */}
        {error && (
          <div className="mx-5 mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 sm:mx-6">
            {error}
          </div>
        )}

        {/* ======================================
            ADD / EDIT FORM
        ====================================== */}
        {showForm && canManageMembers && (
          <div className="border-b border-[#ECEEF1] bg-[#FAFBFC] px-5 py-6 sm:px-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#17191C]">
                  {editingMemberId ? "Edit Member" : "Add New Member"}
                </h2>

                <p className="mt-1 text-xs text-[#9298A1]">
                  Enter the member information below.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-lg text-[#7A8088] hover:bg-[#EEF0F2] hover:text-[#20242A]"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                {/* Full Name */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#454A52]">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="h-11 w-full rounded-xl border border-[#D7DBE0] bg-white px-3 text-sm text-[#20242A] outline-none placeholder:text-[#A0A5AC] focus:border-[#0B57D0] focus:ring-2 focus:ring-[#0B57D0]/10"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#454A52]">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@gmail.com"
                    className="h-11 w-full rounded-xl border border-[#D7DBE0] bg-white px-3 text-sm text-[#20242A] outline-none placeholder:text-[#A0A5AC] focus:border-[#0B57D0] focus:ring-2 focus:ring-[#0B57D0]/10"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#454A52]">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="0912345678"
                    className="h-11 w-full rounded-xl border border-[#D7DBE0] bg-white px-3 text-sm text-[#20242A] outline-none placeholder:text-[#A0A5AC] focus:border-[#0B57D0] focus:ring-2 focus:ring-[#0B57D0]/10"
                  />
                </div>

                {/* Division */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#454A52]">
                    Division
                  </label>

                  <input
                    type="text"
                    name="division"
                    value={formData.division}
                    onChange={handleChange}
                    required
                    placeholder="IT"
                    className="h-11 w-full rounded-xl border border-[#D7DBE0] bg-white px-3 text-sm text-[#20242A] outline-none placeholder:text-[#A0A5AC] focus:border-[#0B57D0] focus:ring-2 focus:ring-[#0B57D0]/10"
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[#454A52]">
                    Year
                  </label>

                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="4"
                    className="h-11 w-full rounded-xl border border-[#D7DBE0] bg-white px-3 text-sm text-[#20242A] outline-none placeholder:text-[#A0A5AC] focus:border-[#0B57D0] focus:ring-2 focus:ring-[#0B57D0]/10"
                  />
                </div>
              </div>

              {/* Form buttons */}
              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="h-10 rounded-xl border border-[#E0E3E7] bg-white px-5 text-xs font-semibold text-[#555B64] transition hover:bg-[#F3F4F6]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="h-10 rounded-xl bg-[#0B57D0] px-5 text-xs font-semibold text-white transition hover:bg-[#0849B5] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingMemberId
                      ? "Update Member"
                      : "Create Member"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================
            TABLE
        ====================================== */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-[#ECEEF1] text-left">
                <th className="px-6 py-4 text-[11px] font-semibold text-[#969BA3]">
                  Member Name
                </th>

                <th className="px-4 py-4 text-[11px] font-semibold text-[#969BA3]">
                  Member ID
                </th>

                <th className="px-4 py-4 text-[11px] font-semibold text-[#969BA3]">
                  Division
                </th>

                <th className="px-4 py-4 text-[11px] font-semibold text-[#969BA3]">
                  Attendance
                </th>

                <th className="px-4 py-4 text-[11px] font-semibold text-[#969BA3]">
                  Year
                </th>

                <th className="px-4 py-4 text-[11px] font-semibold text-[#969BA3]">
                  Status
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
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-[#DCE1E7] border-t-[#0B57D0]" />

                    <p className="text-xs font-medium text-[#8C929A]">
                      Loading members...
                    </p>
                  </td>
                </tr>
              )}

              {/* No members */}
              {!loading && displayedMembers.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-16 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F0F2F5] text-xl text-[#7C828A]">
                      👤
                    </div>

                    <p className="text-sm font-semibold text-[#343940]">
                      No members found
                    </p>

                    <p className="mt-1 text-xs text-[#9298A1]">
                      Try changing your search or filter.
                    </p>
                  </td>
                </tr>
              )}

              {/* Members */}
              {!loading &&
                displayedMembers.map((member, index) => (
                  <tr
                    key={member._id}
                    className="border-b border-[#F0F1F3] transition hover:bg-[#FAFBFC]"
                  >
                    {/* Name */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E7EEF9] text-[10px] font-bold text-[#0B57D0]">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.fullName}
                              className="h-full w-full object-cover"
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

                    {/* ID */}
                    <td className="px-4 py-3.5 text-xs text-[#555B64]">
                      {getMemberId(member, index)}
                    </td>

                    {/* Division */}
                    <td className="px-4 py-3.5 text-xs text-[#555B64]">
                      {member.division || "-"}
                    </td>

                    {/* Attendance */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-md bg-[#EAF8F0] px-2 py-1 text-[10px] font-semibold text-[#2DB66D]">
                        Active
                      </span>
                    </td>

                    {/* Year */}
                    <td className="px-4 py-3.5 text-xs text-[#555B64]">
                      {formatYear(member.year)}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex rounded-md bg-[#EEF0FF] px-2 py-1 text-[10px] font-semibold text-[#6673C8]">
                        On Campus
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3.5 text-right">
                      {canManageMembers ? (
                        <div className="flex justify-end gap-3">
                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleEdit(member)}
                            title="Edit member"
                            className="text-[#676D75] transition hover:text-[#0B57D0]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                          </button>

                          {/* Delete */}
                          {user?.role === "admin" && (
                            <button
                              type="button"
                              onClick={() => handleDelete(member._id)}
                              disabled={deletingId === member._id}
                              title="Delete member"
                              className="text-[#676D75] transition hover:text-[#E34D59] disabled:opacity-40"
                            >
                              {deletingId === member._id ? (
                                <span className="text-xs">...</span>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M8 6V4h8v2" />
                                  <path d="M19 6l-1 14H6L5 6" />
                                  <path d="M10 11v5" />
                                  <path d="M14 11v5" />
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#A0A5AC]">
                          View only
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* ======================================
            PAGINATION
        ====================================== */}
        <div className="flex flex-col gap-4 border-t border-[#ECEEF1] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[11px] text-[#8D939B]">
            <span>Showing</span>

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
              Showing {filteredMembers.length === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredMembers.length)} out
              of {filteredMembers.length} records
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

export default Members;
