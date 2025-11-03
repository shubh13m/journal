import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });

      const { access, refresh } = res.data;

      // ✅ Correctly store tokens
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      console.log("✅ Token saved:", access.slice(0, 20) + "...");

      onLogin(access); // notify parent App.jsx
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError("Invalid credentials or server issue");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 className="text-lg font-semibold mb-2">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 w-full rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded-md"
        />
        <button
          type="submit"
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 w-full"
        >
          Login
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}

export default Login;
