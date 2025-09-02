import axios from "axios";

// const BASE_URL = "http://localhost:8000/api";
const BASE_URL = "https://advanced-crm.onrender.com/api";


export const fetchExtendedUsers = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${BASE_URL}/users/users-with-leads/`, {
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

export const updateUser = async (userId, updatedData) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.put(`${BASE_URL}/users/${userId}/`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  const token = localStorage.getItem("accessToken");
  try {
    await axios.delete(`${BASE_URL}/users/${userId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw error;
  }
};
