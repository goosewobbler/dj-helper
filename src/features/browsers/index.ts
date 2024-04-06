import { AppState, AppStore, Browser, Track } from '../../common/types.js';
import { log } from '../../main/helpers/console.js';

export const initialState: Browser[] = [
  {
    id: 0,
    url: 'https://bandcamp.com/login',
    title: 'Loading...',
    tracks: [],
    active: true,
    loading: true,
  },
];

export const getActiveBrowser = (browsers: Browser[]): Browser =>
  browsers.find((browser) => browser.active === true) || browsers[0];

export const selectBrowsers = (state: AppState): Browser[] => state.browsers;

export const selectActiveBrowser = (state: AppState): Browser => getActiveBrowser(state.browsers);

export const selectNextTrackOnMetaPanel =
  ({ id, currentTrackId }: { id: number; currentTrackId: number }) =>
  (state: Partial<AppState>): Track['id'] | undefined => {
    const browser = state.browsers?.find((stateBrowser) => stateBrowser.id === id) as Browser;
    if (!browser) {
      return undefined;
    }
    const currentTrackIndex = browser.tracks.findIndex((track) => track === currentTrackId);
    return browser.tracks[currentTrackIndex + 1];
  };

export const selectPreviousTrackOnMetaPanel =
  ({ id, currentTrackId }: { id: number; currentTrackId: number }) =>
  (state: Partial<AppState>): Track['id'] | undefined => {
    const browser = state.browsers?.find((stateBrowser) => stateBrowser.id === id) as Browser;
    if (!browser) {
      return undefined;
    }
    const currentTrackIndex = browser.tracks.findIndex((track) => track === currentTrackId);
    return browser.tracks[currentTrackIndex - 1];
  };

export const handlers = (store: AppStore) => ({
  'BROWSER:CREATE': ({ url = initialState[0].url, title = initialState[0].title }: { url?: string; title?: string }) =>
    store.setState((state) => {
      const existingBrowsers = state.browsers;
      const newBrowser: Browser = {
        id: existingBrowsers.length,
        url,
        title,
        tracks: [],
        active: true,
        loading: true,
      };
      // existing browsers set to inactive
      const inactiveBrowsers = existingBrowsers.map((browser) => ({ ...browser, active: false }));
      return { browsers: [...inactiveBrowsers, newBrowser] };
    }),
  'BROWSER:NAVIGATION_STARTED': ({ id, url }: { id: number; url: string }) =>
    store.setState((state) => ({
      browsers: state.browsers.map((browser) =>
        browser.id === id ? { ...browser, url, title: 'Loading...', loading: true } : browser,
      ),
    })),
  'BROWSER:NAVIGATION_COMPLETED': ({ id, url }: { id: number; url: string }) =>
    store.setState((state) => ({
      browsers: state.browsers.map((browser) => (browser.id === id ? { ...browser, url, loading: false } : browser)),
    })),
  'BROWSER:UPDATE_PAGE_TITLE': ({ id, title }: { id: number; title: string }) =>
    store.setState((state) => ({
      browsers: state.browsers.map((browser) => (browser.id === id ? { ...browser, title } : browser)),
    })),
  'BROWSER:ADD_TRACK': ({ id, trackId }: { id: number; trackId: number }) =>
    store.setState((state) => ({
      browsers: state.browsers.map((browser) =>
        browser.id === id ? { ...browser, tracks: [...browser.tracks, trackId] } : browser,
      ),
    })),
  'BROWSER:CLEAR_TRACKS': ({ id }: { id: number }) =>
    store.setState((state) => ({
      browsers: state.browsers.map((browser) => (browser.id === id ? { ...browser, tracks: [] } : browser)),
    })),
  'BROWSER:TAB_SELECTED': ({ id }: { id: number }) =>
    store.setState((state) => ({
      browsers: state.browsers.map((browser) => {
        log('checking if should be active', `${browser.id} === ${id}`, browser.id === id);
        return { ...browser, active: browser.id === id };
      }),
    })),
  'BROWSER:DELETE': ({ id }: { id: number }) =>
    store.setState((state) => ({
      browsers: state.browsers
        .filter((browser) => browser.id !== id)
        .map((browser, index) => ({ ...browser, id: index })),
    })),
});
