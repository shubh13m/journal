// src/components/Layout.jsx
import React from "react";

const Layout = ({ children, center = false }) => {
  /**
   * center = true → center content vertically & horizontally (for login/signup)
   * center = false → horizontally centered with padding (for normal pages)
   */
  return (
    <div
      className={`min-h-screen bg-gray-50 flex justify-center ${
        center ? "items-center" : "py-6 px-4"
      }`}
    >
      {children}
    </div>
  );
};

export default Layout;
