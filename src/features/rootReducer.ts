import { combineReducers } from '@reduxjs/toolkit';
import { listsReducer } from './lists/listsSlice';
// import { tracksReducer } from './tracks/tracksSlice';
// import { trackSourcesReducer } from './trackSources/trackSourcesSlice';

export const rootReducer = combineReducers({
  lists: listsReducer,
  // tracks: tracksReducer,
  // trackSources: trackSourcesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
