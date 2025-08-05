import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

export const fetchUsers = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${BASE_URL}/users/list/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};



// Get Authorization Header
const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ✅ Fetch all users with their associated leads
export const fetchUsersWithLeads = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users/users-with-leads/`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users with leads:", error);
    throw error;
  }
};