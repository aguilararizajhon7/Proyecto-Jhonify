import { useEffect, useRef, useState } from "react";
import { ChevronDown, X, Play, Loader2, SkipForward, SkipBack, Pause } from "lucide-react";
import { usePlayer } from "@/reproductor/estado-reproductor";
import { getLyrics } from "@/servidor/letras.functions";
import { getRelated } from "@/servidor/youtube.functions";
import type { YtResult } from "@/servidor/youtube.functions";

type YTPlayer = {
  destroy: () => void;
  playVideo?: () => void;
  pauseVideo?: () => void;
  seekTo?: (s: number, allowSeekAhead?: boolean) => void;
  setVolume?: (v: number) => void;
  getCurrentTime?: () => number;
  getDuration?: () => number;
  loadVideoById?: (id: string) => void;
};

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (e: { target: YTPlayer }) => void;
            onStateChange?: (e: { data: number; target: YTPlayer }) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<void> | null = null;
function loadYtApi() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  });
  return ytApiPromise;
}

function fmt(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function GlobalPlayer() {
  const {
    current,
    fullscreen,
    closeFullscreen,
    next,
    prev,
    stop,
    play,
    queue,
    setQueue,
    _setPlaybackState,
    _registerControls,
  } = usePlayer();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [related, setRelated] = useState<YtResult[]>([]);

  // Create / update YT player.
  useEffect(() => {
    if (!current || !mountRef.current) return;
    let cancelled = false;
    (async () => {
      await loadYtApi();
      if (cancelled || !window.YT) return;

      if (playerRef.current) {
        playerRef.current.loadVideoById?.(current.video_id);
        return;
      }

      const el = document.createElement("div");
      mountRef.current!.innerHTML = "";
      mountRef.current!.appendChild(el);
      playerRef.current = new window.YT.Player(el, {
        videoId: current.video_id,
        playerVars: { autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: (e) => {
            _registerControls({
              play: () => e.target.playVideo?.(),
              pause: () => e.target.pauseVideo?.(),
              seekTo: (s) => e.target.seekTo?.(s, true),
              setVolume: (v) => e.target.setVolume?.(v),
            });
          },
          onStateChange: (e) => {
            const YT = window.YT!;
            if (e.data === YT.PlayerState.ENDED) next();
            if (e.data === YT.PlayerState.PLAYING) _setPlaybackState({ isPlaying: true });
            if (e.data === YT.PlayerState.PAUSED) _setPlaybackState({ isPlaying: false });
          },
        },
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [current?.video_id, next, _registerControls, _setPlaybackState]);

  // Poll position/duration.
  useEffect(() => {
    if (!current) return;
    const id = setInterval(() => {
      const p = playerRef.current;
      if (!p?.getCurrentTime) return;
      _setPlaybackState({
        position: p.getCurrentTime() ?? 0,
        duration: p.getDuration?.() ?? 0,
      });
    }, 500);
    return () => clearInterval(id);
  }, [current, _setPlaybackState]);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
      _registerControls(null);
    };
  }, [_registerControls]);

  // Lyrics + related when track changes.
  const queueRef = useRef(queue);
  queueRef.current = queue;
  useEffect(() => {
    if (!current) return;
    setLyrics(null);
    setLyricsLoading(true);
    getLyrics({ data: { title: current.title, channel: current.channel ?? undefined } })
      .then((r) => setLyrics(r.lyrics))
      .catch(() => setLyrics(null))
      .finally(() => setLyricsLoading(false));

    getRelated({ data: { q: current.title, exclude: current.video_id } })
      .then((r) => {
        setRelated(r.results);
        // Only auto-fill the queue when nothing is queued, so pressing
        // "siguiente" keeps following the list the user started from.
        if (queueRef.current.length === 0) setQueue(r.results.slice(0, 10));
      })
      .catch(() => setRelated([]));
  }, [current, setQueue]);

  if (!current) {
    // Nothing playing → still render an empty mount so ref exists for later.
    return <div ref={mountRef} style={{ display: "none" }} />;
  }

  return (
    <div
      aria-hidden={!fullscreen}
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-background"
      style={{
        transform: fullscreen ? "none" : "translateX(-100vw)",
        pointerEvents: fullscreen ? "auto" : "none",
        visibility: fullscreen ? "visible" : "hidden",
      }}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <button
          onClick={closeFullscreen}
          aria-label="Minimizar"
          className="rounded-full p-2 hover:bg-muted"
        >
          <ChevronDown className="h-6 w-6" />
        </button>
        <div className="min-w-0 flex-1 px-3 text-center">
          <div className="truncate text-sm font-semibold">{current.title}</div>
          <div className="truncate text-xs text-muted-foreground">{current.channel}</div>
        </div>
        <button onClick={stop} aria-label="Detener" className="rounded-full p-2 hover:bg-muted">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-4">
        {/* Video ALWAYS lives here — never unmounted */}
        <div
          className="overflow-hidden rounded-xl bg-black"
          ref={mountRef}
          style={{ aspectRatio: "16 / 9" }}
        />

        <FullscreenControls />

        <section>
          <h2 className="mb-2 text-lg font-semibold">Letra</h2>
          <div className="rounded-xl border border-border bg-card p-4 text-sm leading-relaxed">
            {lyricsLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Buscando letra...
              </div>
            ) : lyrics ? (
              <pre className="whitespace-pre-wrap font-sans">{lyrics}</pre>
            ) : (
              <p className="text-muted-foreground">No encontramos la letra de esta canción.</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">Sugerencias</h2>
          {related.length === 0 ? (
            <p className="text-sm text-muted-foreground">Cargando sugerencias...</p>
          ) : (
            <ul className="space-y-2">
              {related.map((r) => (
                <li
                  key={r.video_id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
                >
                  <img src={r.thumbnail} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{r.title}</div>
                    <div className="truncate text-xs text-muted-foreground">{r.channel}</div>
                  </div>
                  <button
                    onClick={() => play(r, related)}
                    aria-label="Reproducir"
                    className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary-hover"
                  >
                    <Play className="h-4 w-4" fill="currentColor" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {queue.length > 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              Siguiente en cola: {queue[0]?.title}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

function FullscreenControls() {
  const { isPlaying, toggle, next, prev, position, duration, seek } = usePlayer();
  return (
    <div className="space-y-2">
      <input
        type="range"
        min={0}
        max={Math.max(1, duration)}
        step={1}
        value={Math.min(position, duration || 0)}
        onChange={(e) => seek(Number(e.target.value))}
        className="w-full accent-primary"
        aria-label="Progreso"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{fmt(position)}</span>
        <span>{fmt(duration)}</span>
      </div>
      <div className="flex items-center justify-center gap-6 pt-2">
        <button onClick={prev} aria-label="Anterior" className="rounded-full p-3 hover:bg-muted">
          <SkipBack className="h-6 w-6" />
        </button>
        <button
          onClick={toggle}
          aria-label={isPlaying ? "Pausar" : "Reproducir"}
          className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary-hover"
        >
          {isPlaying ? (
            <Pause className="h-7 w-7" fill="currentColor" />
          ) : (
            <Play className="h-7 w-7" fill="currentColor" />
          )}
        </button>
        <button onClick={next} aria-label="Siguiente" className="rounded-full p-3 hover:bg-muted">
          <SkipForward className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
