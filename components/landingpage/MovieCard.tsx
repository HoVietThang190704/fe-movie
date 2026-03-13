import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Movie } from "@/lib/interface/movie.interface";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type MovieCardProps = {
  movie: Movie;
};

export function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.slug}`} className="group h-72 w-32">
      <Card className="h-full overflow-hidden border-0 bg-transparent shadow-none transition-all duration-300 ">
        <CardContent className="p-0 space-y-3">
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-muted">
            <Image
              src={movie.thumb_url || "/placeholder.png"}
              alt={movie.name}
              width={800}
              height={600}
              className="object-cover transition-transform h-full  w-full duration-500"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <PlayCircle
                className="h-12 w-12 text-white drop-shadow-lg"
                strokeWidth={1.5}
              />
            </div>
            <div className="absolute top-2 left-2 flex flex-col gap-1.5">
              {movie.quality && (
                <Badge
                  variant="secondary"
                  className="bg-black/70 text-white backdrop-blur-sm hover:bg-black/80"
                >
                  {movie.quality}
                </Badge>
              )}
              {movie.lang && (
                <Badge
                  variant="outline"
                  className="border-white/40 bg-black/40 text-white backdrop-blur-sm"
                >
                  {movie.lang}
                </Badge>
              )}
            </div>

            {(movie.episode_current || movie.time) && (
              <div className="absolute bottom-2 right-2">
                <Badge className="bg-primary/90 hover:bg-primary shadow-sm">
                  {movie.episode_current || movie.time}
                </Badge>
              </div>
            )}
          </div>

          <div className="space-y-1.5 px-1">
            <h3 className="line-clamp-1 font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {movie.name}
            </h3>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <p className="line-clamp-1 flex-1">{movie.origin_name}</p>
              {movie.year && (
                <span className="ml-2 shrink-0 font-medium text-foreground/80">
                  {movie.year}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}