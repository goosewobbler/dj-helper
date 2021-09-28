import { reducers, trackIsOnSelectedList, getNextTrackOnList } from '../../../src/features/lists/listsSlice';

const {
  createList,
  deleteList,
  updateListTitle,
  editList,
  finishEditList,
  revertEditList,
  moveTrackUp,
  moveTrackDown,
  addTrackToSelectedList,
  removeTrackFromSelectedList,
} = reducers;

describe('listsSlice', () => {
  describe('createList', () => {
    it('should create a new list with the expected values', () => {
      const lists = createList([]);
      expect(lists).toEqual([{ id: 1, active: true, editing: true, title: 'New List', tracks: [] }]);
    });

    describe('when there are existing lists', () => {
      it('should append to the array', () => {
        const lists = createList([
          { id: 1, title: 'first list', tracks: [] },
          { id: 2, title: 'second list', tracks: [] },
        ]);
        expect(lists).toEqual([
          { id: 1, title: 'first list', tracks: [] },
          { id: 2, title: 'second list', tracks: [] },
          { id: 3, active: true, editing: true, title: 'New List', tracks: [] },
        ]);
      });
    });
  });

  describe('updateListTitle', () => {
    it('should update the specified list with the new title', () => {
      const lists = updateListTitle(
        [
          { id: 1, title: 'first list', tracks: [] },
          { id: 2, title: 'second list', tracks: [] },
          { id: 3, title: 'third list', tracks: [] },
        ],
        { payload: { id: 2, title: 'definitely a new title' } },
      );
      expect(lists).toEqual([
        { id: 1, title: 'first list', tracks: [] },
        { id: 2, title: 'definitely a new title', tracks: [] },
        { id: 3, title: 'third list', tracks: [] },
      ]);
    });
  });

  describe('deleteList', () => {
    it('should delete the expected list and reorder IDs', () => {
      const lists = deleteList(
        [
          { id: 1, title: 'first list', tracks: [] },
          { id: 2, title: 'second list', tracks: [] },
          { id: 3, title: 'third list', tracks: [] },
        ],
        { type: 'deleteList', payload: { id: 2 } },
      );
      expect(lists).toEqual([
        { id: 1, title: 'first list', tracks: [] },
        { id: 2, title: 'third list', tracks: [] },
      ]);
    });
  });

  describe('editList', () => {
    it('should store the title value and set the editing flag', () => {
      const lists = editList(
        [
          { id: 1, title: 'first list', tracks: [] },
          { id: 2, title: 'second list', tracks: [] },
          { id: 3, title: 'third list', tracks: [] },
        ],
        { type: 'editList', payload: { id: 2 } },
      );
      expect(lists).toEqual([
        { id: 1, title: 'first list', tracks: [] },
        { id: 2, title: 'second list', oldTitle: 'second list', editing: true, tracks: [] },
        { id: 3, title: 'third list', tracks: [] },
      ]);
    });
  });

  describe('finishEditList', () => {
    it('should delete the old title value and editing flag', () => {
      const lists = finishEditList([
        { id: 1, title: 'first list', tracks: [] },
        { id: 2, title: 'this second list has been edited', oldTitle: 'second list', editing: true, tracks: [] },
        { id: 3, title: 'third list', tracks: [] },
      ]);
      expect(lists).toEqual([
        { id: 1, title: 'first list', tracks: [] },
        { id: 2, title: 'this second list has been edited', tracks: [] },
        { id: 3, title: 'third list', tracks: [] },
      ]);
    });
  });

  describe('revertEditList', () => {
    it('should revert to the state before the edit', () => {
      const lists = revertEditList([
        { id: 1, title: 'first list', tracks: [] },
        { id: 2, title: 'this second list has been edited', oldTitle: 'second list', editing: true, tracks: [] },
        { id: 3, title: 'third list', tracks: [] },
      ]);
      expect(lists).toEqual([
        { id: 1, title: 'first list', tracks: [] },
        { id: 2, title: 'second list', tracks: [] },
        { id: 3, title: 'third list', tracks: [] },
      ]);
    });

    it('should revert to the initial state when no previous title exists', () => {
      const lists = revertEditList([
        { id: 1, title: 'first list', tracks: [] },
        { id: 2, title: 'this second list has been edited', editing: true, tracks: [] },
        { id: 3, title: 'third list', tracks: [] },
      ]);
      expect(lists).toEqual([
        { id: 1, title: 'first list', tracks: [] },
        { id: 2, title: 'New List', tracks: [] },
        { id: 3, title: 'third list', tracks: [] },
      ]);
    });
  });

  describe('moveTrackUp', () => {
    it('should move a track up', () => {
      const lists = moveTrackUp(
        [
          { id: 1, title: 'first list', active: true, tracks: [1, 2, 3] },
          { id: 2, title: 'second list', tracks: [] },
          { id: 3, title: 'third list', tracks: [] },
        ],
        { payload: { trackId: 3 } },
      );
      expect(lists).toEqual([
        { id: 1, title: 'first list', active: true, tracks: [1, 3, 2] },
        { id: 2, title: 'second list', tracks: [] },
        { id: 3, title: 'third list', tracks: [] },
      ]);
    });

    it('should handle a non-existent track and return the existing order', () => {
      const lists = moveTrackUp(
        [
          { id: 1, title: 'first list', active: true, tracks: [1, 2, 3] },
          { id: 2, title: 'second list', tracks: [] },
          { id: 3, title: 'third list', tracks: [] },
        ],
        { payload: { trackId: 5 } },
      );
      expect(lists).toEqual([
        { id: 1, title: 'first list', active: true, tracks: [1, 2, 3] },
        { id: 2, title: 'second list', tracks: [] },
        { id: 3, title: 'third list', tracks: [] },
      ]);
    });
  });

  describe('moveTrackDown', () => {
    it('should move a track down', () => {
      const lists = moveTrackDown(
        [
          { id: 1, title: 'first list', active: true, tracks: [1, 2, 3] },
          { id: 2, title: 'second list', tracks: [] },
          { id: 3, title: 'third list', tracks: [] },
        ],
        { payload: { trackId: 1 } },
      );
      expect(lists).toEqual([
        { id: 1, title: 'first list', active: true, tracks: [2, 1, 3] },
        { id: 2, title: 'second list', tracks: [] },
        { id: 3, title: 'third list', tracks: [] },
      ]);
    });

    it('should handle a non-existent track and return the existing order', () => {
      const lists = moveTrackDown(
        [
          { id: 1, title: 'first list', active: true, tracks: [1, 2, 3] },
          { id: 2, title: 'second list', tracks: [] },
          { id: 3, title: 'third list', tracks: [] },
        ],
        { payload: { trackId: 5 } },
      );
      expect(lists).toEqual([
        { id: 1, title: 'first list', active: true, tracks: [1, 2, 3] },
        { id: 2, title: 'second list', tracks: [] },
        { id: 3, title: 'third list', tracks: [] },
      ]);
    });
  });

  describe('addTrackToSelectedList', () => {
    it('should add a track to the selected list', () => {
      const lists = addTrackToSelectedList(
        [
          { id: 1, title: 'first list', active: true, tracks: [1, 2, 3] },
          { id: 2, title: 'second list', tracks: [] },
          { id: 3, title: 'third list', tracks: [] },
        ],
        { payload: { trackId: 5 } },
      );
      expect(lists).toEqual([
        { id: 1, title: 'first list', active: true, tracks: [1, 2, 3, 5] },
        { id: 2, title: 'second list', tracks: [] },
        { id: 3, title: 'third list', tracks: [] },
      ]);
    });
  });

  describe('removeTrackFromSelectedList', () => {
    it('should add a track to the selected list', () => {
      const lists = removeTrackFromSelectedList(
        [
          { id: 1, title: 'first list', active: true, tracks: [1, 2, 3] },
          { id: 2, title: 'second list', tracks: [] },
          { id: 3, title: 'third list', tracks: [] },
        ],
        { payload: { trackId: 2 } },
      );
      expect(lists).toEqual([
        { id: 1, title: 'first list', active: true, tracks: [1, 3] },
        { id: 2, title: 'second list', tracks: [] },
        { id: 3, title: 'third list', tracks: [] },
      ]);
    });
  });

  describe('trackIsOnSelectedList', () => {
    it('should return true when a track is on the selected list', () => {
      const isOnListSelector = trackIsOnSelectedList({ trackId: 2 });
      const isOnList = isOnListSelector({
        embed: { isPlaying: false },
        tracks: [],
        browsers: [],
        lists: [
          { id: 1, title: 'first list', active: true, tracks: [1, 2, 3] },
          { id: 2, title: 'second list', tracks: [] },
          { id: 3, title: 'third list', tracks: [] },
        ],
        settings: {
          darkModeEnabled: false,
          autoplayEnabled: true,
          trackPreviewEmbedSize: 'small',
        },
      });
      expect(isOnList).toEqual(true);
    });

    it('should return false when a track is not on the selected list', () => {
      const isOnListSelector = trackIsOnSelectedList({ trackId: 5 });
      const isOnList = isOnListSelector({
        embed: { isPlaying: false },
        tracks: [],
        browsers: [],
        lists: [
          { id: 1, title: 'first list', active: true, tracks: [1, 2, 3] },
          { id: 2, title: 'second list', tracks: [] },
          { id: 3, title: 'third list', tracks: [] },
        ],
        settings: {
          darkModeEnabled: false,
          autoplayEnabled: true,
          trackPreviewEmbedSize: 'small',
        },
      });
      expect(isOnList).toEqual(false);
    });
  });

  describe('getNextTrackOnList', () => {
    it('should return the next track on a list', () => {
      const nextTrackSelector = getNextTrackOnList({ id: 1, currentTrackId: 2 });
      const nextTrack = nextTrackSelector({
        embed: { isPlaying: false },
        tracks: [],
        browsers: [],
        lists: [
          { id: 1, title: 'first list', active: true, tracks: [1, 2, 3] },
          { id: 2, title: 'second list', tracks: [] },
          { id: 3, title: 'third list', tracks: [] },
        ],
        settings: {
          darkModeEnabled: false,
          autoplayEnabled: true,
          trackPreviewEmbedSize: 'small',
        },
      });
      expect(nextTrack).toEqual(3);
    });

    it('should return the next track on an unselected list', () => {
      const nextTrackSelector = getNextTrackOnList({ id: 1, currentTrackId: 2 });
      const nextTrack = nextTrackSelector({
        embed: { isPlaying: false },
        tracks: [],
        browsers: [],
        lists: [
          { id: 1, title: 'first list', tracks: [1, 2, 3] },
          { id: 2, title: 'second list', active: true, tracks: [] },
          { id: 3, title: 'third list', tracks: [] },
        ],
        settings: {
          darkModeEnabled: false,
          autoplayEnabled: true,
          trackPreviewEmbedSize: 'small',
        },
      });
      expect(nextTrack).toEqual(3);
    });

    it('should return the first track when the current track is not on the list', () => {
      const nextTrackSelector = getNextTrackOnList({ id: 1, currentTrackId: 5 });
      const nextTrack = nextTrackSelector({
        embed: { isPlaying: false },
        tracks: [],
        browsers: [],
        lists: [
          { id: 1, title: 'first list', active: true, tracks: [1, 2, 3] },
          { id: 2, title: 'second list', tracks: [] },
          { id: 3, title: 'third list', tracks: [] },
        ],
        settings: {
          darkModeEnabled: false,
          autoplayEnabled: true,
          trackPreviewEmbedSize: 'small',
        },
      });
      expect(nextTrack).toEqual(1);
    });

    it('should return undefined when there is no next track', () => {
      const nextTrackSelector = getNextTrackOnList({ id: 1, currentTrackId: 3 });
      const nextTrack = nextTrackSelector({
        embed: { isPlaying: false },
        tracks: [],
        browsers: [],
        lists: [
          { id: 1, title: 'first list', active: true, tracks: [1, 2, 3] },
          { id: 2, title: 'second list', tracks: [] },
          { id: 3, title: 'third list', tracks: [] },
        ],
        settings: {
          darkModeEnabled: false,
          autoplayEnabled: true,
          trackPreviewEmbedSize: 'small',
        },
      });
      expect(nextTrack).toEqual(undefined);
    });
  });
});
