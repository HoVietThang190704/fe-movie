import { HIDE_CONTROLS_AFTER_MS } from "@/lib/shared/constants/hls";
import Hls from "hls.js";
import { useCallback, useEffect, useState } from "react";

interface UseHLSPlayerOptions {
  videoRef: React.RefObject<HTMLVideoElement>;
  idleTimeoutRef: React.RefObject<NodeJS.Timeout | null>;
  containerRef: React.RefObject<HTMLDivElement>;
  src: string;
  autoPlay?: boolean;
}

export function useHLSPlayer({
  videoRef,
  src,
  autoPlay = true,
  idleTimeoutRef,
  containerRef,
}: UseHLSPlayerOptions) {
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedFraction, setBufferedFraction] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // UI state
  const [controlsVisible, setControlsVisible] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [skipFlash, setSkipFlash] = useState<"fwd" | "bwd" | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      if (autoPlay) {
        video.play().catch(() => {});
      }
      return;
    }

    if (!Hls.isSupported()) {
      console.error("HLS is not supported in this browser.");
      return;
    }

    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: false,
      backBufferLength: 90,
    });

    hls.attachMedia(video);

    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.loadSource(src);
    });

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (autoPlay) {
        video.play().catch(() => {});
      }
    });

    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.error("HLS fatal network error — trying to recover...");
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.error("HLS fatal media error — trying to recover...");
            hls.recoverMediaError();
            break;
          default:
            console.error("HLS unrecoverable fatal error:", data);
            hls.destroy();
            break;
        }
      }
    });

    return () => {
      hls.destroy();
    };
  }, [src, autoPlay, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const abortController = new AbortController();
    const signal = abortController.signal;
    const syncState = () => {
      setIsPlaying(!video.paused);
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      setBufferedFraction(
        video.buffered.length > 0
          ? video.buffered.end(video.buffered.length - 1) / video.duration
          : 0,
      );
      setVolume(video.volume);
      setIsMuted(video.muted);
    };
    video.addEventListener("play", syncState, { signal });
    video.addEventListener("pause", syncState, { signal });
    video.addEventListener("timeupdate", syncState, { signal });
    video.addEventListener("volumechange", syncState, { signal });

    return () => {
      abortController.abort();
    };
  }, [videoRef]);

  const resetIdleTimeout = useCallback(() => {
    setControlsVisible(true);
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    idleTimeoutRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setControlsVisible(false);
      }
    }, HIDE_CONTROLS_AFTER_MS);
  }, [idleTimeoutRef, videoRef]);

  const hideControlsImmediately = useCallback(() => {
    if (videoRef.current && !videoRef.current.paused) {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      setControlsVisible(false);
    }
  }, [idleTimeoutRef, videoRef]);

  return {
    isPlaying,
    currentTime,
    duration,
    bufferedFraction,
    volume,
    isMuted,
    isFullscreen,
    playbackRate,
    setControlsVisible,
    setShowSpeedMenu,
    setShowQualityMenu,
    setSkipFlash,
    resetIdleTimeout,
    controlsVisible,
    hideControlsImmediately,
  };
}
