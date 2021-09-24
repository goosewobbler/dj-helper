import { createSlice } from '@reduxjs/toolkit';
import { AppState, Embed, Track } from '../../common/types';

const initialState = {} as Embed;

export const slice = createSlice({
  name: 'embed',
  initialState,
  reducers: {
    loadTrack: (
      state,
      { payload: { trackId, context } }: { payload: { trackId: Track['id']; context: Embed['loadContext'] } },
    ) => ({
      ...state,
      loadedTrackId: trackId,
      loadContext: context,
      isPlaying: false,
    }),
    setPlaying: (state) => ({
      ...state,
      isPlaying: true,
    }),
    setPaused: (state) => ({
      ...state,
      isPlaying: false,
    }),
    setPlayContext: (state, { payload: { context } }: { payload: { context: Embed['playContext'] } }) => ({
      ...state,
      playContext: context,
    }),
  },
});

export const { loadTrack, setPlaying, setPaused, setPlayContext } = slice.actions;

export const selectTrackByEmbedLoaded =
  () =>
  (state: AppState): Track =>
    state.tracks.find((track) => track.id === state.embed.loadedTrackId) as Track;

export const trackIsPlaying =
  ({ trackId }: { trackId: Track['id'] }) =>
  ({ embed }: AppState): boolean =>
    embed.loadedTrackId === trackId && embed.isPlaying;

export const trackIsLoaded =
  ({ trackId }: { trackId: Track['id'] }) =>
  ({ embed }: AppState): boolean =>
    embed.loadedTrackId === trackId;

export const getPlayContext =
  () =>
  ({ embed }: AppState): string =>
    embed.playContext;

export const embedReducer = slice.reducer;
