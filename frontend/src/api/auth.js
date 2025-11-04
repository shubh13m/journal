// src/api/auth.js
import axios from "./axiosClient";

export const loginUser = async (username, password) => {
  const response = await axios.post("/token/", { username, password });
  return response.data;
};
