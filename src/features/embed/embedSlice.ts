import { createSlice } from '@reduxjs/toolkit';
import { AppState, Embed, Track, TrackSource } from '../../common/types';

const initialState = {
  isPlaying: false,
} as Embed;

export type PlayRequest = { trackSourceId: TrackSource['sourceId']; context: Embed['trackContext'] };

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
      const previousTrackWasPlaying = state.isPlaying;
      return {
        ...state,
        triggerLoad: false,
        triggerPlay: !previousTrackWasPlaying,
        triggerPause: false,
        isPlaying: false,
        isPaused: false,
        isLoading: false,
      };
    },
    requestPlay: (state, { payload: { trackSourceId, context } }: { payload: PlayRequest }) => {
      const previousTrack = state.trackSourceId;

      if (!trackSourceId || state.isLoading) {
        return state;
      }

      if (previousTrack === trackSourceId) {
        // requested track already loaded - trigger play without load
        return { ...state, triggerPlay: true };
      }

      return { ...state, trackSourceId, trackContext: context, triggerLoad: true };
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

// TODO: rationalise trackSourceId vs trackId here

export const selectTrackByEmbedLoaded =
  () =>
  (state: AppState): Track =>
    state.tracks.find((track) => track.id === state.embed.trackSourceId) as Track;

export const trackIsPlaying =
  ({ trackId }: { trackId: Track['id'] }) =>
  ({ embed }: AppState): boolean =>
    embed.trackSourceId === trackId && embed.isPlaying;

export const trackIsLoaded =
  ({ trackId }: { trackId: Track['id'] }) =>
  ({ embed }: AppState): boolean =>
    embed.trackSourceId === trackId;

export const embedReducer = slice.reducer;
