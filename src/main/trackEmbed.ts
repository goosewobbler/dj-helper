import { BrowserView, BrowserWindow, ipcMain } from 'electron';
import { mediaLoaded, mediaPlaying, mediaPaused } from '../features/embed/embedSlice';
import { AppStore, Track, TrackPreviewEmbedSize } from '../common/types';
import { log } from './helpers/console';
import { selectTrackSourceByIndex } from '../features/tracks/tracksSlice';
// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

let embed: BrowserView;
let lastClickPlayTime: number;

export function initEmbed(mainWindow: BrowserWindow, reduxStore: AppStore): void {
  const { dispatch, getState } = reduxStore;

  const setBounds = (embedSize = getState().ui.trackPreviewEmbedSize) => {
    const { height } = mainWindow.getBounds();
    const embedHeight = embedSize === TrackPreviewEmbedSize.Medium ? 120 : 42;
    const embedWidth = 500;
    embed.setBounds({
      x: 10,
      y: height - embedHeight - 33,
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

  embed.webContents.setWindowOpenHandler((details) => {
    void embed.webContents.loadURL(details.url);
    return { action: 'deny' };
  });

  const trigger = async (toTrigger: string) => {
    const isPlaying = !!(await embed.webContents.executeJavaScript('$("#player").hasClass("playing");', true));
    const canClick = (!isPlaying && toTrigger === 'play') || (isPlaying && toTrigger === 'pause');
    log(`trigger ${toTrigger}`, isPlaying, canClick);
    if (canClick) {
      log('clicking', Date.now());
      await embed.webContents.executeJavaScript('$("#big_play_button").click().length;', true);
      log('clicked', Date.now());
      if (toTrigger === 'play') {
        lastClickPlayTime = Date.now();
      }
    }
  };

  const mediaStartedPlayingHandler = () => {
    log('playing from embed', Date.now());
    dispatch(mediaPlaying());
  };

  const mediaPausedHandler = () => {
    void (async () => {
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
      await dispatch(mediaPaused());
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
        setBounds(trackPreviewEmbedSize);
      }),
  );
}
