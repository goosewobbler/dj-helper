import { combineReducers, Action } from '@reduxjs/toolkit';
import { embedReducer } from './embed/embedSlice';
import { listsReducer } from './lists/listsSlice';
import { tracksReducer } from './tracks/tracksSlice';
import { browsersReducer } from './browsers/browsersSlice';
import { settingsReducer } from './settings/settingsSlice';
import { statusReducer } from './status/statusSlice';
import { AppState } from '../common/types';

const combinedReducers = combineReducers({
  embed: embedReducer,
  lists: listsReducer,
  tracks: tracksReducer,
  browsers: browsersReducer,
  settings: settingsReducer,
  status: statusReducer,
});

export const resetStoreAction = { type: 'store/reset' };

export const rootReducer = (state: AppState | undefined, action: Action) => {
  if (action === resetStoreAction) {
    return combinedReducers(undefined, action);
  }
  return combinedReducers(state, action);
};

export type RootState = ReturnType<typeof combinedReducers>;
