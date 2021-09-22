import { BrowserView, BrowserWindow } from 'electron';
import { Store } from '@reduxjs/toolkit';
import { URL } from 'url';
import { setPlaying, setPaused, selectTrackByEmbedLoaded } from '../features/embed/embedSlice';
import { Track } from '../common/types';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let embed: BrowserView;

export function initEmbed(
  mainWindow: BrowserWindow,
  reduxStore: Store
): void {  
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

  const playHandler = () => {
    void (async () => {
      const rawTitleLinkPlaying = (await embed.webContents.executeJavaScript(
        'document.querySelector(".inline_player #maintextlink").getAttribute("href");',
        true,
      )) as string;
      const { pathname } = new URL(rawTitleLinkPlaying);
      const sourceUrl = pathname;
      console.log('playing from embed', { sourceUrl, context: 'trackEmbed' }, Date.now());
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
      console.log('paused from embed', { sourceUrl, context: 'trackEmbed' }, Date.now());
      reduxStore.dispatch(setPaused({ context: 'trackEmbed' }));
    })();
  };

  const loadHandler = () => {
    void (async () => {
      await delay(500);
      const isPlaying = !!(await embed.webContents.executeJavaScript('$("#player").hasClass("playing");', true));
      console.log('loaded', Date.now(), currentEmbedTrack.playingFrom);
      if (!isPlaying && currentEmbedTrack.playingFrom !== 'browser') {
        // lastLoaded = Date.now();
        console.log('clicking', Date.now());
        await embed.webContents.executeJavaScript('$("#big_play_button").click().length;', true);
       // lastClicked = Date.now();
        console.log('clicked', Date.now());
      }
    })();
  };

  embed.webContents.on('media-started-playing', playHandler);
  embed.webContents.on('media-paused', pauseHandler);
  embed.webContents.on('did-finish-load', loadHandler);

  reduxStore.subscribe(() => {
    const previousEmbedTrack = currentEmbedTrack;
    const embedTrackSelector = selectTrackByEmbedLoaded();
    currentEmbedTrack = embedTrackSelector(reduxStore.getState());
    if (currentEmbedTrack && previousEmbedTrack !== currentEmbedTrack) {
      const trackUrl = `https://bandcamp.com/EmbeddedPlayer/size=small/bgcol=ffffff/linkcol=0687f5/track=${currentEmbedTrack.sources[0].sourceId}/transparent=true/`;
      console.log('embed loading', Date.now(), currentEmbedTrack);
      void embed.webContents.loadURL(trackUrl);
    }
  });
}
