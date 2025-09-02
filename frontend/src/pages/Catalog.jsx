import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Catalog() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/catalog?size=20")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Movie Catalog</h2>

      {/* Loader */}
      {loading && (
        <div className="flex items-center justify-center mb-4">
          <div className="w-10 h-10 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-500">Loading movies...</span>
        </div>
      )}

      {/* Movies Grid */}
      {!loading && movies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => {
            let genres = [];
            try {
              if (typeof movie.genres === "string") {
                genres = JSON.parse(movie.genres).map((g) => g.name);
              }
            } catch {}

            return (
              <div
                key={movie.id}
                onClick={() => navigate(`/movie/${movie.id}`)}
                className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transform hover:scale-105 transition duration-300 cursor-pointer"
              >
                {/* Poster Image */}
                <img
                  src={
                    movie.poster_url ||
                    "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={movie.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />

                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {movie.title}
                </h2>

                <div className="flex flex-wrap gap-2 mb-2">
                  {genres.map((g) => (
                    <span
                      key={g}
                      className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 text-sm mb-1">
                  ⭐ <span className="font-medium">{movie.vote_average}</span>
                </p>
                <p className="text-gray-600 text-sm">
                  🗓 <span className="font-medium">{movie.year || "N/A"}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* No movies found */}
      {!loading && movies.length === 0 && (
        <p className="text-gray-500">No movies found in the catalog.</p>
      )}
    </div>
  );
}
