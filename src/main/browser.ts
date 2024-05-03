import { URL } from 'node:url';

import { BrowserView, BrowserWindow, ipcMain } from 'electron';

import { selectTrackBySourceUrl, TrackData } from '../features/tracks/index.js';
import { selectActiveBrowser } from '../features/browsers/index.js';
import { BandCurrency, BandData, parseBandcampPageData, TralbumCollectInfo, TralbumData } from './helpers/bandcamp.js';
import { AnyObject, AppStore, Browser, TrackPreviewEmbedSize } from '../common/types.js';
import { log } from './helpers/console.js';
import { getStore, getDispatch } from './store/index.js';

type RawBandcampData = [TralbumData, BandData, TralbumCollectInfo, BandCurrency];

export function sanitiseUrl(url: string) {
  const { origin, pathname } = new URL(url);

  return `${origin}${pathname}`;
}

async function getPageTrackData(view: BrowserView, url: string) {
  const [tralbumData, bandData, tralbumCollectInfo, bandCurrency] = (await view.webContents.executeJavaScript(
    '[ TralbumData, BandData, TralbumCollectInfo, bandCurrency ]',
    true,
  )) as RawBandcampData;
  const bcPageData = parseBandcampPageData(tralbumData, bandData, tralbumCollectInfo, bandCurrency, sanitiseUrl(url));
  log('parsed bandcamp page data', bcPageData);
  return bcPageData;
}

type Sizes = {
  listPaneWidth?: number;
  browserPaneWidth?: number;
  browserPanelHeight?: number;
  metaPanelHeight?: number;
};

type LoadedBrowser = {
  id: Browser['id'];
  view: BrowserView;
  navigate: (url: string, forceNavigate?: boolean) => void;
  setBounds: (sizes?: Sizes) => void;
};

const loadedBrowsers: LoadedBrowser[] = [];

function initBrowserView(store: AppStore, browser: Browser) {
  const { getState } = store;
  const dispatch = getDispatch();
  const view = new BrowserView();
  let currentlyNavigating = false;

  log('creating browser', browser.id);

  function shallowEquals(a: AnyObject, b: AnyObject) {
    return Object.entries(a).every(([key, value]) => value === b[key]);
  }

  const setBounds = (sizes?: Sizes) => {
    const headerBarHeight = 62;
    const bounds = { ...view.getBounds() };
    const state = getState();
    const { trackPreviewEmbedSize } = state.ui;
    const statusBarHeight = trackPreviewEmbedSize === TrackPreviewEmbedSize.Small ? 65 : 145;
    const newBounds = { ...bounds };

    if (sizes) {
      const { listPaneWidth, browserPaneWidth, browserPanelHeight, metaPanelHeight } = sizes;

      if (listPaneWidth && browserPaneWidth) {
        // horizontal resize
        newBounds.x = Math.round(listPaneWidth + 6);
        newBounds.width = Math.round(browserPaneWidth - 5);
      }
      if (browserPanelHeight && metaPanelHeight) {
        // vertical resize
        newBounds.y = Math.round(headerBarHeight + metaPanelHeight + 5);
        newBounds.height = Math.round(browserPanelHeight - statusBarHeight - 65);
      }
    }

    if (!shallowEquals(bounds, newBounds)) {
      log('resizing');
      view.setBounds(newBounds);
    }
  };

  view.webContents.setWindowOpenHandler(({ url }) => {
    log('windowOpenHandler', url);
    dispatch('BROWSER:CREATE', { url: sanitiseUrl(url) });
    return { action: 'deny' };
  });

  view.webContents.on('page-title-updated', (event, title) => {
    dispatch('BROWSER:UPDATE_PAGE_TITLE', { id: browser.id, title });
  });

  view.webContents.on('will-navigate', (event, url) => {
    log('will-navigate', url);
    event.preventDefault();
    dispatch('BROWSER:NAVIGATION_STARTED', { id: browser.id, url: sanitiseUrl(url) });
  });

  view.webContents.on('did-navigate-in-page', (event, url) => {
    dispatch('BROWSER:NAVIGATION_COMPLETED', { id: browser.id, url: sanitiseUrl(url) });
  });

  view.webContents.on('did-finish-load', () => {
    const loadedUrl = view.webContents.getURL();
    dispatch('BROWSER:NAVIGATION_COMPLETED', { id: browser.id, url: loadedUrl });
    currentlyNavigating = false;
    log('loaded url', loadedUrl);

    if (/bandcamp.com/.exec(loadedUrl)) {
      void (async () => {
        const collectionUrl = (await view.webContents.executeJavaScript(
          '$("a[title=\'collection\']").attr("href");',
          true,
        )) as string;

        if (/https:\/\/bandcamp.com\/\w+/.exec(collectionUrl)) {
          dispatch('UI:FOUND_BANDCAMP_COLLECTION_URL', { collectionUrl });
        }
      })();

      if (/track|album/.exec(loadedUrl)) {
        log('url is bandcamp album or track');
        void (async () => {
          const pageTrackData = await getPageTrackData(view, loadedUrl);
          pageTrackData.trackinfo.forEach(({ id, title, title_link, artist, duration }) => {
            // pass price where we have it
            const trackData: TrackData = {
              title,
              artist,
              duration,
              sourceId: id,
              url: title_link,
              priceCurrency: pageTrackData.currency,
            };
            dispatch('TRACK:CREATE', trackData);
            log('creating track', title_link);
            const trackSelector = selectTrackBySourceUrl(title_link);
            const track = trackSelector(getState());
            log('selected browser', browser.id, track);
            // log(getState());
            dispatch('BROWSER:ADD_TRACK', { id: browser.id, trackId: track.id });
          });
        })();
      }
    }
  });

  const canNavigateTo = (url: string): boolean => {
    const currentUrl = view.webContents.getURL();
    return !currentlyNavigating && url !== currentUrl;
  };

  const navigate = (url: string, forceNavigate?: boolean) => {
    if (forceNavigate || canNavigateTo(url)) {
      log('loading URL', url);
      currentlyNavigating = true;
      dispatch('BROWSER:CLEAR_TRACKS', { id: browser.id });

      void view.webContents.loadURL(url);
    }
  };

  setBounds();

  return {
    id: browser.id,
    view,
    navigate,
    setBounds,
  };
}

