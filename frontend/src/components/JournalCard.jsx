import FollowButton from "./FollowButton";
import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from "react";
import { getFollowers } from "../api/followers";

const JournalCard = ({ journal }) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollowing = async () => {
      if (user && journal.author) {
        const followers = await getFollowers(journal.author.id);
        setIsFollowing(followers.some(f => f.follower === user.username));
      }
    };
    checkFollowing();
  }, [journal.author, user]);

  return (
    <div className="w-full border rounded-lg p-4 bg-gray-100 hover:bg-gray-200 transition">
      <h4 className="font-bold text-lg text-gray-800">{journal.title}</h4>
      <p className="text-gray-600 mt-2">{journal.content}</p>
      <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          {journal.visibility === "SPECIFIC" && <span>👥 Shared</span>}
          {journal.visibility === "PRIVATE" && <span>🔒 Private</span>}
          {journal.visibility === "PUBLIC" && <span>🌍 Public</span>}
          <span>— by {journal.author?.username || "Unknown"}</span>
        </div>
        {user && user.username !== journal.author?.username && (
          <FollowButton
            userId={journal.author.id}
            isFollowing={isFollowing}
            onToggle={() => setIsFollowing(!isFollowing)}
          />
        )}
      </div>
    </div>
  );
};

export default JournalCard;
