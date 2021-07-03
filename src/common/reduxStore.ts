import { configureStore, StoreEnhancer, Store } from '@reduxjs/toolkit';
import { rootReducer } from '../features/rootReducer';
import { AnyObject, AppState } from './types';

export function createReduxStore(preloadedState: AppState, syncFn: StoreEnhancer<AnyObject, AnyObject>): Store {
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
