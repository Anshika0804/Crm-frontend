import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

export const fetchExtendedLeads = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${BASE_URL}/leads/extended/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching leads:", error);
    throw error;
  }
};

export const updateLead = async (leadId, updatedData) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.put(`${BASE_URL}/leads/${leadId}/`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating lead with ID ${leadId}:`, error);
    throw error;
  }
};

// Delete a lead
export const deleteLead = async (leadId) => {
  const token = localStorage.getItem("accessToken");
  try {
    await axios.delete(`${BASE_URL}/leads/${leadId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(`Error deleting lead with ID ${leadId}:`, error);
    throw error;
  }
};

export const addLead = async (leadData) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.post(`${BASE_URL}/leads/`, leadData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding lead:", error);
    throw error;
  }
};