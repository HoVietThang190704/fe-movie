import { BaseResponse } from "@/lib/interface/baseresponse";
import { Movie } from "@/lib/interface/movie.interface";
import { MovieService } from "@/service/movie.service";
import MovieDetail from "@/components/moviedetails/MovieDetail";

export const revalidate = 60;

export async function generateStaticParams() {
  const response: BaseResponse<Movie[]> =
    await MovieService.getInstance().getMovies();

  return response.data?.map((movie) => ({
    slug: String(movie.slug),
  }));
}

export default async function Page(props: PageProps<"/movie/[slug]">) {
  // params là một object chứa các tham số động trong URL, ở đây là slug
  const { slug } = await props.params;
  const movieResponseBySlug: BaseResponse<Movie> =
    await MovieService.getInstance().getMovieBySlug(slug);

    const movie = movieResponseBySlug.data || [] as unknown as Movie;
  
  return (
    <div>
      <MovieDetail movie={movie} />
    </div>
  );
}
