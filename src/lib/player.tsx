import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type Track = {
  video_id: string;
  title: string;
  channel?: string | null;
  thumbnail?: string | null;
};

type PlayerCtx = {
  current: Track | null;
  queue: Track[];
  fullscreen: boolean;
  play: (t: Track, queue?: Track[]) => void;
  enqueue: (t: Track) => void;
  setQueue: (q: Track[]) => void;
  next: () => void;
  stop: () => void;
  openFullscreen: () => void;
  closeFullscreen: () => void;
};

const Ctx = createContext<PlayerCtx>({
  current: null,
  queue: [],
  fullscreen: false,
  play: () => {},
  enqueue: () => {},
  setQueue: () => {},
  next: () => {},
  stop: () => {},
  openFullscreen: () => {},
  closeFullscreen: () => {},
});

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Track | null>(null);
  const [queue, setQueueState] = useState<Track[]>([]);
  const [fullscreen, setFullscreen] = useState(false);

  const play = useCallback((t: Track, q?: Track[]) => {
    setCurrent(t);
    if (q) setQueueState(q.filter((x) => x.video_id !== t.video_id));
  }, []);

  const enqueue = useCallback((t: Track) => {
    setQueueState((q) => (q.some((x) => x.video_id === t.video_id) ? q : [...q, t]));
  }, []);

  const next = useCallback(() => {
    setQueueState((q) => {
      if (q.length === 0) return q;
      const [head, ...rest] = q;
      setCurrent(head);
      return rest;
    });
  }, []);

  const stop = useCallback(() => {
    setCurrent(null);
    setFullscreen(false);
  }, []);

  return (
    <Ctx.Provider
      value={{
        current,
        queue,
        fullscreen,
        play,
        enqueue,
        setQueue: setQueueState,
        next,
        stop,
        openFullscreen: () => setFullscreen(true),
        closeFullscreen: () => setFullscreen(false),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const usePlayer = () => useContext(Ctx);
