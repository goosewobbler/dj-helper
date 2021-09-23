import { combineReducers } from '@reduxjs/toolkit';
import { embedReducer } from './embed/embedSlice';
import { listsReducer } from './lists/listsSlice';
import { tracksReducer } from './tracks/tracksSlice';
import { browsersReducer } from './browsers/browsersSlice';
// import { trackSourcesReducer } from './trackSources/trackSourcesSlice';

export const rootReducer = combineReducers({
  embed: embedReducer,
  lists: listsReducer,
  tracks: tracksReducer,
  browsers: browsersReducer,
  // trackSources: trackSourcesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
