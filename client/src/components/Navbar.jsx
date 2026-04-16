import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={{
      background: "#6c63ff",
      padding: "12px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 10
    }}>
      <Link to="/" style={{ color: "white", fontWeight: "bold", fontSize: 20, textDecoration: "none" }}>
        iCore Celebrations
      </Link>

      <div style={{ display: "flex", gap: 15, alignItems: "center", flexWrap: "wrap" }}>
        <Link to="/themes" style={{ color: "white", textDecoration: "none" }}>Themes</Link>
        <Link to="/services" style={{ color: "white", textDecoration: "none" }}>Services</Link>
        <Link to="/venues" style={{ color: "white", textDecoration: "none" }}>Venues</Link>
        <Link to="/packages" style={{ color: "white", textDecoration: "none" }}>Packages</Link>
        <Link to="/my-plan" style={{ color: "white", textDecoration: "none" }}>My Plan</Link>

        {role === "admin" && (
          <Link to="/admin" style={{ color: "#ffd700", textDecoration: "none", fontWeight: "bold" }}>Admin</Link>
        )}

        {token ? (
          <button onClick={handleLogout} style={{
            background: "white", color: "#6c63ff", border: "none",
            padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontWeight: "bold"
          }}>Logout</button>
        ) : (
          <Link to="/login">
            <button style={{
              background: "white", color: "#6c63ff", border: "none",
              padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontWeight: "bold"
            }}>Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
}