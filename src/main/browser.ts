import { BrowserView, BrowserWindow } from 'electron';
import { Store } from '@reduxjs/toolkit';
import { createTrack, TrackData, unlinkBrowserFromTracks } from '../features/tracks/tracksSlice';
import { loadTrack, setPaused, setPlaying } from '../features/embed/embedSlice';
import { selectBrowserById, updatePageTitle, updatePageUrl } from '../features/browsers/browsersSlice';
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

  mainWindow.setBrowserView(view);
  view.setBounds({ x: 300, y: 400, width: 1200, height: 550 }); // y: 65
  view.setAutoResize({ horizontal: true });

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
          loadTrack({
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
            browserId: browser.id,
            sourceId: id,
            url: title_link,
            priceCurrency: pageTrackData.currency,
          };
          reduxStore.dispatch(createTrack(trackData));
        });
      })();
    }
  });

  const canNavigateTo = (url: string): boolean => {
    const currentUrl = view.webContents.getURL();
    log('canNavigateTo', url, currentUrl);
    return !currentlyNavigating && url !== currentUrl;
  };

  reduxStore.subscribe(() => {
    const browserSelector = selectBrowserById(browser.id);
    const { url } = browserSelector(reduxStore.getState());

    if (canNavigateTo(url)) {
      log('loading URL', url);
      currentlyNavigating = true;
      reduxStore.dispatch(unlinkBrowserFromTracks({ browserId: browser.id }));
      void view.webContents.loadURL(url);
    }
  });
}

export function initBrowsers(mainWindow: BrowserWindow, reduxStore: Store): void {
  const state = reduxStore.getState() as RootState;

  state.browsers.forEach((browser: Browser) => {
    createBrowser(mainWindow, reduxStore, browser);
  });
}
