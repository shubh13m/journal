import React, { useState } from "react";
import { followUser, unfollowUser } from "../api/followers";

const FollowButton = ({ userId, isFollowing, onToggle }) => {
  const [loading, setLoading] = useState(false);

  const handleFollowToggle = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(userId);
      } else {
        await followUser(userId);
      }
      onToggle && onToggle(); // refresh parent
    } catch (error) {
      console.error("Follow toggle error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollowToggle}
      disabled={loading}
      className={`px-4 py-1 rounded-full text-sm ${
        isFollowing
          ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
          : "bg-indigo-500 text-white hover:bg-indigo-600"
      }`}
    >
      {loading ? "..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
