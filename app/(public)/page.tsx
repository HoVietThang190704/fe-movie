import { MovieService } from "../../service/movie.service";
import { Separator } from "@/components/ui/separator";
import PopularMovie from "@/components/landingpage/PopularMovie";
import { BaseResponse } from "@/lib/interface/baseresponse";
import { Movie } from "@/lib/interface/movie.interface";
import { MovieList } from "@/components/landingpage/MovieList";

const MOVIE_CATEGORIES = [
  "tinh-cam",
  "co-trang",
  "vien-tuong",
  "hanh-dong",
  "kinh-di",
  "hoat-hinh",
] as const; 

export type MovieCategory = (typeof MOVIE_CATEGORIES)[number];

async function fetchMoviesByCategories(): Promise<
  Record<MovieCategory, Movie[]>
> {
  const movieService = MovieService.getInstance();

  const results = await Promise.all(
    MOVIE_CATEGORIES.map((category) =>
      movieService.getMovies({category})
    ),
  );

  return MOVIE_CATEGORIES.reduce(
    (acc, category, index) => {
      acc[category] = results[index].data || [];
      return acc;
    },
    {} as Record<MovieCategory, Movie[]>,
  );
}

export default async function Page() {
  const allMoviesResponse: BaseResponse<Movie[]> = 
    await MovieService.getInstance().getMovies();

    const [allMovies, filteredMovies] = await Promise.all([
      allMoviesResponse,
      fetchMoviesByCategories(),
    ]);

  return (
    <div className="min-h-screen">
      <Separator />
      <PopularMovie movies={allMovies.data || []} />
      <MovieList filteredMovies={filteredMovies}/>
    </div>
  );
}
