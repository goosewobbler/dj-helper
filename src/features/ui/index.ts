import {
  AppState,
  UI,
  TrackPreviewEmbedSize,
  Browser,
  TabHistoryAction,
  BandcampTabHomepage,
  AppStore,
} from '../../common/types.js';

export const initialState = {
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

export const handlers = (store: AppStore) => ({
  'UI:TRACK_PREVIEW_EMBED_SIZE_TOGGLED': (trackPreviewEmbedSize: UI['trackPreviewEmbedSize']) =>
    store.setState((state) => ({
      ui: {
        ...state.ui,
        trackPreviewEmbedSize,
      },
    })),
  'UI:WINDOW_BOUNDS_CHANGED': (windowBounds: UI['windowBounds']) =>
    store.setState((state) => ({
      ui: {
        ...state.ui,
        windowBounds,
      },
    })),
  'UI:VERTICAL_SPLITTER_MOVED': ([metaPanelHeight, browserPanelHeight]: [
    UI['verticalSplitterDimensions']['metaPanelHeight'],
    UI['verticalSplitterDimensions']['browserPanelHeight'],
  ]) =>
    store.setState((state) => ({
      ui: {
        ...state.ui,
        verticalSplitterDimensions: { metaPanelHeight, browserPanelHeight },
      },
    })),
  'UI:HORIZONTAL_SPLITTER_MOVED': ([listPaneWidth, browserPaneWidth]: [
    UI['horizontalSplitterDimensions']['listPaneWidth'],
    UI['horizontalSplitterDimensions']['browserPaneWidth'],
  ]) =>
    store.setState((state) => ({
      ui: {
        ...state.ui,
        horizontalSplitterDimensions: { listPaneWidth, browserPaneWidth },
      },
    })),
  'UI:SET_STATUS': (statusText: string) =>
    store.setState((state) => ({
      ui: {
        ...state.ui,
        statusText,
      },
    })),
  'UI:UPDATE_TAB_HISTORY': ({ tabId, action }: { tabId?: Browser['id']; action: TabHistoryAction }) =>
    store.setState((state) => {
      if ([TabHistoryAction.Created, TabHistoryAction.Selected].includes(action)) {
        return { ui: { ...state.ui, tabHistory: [...state.ui.tabHistory, tabId as number] } };
      }
      if (action === TabHistoryAction.Deleted) {
        const updatedHistory = state.ui.tabHistory.filter((historyItem) => historyItem !== tabId);
        return { ui: { ...state.ui, tabHistory: updatedHistory.length ? updatedHistory : [0] } };
      }

      return state;
    }),
  'UI:FOUND_BANDCAMP_COLLECTION_URL': ({ collectionUrl }: { collectionUrl: string }) =>
    store.setState((state) => {
      const bandcampPageUrls = { ...state.ui.bandcampPageUrls };
      bandcampPageUrls[BandcampTabHomepage.CollectionPage] = collectionUrl;
      bandcampPageUrls[BandcampTabHomepage.WishlistPage] = `${collectionUrl}/wishlist`;

      return {
        ui: {
          ...state.ui,
          bandcampPageUrls,
        },
      };
    }),
});

export const selectTrackPreviewEmbedSize = (size: TrackPreviewEmbedSize) => (state: Partial<AppState>) =>
  state.ui?.trackPreviewEmbedSize === size;

export const selectDarkModeEnabled = ({ ui }: Partial<AppState>) => ui?.darkModeEnabled;

export const selectStatusText = ({ ui }: Partial<AppState>) => ui?.statusText;

export const selectHorizontalSplitterDimensions = ({ ui }: Partial<AppState>) =>
  ui?.horizontalSplitterDimensions as UI['horizontalSplitterDimensions'];

export const selectVerticalSplitterDimensions = ({ ui }: Partial<AppState>) =>
  ui?.verticalSplitterDimensions as UI['verticalSplitterDimensions'];
