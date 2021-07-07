import { createSlice } from '@reduxjs/toolkit';
import { AppState, Browser } from '../../common/types';

const initialState: Browser[] = [
  {
    id: 1,
    url: 'https://bandcamp.com',
    title: 'Bandcamp',
    tracks: [],
  },
];

export const slice = createSlice({
  name: 'browser',
  initialState,
  reducers: {
    createBrowser: (state, { payload: { url, title } }) => {
      const newBrowser: Browser = {
        id: state.length + 1,
        url,
        title,
        tracks: [],
      };
      state.push(newBrowser);
    },
    setTracks: (state, { payload: { id, trackIds } }) => {
      const browserToUpdate = state.find((list) => list.id === id);
      if (browserToUpdate) {
        browserToUpdate.tracks = trackIds;
      }
    },
    clearTracks: (state, { payload }) => {
      const browserToUpdate = state.find((list) => list.id === payload);
      if (browserToUpdate) {
        browserToUpdate.tracks = [];
      }
    },
  },
});

export const { createBrowser, setTracks, clearTracks } = slice.actions;

export const selectBrowser = (state: AppState): Browser[] => state.browsers;

export const browserReducer = slice.reducer;
