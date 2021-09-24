import { createSlice } from '@reduxjs/toolkit';
import { AppState, Browser } from '../../common/types';

const initialState: Browser[] = [
  {
    id: 1,
    url: 'https://bandcamp.com/wiggleweaver',
    title: 'Bandcamp',
  },
]; // set initialState to an empty array once tab functionality is complete

export const slice = createSlice({
  name: 'browsers',
  initialState,
  reducers: {
    createBrowser: (state, { payload: { url, title } }: { payload: { url: string; title: string } }) => {
      const newBrowser: Browser = {
        id: state.length + 1,
        url,
        title,
      };
      return [...state, newBrowser];
    },
    updatePageUrl: (state, { payload: { id, url } }: { payload: { id: number; url: string } }) =>
      state.map((browser) => (browser.id === id ? { ...browser, url, title: 'Loading...' } : browser)),
    updatePageTitle: (state, { payload: { id, title } }: { payload: { id: number; title: string } }) =>
      state.map((browser) => (browser.id === id ? { ...browser, title } : browser)),
  },
});

export const { createBrowser, updatePageUrl, updatePageTitle } = slice.actions;

export const selectBrowsers = (state: AppState): Browser[] => state.browsers;

export const selectBrowserById =
  (id: number) =>
  (state: AppState): Browser =>
    state.browsers.find((browser) => browser.id === id) as Browser;

export const browsersReducer = slice.reducer;

export const reducers = slice.caseReducers;
