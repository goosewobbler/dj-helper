import {
  combineReducers,
  UnknownAction,
  Dispatch as BaseDispatch,
  Reducer,
  Observable,
  Action as BaseAction,
  ThunkAction,
} from '@reduxjs/toolkit';

import { embedReducer, handleInit as initEmbed } from './embed/embedSlice.js';
import { listsReducer } from './lists/listsSlice.js';
import { tracksReducer } from './tracks/tracksSlice.js';
import { browsersReducer } from './browsers/browsersSlice.js';
import { uiReducer } from './ui/uiSlice.js';
import { AppState, AppThunk } from '../common/types.js';

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

type ActionOrAnyAction = BaseAction | UnknownAction;

export type Dispatch = BaseDispatch<Action>;
export type Subscribe = (listener: () => void) => () => void;
export type Action = Exclude<ActionOrAnyAction, { type: '' }>;
export type RootState = ReturnType<typeof combinedReducers>;
export type Store = {
  getState: () => RootState;
  dispatch: Dispatch;
  subscribe: Subscribe;
  replaceReducer: (nextReducer: Reducer<RootState, Action>) => void;
  [Symbol.observable](): Observable<RootState>;
};

type MiddlewareStore = Pick<Store, 'getState' | 'dispatch'>;

export type Middleware<A extends ActionOrAnyAction = Action> = (
  store: MiddlewareStore,
) => (next: Dispatch) => (action: A) => Promise<Action>;
