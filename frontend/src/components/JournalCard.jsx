import FollowButton from "./FollowButton";
import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from "react";
import { getFollowStatus } from "../api/followers";

const JournalCard = ({ journal }) => {
  const { user } = useAuth();
  const [followStatus, setFollowStatus] = useState(null);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      console.log(
        "🧩 ID check → user.id:", user?.id, typeof user?.id,
        "| author.id:", journal.author?.id, typeof journal.author?.id
      );
      if (!user || !journal.author) {
        setFollowStatus(null);
        return;
      }

      try {
        const data = await getFollowStatus(journal.author.id);
        if (data && typeof data === "object" && ("is_following" in data || "is_followed_by" in data)) {
          setFollowStatus({
            is_following: !!data.is_following,
            is_followed_by: !!data.is_followed_by,
          });
        } else if (data && typeof data === "object" && "status" in data) {
          const st = data.status;
          setFollowStatus({
            is_following: st === "following" || st === "mutual",
            is_followed_by: st === "follow_back" || st === "mutual",
          });
        } else {
          setFollowStatus({ is_following: false, is_followed_by: false });
        }
      } catch (err) {
        setFollowStatus({ is_following: false, is_followed_by: false });
      }
    };

    fetchFollowStatus();
  }, [user, journal.author]);

  const showFollowButton =
    user &&
    journal.author &&
    followStatus &&
    user.id !== journal.author.id &&
    !followStatus.is_following;

  const handleFollowToggle = (newState) => {
    setFollowStatus((prev) => ({ ...prev, is_following: newState === "following" }));
  };

  return (
    <div className="w-full border rounded-lg p-4 bg-gray-100 hover:bg-gray-200 transition">
      <h4 className="font-bold text-lg text-gray-800">{journal.title}</h4>
      <p className="text-gray-600 mt-2">{journal.content}</p>

      <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          {journal.visibility === "SPECIFIC" && <span>👥 Shared</span>}
          {journal.visibility === "PRIVATE" && <span>🔒 Private</span>}
          {journal.visibility === "PUBLIC" && <span>🌍 Public</span>}
          {journal.visibility === "FRIENDS" && <span>🤝 Friends Only</span>}
          <span>— by {journal.author?.username || "Unknown"}</span>
        </div>
          {user &&
            journal.author &&
            followStatus &&
            user.id !== journal.author.id && // 👈 show only for *other users*
            !followStatus.is_following && ( // 👈 hide if already following
            <FollowButton
              userId={journal.author.id}
              initialState={followStatus.is_followed_by ? "follow_back" : "follow"}
              onToggle={handleFollowToggle}
            />
          )}
      </div>
    </div>
  );
};

export default JournalCard;
