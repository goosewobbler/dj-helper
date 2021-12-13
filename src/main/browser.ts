import { BrowserView, BrowserWindow, ipcMain } from 'electron';
import { createTrack, selectTrackBySourceUrl, TrackData } from '../features/tracks/tracksSlice';
import { mediaPaused, mediaPlaying } from '../features/embed/embedSlice';
import {
  addTrack,
  clearTracks,
  createBrowser,
  selectActiveBrowser,
  selectBrowserById,
  updatePageTitle,
  updatePageUrl,
} from '../features/browsers/browsersSlice';
import { BandCurrency, BandData, parseBandcampPageData, TralbumCollectInfo, TralbumData } from './helpers/bandcamp';
import { AppStore, Browser, TrackPreviewEmbedSize } from '../common/types';
import { log } from './helpers/console';

type RawBandcampData = [TralbumData, BandData, TralbumCollectInfo, BandCurrency];

async function getPageTrackData(view: BrowserView, url: string) {
  const [tralbumData, bandData, tralbumCollectInfo, bandCurrency] = (await view.webContents.executeJavaScript(
    '[ TralbumData, BandData, TralbumCollectInfo, bandCurrency ]',
    true,
  )) as RawBandcampData;
  const bcPageData = parseBandcampPageData(tralbumData, bandData, tralbumCollectInfo, bandCurrency, url);
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

function initBrowserView(mainWindow: BrowserWindow, reduxStore: AppStore, browser: Browser) {
  const { dispatch, getState } = reduxStore;
  const view = new BrowserView();
  let currentlyNavigating = false;

  log('creating browser', browser.id);

  const setBounds = (sizes?: Sizes) => {
    const headerBarHeight = 62;
    const newBounds = view.getBounds();
    const state = getState();
    const { trackPreviewEmbedSize } = state.ui;
    const statusBarHeight = trackPreviewEmbedSize === TrackPreviewEmbedSize.Small ? 65 : 145;

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
        log('vertical resize', browserPanelHeight, statusBarHeight);
        newBounds.height = Math.round(browserPanelHeight - statusBarHeight - 65);
      }
    }

    view.setBounds(newBounds);
  };

  view.webContents.setWindowOpenHandler(({ url }) => {
    log('windowOpenHandler', url);
    dispatch(createBrowser({ url }));
    return { action: 'deny' };
  });

  view.webContents.on('media-started-playing', () => {
    void (async () => {
      const titleLinkPlaying = (await view.webContents.executeJavaScript(
        'document.querySelector(".inline_player .title_link").getAttribute("href");',
        true,
      )) as string;
      log('playing from browser', { sourceUrl: titleLinkPlaying });
      const trackData = await getPageTrackData(view, browser.url);
      const playingTrack = trackData.trackinfo.find((track) => track.title_link === titleLinkPlaying);

      if (playingTrack) {
        dispatch(mediaPlaying());
      }
    })();
  });

  view.webContents.on('media-paused', () => {
    log('pausing from browser', Date.now());
    dispatch(mediaPaused());
  });

  view.webContents.on('page-title-updated', (event, title) => {
    dispatch(updatePageTitle({ id: browser.id, title }));
  });

  view.webContents.on('will-navigate', (event, url) => {
    log('will-navigate', url);
    event.preventDefault();
    dispatch(updatePageUrl({ id: browser.id, url }));
  });

  view.webContents.on('did-finish-load', () => {
    const loadedUrl = view.webContents.getURL();
    currentlyNavigating = false;
    log('loaded url', loadedUrl);

    if (/bandcamp.com\/track|album/.exec(loadedUrl)) {
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
          dispatch(createTrack(trackData));
          const trackSelector = selectTrackBySourceUrl(title_link);
          const track = trackSelector(getState());
          log('selected browser', browser.id, track);
          dispatch(addTrack({ id: browser.id, trackId: track.id }));
        });
      })();
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
      dispatch(clearTracks({ id: browser.id }));
      void view.webContents.loadURL(url);
    }
  };

  return {
    view,
    navigate,
    setBounds,
  };
}

export function initBrowsers(mainWindow: BrowserWindow, reduxStore: AppStore): void {
  const { subscribe, getState } = reduxStore;
  const activeBrowserSelector = selectActiveBrowser();

  subscribe(() => {
    const state = getState();

    loadedBrowsers.forEach((loadedBrowser: LoadedBrowser, loadedBrowserIndex: number) => {
      // check if this initialised browser has been removed from the store
      if (!state.browsers.find((browser) => browser.id === loadedBrowser.id)) {
        mainWindow.removeBrowserView(loadedBrowser.view);
        loadedBrowsers.splice(loadedBrowserIndex, 1);
      }

      // navigate where necessary
      const browserSelector = selectBrowserById(loadedBrowser.id);
      const { url } = browserSelector(state);
      loadedBrowser.navigate(url);
    });

    state.browsers.forEach((browser: Browser) => {
      // initialise the browser if it is not loaded
      if (!loadedBrowsers.find((loadedBrowser) => loadedBrowser.id === browser.id)) {
        const { view, navigate, setBounds } = initBrowserView(mainWindow, reduxStore, browser);
        mainWindow.addBrowserView(view);
        loadedBrowsers.push({
          id: browser.id,
          view,
          navigate,
          setBounds,
        });
      }
    });

    loadedBrowsers.forEach((loadedBrowser: LoadedBrowser) => {
      // navigate where necessary
      const browserSelector = selectBrowserById(loadedBrowser.id);
      const { url } = browserSelector(state);
      loadedBrowser.navigate(url);

      // show or hide depending on display status
      const browserIsActive = loadedBrowser.id === activeBrowserSelector(state).id;

      if (!browserIsActive) {
        loadedBrowser.view.setBounds({ x: 0, y: 0, width: 0, height: 0 });
      } else {
        const {
          verticalSplitterDimensions: { browserPanelHeight, metaPanelHeight },
          horizontalSplitterDimensions: { browserPaneWidth, listPaneWidth },
        } = state.ui;
        loadedBrowser.setBounds({ browserPanelHeight, metaPanelHeight, browserPaneWidth, listPaneWidth });
      }
    });
  });

  ipcMain.handle('init-browsers', () => {
    loadedBrowsers.forEach((loadedBrowser) => {
      const { browsers } = getState();
      const { url } = browsers.find((browser) => loadedBrowser.id === browser.id) as Browser;
      loadedBrowser.navigate(url, true);
    });
  });
  ipcMain.handle('resize-browsers', (_event, args: [Sizes]) => {
    const state = getState();
    const activeBrowserId = activeBrowserSelector(state).id;
    const activeBrowser = loadedBrowsers.find((loadedBrowser) => loadedBrowser.id === activeBrowserId) as LoadedBrowser;
    activeBrowser.setBounds(...args);
  });
}
