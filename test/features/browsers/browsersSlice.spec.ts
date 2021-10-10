import { reducers } from '../../../src/features/browsers/browsersSlice';

const { createBrowser } = reducers;

describe('browsersSlice', () => {
  describe('createBrowser', () => {
    it('should create a new browser with the expected values', () => {
      const browser = createBrowser([], { payload: { url: 'https://bleh.org', title: 'Bleh' } });
      expect(browser).toEqual([{ id: 1, url: 'https://bleh.org', title: 'Bleh', tracks: [] }]);
    });

    describe('when there are existing browsers', () => {
      it('should append to the array', () => {
        const browsers = createBrowser(
          [
            { id: 1, url: 'https://bleh.org', title: 'Bleh', tracks: [], active: true },
            { id: 2, url: 'https://blah.org', title: 'Blah', tracks: [], active: false },
          ],
          { payload: { url: 'https://bluh.org', title: 'Bluh' } },
        );
        expect(browsers).toEqual([
          { id: 1, url: 'https://bleh.org', title: 'Bleh', tracks: [], active: false },
          { id: 2, url: 'https://blah.org', title: 'Blah', tracks: [], active: false },
          { id: 3, url: 'https://bluh.org', title: 'Bluh', tracks: [], active: true },
        ]);
      });
    });
  });
});
