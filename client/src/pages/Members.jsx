import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Members = () => {
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    division: "",
    year: "",
  });

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/members");

      setMembers(response.data.members);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (editingMemberId) {
        const url = "/members/" + editingMemberId;

        await api.put(url, {
          ...formData,
          year: Number(formData.year),
        });
      } else {
        await api.post("/members", {
          ...formData,
          year: Number(formData.year),
        });
      }

      resetForm();
      fetchMembers();
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Failed to save member");
    }
  };

  const handleEdit = (member) => {
    setEditingMemberId(member._id);

    setFormData({
      fullName: member.fullName,
      email: member.email,
      phone: member.phone,
      division: member.division,
      year: member.year,
    });

    setShowForm(true);
  };

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

  if (loading) {
    return <p>Loading members...</p>;
  }

  return (
    <div>
      <h1>Members</h1>

      <p>
        Logged in as: {user?.fullName} ({user?.role})
      </p>

      {error && <p>{error}</p>}

      {/* Add Member button */}
      {(user?.role === "admin" || user?.role === "supervisor") && (
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          Add Member
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <h2>{editingMemberId ? "Edit Member" : "Create Member"}</h2>

          <div>
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Division</label>
            <input
              type="text"
              name="division"
              value={formData.division}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
            />
          </div>

          <button type="submit">
            {editingMemberId ? "Update Member" : "Create Member"}
          </button>

          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        </form>
      )}

      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Division</th>
              <th>Year</th>

              {(user?.role === "admin" || user?.role === "supervisor") && (
                <th>Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr key={member._id}>
                <td>{member.fullName}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>{member.division}</td>
                <td>{member.year}</td>

                {(user?.role === "admin" || user?.role === "supervisor") && (
                  <td>
                    <button onClick={() => handleEdit(member)}>Edit</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Members;
