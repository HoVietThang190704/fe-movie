import { Movie } from "@/lib/interface/movie.interface";
import { MovieCard } from "./MovieCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";

type MovieListProps = {
  filteredMovies: Record<string, Movie[]>;
};

const CATEGORY_TITLES: Record<string, string> = {
  "tinh-cam": "Phim tình cảm",
  "co-trang": "Phim cổ trang",
  "hanh-dong": "Phim hành động",
  "kinh-di": "Phim kinh dị",
  "hoat-hinh": "Phim hoạt hình",
  "vien-tuong": "Phim viễn tưởng",
};

export function MovieList({ filteredMovies }: MovieListProps) {
  return (
    <div className="py-8 w-full px-2">
      {Object.entries(filteredMovies).map(([category, movies]) => {
        if (!movies || movies.length === 0) return null;

        return (
          <div key={category} className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-2xl font-bold tracking-tight">
                {CATEGORY_TITLES[category] || category}
              </h2>
            </div>

            <div className="relative px-4 sm:px-12">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {movies.map((movie) => (
                    <CarouselItem
                      key={movie.slug}
                      className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                    >
                      <MovieCard movie={movie} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex -left-12 h-12 w-12 border-2" />
                <CarouselNext className="hidden sm:flex -right-12 h-12 w-12 border-2" />
              </Carousel>
            </div>
          </div>
        );
      })}
    </div>
  );
}
