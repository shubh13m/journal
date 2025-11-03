import React, { useState, useEffect } from "react";
import Login from "./Login";

function App() {
  const [token, setToken] = useState(localStorage.getItem("access") || null);
  const [journals, setJournals] = useState([]);
  const [users, setUsers] = useState([]);
  const [sharedWith, setSharedWith] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState("PRIVATE");
  const [successMessage, setSuccessMessage] = useState("");

  // 🧩 Fetch Journals
  const fetchJournals = async () => {
    const url = token
      ? "http://localhost:8000/api/journals/"
      : "http://localhost:8000/api/journals/";

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error(`Failed to fetch journals: ${res.status}`);
      const data = await res.json();
      setJournals(data);
    } catch (err) {
      console.error("Error fetching journals:", err);
    }
  };

  // 🧩 Fetch Users (only when logged in)
  const fetchUsers = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:8000/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // 🔹 When token changes (login/logout), reload data
  useEffect(() => {
    console.log("Token in App:", token);
    if (token) {
      fetchJournals();
      fetchUsers();
    } else {
      fetchJournals(); // only public
    }
  }, [token]);

  // 🔹 Handle logout
  const handleLogout = () => {
    localStorage.removeItem("access");
    setToken(null);
    setJournals([]);
  };

  // 🔹 Handle journal creation
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to create a journal!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/journals/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          visibility: visibility.toUpperCase(),
          shared_with: visibility === "SPECIFIC" ? sharedWith.map(Number) : [],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Error:", err);
        alert("❌ Failed to add journal.");
        return;
      }

      setSuccessMessage("🎉 Journal added successfully!");
      setTitle("");
      setContent("");
      setVisibility("PRIVATE");
      fetchJournals();

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Request error:", err);
      alert("⚠️ Could not reach the server.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600">
          🪶 JournoSpace
        </h1>

        {!token ? (
          <>
            <p className="text-center text-gray-600">
              Login to create journals. Public ones appear below 👇
            </p>
            <Login
              onLogin={(newToken) => {
                localStorage.setItem("access", newToken);
                setToken(newToken);
              }}
            />
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Logged in</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>

            {successMessage && (
              <div className="bg-green-100 text-green-800 px-3 py-2 rounded-md text-center">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-3">
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
                className="border rounded-md p-2"
              >
                <option value="PRIVATE">Private</option>
                <option value="PUBLIC">Public</option>
                <option value="SPECIFIC">Specific</option>
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
                      setSharedWith([...e.target.selectedOptions].map((o) => o.value))
                    }
                    className="border rounded-md p-2 w-full"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
              >
                Add Journal
              </button>
            </form>
          </>
        )}

        <h3 className="text-xl font-semibold">
          {token ? "Your Feed" : "Public Journals"}
        </h3>

        <div className="grid gap-4">
          {journals.length === 0 ? (
            <p className="text-gray-500">No journals yet.</p>
          ) : (
            journals.map((j) => (
              <div
                key={j.id}
                className="border rounded-lg p-4 bg-gray-100 hover:bg-gray-200 transition"
              >
                <h4 className="font-bold text-lg text-gray-800">{j.title}</h4>
                <p className="text-gray-600 mt-2">{j.content}</p>
                <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                  {j.visibility === "SPECIFIC" && <span>👥 Shared</span>}
                  {j.visibility === "PRIVATE" && <span>🔒 Private</span>}
                  {j.visibility === "PUBLIC" && <span>🌍 Public</span>}
                  <span>— by {j.author_name}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
