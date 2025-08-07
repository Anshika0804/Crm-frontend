import React, { useEffect, useState } from "react";
import {
  fetchTickets,
  addTicket,
  updateTicket,
  deleteTicket,
  fetchLeadDropdown,
} from "../api/tickets";

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

  // Load tickets and leads
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

      // Reset form
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
    <div className="container p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Tickets</h2>

      {/* Ticket Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded mb-6 space-y-4">
        <div>
          <label className="block mb-1">Lead</label>
          <select
            name="lead"
            value={form.lead}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
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

        <div>
          <label className="block mb-1">Title</label>
          <input
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingTicketId ? "Update Ticket" : "Add Ticket"}
        </button>
      </form>

      {/* Ticket List */}
      {loading ? (
        <p>Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <table className="w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Title</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Priority</th>
              <th className="border px-3 py-2">Lead</th>
              <th className="border px-3 py-2">Assigned To</th>
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="border px-3 py-2">{ticket.title}</td>
                <td className="border px-3 py-2 capitalize">{ticket.status}</td>
                <td className="border px-3 py-2 capitalize">{ticket.priority}</td>
                <td className="border px-3 py-2">{ticket.lead_name || "N/A"}</td>
                <td className="border px-3 py-2">
                  {ticket.assigned_to ? ticket.assigned_to : "Unassigned"}
                </td>
                <td className="border px-3 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(ticket)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Tickets;
