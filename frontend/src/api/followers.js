// src/api/followers.js
import axiosClient from "./axiosClient";

// ✅ Follow a user (returns updated counts)
export const followUser = async (userId) => {
  const response = await axiosClient.post(`followers/${userId}/follow/`);
  // Expected backend response: { message, followers_count, following_count }
  return response.data;
};

// 🚫 Unfollow disabled for now (reserved for future)
export const unfollowUser = async () => {
  console.warn("Unfollow feature is disabled for now.");
  return null;
};

// ✅ Get list of followers
export const getFollowers = async (userId) => {
  const response = await axiosClient.get(`followers/${userId}/followers/`);
  return response.data;
};

// ✅ Get list of users the given user is following
export const getFollowing = async (userId) => {
  const response = await axiosClient.get(`followers/${userId}/following/`);
  return response.data;
};

// ✅ Unified follow status fetch
// Always normalize to { is_following, is_followed_by }
export const getFollowStatus = async (targetUserId) => {
  try {
    const response = await axiosClient.get(`followers/${targetUserId}/status/`);
    const data = response.data;
    if (typeof data === "string") {
      return {
        is_following: data === "following" || data === "mutual",
        is_followed_by: data === "follow_back" || data === "mutual",
      };
    }
    if ("status" in data) {
      const st = data.status;
      return {
        is_following: st === "following" || st === "mutual",
        is_followed_by: st === "follow_back" || st === "mutual",
      };
    }
    return {
      is_following: !!data.is_following,
      is_followed_by: !!data.is_followed_by,
    };
  } catch (error) {
    console.error("Failed to fetch follow status:", error);
    return { is_following: false, is_followed_by: false };
  }
};

