import { createSlice } from '@reduxjs/toolkit';
import { Status } from '../../common/types';

const initialState = {
  resizing: false,
} as Status;

export const slice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setResizing: (state) => ({
      ...state,
      resizing: true,
    }),
    resizeComplete: (state) => ({
      ...state,
      resizing: false,
    }),
  },
});

export const { setResizing, resizeComplete } = slice.actions;

export const statusReducer = slice.reducer;
