import { createSlice } from '@reduxjs/toolkit';
import { AppState, List } from '../../common/types';

const initialListTitle = 'New List';

export const initialState: List[] = [];

export const slice = createSlice({
  name: 'lists',
  initialState,
  reducers: {
    createList: (state) => {
      const newList: List = {
        id: state.length + 1,
        title: initialListTitle,
        tracks: [],
        editing: true,
        active: true,
      };
      return [...state, newList];
    },
    updateListTitle: (state, { payload: { id, title } }: { payload: { id: number; title: string } }) =>
      state.map((list) => (list.id === id ? { ...list, title } : list)),
    deleteList: (state, { payload: { id } }) =>
      state.filter((list) => list.id !== id).map((list, index) => ({ ...list, id: index + 1 })),
    editList: (state, { payload: { id } }) =>
      state.map((list) => (list.id === id ? { ...list, editing: true, oldTitle: list.title } : list)),
    finishEditList: (state) =>
      state.map((list) => (list.editing === true ? { ...list, editing: undefined, oldTitle: undefined } : list)),
    revertEditList: (state) =>
      state.map((list) =>
        list.editing === true
          ? { ...list, editing: undefined, title: list.oldTitle ?? initialListTitle, oldTitle: undefined }
          : list,
      ),
    selectList: (state, { payload: { id } }: { payload: { id: number } }) =>
      state.map((list) => (list.id === id ? { ...list, active: true } : { ...list, active: false })),
    addTrackToSelectedList: (state, { payload: { trackId } }: { payload: { trackId: number } }) =>
      state.map((list) => (list.active ? { ...list, tracks: [...list.tracks, trackId] } : list)),
  },
});

export const {
  createList,
  deleteList,
  updateListTitle,
  editList,
  revertEditList,
  finishEditList,
  selectList,
  addTrackToSelectedList,
} = slice.actions;

export const selectLists = (state: AppState): List[] => state.lists;

export const selectListById =
  (id: number) =>
  (state: AppState): List =>
    state.lists.find((list) => list.id === id) as List;

export const listsReducer = slice.reducer;

export const reducers = slice.caseReducers;
