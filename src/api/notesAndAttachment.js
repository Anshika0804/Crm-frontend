// src/api/notesAndAttachments.js
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/leads";

// Axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
});

// Add Authorization header automatically for every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

//NOTES API

// Fetch all notes for a specific ticket
export const fetchNotes = async (ticketId) => {
  try {
    const response = await api.get(`/notes/?ticket_id=${ticketId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching notes for ticket ${ticketId}:`,
      error.response?.data || error
    );
    throw error;
  }
};

// Add a new note to a specific ticket
export const addNote = async (ticketId, noteData) => {
  try {
    const payload = { ...noteData, ticket: ticketId };
    const response = await api.post(`/notes/`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error adding note to ticket ${ticketId}:`, error.response?.data || error);
    throw error;
  }
};

// Update a specific note
export const updateNote = async (noteId, updatedData) => {
  try {
    const response = await api.put(`/notes/${noteId}/`, updatedData);
    return response.data;
  } catch (error) {
    console.error(`Error updating note with ID ${noteId}:`, error.response?.data || error);
    throw error;
  }
};

// Delete a specific note
export const deleteNote = async (noteId) => {
  try {
    await api.delete(`/notes/${noteId}/`);
  } catch (error) {
    console.error(`Error deleting note with ID ${noteId}:`, error.response?.data || error);
    throw error;
  }
};
