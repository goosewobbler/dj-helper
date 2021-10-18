import { BrowserView, BrowserWindow } from 'electron';
import { Store } from '@reduxjs/toolkit';
import {
  setPlaying,
  setPaused,
  setLoadComplete,
  setLoading,
  requestPlay,
  requestResize,
} from '../features/embed/embedSlice';
import { AppState, Embed, Track } from '../common/types';
import { log } from './helpers/console';
import { getNextTrackOnList } from '../features/lists/listsSlice';
import { getNextTrackOnMetaPanel } from '../features/browsers/browsersSlice';
import { selectTrackSourceByIndex } from '../features/tracks/tracksSlice';

// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

let embed: BrowserView;
let lastClickPlayTime: number;

export function initEmbed(mainWindow: BrowserWindow, reduxStore: Store): void {
  let currentEmbedTrack: Track;

  const setBounds = (embedSize?: string) => {
    const { height } = mainWindow.getBounds();

    if (!embedSize) {
      const { trackPreviewEmbedSize } = (reduxStore.getState() as AppState).settings;
      embedSize = trackPreviewEmbedSize;
    }

    const embedHeight = embedSize === 'med' ? 100 : 42;
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
  reduxStore.dispatch(requestResize());

  mainWindow.on('resize', () => {
    reduxStore.dispatch(requestResize());
  });

  embed.webContents.setWindowOpenHandler((details) => {
    void embed.webContents.loadURL(details.url);
    return { action: 'deny' };
  });

  const trigger = async (toTrigger: string, triggerContext: Embed['triggerContext']) => {
    const isPlaying = !!(await embed.webContents.executeJavaScript('$("#player").hasClass("playing");', true));
    const canClick = (!isPlaying && toTrigger === 'play') || (isPlaying && toTrigger === 'pause');
    log(`trigger ${toTrigger}`, isPlaying, canClick);
    // if (triggerContext === 'loadComplete') {
    //   await delay(1000);
    // }
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
    reduxStore.dispatch(setPlaying());
  };

  const mediaPausedHandler = () => {
    void (async () => {
      const playbackComplete = (await embed.webContents.executeJavaScript('window.playbackComplete', true)) as boolean;
      const currentTime = (await embed.webContents.executeJavaScript('$("#currenttime").text();', true)) as string;
      const pausedByTrackEnding = currentTime === '00:00' && playbackComplete;
      const { trackContext, trackId } = (reduxStore.getState() as AppState).embed;

      log('media paused', (reduxStore.getState() as AppState).embed);

      if (Date.now() - lastClickPlayTime < 300) {
        // occasionally the media will be paused ~250ms after clicking play - here we detect this and click play again
        log('rage click incoming');
        void trigger('play', 'rageClick');
      }

      log('dispatching setPaused');
      reduxStore.dispatch(setPaused());

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
        const nextTrackId = nextTrackFromContextSelector(reduxStore.getState() as AppState);
        reduxStore.dispatch(requestPlay({ trackId: nextTrackId, context: trackContext }));
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

      reduxStore.dispatch(setLoadComplete());
    })();
  };

  reduxStore.subscribe(() => {
    const appState = reduxStore.getState() as AppState;
    const { triggerLoad, triggerPlay, triggerPause, trackId, triggerContext } = appState.embed;
    const { trackPreviewEmbedSize } = appState.settings;

    // console.log('embed subscribe', appState.embed);

    if (triggerLoad) {
      const trackSourceSelector = selectTrackSourceByIndex(trackId as Track['id'], 0);
      const trackSource = trackSourceSelector(appState);
      const trackUrl = `https://bandcamp.com/EmbeddedPlayer/size=${trackPreviewEmbedSize}/bgcol=ffffff/linkcol=0687f5/track=${trackSource.sourceId}/transparent=true/`;
      log('embed loading', Date.now(), currentEmbedTrack?.title);
      void embed.webContents.loadURL(trackUrl);
      setBounds(trackPreviewEmbedSize);
      reduxStore.dispatch(setLoading());
    } else if (triggerPlay) {
      log('triggering play wut');
      void trigger('play', triggerContext);
    } else if (triggerPause) {
      void trigger('pause', triggerContext);
    }
  });

  embed.webContents.on('media-started-playing', mediaStartedPlayingHandler);
  embed.webContents.on('media-paused', mediaPausedHandler);
  embed.webContents.on('did-finish-load', loadFinishedHandler);
}
