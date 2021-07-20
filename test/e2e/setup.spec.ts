import path from 'path';
import { Application } from '@goosewobbler/spectron';
import { setupBrowser, WebdriverIOBoundFunctions } from '@testing-library/webdriverio';
import { queries } from '@testing-library/dom';

const app: Application = new Application({
  path: path.join(
    process.cwd(), // This works assuming you run npm test from project root
    // The path to the binary depends on your platform and architecture
    'dist/mac/dj_helper.app/Contents/MacOS/dj_helper',
  ),
});

let screen: WebdriverIOBoundFunctions<typeof queries>;

describe('App', () => {
  beforeEach(async () => {
    await app.start();
    // await app.client.getWindowHandles();
    await app.client.waitUntilWindowLoaded();
    screen = setupBrowser(app.client);
  }, 10000);

  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop();
    }
  }, 10000);

  it('should launch app', async () => {
    const isVisible = await app.browserWindow.isVisible();
    expect(isVisible).toBe(true);
  });

  describe('lists', () => {
    beforeEach(() => {});

    it('should display a new list button', async () => {
      const button = await screen.getByText('New List');
      expect(button).toBeDefined();
    });

    describe('when the new list button is clicked', () => {
      it('should create a new list input box', async () => {
        const button = await screen.getByText('New List');
        await button.click();
        const input = await screen.getByLabelText('List Title');
        expect(await input.getValue()).toEqual('New List');
      });
    });
  });
});
