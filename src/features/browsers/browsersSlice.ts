import { createSlice } from '@reduxjs/toolkit';
import { AppState, Browser } from '../../common/types';

const initialState: Browser[] = [
  {
    id: 1,
    url: 'https://bandcamp.com',
    title: 'Bandcamp',
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
      };
      state.push(newBrowser);
    },
  },
});

export const { createBrowser } = slice.actions;

export const selectBrowsers = (state: AppState): Browser[] => state.browsers;

export const browsersReducer = slice.reducer;
