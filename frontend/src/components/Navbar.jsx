import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (user?.username) {
      navigate(`/profile/${user.username}`);
    } else {
      navigate("/profile/me"); // ✅ fallback route for current user
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-indigo-600 text-white rounded-lg shadow-md">
      {/* Logo */}
      <Link to="/" className="font-bold text-xl hover:text-gray-200">
        🪶 JournoSpace
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {token && user ? (
          <>
            {/* ✅ My Profile (linked to self profile) */}
            <button
              onClick={handleProfileClick}
              className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-gray-100"
            >
              My Profile
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-gray-100"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
