import { platform } from 'node:os';

import { BrowserView, BrowserWindow } from 'electron';

import { EmbedStatus, Track, TrackPreviewEmbedSize } from '../common/types.js';
import { log } from './helpers/console.js';
import { selectTrackSourceByIndex } from '../features/tracks/index.js';
import { loadAndPlayNextTrack } from '../features/embed/index.js';
import { sanitiseUrl } from './browser.js';
import { getStore, getDispatch } from './store/index.js';
// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

let embed: BrowserView;
let lastClickPlayTime: number;
let playTimeout: NodeJS.Timeout;
let loadTimeout: NodeJS.Timeout;

export function initEmbed(mainWindow: BrowserWindow): void {
  const store = getStore();
  const dispatch = getDispatch();
  const { getState } = store;

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
    dispatch('BROWSER:CREATE', { url: sanitiseUrl(url) });
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
              dispatch('EMBED:MEDIA_PLAYBACK_ERROR');
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
    dispatch('EMBED:MEDIA_PLAYING');
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
      dispatch(pausedByTrackEnding ? 'EMBED:MEDIA_PLAYBACK_COMPLETE' : 'EMBED:MEDIA_PAUSED');

      log(Date.now() - lastClickPlayTime);
    })();
  };

  embed.webContents.on('media-started-playing', mediaStartedPlayingHandler);
  embed.webContents.on('media-paused', mediaPausedHandler);

  const loadFinishedHandler = (lastEmbedStatus: EmbedStatus) => {
    void (async () => {
      clearTimeout(loadTimeout);
      log('loaded', Date.now());
      dispatch('EMBED:MEDIA_LOADED');
      await embed.webContents.executeJavaScript(
        '$("audio").on("ended", () => { window.playbackComplete = true }).length;',
        true,
      );
      // ensure previous play status is persisted after the load
      if (lastEmbedStatus === EmbedStatus.Playing) {
        dispatch('EMBED:REQUEST_PLAY');
      }
    })();
  };

  let lastEmbedStatus: EmbedStatus;
  const unsubscribeEmbedListener = store.subscribe((state) => {
    if (state.embed.status !== lastEmbedStatus) {
      // invoke actions based on new embed status
      if (state.embed.status === EmbedStatus.LoadRequested) {
        const { trackPreviewEmbedSize } = state.ui;
        const { trackId } = state.embed;
        embed.webContents.once('did-finish-load', () => loadFinishedHandler(lastEmbedStatus));
        const trackSourceSelector = selectTrackSourceByIndex(trackId as Track['id'], 0);
        const trackSource = trackSourceSelector(state);
        if (trackSource) {
          const embedSize = trackPreviewEmbedSize.toLowerCase();
          const trackUrl = `https://bandcamp.com/EmbeddedPlayer/size=${embedSize}/bgcol=ffffff/linkcol=0687f5/track=${trackSource.sourceId}/transparent=true/`;
          void embed.webContents.loadURL(trackUrl);
          loadTimeout = setTimeout(() => {
            dispatch('EMBED:MEDIA_LOAD_ERROR');
            // TODO: update status panel
          }, 30000);
        }
        setBounds(trackPreviewEmbedSize);
        // await window.api.invoke('resize-browsers');

        // embed status has changed
        lastEmbedStatus = state.embed.status;
      } else if (state.embed.status === EmbedStatus.PlayRequested) {
        trigger('play');
      } else if (state.embed.status === EmbedStatus.PauseRequested) {
        trigger('pause');
      } else if (state.embed.status === EmbedStatus.PlaybackComplete) {
        const { trackId, autoplayEnabled } = state.embed;
        log('handleAutoplay', autoplayEnabled, trackId);
        if (autoplayEnabled && trackId) {
          // get next track
          dispatch(loadAndPlayNextTrack());
        }
      }
    }
  });

  mainWindow.on('close', unsubscribeEmbedListener);
}