export function initBrowsers(mainWindow: BrowserWindow): void {
  const store = getStore();
  const { subscribe, getState } = store;

  subscribe(() => {
    const state = getState();
    const activeBrowser = selectActiveBrowser(state);
    if (!activeBrowser) {
      // discard intermediary updates where no browser is active
      log('discarding update');
      return;
    }

    state.browsers.forEach((browser: Browser) => {
      // initialise the browser if it is not loaded
      if (!loadedBrowsers.find((loadedBrowser) => loadedBrowser.id === browser.id)) {
        const { view, navigate, setBounds } = initBrowserView(store, browser);
        mainWindow.addBrowserView(view);
        loadedBrowsers.push({
          id: browser.id,
          view,
          navigate,
          setBounds,
        });
      }
    });

    loadedBrowsers.forEach((loadedBrowser: LoadedBrowser, loadedBrowserIndex: number) => {
      const browserFromState = state.browsers.find((browser) => browser.id === loadedBrowser.id);

      if (!browserFromState) {
        // browser has been removed from state
        mainWindow.removeBrowserView(loadedBrowser.view);
        loadedBrowsers.splice(loadedBrowserIndex, 1);
        log('removed loaded browser', loadedBrowser);
        return;
      }

      if (browserFromState.active) {
        const {
          verticalSplitterDimensions: { browserPanelHeight, metaPanelHeight },
          horizontalSplitterDimensions: { browserPaneWidth, listPaneWidth },
        } = state.ui;
        loadedBrowser.setBounds({ browserPanelHeight, metaPanelHeight, browserPaneWidth, listPaneWidth });
      } else {
        loadedBrowser.view.setBounds({ x: 0, y: 0, width: 0, height: 0 });
      }

      // navigate where necessary
      loadedBrowser.navigate(browserFromState.url);
    });
  });

  ipcMain.handle('init-browsers', () => {
    loadedBrowsers.forEach((loadedBrowser) => {
      const { browsers } = getState();
      const { url } = browsers.find((browser) => loadedBrowser.id === browser.id) as Browser;
      loadedBrowser.navigate(url, true);
    });
  });
}
