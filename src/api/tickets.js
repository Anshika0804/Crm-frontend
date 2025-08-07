import axios from "axios";

const BASE_URL = "http://localhost:8000/api/leads";

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Fetch all tickets
export const fetchTickets = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tickets/`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw error;
  }
};

// Fetch a single ticket by ID
export const fetchTicketById = async (ticketId) => {
  try {
    const response = await axios.get(`${BASE_URL}/tickets/${ticketId}/`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ticket with ID ${ticketId}:`, error);
    throw error;
  }
};

// Create a new ticket
export const addTicket = async (ticketData) => {
  try {
    const response = await axios.post(`${BASE_URL}/tickets/`, ticketData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error adding ticket:", error);
    throw error;
  }
};

// Update an existing ticket
export const updateTicket = async (ticketId, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/tickets/${ticketId}/`, updatedData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating ticket with ID ${ticketId}:`, error);
    throw error;
  }
};

// Delete a ticket
export const deleteTicket = async (ticketId) => {
  try {
    await axios.delete(`${BASE_URL}/tickets/${ticketId}/`, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.error(`Error deleting ticket with ID ${ticketId}:`, error);
    throw error;
  }
};

// Fetch list of leads for dropdown
export const fetchLeadDropdown = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/dropdown/`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching lead dropdown list:", error);
    throw error;
  }
};
