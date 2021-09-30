import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';

export type AnyObject = Record<string, unknown>;
export interface LooseObject {
  [Key: string]: AnyObject | [] | string[] | string | number | boolean;
}

export type Dispatch = ThunkDispatch<AppState, undefined, AnyAction>;

export interface Response {
  body: string;
  headers: Headers;
  statusCode: number;
}

export interface NetworkSystem {
  get(url: string): Promise<Response | undefined>;
}

export type TrackSource = {
  url: string;
  sourceId: number;
  price?: number;
  priceCurrency?: string;
};

export type Track = {
  id: number;
  title: string;
  artist: string;
  duration: number;
  sources: TrackSource[];
  browserId?: number;
};

export type List = {
  id: number;
  title: string;
  tracks: Track['id'][];
  active?: boolean;
  editing?: boolean;
  oldTitle?: string;
};

export type Browser = {
  id: number;
  url: string;
  title: string;
  tracks: Track['id'][];
};

export type Embed = {
  triggerLoad: boolean;
  triggerPlay: boolean;
  triggerPause: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  trackContext?: string;
  trackId?: Track['id'];
};

export type Settings = {
  darkModeEnabled: boolean;
  autoplayEnabled: boolean;
  trackPreviewEmbedSize: 'small' | 'medium';
};

export interface AppState {
  embed: Embed;
  lists: List[];
  tracks: Track[];
  browsers: Browser[];
  settings: Settings;
}
