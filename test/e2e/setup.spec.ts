import { initSpectron, SpectronApp } from '@goosewobbler/spectron';
import { setupBrowser, WebdriverIOQueries } from '@testing-library/webdriverio';

declare global {
  namespace WebdriverIO {
    interface Browser extends WebdriverIOQueries {}
    interface Element extends WebdriverIOQueries {}
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let app: SpectronApp;
let screen: WebdriverIOQueries;

describe('App', () => {
  before(async (): Promise<void> => {
    // await app.client.getWindowHandles();
    app = await initSpectron();
    await app.client.waitUntilWindowLoaded();
    screen = setupBrowser(app.client);
  });

  it('should launch app', async () => {
    const isVisible = await app.browserWindow.isVisible();
    expect(isVisible).toBe(true);
  });

  describe('lists', () => {
    before(async () => {
      await app.browserWindow.isVisible();
    });

    it('should display a new list button', async () => {
      await delay(2000);
      const button = await screen.getByText('New List');
      expect(button).toBeInTheDocument();
    });

    describe('when the new list button is clicked', () => {
      it('should create a new list input box', async () => {
        const button = await screen.getByText('New List');
        // const button = app.client.$('.btn-make-bigger');
        await button.click();
        const input = await screen.getByLabelText('List Title');
        expect(await input.getValue()).toEqual('New List');
      });
    });
  });
});
