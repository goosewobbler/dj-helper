import { configureStore, StoreEnhancer } from '@reduxjs/toolkit';
import { rootReducer } from '../features/rootReducer';
import { AppState } from './types';

export function createReduxStore(preloadedState: AppState, syncFn: StoreEnhancer<{}, {}>) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
    enhancers: [syncFn],
  });

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('../features/rootReducer', () => store.replaceReducer(rootReducer));
  }

  return store;
}
