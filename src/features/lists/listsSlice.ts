import { createSlice } from '@reduxjs/toolkit';
import { AppState, List } from '../../common/types';

const listArray: List[] = [];

export const slice = createSlice({
  name: 'lists',
  initialState: listArray,
  reducers: {
    createList: (state) => {
      const newList: List = {
        id: state.length + 1,
        title: 'New List',
        tracks: [],
        editing: true,
      };
      state.push(newList);
    },
    editList: (state, { payload }) => {
      const listIndex = state.findIndex((list) => list.id === payload);
      if (listIndex > -1) {
        state[listIndex].editing = true;
        state[listIndex].oldTitle = state[listIndex].title;
      }
    },
    deleteList: (state, { payload }) => {
      const indexToRemove = state.findIndex((list) => list.id === payload);
      if (indexToRemove > -1) {
        // remove
        state.splice(indexToRemove, 1);
        // reorder ids
        state.slice(indexToRemove).forEach((list) => {
          list.id -= 1;
        });
      }
    },
    updateListTitle: (state, { payload: { id, title } }: { payload: { id: number; title: string } }) => {
      const listToUpdate = state.find((list) => list.id === id);
      if (listToUpdate) {
        listToUpdate.title = title;
      }
    },
    finishEditList: (state, { payload }) => {
      const listIndex = state.findIndex((list) => list.editing === true);
      if (listIndex > -1) {
        state[listIndex].editing = false;
        delete state[listIndex].oldTitle;
      }
    },
    revertEditList: (state, { payload }) => {
      const listIndex = state.findIndex((list) => list.id === payload);
      if (listIndex > -1) {
        state[listIndex].editing = false;
        state[listIndex].title = state[listIndex].oldTitle as string;
        delete state[listIndex].oldTitle;
      }
    },
  },
});

export const { createList, editList, deleteList, updateListTitle, revertEditList, finishEditList } = slice.actions;

export const selectLists = (state: AppState): List[] => state.lists;

export const listsReducer = slice.reducer;
