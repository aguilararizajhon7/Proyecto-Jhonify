import type { YtResult } from "@/servidor/youtube.functions";

export type SuggestionCategory = {
  label: string;
  tracks: YtResult[];
};

// Curated variety: popular music videos across genres.
// Uses YouTube video IDs so they play instantly without needing an API key.
export const suggestions: SuggestionCategory[] = [
  {
    label: "Tendencias",
    tracks: [
      {
        video_id: "kJQP7kiw5Fk",
        title: "Luis Fonsi - Despacito ft. Daddy Yankee",
        channel: "Luis Fonsi",
        thumbnail: "https://i.ytimg.com/vi/kJQP7kiw5Fk/mqdefault.jpg",
      },
      {
        video_id: "JGwWNGJdvx8",
        title: "Ed Sheeran - Shape of You",
        channel: "Ed Sheeran",
        thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg",
      },
      {
        video_id: "RgKAFK5djSk",
        title: "Wiz Khalifa - See You Again ft. Charlie Puth",
        channel: "Wiz Khalifa",
        thumbnail: "https://i.ytimg.com/vi/RgKAFK5djSk/mqdefault.jpg",
      },
      {
        video_id: "OPf0YbXqDm0",
        title: "Mark Ronson - Uptown Funk ft. Bruno Mars",
        channel: "Mark Ronson",
        thumbnail: "https://i.ytimg.com/vi/OPf0YbXqDm0/mqdefault.jpg",
      },
    ],
  },
  {
    label: "Hecho para ti",
    tracks: [
      {
        video_id: "TmKh7lAwnBI",
        title: "Bad Bunny - Tití Me Preguntó",
        channel: "Bad Bunny",
        thumbnail: "https://i.ytimg.com/vi/TmKh7lAwnBI/mqdefault.jpg",
      },
      {
        video_id: "cbfMbF--Sq0",
        title: "KAROL G, Shakira - TQG",
        channel: "KAROL G",
        thumbnail: "https://i.ytimg.com/vi/cbfMbF--Sq0/mqdefault.jpg",
      },
      {
        video_id: "pSUydWEqKwE",
        title: "Rauw Alejandro - Todo de Ti",
        channel: "Rauw Alejandro",
        thumbnail: "https://i.ytimg.com/vi/pSUydWEqKwE/mqdefault.jpg",
      },
      {
        video_id: "L_jWHffIx5E",
        title: "Smash Mouth - All Star",
        channel: "Smash Mouth",
        thumbnail: "https://i.ytimg.com/vi/L_jWHffIx5E/mqdefault.jpg",
      },
    ],
  },
  {
    label: "Nuevos lanzamientos",
    tracks: [
      {
        video_id: "fJ9rUzIMcZQ",
        title: "Queen - Bohemian Rhapsody",
        channel: "Queen Official",
        thumbnail: "https://i.ytimg.com/vi/fJ9rUzIMcZQ/mqdefault.jpg",
      },
      {
        video_id: "hTWKbfoikeg",
        title: "Nirvana - Smells Like Teen Spirit",
        channel: "Nirvana",
        thumbnail: "https://i.ytimg.com/vi/hTWKbfoikeg/mqdefault.jpg",
      },
      {
        video_id: "9bZkp7q19f0",
        title: "PSY - Gangnam Style",
        channel: "officialpsy",
        thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg",
      },
      {
        video_id: "60ItHLz5WEA",
        title: "Alan Walker - Faded",
        channel: "Alan Walker",
        thumbnail: "https://i.ytimg.com/vi/60ItHLz5WEA/mqdefault.jpg",
      },
    ],
  },
  {
    label: "Chill & Lo-Fi",
    tracks: [
      {
        video_id: "jfKfPfyJRdk",
        title: "lofi hip hop radio 📚 beats to relax/study to",
        channel: "Lofi Girl",
        thumbnail: "https://i.ytimg.com/vi/jfKfPfyJRdk/mqdefault.jpg",
      },
      {
        video_id: "5qap5aO4i9A",
        title: "lofi hip hop radio - beats to sleep/chill to",
        channel: "Lofi Girl",
        thumbnail: "https://i.ytimg.com/vi/5qap5aO4i9A/mqdefault.jpg",
      },
      {
        video_id: "DWcJFNfaw9c",
        title: "Daft Punk - Get Lucky ft. Pharrell Williams",
        channel: "Daft Punk",
        thumbnail: "https://i.ytimg.com/vi/DWcJFNfaw9c/mqdefault.jpg",
      },
      {
        video_id: "y6120QOlsfU",
        title: "Sandstorm - Darude",
        channel: "Darude",
        thumbnail: "https://i.ytimg.com/vi/y6120QOlsfU/mqdefault.jpg",
      },
    ],
  },
];
