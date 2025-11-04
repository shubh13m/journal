import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, logout } = useAuth();

  return (
    <nav className="flex justify-between p-4 bg-indigo-600 text-white rounded-lg shadow-md">
      <Link to="/" className="font-bold text-xl">
        🪶 JournoSpace
      </Link>

      <div className="space-x-4">
        {token ? (
          <>
            <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-white text-indigo-600 px-3 py-1 rounded">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
