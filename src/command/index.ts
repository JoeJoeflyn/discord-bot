import * as urban_dictionary from "./dictionary";
import * as asks from "./gemini";
import { lyrics, pause, play, resume, shuffle, skip, stop } from "./music";
import * as ping from "./ping";
import * as help from "./help";
import * as github from "./github";
import * as football from "./football";

export const commands = {
  ping,
  urban_dictionary,
  asks,
  play,
  stop,
  skip,
  pause,
  resume,
  shuffle,
  lyrics,
  help,
  github,
  football,
};
