export type VideoHighlights = {
  link: string;
  thumbnail: string;
  duration: string;
};

export type Team = {
  name: string;
  score: string;
  thumbnail: string;
};

export type Game = {
  tournament: string;
  stadium: string;
  status: string;
  date: string;
  time: string;
  video_highlights: VideoHighlights;
  teams: Team[];
};
