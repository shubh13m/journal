// src/api/userProfile.js
import axiosClient from "./axiosClient";

// ✅ Fetch a user's profile by username
export const getUserProfile = async (username) => {
  try {
    const response = await axiosClient.get(`users/profile/${username}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// ✅ Update logged-in user's profile (bio, avatar, etc.)
export const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosClient.patch("users/profile/update/", profileData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
