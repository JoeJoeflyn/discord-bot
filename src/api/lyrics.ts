import * as cheerio from "cheerio";
import fetch from "node-fetch";

export async function getLyrics(artist: string, songTitle: string) {
  artist = artist.toLowerCase();
  songTitle = songTitle.toLowerCase();

  artist = artist.replace(/[^a-z0-9]+/g, "");
  songTitle = songTitle.replace(/[^a-z0-9]+/g, "");

  if (artist.startsWith("the")) {
    artist = artist.slice(3);
  }

  const url = `http://azlyrics.com/lyrics/${artist}/${songTitle}.html`;

  try {
    const response = await fetch(url);
    const body = await response.text();
    const $ = cheerio.load(body);

    const lyrics = $("div.ringtone").nextAll("div").eq(0).text().trim();

    return lyrics;
  } catch (e) {
    return `Exception occurred \n${e}`;
  }
}
