import { BrowserView, BrowserWindow } from 'electron';
import { Store } from '@reduxjs/toolkit';
import { setPlaying, setPaused, setLoadComplete, setLoading, requestPlay } from '../features/embed/embedSlice';
import { AppState, Track } from '../common/types';
import { log } from './helpers/console';
import { getNextTrackOnList } from '../features/lists/listsSlice';
import { getNextTrackOnMetaPanel } from '../features/browsers/browsersSlice';
import { selectTrackSourceByIndex } from '../features/tracks/tracksSlice';

// function delay(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

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

  const trigger = async (toTrigger: string) => {
    const isPlaying = !!(await embed.webContents.executeJavaScript('$("#player").hasClass("playing");', true));
    const canClick = (!isPlaying && toTrigger === 'play') || (isPlaying && toTrigger === 'pause');
    log(`trigger ${toTrigger}`, isPlaying, canClick);
    if (canClick) {
      log('clicking', Date.now());
      await embed.webContents.executeJavaScript('$("#big_play_button").click().length;', true);
      log('clicked', Date.now());
    }
  };

  const mediaStartedPlayingHandler = () => {
    // void (async () => {
    // const rawTitleLinkPlaying = (await embed.webContents.executeJavaScript(
    //   '$(".inline_player #maintextlink").attr("href");',
    //   true,
    // )) as string;
    // const { pathname } = new URL(rawTitleLinkPlaying);
    // const sourceUrl = pathname;
    // const embedPlayContextSelector = getTrackContext();
    // const currentPlayContext = embedPlayContextSelector(reduxStore.getState());
    log('playing from embed', Date.now());
    reduxStore.dispatch(setPlaying());
    // })();
  };

  const mediaPausedHandler = () => {
    void (async () => {
      const playbackComplete = (await embed.webContents.executeJavaScript('window.playbackComplete', true)) as boolean;
      const currentTime = (await embed.webContents.executeJavaScript('$("#currenttime").text();', true)) as string;
      const pausedByTrackEnding = currentTime === '00:00' && playbackComplete;
      const currentTrackContext = (reduxStore.getState() as AppState).embed.trackContext;

      reduxStore.dispatch(setPaused());

      if (pausedByTrackEnding) {
        log('end of track zomg, playing next...', currentTime, playbackComplete, currentTrackContext);
        const nextTrackSelectorMap = {
          browser: getNextTrackOnMetaPanel,
          list: getNextTrackOnList,
        };
        const [currentTrackContextType, currentTrackContextId] = (currentTrackContext as string).split('-');
        const nextTrackFromContextSelector = nextTrackSelectorMap[currentTrackContextType as 'browser' | 'list']({
          id: parseInt(currentTrackContextId),
          currentTrackId: currentEmbedTrack.id,
        });
        const nextTrackId = nextTrackFromContextSelector(reduxStore.getState());
        reduxStore.dispatch(requestPlay({ trackId: nextTrackId, context: currentTrackContext }));
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
    const { triggerLoad, triggerPlay, triggerPause, trackId } = appState.embed;

    if (triggerLoad) {
      const trackSourceSelector = selectTrackSourceByIndex(trackId as Track['id'], 0);
      const trackSource = trackSourceSelector(appState);
      const trackUrl = `https://bandcamp.com/EmbeddedPlayer/size=small/bgcol=ffffff/linkcol=0687f5/track=${trackSource.sourceId}/transparent=true/`;
      log('embed loading', Date.now(), currentEmbedTrack?.title);
      reduxStore.dispatch(setLoading());
      void embed.webContents.loadURL(trackUrl);
    } else if (triggerPlay) {
      void trigger('play');
    } else if (triggerPause) {
      void trigger('pause');
    }
  });

  embed.webContents.on('media-started-playing', mediaStartedPlayingHandler);
  embed.webContents.on('media-paused', mediaPausedHandler);
  embed.webContents.on('did-finish-load', loadFinishedHandler);
}
