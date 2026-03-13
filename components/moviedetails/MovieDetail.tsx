import { Movie } from "@/lib/interface/movie.interface";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";
import { MovieDetailTabs } from "./MovieDetailTabs";

interface MovieDetailProps {
  movie: Movie;
}

export default function MovieDetail({ movie }: MovieDetailProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Hero Banner */}
      <div className="relative w-full h-192 overflow-hidden rounded-lg shadow-lg">
        <Image
          src={movie.poster_url || "/placeholder.png"}
          alt={movie.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          className="object-cover"
          priority
        />
      </div>

      {/* Movie Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader className="pb-3">
            <div className="relative w-full  overflow-hidden rounded-md mb-4">
              <Image
                src={movie.poster_url || "/placeholder.png"}
                alt={movie.name}
                width={1200}
                height={1200}
                className="object-contain"
              />
            </div>
            <CardTitle className="text-xl line-clamp-2">{movie.name}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {movie.imdb?.vote_average && (
                <Badge className="bg-accent text-foreground  font-semibold">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />{" "}
                  {movie.imdb.vote_average.toFixed(1)}
                </Badge>
              )}
              {movie.year && (
                <Badge className="bg-blue-600 text-white">{movie.year}</Badge>
              )}
              {movie.quality && <Badge>{movie.quality}</Badge>}
              {movie.lang && (
                <Badge className="bg-orange-600 text-white">{movie.lang}</Badge>
              )}
            </div>

            {/* Categories */}
            {movie.category && movie.category.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">
                  Genres
                </p>
                <div className="flex flex-wrap gap-2">
                  {movie.category.map((cat) => (
                    <Badge
                      key={cat.id}
                      variant="secondary"
                      className="bg-slate-200 dark:bg-slate-700 text-foreground"
                    >
                      {cat.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column - Description ,Details and Episoes */}
        <Card className="lg:col-span-2">
          <MovieDetailTabs movie={movie} />
        </Card>
      </div>
    </div>
  );
}
