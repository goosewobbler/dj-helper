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
    setPlaying: (state, { payload: { context } }: { payload: { context: Embed['playContext'] } }) => ({
      ...state,
      isPlaying: true,
      playContext: context,
    }),
    setPaused: (state, { payload: { context } }: { payload: { context: Embed['playContext'] } }) => ({
      ...state,
      isPlaying: false,
      playContext: context,
    }),
  },
});

export const { loadTrack, setPlaying, setPaused } = slice.actions;

export const selectTrackByEmbedLoaded =
  () =>
  (state: AppState): Track =>
    state.tracks.filter((track) => track.id === state.embed.loadedTrackId)[0];

export const trackIsPlaying =
  ({ trackId }: { trackId: Track['id'] }) =>
  ({ embed }: AppState): boolean =>
    embed.loadedTrackId === trackId && embed.isPlaying;

export const trackIsLoaded =
  ({ trackId }: { trackId: Track['id'] }) =>
  ({ embed }: AppState): boolean =>
    embed.loadedTrackId === trackId;

export const embedReducer = slice.reducer;
