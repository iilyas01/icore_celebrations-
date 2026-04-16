import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/auth/register", form);
      login(res.data.token, res.data.role || "customer");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 20 }}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }} />
        <input name="email" placeholder="Email" onChange={handleChange} required style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required style={{ display: "block", width: "100%", marginBottom: 10, padding: 8 }} />
        <button type="submit" style={{ width: "100%", padding: 10, background: "#6c63ff", color: "white", border: "none", borderRadius: 5 }}>Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}