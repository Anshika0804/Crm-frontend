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
