import { useEffect, useState } from "react";
import api from "../services/api";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.get("/members");

        console.log("Members response:", response.data);

        setMembers(response.data.members);
      } catch (error) {
        console.error("FULL ERROR:", error);
        console.error("STATUS:", error.response?.status);
        console.error("RESPONSE:", error.response?.data);
        console.error("MESSAGE:", error.message);
        console.error(
          "Failed to fetch members:",
          error.response?.data || error.message,
        );

        setError("Failed to load members.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <p>Loading members...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>All Members</h1>

      {members.length === 0 ? (
        <p>No members found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Division</th>
              <th>Year</th>
            </tr>
          </thead>

          <tbody>
            {members.map((member) => (
              <tr key={member._id}>
                <td>{member.fullName}</td>
                <td>{member.email}</td>
                <td>{member.division}</td>
                <td>{member.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Members;
