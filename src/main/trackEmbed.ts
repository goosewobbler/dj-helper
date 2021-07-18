import { BrowserView, BrowserWindow } from 'electron';
import { URL } from 'url';
import { setPlaying, setStopped } from '../features/tracks/tracksSlice';
import { Dispatch } from '../common/types';

export type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

let embed: BrowserView;

export function createTrackEmbed(
  mainWindow: BrowserWindow,
  dispatch: Dispatch,
  trackUrl: string,
  bounds: Bounds,
): void {
  console.log(trackUrl, bounds);

  if (embed && embed.webContents.getURL() === trackUrl) {
    // we are already displaying an embed of this url
    return;
  }
  if (embed) {
    // we are already displaying a different embed so remove it first
    mainWindow.removeBrowserView(embed);
  }

  embed = new BrowserView();
  mainWindow.addBrowserView(embed);
  embed.setBounds(bounds);
  void embed.webContents.loadURL(trackUrl);

  embed.webContents.setWindowOpenHandler((details) => {
    void embed.webContents.loadURL(details.url);
    return { action: 'deny' };
  });

  embed.webContents.on('did-finish-load', () => {
    void (async () => {
      await embed.webContents.executeJavaScript('$("#big_play_button").click();', true);
    })();
  });

  embed.webContents.on('media-started-playing', () => {
    void (async () => {
      const rawTitleLinkPlaying = (await embed.webContents.executeJavaScript(
        'document.querySelector(".inline_player #maintextlink").getAttribute("href");',
        true,
      )) as string;
      const { pathname } = new URL(rawTitleLinkPlaying);
      const sourceUrl = pathname;
      console.log('playing lol', { sourceUrl });
      dispatch(setPlaying({ sourceUrl, context: 'trackEmbed' }));
    })();
  });

  embed.webContents.on('media-paused', () => {
    void (async () => {
      const rawTitleLinkPaused = (await embed.webContents.executeJavaScript(
        'document.querySelector(".inline_player #maintextlink").getAttribute("href");',
        true,
      )) as string;
      const { pathname } = new URL(rawTitleLinkPaused);
      const sourceUrl = pathname;
      console.log('paused lol', { sourceUrl });
      dispatch(setStopped({ sourceUrl, context: 'trackEmbed' }));
    })();
  });
}
