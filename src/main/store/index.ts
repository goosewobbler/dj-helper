import { StoreApi, createStore as createZustandStore } from 'zustand/vanilla';
import { createDispatch } from 'zutron/main';
import { Dispatch } from 'zutron';

import { AppState } from '../../common/types.js';
import { initialState as initialBrowsersState } from '../../features/browsers/index.js';
import { initialState as initialEmbedState } from '../../features/embed/index.js';
import { initialState as initialListsState } from '../../features/lists/index.js';
import { initialState as initialTracksState } from '../../features/tracks/index.js';
import { initialState as initialUiState } from '../../features/ui/index.js';
import { getHandlers } from '../../features/index.js';

// TODO: read from persisted store

// export const storeHydrated = (): AppThunk => async (dispatch) => {
//   // uncomment to reset store
//   // dispatch(resetStoreAction);

//   dispatch(initEmbed());
//   await window.api.invoke('update-window-bounds');
//   await window.api.invoke('init-browsers');
// };

export const initialState = {
  browsers: initialBrowsersState,
  embed: initialEmbedState,
  lists: initialListsState,
  tracks: initialTracksState,
  ui: initialUiState,
};

let store: StoreApi<AppState>;
let dispatch: Dispatch<AppState>;

function init() {
  store = createZustandStore<AppState>()(() => initialState);
  dispatch = createDispatch(store, { handlers: getHandlers(store, initialState) });
}

export const getStore = () => {
  if (!store) {
    init();
  }
  return store;
};
export const getDispatch = () => {
  if (!dispatch) {
    init();
  }
  return dispatch;
};

// dispatch for main process
// export const dispatch = createDispatch(store, { handlers: getHandlers(store, initialState) });

// import { configureStore, StoreEnhancer, Store } from '@reduxjs/toolkit';
// import { offline } from '@redux-offline/redux-offline';
// import offlineConfig from '@redux-offline/redux-offline/lib/defaults';
// import ElectronStore from 'electron-store';

// import { rootReducer, storeHydrated } from '../features/index.js';
// import { AnyObject, AppStore } from './types.js';
// import { log } from '../main/helpers/console.js';
// import { ViteHotContext } from 'vite/types/hot.js';

// interface ImportMeta {
//   readonly hot?: ViteHotContext;
// }

// function createElectronStorage() {
//   const store = new ElectronStore({});

//   log(`loading config from ${store.path}...`);

//   return {
//     getItem: (key: string) => Promise.resolve(store.get(key)),
//     setItem: (key: string, item: string) => Promise.resolve(store.set(key, item)),
//     removeItem: (key: string) => Promise.resolve(store.delete(key)),
//     getAllKeys: () => Promise.resolve([]),
//   };
// }

// export function createReduxStore({
//   context,
//   //  syncFn,
// }: {
//   context: string;
//   //  syncFn: StoreEnhancer<AnyObject, AnyObject>;
// }): Promise<Store> {
//   return new Promise((resolve) => {
//     const enhancers: StoreEnhancer[] = []; // [syncFn];
//     let store: Store;
//     if (context === 'main') {
//       offlineConfig.persistOptions = { storage: createElectronStorage() };
//     } else {
//       offlineConfig.persistCallback = () => {
//         (store as AppStore).dispatch(storeHydrated());
//         resolve(store);
//       };
//     }
//     enhancers.push(offline(offlineConfig) as StoreEnhancer);

//     store = configureStore({
//       reducer: rootReducer,
//       enhancers: (getDefaultEnhancers) =>
//         getDefaultEnhancers({
//           autoBatch: { type: 'tick' },
//         }).concat(enhancers),
//     });

//     const hot = (import.meta as ImportMeta)?.hot;

//     if (process.env.NODE_ENV !== 'production' && hot) {
//       hot.accept('../features/rootReducer', () => store.replaceReducer(rootReducer));
//     }

//     if (context === 'main') {
//       resolve(store);
//     }
//   });
// }
