import React, { useEffect, useState } from "react";
import { getJournals } from "../api/journals";
import JournalCard from "../components/JournalCard";
import JournalForm from "../components/JournalForm";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [journals, setJournals] = useState([]);
  const { token } = useAuth(); // ✅ get login state

  const loadJournals = async () => {
    const data = await getJournals();
    setJournals(data);
  };

  useEffect(() => {
    loadJournals();
  }, [token]); // ✅ reload journals when login state changes

  return (
    <div className="space-y-6">
      {/* ✅ Only show form if logged in */}
      {token ? (
        <JournalForm onSuccess={loadJournals} />
      ) : (
        <p className="text-center text-gray-600">
          Login to create journals. Public journals are visible below 👇
        </p>
      )}

      <div className="grid gap-4">
        {journals.length === 0 ? (
          <p className="text-gray-500 text-center">No journals yet.</p>
        ) : (
          journals.map((j) => <JournalCard key={j.id} journal={j} />)
        )}
      </div>
    </div>
  );
};

export default Home;
