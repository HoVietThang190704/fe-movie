import { SearchFilter } from "@/components/search/SearchFilter";
import { SearchList } from "@/components/search/SearchList";
import { BaseResponse } from "@/lib/interface/baseresponse";
import { Movie } from "@/lib/interface/movie.interface";
import { CategoryService } from "@/service/category.service";
import { MovieService } from "@/service/movie.service";

export default async function Page(props: PageProps<"/movie/search">) {
  const searchParams = await props.searchParams;
  const searchName = (searchParams?.name as string) || "";
  const searchCategory = (searchParams?.category as string) || "";

  const [movieResponseBySearch, categories] = await Promise.all([
    MovieService.getInstance().getMovies({ name: searchName, category: searchCategory }),
    CategoryService.getInstance().getCategories(),
  ]);
  
  

  return (
    <div className="flex flex-col items-center w-full">
      <SearchFilter searchName={searchName} categories={categories.data || []} />
      <SearchList filteredMovies={movieResponseBySearch.data || []} />
    </div>
  )
}