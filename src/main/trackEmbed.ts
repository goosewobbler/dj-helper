import { BrowserView, BrowserWindow, ipcMain } from 'electron';
import { platform } from 'os';
import {
  mediaLoaded,
  mediaPlaying,
  mediaPaused,
  mediaPlaybackError,
  mediaLoadError,
} from '../features/embed/embedSlice';
import { AppStore, Track, TrackPreviewEmbedSize } from '../common/types';
import { log } from './helpers/console';
import { selectTrackSourceByIndex } from '../features/tracks/tracksSlice';
import { createBrowser } from '../features/browsers/browsersSlice';
import { sanitiseUrl } from './browser';
// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

let embed: BrowserView;
let lastClickPlayTime: number;
let playTimeout: NodeJS.Timeout;
let loadTimeout: NodeJS.Timeout;

export function initEmbed(mainWindow: BrowserWindow, reduxStore: AppStore): void {
  const { dispatch, getState } = reduxStore;

  const setBounds = (embedSize = getState().ui.trackPreviewEmbedSize) => {
    const { height } = mainWindow.getBounds();
    const embedHeight = embedSize === TrackPreviewEmbedSize.Medium ? 120 : 42;
    const embedWidth = 500;
    embed.setBounds({
      x: 48,
      y: height - embedHeight - (platform() === 'win32' ? 50 : 33),
      width: embedWidth,
      height: embedHeight,
    });
  };

  embed = new BrowserView();
  mainWindow.addBrowserView(embed);
  setBounds();

  mainWindow.on('resize', () => {
    setBounds();
  });

  embed.webContents.setWindowOpenHandler(({ url }) => {
    dispatch(createBrowser({ url: sanitiseUrl(url) }));
    return { action: 'deny' };
  });

  const trigger = async (toTrigger: string) => {
    let isPlaying = !!(await embed.webContents.executeJavaScript('$("#player").hasClass("playing");', true));
    const canClick = (!isPlaying && toTrigger === 'play') || (isPlaying && toTrigger === 'pause');
    log(`trigger ${toTrigger}`, isPlaying, canClick);
    if (canClick) {
      log('clicking', Date.now());
      await embed.webContents.executeJavaScript('$("#big_play_button").click().length;', true);
      log('clicked', Date.now());
      if (toTrigger === 'play') {
        lastClickPlayTime = Date.now();
        setTimeout(() => {
          void (async () => {
            isPlaying = !!(await embed.webContents.executeJavaScript('$("#player").hasClass("playing");', true));
            if (!isPlaying) {
              log('second click incoming');
              log('clicking', Date.now());
              await embed.webContents.executeJavaScript('$("#big_play_button").click().length;', true);
              log('clicked', Date.now());
            }
          })();
        }, 300);

        clearTimeout(playTimeout);
        playTimeout = setTimeout(() => {
          void (async () => {
            isPlaying = !!(await embed.webContents.executeJavaScript('$("#player").hasClass("playing");', true));
            if (!isPlaying) {
              dispatch(mediaPlaybackError());
              // TODO: update status panel
            }
          })();
        }, 30000);
      }
    }
  };

  const mediaStartedPlayingHandler = () => {
    clearTimeout(playTimeout);
    log('playing from embed', Date.now());
    dispatch(mediaPlaying());
  };

  const mediaPausedHandler = () => {
    void (async () => {
      clearTimeout(playTimeout);

      const playbackComplete = (await embed.webContents.executeJavaScript('window.playbackComplete', true)) as boolean;
      const currentTime = (await embed.webContents.executeJavaScript('$("#currenttime").text();', true)) as string;
      const pausedByTrackEnding = currentTime === '00:00' && playbackComplete;

      log('media paused', getState().embed);

      if (Date.now() - lastClickPlayTime < 300) {
        // occasionally the media will be paused ~250ms after clicking play - here we detect this and click play again
        log('rage click incoming');
        void trigger('play');
      }

      log('dispatching setPaused, track ended = ', pausedByTrackEnding);
      dispatch(mediaPaused());
      if (pausedByTrackEnding) {
        log('sending autoplay message');
        mainWindow.webContents.send('handle-autoplay');
      }

      log(Date.now() - lastClickPlayTime);
    })();
  };

  embed.webContents.on('media-started-playing', mediaStartedPlayingHandler);
  embed.webContents.on('media-paused', mediaPausedHandler);

  ipcMain.handle('play-track', () => trigger('play'));
  ipcMain.handle('pause-track', () => trigger('pause'));
  ipcMain.handle(
    'load-track',
    (_event, [trackId]) =>
      new Promise((resolve) => {
        if (!trackId) {
          resolve(false);
        }
        const loadFinishedHandler = () => {
          void (async () => {
            clearTimeout(loadTimeout);
            log('loaded', Date.now());
            dispatch(mediaLoaded());
            await embed.webContents.executeJavaScript(
              '$("audio").on("ended", () => { window.playbackComplete = true }).length;',
              true,
            );
            resolve(true);
          })();
        };
        const appState = getState();
        const { trackPreviewEmbedSize } = appState.ui;
        embed.webContents.once('did-finish-load', loadFinishedHandler);
        const trackSourceSelector = selectTrackSourceByIndex(trackId as Track['id'], 0);
        const trackSource = trackSourceSelector(appState);
        const embedSize = trackPreviewEmbedSize.toLowerCase();
        const trackUrl = `https://bandcamp.com/EmbeddedPlayer/size=${embedSize}/bgcol=ffffff/linkcol=0687f5/track=${trackSource.sourceId}/transparent=true/`;
        void embed.webContents.loadURL(trackUrl);
        loadTimeout = setTimeout(() => {
          dispatch(mediaLoadError());
          // TODO: update status panel
        }, 30000);
        setBounds(trackPreviewEmbedSize);
      }),
  );
}
