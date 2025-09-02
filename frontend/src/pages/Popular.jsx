import React, { useEffect, useState } from "react";

export default function PopularByGenre() {
  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState("Action");
  const [genres, setGenres] = useState([]);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch available genres
  useEffect(() => {
    fetch("http://127.0.0.1:8000/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch popular movies for the selected genre
  useEffect(() => {
    if (!genre) return;

    setLoading(true);
    fetch(
      `http://127.0.0.1:8000/recommend/popular?top_n=10&genre=${genre}&ai=${aiEnabled}`
    )
      .then((res) => res.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [genre, aiEnabled]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Popular Movies by Genre
      </h1>
      <p className="text-gray-600 mb-6 max-w-2xl">
        Explore the most popular movies in your favorite genres. Toggle AI
        explanations to see why each movie is particularly loved in its genre.
      </p>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="p-2 border rounded-md"
        >
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            checked={aiEnabled}
            onChange={(e) => setAiEnabled(e.target.checked)}
            className="accent-blue-500"
          />
          Show AI explanations
        </label>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-500">
            Fetching AI explanations...
          </span>
        </div>
      )}

      {/* Movies Grid */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => {
            let movieGenres = [];
            try {
              movieGenres = JSON.parse(movie.genres).map((g) => g.name);
            } catch {
              movieGenres = [];
            }

            return (
              <div
                key={movie.id}
                className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition duration-200 cursor-pointer"
              >
                {/* Poster */}
                {movie.poster_url && (
                  <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {movie.title}
                </h2>

                {/* Rating & Year */}
                <p className="text-gray-600 mb-2">
                  ⭐ <span className="font-semibold">{movie.vote_average}</span>{" "}
                  | Year: <span className="font-semibold">{movie.year}</span>
                </p>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {movieGenres.map((g) => (
                    <span
                      key={g}
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                {/* Overview */}
                {movie.overview && (
                  <p className="text-gray-700 text-sm mb-3 line-clamp-4">
                    {movie.overview}
                  </p>
                )}

                {/* AI Explanation */}
                {aiEnabled && movie.ai_explanation && (
                  <div className="mt-3 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-md text-gray-800 italic text-sm">
                    <strong>Why popular:</strong> {movie.ai_explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No movies found for {genre}</p>
      )}
    </div>
  );
}
