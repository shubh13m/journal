import React, { useEffect, useState } from "react";
import { getJournals } from "../api/journals";
import { getCurrentUser } from "../api/users";
import JournalCard from "../components/JournalCard";
import JournalForm from "../components/JournalForm";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

const Home = () => {
  const [journals, setJournals] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getJournals();
        setJournals(data);

        if (token) {
          const userData = await getCurrentUser();
          setCurrentUser(userData);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error loading journals or user:", error);
      }
    };
    loadData();
  }, [token]);

  // Optimistic removal of FRIENDS journals if user unfollows
  const handleUnfollow = (userId) => {
    setJournals((prev) =>
      prev.filter((j) => j.author.id !== userId || j.visibility !== "FRIENDS")
    );
  };

  return (
    <Layout>
      <div className="w-full max-w-3xl mx-auto bg-white shadow p-6 rounded space-y-6">
        {/* Current user info */}
        {currentUser && (
          <div className="p-4 bg-gray-200 rounded-lg text-center">
            <span className="font-bold">{currentUser.username}</span>
            <span className="ml-4">Followers: {currentUser.followers_count}</span>
            <span className="ml-2">Following: {currentUser.following_count}</span>
          </div>
        )}

        {/* Journal form */}
        {token && (
          <JournalForm
            onSuccess={() => getJournals().then(setJournals).catch(console.error)}
          />
        )}

        {/* Journal list */}
        <div className="grid grid-cols-1 gap-4">
          {journals.length === 0 ? (
            <p className="text-gray-500 text-center">No journals yet.</p>
          ) : (
            journals.map((j) => (
              <JournalCard key={j.id} journal={j} onUnfollow={handleUnfollow} />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
