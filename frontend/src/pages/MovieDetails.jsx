import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState({});

  useEffect(() => {
    const fetchMovieAndRelated = async () => {
      try {
        setLoading(true);
        const movieRes = await fetch(`http://localhost:8000/movie/${id}`);
        const movieData = await movieRes.json();
        setMovie(movieData);

        const relatedRes = await fetch(
          `http://localhost:8000/recommend/similar/ai?movie_id=${id}&top_n=5`
        );
        const relatedData = await relatedRes.json();
        setRelated(relatedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieAndRelated();
  }, [id]);

  const toggleExplanation = (movieId) => {
    setShowExplanation((prev) => ({
      ...prev,
      [movieId]: !prev[movieId],
    }));
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-500 text-lg">
          Loading movie details...
        </span>
      </div>
    );

  if (!movie)
    return <p className="p-8 text-center text-gray-500">Movie not found</p>;

  let genres = [];
  try {
    genres = JSON.parse(movie.genres).map((g) => g.name);
  } catch {}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-10 rounded-b-3xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {movie.poster_url && (
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-40 md:w-52 rounded-xl shadow-md"
            />
          )}

          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
              {movie.title}
            </h1>
            {movie.overview && (
              <p className="text-lg md:text-xl drop-shadow-sm max-w-3xl">
                {movie.overview}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-3 text-sm md:text-base">
              <span className="bg-white text-gray-800 px-3 py-1 rounded-full font-medium shadow-sm">
                ⭐ {movie.vote_average}
              </span>
              <span className="bg-white text-gray-800 px-3 py-1 rounded-full font-medium shadow-sm">
                🗓 {movie.year}
              </span>
              {genres.map((g) => (
                <span
                  key={g}
                  className="bg-gradient-to-r from-purple-200 to-pink-200 text-purple-800 px-3 py-1 rounded-full font-medium shadow-sm"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
      <div className="px-8 py-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
          Similar Movies
        </h2>

        {related.length === 0 ? (
          <p className="text-gray-500">No similar movies found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((rel) => {
              let relGenres = [];
              try {
                relGenres = JSON.parse(rel.genres).map((g) => g.name);
              } catch {}

              return (
                <div
                  key={rel.id}
                  className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transform hover:scale-105 transition duration-300"
                >
                  <div
                    className="cursor-pointer"
                    onClick={() => navigate(`/movie/${rel.id}`)}
                  >
                    {rel.poster_url && (
                      <img
                        src={rel.poster_url}
                        alt={rel.title}
                        className="w-full h-64 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      {rel.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {relGenres.map((g) => (
                        <span
                          key={g}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm mb-1">
                      ⭐ <span className="font-medium">{rel.vote_average}</span>
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      🗓 <span className="font-medium">{rel.year}</span>
                    </p>
                  </div>

                  {/* AI Explanation Toggle */}
                  {rel.similarity_explanation && (
                    <>
                      <button
                        onClick={() => toggleExplanation(rel.id)}
                        className="mt-2 w-full px-3 py-2 bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-full text-sm hover:from-indigo-500 hover:to-purple-500 transition font-semibold"
                      >
                        {showExplanation[rel.id]
                          ? "Hide explanation"
                          : "Why similar?"}
                      </button>

                      {showExplanation[rel.id] && (
                        <div className="mt-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-400 rounded-lg text-gray-800">
                          <p className="italic">{rel.similarity_explanation}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
