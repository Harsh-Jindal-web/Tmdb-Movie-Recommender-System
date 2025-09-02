import React from "react";
import MovieCard from "./MovieCard";

export default function MovieGrid({ movies, userId, onAction }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          userId={userId}
          onAction={onAction}
        />
      ))}
    </div>
  );
}
