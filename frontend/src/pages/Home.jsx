import React from "react";
import Catalog from "./Catalog";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center py-16 bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          Welcome to Movie Recommender
        </h1>
        <p className="text-lg mb-6 drop-shadow-sm">
          Explore movies by popularity, catalog, or your own filters.
        </p>
      </div>

      <div className="px-8 py-10">
        <Catalog />
      </div>
    </div>
  );
}
