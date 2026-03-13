import { BaseResponse } from "../lib/interface/baseresponse";
import { EpisodeData, Movie } from "../lib/interface/movie.interface";
import { Endpoint } from "../lib/shared/constants/endpoint";
import { UrlBuilder } from "../lib/urlbuilder";

export type MovieFilter = {
    category: string;
}

export class MovieService {
    private static instance: MovieService;
    private constructor() { }
    public static getInstance(): MovieService {
        if (!MovieService.instance) {
            MovieService.instance = new MovieService();
        }
        return MovieService.instance;
    }
    async getMovies(filter?: MovieFilter): Promise<BaseResponse<Movie[]>> {
        try {
            const url = new UrlBuilder().addPath(Endpoint.MOVIES);
            if(filter?.category) {
                url.addQueryParam('category', filter?.category);
            }
            return await fetch(url.build()).then((res) => res.json());
            
        } catch (error) {
            console.error('Error fetching movies:', error);
            return [] as unknown as BaseResponse<Movie[]>;
        }
    }

    async getMovieBySlug(slug: string): Promise<BaseResponse<Movie>> {
        try {
            const url = new UrlBuilder().addPath(Endpoint.MOVIES).addParam(slug);
            return await fetch(url.build()).then((res) => res.json());
        } catch (error) {
            console.error('Error fetching movie by slug:', error);
            return {} as unknown as BaseResponse<Movie>;
        }
    }

    async getMovieEpisodeBySlug(movieslug: string, episodeslug: string): Promise<BaseResponse<EpisodeData>> {
        try {
            const url = new UrlBuilder()
                .addPath(Endpoint.MOVIES)
                .addParam(movieslug)
                .addParam('episodes')
                .addParam(episodeslug);
            return await fetch(url.build()).then((res) => res.json());
        } catch (error) {
            console.error('Error fetching movie episode by slug:', error);
            return {} as unknown as BaseResponse<EpisodeData>;
        }
    }
}