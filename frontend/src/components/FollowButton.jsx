import React, { useState, useEffect } from "react";
import { followUser, getFollowStatus } from "../api/followers";

/**
 * FollowButton Component
 *
 * Props:
 * - userId: target user to follow
 * - initialState (optional): "following" | "follow_back" | "not_following"
 * - onToggle: callback(newState, counts)
 */
const FollowButton = ({ userId, initialState = null, onToggle }) => {
  const [state, setState] = useState(initialState || "loading");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!userId || initialState) return;
      try {
        const data = await getFollowStatus(userId);
        if (data.is_following) setState("following");
        else if (data.is_followed_by) setState("follow_back");
        else setState("not_following");
      } catch {
        setState("not_following");
      }
    };
    fetchStatus();
  }, [userId, initialState]);

  const handleFollow = async () => {
    if (loading || state === "following" || state === "loading") return;
    setLoading(true);
    try {
      const res = await followUser(userId);
      const newState = "following";
      setState(newState);
      const counts = {
        followers: res?.followers_count ?? null,
        following: res?.following_count ?? null,
      };
      onToggle?.(newState, counts);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (loading) return "...";
    if (state === "loading") return "Loading...";
    if (state === "follow_back") return "Follow Back";
    if (state === "following") return "Following";
    return "Follow";
  };

  const getButtonStyle = () => {
    if (state === "loading") return "bg-gray-200 text-gray-500";
    switch (state) {
      case "follow_back":
        return "bg-green-500 text-white hover:bg-green-600";
      case "following":
        return "bg-gray-300 text-gray-700 cursor-default";
      default:
        return "bg-indigo-500 text-white hover:bg-indigo-600";
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading || state === "loading" || state === "following"}
      className={`px-4 py-1 rounded-full text-sm transition ${getButtonStyle()}`}
    >
      {getButtonText()}
    </button>
  );
};

export default FollowButton;
