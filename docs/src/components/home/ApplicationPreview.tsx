"use client";

import { useWindow } from "@/hooks/useWindow";
import clsx from "clsx";
import { Pause, Play } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

type ApplicationPreviewProps = {
  srcLight: string;
  srcDark: string;
  alt: string;
  className?: string;
};

const autoPlay = false;

export function ApplicationPreview({
  srcLight,
  srcDark,
  alt,
  className,
}: ApplicationPreviewProps) {
  const [isPaused, setIsPaused] = useState(!autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);
  const win = useWindow();
  const { resolvedTheme } = useTheme();

  const syncPauseState = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    setIsPaused(v.paused);
  }, []);

  const src = resolvedTheme === "dark" ? srcDark : srcLight;

  // Preserve play state across theme switches — changing `src` reloads the
  // video and would otherwise leave it paused.
  useEffect(() => {
    if (!win || isPaused) return;
    const v = videoRef.current;
    if (!v) return;
    const p = v.play();
    if (p) p.catch(() => {});
  }, [src, win, isPaused]);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      const p = v.play();
      if (p) p.catch(() => {});
    } else {
      v.pause();
    }
  }, []);

  // Avoid rendering the wrong theme's video during SSR/hydration —
  if (!win) {
    return (
      <div
        className="absolute inset-0 animate-pulse bg-neutral-100 dark:bg-neutral-800"
        aria-hidden="true"
      />
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        className={clsx(
          "absolute inset-0",
          className,
          "transition-transform duration-300 group-hover:scale-[1.01] fullscreen:object-contain fullscreen:object-center fullscreen:bg-black [&:-webkit-full-screen]:object-contain [&:-webkit-full-screen]:object-center [&:-webkit-full-screen]:bg-black",
        )}
        src={src}
        aria-label={alt}
        autoPlay={autoPlay}
        muted
        playsInline
        preload="metadata"
        onClick={(e) => {
          if (e.currentTarget.controls) return;
          e.preventDefault();
          toggle();
        }}
        onPlay={syncPauseState}
        onPause={syncPauseState}
        role="button"
        tabIndex={0}
        aria-pressed={isPaused}
      />

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle();
        }}
        aria-label={isPaused ? "Play preview" : "Pause preview"}
        className={clsx(
          "absolute left-1/2 top-1/2 z-10 flex size-12 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/60 dark:bg-white/50 dark:text-neutral-900 dark:backdrop-blur-sm dark:hover:bg-white/60",
          isPaused
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
        )}
      >
        {isPaused ? (
          <Play className="size-5 fill-current" aria-hidden="true" />
        ) : (
          <Pause className="size-5 fill-current" aria-hidden="true" />
        )}
      </button>
    </>
  );
}
