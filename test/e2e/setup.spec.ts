import path from 'path';
import { Application } from '@goosewobbler/spectron';
import { setupBrowser } from '@testing-library/webdriverio';

const app: Application = new Application({
  path: path.join(
    process.cwd(), // This works assuming you run npm test from project root
    // The path to the binary depends on your platform and architecture
    'dist/mac/dj_helper.app/Contents/MacOS/dj_helper',
  ),
});

describe('App', () => {
  beforeEach(async () => {
    await app.start();
    // await app.client.getWindowHandles();
    await app.client.waitUntilWindowLoaded();
  });

  afterEach(async () => {
    if (app && app.isRunning()) {
      await app.stop();
    }
  });

  it('should launch app', async () => {
    const isVisible = await app.browserWindow.isVisible();
    expect(isVisible).toBe(true);
  });

  it('should display a new list button', async () => {
    const { getByRole } = setupBrowser(app.client);
    const button = await getByRole('button', { name: /New List/i });
    await button.click();
  });
});
