import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

// Get Authorization Header
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Fetch leads with their associated contacts
export const fetchLeadsWithContacts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/contacts/leads-with-contacts/`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching leads with contacts:", error);
    throw error;
  }
};

// Add a new contact (you'll need to pass lead ID inside contactData)
export const addContact = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/contacts/`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error adding contact:", error);
    throw error;
  }
};


// Update a contact (by contact ID)
export const updateContact = async (id, updatedData) => {
  try {
    const response = await axios.put(`${BASE_URL}/contacts/${id}/`, updatedData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating contact with ID ${id}:`, error);
    throw error;
  }
};

// Delete a contact (by contact ID)
export const deleteContact = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/contacts/${id}/`, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.error(`Error deleting contact with ID ${id}:`, error);
    throw error;
  }
};
