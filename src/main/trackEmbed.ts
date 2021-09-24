import { BrowserView, BrowserWindow, ipcMain } from 'electron';
import { Store } from '@reduxjs/toolkit';
import { URL } from 'url';
import {
  setPlaying,
  setPaused,
  selectTrackByEmbedLoaded,
  loadTrack,
  trackIsLoaded,
  getPlayContext,
  setPlayContext,
} from '../features/embed/embedSlice';
import { Track } from '../common/types';
import { log } from './helpers/console';
import { getNextTrackOnList } from '../features/lists/listsSlice';

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
    log('trigger play yo');
    const isPlaying = !!(await embed.webContents.executeJavaScript('$("#player").hasClass("playing");', true));
    if (!isPlaying) {
      log('clicking', Date.now());
      await embed.webContents.executeJavaScript('$("#big_play_button").click().length;', true);
      log('clicked', Date.now());
    }
  };

  const invokePlayHandler = async (trackId: number, context: string) => {
    const trackIsLoadedSelector = trackIsLoaded({ trackId });
    const isLoaded = trackIsLoadedSelector(reduxStore.getState());

    reduxStore.dispatch(setPlayContext({ context }));
    if (isLoaded) {
      await triggerPlay();
    } else {
      reduxStore.dispatch(loadTrack({ trackId, context }));
    }
  };

  const mediaStartedPlayingHandler = () => {
    void (async () => {
      const rawTitleLinkPlaying = (await embed.webContents.executeJavaScript(
        '$(".inline_player #maintextlink").attr("href");',
        true,
      )) as string;
      const { pathname } = new URL(rawTitleLinkPlaying);
      const sourceUrl = pathname;
      const embedPlayContextSelector = getPlayContext();
      const currentPlayContext = embedPlayContextSelector(reduxStore.getState());
      log('playing from embed', { sourceUrl, context: currentPlayContext }, Date.now());
      reduxStore.dispatch(setPlaying());
    })();
  };

  const mediaPausedHandler = () => {
    void (async () => {
      // const pausedAt = Date.now();
      // const rawTitleLinkPaused = (await embed.webContents.executeJavaScript(
      //   '$(".inline_player #maintextlink").attr("href");',
      //   true,
      // )) as string;
      const playbackComplete = (await embed.webContents.executeJavaScript('window.playbackComplete', true)) as boolean;
      const currentTime = (await embed.webContents.executeJavaScript('$("#currenttime").text();', true)) as string;

      // const hasRecentPlayButtonClick = Number.isNaN(lastPlayButtonClick) ? false : pausedAt - lastPlayButtonClick <= 5;
      const pausedByTrackEnding = currentTime === '00:00' && playbackComplete;

      // const { pathname } = new URL(rawTitleLinkPaused);
      // const sourceUrl = pathname;

      const embedPlayContextSelector = getPlayContext();
      const currentPlayContext = embedPlayContextSelector(reduxStore.getState());
      reduxStore.dispatch(setPaused());

      if (pausedByTrackEnding) {
        // assume end of track
        log('end of track zomg, playing next...', currentTime, playbackComplete, currentPlayContext);
        const nextTrackOnListSelector = getNextTrackOnList({
          id: parseInt(currentPlayContext.replace('list-', '')),
          currentTrackId: currentEmbedTrack.id,
        });
        const nextTrackId = nextTrackOnListSelector(reduxStore.getState());
        await invokePlayHandler(nextTrackId, currentPlayContext);
      }
    })();
  };

  const loadFinishedHandler = () => {
    void (async () => {
      log('loaded', Date.now());
      await embed.webContents.executeJavaScript(
        '$("audio").on("ended", () => { window.playbackComplete = true }).length;',
        true,
      );
      await delay(200);
      await triggerPlay();
    })();
  };

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

  embed.webContents.on('media-started-playing', mediaStartedPlayingHandler);
  embed.webContents.on('media-paused', mediaPausedHandler);
  embed.webContents.on('did-finish-load', loadFinishedHandler);
  ipcMain.handle(
    'play-track',
    async (_event: unknown, [{ trackId, context }]: [{ trackId: number; context: string }]) => {
      log('play track handler', trackId, context);
      await invokePlayHandler(trackId, context);
    },
  );
}
