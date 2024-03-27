import { Dispatch, Tuple, Middleware, UnknownAction, configureStore } from '@reduxjs/toolkit';

import { RootState, Action, Store, rootReducer } from '../../features/rootReducer.js';
import { devToolsEnhancer } from './devToolsEnhancers.js';
import { loggerMiddleware } from './loggerMiddleware.js';

export const store: Store = configureStore<RootState, Action>({
  reducer: rootReducer,
  middleware: () => new Tuple(loggerMiddleware),
  enhancers: () => new Tuple(devToolsEnhancer),
});
