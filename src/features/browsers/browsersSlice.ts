import { createSlice } from '@reduxjs/toolkit';
import { AppState, Browser, Track } from '../../common/types';
import { log } from '../../main/helpers/console';

const initialState: Browser[] = [
  {
    id: 0,
    url: 'https://bandcamp.com/login',
    title: 'Loading...',
    tracks: [],
    active: true,
    loading: true,
  },
];

export const slice = createSlice({
  name: 'browsers',
  initialState,
  reducers: {
    createBrowser: (
      state,
      {
        payload: { url = initialState[0].url, title = initialState[0].title },
      }: { payload: { url?: string; title?: string } },
    ) => {
      const newBrowser: Browser = {
        id: state.length,
        url,
        title,
        tracks: [],
        active: true,
        loading: true,
      };
      // existing browsers set to inactive
      const existingBrowsers = state.map((browser) => ({ ...browser, active: false }));
      return [...existingBrowsers, newBrowser];
    },
    navigationStarted: (state, { payload: { id, url } }: { payload: { id: number; url: string } }) =>
      state.map((browser) => (browser.id === id ? { ...browser, url, title: 'Loading...', loading: true } : browser)),
    navigationCompleted: (state, { payload: { id, url } }: { payload: { id: number; url: string } }) =>
      state.map((browser) => (browser.id === id ? { ...browser, url, loading: false } : browser)),
    updatePageTitle: (state, { payload: { id, title } }: { payload: { id: number; title: string } }) =>
      state.map((browser) => (browser.id === id ? { ...browser, title } : browser)),
    addTrack: (state, { payload: { id, trackId } }: { payload: { id: number; trackId: number } }) =>
      state.map((browser) => (browser.id === id ? { ...browser, tracks: [...browser.tracks, trackId] } : browser)),
    clearTracks: (state, { payload: { id } }: { payload: { id: number } }) =>
      state.map((browser) => (browser.id === id ? { ...browser, tracks: [] } : browser)),
    tabSelected: (state, { payload: { id } }: { payload: { id: number } }) =>
      state.map((browser) => {
        log('checking if should be active', `${browser.id} === ${id}`, browser.id === id);
        return { ...browser, active: browser.id === id };
      }),
    deleteBrowser: (state, { payload: { id } }: { payload: { id: number } }) =>
      state.filter((browser) => browser.id !== id).map((browser, index) => ({ ...browser, id: index })),
  },
});

export const {
  createBrowser,
  navigationStarted,
  navigationCompleted,
  updatePageTitle,
  addTrack,
  clearTracks,
  tabSelected,
  deleteBrowser,
} = slice.actions;

export const selectBrowsers = (state: AppState): Browser[] => state.browsers;

export const selectBrowserById =
  (id: number) =>
  (state: AppState): Browser =>
    state.browsers.find((browser) => browser.id === id) as Browser;

export const selectActiveBrowser =
  () =>
  (state: AppState): Browser =>
    (state.browsers.find((browser) => browser.active === true) as Browser) || state.browsers[0];

export const getNextTrackOnMetaPanel =
  ({ id, currentTrackId }: { id: number; currentTrackId: number }) =>
  (state: AppState): Track['id'] | undefined => {
    const browser = state.browsers.find((stateBrowser) => stateBrowser.id === id) as Browser;
    if (!browser) {
      return undefined;
    }
    const currentTrackIndex = browser.tracks.findIndex((track) => track === currentTrackId);
    return browser.tracks[currentTrackIndex + 1];
  };

export const getPreviousTrackOnMetaPanel =
  ({ id, currentTrackId }: { id: number; currentTrackId: number }) =>
  (state: AppState): Track['id'] | undefined => {
    const browser = state.browsers.find((stateBrowser) => stateBrowser.id === id) as Browser;
    if (!browser) {
      return undefined;
    }
    const currentTrackIndex = browser.tracks.findIndex((track) => track === currentTrackId);
    return browser.tracks[currentTrackIndex - 1];
  };

export const browsersReducer = slice.reducer;

export const reducers = slice.caseReducers;
