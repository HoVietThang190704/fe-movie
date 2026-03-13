import HlsPlayer from "@/components/HlsPlayer";
import { BaseResponse } from "@/lib/interface/baseresponse";
import { Movie } from "@/lib/interface/movie.interface";
import { MovieService } from "@/service/movie.service";

export default async function watchMovie(
  param: PageProps<"/watch/[movieslug]/[episodeslug]">,
) {
  const { movieslug, episodeslug } = await param.params;
  const response: BaseResponse<Movie> =
    await MovieService.getInstance().getMovieBySlug(movieslug);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <HlsPlayer
        movieEpisodes={response.data?.episodes?.[0].server_data || []}
        episodeSlug={episodeslug}
        autoPlay
        className="w-full h-full object-contain"
        movieSlug={movieslug}
      />
    </div>
  );
}
