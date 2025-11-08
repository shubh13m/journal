import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getFollowStatus } from "../api/followers";
import FollowButton from "./FollowButton";

const JournalCard = ({ journal }) => {
  const { user } = useAuth();
  const [followStatus, setFollowStatus] = useState(null);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!user || !journal.author) {
        setFollowStatus(null);
        return;
      }

      try {
        const data = await getFollowStatus(journal.author.id);
        if (data && typeof data === "object") {
          if ("is_following" in data || "is_followed_by" in data) {
            setFollowStatus({
              is_following: !!data.is_following,
              is_followed_by: !!data.is_followed_by,
            });
          } else if ("status" in data) {
            const st = data.status;
            setFollowStatus({
              is_following: st === "following" || st === "mutual",
              is_followed_by: st === "follow_back" || st === "mutual",
            });
          } else {
            setFollowStatus({ is_following: false, is_followed_by: false });
          }
        } else {
          setFollowStatus({ is_following: false, is_followed_by: false });
        }
      } catch {
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
    setFollowStatus((prev) => ({
      ...prev,
      is_following: newState === "following",
    }));
  };

  // ✅ Get first letter for default avatar
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  return (
    <div className="w-full border rounded-lg p-4 bg-gray-100 hover:bg-gray-200 transition">
      {/* Title */}
      <h4 className="font-bold text-lg text-gray-800">{journal.title}</h4>
      <p className="text-gray-600 mt-2">{journal.content}</p>

      {/* Author & visibility */}
      <div className="mt-3 text-sm text-gray-500 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          {/* ✅ Avatar — first character only */}
          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
            {getInitial(journal.author?.username)}
          </div>

          {/* Username */}
          {journal.author?.username ? (
            <Link
              to={`/profile/${journal.author.username}`}
              className="font-medium text-blue-600 hover:underline"
            >
              {journal.author.username}
            </Link>
          ) : (
            <span>Unknown</span>
          )}

          {/* Visibility Icons */}
          {journal.visibility === "SPECIFIC" && <span>👥 Shared</span>}
          {journal.visibility === "PRIVATE" && <span>🔒 Private</span>}
          {journal.visibility === "PUBLIC" && <span>🌍 Public</span>}
          {journal.visibility === "FRIENDS" && <span>🤝 Friends</span>}
        </div>

        {/* Follow Button */}
        {showFollowButton && (
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
