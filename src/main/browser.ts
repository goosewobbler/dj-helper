import { BrowserView, BrowserWindow } from 'electron';
import { Store } from '@reduxjs/toolkit';
import { createTrack, TrackData, unlinkBrowserFromTracks } from '../features/tracks/tracksSlice';
import { BandCurrency, BandData, parseBandcampPageData, TralbumCollectInfo, TralbumData } from './helpers/bandcamp';
import { AppState, Browser, Dispatch } from '../common/types';
import { log } from './helpers/console';
import { loadTrack, setPaused, setPlaying } from '../features/embed/embedSlice';

type RawBandcampData = [TralbumData, BandData, TralbumCollectInfo, BandCurrency];

async function getPageTrackData (view: BrowserView, url: string) {
  const [tralbumData, bandData, tralbumCollectInfo, bandCurrency] = (await view.webContents.executeJavaScript(
    '[ TralbumData, BandData, TralbumCollectInfo, bandCurrency ]',
    true,
  )) as RawBandcampData;
  const bcPageData = parseBandcampPageData(tralbumData, bandData, tralbumCollectInfo, bandCurrency, url);
  log('parsed bandcamp page data', bcPageData);
  return bcPageData;
}

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

  view.webContents.on('media-started-playing', () => {
    void (async () => {
      const titleLinkPlaying = (await view.webContents.executeJavaScript(
        'document.querySelector(".inline_player .title_link").getAttribute("href");',
        true,
      )) as string;
      console.log('playing from browser', { sourceUrl: titleLinkPlaying });
      const trackData = await getPageTrackData(view, url);
      const playingTrack = trackData.trackinfo.find((track) => track.title_link === titleLinkPlaying);

      if(playingTrack) {
        dispatch(loadTrack({
          trackId: playingTrack.id,
          context: 'browser'
        }));
        dispatch(setPlaying({ context: 'browser' }));
      }
      
    })();
  });

  view.webContents.on('media-paused', () => {
    void (async () => {
      // const titleLinkPaused = (await view.webContents.executeJavaScript(
      //   'document.querySelector(".inline_player .title_link").getAttribute("href");',
      //   true,
      // )) as string;
      console.log('pausing from browser', { context: 'browser' }, Date.now());
      // async thunk to load 
      dispatch(setPaused({ context: 'browser' }));
    })();
  });

  view.webContents.on('did-finish-load', () => {
    const loadedUrl = view.webContents.getURL();
    log('loaded url', loadedUrl);

    // void (async () => {
    //   await view.webContents.executeJavaScript(
    //     `$(".playbutton").off().click(() => {
    //         if(window.location.hash === "playing") {
    //           window.location.hash = "";
    //           $(".playbutton").removeClass("playing");
    //         } else {
    //           window.location.hash = "playing";
    //           $(".playbutton").addClass("playing");
    //         }
    //      })`,
    //     true,
    //   );
    // })();

    dispatch(unlinkBrowserFromTracks({ browserId })); // unlink browser from tracks

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
            browserId,
            sourceId: id,
            url: title_link,
            priceCurrency: pageTrackData.currency,
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
