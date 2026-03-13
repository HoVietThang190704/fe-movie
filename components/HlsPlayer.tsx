"use client";

import { useHLSPlayer } from "@/hooks/use-hls-player";
import { PLAYBACK_RATES, SKIP_SECONDS } from "@/lib/shared/constants/hls";
import { cn } from "@/lib/utils";
import {
  ChevronLast,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Settings,
  Volume1,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { EpisodeData } from "@/lib/interface/movie.interface";
import { useRouter } from "next/dist/client/components/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HlsPlayerProps {
  movieEpisodes: EpisodeData[]; 
  episodeSlug: string;
  autoPlay?: boolean;
  className?: string;
  movieSlug: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(secs: number): string {
  if (!isFinite(secs) || secs < 0) return "0:00";
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${m}:${String(s).padStart(2, "0")}`;
}

// ─── Player Tooltip Button ─────────────────────────────────────────────────────

function PlayerButton({
  tooltip,
  shortcut,
  onClick,
  className,
  children,
}: {
  tooltip: string;
  shortcut?: string;
  onClick: (e: React.MouseEvent) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClick}
          className={cn(
            "text-white hover:bg-white/20 hover:text-white",
            className,
          )}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="flex items-center gap-2">
        <span>{tooltip}</span>
        {shortcut && (
          <kbd className="bg-muted text-muted-foreground rounded px-1 py-0.5 text-[10px] font-mono">
            {shortcut}
          </kbd>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HlsPlayer({
  movieEpisodes,
  movieSlug,
  episodeSlug,
  autoPlay = true,
  className,
}: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const {
    isPlaying,
    currentTime,
    duration,
    bufferedFraction,
    volume,
    isMuted,
    controlsVisible,
    resetIdleTimeout,
    hideControlsImmediately,
  } = useHLSPlayer({
    videoRef: videoRef as React.RefObject<HTMLVideoElement>,
    src: movieEpisodes.find(ep => ep.slug === episodeSlug)?.link_m3u8 || "",
    autoPlay,
    idleTimeoutRef,
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
  });

  // Local state not tracked by hook
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [skipFlash, setSkipFlash] = useState<"fwd" | "bwd" | null>(null);
  const [clickIcon, setClickIcon] = useState<"play" | "pause" | null>(null);

  // ── Fullscreen listener ────────────────────────────────────────────────────
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.code) {
        case "Space":
        case "KeyK":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
        case "KeyL":
          e.preventDefault();
          skip(SKIP_SECONDS);
          break;
        case "ArrowLeft":
        case "KeyJ":
          e.preventDefault();
          skip(-SKIP_SECONDS);
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, []);

  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setClickIcon("play");
    } else {
      v.pause();
      setClickIcon("pause");
    }
  }, []);

  const skip = useCallback((seconds: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(
      Math.max(0, v.currentTime + seconds),
      v.duration || 0,
    );
    setSkipFlash(seconds > 0 ? "fwd" : "bwd");
    setTimeout(() => setSkipFlash(null), 700);
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (v) v.muted = !v.muted;
  }, []);

  const handleVolumeChange = useCallback((val: number[]) => {
    const v = videoRef.current;
    if (!v) return;
    const next = val[0] ?? 0;
    v.volume = next;
    v.muted = next === 0;
  }, []);

  const handleSeek = useCallback((val: number[]) => {
    const v = videoRef.current;
    if (!v || !isFinite(v.duration)) return;
    v.currentTime = val[0] ?? 0;
  }, []);

  const handleNextEpisode = (() => {
    
    const currentIndex = movieEpisodes.findIndex(ep => ep.slug === episodeSlug);
    if (currentIndex === -1) return;
    const nextEpisode = movieEpisodes[currentIndex + 1];
    if (nextEpisode) {
      router.push(`/watch/${movieSlug}/${nextEpisode.slug}`);
    }
  })

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current?.requestFullscreen();
    }
  }, []);

  const applySpeed = useCallback((rate: string) => {
    const v = videoRef.current;
    const num = parseFloat(rate);
    if (v) v.playbackRate = num;
    setPlaybackRate(num);
  }, []);

  useEffect(() => {
    if (!clickIcon) return;
    const id = setTimeout(() => setClickIcon(null), 700);
    return () => clearTimeout(id);
  }, [clickIcon]);

  // ── Derived values ─────────────────────────────────────────────────────────

  const VolumeIcon =
    isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const showControls = controlsVisible || !isPlaying;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <TooltipProvider>
      <div
        ref={containerRef}
        className={cn(
          "group relative w-full overflow-hidden bg-black select-none",
          className,
        )}
        onMouseMove={resetIdleTimeout}
        onMouseLeave={hideControlsImmediately}
        onClick={handleContainerClick}
      >
        {/* ── Video ── */}
        <video
          ref={videoRef}
          autoPlay={autoPlay}
          className="w-full h-full"
          playsInline
          onEnded={handleNextEpisode}
        />

        {/* ── Skip flash ── */}
        {skipFlash && (
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 flex items-center",
              skipFlash === "fwd"
                ? "right-[12%] justify-end"
                : "left-[12%] justify-start",
            )}
          >
            <div className="flex flex-col items-center gap-1 rounded-full bg-black/30 px-5 py-3 text-white backdrop-blur-sm">
              {skipFlash === "fwd" ? (
                <RotateCw className="size-7" />
              ) : (
                <RotateCcw className="size-7" />
              )}
              <span className="text-xs font-semibold">
                {skipFlash === "fwd"
                  ? `+${SKIP_SECONDS}s`
                  : `-${SKIP_SECONDS}s`}
              </span>
            </div>
          </div>
        )}

        {/* ── Click overlay icon ── */}
        {clickIcon && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {clickIcon === "play" ? (
              <Play className="size-12 text-white opacity-80" />
            ) : (
              <Pause className="size-12 text-white opacity-80" />
            )}
          </div>
        )}

        {/* ── Controls overlay ── */}
        <div
          className={cn(
            "absolute inset-0 flex flex-col justify-end transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          {/* Gradient backdrop */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

          <div className="relative space-y-1 px-3 pb-3">
            {/* ── Seek bar ── */}
            <div className="group/seek relative flex items-center py-1">
              {/* Buffered track (sits under the Slider) */}
              <div className="pointer-events-none absolute inset-x-0 h-1.5 overflow-hidden rounded-full">
                <div
                  className="h-full bg-white/30 transition-all"
                  style={{ width: `${bufferedFraction * 100}%` }}
                />
              </div>

              <Slider
                min={0}
                max={duration > 0 ? duration : 100}
                step={0.5}
                value={[currentTime]}
                onValueChange={handleSeek}
                className={cn(
                  "w-full cursor-pointer",
                  // Transparent track so buffered div shows through
                  "**:data-[slot=slider-track]:bg-white/20",
                  // Red progress fill
                  "**:data-[slot=slider-range]:bg-red-500",
                  // Larger thumb on hover
                  "**:data-[slot=slider-thumb]:size-3",
                  "**:data-[slot=slider-thumb]:border-white",
                  "**:data-[slot=slider-thumb]:opacity-0",
                  "**:data-[slot=slider-thumb]:transition-opacity",
                  "hover:**:data-[slot=slider-thumb]:opacity-100",
                )}
              />
            </div>

            {/* ── Button row ── */}
            <div className="flex items-center justify-between text-white">
              {/* Left cluster */}
              <div className="flex items-center gap-0.5">
                {/* Play / Pause */}
                <PlayerButton
                  tooltip={isPlaying ? "Pause" : "Play"}
                  shortcut="Space"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlay();
                  }}
                >
                  {isPlaying ? (
                    <Pause className="size-5" />
                  ) : (
                    <Play className="size-5" />
                  )}
                </PlayerButton>

                {/* Rewind */}
                <PlayerButton
                  tooltip="Rewind 10s"
                  shortcut="J"
                  onClick={(e) => {
                    e.stopPropagation();
                    skip(-SKIP_SECONDS);
                  }}
                >
                  {/* <RotateCcw className="size-4" /> */}
                  {/* <span className="text-[10px] font-bold -ml-1">
                    {SKIP_SECONDS}
                  </span> */}
                  <Image
                    src="/images/rewind-icon.png"
                    width={16}
                    height={16}
                    alt="Rewind"
                  />
                </PlayerButton>

                {/* Forward */}
                <PlayerButton
                  tooltip="Forward 10s"
                  shortcut="L"
                  onClick={(e) => {
                    e.stopPropagation();
                    skip(SKIP_SECONDS);
                  }}
                >
                  {/* <RotateCw className="size-4" />
                  <span className="text-[10px] font-bold -ml-1">
                    {SKIP_SECONDS}
                  </span> */}
                  <Image
                    src="/images/forward-icon.png"
                    width={16}
                    height={16}
                    alt="Forward"
                  />
                </PlayerButton>

                {/* Volume */}
                <div
                  className="flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <PlayerButton
                    tooltip={isMuted ? "Unmute" : "Mute"}
                    shortcut="M"
                    onClick={toggleMute}
                  >
                    <VolumeIcon className="size-5" />
                  </PlayerButton>

                  {/* Volume slider — expands on hover */}
                  <div className="w-0 overflow-hidden transition-all duration-200 group-hover:w-20">
                    <Slider
                      min={0}
                      max={1}
                      step={0.02}
                      value={[isMuted ? 0 : volume]}
                      onValueChange={handleVolumeChange}
                      className={cn(
                        "cursor-pointer",
                        "**:data-[slot=slider-track]:bg-white/30",
                        "**:data-[slot=slider-range]:bg-white",
                        "**:data-[slot=slider-thumb]:size-3",
                        "**:data-[slot=slider-thumb]:border-white",
                      )}
                    />
                  </div>
                </div>

                {/* Time */}
                <span className="ml-1 tabular-nums text-xs text-white/90">
                  {formatTime(currentTime)}{" "}
                  <span className="text-white/50">/</span>{" "}
                  {formatTime(duration)}
                </span>
              </div>

              {/* Right cluster */}
              <div
                className="flex items-center gap-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                <PlayerButton
                  tooltip="Next episode"
                  onClick={handleNextEpisode}
                >
                  <ChevronLast />
                </PlayerButton>
                {/* ── Playback speed ── */}
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 min-w-14 px-2 text-xs font-bold text-white hover:bg-white/20 hover:text-white"
                        >
                          {playbackRate === 1 ? "Speed" : `${playbackRate}×`}
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">Playback speed</TooltipContent>
                  </Tooltip>

                  <DropdownMenuContent
                    side="top"
                    align="end"
                    className="min-w-25"
                  >
                    <DropdownMenuLabel>Speed</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={String(playbackRate)}
                      onValueChange={applySpeed}
                    >
                      {PLAYBACK_RATES.map((rate) => (
                        <DropdownMenuRadioItem key={rate} value={String(rate)}>
                          {rate === 1 ? "Normal" : `${rate}×`}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* ── Settings / Quality placeholder ── */}
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="opacity-60"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Settings className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="top">Settings</TooltipContent>
                  </Tooltip>

                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Setting</DropdownMenuLabel>
                      <DropdownMenuItem>Quality</DropdownMenuItem>
                      <DropdownMenuItem>Subtitles</DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Speed</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuLabel>Speed</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                              <DropdownMenuRadioGroup
                                value={String(playbackRate)}
                                onValueChange={applySpeed}
                              >
                                {PLAYBACK_RATES.map((rate) => (
                                  <DropdownMenuRadioItem key={rate} value={String(rate)}>
                                    {rate === 1 ? "Normal" : `${rate}×`}
                                  </DropdownMenuRadioItem>
                                ))}
                              </DropdownMenuRadioGroup>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* ── Fullscreen ── */}
                <PlayerButton
                  tooltip={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                  shortcut="F"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFullscreen();
                  }}
                >
                  {isFullscreen ? (
                    <Minimize className="size-5" />
                  ) : (
                    <Maximize className="size-5" />
                  )}
                </PlayerButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
