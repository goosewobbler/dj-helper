import { BrowserView, BrowserWindow } from 'electron';
import { Store } from '@reduxjs/toolkit';
import { createTrack, TrackData, unlinkBrowserFromTracks } from '../features/tracks/tracksSlice';
import { BandCurrency, BandData, parseBandcampPageData, TralbumCollectInfo, TralbumData } from './helpers/bandcamp';
import { AppState, Browser, Dispatch } from '../common/types';
import { log } from './helpers/console';

type RawBandcampData = [TralbumData, BandData, TralbumCollectInfo, BandCurrency];

function createBrowser(mainWindow: BrowserWindow, dispatch: Dispatch, browserId: number, url: string) {
  const view = new BrowserView();
  mainWindow.setBrowserView(view);
  view.setBounds({ x: 300, y: 400, width: 1200, height: 550 }); // y: 65
  view.setAutoResize({ horizontal: true });
  void view.webContents.loadURL(url);

  view.webContents.setWindowOpenHandler((details) => {
    void view.webContents.loadURL(details.url);
    return { action: 'deny' };
  });

  view.webContents.on('did-finish-load', () => {
    const loadedUrl = view.webContents.getURL();
    log('loaded url', loadedUrl);
    dispatch(unlinkBrowserFromTracks({ browserId })); // unlink browser from tracks
    if (/bandcamp.com\/track|album/.exec(loadedUrl)) {
      log('url is bandcamp album or track');
      void (async () => {
        const [tralbumData, bandData, tralbumCollectInfo, bandCurrency] = (await view.webContents.executeJavaScript(
          '[ TralbumData, BandData, TralbumCollectInfo, bandCurrency ]',
          true,
        )) as RawBandcampData;
        const bcPageData = parseBandcampPageData(tralbumData, bandData, tralbumCollectInfo, bandCurrency, loadedUrl);
        log('parsed bandcamp page data');
        bcPageData.trackinfo.forEach(({ id, title, artist, duration, title_link }) => {
          // pass price where we have it, check url
          const trackData: TrackData = {
            title,
            artist,
            duration,
            browserId,
            sourceId: id,
            url: loadedUrl,
            priceCurrency: bcPageData.currency,
          };
          dispatch(createTrack(trackData));
        });
      })();
    }
  });
}

export function initBrowsers(mainWindow: BrowserWindow, { dispatch, getState }: Store): void {
  const state = getState() as AppState;
  state.browsers.forEach((browser: Browser) => {
    createBrowser(mainWindow, dispatch, browser.id, browser.url);
  });
}
