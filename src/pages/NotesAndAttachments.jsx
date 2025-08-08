import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:8000/api/leads";

// Always return token header
const getAuthHeader = (isMultipart = false) => {
  const token = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
  };
};

const NotesAndAttachments = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Notes states
  const [notes, setNotes] = useState([]);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({ description: "" });

  // Attachments states
  const [attachments, setAttachments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Load tickets once
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

  // When user clicks "View" on a ticket
  const handleViewNotes = (ticket) => {
    setSelectedTicket(ticket);
  };

  // Fetch notes and attachments when selectedTicket changes
  useEffect(() => {
    if (!selectedTicket) return;

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

    const fetchAttachments = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/attachment/?ticket_id=${selectedTicket.id}`,
          { headers: getAuthHeader() }
        );
        setAttachments(res.data);
      } catch {
        toast.error("Error fetching attachments");
        setAttachments([]);
      }
    };

    fetchNotes();
    fetchAttachments();
  }, [selectedTicket]);

  // --- NOTES HANDLERS ---

  const handleInputChange = (e) => {
    setNoteForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAddNote = async () => {
    if (!noteForm.description.trim()) {
      toast.error("Note description cannot be empty");
      return;
    }
    try {
      const payload = {
        ...noteForm,
        ticket: selectedTicket.id,
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

  const handleEditClick = (note) => {
    setEditingNote(note.id);
    setNoteForm({ description: note.description });
  };

  const handleSaveEdit = async () => {
    try {
      const payload = {
        ...noteForm,
        ticket: selectedTicket.id,
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

  // --- ATTACHMENTS HANDLERS ---

  // File input change
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Upload attachment
  const handleUploadAttachment = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("ticket", selectedTicket.id);

      const token = localStorage.getItem("accessToken");
      await axios.post(`${BASE_URL}/attachment/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh attachments list after upload
      const res = await axios.get(
        `${BASE_URL}/attachment/?ticket_id=${selectedTicket.id}`,
        { headers: getAuthHeader() }
      );
      setAttachments(res.data);
      setSelectedFile(null);
      toast.success("Attachment uploaded");
    } catch {
      toast.error("Failed to upload attachment");
    } finally {
      setUploading(false);
    }
  };

  // Delete attachment
  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await axios.delete(`${BASE_URL}/attachment/${attachmentId}/`, {
        headers: getAuthHeader(),
      });
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
      toast.success("Attachment deleted");
    } catch {
      toast.error("Failed to delete attachment");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-primary mb-4 fw-bold">📝 Notes & Attachments</h2>
      <div className="row">
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

        {/* Notes and attachments for selected ticket */}
        <div className="col-md-8">
          {selectedTicket && (
            <>
              {/* NOTES */}
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
                  style={{ maxHeight: "300px", overflowY: "auto" }}
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

                {/* Add note */}
                <div className="card shadow-sm border-0 mt-3">
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
              </div>

              {/* ATTACHMENTS */}
              <div className="card shadow-sm border-0">
                <div className="card-header bg-light">
                  <h5 className="mb-0">
                    📎 Attachments for{" "}
                    <span className="text-primary fw-bold">
                      {selectedTicket.title || `Ticket #${selectedTicket.id}`}
                    </span>
                  </h5>
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: "250px", overflowY: "auto" }}
                >
                  {attachments.length === 0 ? (
                    <p className="text-muted">No attachments available.</p>
                  ) : (
                    attachments.map((att) => (
                      <div
                        key={att.id}
                        className="border rounded p-2 mb-2 bg-white shadow-sm d-flex justify-content-between align-items-center"
                      >
                        <a
                          href={att.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {att.file.split("/").pop()}
                        </a>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteAttachment(att.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    ))
                  )}
                </div>
                <div className="card-footer bg-white d-flex gap-2 align-items-center">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="form-control"
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleUploadAttachment}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload"}
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
