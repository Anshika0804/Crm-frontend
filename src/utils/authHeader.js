// src/utils/authHeader.js
const authHeader = () => {
  const token = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export default authHeader;
