import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [emailVisible, setEmailVisible] = useState(false);
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);
  const { user, logout } = useAuth();

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !avatarRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
        setEmailVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 💡 Minimal navbar before login
  if (!user) {
    return (
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-md flex justify-center items-center">
        <h1 className="font-bold text-2xl tracking-wide">
          🎬 TMDb Movie Recommender
        </h1>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 shadow-md flex flex-wrap justify-between items-center">
      <h1 className="font-bold text-2xl tracking-wide">
        🎬 TMDb Movie Recommender
      </h1>

      <div className="flex flex-wrap items-center space-x-6 mt-2 sm:mt-0">
        <Link to="/" className="hover:text-yellow-300 transition duration-200">
          Home
        </Link>
        <Link
          to="/popular"
          className="hover:text-yellow-300 transition duration-200"
        >
          Trending
        </Link>
        <Link
          to="/form"
          className="hover:text-yellow-300 transition duration-200"
        >
          Filters
        </Link>
        <Link
          to="/keyword-search"
          className="hover:text-yellow-300 transition duration-200"
        >
          Search
        </Link>

        {/* More Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((open) => !open)}
            className="flex items-center px-4 py-2 hover:text-yellow-300 focus:outline-none"
          >
            More
            <svg
              className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : "rotate-0"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-xl z-50 animate-fade-in">
              <Link
                to="/watchlist"
                className="block px-4 py-2 hover:bg-indigo-600 hover:text-white"
                onClick={() => setDropdownOpen(false)}
              >
                Watchlist
              </Link>
              <Link
                to="/liked"
                className="block px-4 py-2 hover:bg-indigo-600 hover:text-white"
                onClick={() => setDropdownOpen(false)}
              >
                Liked Movies
              </Link>
              <Link
                to="/disliked"
                className="block px-4 py-2 hover:bg-indigo-600 hover:text-white"
                onClick={() => setDropdownOpen(false)}
              >
                Disliked Movies
              </Link>
              <Link
                to="/recommendations"
                className="block px-4 py-2 hover:bg-indigo-600 hover:text-white"
                onClick={() => setDropdownOpen(false)}
              >
                For You
              </Link>
            </div>
          )}
        </div>

        {/* Profile Avatar + Dropdown */}
        <div className="relative" ref={avatarRef}>
          <button
            onClick={() => setEmailVisible((visible) => !visible)}
            className="w-10 h-10 bg-yellow-400 text-gray-800 flex items-center justify-center rounded-full font-bold uppercase focus:outline-none hover:ring-2 hover:ring-yellow-300 transition"
            title="User Profile"
          >
            {user.name?.[0]}
          </button>

          {emailVisible && (
            <div className="absolute right-0 mt-2 bg-white text-gray-800 text-sm rounded-md shadow-lg px-4 py-2 z-50 animate-fade-in w-56">
              <div className="font-semibold mb-1">{user.name}</div>
              <div className="text-gray-600">{user.email}</div>
              <hr className="my-2" />
              <button
                onClick={logout}
                className="w-full text-left text-red-600 hover:underline"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
