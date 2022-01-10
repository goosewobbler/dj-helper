import { createSlice } from '@reduxjs/toolkit';
import {
  AppState,
  UI,
  TrackPreviewEmbedSize,
  Browser,
  TabHistoryAction,
  BandcampTabHomepage,
} from '../../common/types';

const initialState = {
  statusText: '',
  bandcampPageUrls: {
    [BandcampTabHomepage.FrontPage]: 'https://bandcamp.com',
  },
  bandcampTabHomepage: BandcampTabHomepage.FrontPage,
  darkModeEnabled: false,
  windowBounds: { x: 0, y: 0, width: 1500, height: 1000 },
  horizontalSplitterDimensions: { listPaneWidth: 538, browserPaneWidth: 962 },
  verticalSplitterDimensions: { browserPanelHeight: 547, metaPanelHeight: 326 },
  tabHistory: [0],
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
    verticalSplitterMoved: (
      state,
      {
        payload: [metaPanelHeight, browserPanelHeight],
      }: {
        payload: [
          UI['verticalSplitterDimensions']['metaPanelHeight'],
          UI['verticalSplitterDimensions']['browserPanelHeight'],
        ];
      },
    ) => ({
      ...state,
      verticalSplitterDimensions: { metaPanelHeight, browserPanelHeight },
    }),
    horizontalSplitterMoved: (
      state,
      {
        payload: [listPaneWidth, browserPaneWidth],
      }: {
        payload: [
          UI['horizontalSplitterDimensions']['listPaneWidth'],
          UI['horizontalSplitterDimensions']['browserPaneWidth'],
        ];
      },
    ) => ({
      ...state,
      horizontalSplitterDimensions: { listPaneWidth, browserPaneWidth },
    }),
    setStatus: (state, { payload: { statusText } }: { payload: { statusText: string } }) => ({
      ...state,
      statusText,
    }),
    updateTabHistory: (
      state,
      { payload: { tabId, action } }: { payload: { tabId?: Browser['id']; action: TabHistoryAction } },
    ) => {
      if ([TabHistoryAction.Created, TabHistoryAction.Selected].includes(action)) {
        return { ...state, tabHistory: [...state.tabHistory, tabId as number] };
      }
      if (action === TabHistoryAction.Deleted) {
        const updatedHistory = state.tabHistory.filter((historyItem) => historyItem !== tabId);
        return { ...state, tabHistory: updatedHistory.length ? updatedHistory : [0] };
      }

      return state;
    },
    foundBandcampCollectionUrl: (state, { payload: { collectionUrl } }: { payload: { collectionUrl: string } }) => {
      const bandcampPageUrls = { ...state.bandcampPageUrls };
      bandcampPageUrls[BandcampTabHomepage.CollectionPage] = collectionUrl;
      bandcampPageUrls[BandcampTabHomepage.WishlistPage] = `${collectionUrl}/wishlist`;
      return {
        ...state,
        bandcampPageUrls,
      };
    },
  },
});

export const {
  trackPreviewEmbedSizeToggled,
  windowBoundsChanged,
  verticalSplitterMoved,
  horizontalSplitterMoved,
  setStatus,
  updateTabHistory,
  foundBandcampCollectionUrl,
} = slice.actions;

export const selectTrackPreviewEmbedSize = ({ ui }: AppState) => ui.trackPreviewEmbedSize;

export const selectDarkModeEnabled = ({ ui }: AppState) => ui.darkModeEnabled;

export const selectStatusText = ({ ui }: AppState) => ui.statusText;

export const selectHorizontalSplitterDimensions = ({ ui }: AppState) => ui.horizontalSplitterDimensions;

export const selectVerticalSplitterDimensions = ({ ui }: AppState) => ui.verticalSplitterDimensions;

export const uiReducer = slice.reducer;
