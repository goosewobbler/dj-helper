import { configureStore, StoreEnhancer, Store } from '@reduxjs/toolkit';
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
import ElectronStore from 'electron-store';
import { rootReducer, storeHydrated } from '../features/rootReducer';
import { AnyObject, AppStore } from './types';
import { log } from '../main/helpers/console';

function createElectronStorage() {
  const store = new ElectronStore({});

  log(`loading config from ${store.path}...`);

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
}: {
  context: string;
  syncFn: StoreEnhancer<AnyObject, AnyObject>;
}): Promise<Store> {
  return new Promise((resolve) => {
    const enhancers = [syncFn];
    let store: Store;
    if (context === 'main') {
      offlineConfig.persistOptions = { storage: createElectronStorage() };
    } else {
      offlineConfig.persistCallback = () => {
        (store as AppStore).dispatch(storeHydrated());
        resolve(store);
      };
    }
    enhancers.push(offline(offlineConfig) as StoreEnhancer);

    store = configureStore({
      reducer: rootReducer,
      enhancers: (getDefaultEnhancers) =>
        getDefaultEnhancers({
          autoBatch: { type: 'tick' },
        }).concat(enhancers),
    });

    if (process.env.NODE_ENV !== 'production' && module.hot) {
      module.hot.accept('../features/rootReducer', () => store.replaceReducer(rootReducer));
    }

    if (context === 'main') {
      resolve(store);
    }
  });
}
