import { combineReducers, Action } from '@reduxjs/toolkit';
import { embedReducer, handleInit as initEmbed } from './embed/embedSlice';
import { listsReducer } from './lists/listsSlice';
import { tracksReducer } from './tracks/tracksSlice';
import { browsersReducer } from './browsers/browsersSlice';
import { uiReducer } from './ui/uiSlice';
import { AppState, AppThunk } from '../common/types';

const combinedReducers = combineReducers({
  embed: embedReducer,
  lists: listsReducer,
  tracks: tracksReducer,
  browsers: browsersReducer,
  ui: uiReducer,
});

export const resetStoreAction = { type: 'store/reset' };

export const storeHydrated = (): AppThunk => async (dispatch) => {
  // uncomment to reset store
  // dispatch(resetStoreAction);

  dispatch(initEmbed());
  await window.api.invoke('update-window-bounds');
  await window.api.invoke('init-browsers');
};

export const rootReducer = (state: AppState | undefined, action: Action) => {
  if (action === resetStoreAction) {
    return combinedReducers(undefined, action);
  }
  return combinedReducers(state, action);
};

export type RootState = ReturnType<typeof combinedReducers>;
