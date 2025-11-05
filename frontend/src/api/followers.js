import axiosClient from "./axiosClient";

// Follow a user
export const followUser = async (userId) => {
  const response = await axiosClient.post(`followers/${userId}/follow/`);
  return response.data;
};

// Unfollow a user
export const unfollowUser = async (userId) => {
  const response = await axiosClient.post(`followers/${userId}/unfollow/`);
  return response.data;
};

// Get user's followers
export const getFollowers = async (userId) => {
  const response = await axiosClient.get(`followers/${userId}/followers/`);
  return response.data;
};

// Get user's following
export const getFollowing = async (userId) => {
  const response = await axiosClient.get(`followers/${userId}/following/`);
  return response.data;
};
