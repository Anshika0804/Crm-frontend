// src/pages/NotesAndAttachments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:8000/api/leads";

// Always return token header
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const NotesAndAttachments = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({ description: "" });

  // Load tickets
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${BASE_URL}/tickets/`, {
          headers: getAuthHeader(),
        });
        setTickets(res.data);
      } catch (err) {
        toast.error("Error fetching tickets");
      }
    })();
  }, []);

  // Fetch notes for selected ticket
  // When user clicks View, pass full ticket object
const handleViewNotes = (ticket) => {
  setSelectedTicket(ticket);  // directly set the whole ticket object
};

// Fetch notes when selectedTicket changes
useEffect(() => {
  if (!selectedTicket) return; // no ticket selected

  const fetchNotes = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/notes/?ticket_id=${selectedTicket.id}`,
        { headers: getAuthHeader() }
      );
      setNotes(res.data);
      setEditingNote(null);
    } catch {
      toast.error("Error fetching notes");
      setNotes([]);
    }
  };

  fetchNotes();
}, [selectedTicket]);

  // Handle textarea input
  const handleInputChange = (e) => {
    setNoteForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Add new note
  const handleAddNote = async () => {
    if (!noteForm.description.trim()) {
      toast.error("Note description cannot be empty");
      return;
    }
    try {
      const payload = {
        ...noteForm,
        ticket: selectedTicket.id, // backend expects ticket ID in payload
      };
      const res = await axios.post(`${BASE_URL}/notes/`, payload, {
        headers: getAuthHeader(),
      });
      setNotes([res.data, ...notes]);
      setNoteForm({ description: "" });
      toast.success("Note added successfully");
    } catch {
      toast.error("Failed to add note");
    }
  };

  // Start editing
  const handleEditClick = (note) => {
    setEditingNote(note.id);
    setNoteForm({ description: note.description });
  };

  // Save edited note
  const handleSaveEdit = async () => {
    try {
      const payload = {
        ...noteForm,
        ticket: selectedTicket.id, // keep ticket reference
      };
      const res = await axios.put(
        `${BASE_URL}/notes/${editingNote}/`,
        payload,
        { headers: getAuthHeader() }
      );
      setNotes((prev) =>
        prev.map((n) => (n.id === editingNote ? res.data : n))
      );
      setEditingNote(null);
      toast.success("Note updated");
    } catch {
      toast.error("Failed to update note");
    }
  };

  // Delete note
  const handleDeleteClick = async (noteId) => {
    try {
      await axios.delete(`${BASE_URL}/notes/${noteId}/`, {
        headers: getAuthHeader(),
      });
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      toast.success("Note deleted");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-primary mb-4 fw-bold">📝 Notes & Attachments</h2>
      <div className="row">
        {/* Tickets list */}
        {/* Tickets list */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white fw-bold">
                🎫 Tickets
              </div>
              <ul className="list-group list-group-flush">
                {tickets.map((ticket) => (
                  <li
                    key={ticket.id}
                    className={`list-group-item d-flex justify-content-between align-items-center ${
                      selectedTicket?.id === ticket.id ? "bg-light fw-bold" : ""
                    }`}
                  >
                    {ticket.title || `Ticket #${ticket.id}`}
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleViewNotes(ticket)} 
                    >
                      View
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        {/* Notes for selected ticket */}
        <div className="col-md-8">
          {selectedTicket && (
            <>
              <div className="card mb-4 shadow-sm border-0">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    📝 Notes for{" "}
                    <span className="text-primary fw-bold">
                      {selectedTicket.title || `Ticket #${selectedTicket.id}`}
                    </span>
                  </h5>
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  {notes.length === 0 ? (
                    <p className="text-muted">No notes available.</p>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className="border rounded p-3 mb-3 bg-white shadow-sm"
                      >
                        {editingNote === note.id ? (
                          <>
                            <textarea
                              name="description"
                              value={noteForm.description}
                              onChange={handleInputChange}
                              className="form-control"
                              rows="3"
                            />
                            <div className="d-flex gap-2 mt-3">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={handleSaveEdit}
                              >
                                ✅ Save
                              </button>
                              <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => setEditingNote(null)}
                              >
                                ❌ Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p className="mb-1">{note.description}</p>
                            <small className="text-muted">
                              {new Date(note.created_at).toLocaleString()}
                            </small>
                            <div className="d-flex gap-2 mt-2">
                              <button
                                className="btn btn-outline-secondary btn-sm"
                                onClick={() => handleEditClick(note)}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDeleteClick(note.id)}
                              >
                                🗑️ Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add note */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-primary text-white">
                  ➕ Add New Note
                </div>
                <div className="card-body">
                  <textarea
                    name="description"
                    value={noteForm.description}
                    onChange={handleInputChange}
                    className="form-control"
                    rows="3"
                    placeholder="Enter your note..."
                  />
                  <button
                    className="btn btn-primary mt-3 float-end"
                    onClick={handleAddNote}
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesAndAttachments;
