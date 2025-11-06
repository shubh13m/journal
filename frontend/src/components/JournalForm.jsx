import React, { useState, useEffect } from "react";
import { createJournal } from "../api/journals";
import { getUsers } from "../api/users";

const JournalForm = ({ onSuccess }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [sharedWith, setSharedWith] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (visibility === "SPECIFIC") {
      getUsers().then(setUsers);
    }
  }, [visibility]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createJournal({
        title,
        content,
        visibility,
        shared_with:
          visibility === "SPECIFIC" ? sharedWith.map(Number) : [],
      });
      setTitle("");
      setContent("");
      setVisibility("PRIVATE");
      setSharedWith([]);
      onSuccess();
    } catch (error) {
      console.error("Error creating journal:", error);
      alert("❌ Failed to create journal.");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white shadow p-6 rounded">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-md p-2"
        />
        <textarea
          placeholder="Write your journal..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border rounded-md p-2 h-28"
        />
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="border rounded-md p-2 w-full"
        >
          <option value="PUBLIC">Public 🌍</option>
          <option value="PRIVATE">Private 🔒</option>
          <option value="SPECIFIC">Specific 👥</option>
          <option value="FRIENDS">Friends 🤝</option>  {/* <-- new */}
        </select>


        {visibility === "SPECIFIC" && (
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Share with specific users:
            </label>
            <select
              multiple
              value={sharedWith}
              onChange={(e) =>
                setSharedWith(
                  Array.from(e.target.selectedOptions, (o) => o.value)
                )
              }
              className="border rounded-md p-2 w-full"
            >
              {users.length > 0 ? (
                users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.username}
                  </option>
                ))
              ) : (
                <option disabled>No users available</option>
              )}
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
        >
          Add Journal
        </button>
      </form>
    </div>
  );
};

export default JournalForm;
