import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { token, logout } = useAuth();

  return (
    <div style={{ textAlign: "center", padding: 40 }}>
      <h1>iCore Celebrations 🎉</h1>
      <p>Plan Your Perfect Celebration</p>
      {token ? (
        <button onClick={logout} style={{ padding: "10px 20px", background: "#ff4d4d", color: "white", border: "none", borderRadius: 5 }}>Logout</button>
      ) : (
        <div>
          <Link to="/login"><button style={{ padding: "10px 20px", marginRight: 10, background: "#6c63ff", color: "white", border: "none", borderRadius: 5 }}>Login</button></Link>
          <Link to="/register"><button style={{ padding: "10px 20px", background: "#28a745", color: "white", border: "none", borderRadius: 5 }}>Register</button></Link>
        </div>
      )}
    </div>
  );
}