import { setupBrowser, WebdriverIOQueries } from '@testing-library/webdriverio';
// import { setOptions } from 'expect-webdriverio';

declare global {
  namespace WebdriverIO {
    interface Browser extends WebdriverIOQueries {}
    interface Element extends WebdriverIOQueries {}
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let screen: WebdriverIOQueries;

// describe('App', () => {
//   before(() => {
//     screen = setupBrowser(browser);
//     setOptions({ wait: 5000 });
//   });

//   // it('should launch app', async () => {
//   //   const isVisible = await app.browserWindow.isVisible();
//   //   expect(isVisible).toBe(true);
//   // });
// });
describe('lists', () => {
  before(async () => {
    screen = setupBrowser(browser);
    await delay(1000);
    // await app.browserWindow.isVisible();
  });

  it('should display a new list button', async () => {
    console.log('looking for btn');
    // const { getByText } = setupBrowser(browser);
    // const button = await getByText('New List');
    // const button = screen.queryByText('New List');
    const button = await screen.getByRole('button', { name: /new list/i });
    // const button = await $('.new-list-btn');
    // console.log('yo', await button.getText());
    console.log('btn plz', button);
    await expect(button).toExist();
  });

  describe('when the new list button is clicked', () => {
    it('should create a new list input box', async () => {
      const button = await screen.getByText(/New List/i);
      // const button = app.client.$('.btn-make-bigger');
      await button.click();
      const input = await screen.getByLabelText('List Title');
      await expect(await input.getValue()).toEqual('New List');
    });
  });
});
