import { X, Maximize2, SkipForward, SkipBack, Play, Pause, Volume2 } from "lucide-react";
import { usePlayer } from "@/reproductor/estado-reproductor";

function fmt(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}

export function PlayerBar() {
  const {
    current,
    stop,
    openFullscreen,
    next,
    prev,
    toggle,
    isPlaying,
    position,
    duration,
    seek,
    volume,
    setVolume,
    queue,
  } = usePlayer();
  if (!current) return null;

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-surface-elevated/95 backdrop-blur md:bottom-0">
      {/* Progress bar */}
      <input
        type="range"
        min={0}
        max={Math.max(1, duration)}
        step={1}
        value={Math.min(position, duration || 0)}
        onChange={(e) => seek(Number(e.target.value))}
        aria-label="Progreso"
        className="block h-1 w-full cursor-pointer appearance-none bg-muted accent-primary"
      />

      <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-2">
        {/* Track info — click to open fullscreen */}
        <button
          type="button"
          onClick={openFullscreen}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          aria-label="Abrir reproductor a pantalla completa"
        >
          {current.thumbnail && (
            <img
              src={current.thumbnail}
              alt=""
              className="h-11 w-11 shrink-0 rounded object-cover"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium">{current.title}</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {current.channel}
              {queue.length > 0 ? ` · +${queue.length}` : ""}
            </div>
          </div>
        </button>

        {/* Transport controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={prev}
            aria-label="Anterior"
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            onClick={toggle}
            aria-label={isPlaying ? "Pausar" : "Reproducir"}
            className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground hover:bg-primary-hover"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" fill="currentColor" />
            ) : (
              <Play className="h-5 w-5" fill="currentColor" />
            )}
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        {/* Times + volume (hidden on very small screens) */}
        <div className="hidden items-center gap-2 sm:flex">
          <span className="w-10 text-right text-[11px] tabular-nums text-muted-foreground">
            {fmt(position)}
          </span>
          <span className="text-[11px] text-muted-foreground">/</span>
          <span className="w-10 text-[11px] tabular-nums text-muted-foreground">
            {fmt(duration)}
          </span>
          <Volume2 className="ml-2 h-4 w-4 text-muted-foreground" />
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volumen"
            className="h-1 w-20 cursor-pointer appearance-none bg-muted accent-primary"
          />
        </div>

        <button
          onClick={openFullscreen}
          aria-label="Pantalla completa"
          className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Maximize2 className="h-5 w-5" />
        </button>
        <button
          onClick={stop}
          aria-label="Cerrar reproductor"
          className="rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
