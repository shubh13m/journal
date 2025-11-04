// src/api/users.js
import axiosClient from "./axiosClient";

export const getUsers = async () => {
  try {
    const response = await axiosClient.get("users/");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
