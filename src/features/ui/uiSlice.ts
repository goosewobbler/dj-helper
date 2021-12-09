import { createSlice } from '@reduxjs/toolkit';
import { AppState, UI, TrackPreviewEmbedSize } from '../../common/types';

const initialState = {
  statusText: '',
  darkModeEnabled: false,
  windowBounds: { x: 0, y: 0, width: 1500, height: 1000 },
  trackPreviewEmbedSize: TrackPreviewEmbedSize.Small,
} as UI;

export const slice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    trackPreviewEmbedSizeToggled: (
      state,
      { payload: trackPreviewEmbedSize }: { payload: UI['trackPreviewEmbedSize'] },
    ) => ({
      ...state,
      trackPreviewEmbedSize,
    }),
    windowBoundsChanged: (state, { payload: windowBounds }: { payload: UI['windowBounds'] }) => ({
      ...state,
      windowBounds,
    }),
    setStatus: (state, { payload: { statusText } }: { payload: { statusText: string } }) => ({
      ...state,
      statusText,
    }),
  },
});

export const { trackPreviewEmbedSizeToggled, windowBoundsChanged, setStatus } = slice.actions;

export const selectTrackPreviewEmbedSize =
  () =>
  ({ ui }: AppState) =>
    ui.trackPreviewEmbedSize;

export const selectDarkModeEnabled =
  () =>
  ({ ui }: AppState) =>
    ui.darkModeEnabled;

export const selectStatusText =
  () =>
  ({ ui }: AppState) =>
    ui.statusText;

export const uiReducer = slice.reducer;
