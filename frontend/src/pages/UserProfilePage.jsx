import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../api/userProfile";
import { getJournalsByAuthor } from "../api/journals"; // new journaling API call
import toast from "react-hot-toast";
import JournalCard from "../components/JournalCard"; 

const UserProfilePage = () => {
  const { username } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedBio, setUpdatedBio] = useState("");
  const [loading, setLoading] = useState(true);

  const [journals, setJournals] = useState([]);
  const [journalsLoading, setJournalsLoading] = useState(true);
  const [journalsError, setJournalsError] = useState(null);

  // Fetch user profile on mount or when username changes
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserProfile(username);
        setProfile(data);
        setUpdatedBio(data?.bio || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  // Fetch journals by author with visibility filtering
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setJournalsLoading(true);
        setJournalsError(null);
        const data = await getJournalsByAuthor(username);
        setJournals(data);
      } catch (error) {
        console.error("Error fetching journals:", error);
        setJournalsError("Failed to load journals.");
      } finally {
        setJournalsLoading(false);
      }
    };

    fetchJournals();
  }, [username]);

  // Determine if viewing own profile
  useEffect(() => {
    if (user && profile) {
      setIsOwnProfile(user.username === profile.username);
    }
  }, [user, profile]);

  // Save bio changes
  const handleSave = async () => {
    try {
      await updateUserProfile({ bio: updatedBio });
      setProfile((prev) => ({ ...prev, bio: updatedBio }));
      setIsEditing(false);
      toast.success("Profile updated successfully ✅");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  // Loading or error states for profile
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Profile not found.</p>
      </div>
    );
  }

  const avatarChar =
    profile.username && profile.username.length > 0
      ? profile.username.charAt(0).toUpperCase()
      : "?";

  return (
    <div className="bg-white rounded-xl shadow-md p-6 text-center">
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <div className="bg-indigo-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold">
          {avatarChar}
        </div>
      </div>

      {/* Username */}
      <h2 className="text-2xl font-semibold mb-2">@{profile.username}</h2>

      {/* Follower / Following */}
      <div className="flex justify-center gap-6 text-gray-700 mb-4">
        <div>
          <span className="font-semibold">{profile.followers_count ?? 0}</span>{" "}
          Followers
        </div>
        <div>
          <span className="font-semibold">{profile.following_count ?? 0}</span>{" "}
          Following
        </div>
      </div>

      {/* Bio Section */}
      {isOwnProfile ? (
        <div>
          {isEditing ? (
            <div>
              <textarea
                value={updatedBio}
                onChange={(e) => setUpdatedBio(e.target.value)}
                className="border border-gray-300 p-2 rounded w-full mb-2"
                rows="3"
                placeholder="Write something about yourself..."
              />
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="ml-2 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-3">
                {profile.bio || "No bio added yet."}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      ) : (
        <p className="text-gray-700">{profile.bio || "No bio available."}</p>
      )}

      {/* Journals Section */}
      <div className="mt-6 border-t pt-4">
        <h3 className="text-lg font-semibold mb-3 text-left">Journals</h3>
        {journalsLoading ? (
          <p>Loading journals...</p>
        ) : journalsError ? (
          <p className="text-red-500">{journalsError}</p>
        ) : journals.length > 0 ? (
              journals.map((journal) => (
                <div key={journal.id} className="mb-4">
                  <JournalCard journal={journal} />
                </div>
          ))
        ) : (
          <p className="text-gray-500 text-left">No journals yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
