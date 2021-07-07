import { BrowserView, BrowserWindow } from 'electron';
import { Store } from '@reduxjs/toolkit';
import { createTrack, TrackData, unlinkBrowserFromTracks } from '../features/tracks/tracksSlice';
import { parseBandcampPageData } from './helpers/bandcamp';
import { Browser } from '../common/types';
import { log } from './helpers/console';

export function initBrowsers(mainWindow: BrowserWindow, { dispatch, getState }: Store) {
  const state = getState();

  log(state.browsers);

  state.browsers.forEach((browser: Browser) => {
    const view = new BrowserView();
    mainWindow.setBrowserView(view);
    view.setBounds({ x: 300, y: 165, width: 1200, height: 550 }); // y: 65
    view.setAutoResize({ horizontal: true });
    void view.webContents.loadURL(browser.url);

    view.webContents.setWindowOpenHandler(({ url }) => {
      view.webContents.loadURL(url);
      return { action: 'deny' };
    });

    view.webContents.on('did-finish-load', () => {
      const url = view.webContents.getURL();
      log('loaded url', url);
      dispatch(unlinkBrowserFromTracks({ browserId: browser.id })); // unlink browser from tracks
      if (url.match(/bandcamp.com\/track|album/)) {
        log('url is bandcamp album or track');
        (async () => {
          const [TralbumData, BandData, TralbumCollectInfo, bandCurrency] = await view.webContents.executeJavaScript(
            '[ TralbumData, BandData, TralbumCollectInfo, bandCurrency ]',
            true,
          );
          const bcPageData = parseBandcampPageData(TralbumData, BandData, TralbumCollectInfo, bandCurrency, url);
          log('parsed bandcamp page data');
          bcPageData.trackinfo.forEach(({ title, artist, duration }) => {
            // pass price where we have it, check url
            const trackData: TrackData = {
              title,
              artist,
              duration,
              browserId: browser.id,
              url,
              priceCurrency: bcPageData.currency,
            };
            log('creating track', trackData);
            dispatch(createTrack(trackData));
          });
        })();
      }
    });
  });
}
