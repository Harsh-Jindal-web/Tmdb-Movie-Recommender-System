import React, { useEffect, useState } from "react";

export default function DislikedMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDisliked() {
      try {
        const res = await fetch("http://127.0.0.1:8000/user/profile");
        const profile = await res.json();

        if (profile.dislikes && profile.dislikes.length > 0) {
          const ids = profile.dislikes.join(",");
          const moviesRes = await fetch(
            `http://127.0.0.1:8000/movies/by_ids?ids=${ids}`
          );
          const data = await moviesRes.json();
          setMovies(data);
        }
      } catch (err) {
        console.error("Error fetching disliked movies:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDisliked();
  }, []);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        Your Disliked Movies
      </h1>
      <p className="text-gray-600 mb-6 max-w-2xl">
        These are movies you've marked as disliked. Reviewing them can help
        refine your future recommendations or revisit past impressions.
      </p>

      {loading ? (
        <div className="flex items-center justify-center mt-20">
          <div className="w-12 h-12 border-4 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
          <span className="ml-4 text-gray-700 font-medium">
            Loading your disliked movies...
          </span>
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transform hover:scale-105 transition duration-300"
              >
                {/* Poster */}
                {movie.poster_url ? (
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-72 object-cover"
                  />
                ) : (
                  <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    No poster available
                  </div>
                )}

                {/* Movie Info */}
                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {movie.title}
                  </h2>

                  <p className="text-gray-600 mb-2">
                    ⭐{" "}
                    <span className="font-semibold">{movie.vote_average}</span>{" "}
                    | Year:{" "}
                    <span className="font-semibold">{movie.year || "N/A"}</span>
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {genres.map((g) => (
                      <span
                        key={g}
                        className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">You haven't disliked any movies yet.</p>
      )}
    </div>
  );
}
