import axios from "axios";

const API_URL = "http://localhost:8000/api"; //Django backend

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/token/`, { email, password });
  localStorage.setItem("access", response.data.access);
  localStorage.setItem("refresh", response.data.refresh);
};

export const signup = async (userData) => {
  const response = await axios.post(`${API_URL}/register/`, userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};
