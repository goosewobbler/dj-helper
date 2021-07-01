import { createSlice } from '@reduxjs/toolkit';
import { AppState, Dispatch, List } from '../../common/types';

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
      };
      state.push(newList);
    },
    deleteList: (state, { payload }) => {
      const indexToRemove = state.findIndex((list) => list.id === payload);
      if (indexToRemove > -1) {
        state.splice(indexToRemove, 1);
      }
    },
    updateListTitle: (state, { payload: { id, title } }) => {
      const listToUpdate = state.find((list) => list.id === id);
      if (listToUpdate) {
        listToUpdate.title = title;
      }
    },
  },
});

export const { createList, deleteList, updateListTitle } = slice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const updateListTitleAsync = (id: number, title: string) => (dispatch: Dispatch) => {
  setTimeout(() => {
    dispatch(updateListTitle({ id, title }));
  }, 1000);
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectLists = (state: AppState) =>
  state.lists.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));

export const listsReducer = slice.reducer;
