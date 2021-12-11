import { createSlice } from '@reduxjs/toolkit';
import { AppState, Browser, Track } from '../../common/types';

const initialState: Browser[] = [
  {
    id: 1,
    url: 'https://bandcamp.com/wiggleweaver/wishlist',
    title: 'Bandcamp',
    tracks: [],
    active: true,
  },
]; // set initialState to an empty array once tab functionality is complete

export const slice = createSlice({
  name: 'browsers',
  initialState,
  reducers: {
    createBrowser: (
      state,
      {
        payload: { url = initialState[0].url, title = initialState[0].title },
      }: { payload: { url: string; title: string } },
    ) => {
      const newBrowser: Browser = {
        id: state.length + 1,
        url,
        title,
        tracks: [],
        active: true,
      };
      // existing browsers set to inactive
      const existingBrowsers = state.map((browser) => ({ ...browser, active: false }));
      return [...existingBrowsers, newBrowser];
    },
    updatePageUrl: (state, { payload: { id, url } }: { payload: { id: number; url: string } }) =>
      state.map((browser) => (browser.id === id ? { ...browser, url, title: 'Loading...' } : browser)),
    updatePageTitle: (state, { payload: { id, title } }: { payload: { id: number; title: string } }) =>
      state.map((browser) => (browser.id === id ? { ...browser, title } : browser)),
    addTrack: (state, { payload: { id, trackId } }: { payload: { id: number; trackId: number } }) =>
      state.map((browser) => (browser.id === id ? { ...browser, tracks: [...browser.tracks, trackId] } : browser)),
    clearTracks: (state, { payload: { id } }: { payload: { id: number } }) =>
      state.map((browser) => (browser.id === id ? { ...browser, tracks: [] } : browser)),
  },
});

export const { createBrowser, updatePageUrl, updatePageTitle, addTrack, clearTracks } = slice.actions;

export const selectBrowsers = (state: AppState): Browser[] => state.browsers;

export const selectBrowserById =
  (id: number) =>
  (state: AppState): Browser =>
    state.browsers.find((browser) => browser.id === id) as Browser;

export const selectActiveBrowser =
  () =>
  (state: AppState): Browser =>
    state.browsers.find((browser) => browser.active) as Browser;

export const getNextTrackOnMetaPanel =
  ({ id, currentTrackId }: { id: number; currentTrackId: number }) =>
  (state: AppState): Track['id'] => {
    const panelTracks = (state.browsers.find((browser) => browser.id === id) as Browser).tracks;
    const currentTrackIndex = panelTracks.findIndex((track) => track === currentTrackId);
    return panelTracks[currentTrackIndex + 1];
  };

export const browsersReducer = slice.reducer;

export const reducers = slice.caseReducers;
