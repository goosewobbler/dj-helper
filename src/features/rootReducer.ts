import { combineReducers } from '@reduxjs/toolkit';
import { embedReducer } from './embed/embedSlice';
import { listsReducer } from './lists/listsSlice';
import { tracksReducer } from './tracks/tracksSlice';
import { browsersReducer } from './browsers/browsersSlice';
import { settingsReducer } from './settings/settingsSlice';

export const rootReducer = combineReducers({
  embed: embedReducer,
  lists: listsReducer,
  tracks: tracksReducer,
  browsers: browsersReducer,
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
