import { createSlice } from '@reduxjs/toolkit';
import { AppState, Embed, Track } from '../../common/types';
import { log } from '../../main/helpers/console';

const initialState = {
  triggerLoad: false,
  triggerPlay: false,
  triggerPause: false,
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  isResizing: false,
  // triggerResize, triggerPlayAfterLoad
} as Embed;

export type PlayRequest = { trackId: Track['id']; context: Embed['trackContext'] };

export const slice = createSlice({
  name: 'embed',
  initialState,
  reducers: {
    setPlaying: (state) => ({
      ...state,
      triggerLoad: false,
      triggerPlay: false,
      triggerPause: false,
      isPlaying: true,
      isPaused: false,
      isLoading: false,
      isResizing: false,
    }),
    setPaused: (state) => {
      if (!state.triggerPause) {
        // discard pause events that weren't triggered
        return {
          ...state,
          triggerLoad: false,
          triggerPlay: false,
          triggerPause: false,
          isPlaying: false,
          isPaused: false,
          isLoading: false,
          isResizing: false,
        };
      }
      return {
        ...state,
        triggerLoad: false,
        triggerPlay: false,
        triggerPause: false,
        isPlaying: false,
        isPaused: true,
        isLoading: false,
        isResizing: false,
      };
    },
    setLoading: (state) => ({
      ...state,
      triggerLoad: false,
      triggerPlay: false,
      triggerPause: false,
      isPlaying: false,
      isPaused: false,
      isLoading: true,
    }),
    setLoadComplete: (state) => {
      log('load complete');
      if (state.isResizing) {
        // load after resize does not trigger play unless already playing
        log('isResizing');
        return {
          ...state,
          triggerLoad: false,
          triggerPlay: false,
          triggerPause: false,
          isPlaying: false,
          isPaused: false,
          isLoading: false,
          isResizing: false,
        };
      }
      return {
        ...state,
        triggerLoad: false,
        triggerPlay: true,
        triggerPause: false,
        isPlaying: false,
        isPaused: false,
        isLoading: false,
        isResizing: false,
        triggerContext: 'loadComplete',
      };
    },
    requestResize: (state) => {
      log('resize requested', state.trackId);
      return {
        ...state,
        isResizing: true,
        triggerLoad: state.trackId !== undefined, // triggerLoad if there is a track to load
      };
    },
    requestLoad: (state) => {
      if (!state.trackId || state.isLoading) {
        return state;
      }

      return { ...state, triggerLoad: true };
    },
    requestPlay: (state, { payload: { trackId, context } }: { payload: PlayRequest }) => {
      const previousTrack = state.trackId;
      log('request play', state);

      if (!trackId || state.isLoading) {
        log('not playing', trackId, state.isLoading);
        return state;
      }

      if (previousTrack === trackId) {
        // requested track already loaded - trigger play without load
        return { ...state, triggerPlay: true };
      }

      return { ...state, trackId, trackContext: context, triggerLoad: true };
    },
    requestPause: (state) => {
      if (state.isLoading) {
        return state;
      }

      return { ...state, triggerPause: true };
    },
  },
});

export const {
  requestLoad,
  requestPlay,
  requestPause,
  requestResize,
  setPlaying,
  setPaused,
  setLoading,
  setLoadComplete,
} = slice.actions;

export const selectTrackByEmbedLoaded =
  () =>
  (state: AppState): Track =>
    state.tracks.find((track) => track.id === state.embed.trackId) as Track;

export const trackIsPlaying =
  ({ trackId }: { trackId: Track['id'] }) =>
  ({ embed }: AppState): boolean =>
    embed.trackId === trackId && embed.isPlaying;

export const trackIsLoaded =
  ({ trackId }: { trackId: Track['id'] }) =>
  ({ embed }: AppState): boolean =>
    embed.trackId === trackId;

export const embedReducer = slice.reducer;
