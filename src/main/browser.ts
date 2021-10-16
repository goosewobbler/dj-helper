import { BrowserView, BrowserWindow } from 'electron';
import { Store } from '@reduxjs/toolkit';
import { createTrack, selectTrackBySourceUrl, TrackData } from '../features/tracks/tracksSlice';
import { requestPlay, setPaused, setPlaying } from '../features/embed/embedSlice';
import {
  addTrack,
  clearTracks,
  selectActiveBrowser,
  selectBrowserById,
  updatePageTitle,
  updatePageUrl,
} from '../features/browsers/browsersSlice';
import { setResizing, resizeComplete } from '../features/status/statusSlice';
import { BandCurrency, BandData, parseBandcampPageData, TralbumCollectInfo, TralbumData } from './helpers/bandcamp';
import { Browser } from '../common/types';
import { log } from './helpers/console';
import { RootState } from '../features/rootReducer';

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

function createBrowser(mainWindow: BrowserWindow, reduxStore: Store, browser: Browser) {
  const view = new BrowserView();
  let currentlyNavigating = false;

  log('creating browser', browser.id);

  let browserWidth = 1000;

  const setBounds = () => {
    const { height: windowHeight } = mainWindow.getBounds();
    const { trackPreviewEmbedSize } = reduxStore.getState().settings;
    const statusBarHeight = trackPreviewEmbedSize === 'small' ? 64 : 124;
    const headerBarHeight = 62;
    const metaPanelHeight = 326;
    const listPaneWidth = 538;
    view.setBounds({
      x: listPaneWidth,
      y: headerBarHeight + metaPanelHeight - 10,
      width: browserWidth,
      height: windowHeight - statusBarHeight - headerBarHeight - metaPanelHeight - 10,
    });
  };

  mainWindow.setBrowserView(view);
  view.setAutoResize({ horizontal: true });
  reduxStore.dispatch(setResizing());

  mainWindow.on('resize', () => {
    reduxStore.dispatch(setResizing());
  });

  view.webContents.setWindowOpenHandler(({ url }) => {
    log('windowOpenHandler', url);
    reduxStore.dispatch(updatePageUrl({ id: browser.id, url }));
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
        reduxStore.dispatch(
          requestPlay({
            trackId: playingTrack.id,
            context: 'browser',
          }),
        );
        reduxStore.dispatch(setPlaying());
      }
    })();
  });

  view.webContents.on('media-paused', () => {
    log('pausing from browser', Date.now());
    reduxStore.dispatch(setPaused());
  });

  view.webContents.on('page-title-updated', (event, title) => {
    reduxStore.dispatch(updatePageTitle({ id: browser.id, title }));
  });

  view.webContents.on('will-navigate', (event, url) => {
    log('will-navigate', url);
    event.preventDefault();
    reduxStore.dispatch(updatePageUrl({ id: browser.id, url }));
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
          reduxStore.dispatch(createTrack(trackData));
          const trackSelector = selectTrackBySourceUrl(title_link);
          const track = trackSelector(reduxStore.getState());
          log('selected browser', browser.id, track);
          reduxStore.dispatch(addTrack({ id: browser.id, trackId: track.id }));
        });
      })();
    }
  });

  const canNavigateTo = (url: string): boolean => {
    const currentUrl = view.webContents.getURL();
    return !currentlyNavigating && url !== currentUrl;
  };

  reduxStore.subscribe(() => {
    const state = reduxStore.getState();
    const browserSelector = selectBrowserById(browser.id);
    const { url } = browserSelector(state);

    if (canNavigateTo(url)) {
      log('loading URL', url);
      currentlyNavigating = true;
      reduxStore.dispatch(clearTracks({ id: browser.id }));
      void view.webContents.loadURL(url);
    }

    if (state.status.resizing) {
      setBounds();
      reduxStore.dispatch(resizeComplete());
    }

    const activeBrowserSelector = selectActiveBrowser();
    const browserIsActive = browser.id === activeBrowserSelector(state).id;

    if (!browserIsActive) {
      view.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    }
  });
}

export function initBrowsers(mainWindow: BrowserWindow, reduxStore: Store): void {
  const state = reduxStore.getState() as RootState;

  state.browsers.forEach((browser: Browser) => {
    createBrowser(mainWindow, reduxStore, browser);
  });
}
