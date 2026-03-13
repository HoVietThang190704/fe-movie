export type Tmdb = {
  type: string | null;
  id: string;
  season: number | null;
  vote_average: number;
  vote_count: number;
};

export type Imdb = {
  id: string;
  vote_average: number;
  vote_count: number;
};

export type Category = {
  id?: string;
  name?: string;
  slug?: string;
};

export type Country = {
  id?: string;
  name?: string;
  slug?: string;
};

export type EpisodeData = {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
};

export type Server = {
  server_name: string;
  server_data?: EpisodeData[];
};

export type LastEpisode = {
  server_name?: string;
  is_ai?: boolean;
  name?: string;
};

export type Movie = {
  _id?: string;

  tmdb?: Tmdb;
  imdb?: Imdb;

  // your custom created/modified wrappers
  created?: { time: Date };
  modified?: { time: Date };

  // required by schema
  name: string;
  origin_name: string;
  content: string;
  slug: string;
  year: number;

  // optional / defaults in schema
  alternative_names?: string[];
  type?: string;
  status?: string;
  thumb_url?: string;
  poster_url?: string;
  trailer_url?: string;
  time?: string;
  episode_current?: string;
  episode_total?: string;
  quality?: string;
  lang?: string;
  lang_key?: string[];
  notify?: string;
  showtimes?: string;
  view?: number;
  actor?: string[];
  director?: string[];
  category?: Category[];
  country?: Country[];
  is_copyright?: boolean;
  chieurap?: boolean;
  sub_docquyen?: boolean;
  isHidden?: boolean;
  last_episodes?: LastEpisode[];
  episodes?: Server[];
};