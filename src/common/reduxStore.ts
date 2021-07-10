import { configureStore, StoreEnhancer, Store } from '@reduxjs/toolkit';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import ElectronStore from 'electron-store';
import { rootReducer } from '../features/rootReducer';
import { AnyObject } from './types';

function createElectronStorage() {
  const store = new ElectronStore({});

  return {
    getItem: (key: string) => Promise.resolve(store.get(key)),
    setItem: (key: string, item: string) => Promise.resolve(store.set(key, item)),
    removeItem: (key: string) => Promise.resolve(store.delete(key)),
    getAllKeys: () => Promise.resolve([]),
  };
}

export function createReduxStore({
  context,
  syncFn,
  persistCallback,
}: {
  context: string;
  syncFn: StoreEnhancer<AnyObject, AnyObject>;
  persistCallback: () => void;
}): Store {
  const enhancers = [syncFn];
  if (context === 'main') {
    offlineConfig.persistOptions = { storage: createElectronStorage() };
  }
  offlineConfig.persistCallback = () => {
    persistCallback();
  };
  enhancers.push(offline(offlineConfig) as StoreEnhancer);

  const store = configureStore({
    reducer: rootReducer,
    enhancers,
  });

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('../features/rootReducer', () => store.replaceReducer(rootReducer));
  }

  return store;
}
