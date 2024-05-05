import { PlayerTimestamp, Track } from "discord-player";

export type Timeline = {
  readonly timestamp: PlayerTimestamp;
  readonly volume: number;
  readonly paused: boolean;
  readonly track: Track<unknown> | null;
  pause(): boolean;
  resume(): boolean;
  setVolume(vol: number): boolean;
  setPosition(time: number): Promise<boolean>;
};
