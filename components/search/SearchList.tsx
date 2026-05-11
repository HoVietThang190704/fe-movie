"use client";

import { Movie } from "@/lib/interface/movie.interface";
import { MovieCard } from "../landingpage/MovieCard";

interface SearchListProps {
  filteredMovies: Movie[];
}

export function SearchList({ filteredMovies }: SearchListProps) {
  if (filteredMovies.length === 0) {
    return (
      <div className="py-16 w-full flex items-center justify-center px-8">
        <div className="text-center">
          <p className="text-xl text-zinc-400 mb-2">No movies found</p>
          <p className="text-sm text-zinc-500">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 w-full grid grid-cols-5 gap-4 px-8">
      {filteredMovies.map((movie) => (
        <MovieCard key={movie.slug} movie={movie} className="" />
      ))}
    </div>
  );
}
