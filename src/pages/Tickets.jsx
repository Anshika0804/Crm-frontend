import React, { useEffect, useState } from "react";
import {
  fetchTickets,
  addTicket,
  updateTicket,
  deleteTicket,
  fetchLeadDropdown,
} from "../api/tickets";
import { FaEdit, FaTrash, FaPlusCircle } from "react-icons/fa";

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "open",
    priority: "medium",
    lead: "",
  });
  const [editingTicketId, setEditingTicketId] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ticketData, leadData] = await Promise.all([
          fetchTickets(),
          fetchLeadDropdown(),
        ]);
        setTickets(ticketData);
        setLeads(leadData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTicketId) {
        const updated = await updateTicket(editingTicketId, form);
        setTickets((prev) =>
          prev.map((ticket) => (ticket.id === editingTicketId ? updated : ticket))
        );
      } else {
        const newTicket = await addTicket(form);
        setTickets((prev) => [...prev, newTicket]);
      }
      setForm({
        title: "",
        description: "",
        status: "open",
        priority: "medium",
        lead: "",
      });
      setEditingTicketId(null);
    } catch (error) {
      console.error("Error submitting ticket:", error);
    }
  };

  const handleEdit = (ticket) => {
    setForm({
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      lead: ticket.lead?.id || "",
    });
    setEditingTicketId(ticket.id);
  };

  const handleDelete = async (ticketId) => {
    try {
      await deleteTicket(ticketId);
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">🎫 Ticket Management</h2>

      {/* Ticket Form */}
      <div className="card mb-5 shadow-sm">
        <div className="card-header bg-primary text-white">
          {editingTicketId ? "Edit Ticket" : "Add New Ticket"} <FaPlusCircle className="ms-2" />
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Lead</label>
              <select
                name="lead"
                value={form.lead}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Lead</option>
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No leads found</option>
                )}
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label">Title</label>
              <input
                name="title"
                type="text"
                value={form.title}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button type="submit" className="btn btn-success w-100">
                {editingTicketId ? "Update Ticket" : "Add Ticket"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Ticket List */}
      {loading ? (
        <div className="text-center">Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="text-center text-muted">No tickets found.</div>
      ) : (
        <div className="table-responsive shadow-sm">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Lead</th>
                <th>Assigned To</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.title}</td>
                  <td className="text-capitalize">{ticket.status}</td>
                  <td className="text-capitalize">{ticket.priority}</td>
                  <td>{ticket.lead_name || "N/A"}</td>
                  <td>{ticket.assigned_to || "Unassigned"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(ticket)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(ticket.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Tickets;
