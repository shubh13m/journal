import axiosClient from "./axiosClient";

// Get all users (used in JournalForm for SPECIFIC sharing)
export const getUsers = async () => {
  try {
    const response = await axiosClient.get("users/");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Get the currently logged-in user (used in Home.jsx)
export const getCurrentUser = async () => {
  try {
    const response = await axiosClient.get("users/me/");
    return response.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};
