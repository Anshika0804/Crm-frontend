import axios from "axios";

const BASE_URL = "http://localhost:8000/api/leads";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json";
  return config;
});

// Fetch all campaigns
export const fetchCampaigns = async () => {
  try {
    const response = await api.get("/campaigns/");
    return response.data;
  } catch (error) {
    console.error("Error fetching campaigns:", error.response?.data || error);
    throw error;
  }
};

// Create a new campaign
export const createCampaign = async (campaignData) => {
  try {
    const response = await api.post("/campaigns/", campaignData);
    return response.data;
  } catch (error) {
    console.error("Error creating campaign:", error.response?.data || error);
    throw error;
  }
};

// Update a campaign by id
export const updateCampaign = async (campaignId, campaignData) => {
  try {
    const response = await api.put(`/campaigns/${campaignId}/`, campaignData);
    return response.data;
  } catch (error) {
    console.error("Error updating campaign:", error.response?.data || error);
    throw error;
  }
};

// Delete a campaign by id
export const deleteCampaign = async (campaignId) => {
  try {
    await api.delete(`/campaigns/${campaignId}/`);
  } catch (error) {
    console.error("Error deleting campaign:", error.response?.data || error);
    throw error;
  }
};
