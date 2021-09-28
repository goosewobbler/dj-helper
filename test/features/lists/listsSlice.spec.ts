import { reducers } from '../../../src/features/lists/listsSlice';

const {
  createList,
  deleteList,
  updateListTitle,
  editList,
  finishEditList,
  revertEditList,
  moveTrackUp,
  moveTrackDown,
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
  });
});
