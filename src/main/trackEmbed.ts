import { BrowserView, BrowserWindow, ipcMain } from 'electron';
import { Store } from '@reduxjs/toolkit';
import { URL } from 'url';
import {
  setPlaying,
  setPaused,
  selectTrackByEmbedLoaded,
  loadTrack,
  trackIsLoaded,
} from '../features/embed/embedSlice';
import { Track } from '../common/types';
import { log } from './helpers/console';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let embed: BrowserView;

export function initEmbed(mainWindow: BrowserWindow, reduxStore: Store): void {
  let currentEmbedTrack: Track;

  embed = new BrowserView();
  mainWindow.addBrowserView(embed);
  embed.setBounds({
    x: 900,
    y: 10,
    width: 400,
    height: 42,
  });

  embed.webContents.setWindowOpenHandler((details) => {
    void embed.webContents.loadURL(details.url);
    return { action: 'deny' };
  });

  const triggerPlay = async () => {
    const isPlaying = !!(await embed.webContents.executeJavaScript('$("#player").hasClass("playing");', true));
    if (!isPlaying) {
      log('clicking', Date.now());
      await embed.webContents.executeJavaScript('$("#big_play_button").click().length;', true);
      log('clicked', Date.now());
    }
  };

  const playHandler = () => {
    void (async () => {
      const rawTitleLinkPlaying = (await embed.webContents.executeJavaScript(
        'document.querySelector(".inline_player #maintextlink").getAttribute("href");',
        true,
      )) as string;
      const { pathname } = new URL(rawTitleLinkPlaying);
      const sourceUrl = pathname;
      log('playing from embed', { sourceUrl, context: 'trackEmbed' }, Date.now());
      reduxStore.dispatch(setPlaying({ context: 'trackEmbed' }));
    })();
  };

  const pauseHandler = () => {
    void (async () => {
      const rawTitleLinkPaused = (await embed.webContents.executeJavaScript(
        'document.querySelector(".inline_player #maintextlink").getAttribute("href");',
        true,
      )) as string;
      const { pathname } = new URL(rawTitleLinkPaused);
      const sourceUrl = pathname;
      log('paused from embed', { sourceUrl, context: 'trackEmbed' }, Date.now());
      reduxStore.dispatch(setPaused({ context: 'trackEmbed' }));
    })();
  };

  const loadHandler = () => {
    void (async () => {
      log('loaded', Date.now());
      await delay(200);
      await triggerPlay();
    })();
  };

  embed.webContents.on('media-started-playing', playHandler);
  embed.webContents.on('media-paused', pauseHandler);
  embed.webContents.on('did-finish-load', loadHandler);

  reduxStore.subscribe(() => {
    const previousEmbedTrack = currentEmbedTrack;
    const embedTrackSelector = selectTrackByEmbedLoaded();
    currentEmbedTrack = embedTrackSelector(reduxStore.getState());
    // const state = reduxStore.getState();
    // log('app state yo', state);
    if (!currentEmbedTrack || !previousEmbedTrack) {
      return;
    }

    const newTrackToLoad = previousEmbedTrack.id !== currentEmbedTrack.id;

    if (newTrackToLoad) {
      const trackUrl = `https://bandcamp.com/EmbeddedPlayer/size=small/bgcol=ffffff/linkcol=0687f5/track=${currentEmbedTrack.sources[0].sourceId}/transparent=true/`;
      log('embed loading', Date.now(), previousEmbedTrack?.title, currentEmbedTrack?.title);
      void embed.webContents.loadURL(trackUrl);
    }
  });

  ipcMain.handle('play-track', (event, [{ trackId, context }]: [{ trackId: number; context: string }]) => {
    const trackIsLoadedSelector = trackIsLoaded({ trackId });
    const isLoaded = trackIsLoadedSelector(reduxStore.getState());
    if (isLoaded) {
      void triggerPlay();
    } else {
      reduxStore.dispatch(loadTrack({ trackId, context }));
    }
  });
}
