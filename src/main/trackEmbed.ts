import { BrowserView, BrowserWindow, ipcMain } from 'electron';
import { loadAndPlayTrack, mediaLoaded, mediaPlaying, mediaPaused } from '../features/embed/embedSlice';
import { AppStore, Track } from '../common/types';
import { log } from './helpers/console';
import { getNextTrackOnList } from '../features/lists/listsSlice';
import { getNextTrackOnMetaPanel } from '../features/browsers/browsersSlice';
import { selectTrackSourceByIndex } from '../features/tracks/tracksSlice';
// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

let embed: BrowserView;
let lastClickPlayTime: number;

export function initEmbed(mainWindow: BrowserWindow, reduxStore: AppStore): void {
  const { dispatch, getState } = reduxStore;

  const setBounds = (embedSize = getState().settings.trackPreviewEmbedSize) => {
    const { height } = mainWindow.getBounds();
    const embedHeight = embedSize === 'medium' ? 100 : 42;
    const embedWidth = 400;
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
      const { trackContext, trackId } = getState().embed;

      log('media paused', getState().embed);

      if (Date.now() - lastClickPlayTime < 300) {
        // occasionally the media will be paused ~250ms after clicking play - here we detect this and click play again
        log('rage click incoming');
        void trigger('play');
      }

      log('dispatching setPaused');
      dispatch(mediaPaused());

      log(Date.now() - lastClickPlayTime);
      if (pausedByTrackEnding) {
        log('end of track zomg, playing next...', currentTime, playbackComplete, trackContext);
        const nextTrackSelectorMap = {
          browser: getNextTrackOnMetaPanel,
          list: getNextTrackOnList,
        };
        const [currentTrackContextType, currentTrackContextId] = (trackContext as string).split('-');
        const nextTrackFromContextSelector = nextTrackSelectorMap[currentTrackContextType as 'browser' | 'list']({
          id: parseInt(currentTrackContextId),
          currentTrackId: trackId as Track['id'],
        });
        const nextTrackId = nextTrackFromContextSelector(getState());
        dispatch(loadAndPlayTrack({ trackId: nextTrackId, context: trackContext }));
      }
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
        const { trackPreviewEmbedSize } = appState.settings;
        embed.webContents.once('did-finish-load', loadFinishedHandler);
        const trackSourceSelector = selectTrackSourceByIndex(trackId as Track['id'], 0);
        const trackSource = trackSourceSelector(appState);
        const trackUrl = `https://bandcamp.com/EmbeddedPlayer/size=${trackPreviewEmbedSize}/bgcol=ffffff/linkcol=0687f5/track=${trackSource.sourceId}/transparent=true/`;
        void embed.webContents.loadURL(trackUrl);
        setBounds(trackPreviewEmbedSize);
      }),
  );
}
