import React, { useState } from "react";

export default function MovieCard({ movie, userId = "hjindal", onAction }) {
  const [rating, setRating] = useState(0);

  let genres = [];
  try {
    if (typeof movie.genres === "string") {
      genres = JSON.parse(movie.genres).map((g) => g.name);
    }
  } catch (e) {
    genres = [];
  }

  const handleAction = async (movieId, action, extra = {}) => {
    if (!userId || !movieId) {
      console.warn("❌ Missing userId or movieId", { userId, movieId, action });
      alert("Missing user or movie info. Please try again.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/user/${userId}/${action}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ movie_id: movieId, ...extra }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed: ${response.status} - ${errorText}`);
      }

      alert(`Movie ${action}d!`);
      onAction?.();
    } catch (err) {
      console.error("Action failed:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition duration-200 flex flex-col">
      {/* Poster Image */}
      {movie.poster_url && (
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}

      {/* Movie Title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        {movie.title}
      </h2>

      {/* Genre */}
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Genres:</span>{" "}
        {genres.length > 0 ? genres.join(" | ") : "N/A"}
      </p>

      {/* Rating and Year */}
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Rating:</span> {movie.vote_average}
      </p>
      <p className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Year:</span> {movie.year}
      </p>

      {/* Overview */}
      <p className="text-xs text-gray-500 line-clamp-3 flex-grow">
        {movie.overview || "No description available"}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => handleAction(movie.id, "like")}
          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
        >
          ❤️ Like
        </button>
        <button
          onClick={() => handleAction(movie.id, "dislike")}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
        >
          👎 Dislike
        </button>
        <button
          onClick={() => handleAction(movie.id, "watchlist")}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
        >
          📌 Watch Later
        </button>
      </div>

      {/* Rating Stars */}
      <div className="flex items-center space-x-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => {
              setRating(star);
              handleAction(movie.id, "rate", { rating: star });
            }}
            className={`text-xl ${
              rating >= star ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
}
