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
  price: number;
  priceCurrency: string;
};

export type Track = {
  id: number;
  title: string;
  artist: string;
  length: number;
  sources: TrackSource['url'][];
};

export type List = {
  id: number;
  title: string;
  tracks: Track['id'][];
  editing?: boolean;
  oldTitle?: string;
};

export interface AppState {
  lists: List[];
  // tracks: Track[];
  // trackSources: TrackSource[];
}
