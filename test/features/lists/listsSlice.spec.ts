import { expect, describe, it } from 'vitest';
import { reducers, trackIsOnActiveList, getNextTrackOnList } from '../../../src/features/lists/listsSlice';
import { mockState } from '../../helpers/mockState';

const {
  createList,
  deleteList,
  updateListTitle,
  editList,
  finishEditList,
  revertEditList,
  addTrackToActiveList,
  removeTrackFromActiveList,
} = reducers;

function getState(activeListIndex: number) {
  const lists = [
    { id: 0, title: 'first list', active: false, tracks: [0, 1, 2] },
    { id: 1, title: 'second list', active: false, tracks: [] },
    { id: 2, title: 'third list', active: false, tracks: [] },
  ];
  lists[activeListIndex].active = true;

  return mockState({ lists });
}

describe('listsSlice', () => {
  describe('createList', () => {
    it('should create a new list with the expected values', () => {
      const lists = createList([]);
      expect(lists).toEqual([{ id: 0, active: true, editing: true, title: 'New List', tracks: [] }]);
    });

    describe('when there are existing lists', () => {
      it('should append to the array', () => {
        const lists = createList([
          { id: 0, title: 'first list', tracks: [] },
          { id: 1, title: 'second list', tracks: [] },
        ]);
        expect(lists).toEqual([
          { id: 0, active: false, title: 'first list', tracks: [] },
          { id: 1, active: false, title: 'second list', tracks: [] },
          { id: 2, active: true, editing: true, title: 'New List', tracks: [] },
        ]);
      });

      it('should mark existing active lists as inactive', () => {
        const lists = createList([
          { id: 0, title: 'first list', tracks: [] },
          { id: 1, active: true, title: 'second list', tracks: [] },
        ]);
        expect(lists).toEqual([
          { id: 0, active: false, title: 'first list', tracks: [] },
          { id: 1, active: false, title: 'second list', tracks: [] },
          { id: 2, active: true, editing: true, title: 'New List', tracks: [] },
        ]);
      });
    });
  });

  describe('updateListTitle', () => {
    it('should update the specified list with the new title', () => {
      const lists = updateListTitle(
        [
          { id: 0, title: 'first list', tracks: [] },
          { id: 1, title: 'second list', tracks: [] },
          { id: 2, title: 'third list', tracks: [] },
        ],
        { payload: { id: 1, title: 'definitely a new title' } },
      );
      expect(lists).toEqual([
        { id: 0, title: 'first list', tracks: [] },
        { id: 1, title: 'definitely a new title', tracks: [] },
        { id: 2, title: 'third list', tracks: [] },
      ]);
    });
  });

  describe('deleteList', () => {
    it('should delete the expected list and reorder IDs', () => {
      const lists = deleteList(
        [
          { id: 0, title: 'first list', tracks: [] },
          { id: 1, title: 'second list', tracks: [] },
          { id: 2, title: 'third list', tracks: [] },
        ],
        { type: 'deleteList', payload: { id: 1 } },
      );
      expect(lists).toEqual([
        { id: 0, title: 'first list', tracks: [] },
        { id: 1, title: 'third list', tracks: [] },
      ]);
    });
  });

  describe('editList', () => {
    it('should store the title value and set the editing flag', () => {
      const lists = editList(
        [
          { id: 0, title: 'first list', tracks: [] },
          { id: 1, title: 'second list', tracks: [] },
          { id: 2, title: 'third list', tracks: [] },
        ],
        { type: 'editList', payload: { id: 1 } },
      );
      expect(lists).toEqual([
        { id: 0, title: 'first list', tracks: [] },
        { id: 1, title: 'second list', oldTitle: 'second list', editing: true, tracks: [] },
        { id: 2, title: 'third list', tracks: [] },
      ]);
    });
  });

  describe('finishEditList', () => {
    it('should delete the old title value and editing flag', () => {
      const lists = finishEditList([
        { id: 0, title: 'first list', tracks: [] },
        { id: 1, title: 'this second list has been edited', oldTitle: 'second list', editing: true, tracks: [] },
        { id: 2, title: 'third list', tracks: [] },
      ]);
      expect(lists).toEqual([
        { id: 0, title: 'first list', tracks: [] },
        { id: 1, title: 'this second list has been edited', tracks: [] },
        { id: 2, title: 'third list', tracks: [] },
      ]);
    });
  });

  describe('revertEditList', () => {
    it('should revert to the state before the edit', () => {
      const lists = revertEditList([
        { id: 0, title: 'first list', tracks: [] },
        { id: 1, title: 'this second list has been edited', oldTitle: 'second list', editing: true, tracks: [] },
        { id: 2, title: 'third list', tracks: [] },
      ]);
      expect(lists).toEqual([
        { id: 0, title: 'first list', tracks: [] },
        { id: 1, title: 'second list', tracks: [] },
        { id: 2, title: 'third list', tracks: [] },
      ]);
    });

    it('should revert to the initial state when no previous title exists', () => {
      const lists = revertEditList([
        { id: 0, title: 'first list', tracks: [] },
        { id: 1, title: 'this second list has been edited', editing: true, tracks: [] },
        { id: 2, title: 'third list', tracks: [] },
      ]);
      expect(lists).toEqual([
        { id: 0, title: 'first list', tracks: [] },
        { id: 1, title: 'New List', tracks: [] },
        { id: 2, title: 'third list', tracks: [] },
      ]);
    });
  });

  describe('addTrackToSelectedList', () => {
    it('should add a track to the selected list', () => {
      const lists = addTrackToActiveList(
        [
          { id: 0, title: 'first list', active: true, tracks: [0, 1, 2] },
          { id: 1, title: 'second list', tracks: [] },
          { id: 2, title: 'third list', tracks: [] },
        ],
        { payload: { trackId: 4 } },
      );
      expect(lists).toEqual([
        { id: 0, title: 'first list', active: true, tracks: [0, 1, 2, 4] },
        { id: 1, title: 'second list', tracks: [] },
        { id: 2, title: 'third list', tracks: [] },
      ]);
    });
  });

  describe('removeTrackFromSelectedList', () => {
    it('should add a track to the selected list', () => {
      const lists = removeTrackFromActiveList(
        [
          { id: 0, title: 'first list', active: true, tracks: [0, 1, 2] },
          { id: 1, title: 'second list', tracks: [] },
          { id: 2, title: 'third list', tracks: [] },
        ],
        { payload: { trackId: 1 } },
      );
      expect(lists).toEqual([
        { id: 0, title: 'first list', active: true, tracks: [0, 2] },
        { id: 1, title: 'second list', tracks: [] },
        { id: 2, title: 'third list', tracks: [] },
      ]);
    });
  });

  describe('selectors', () => {
    describe('trackIsOnSelectedList', () => {
      it('should return true when a track is on the selected list', () => {
        const isOnListSelector = trackIsOnActiveList({ trackId: 2 });
        const isOnList = isOnListSelector(getState(0));
        expect(isOnList).toEqual(true);
      });

      it('should return false when a track is not on the selected list', () => {
        const isOnListSelector = trackIsOnActiveList({ trackId: 5 });
        const isOnList = isOnListSelector(getState(1));
        expect(isOnList).toEqual(false);
      });
    });

    describe('getNextTrackOnList', () => {
      it('should return the next track on a list', () => {
        const nextTrackSelector = getNextTrackOnList({ id: 0, currentTrackId: 1 });
        const nextTrack = nextTrackSelector(getState(0));
        expect(nextTrack).toEqual(2);
      });

      it('should return the next track on an unselected list', () => {
        const nextTrackSelector = getNextTrackOnList({ id: 0, currentTrackId: 1 });
        const nextTrack = nextTrackSelector(getState(0));
        expect(nextTrack).toEqual(2);
      });

      it('should return the first track when the current track is not on the list', () => {
        const nextTrackSelector = getNextTrackOnList({ id: 0, currentTrackId: 5 });
        const nextTrack = nextTrackSelector(getState(0));
        expect(nextTrack).toEqual(0);
      });

      it('should return undefined when there is no next track', () => {
        const nextTrackSelector = getNextTrackOnList({ id: 0, currentTrackId: 2 });
        const nextTrack = nextTrackSelector(getState(0));
        expect(nextTrack).toEqual(undefined);
      });
    });
  });
});
