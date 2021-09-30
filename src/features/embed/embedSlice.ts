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
    }),
    setPaused: (state) => ({
      ...state,
      triggerLoad: false,
      triggerPlay: false,
      triggerPause: false,
      isPlaying: false,
      isPaused: true,
      isLoading: false,
    }),
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
      log('load complete setting triggerPlay', !state.triggerLoad);
      return {
        ...state,
        triggerLoad: false,
        triggerPlay: true,
        triggerPause: false,
        triggerContext: 'loadComplete',
        isPlaying: false,
        isPaused: false,
        isLoading: false,
      };
    },
    requestPlay: (state, { payload: { trackId, context } }: { payload: PlayRequest }) => {
      const previousTrack = state.trackId;

      if (!trackId || state.isLoading) {
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

export const { requestPlay, requestPause, setPlaying, setPaused, setLoading, setLoadComplete } = slice.actions;

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
