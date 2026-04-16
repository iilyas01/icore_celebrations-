import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const cards = [
    { label: " Themes", path: "/themes", color: "#ff6b6b" },
    { label: " Services", path: "/services", color: "#ffa94d" },
    { label: " Venues", path: "/venues", color: "#51cf66" },
    { label: " Packages", path: "/packages", color: "#339af0" },
  ];

  return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <h1>Welcome to iCore Celebrations </h1>
      <p style={{ fontSize: 18, color: "white" }}>Plan Your Perfect Celebration</p>

      <div style={{
        display: "flex", flexWrap: "wrap",
        justifyContent: "center", gap: 20, marginTop: 30
      }}>
        {cards.map((card) => (
          <Link to={card.path} key={card.path} style={{ textDecoration: "none" }}>
            <div style={{
              background: card.color, color: "white",
              padding: "30px 40px", borderRadius: 12,
              fontSize: 18, fontWeight: "bold",
              width: 160, cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
            }}>
              {card.label}
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 30 }}>
        <Link to="/my-plan">
          <button style={{
            padding: "14px 40px", fontSize: 16,
            background: "#6c63ff", color: "white",
            border: "none", borderRadius: 8, cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
          }}>
            📋 My Plan
          </button>
        </Link>
      </div>

      {!token && (
        <div style={{ marginTop: 20 }}>
          <Link to="/login">
            <button style={{
              padding: "10px 24px", marginRight: 10,
              background: "#6c63ff", color: "white",
              border: "none", borderRadius: 8, cursor: "pointer"
            }}>Login</button>
          </Link>
          <Link to="/register">
            <button style={{
              padding: "10px 24px",
              background: "#28a745", color: "white",
              border: "none", borderRadius: 8, cursor: "pointer"
            }}>Register</button>
          </Link>
        </div>
      )}

      {token && (
        <button onClick={handleLogout} style={{
          marginTop: 20, padding: "10px 24px",
          background: "#ff4d4d", color: "white",
          border: "none", borderRadius: 8, cursor: "pointer"
        }}>Logout</button>
      )}
    </div>
  );
}