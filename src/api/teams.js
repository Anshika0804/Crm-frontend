import axios from "axios";

// const BASE_URL = "http://localhost:8000/api";
const BASE_URL = "https://advanced-crm.onrender.com/api";


const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};


// Fetch all teams 
export const fetchTeams = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/teams/`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }
};

// Fetch teams with users
export const fetchTeamsWithUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/teams/with-users/`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching teams with users:", error);
    throw error;
  }
};

// Create a new team
export const createTeam = async (teamData) => {
  try {
    const response = await axios.post(`${BASE_URL}/teams/`, teamData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating team:", error);
    throw error;
  }
};

// Update a team
export const updateTeam = async (teamId, teamData) => {
  try {
    const response = await axios.put(`${BASE_URL}/teams/${teamId}/`, teamData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating team:", error);
    throw error;
  }
};

// Delete a team
export const deleteTeam = async (teamId) => {
  try {
    await axios.delete(`${BASE_URL}/teams/${teamId}/`, {
      headers: getAuthHeader(),
    });
  } catch (error) {
    console.error("Error deleting team:", error);
    throw error;
  }
};


// Assign users to a team
export const assignUsersToTeam = async (teamId, userIds) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/teams/${teamId}/assign-users/`,
      { user_ids: userIds },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Error assigning users to team:", error);
    throw error;
  }
};

//Delete users from a team
export const removeUsersFromTeam = async (teamId, userIds) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/teams/${teamId}/remove-users/`,
      { user_ids: userIds },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing users from team:", error);
    throw error;
  }
};
