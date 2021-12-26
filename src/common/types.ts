import { AnyAction, ThunkAction, ThunkDispatch, Action, Unsubscribe } from '@reduxjs/toolkit';
import { Rectangle } from 'electron';

export type AnyObject = Record<string, unknown>;
export interface LooseObject {
  [Key: string]: AnyObject | [] | string[] | string | number | boolean;
}

export enum EmbedStatus {
  Idle = 'IDLE',
  LoadRequested = 'LOAD_REQUESTED',
  Loaded = 'LOADED',
  PlayRequested = 'PLAY_REQUESTED',
  Playing = 'PLAYING',
  PauseRequested = 'PAUSE_REQUESTED',
  Paused = 'PAUSED',
}

export enum LoadContextType {
  Browser = 'BROWSER',
  List = 'LIST',
  Settings = 'SETTINGS',
}

export enum TrackPreviewEmbedSize {
  Small = 'SMALL',
  Medium = 'MEDIUM',
}

export enum BandcampTabHomepage {
  FrontPage = 'FRONT',
  CollectionPage = 'COLLECTION',
  WishlistPage = 'WISHLIST',
}

export enum TabHistoryAction {
  Created = 'CREATED',
  Deleted = 'DELETED',
  Selected = 'SELECTED',
}

export type LoadContext = {
  contextId?: number;
  contextType: LoadContextType;
};

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
  active: boolean;
  loading: boolean;
};

export type Embed = {
  autoplayEnabled: boolean;
  status: EmbedStatus;
  loadContext?: LoadContext;
  trackId?: Track['id'];
};

export type UI = {
  statusText: string;
  bandcampPageUrls: {
    [BandcampTabHomepage.FrontPage]: string;
    [BandcampTabHomepage.CollectionPage]?: string;
    [BandcampTabHomepage.WishlistPage]?: string;
  };
  bandcampTabHomepage: BandcampTabHomepage;
  darkModeEnabled: boolean;
  windowBounds: Rectangle;
  horizontalSplitterDimensions: {
    listPaneWidth: number;
    browserPaneWidth: number;
  };
  verticalSplitterDimensions: {
    browserPanelHeight: number;
    metaPanelHeight: number;
  };
  trackPreviewEmbedSize: TrackPreviewEmbedSize;
  tabHistory: Browser['id'][];
};
export interface AppState {
  embed: Embed;
  lists: List[];
  tracks: Track[];
  browsers: Browser[];
  ui: UI;
}

export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>;
export type Dispatch = ThunkDispatch<AppState, undefined, AnyAction>;
export type AppStore = {
  dispatch: Dispatch;
  getState: () => AppState;
  subscribe: (listener: () => void) => Unsubscribe;
};
