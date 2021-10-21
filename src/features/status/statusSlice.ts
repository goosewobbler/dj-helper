import { createSlice } from '@reduxjs/toolkit';
import { Status } from '../../common/types';

const initialState = {
  statusText: '',
} as Status;

export const slice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    setStatus: (state, { payload: { statusText } }: { payload: { statusText: string } }) => ({
      ...state,
      statusText,
    }),
  },
});

export const { setStatus } = slice.actions;

export const statusReducer = slice.reducer;
