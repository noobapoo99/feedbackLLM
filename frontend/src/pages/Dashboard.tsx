import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome, {user.name}</h2>
      <p>Role: {user.role}</p>

      {user.role === "ADMIN" ? (
        <h3>Admin Dashboard</h3>
      ) : (
        <h3>Analyst Dashboard</h3>
      )}
    </div>
  );
}
