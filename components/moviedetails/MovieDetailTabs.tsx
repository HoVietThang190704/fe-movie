import { Movie } from "@/lib/interface/movie.interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import Link from "next/link";
import { Badge } from "../ui/badge";

interface MovieDetailTabsProps {
  movie: Movie;
}

export function MovieDetailTabs({ movie }: MovieDetailTabsProps) {
  return (
    <Tabs defaultValue="episodes" className="w-full px-6">
      <TabsList className="w-full">
        <TabsTrigger value="episodes">Episodes</TabsTrigger>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="reports">Similar Movies</TabsTrigger>
      </TabsList>
      <TabsContent value="episodes">
        {movie.episodes && movie.episodes.length > 0 ? (
          <ul className="pl-5 grid grid-cols-4 gap-5 p-3 m-3">
            {movie.episodes[0].server_data?.map((server, index) => (
              <Link
                href={`/watch/${movie.slug}/${server.slug}`}
                key={index}
                className="w-full px-3 py-1 h-10 text-accent-foreground rounded-md bg-accent hover:bg-muted-foreground transition-colors flex items-center"
              >
                <div className="flex flex-row items-center gap-2">
                  <Badge>{server.name}</Badge>
                  <span>Tập {server.name}</span>
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p>No episodes available</p>
        )}
      </TabsContent>
      <TabsContent value="description">
        <p className="p-3"
           dangerouslySetInnerHTML={{ __html: movie.content }} />
      </TabsContent>
    </Tabs>
  );
}
