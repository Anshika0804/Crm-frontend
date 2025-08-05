// import axios from "axios";

// const BASE_URL = "http://localhost:8000/api";

// export const fetchUsers = async () => {
//   const token = localStorage.getItem("accessToken");
//   try {
//     const response = await axios.get(`${BASE_URL}/users/list/`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     throw error;
//   }
// };



// // Get Authorization Header
// const getAuthHeader = () => {
//   const token = localStorage.getItem("accessToken");
//   return {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json",
//   };
// };

// // ✅ Fetch all users with their associated leads
// export const fetchUsersWithLeads = async () => {
//   try {
//     const response = await axios.get(`${BASE_URL}/users/users-with-leads/`, {
//       headers: getAuthHeader(),
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching users with leads:", error);
//     throw error;
//   }
// };


// src/api/users.js
import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

export const fetchExtendedUsers = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${BASE_URL}/users/extended/`, {
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
