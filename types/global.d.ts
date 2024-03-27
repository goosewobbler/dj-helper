declare module '*/tailwind.config';

import type { PreloadZustandBridgeReturn } from 'zutron/preload';
import type { RootState, Action } from '../src/features/rootReducer.js';

// import { Dispatch, AppState } from './types.js';

// export const useAppDispatch = () => useDispatch<Dispatch>();

declare global {
  interface Window {
    zutron: PreloadZustandBridgeReturn<RootState, void, Action>['handlers'];
  }
}

export {};
