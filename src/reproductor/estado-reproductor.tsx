import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type Track = {
  video_id: string;
  title: string;
  channel?: string | null;
  thumbnail?: string | null;
};

export type PlayerControls = {
  play(): void;
  pause(): void;
  seekTo(sec: number): void;
  setVolume(v: number): void;
};

type PlayerCtx = {
  current: Track | null;
  queue: Track[];
  history: Track[];
  fullscreen: boolean;
  isPlaying: boolean;
  position: number;
  duration: number;
  volume: number;
  play: (t: Track, queue?: Track[]) => void;
  enqueue: (t: Track) => void;
  setQueue: (q: Track[]) => void;
  next: () => void;
  prev: () => void;
  stop: () => void;
  toggle: () => void;
  seek: (sec: number) => void;
  setVolume: (v: number) => void;
  openFullscreen: () => void;
  closeFullscreen: () => void;
  // internal
  _setPlaybackState: (p: {
    isPlaying?: boolean;
    position?: number;
    duration?: number;
  }) => void;
  _registerControls: (c: PlayerControls | null) => void;
};

const noop = () => {};
const Ctx = createContext<PlayerCtx>({
  current: null,
  queue: [],
  history: [],
  fullscreen: false,
  isPlaying: false,
  position: 0,
  duration: 0,
  volume: 80,
  play: noop,
  enqueue: noop,
  setQueue: noop,
  next: noop,
  prev: noop,
  stop: noop,
  toggle: noop,
  seek: noop,
  setVolume: noop,
  openFullscreen: noop,
  closeFullscreen: noop,
  _setPlaybackState: noop,
  _registerControls: noop,
});

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Track | null>(null);
  const [queue, setQueueState] = useState<Track[]>([]);
  const [history, setHistory] = useState<Track[]>([]);
  const [fullscreen, setFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(80);
  const controlsRef = useRef<PlayerControls | null>(null);

  const play = useCallback(
    (t: Track, q?: Track[]) => {
      setHistory((h) => (current ? [...h, current] : h));
      setCurrent(t);
      if (q) setQueueState(q.filter((x) => x.video_id !== t.video_id));
    },
    [current],
  );

  const enqueue = useCallback((t: Track) => {
    setQueueState((q) => (q.some((x) => x.video_id === t.video_id) ? q : [...q, t]));
  }, []);

  const next = useCallback(() => {
    if (queue.length === 0) {
      controlsRef.current?.seekTo(0);
      return;
    }
    const [head, ...rest] = queue;
    if (current) setHistory((h) => [...h, current]);
    setPosition(0);
    setDuration(0);
    setCurrent(head);
    setQueueState(rest);
  }, [queue, current]);

  const prev = useCallback(() => {
    if (position > 4) {
      controlsRef.current?.seekTo(0);
      setPosition(0);
      return;
    }
    if (history.length === 0) {
      controlsRef.current?.seekTo(0);
      setPosition(0);
      return;
    }
    const last = history[history.length - 1];
    if (current) setQueueState((q) => [current, ...q]);
    setPosition(0);
    setDuration(0);
    setCurrent(last);
    setHistory((h) => h.slice(0, -1));
  }, [history, current, position]);

  const stop = useCallback(() => {
    setCurrent(null);
    setFullscreen(false);
    setIsPlaying(false);
    setPosition(0);
    setDuration(0);
  }, []);

  const toggle = useCallback(() => {
    if (!controlsRef.current) return;
    if (isPlaying) controlsRef.current.pause();
    else controlsRef.current.play();
  }, [isPlaying]);

  const seek = useCallback((sec: number) => {
    controlsRef.current?.seekTo(sec);
    setPosition(sec);
  }, []);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(100, v));
    setVolumeState(clamped);
    controlsRef.current?.setVolume(clamped);
  }, []);

  const _setPlaybackState = useCallback(
    (p: { isPlaying?: boolean; position?: number; duration?: number }) => {
      if (p.isPlaying !== undefined) setIsPlaying(p.isPlaying);
      if (p.position !== undefined) setPosition(p.position);
      if (p.duration !== undefined) setDuration(p.duration);
    },
    [],
  );

  const _registerControls = useCallback(
    (c: PlayerControls | null) => {
      controlsRef.current = c;
      if (c) c.setVolume(volume);
    },
    [volume],
  );

  const value = useMemo<PlayerCtx>(
    () => ({
      current,
      queue,
      history,
      fullscreen,
      isPlaying,
      position,
      duration,
      volume,
      play,
      enqueue,
      setQueue: setQueueState,
      next,
      prev,
      stop,
      toggle,
      seek,
      setVolume,
      openFullscreen: () => setFullscreen(true),
      closeFullscreen: () => setFullscreen(false),
      _setPlaybackState,
      _registerControls,
    }),
    [
      current,
      queue,
      history,
      fullscreen,
      isPlaying,
      position,
      duration,
      volume,
      play,
      next,
      prev,
      stop,
      toggle,
      seek,
      setVolume,
      _setPlaybackState,
      _registerControls,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const usePlayer = () => useContext(Ctx);
