"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Movie } from "@/lib/interface/movie.interface";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { Star, Play, Info } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

type PopularMovieProps = {
  movies: Movie[];
};

export default function PopularMovie({ movies }: PopularMovieProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currIndex, setCurrIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  if (!movies || movies.length === 0) return null;

  const currentMovie = movies[currIndex];

  // Helper to strip HTML tags from content
  const cleanDescription = (text: string) => {
    if (!text) return "";
    return text.replace(/<[^>]*>?/gm, "").trim();
  };

  const getYouTubeId = (url: string) => {
    const regExp =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const renderTrailerOverlay = (movie: Movie, isActive: boolean) => {
    if (!movie.trailer_url || !isActive) return null;

    const ytId = getYouTubeId(movie.trailer_url);
    if (!ytId) return null;

    const embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&origin=${typeof window !== "undefined" ? window.location.origin : ""}`;

    return (
      <div className="absolute inset-0 transition-opacity duration-1000 opacity-100">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none scale-110 "
          allow="autoplay; encrypted-media"
          title={movie.name}
        />
      </div>
    );
  };

  return (
    <div className="relative w-full h-[900px] md:h-[800px] lg:h-[85vh] min-h-[650px] overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 z-0">
        {movies.map((movie, index) => {
          const isActive = index === currIndex;
          return (
            <div
              key={`bg-${movie.slug}-${index}`}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-in-out",
                isActive ? "opacity-100" : "opacity-0",
              )}
            >
              <Image
                src={movie.poster_url || "/placeholder.png"}
                alt={movie.name}
                fill
                className="object-cover object-top scale-105"
                priority={index === 0}
              />

              {renderTrailerOverlay(movie, isActive)}
            </div>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 h-full w-full justify-center px-6 md:px-12 py-16 lg:py-0 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
        <div className="w-full lg:w-1/2 flex flex-col justify-center animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge
              variant="secondary"
              className="bg-red-600 text-white hover:bg-red-700 border-none px-3 py-1 font-bold text-xs"
            >
              POPULAR
            </Badge>
            <div className="flex items-center gap-1.5 text-yellow-500 font-bold">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-lg">
                {currentMovie?.tmdb?.vote_average?.toFixed(1) || "8.5"}
              </span>
            </div>
            <span className="text-zinc-300 font-semibold text-lg">
              {currentMovie?.year}
            </span>
            <span className="px-2 py-0.5 rounded border border-zinc-500 text-zinc-300 text-xs font-bold uppercase">
              {currentMovie?.quality || "HD"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1] drop-shadow-2xl">
            {currentMovie?.name}
          </h1>

          <p className="text-zinc-300 text-base md:text-lg lg:text-xl line-clamp-3 md:line-clamp-4 max-w-2xl mb-10 leading-relaxed font-medium">
            {cleanDescription(currentMovie?.content)}
          </p>

          <div className="flex flex-wrap items-center gap-5">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-zinc-200 font-bold px-10 h-14 text-lg rounded-full shadow-xl transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-6 h-6 mr-3 fill-current" /> Play Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-zinc-800/40 text-white border-zinc-700 hover:bg-zinc-700/60 backdrop-blur-md font-bold px-10 h-14 text-lg rounded-full transition-all hover:scale-105 active:scale-95"
            >
              <Info className="w-6 h-6 mr-3" /> Details
            </Button>
          </div>
        </div>

        {/* Right Side: Visual Selection Carousel */}
        <div className="flex w-full h-full justify-end items-end">
          <Carousel
            setApi={setApi}
            plugins={[
              Autoplay({
                delay: 32000,
                stopOnInteraction: true,
              }),
            ]}
            opts={{
              loop: true,
              align: "start",
            }}
          >
            <CarouselContent className="-ml-4 pb-12">
              {movies.map((movie, index) => {
                const isActive = index === currIndex;

                return (
                  <CarouselItem
                    key={`thumb-${movie.slug}-${index}`}
                    className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                  >
                    <Image
                      src={movie.poster_url || "/placeholder.png"}
                      alt={movie.name}
                      width={200}
                      height={300}
                      className={cn(
                        "w-32 h-32 object-cover rounded-lg transition-transform duration-300 cursor-pointer border-2",
                        isActive
                          ? "scale-105 opacity-100 "
                          : "scale-100 border-transparent opacity-50",
                      )}
                      onClick={() => {
                        if (api) {
                          api.scrollTo(index);
                        }
                      }}
                    />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
}
