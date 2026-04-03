"use client";

import { Movie } from "@/lib/interface/movie.interface";
import { MovieCard } from "../landingpage/MovieCard";

type SearchListProps = {
  filteredMovies: Movie[];
};

export function SearchList({ filteredMovies }: SearchListProps) {
  return (
    <div className="py-8 w-full grid grid-cols-5 gap-4 px-8">
      {filteredMovies.map((movie) => (
        <MovieCard key={movie.name} movie={movie} className=""  />
      ))}
    </div>
  );
}
