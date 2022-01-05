import { reducers } from '../../../src/features/browsers/browsersSlice';

const { createBrowser } = reducers;

describe('browsersSlice', () => {
  describe('createBrowser', () => {
    it('should create a new browser with the expected values', () => {
      const browser = createBrowser([], { payload: { url: 'https://bleh.org', title: 'Bleh' } });
      expect(browser).toEqual([
        { id: 0, url: 'https://bleh.org', title: 'Bleh', tracks: [], active: true, loading: true },
      ]);
    });

    describe('when there are existing browsers', () => {
      it('should append to the array', () => {
        const browsers = createBrowser(
          [
            { id: 0, url: 'https://bleh.org', title: 'Bleh', tracks: [], active: true, loading: false },
            { id: 1, url: 'https://blah.org', title: 'Blah', tracks: [], active: false, loading: false },
          ],
          { payload: { url: 'https://bluh.org', title: 'Bluh' } },
        );
        expect(browsers).toEqual([
          { id: 0, url: 'https://bleh.org', title: 'Bleh', tracks: [], active: false, loading: false },
          { id: 1, url: 'https://blah.org', title: 'Blah', tracks: [], active: false, loading: false },
          { id: 2, url: 'https://bluh.org', title: 'Bluh', tracks: [], active: true, loading: true },
        ]);
      });
    });
  });
});
