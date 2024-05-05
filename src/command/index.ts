import * as urban_dictionary from "./dictionary";
import * as asks from "./gemini";
import { pause, play, resume, shuffle, skip, stop } from "./music";
import * as ping from "./ping";
import * as help from "./help";

export const commands = {
  ping,
  urban_dictionary,
  asks,
  play,
  stop,
  skip,
  pause,
  shuffle,
  resume,
  help,
};
