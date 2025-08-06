import React, { useEffect, useState } from "react";
import axios from "axios";

const AddLeadForm = ({ onLeadAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    status: "New",
    assigned_to: "",
  });

  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("accessToken");

  //Fetch all users for assignment
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/users/list/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, [token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone_number,
      status: formData.status,
      assigned_to: parseInt(formData.assigned_to),
    };

    try {
      const res = await axios.post("http://localhost:8000/api/leads/", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onLeadAdded?.(res.data);
      alert("Lead added successfully!");
      setFormData({
        name: "",
        email: "",
        phone_number: "",
        status: "New",
        assigned_to: "",
      });
    } catch (err) {
      console.error("Error creating lead", err.response?.data || err.message);
      alert("Failed to create lead");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        value={formData.name}
        required
      />
      <input
        name="email"
        placeholder="Email"
        type="email"
        onChange={handleChange}
        value={formData.email}
        required
      />
      <input
        name="phone_number"
        placeholder="Phone Number"
        onChange={handleChange}
        value={formData.phone_number}
        required
      />

      <select name="status" onChange={handleChange} value={formData.status}>
        <option value="New">New</option>
        <option value="Contacted">Contacted</option>
        <option value="Qualified">Qualified</option>
        <option value="Lost">Lost</option>
      </select>

      <select
        name="assigned_to"
        onChange={handleChange}
        value={formData.assigned_to}
        required
      >
        <option value="">Assign to</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name || user.username || user.email}
          </option>
        ))}
      </select>

      <button type="submit">Add Lead</button>
    </form>
  );
};

export default AddLeadForm;
