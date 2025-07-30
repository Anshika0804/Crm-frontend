import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    role: "custom", // default role
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");  // Clear error on new input
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.password2) {
    setError("Passwords do not match.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const text = await response.text(); // Read as raw text
    console.log("Raw response:", text);

    let data;
    try {
      data = JSON.parse(text); // Now try parsing it as JSON
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      setError("Server returned invalid response.");
      return;
    }

    console.log("Parsed data:", data);

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
    console.error("Network error:", err);
    setError("Something went wrong. Please try again later.");
  }
};



  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Signup</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          value={formData.password2}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "15px" }}
        >
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="team_lead">Team Lead</option>
          <option value="agent">Agent</option>
          <option value="custom">Custom User</option>
        </select>

        <button type="submit" style={{ width: "100%", padding: "10px" }}>
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
