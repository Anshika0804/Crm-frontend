import axios from "axios";

export const fetchTeams = async () => {
  const response = await axios.get("/api/team/list/");
  return response.data;
};
