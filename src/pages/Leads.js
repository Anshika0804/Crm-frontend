// src/pages/Lead.js
import React, { useEffect, useState } from "react";
import { fetchExtendedLeads, deleteLead, updateLead } from "../api/leads";
import AddLeadForm from "../components/AddLeadForm";

const Lead = () => {
  const [leads, setLeads] = useState([]);
  const [editingLeadId, setEditingLeadId] = useState(null);
  const [formData, setFormData] = useState({});

  const loadLeads = async () => {
    try {
      const data = await fetchExtendedLeads();
      setLeads(data);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    }
  };

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    loadLeads();
  }, [token]);


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await deleteLead(id);
        setLeads((prev) => prev.filter((lead) => lead.id !== id));
      } catch (err) {
        console.error("Error deleting lead:", err);
      }
    }
  };

  const handleEdit = (lead) => {
    setEditingLeadId(lead.id);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone_number: lead.phone_number,
      status: lead.status,
      team: lead.team || "", // ✅ include team for editing
    });
  };

  const handleCancel = () => {
    setEditingLeadId(null);
    setFormData({});
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async (id) => {
    try {
      const updated = await updateLead(id, formData);
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, ...updated } : lead))
      );
      setEditingLeadId(null);
      setFormData({});
    } catch (err) {
      console.error("Error updating lead:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Leads List</h2>

      {/* Add Lead Form */}
      <AddLeadForm onLeadAdded={loadLeads} />

      <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Lead Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Team</th> {/* ✅ Add team header */}
            <th>Assigned By</th>
            <th>Assigned To</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.id}</td>
              <td>
                {editingLeadId === lead.id ? (
                  <input name="name" value={formData.name} onChange={handleChange} />
                ) : (
                  lead.name
                )}
              </td>
              <td>
                {editingLeadId === lead.id ? (
                  <input name="email" value={formData.email} onChange={handleChange} />
                ) : (
                  lead.email
                )}
              </td>
              <td>
                {editingLeadId === lead.id ? (
                  <input name="phone_number" value={formData.phone_number} onChange={handleChange} />
                ) : (
                  lead.phone_number
                )}
              </td>
              <td>
                {editingLeadId === lead.id ? (
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Lost">Lost</option>
                    <option value="Canceled">Canceled</option>
                    <option value="Confirmed">Confirmed</option>
                  </select>
                ) : (
                  lead.status
                )}
              </td>
              <td>
                {editingLeadId === lead.id ? (
                  <input
                    name="team"
                    value={formData.team || ""}
                    onChange={handleChange}
                    placeholder="Team ID"
                  />
                ) : (
                  lead.team || "—"
                )}
              </td>
              <td>{lead.assigned_by_name || "—"}</td>
              <td>{lead.assigned_to_name || "—"}</td>
              <td>{new Date(lead.created_at).toLocaleString()}</td>
              <td>
                {editingLeadId === lead.id ? (
                  <>
                    <button onClick={() => handleSave(lead.id)}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(lead)}>Edit</button>
                    <button onClick={() => handleDelete(lead.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Lead;
