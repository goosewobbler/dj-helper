import { BrowserView, BrowserWindow } from 'electron';
import { useSelector, useDispatch } from 'react-redux';
import { clearTracks, selectBrowser } from '../features/browser/browserSlice';
import { createTrack, TrackData } from '../features/tracks/tracksSlice';
import { parseBandcampPageData } from './helpers/bandcamp';

export function initBrowsers(mainWindow: BrowserWindow) {
  const browsers = useSelector(selectBrowser);
  const dispatch = useDispatch();

  browsers.forEach((browser) => {
    const view = new BrowserView();
    mainWindow.setBrowserView(view);
    view.setBounds({ x: 300, y: 65, width: 1200, height: 550 });
    view.setAutoResize({ horizontal: true });
    void view.webContents.loadURL(browser.url);

    view.webContents.on('new-window', (event, url) => {
      event.preventDefault();
      view.webContents.loadURL(url);
    });

    view.webContents.on('did-start-navigation', (event, url) => {
      dispatch(clearTracks(browser.id));
      if (url.match(/bandcamp.com\/track|album/)) {
        view.webContents.once('did-finish-load', () => {
          (async () => {
            const [TralbumData, BandData, TralbumCollectInfo, bandCurrency] = await view.webContents.executeJavaScript(
              '[ TralbumData, BandData, TralbumCollectInfo, bandCurrency ]',
              true,
            );
            const bcPageData = parseBandcampPageData(TralbumData, BandData, TralbumCollectInfo, bandCurrency, url);
            console.log(bcPageData);
            bcPageData.trackinfo.forEach(({ title, artist, duration }) => {
              const trackData: TrackData = { title, artist, duration, url, priceCurrency: bcPageData.currency };
              if (url.match(/bandcamp.com\/track/)) {
                trackData.price = bcPageData.price;
              }
              dispatch(createTrack(trackData));
            });
          })();
        });
      }
    });
  });
}
