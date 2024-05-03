import ElectronStore from 'electron-store';
import { StoreApi, createStore as createZustandStore } from 'zustand/vanilla';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createDispatch } from 'zutron/main';
import { Dispatch } from 'zutron';

import { AppState } from '../../common/types.js';
import { initialState as initialBrowsersState } from '../../features/browsers/index.js';
import { initialState as initialEmbedState } from '../../features/embed/index.js';
import { initialState as initialListsState } from '../../features/lists/index.js';
import { initialState as initialTracksState } from '../../features/tracks/index.js';
import { initialState as initialUiState } from '../../features/ui/index.js';
import { getHandlers } from '../../features/index.js';
import { log } from '../helpers/console.js';

function createElectronStorage() {
  const store = new ElectronStore<AppState>({});

  log(`loading config from ${store.path}...`);

  return {
    getItem: (key: string) => Promise.resolve(store.get(key) as string),
    setItem: (key: string, item: string) => Promise.resolve(store.set(key, item)),
    removeItem: (key: string) => Promise.resolve(store.delete(key)),
    getAllKeys: () => Promise.resolve([]),
  };
}

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
  store = createZustandStore<AppState>()(
    persist(() => initialState, {
      name: 'dj-helper',
      storage: createJSONStorage(() => createElectronStorage()),
      onRehydrateStorage: () => async (state: AppState | undefined) => {
        // dispatch(initEmbed());
        await window.api.invoke('update-window-bounds');
        await window.api.invoke('init-browsers');
      },
    }),
  );
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
