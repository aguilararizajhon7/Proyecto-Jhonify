import { useEffect, useRef, useState } from "react";
import { ChevronDown, SkipForward, X, PictureInPicture2, Play, Loader2 } from "lucide-react";
import { usePlayer } from "@/lib/player";
import { getLyrics } from "@/lib/lyrics.functions";
import { getRelated } from "@/lib/youtube.functions";
import type { YtResult } from "@/lib/youtube.functions";

type YTPlayer = {
  destroy: () => void;
  playVideo?: () => void;
  getIframe?: () => HTMLIFrameElement;
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
      PlayerState: { ENDED: number; PLAYING: number };
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

export function FullscreenPlayer() {
  const { current, fullscreen, closeFullscreen, next, stop, queue, play, setQueue } = usePlayer();
  const mountRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [lyricsLoading, setLyricsLoading] = useState(false);
  const [related, setRelated] = useState<YtResult[]>([]);

  // Mount / update YT player for current track (kept alive across fullscreen toggle).
  useEffect(() => {
    if (!current || !mountRef.current) return;
    let cancelled = false;
    (async () => {
      await loadYtApi();
      if (cancelled || !window.YT || !mountRef.current) return;
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      const host = document.createElement("div");
      mountRef.current.innerHTML = "";
      mountRef.current.appendChild(host);
      playerRef.current = new window.YT.Player(host, {
        videoId: current.video_id,
        playerVars: { autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onStateChange: (e) => {
            if (e.data === window.YT!.PlayerState.ENDED) next();
          },
        },
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [current, next]);

  // Cleanup player on unmount.
  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  // Fetch lyrics & related when track changes.
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
        // Auto-fill queue if empty so autoplay flows.
        setQueue(r.results.slice(0, 10));
      })
      .catch(() => setRelated([]));
  }, [current, setQueue]);

  async function pip() {
    try {
      const iframe = playerRef.current?.getIframe?.();
      if (!iframe) return;
      // Try to enter PiP on the iframe's internal video via the iframe element.
      // Chrome supports requestPictureInPicture on <video>; iframes require the
      // embedded page's cooperation. YouTube exposes PiP via its own UI.
      // Fallback: instruct the user.
      // @ts-expect-error non-standard
      if (document.pictureInPictureEnabled && iframe.requestPictureInPicture) {
        // @ts-expect-error non-standard
        await iframe.requestPictureInPicture();
      } else {
        alert(
          "Para escuchar en segundo plano: usa el botón de mini-reproductor del video de YouTube o el menú del navegador (Picture-in-Picture).",
        );
      }
    } catch {
      /* ignore */
    }
  }

  if (!current) return null;

  return (
    <>
      {/* Persistent hidden mount keeps audio alive when overlay is closed */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: fullscreen ? "auto" : "-9999px",
          top: fullscreen ? "auto" : "-9999px",
          width: fullscreen ? "100%" : "1px",
          height: fullscreen ? "auto" : "1px",
          pointerEvents: fullscreen ? "auto" : "none",
          zIndex: fullscreen ? 60 : -1,
        }}
      >
        {fullscreen && (
          <div className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-background">
            {/* Header */}
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
              <button
                onClick={stop}
                aria-label="Detener"
                className="rounded-full p-2 hover:bg-muted"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-4">
              {/* Video mount */}
              <div className="overflow-hidden rounded-xl bg-black" ref={mountRef} style={{ aspectRatio: "16 / 9" }} />

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={next}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
                >
                  <SkipForward className="h-4 w-4" /> Siguiente
                </button>
                <button
                  onClick={pip}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  <PictureInPicture2 className="h-4 w-4" /> Segundo plano
                </button>
              </div>

              {/* Lyrics */}
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
                    <p className="text-muted-foreground">
                      No encontramos la letra de esta canción.
                    </p>
                  )}
                </div>
              </section>

              {/* Suggestions */}
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
                        <img
                          src={r.thumbnail}
                          alt=""
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium">{r.title}</div>
                          <div className="truncate text-xs text-muted-foreground">
                            {r.channel}
                          </div>
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
        )}
      </div>
    </>
  );
}
