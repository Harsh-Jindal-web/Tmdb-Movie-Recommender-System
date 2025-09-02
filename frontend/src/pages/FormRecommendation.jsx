import React, { useState, useEffect } from "react";
import MovieGrid from "../components/MovieGrid";

export default function FormRecommendation() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [form, setForm] = useState({
    min_rating: 0,
    genre: "Action",
    year_from: 1900,
    year_to: new Date().getFullYear(),
    budget_min: 0,
    budget_max: 1e12,
  });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/catalog?size=20")
      .then((res) => res.json())
      .then((data) => {
        const genreSet = new Set();
        data.forEach((movie) => {
          try {
            const g = JSON.parse(movie.genres).map((x) => x.name);
            g.forEach((genre) => genreSet.add(genre));
          } catch {}
        });
        setGenres(Array.from(genreSet).sort());
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://127.0.0.1:8000/recommend/by_form_v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMovies(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-3xl p-8 shadow-lg text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
          Movie Recommendations
        </h1>
        <p className="text-lg md:text-xl drop-shadow-sm max-w-3xl mx-auto">
          Filter movies by rating, genre, release year, or budget to discover
          your next favorite film!
        </p>
      </div>

      {/* Filter Form */}
      <form
        className="bg-white rounded-xl shadow-md p-6 mb-8 space-y-6"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-medium mb-1">Minimum Rating</label>
            <input
              type="number"
              step="0.1"
              name="min_rating"
              value={form.min_rating}
              onChange={handleChange}
              placeholder="e.g., 7.5"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Genre</label>
            <select
              name="genre"
              value={form.genre}
              onChange={handleChange}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="">-- Select Genre --</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Year From</label>
            <input
              type="number"
              name="year_from"
              value={form.year_from}
              onChange={handleChange}
              placeholder="e.g., 2000"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Year To</label>
            <input
              type="number"
              name="year_to"
              value={form.year_to}
              onChange={handleChange}
              placeholder="e.g., 2023"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Minimum Budget (USD)</label>
            <input
              type="number"
              name="budget_min"
              value={form.budget_min}
              onChange={handleChange}
              placeholder="e.g., 1000000"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-medium mb-1">Maximum Budget (USD)</label>
            <input
              type="number"
              name="budget_max"
              value={form.budget_max}
              onChange={handleChange}
              placeholder="e.g., 50000000"
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition">
          Filter
        </button>
      </form>

      {/* Filtered Movies */}
      {movies.length > 0 && (
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
            Filtered Movies
          </h2>
          <MovieGrid movies={movies} />
        </div>
      )}
    </div>
  );
}
