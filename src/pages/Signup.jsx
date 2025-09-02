import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    role: "custom",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("https://advanced-crm.onrender.com/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (parseError) {
        setError("Server returned invalid response.");
        return;
      }

      if (response.ok && data.token) {
        setSuccess("Account created successfully!");
        setError("");
        setTimeout(() => navigate("/login"), 1500);
      } else if (typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        setError(`${firstKey}: ${data[firstKey]}`);
      } else {
        setError("Signup failed. Try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #d1d1e9, #f0f0f0)"
    }}>
      <div style={{
        background: "#ffffff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "450px",
      }}>
        <h2 style={{
          textAlign: "center",
          marginBottom: "20px",
          color: "#333",
          fontFamily: "Segoe UI, sans-serif"
        }}>
          Sign Up
        </h2>

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}
        {success && <p style={{ color: "green", marginBottom: "10px" }}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Username or Name"
            value={formData.name}
            onChange={handleChange}
            required
            pattern="^[a-zA-Z0-9._-]+$"
            title="Only letters, numbers, dots (.), underscores (_) and hyphens (-) are allowed."
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={formData.password2}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="team_lead">Team Lead</option>
            <option value="agent">Agent</option>
            <option value="custom">Custom User</option>
          </select>

          <button type="submit" style={buttonStyle}>
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

// Reusable styles
const inputStyle = {
  width: "100%",
  padding: "12px 15px",
  marginBottom: "15px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  fontSize: "14px",
  fontFamily: "Segoe UI, sans-serif",
  backgroundColor: "#f9f9f9",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  fontFamily: "Segoe UI, sans-serif",
  transition: "background 0.3s ease",
};

export default Signup;
