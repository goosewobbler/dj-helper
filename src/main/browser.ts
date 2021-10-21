import { BrowserView, BrowserWindow, ipcMain } from 'electron';
import { createTrack, selectTrackBySourceUrl, TrackData } from '../features/tracks/tracksSlice';
import { mediaPaused, mediaPlaying } from '../features/embed/embedSlice';
import {
  addTrack,
  clearTracks,
  selectActiveBrowser,
  selectBrowserById,
  updatePageTitle,
  updatePageUrl,
} from '../features/browsers/browsersSlice';
import { BandCurrency, BandData, parseBandcampPageData, TralbumCollectInfo, TralbumData } from './helpers/bandcamp';
import { AppStore, Browser, PauseContext, TrackPreviewEmbedSize } from '../common/types';
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

function createBrowser(mainWindow: BrowserWindow, reduxStore: AppStore, browser: Browser) {
  const { dispatch, getState, subscribe } = reduxStore;
  const view = new BrowserView();
  let currentlyNavigating = false;

  log('creating browser', browser.id);

  const setBounds = () => {
    const { height: windowHeight, width: windowWidth } = mainWindow.getBounds();
    const { trackPreviewEmbedSize } = getState().settings;
    const statusBarHeight = trackPreviewEmbedSize === TrackPreviewEmbedSize.Small ? 65 : 145;
    const headerBarHeight = 62;
    const metaPanelHeight = 326;
    const listPaneWidth = 538;
    view.setBounds({
      x: listPaneWidth,
      y: headerBarHeight + metaPanelHeight - 10,
      width: windowWidth - listPaneWidth,
      height: windowHeight - statusBarHeight - headerBarHeight - metaPanelHeight - 10,
    });
  };

  mainWindow.setBrowserView(view);
  view.setAutoResize({ horizontal: true });
  setBounds();

  mainWindow.on('resize', () => {
    setBounds();
  });

  view.webContents.setWindowOpenHandler(({ url }) => {
    log('windowOpenHandler', url);
    dispatch(updatePageUrl({ id: browser.id, url }));
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
        dispatch(
          mediaPlaying(),
          // mediaPlaying({
          //   trackId: playingTrack.id,
          //   context: 'browser',
          // }),
        );
      }
    })();
  });

  view.webContents.on('media-paused', () => {
    log('pausing from browser', Date.now());
    dispatch(mediaPaused({ pauseContext: PauseContext.UserAction }));
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

  subscribe(() => {
    const state = getState();
    const browserSelector = selectBrowserById(browser.id);
    const { url } = browserSelector(state);

    if (canNavigateTo(url)) {
      log('loading URL', url);
      currentlyNavigating = true;
      dispatch(clearTracks({ id: browser.id }));
      void view.webContents.loadURL(url);
    }

    const activeBrowserSelector = selectActiveBrowser();
    const browserIsActive = browser.id === activeBrowserSelector(state).id;

    if (!browserIsActive) {
      view.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    }
  });

  ipcMain.handle('resize-browsers', () => setBounds());
}

export function initBrowsers(mainWindow: BrowserWindow, reduxStore: AppStore): void {
  const state = reduxStore.getState();

  state.browsers.forEach((browser: Browser) => {
    createBrowser(mainWindow, reduxStore, browser);
  });
}
